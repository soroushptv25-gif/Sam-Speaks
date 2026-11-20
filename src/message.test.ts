import { describe, expect, it } from 'vitest';
import { appendWord, messageToSpeech, removeLastWord } from './message';
import type { VocabularyTile } from './types';

const tile = (label: string): VocabularyTile => ({
  id: label.toLowerCase(), label, phrase: label.toLowerCase(), category: 'Core',
  context: 'both', symbol: 'person', order: 1,
});

describe('message composition', () => {
  it('builds the required I want water message', () => {
    const message = [tile('I'), tile('want'), tile('water')];
    expect(messageToSpeech(message)).toBe('i want water');
  });

  it('adds and removes the latest word without changing earlier words', () => {
    const first = [tile('I'), tile('need')];
    const next = appendWord(first, tile('help'));
    expect(messageToSpeech(removeLastWord(next))).toBe('i need');
    expect(first).toHaveLength(2);
  });
});
