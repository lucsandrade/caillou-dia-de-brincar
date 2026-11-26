/**
 * Cheerful Web Audio API sound effects, gentle looping marimba soundtrack,
 * Gemini TTS storytelling voice with persistent IndexedDB + memory cache,
 * and smart neural pt-BR Web Speech API fallback.
 */

export type SpeechMood = 'cheerful' | 'gentle' | 'celebration';

const DB_NAME = 'caillou-tts-cache-v1';
const STORE_NAME = 'clips';

function openTtsDb(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !('indexedDB' in window)) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    try {
      const req = window.indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = window.atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private musicTimer: number | null = null;
  private musicNextNoteTime = 0;
  private musicStep = 0;
  private musicPlaying = false;
  private musicShouldPlay = false;
  private isSpeakingDuck = false;

  public sfxEnabled = true;
  public voiceEnabled = true;
  public musicVolume = 0.65; // 0 to 1

  // Voice playback & caching state
  private cachedWebVoice: SpeechSynthesisVoice | null = null;
  private dbPromise: Promise<IDBDatabase | null> | null = null;
  private memoryWavCache = new Map<string, ArrayBuffer>();
  private inFlightRequests = new Map<string, Promise<ArrayBuffer | null>>();
  private activeVoiceSource: AudioBufferSourceNode | null = null;
  private activeFallbackAudio: HTMLAudioElement | null = null;
  private speechToken = 0;
  private geminiUnavailableUntil = 0;
  private geminiConsecutiveErrors = 0;

  // Cheerful gentle storybook marimba/kalimba melody (C major pentatonic, 32 eighth-note steps)
  private readonly melodyNotes: (number | null)[] = [
    523.25, null, 659.25, 587.33, 523.25, null, 392.0, null,   // C5 - E5 D5 C5 - G4 -
    440.0, null, 523.25, null, 587.33, 659.25, 587.33, null,   // A4 - C5 - D5 E5 D5 -
    659.25, null, 783.99, 659.25, 587.33, null, 523.25, null,  // E5 - G5 E5 D5 - C5 -
    440.0, 523.25, 587.33, null, 523.25, null, null, null,     // A4 C5 D5 - C5 - - -
  ];

  // Warm soft bass pulse on downbeats (every 4 eighth-notes)
  private readonly bassNotes: (number | null)[] = [
    261.63, null, null, null, 196.0, null, null, null,   // C4 ... G3 ...
    220.0, null, null, null, 196.0, null, null, null,    // A3 ... G3 ...
    261.63, null, null, null, 196.0, null, null, null,   // C4 ... G3 ...
    174.61, null, 196.0, null, 261.63, null, null, null, // F3 . G3 . C4 ...
  ];

  constructor() {
    if (typeof window !== 'undefined') {
      this.dbPromise = openTtsDb();

      if ('speechSynthesis' in window) {
        const loadVoices = () => {
          const voices = window.speechSynthesis.getVoices();
          if (!voices.length) return;
          this.cachedWebVoice = this.pickBestPtBrVoice(voices);
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }

      const unlock = () => {
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
        if (this.musicShouldPlay && !this.musicPlaying && this.musicVolume > 0) {
          this.startMusic();
        }
      };
      window.addEventListener('pointerdown', unlock, { passive: true });
      window.addEventListener('keydown', unlock, { passive: true });
    }
  }

  /**
   * Smart neural/natural pt-BR voice priority selector for Web Speech API fallback.
   * Prioritizes Microsoft Francisca / Thalita and Google português do Brasil.
   */
  private pickBestPtBrVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
    const ptBr = voices.filter((v) => v.lang.toLowerCase().replace('_', '-') === 'pt-br');
    const ptAny = voices.filter((v) => v.lang.toLowerCase().startsWith('pt'));
    const pool = ptBr.length > 0 ? ptBr : ptAny;
    if (!pool.length) return null;

    const scoreVoice = (v: SpeechSynthesisVoice): number => {
      const name = v.name.toLowerCase();
      let score = 0;

      // Top priority: Microsoft Francisca / Thalita (Natural/Online) & Google português do Brasil
      if (name.includes('francisca')) score += 120;
      if (name.includes('thalita')) score += 118;
      if (name.includes('google') && (name.includes('português') || name.includes('brazil') || name.includes('brasil') || v.lang.toLowerCase() === 'pt-br')) {
        score += 115;
      }

      // Neural / Natural / Online expressive voices bonus
      if (name.includes('natural')) score += 45;
      if (name.includes('neural')) score += 40;
      if (name.includes('online')) score += 25;

      // Friendly Brazilian female voices on macOS / iOS / Android
      if (name.includes('luciana') || name.includes('fernanda') || name.includes('maria') || name.includes('yara')) {
        score += 65;
      }

      // Deprioritize robotic / male / eSpeak voices
      if (name.includes('espeak') || name.includes('daniel') || name.includes('antonio') || name.includes('ricardo') || name.includes('felipe')) {
        score -= 40;
      }

      if (v.lang.toLowerCase().replace('_', '-') === 'pt-br') score += 20;
      return score;
    };

    const sorted = [...pool].sort((a, b) => scoreVoice(b) - scoreVoice(a));
    return sorted[0] ?? null;
  }

  private ensureAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioCtx =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    if (!this.musicGain && this.ctx) {
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.computeMusicGain(this.musicVolume), this.ctx.currentTime);
      this.musicGain.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  private getContext(): AudioContext | null {
    if (!this.sfxEnabled) return null;
    return this.ensureAudioContext();
  }

  private computeMusicGain(volume: number): number {
    const clamped = Math.max(0, Math.min(1, volume));
    const duckFactor = this.isSpeakingDuck ? 0.42 : 1;
    return clamped * 0.22 * duckFactor;
  }

  private updateMusicDucking(ducking: boolean) {
    if (this.isSpeakingDuck === ducking) return;
    this.isSpeakingDuck = ducking;
    if (this.ctx && this.musicGain && this.musicPlaying) {
      const now = this.ctx.currentTime;
      this.musicGain.gain.cancelScheduledValues(now);
      this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, now);
      this.musicGain.gain.linearRampToValueAtTime(
        this.computeMusicGain(this.musicVolume),
        now + (ducking ? 0.12 : 0.3),
      );
    }
  }

  /** Set ambient soundtrack volume (0 to 1) with smooth gain ramping */
  setMusicVolume(volume: number) {
    const clamped = Math.max(0, Math.min(1, Math.round(volume * 100) / 100));
    this.musicVolume = clamped;

    if (this.ctx && this.musicGain) {
      const now = this.ctx.currentTime;
      this.musicGain.gain.cancelScheduledValues(now);
      this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, now);
      this.musicGain.gain.linearRampToValueAtTime(this.computeMusicGain(clamped), now + 0.08);
    }

    if (clamped > 0 && this.musicShouldPlay && !this.musicPlaying) {
      this.startMusic();
    } else if (clamped === 0 && this.musicPlaying) {
      this.pauseMusicScheduler();
    }
  }

  /** Play a single soft marimba note preview (helpful when adjusting volume) */
  playMusicPreviewNote() {
    if (this.musicVolume <= 0) return;
    const ctx = this.ensureAudioContext();
    if (!ctx || !this.musicGain) return;
    this.scheduleMarimbaNote(ctx, 523.25, ctx.currentTime + 0.01, 0.28, 0.55);
  }

  /** Start cheerful ambient looping soundtrack during games */
  startMusic() {
    this.musicShouldPlay = true;
    if (this.musicVolume <= 0) return;

    const ctx = this.ensureAudioContext();
    if (!ctx || !this.musicGain) return;

    const now = ctx.currentTime;
    this.musicGain.gain.cancelScheduledValues(now);
    this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, now);
    this.musicGain.gain.linearRampToValueAtTime(this.computeMusicGain(this.musicVolume), now + 0.35);

    if (this.musicPlaying) return;

    this.musicPlaying = true;
    this.musicNextNoteTime = ctx.currentTime + 0.08;

    const stepDuration = 0.27; // ~111 BPM eighth-note pulse (relaxed, cheerful)
    const scheduleAheadTime = 0.2;

    this.musicTimer = window.setInterval(() => {
      if (!this.ctx || !this.musicPlaying || this.musicVolume <= 0) return;
      if (this.ctx.state === 'suspended') return;

      while (this.musicNextNoteTime < this.ctx.currentTime + scheduleAheadTime) {
        const idx = this.musicStep % this.melodyNotes.length;
        const melodyFreq = this.melodyNotes[idx];
        const bassFreq = this.bassNotes[idx];

        if (melodyFreq) {
          this.scheduleMarimbaNote(this.ctx, melodyFreq, this.musicNextNoteTime, 0.34, 0.48);
        }
        if (bassFreq) {
          this.scheduleSoftBass(this.ctx, bassFreq, this.musicNextNoteTime, 0.72, 0.35);
        }

        this.musicNextNoteTime += stepDuration;
        this.musicStep = (this.musicStep + 1) % this.melodyNotes.length;
      }
    }, 65);
  }

  private pauseMusicScheduler() {
    this.musicPlaying = false;
    if (this.musicTimer !== null) {
      window.clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  /** Smoothly fade out and stop ambient soundtrack (e.g. when returning to Home) */
  stopMusic() {
    this.musicShouldPlay = false;
    this.pauseMusicScheduler();
    if (this.ctx && this.musicGain) {
      const now = this.ctx.currentTime;
      this.musicGain.gain.cancelScheduledValues(now);
      this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, now);
      this.musicGain.gain.linearRampToValueAtTime(0.0001, now + 0.25);
    }
    this.musicStep = 0;
  }

  private scheduleMarimbaNote(
    ctx: AudioContext,
    freq: number,
    time: number,
    duration: number,
    peakGain: number,
  ) {
    if (!this.musicGain) return;
    const osc = ctx.createOscillator();
    const harmonic = ctx.createOscillator();
    const noteGain = ctx.createGain();
    const harmonicGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    // Subtle soft octave shimmer like a toy xylophone/kalimba
    harmonic.type = 'triangle';
    harmonic.frequency.setValueAtTime(freq * 2, time);
    harmonicGain.gain.setValueAtTime(0.14, time);

    noteGain.gain.setValueAtTime(0.0001, time);
    noteGain.gain.linearRampToValueAtTime(peakGain, time + 0.018);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(noteGain);
    harmonic.connect(harmonicGain);
    harmonicGain.connect(noteGain);
    noteGain.connect(this.musicGain);

    osc.start(time);
    harmonic.start(time);
    osc.stop(time + duration + 0.02);
    harmonic.stop(time + duration + 0.02);
  }

  private scheduleSoftBass(
    ctx: AudioContext,
    freq: number,
    time: number,
    duration: number,
    peakGain: number,
  ) {
    if (!this.musicGain) return;
    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    noteGain.gain.setValueAtTime(0.0001, time);
    noteGain.gain.linearRampToValueAtTime(peakGain, time + 0.04);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(noteGain);
    noteGain.connect(this.musicGain);

    osc.start(time);
    osc.stop(time + duration + 0.02);
  }

  /** Soft bubbly pop — great for buttons, picking up items, and popping bubbles */
  playPop(pitchMultiplier = 1) {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const startFreq = 320 * pitchMultiplier;
    const endFreq = 860 * pitchMultiplier;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.085);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.28, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  /** Bright bell/xylophone chime for correct matches */
  playChime(step = 0) {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const scale = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];
    const base = scale[step % scale.length];

    [base, base * 1.25].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const t = now + i * 0.08;
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.24, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.42);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.45);
    });
  }

  /** Playful gentle rubbery boing (never scary or harsh) */
  playBoing() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(175, now + 0.09);
    osc.frequency.exponentialRampToValueAtTime(295, now + 0.22);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.27);
  }

  /** Cute synthesized cartoon cat meow */
  playMeow() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(540, now);
    osc.frequency.exponentialRampToValueAtTime(840, now + 0.14);
    osc.frequency.exponentialRampToValueAtTime(610, now + 0.42);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1250, now);
    filter.Q.setValueAtTime(3.2, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.46);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.48);
  }

  /** Twinkling magic sparkle arpeggio */
  playSparkle() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [783.99, 987.77, 1174.66, 1567.98];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + idx * 0.055;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.16, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.32);
    });
  }

  /** Joyful victory bell melody + cheerful applause bursts */
  playCelebration() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const fanfare = [
      { freq: 523.25, t: 0.0, dur: 0.18 },
      { freq: 659.25, t: 0.13, dur: 0.18 },
      { freq: 783.99, t: 0.26, dur: 0.18 },
      { freq: 1046.5, t: 0.4, dur: 0.55 },
      { freq: 783.99, t: 0.55, dur: 0.25 },
      { freq: 1046.5, t: 0.72, dur: 0.65 },
    ];

    fanfare.forEach(({ freq, t, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + t);

      gain.gain.setValueAtTime(0.001, now + t);
      gain.gain.linearRampToValueAtTime(0.22, now + t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + t + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + t);
      osc.stop(now + t + dur + 0.05);
    });

    const bufferSize = Math.floor(ctx.sampleRate * 0.08);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
    }

    const clapTimes = [0.28, 0.36, 0.44, 0.53, 0.62, 0.71, 0.82, 0.92, 1.03, 1.15, 1.28, 1.42];
    clapTimes.forEach((offset, idx) => {
      const src = ctx.createBufferSource();
      src.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1100 + (idx % 4) * 260, now + offset);
      filter.Q.setValueAtTime(1.4, now + offset);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.14, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.075);

      src.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      src.start(now + offset);
    });
  }

  /** Crisp tuned wooden xylophone bar hit */
  playXylophoneNote(freq: number) {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const overtone = ctx.createOscillator();
    const gain = ctx.createGain();
    const overtoneGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    overtone.type = 'triangle';
    overtone.frequency.setValueAtTime(freq * 2, now);
    overtoneGain.gain.setValueAtTime(0.18, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.32, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

    osc.connect(gain);
    overtone.connect(overtoneGain);
    overtoneGain.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    overtone.start(now);
    osc.stop(now + 0.68);
    overtone.stop(now + 0.68);
  }

  /** Cheerful bubbly water splash (great for Cat Bath & Watering Flowers) */
  playSplash() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const drops = [460, 620, 780, 960];
    drops.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + idx * 0.045;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f * 0.8, t);
      osc.frequency.exponentialRampToValueAtTime(f * 1.45, t + 0.08);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.13);
    });
  }

  /** Playful wooden toy train whistle ("Piuííí!") */
  playTrainWhistle() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [
      { start: 0, dur: 0.16 },
      { start: 0.22, dur: 0.34 },
    ].forEach(({ start, dur }) => {
      [587.33, 739.99].forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + start);
        gain.gain.setValueAtTime(0.001, now + start);
        gain.gain.linearRampToValueAtTime(0.14, now + start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + start);
        osc.stop(now + start + dur + 0.02);
      });
    });
  }

  /** Cute synthesized farm animal sound effects */
  playAnimalSound(animal: 'vaca' | 'cachorro' | 'pato' | 'ovelha') {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (animal === 'vaca') {
      // Gentle warm "Muuu!"
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(155, now);
      osc.frequency.linearRampToValueAtTime(185, now + 0.18);
      osc.frequency.linearRampToValueAtTime(140, now + 0.6);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(480, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.68);
      return;
    }

    if (animal === 'cachorro') {
      // Two cute playful barks "Au-au!"
      [0, 0.22].forEach((offset) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(340, now + offset);
        osc.frequency.exponentialRampToValueAtTime(520, now + offset + 0.05);
        osc.frequency.exponentialRampToValueAtTime(220, now + offset + 0.14);
        gain.gain.setValueAtTime(0.001, now + offset);
        gain.gain.linearRampToValueAtTime(0.26, now + offset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.16);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.18);
      });
      return;
    }

    if (animal === 'pato') {
      // Cute "Quá-quá!"
      [0, 0.22].forEach((offset) => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(420, now + offset);
        osc.frequency.exponentialRampToValueAtTime(300, now + offset + 0.14);
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1350, now + offset);
        filter.Q.setValueAtTime(3.5, now + offset);
        gain.gain.setValueAtTime(0.001, now + offset);
        gain.gain.linearRampToValueAtTime(0.24, now + offset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.16);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.18);
      });
      return;
    }

    // Ovelha: vibrato "Mééé!"
    const osc = ctx.createOscillator();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(330, now);
    lfo.frequency.setValueAtTime(16, now);
    lfoGain.gain.setValueAtTime(22, now);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(980, now);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    lfo.start(now);
    osc.stop(now + 0.58);
    lfo.stop(now + 0.58);
  }

  /* =========================================================
     GEMINI TTS + INDEXEDDB CACHE + NEURAL WEB SPEECH FALLBACK
     ========================================================= */

  private cacheKey(text: string, mood: SpeechMood): string {
    return `${mood}::${text.trim().toLowerCase()}`;
  }

  private async getCachedClip(key: string): Promise<ArrayBuffer | null> {
    const mem = this.memoryWavCache.get(key);
    if (mem) return mem;

    const db = this.dbPromise ? await this.dbPromise : null;
    if (!db) return null;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(key);
        req.onsuccess = () => {
          const result = req.result;
          if (result instanceof ArrayBuffer) {
            this.memoryWavCache.set(key, result);
            resolve(result);
          } else {
            resolve(null);
          }
        };
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }

  private async saveCachedClip(key: string, buffer: ArrayBuffer): Promise<void> {
    this.memoryWavCache.set(key, buffer);
    const db = this.dbPromise ? await this.dbPromise : null;
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put(buffer, key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  private async fetchGeminiTtsClip(
    text: string,
    mood: SpeechMood,
    timeoutMs = 3400,
  ): Promise<ArrayBuffer | null> {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      return null;
    }
    if (Date.now() < this.geminiUnavailableUntil) {
      return null;
    }

    const key = this.cacheKey(text, mood);
    const existing = this.inFlightRequests.get(key);
    if (existing) return existing;

    const requestPromise = (async (): Promise<ArrayBuffer | null> => {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

      try {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, mood }),
          signal: controller.signal,
        });

        window.clearTimeout(timeoutId);

        if (!res.ok) {
          this.geminiConsecutiveErrors += 1;
          if (res.status === 503 || this.geminiConsecutiveErrors >= 2) {
            // Pause Gemini attempts briefly and use instant neural Web Speech fallback
            this.geminiUnavailableUntil = Date.now() + 60_000;
          }
          return null;
        }

        const data = (await res.json()) as { audioBase64?: string };
        if (!data.audioBase64) return null;

        this.geminiConsecutiveErrors = 0;
        const wavBuffer = base64ToArrayBuffer(data.audioBase64);
        await this.saveCachedClip(key, wavBuffer);
        return wavBuffer;
      } catch {
        window.clearTimeout(timeoutId);
        this.geminiConsecutiveErrors += 1;
        if (this.geminiConsecutiveErrors >= 2) {
          this.geminiUnavailableUntil = Date.now() + 45_000;
        }
        return null;
      } finally {
        this.inFlightRequests.delete(key);
      }
    })();

    this.inFlightRequests.set(key, requestPromise);
    return requestPromise;
  }

  /**
   * Quietly pre-warms short game phrases in IndexedDB cache (one-by-one)
   * so touching toys/fruits plays the expressive Gemini voice with zero latency.
   */
  async prefetchPhrases(phrases: readonly string[], mood: SpeechMood = 'cheerful') {
    if (!this.voiceEnabled || typeof window === 'undefined') return;
    if (Date.now() < this.geminiUnavailableUntil) return;

    for (const phrase of phrases) {
      if (!this.voiceEnabled || Date.now() < this.geminiUnavailableUntil) break;
      const key = this.cacheKey(phrase, mood);
      const cached = await this.getCachedClip(key);
      if (cached) continue;
      const fetched = await this.fetchGeminiTtsClip(phrase, mood, 6000);
      if (!fetched) break; // Stop prefetching immediately if offline or quota-limited
    }
  }

  private async playWavBuffer(wavBuffer: ArrayBuffer, token: number): Promise<boolean> {
    if (token !== this.speechToken || !this.voiceEnabled) return false;

    const ctx = this.ensureAudioContext();
    if (ctx) {
      try {
        // decodeAudioData detaches the passed buffer, so always slice a copy
        const decoded = await ctx.decodeAudioData(wavBuffer.slice(0));
        if (token !== this.speechToken || !this.voiceEnabled) return false;

        const source = ctx.createBufferSource();
        const voiceGain = ctx.createGain();
        source.buffer = decoded;
        voiceGain.gain.setValueAtTime(1.0, ctx.currentTime);
        source.connect(voiceGain);
        voiceGain.connect(ctx.destination);

        this.activeVoiceSource = source;
        this.updateMusicDucking(true);

        source.onended = () => {
          if (this.activeVoiceSource === source) {
            this.activeVoiceSource = null;
          }
          if (token === this.speechToken) {
            this.updateMusicDucking(false);
          }
        };

        source.start(0);
        return true;
      } catch {
        // Fall through to HTMLAudioElement playback
      }
    }

    try {
      const blob = new Blob([wavBuffer], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      this.activeFallbackAudio = audio;
      this.updateMusicDucking(true);

      const cleanup = () => {
        URL.revokeObjectURL(url);
        if (this.activeFallbackAudio === audio) {
          this.activeFallbackAudio = null;
        }
        if (token === this.speechToken) {
          this.updateMusicDucking(false);
        }
      };

      audio.onended = cleanup;
      audio.onerror = cleanup;
      await audio.play();
      return true;
    } catch {
      this.updateMusicDucking(false);
      return false;
    }
  }

  /** Add warm natural pauses & expressive punctuation for toddler-friendly speech */
  private formatExpressiveText(raw: string): string {
    const trimmed = raw.trim();
    if (!trimmed) return '';
    return /[!?.…]$/.test(trimmed) ? trimmed : `${trimmed}!`;
  }

  /**
   * Smart Web Speech API fallback tuned for a sweet, bright, clear children's storyteller:
   * - Prioritizes neural pt-BR voices (Microsoft Francisca / Thalita, Google português do Brasil)
   * - pitch = 1.25 (bright, cheerful tone)
   * - rate = 0.92 (gentle, calm, clear cadence for 3-year-olds)
   */
  private speakWithWebSpeechFallback(text: string, token: number) {
    if (
      token !== this.speechToken ||
      !this.voiceEnabled ||
      typeof window === 'undefined' ||
      !('speechSynthesis' in window)
    ) {
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const expressive = this.formatExpressiveText(text);
      const utterance = new SpeechSynthesisUtterance(expressive);
      utterance.lang = 'pt-BR';
      utterance.pitch = 1.25;
      utterance.rate = 0.92;
      utterance.volume = 1;

      if (!this.cachedWebVoice) {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length) {
          this.cachedWebVoice = this.pickBestPtBrVoice(voices);
        }
      }
      if (this.cachedWebVoice) {
        utterance.voice = this.cachedWebVoice;
      }

      this.updateMusicDucking(true);
      utterance.onend = () => {
        if (token === this.speechToken) {
          this.updateMusicDucking(false);
        }
      };
      utterance.onerror = () => {
        if (token === this.speechToken) {
          this.updateMusicDucking(false);
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      this.updateMusicDucking(false);
    }
  }

  /**
   * Speak warm, expressive Brazilian Portuguese using cached Gemini TTS first,
   * automatically falling back to tuned neural Web Speech API if offline or unavailable.
   */
  speak(text: string, mood: SpeechMood = 'cheerful') {
    if (!this.voiceEnabled || typeof window === 'undefined') return;
    const cleanText = this.formatExpressiveText(text);
    if (!cleanText) return;

    this.stopSpeech();
    const token = ++this.speechToken;
    const key = this.cacheKey(cleanText, mood);

    // 1. Instant zero-latency playback from in-memory WAV cache
    const memHit = this.memoryWavCache.get(key);
    if (memHit) {
      void this.playWavBuffer(memHit, token);
      return;
    }

    // 2. Async IndexedDB lookup -> Gemini TTS fetch -> Neural Web Speech API fallback
    void (async () => {
      const idbHit = await this.getCachedClip(key);
      if (token !== this.speechToken || !this.voiceEnabled) return;

      if (idbHit) {
        const ok = await this.playWavBuffer(idbHit, token);
        if (ok) return;
      }

      const fetched = await this.fetchGeminiTtsClip(cleanText, mood);
      if (token !== this.speechToken || !this.voiceEnabled) return;

      if (fetched) {
        const ok = await this.playWavBuffer(fetched, token);
        if (ok) return;
      }

      // 3. Seamless smart neural Web Speech API fallback
      this.speakWithWebSpeechFallback(cleanText, token);
    })();
  }

  stopSpeech() {
    this.speechToken += 1;

    if (this.activeVoiceSource) {
      try {
        this.activeVoiceSource.onended = null;
        this.activeVoiceSource.stop();
      } catch {
        // already stopped
      }
      this.activeVoiceSource = null;
    }

    if (this.activeFallbackAudio) {
      try {
        this.activeFallbackAudio.pause();
        this.activeFallbackAudio.currentTime = 0;
      } catch {
        // ignore
      }
      this.activeFallbackAudio = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    this.updateMusicDucking(false);
  }
}

export const soundEngine = new SoundEngine();
