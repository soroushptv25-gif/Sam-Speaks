import type { VocabularyTile } from './types';

export const appendWord = (message: VocabularyTile[], tile: VocabularyTile) => [...message, tile];
export const removeLastWord = (message: VocabularyTile[]) => message.slice(0, -1);
export const messageToSpeech = (message: VocabularyTile[], phraseOf: (tile: VocabularyTile) => string = (tile) => tile.phrase) =>
  message.map(phraseOf).join(' ').trim();
