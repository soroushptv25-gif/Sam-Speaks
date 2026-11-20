import type { AppState, BoardContext, BoardSlots, VocabularyTile } from './types';

export const BOARD_SIZE = 12;

export function visibleForContext(tile: VocabularyTile, context: BoardContext) {
  return !tile.hidden && (tile.context === 'both' || tile.context === context);
}

const byOrder = (a: VocabularyTile, b: VocabularyTile) => a.order - b.order;

/**
 * The main board: always 12 fixed spots. A hidden or missing card leaves an
 * empty spot (null) instead of letting the cards after it slide forward, so
 * the child's motor memory is never broken (Phase 1 HTA, step 2.1).
 */
export function boardSlots(state: AppState, context: BoardContext): (VocabularyTile | null)[] {
  const ids = state.slots[context];
  return Array.from({ length: BOARD_SIZE }, (_, index) => {
    const id = ids[index];
    const tile = id ? state.vocabulary.find((item) => item.id === id) : undefined;
    return tile && visibleForContext(tile, context) ? tile : null;
  });
}

/** Every visible word in one category, oldest first. New cards are added at the end, so nothing shifts. */
export function tilesForCategory(state: AppState, context: BoardContext, category: string) {
  return state.vocabulary
    .filter((tile) => visibleForContext(tile, context) && (category === 'All' || tile.category === category))
    .sort(byOrder);
}

/** "More words" layout: the 12 main spots first (unchanged), then everything else in a stable order. */
export function tilesForExpanded(state: AppState, context: BoardContext) {
  const main = boardSlots(state, context);
  const onMain = new Set(main.filter(Boolean).map((tile) => tile!.id));
  const rest = tilesForCategory(state, context, 'All').filter((tile) => !onMain.has(tile.id));
  return { main, rest };
}

export function slotIndexOf(slots: BoardSlots, context: BoardContext, id: string) {
  return slots[context].indexOf(id);
}

export function placeInSlot(slots: BoardSlots, context: BoardContext, index: number, id: string | null): BoardSlots {
  const next = slots[context].map((item) => (item === id && id !== null ? null : item));
  next[index] = id;
  return { ...slots, [context]: next };
}

export function swapSlots(slots: BoardSlots, context: BoardContext, a: number, b: number): BoardSlots {
  const next = [...slots[context]];
  [next[a], next[b]] = [next[b], next[a]];
  return { ...slots, [context]: next };
}

export function removeEverywhere(slots: BoardSlots, id: string): BoardSlots {
  return {
    home: slots.home.map((item) => (item === id ? null : item)),
    school: slots.school.map((item) => (item === id ? null : item)),
  };
}

/** The phrase box copies the label until the adult types their own phrase. */
export function nextPhrase(newLabel: string, currentPhrase: string, phraseEdited: boolean) {
  return phraseEdited ? currentPhrase : newLabel;
}

export function nextOrder(vocabulary: VocabularyTile[]) {
  return Math.max(0, ...vocabulary.map((tile) => tile.order)) + 1;
}
