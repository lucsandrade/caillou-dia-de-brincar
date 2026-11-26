/**
 * Carinhosas, expressivas e variadas falas em português do Brasil (pt-BR)
 * com pausas naturais e exclamações pensadas para crianças de 3 anos.
 */

const lastPicked = new Map<string, number>();

/** Pick a warm phrase from a pool without repeating the exact same one twice in a row */
export function pickVariedPhrase(poolKey: string, phrases: readonly string[]): string {
  if (phrases.length === 0) return '';
  if (phrases.length === 1) return phrases[0];

  const prevIdx = lastPicked.get(poolKey);
  let nextIdx = Math.floor(Math.random() * phrases.length);
  if (nextIdx === prevIdx) {
    nextIdx = (nextIdx + 1) % phrases.length;
  }
  lastPicked.set(poolKey, nextIdx);
  return phrases[nextIdx];
}

export const PRAISE_SHORT = [
  'Isso mesmo!',
  'Muito bem!',
  'Ebaaa! Que legal!',
  'Uau! Você acertou!',
  'Que maravilha!',
  'Aêê! Você é demais!',
] as const;

export const GENTLE_RETRY = [
  'Quase lá! Tenta de novo!',
  'Opa! Vamos procurar o lugar certinho!',
  'Hum... onde será que combina?',
] as const;

export const HOME_GREETINGS = {
  boy: [
    'Oi, amiguinho! Vamos brincar juntos?',
    'Eba! Que bom ver você por aqui!',
    'Oi! Qual joguinho vamos brincar agora?',
  ],
  sister: [
    'Ebaaa! Que divertido brincar com você!',
    'Oi! Eu adoro brincar de cores!',
    'Hi-hi! Vamos nos divertir muito!',
  ],
  cat: [
    'Miau! Oi, amiguinho! Quer fazer carinho?',
    'Miau! Vamos brincar de esconde-esconde?',
    'Miau, miau! Que saudade de você!',
  ],
} as const;

export const TOY_PICK_PHRASES = {
  dinossauro: ['Dinossauro!', 'Olha o dinossauro verdinho!'],
  foguete: ['Foguete!', 'Olha o foguete! Vai voar bem alto!'],
  carrinho: ['Carrinho!', 'Olha o carrinho! Bi-bi!'],
} as const;

export const TOY_SUCCESS_PHRASES = {
  dinossauro: [
    'Isso mesmo! O dinossauro está guardadinho!',
    'Muito bem! Que dinossauro feliz!',
    'Ebaaa! Você guardou o dinossauro!',
  ],
  foguete: [
    'Uau! O foguete chegou na prateleira!',
    'Muito bem! Foguete guardadinho!',
    'Isso mesmo! Que foguete lindo!',
  ],
  carrinho: [
    'Aêê! O carrinho estacionou certinho!',
    'Muito bem! Você guardou o carrinho!',
    'Isso mesmo! Bi-bi! Carrinho guardado!',
  ],
} as const;

export const FRUIT_PICK_PHRASES = {
  vermelho: ['Maçã vermelha!', 'Olha a maçã vermelha!'],
  amarelo: ['Banana amarela!', 'Olha a banana amarela!'],
  verde: ['Pera verde!', 'Olha a pera verde!'],
  azul: ['Mirtilo azul!', 'Olha o mirtilo azul!'],
} as const;

export const FRUIT_SUCCESS_PHRASES = {
  vermelho: [
    'Hummm! Maçã vermelha! Que delícia!',
    'Isso mesmo! A maçã no pratinho vermelho!',
    'Muito bem! Ela amou a maçã vermelha!',
  ],
  amarelo: [
    'Nham, nham! Banana amarela gostosa!',
    'Isso mesmo! A banana no pratinho amarelo!',
    'Ebaaa! Que banana amarela docinha!',
  ],
  verde: [
    'Que gostoso! Pera verde fresquinha!',
    'Isso mesmo! A pera no pratinho verde!',
    'Muito bem! Ela adorou a pera verde!',
  ],
  azul: [
    'Uau! Mirtilo azul! Que delícia!',
    'Isso mesmo! Mirtilo no pratinho azul!',
    'Nham, nham! Mirtilo azul bem gostoso!',
  ],
} as const;

export const HIDE_FOUND_PHRASES = {
  sofa: [
    'Achou o gatinho atrás do sofá! Miau!',
    'Ebaaa! O gatinho estava no sofá! Miau!',
  ],
  cortina: [
    'Achou o gatinho atrás da cortina! Miau!',
    'Olha ele ali! Escondido na cortina! Miau!',
  ],
  poltrona: [
    'Achou o gatinho atrás da poltrona! Miau!',
    'Uau! Você achou ele na poltrona! Miau!',
  ],
  caixa: [
    'Achou o gatinho atrás da caixa! Miau!',
    'Hi-hi! Ele estava escondido na caixa! Miau!',
  ],
} as const;

export const BUBBLE_POP_CHEERS = [
  'Ploc! Isso mesmo!',
  'Pop! Muito bem!',
  'Ebaaa! Quanta bolha bonita!',
  'Uau! Você está estourando tudo!',
  'Que legal! Mais bolhinhas!',
] as const;

export const PUZZLE_PIECE_SUCCESS = {
  0: [
    'Isso mesmo! Olha o solzinho brilhando!',
    'Que lindo! O sol e o arco-íris!',
  ],
  1: [
    'Muito bem! A árvore com o passarinho!',
    'Ebaaa! Que árvore verdinha linda!',
  ],
  2: [
    'Uau! O menino brincando com a bola!',
    'Isso mesmo! Olha a bolinha no parque!',
  ],
  3: [
    'Aêê! O gatinho cinza nas flores!',
    'Muito bem! Que gatinho fofo no parque!',
  ],
} as const;

export const CELEBRATION_SPEECHES = {
  brinquedos: [
    'Parabéns! Você guardou todos os brinquedos! Que capricho!',
    'Uau! Todos os brinquedos estão na prateleira! Muito bem!',
  ],
  cores: [
    'Parabéns! Que lanche colorido e gostoso! Ela adorou!',
    'Muito bem! Você acertou todas as cores das frutinhas!',
  ],
  esconde: [
    'Parabéns! Você achou o gatinho e estourou todas as bolhas!',
    'Ebaaa! Que brincadeira divertida com o gatinho! Você conseguiu!',
  ],
  'quebra-cabeca': [
    'Que lindo! Você montou todo o quebra-cabeça do parque! Parabéns!',
    'Uau! O parque ficou completo e maravilhoso! Muito bem!',
  ],
} as const;
