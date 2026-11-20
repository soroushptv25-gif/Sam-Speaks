import type { AppState, BoardSlots, ChoiceSet, VocabularyTile } from './types';

const word = (tile: VocabularyTile) => tile;

export const starterVocabulary: VocabularyTile[] = [
  word({ id: 'i', label: 'I', phrase: 'I', category: 'Core', context: 'both', symbol: 'person', core: true, order: 1 }),
  word({ id: 'want', label: 'want', phrase: 'want', category: 'Core', context: 'both', symbol: 'want', core: true, order: 2 }),
  word({ id: 'need', label: 'need', phrase: 'need', category: 'Core', context: 'both', symbol: 'need', core: true, order: 3 }),
  word({ id: 'more', label: 'more', phrase: 'more', category: 'Core', context: 'both', symbol: 'more', core: true, order: 4 }),
  word({ id: 'yes', label: 'yes', phrase: 'yes', category: 'Core', context: 'both', symbol: 'yes', core: true, order: 5 }),
  word({ id: 'no', label: 'no', phrase: 'no', category: 'Core', context: 'both', symbol: 'no', core: true, order: 6 }),
  word({ id: 'help', label: 'help', phrase: 'help me', category: 'Core', context: 'both', symbol: 'help', core: true, order: 7 }),
  word({ id: 'stop', label: 'stop', phrase: 'stop', category: 'Core', context: 'both', symbol: 'stop', core: true, order: 8 }),
  word({ id: 'like', label: 'like', phrase: 'like', category: 'Core', context: 'both', symbol: 'like', core: true, order: 9 }),
  word({ id: 'finished', label: 'finished', phrase: 'I am finished', category: 'Core', context: 'both', symbol: 'finished', core: true, order: 10 }),
  word({ id: 'again', label: 'again', phrase: 'again', category: 'Core', context: 'both', symbol: 'again', core: true, order: 11 }),
  word({ id: 'different', label: 'different', phrase: 'something different', category: 'Core', context: 'both', symbol: 'different', core: true, order: 12 }),
  word({ id: 'wait', label: 'wait', phrase: 'please wait', category: 'Core', context: 'both', symbol: 'wait', core: true, order: 13 }),
  word({ id: 'not-like', label: "don't like", phrase: "I don't like that", category: 'Core', context: 'both', symbol: 'no', core: true, order: 14 }),

  word({ id: 'water', label: 'water', phrase: 'water', category: 'Needs', context: 'both', symbol: 'water', order: 20 }),
  word({ id: 'juice', label: 'juice', phrase: 'juice', category: 'Needs', context: 'both', symbol: 'juice', order: 20.1 }),
  word({ id: 'milk', label: 'milk', phrase: 'milk', category: 'Needs', context: 'both', symbol: 'milk', order: 20.2 }),
  word({ id: 'food', label: 'food', phrase: 'something to eat', category: 'Needs', context: 'both', symbol: 'food', order: 21 }),
  word({ id: 'bathroom', label: 'bathroom', phrase: 'the bathroom', category: 'Needs', context: 'both', symbol: 'bathroom', order: 22 }),
  word({ id: 'break', label: 'break', phrase: 'I need a break', category: 'Needs', context: 'both', symbol: 'break', order: 23 }),
  word({ id: 'hurt', label: 'it hurts', phrase: 'something hurts', category: 'Needs', context: 'both', symbol: 'hurt', order: 24 }),
  word({ id: 'sick', label: 'feel sick', phrase: 'I feel sick', category: 'Needs', context: 'both', symbol: 'sick', order: 25 }),
  word({ id: 'hot', label: 'too hot', phrase: 'I am too hot', category: 'Needs', context: 'both', symbol: 'hot', order: 26 }),
  word({ id: 'cold', label: 'too cold', phrase: 'I am too cold', category: 'Needs', context: 'both', symbol: 'cold', order: 27 }),
  word({ id: 'quiet', label: 'quiet', phrase: 'I need quiet', category: 'Needs', context: 'both', symbol: 'quiet', order: 28 }),
  word({ id: 'too-loud', label: 'too loud', phrase: 'it is too loud', category: 'Needs', context: 'both', symbol: 'loud', order: 29 }),
  word({ id: 'space', label: 'space', phrase: 'I need some space', category: 'Needs', context: 'both', symbol: 'space', order: 30 }),
  word({ id: 'hug', label: 'hug', phrase: 'I want a hug', category: 'Needs', context: 'home', symbol: 'hug', order: 31 }),

  word({ id: 'go', label: 'go', phrase: 'go', category: 'Actions', context: 'both', symbol: 'go', order: 40 }),
  word({ id: 'play', label: 'play', phrase: 'I want to play', category: 'Actions', context: 'home', symbol: 'play', order: 41 }),
  word({ id: 'toys', label: 'my toys', phrase: 'I want my toys', category: 'Actions', context: 'home', symbol: 'toys', order: 41.1 }),
  word({ id: 'read', label: 'read', phrase: 'I want to read', category: 'Actions', context: 'both', symbol: 'book', order: 42 }),
  word({ id: 'listen', label: 'listen', phrase: 'I want to listen', category: 'Actions', context: 'both', symbol: 'listen', order: 43 }),
  word({ id: 'tell', label: 'tell you', phrase: 'I want to tell you something', category: 'Actions', context: 'both', symbol: 'tell', order: 44 }),
  word({ id: 'choose', label: 'choose', phrase: 'I want to choose', category: 'Actions', context: 'both', symbol: 'choose', order: 45 }),
  word({ id: 'outside', label: 'go outside', phrase: 'I want to go outside', category: 'Actions', context: 'both', symbol: 'outside', order: 46 }),
  word({ id: 'rest', label: 'rest', phrase: 'I want to rest', category: 'Actions', context: 'home', symbol: 'rest', order: 47 }),
  word({ id: 'wash', label: 'wash', phrase: 'I need to wash', category: 'Actions', context: 'home', symbol: 'wash', order: 48 }),
  word({ id: 'sleep', label: 'sleep', phrase: 'I want to sleep', category: 'Actions', context: 'home', symbol: 'sleep', order: 49 }),
  word({ id: 'draw', label: 'draw', phrase: 'I want to draw', category: 'Actions', context: 'both', symbol: 'draw', order: 50 }),
  word({ id: 'music', label: 'music', phrase: 'I want music', category: 'Actions', context: 'both', symbol: 'music', order: 51 }),

  word({ id: 'happy', label: 'happy', phrase: 'I feel happy', category: 'Feelings', context: 'both', symbol: 'happy', order: 60 }),
  word({ id: 'sad', label: 'sad', phrase: 'I feel sad', category: 'Feelings', context: 'both', symbol: 'sad', order: 61 }),
  word({ id: 'tired', label: 'tired', phrase: 'I feel tired', category: 'Feelings', context: 'both', symbol: 'tired', order: 62 }),
  word({ id: 'angry', label: 'angry', phrase: 'I feel angry', category: 'Feelings', context: 'both', symbol: 'angry', order: 63 }),
  word({ id: 'scared', label: 'scared', phrase: 'I feel scared', category: 'Feelings', context: 'both', symbol: 'scared', order: 64 }),
  word({ id: 'worried', label: 'worried', phrase: 'I feel worried', category: 'Feelings', context: 'both', symbol: 'worried', order: 65 }),
  word({ id: 'calm', label: 'calm', phrase: 'I feel calm', category: 'Feelings', context: 'both', symbol: 'calm', order: 66 }),
  word({ id: 'excited', label: 'excited', phrase: 'I feel excited', category: 'Feelings', context: 'both', symbol: 'excited', order: 67 }),
  word({ id: 'confused', label: 'confused', phrase: 'I feel confused', category: 'Feelings', context: 'both', symbol: 'confused', order: 68 }),
  word({ id: 'uncomfortable', label: 'uncomfortable', phrase: 'I feel uncomfortable', category: 'Feelings', context: 'both', symbol: 'uncomfortable', order: 69 }),
  word({ id: 'proud', label: 'proud', phrase: 'I feel proud', category: 'Feelings', context: 'both', symbol: 'proud', order: 70 }),

  word({ id: 'mum', label: 'mum', phrase: 'mum', category: 'People', context: 'home', symbol: 'parent', order: 80 }),
  word({ id: 'dad', label: 'dad', phrase: 'dad', category: 'People', context: 'home', symbol: 'parent', order: 81 }),
  word({ id: 'grandma', label: 'grandma', phrase: 'grandma', category: 'People', context: 'home', symbol: 'grandparent', order: 81.1 }),
  word({ id: 'family', label: 'family', phrase: 'my family', category: 'People', context: 'home', symbol: 'family', order: 82 }),
  word({ id: 'friend', label: 'friend', phrase: 'my friend', category: 'People', context: 'both', symbol: 'friend', order: 83 }),
  word({ id: 'teacher', label: 'teacher', phrase: 'my teacher', category: 'People', context: 'school', symbol: 'teacher', order: 84 }),
  word({ id: 'classmate', label: 'classmate', phrase: 'my classmate', category: 'People', context: 'school', symbol: 'classmate', order: 85 }),
  word({ id: 'therapist', label: 'therapist', phrase: 'my therapist', category: 'People', context: 'both', symbol: 'therapist', order: 86 }),
  word({ id: 'nurse', label: 'nurse', phrase: 'the nurse', category: 'People', context: 'school', symbol: 'nurse', order: 87 }),

  word({ id: 'home-place', label: 'home', phrase: 'home', category: 'Places', context: 'home', symbol: 'home', order: 100 }),
  word({ id: 'school-place', label: 'school', phrase: 'school', category: 'Places', context: 'school', symbol: 'school', order: 101 }),
  word({ id: 'park', label: 'park', phrase: 'the park', category: 'Places', context: 'home', symbol: 'park', order: 101.1 }),
  word({ id: 'quiet-place', label: 'quiet place', phrase: 'a quiet place', category: 'Places', context: 'both', symbol: 'quiet-place', order: 102 }),
  word({ id: 'playground', label: 'playground', phrase: 'the playground', category: 'Places', context: 'school', symbol: 'playground', order: 103 }),
  word({ id: 'cafeteria', label: 'cafeteria', phrase: 'the cafeteria', category: 'Places', context: 'school', symbol: 'cafeteria', order: 104 }),
  word({ id: 'bus', label: 'bus', phrase: 'the bus', category: 'Places', context: 'school', symbol: 'bus', order: 105 }),
  word({ id: 'bedroom', label: 'bedroom', phrase: 'my bedroom', category: 'Places', context: 'home', symbol: 'bedroom', order: 106 }),
  word({ id: 'kitchen', label: 'kitchen', phrase: 'the kitchen', category: 'Places', context: 'home', symbol: 'kitchen', order: 107 }),

  word({ id: 'question', label: 'question', phrase: 'I have a question', category: 'School', context: 'school', symbol: 'question', order: 120 }),
  word({ id: 'answer', label: 'answer', phrase: 'I know the answer', category: 'School', context: 'school', symbol: 'answer', order: 121 }),
  word({ id: 'pencil', label: 'pencil', phrase: 'I need a pencil', category: 'School', context: 'school', symbol: 'pencil', order: 122 }),
  word({ id: 'computer', label: 'computer', phrase: 'the computer', category: 'School', context: 'school', symbol: 'computer', order: 123 }),
  word({ id: 'lesson', label: 'lesson', phrase: 'the lesson', category: 'School', context: 'school', symbol: 'lesson', order: 124 }),
  word({ id: 'recess', label: 'recess', phrase: 'recess', category: 'School', context: 'school', symbol: 'recess', order: 125 }),
  word({ id: 'lunch', label: 'lunch', phrase: 'lunch', category: 'School', context: 'school', symbol: 'lunch', order: 126 }),
  word({ id: 'homework', label: 'homework', phrase: 'my homework', category: 'School', context: 'school', symbol: 'homework', order: 127 }),
  word({ id: 'work-finished', label: 'work finished', phrase: 'my work is finished', category: 'School', context: 'school', symbol: 'finished', order: 128 }),
  word({ id: 'need-explanation', label: 'explain again', phrase: 'please explain that again', category: 'School', context: 'school', symbol: 'again', order: 129 }),
];

