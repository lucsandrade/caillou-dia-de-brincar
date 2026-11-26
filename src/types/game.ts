export type GameId =
  | 'brinquedos'
  | 'cores'
  | 'esconde'
  | 'quebra-cabeca'
  | 'baloes'
  | 'animais'
  | 'memoria'
  | 'xilofone'
  | 'banho'
  | 'contar'
  | 'pintar'
  | 'vestir'
  | 'jardim'
  | 'trem';

export interface GameCatalogEntry {
  id: GameId;
  title: string;
  bg: string;
  hoverBg: string;
  introSpeech: string;
  celebrationTitle: string;
  celebrationSpeeches: readonly string[];
}

export const GAME_CATALOG: readonly GameCatalogEntry[] = [
  {
    id: 'brinquedos',
    title: 'Guardar os Brinquedos',
    bg: 'bg-[#FFF0B5]',
    hoverBg: 'hover:bg-[#FFE68A]',
    introSpeech: 'Eba! Vamos guardar os brinquedos!',
    celebrationTitle: 'Parabéns!',
    celebrationSpeeches: [
      'Parabéns! Você guardou todos os brinquedos! Que capricho!',
      'Uau! Todos os brinquedos estão na prateleira! Muito bem!',
    ],
  },
  {
    id: 'cores',
    title: 'Lanche das Cores',
    bg: 'bg-[#FFD6E7]',
    hoverBg: 'hover:bg-[#FFC2DC]',
    introSpeech: 'Hummm! Hora do lanche das cores!',
    celebrationTitle: 'Muito bem!',
    celebrationSpeeches: [
      'Parabéns! Que lanche colorido e gostoso! Ela adorou!',
      'Muito bem! Você acertou todas as cores das frutinhas!',
    ],
  },
  {
    id: 'esconde',
    title: 'Esconde-Esconde',
    bg: 'bg-[#CBEFFF]',
    hoverBg: 'hover:bg-[#B2E6FF]',
    introSpeech: 'Esconde-esconde com o gatinho!',
    celebrationTitle: 'Você conseguiu!',
    celebrationSpeeches: [
      'Parabéns! Você achou o gatinho e estourou todas as bolhas!',
      'Ebaaa! Que brincadeira divertida com o gatinho! Você conseguiu!',
    ],
  },
  {
    id: 'quebra-cabeca',
    title: 'Quebra-Cabeça',
    bg: 'bg-[#D1FADF]',
    hoverBg: 'hover:bg-[#B7F4CB]',
    introSpeech: 'Vamos montar o quebra-cabeça no parque!',
    celebrationTitle: 'Que lindo!',
    celebrationSpeeches: [
      'Que lindo! Você montou todo o quebra-cabeça do parque! Parabéns!',
      'Uau! O parque ficou completo e maravilhoso! Muito bem!',
    ],
  },
  {
    id: 'baloes',
    title: 'Estourar Balões',
    bg: 'bg-[#FFE4E6]',
    hoverBg: 'hover:bg-[#FECDD3]',
    introSpeech: 'Ebaaa! Vamos estourar os balões coloridos!',
    celebrationTitle: 'Que festa!',
    celebrationSpeeches: [
      'Parabéns! Você estourou todos os balões coloridos!',
      'Uau! Quanta cor linda no céu! Muito bem!',
    ],
  },
  {
    id: 'animais',
    title: 'Som dos Animais',
    bg: 'bg-[#FEF3C7]',
    hoverBg: 'hover:bg-[#FDE68A]',
    introSpeech: 'Vamos ouvir o som dos bichinhos da fazenda!',
    celebrationTitle: 'Incrível!',
    celebrationSpeeches: [
      'Parabéns! Você conhece todos os bichinhos da fazenda!',
      'Muito bem! Os animaizinhos estão super felizes!',
    ],
  },
  {
    id: 'memoria',
    title: 'Jogo da Memória',
    bg: 'bg-[#E9D5FF]',
    hoverBg: 'hover:bg-[#D8B4FE]',
    introSpeech: 'Vamos encontrar os pares iguais!',
    celebrationTitle: 'Genial!',
    celebrationSpeeches: [
      'Uau! Que memória boa! Você achou todos os pares!',
      'Parabéns! Você encontrou todas as cartinhas iguais!',
    ],
  },
  {
    id: 'xilofone',
    title: 'Xilofone Musical',
    bg: 'bg-[#FFEDD5]',
    hoverBg: 'hover:bg-[#FED7AA]',
    introSpeech: 'Vamos tocar uma musiquinha no xilofone!',
    celebrationTitle: 'Que música!',
    celebrationSpeeches: [
      'Bravo! Que musiquinha mais linda você tocou!',
      'Parabéns! Você é um grande artista da música!',
    ],
  },
  {
    id: 'banho',
    title: 'Banho no Gatinho',
    bg: 'bg-[#CFFAFE]',
    hoverBg: 'hover:bg-[#A5F3FC]',
    introSpeech: 'Hora do banho cheiroso do gatinho cinza!',
    celebrationTitle: 'Cheirosinho!',
    celebrationSpeeches: [
      'Miau! O gatinho ficou limpinho e muito cheiroso! Parabéns!',
      'Ebaaa! Que banho gostoso o gatinho tomou! Muito bem!',
    ],
  },
  {
    id: 'contar',
    title: 'Contar Estrelinhas',
    bg: 'bg-[#E0E7FF]',
    hoverBg: 'hover:bg-[#C7D2FE]',
    introSpeech: 'Vamos contar as estrelinhas no céu!',
    celebrationTitle: 'Brilhou!',
    celebrationSpeeches: [
      'Parabéns! Você contou até cinco estrelinhas brilhantes!',
      'Uau! Um, dois, três, quatro, cinco! Muito bem!',
    ],
  },
  {
    id: 'pintar',
    title: 'Pintar o Desenho',
    bg: 'bg-[#FCE7F3]',
    hoverBg: 'hover:bg-[#FBCFE8]',
    introSpeech: 'Vamos pintar uma borboleta bem colorida!',
    celebrationTitle: 'Obra de Arte!',
    celebrationSpeeches: [
      'Que desenho lindo e colorido! Parabéns, pequeno artista!',
      'Uau! A borboleta ficou maravilhosa! Muito bem!',
    ],
  },
  {
    id: 'vestir',
    title: 'Vestir o Caillou',
    bg: 'bg-[#FEF9C3]',
    hoverBg: 'hover:bg-[#FEF08A]',
    introSpeech: 'Vamos ajudar o Caillou a se arrumar para passear!',
    celebrationTitle: 'Que estilo!',
    celebrationSpeeches: [
      'Uau! O Caillou ficou lindo e pronto para passear! Parabéns!',
      'Muito bem! Agora ele está todo arrumadinho!',
    ],
  },
  {
    id: 'jardim',
    title: 'Regar as Flores',
    bg: 'bg-[#DCFCE7]',
    hoverBg: 'hover:bg-[#BBF7D0]',
    introSpeech: 'Vamos regar as florzinhas do jardim!',
    celebrationTitle: 'Que jardim!',
    celebrationSpeeches: [
      'Que lindo! Todas as florzinhas abriram no jardim! Parabéns!',
      'Muito bem! O jardim ficou cheio de flores felizes!',
    ],
  },
  {
    id: 'trem',
    title: 'Trem das Formas',
    bg: 'bg-[#DBEAFE]',
    hoverBg: 'hover:bg-[#BFDBFE]',
    introSpeech: 'Piuííí! Vamos carregar o trem das formas!',
    celebrationTitle: 'Piuííí!',
    celebrationSpeeches: [
      'Piuííí! Todas as formas entraram no trem! Parabéns!',
      'Ebaaa! O trem das formas já pode partir! Muito bem!',
    ],
  },
];

export const GAME_BY_ID: Record<GameId, GameCatalogEntry> = GAME_CATALOG.reduce(
  (acc, item) => {
    acc[item.id] = item;
    return acc;
  },
  {} as Record<GameId, GameCatalogEntry>,
);

export function createEmptyStarsMap(): Record<GameId, number> {
  return GAME_CATALOG.reduce(
    (acc, item) => {
      acc[item.id] = 0;
      return acc;
    },
    {} as Record<GameId, number>,
  );
}
