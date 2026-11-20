import { describe, expect, it } from 'vitest';
import { defaultState, mergeWithStarterVocabulary } from './data';
import { boardSlots, nextPhrase, placeInSlot, removeEverywhere, swapSlots, tilesForCategory, tilesForExpanded } from './board';
import type { AppState, VocabularyTile } from './types';

const ids = (tiles: (VocabularyTile | null)[]) => tiles.map((tile) => tile?.id ?? null);
const park: VocabularyTile = { id: 'custom-park', label: 'park', phrase: 'the park', category: 'Places', context: 'home', symbol: 'park', order: 500, createdBy: 'Parent' };

describe('main board keeps every picture in its spot', () => {
  it('starts with I want … help stop, then drink, food and toilet on the first screen', () => {
    const home = ids(boardSlots(defaultState, 'home'));
    expect(home.slice(0, 8)).toEqual(['i', 'want', 'need', 'more', 'yes', 'no', 'help', 'stop']);
    expect(home).toEqual(expect.arrayContaining(['water', 'food', 'bathroom']));
    expect(home).toHaveLength(12);
  });

  it('adding new cards never moves or removes an existing card (the old bug)', () => {
    const before = ids(boardSlots(defaultState, 'home'));
    const extra = Array.from({ length: 5 }, (_, n) => ({ ...park, id: `custom-${n}`, label: `extra ${n}`, order: 500 + n }));
    const after = ids(boardSlots({ ...defaultState, vocabulary: [...defaultState.vocabulary, ...extra] }, 'home'));
    expect(after).toEqual(before);
  });

  it('hiding a card leaves an empty spot instead of sliding the others forward', () => {
    const state = { ...defaultState, vocabulary: defaultState.vocabulary.map((tile) => (tile.id === 'water' ? { ...tile, hidden: true } : tile)) };
    const before = ids(boardSlots(defaultState, 'home'));
    const after = ids(boardSlots(state, 'home'));
    const waterSpot = before.indexOf('water');
    expect(after[waterSpot]).toBeNull();
    expect(after.filter((_, index) => index !== waterSpot)).toEqual(before.filter((_, index) => index !== waterSpot));
  });

  it('places a new card only where the adult chooses, replacing just that spot', () => {
    const state: AppState = { ...defaultState, vocabulary: [...defaultState.vocabulary, park], slots: placeInSlot(defaultState.slots, 'home', 11, park.id) };
    const home = ids(boardSlots(state, 'home'));
    expect(home[11]).toBe('custom-park');
    expect(home.slice(0, 11)).toEqual(ids(boardSlots(defaultState, 'home')).slice(0, 11));
  });

  it('a card cannot sit in two spots on the same board', () => {
    const slots = placeInSlot(defaultState.slots, 'home', 11, 'water');
    expect(slots.home.filter((id) => id === 'water')).toHaveLength(1);
    expect(slots.home[11]).toBe('water');
  });

  it('swaps two spots and nothing else', () => {
    const swapped = swapSlots(defaultState.slots, 'home', 0, 8);
    expect(swapped.home[0]).toBe(defaultState.slots.home[8]);
    expect(swapped.home[8]).toBe(defaultState.slots.home[0]);
    expect(swapped.home.slice(1, 8)).toEqual(defaultState.slots.home.slice(1, 8));
  });

  it('deleting a card empties its spots on both boards', () => {
    const slots = removeEverywhere(defaultState.slots, 'water');
    expect(slots.home).not.toContain('water');
    expect(slots.school).not.toContain('water');
    expect(slots.home).toHaveLength(12);
  });

  it('does not show a school-only word on the Home board', () => {
    const state = { ...defaultState, slots: placeInSlot(defaultState.slots, 'home', 11, 'question') };
    expect(ids(boardSlots(state, 'home'))).not.toContain('question');
  });

  it('gives Home and School different context words', () => {
    expect(ids(boardSlots(defaultState, 'home'))).toContain('hug');
    expect(ids(boardSlots(defaultState, 'school'))).toContain('question');
  });
});

describe('category pages', () => {
  it('only show that category, in a stable order with new cards at the end', () => {
    const state = { ...defaultState, vocabulary: [...defaultState.vocabulary, park] };
    const places = tilesForCategory(state, 'home', 'Places');
    expect(places.every((tile) => tile.category === 'Places')).toBe(true);
    expect(places[places.length - 1]?.id).toBe('custom-park');
  });

  it('"More words" keeps the 12 main spots first', () => {
    const { main, rest } = tilesForExpanded(defaultState, 'home');
    expect(ids(main)).toEqual(ids(boardSlots(defaultState, 'home')));
    expect(rest.some((tile) => tile.id === 'water')).toBe(false);
  });
});

describe('add-picture form', () => {
  it('copies the whole label into the spoken phrase while typing (was stuck on the first letter)', () => {
    let phrase = '';
    for (const label of ['p', 'pa', 'par', 'park']) phrase = nextPhrase(label, phrase, false);
    expect(phrase).toBe('park');
  });

  it('stops copying once the adult writes their own phrase', () => {
    expect(nextPhrase('park', 'I want the park', true)).toBe('I want the park');
  });
});

describe('saved boards from older versions', () => {
  it('get fixed spots, choice sets and the new starter words without losing custom cards', () => {
    const old = { vocabulary: [...defaultState.vocabulary.filter((tile) => tile.id !== 'juice'), park], layout: 'focus' } as unknown as AppState;
    const merged = mergeWithStarterVocabulary(old);
    expect(merged.slots.home).toEqual(defaultState.slots.home);
    expect(merged.choiceSets.length).toBeGreaterThan(0);
    expect(merged.vocabulary.some((tile) => tile.id === 'juice')).toBe(true);
    expect(merged.vocabulary.some((tile) => tile.id === 'custom-park')).toBe(true);
    expect(merged.messageMode).toBe('single');
    expect(merged.pin).toMatch(/^\d{4}$/);
  });
});