/**
 * The 12 fixed spots on each main board. Phase 1: help, toilet, drink and food
 * are on the first screen, one tap away; "I want" never moves.
 */
export const defaultSlots: BoardSlots = {
  home: ['i', 'want', 'need', 'more', 'yes', 'no', 'help', 'stop', 'water', 'food', 'bathroom', 'hug'],
  school: ['i', 'want', 'need', 'more', 'yes', 'no', 'help', 'stop', 'water', 'bathroom', 'break', 'question'],
};

export const defaultChoiceSets: ChoiceSet[] = [
  { id: 'set-drinks', name: 'Which drink?', tileIds: ['water', 'juice', 'milk'] },
  { id: 'set-feelings', name: 'How do you feel?', tileIds: ['happy', 'sad', 'angry', 'tired'] },
  { id: 'set-yes-no', name: 'Yes or no', tileIds: ['yes', 'no'] },
];

export const DEMO_PIN = '2468';

export const defaultState: AppState = {
  vocabulary: starterVocabulary,
  slots: defaultSlots,
  choiceSets: defaultChoiceSets,
  layout: 'focus',
  spacing: 'roomy',
  messageMode: 'single',
  language: 'en',
  labels: true,
  audioFeedback: true,
  highContrast: false,
  reducedMotion: false,
  fullscreen: true,
  pin: DEMO_PIN,
  seenWelcome: false,
};

