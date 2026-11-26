import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Shared Gemini client (server-side only) using v1beta for TTS speechConfig & speechMetadata
function createGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    apiVersion: 'v1beta',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * Ensures returned base64 audio is a valid browser-playable WAV.
 * Unary gemini-3.8-flash-lite-tts returns a complete RIFF WAV; if raw PCM (L16)
 * is ever returned, prepends a standard 44-byte 24kHz mono 16-bit WAV header.
 */
function ensureWavBase64(base64Audio: string, mimeType?: string): string {
  const raw = Buffer.from(base64Audio, 'base64');
  const hasRiffHeader =
    raw.length >= 12 &&
    raw.toString('ascii', 0, 4) === 'RIFF' &&
    raw.toString('ascii', 8, 12) === 'WAVE';

  if (hasRiffHeader || (mimeType && mimeType.toLowerCase().includes('wav'))) {
    return base64Audio;
  }

  // Extract sample rate if specified in mimeType (e.g. audio/L16;codec=pcm;rate=24000)
  const rateMatch = mimeType?.match(/rate=(\d+)/i);
  const sampleRate = rateMatch ? Number(rateMatch[1]) : 24000;
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;

  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + raw.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // PCM chunk size
  header.writeUInt16LE(1, 20); // PCM format
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(raw.length, 40);

  return Buffer.concat([header, raw]).toString('base64');
}

// Server-side in-memory WAV cache to avoid redundant API calls across sessions
const ttsCache = new Map<string, string>();
const MAX_CACHE_ENTRIES = 160;

const STYLE_BY_MOOD: Record<string, string> = {
  cheerful:
    'Jovem contadora de histórias infantil brasileira, voz feminina doce, calorosa, sorridente e animada, falando em português do Brasil de forma clara e carinhosa com uma criança de 3 anos.',
  gentle:
    'Jovem contadora de histórias infantil brasileira, voz feminina meiga, calma, acolhedora e divertida, falando suavemente em português do Brasil com uma criança de 3 anos.',
  celebration:
    'Jovem contadora de histórias infantil brasileira, voz feminina muito alegre, festiva, doce e entusiasmada comemorando em português do Brasil com uma criança de 3 anos.',
};

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.post('/api/tts', async (req, res) => {
    const rawText = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
    const mood =
      typeof req.body?.mood === 'string' && req.body.mood in STYLE_BY_MOOD
        ? req.body.mood
        : 'cheerful';

    if (!rawText || rawText.length > 240) {
      res.status(400).json({ error: 'Texto inválido para narração.' });
      return;
    }

    const cacheKey = `${mood}::${rawText.toLowerCase()}`;
    const cached = ttsCache.get(cacheKey);
    if (cached) {
      res.json({ audioBase64: cached, mimeType: 'audio/wav', cached: true });
      return;
    }

    const ai = createGeminiClient();
    if (!ai) {
      res.status(503).json({ error: 'Serviço de voz Gemini indisponível no momento.' });
      return;
    }

    const ttsConfig = {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          // 'Kore' is a bright, warm, expressive young female voice ideal for children's storytelling
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    };

    try {
      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash-lite-tts',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: rawText,
                  speechMetadata: {
                    style: STYLE_BY_MOOD[mood],
                  },
                },
              ],
            },
          ],
          config: ttsConfig,
        });
      } catch (firstErr) {
        const msg = firstErr instanceof Error ? firstErr.message : '';
        if (msg.includes('speechMetadata')) {
          response = await ai.models.generateContent({
            model: 'gemini-3.8-flash-lite-tts',
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `Fale em português do Brasil com voz feminina jovem, doce, calorosa e animada de contadora de histórias infantil: ${rawText}`,
                  },
                ],
              },
            ],
            config: ttsConfig,
          });
        } else {
          throw firstErr;
        }
      }

      const inlineData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
      const base64Audio = inlineData?.data;

      if (!base64Audio) {
        res.status(502).json({ error: 'Áudio vazio retornado pelo modelo de voz.' });
        return;
      }

      const wavBase64 = ensureWavBase64(base64Audio, inlineData?.mimeType);

      if (ttsCache.size >= MAX_CACHE_ENTRIES) {
        const oldestKey = ttsCache.keys().next().value;
        if (oldestKey) ttsCache.delete(oldestKey);
      }
      ttsCache.set(cacheKey, wavBase64);

      res.json({ audioBase64: wavBase64, mimeType: 'audio/wav', cached: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('[TTS] Erro ao gerar áudio com Gemini TTS:', message);
      res.status(502).json({ error: 'Falha ao gerar voz com Gemini TTS.' });
    }
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Caillou: Dia de Brincar! rodando em http://0.0.0.0:${PORT}`);
  });
}

startServer();