export const categories = ['All', 'Core', 'Needs', 'Actions', 'Feelings', 'People', 'Places', 'School'] as const;
export type CategoryFilter = (typeof categories)[number];

const validSlots = (value: unknown): value is (string | null)[] =>
  Array.isArray(value) && value.length === 12 && value.every((item) => item === null || typeof item === 'string');

/** Brings an older saved board (or an imported file) up to the current shape without losing anything. */
export function mergeWithStarterVocabulary(saved: Partial<AppState>): AppState {
  const vocabulary = Array.isArray(saved.vocabulary) ? saved.vocabulary : [];
  const savedIds = new Set(vocabulary.map((tile) => tile.id));
  const missingStarterWords = starterVocabulary.filter((tile) => !savedIds.has(tile.id));
  const slots: BoardSlots = {
    home: validSlots(saved.slots?.home) ? saved.slots.home : [...defaultSlots.home],
    school: validSlots(saved.slots?.school) ? saved.slots.school : [...defaultSlots.school],
  };
  return {
    ...defaultState,
    ...saved,
    vocabulary: [...vocabulary, ...missingStarterWords],
    slots,
    choiceSets: Array.isArray(saved.choiceSets) ? saved.choiceSets : defaultChoiceSets,
    pin: typeof saved.pin === 'string' && /^\d{4}$/.test(saved.pin) ? saved.pin : DEMO_PIN,
  };
}
