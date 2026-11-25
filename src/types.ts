export type Context = 'home' | 'school' | 'both';
export type BoardContext = 'home' | 'school';
export type Category = 'Core' | 'Needs' | 'Actions' | 'Feelings' | 'People' | 'Places' | 'School';
export type Language = 'en' | 'ar';
export type AdultRole = 'Parent' | 'Teacher' | 'Therapist';
export type SymbolName =
  | 'person' | 'want' | 'need' | 'more' | 'yes' | 'no' | 'help' | 'stop'
  | 'go' | 'like' | 'water' | 'food' | 'bathroom' | 'play' | 'book'
  | 'happy' | 'sad' | 'tired' | 'feel' | 'teacher' | 'break' | 'bottle'
  | 'music' | 'home' | 'school' | 'finished' | 'again' | 'different' | 'wait'
  | 'hurt' | 'sick' | 'hot' | 'cold' | 'quiet' | 'loud' | 'space' | 'hug'
  | 'listen' | 'tell' | 'choose' | 'outside' | 'rest' | 'wash' | 'sleep' | 'draw'
  | 'angry' | 'scared' | 'worried' | 'calm' | 'excited' | 'confused' | 'uncomfortable'
  | 'proud' | 'parent' | 'family' | 'friend' | 'classmate' | 'therapist' | 'nurse'
  | 'quiet-place' | 'playground' | 'cafeteria' | 'bus' | 'bedroom' | 'kitchen'
  | 'question' | 'answer' | 'pencil' | 'computer' | 'lesson' | 'recess' | 'lunch' | 'homework'
  | 'juice' | 'milk' | 'park' | 'grandparent' | 'toys';

export interface VocabularyTile {
  id: string;
  label: string;
  phrase: string;
  /** Optional Arabic text. Starter words get theirs from i18n.ts. */
  labelAr?: string;
  phraseAr?: string;
  category: Category;
  context: Context;
  symbol: SymbolName;
  image?: string;
  hidden?: boolean;
  core?: boolean;
  order: number;
  createdBy?: AdultRole;
}

/** A small set of 2–4 pictures an adult shows for one activity (drink choice, feelings check). */
export interface ChoiceSet {
  id: string;
  name: string;
  tileIds: string[];
}

/** Twelve fixed positions per board. `null` is an empty spot, so no other card ever moves. */
export type BoardSlots = Record<BoardContext, (string | null)[]>;

export interface AppState {
  vocabulary: VocabularyTile[];
  slots: BoardSlots;
  choiceSets: ChoiceSet[];
  layout: 'focus' | 'expanded';
  spacing: 'cozy' | 'roomy';
  /** Phase 1 HTA: one picture at a time by default; sentence building is switched on per child. */
  messageMode: 'single' | 'sentence';
  language: Language;
  labels: boolean;
  audioFeedback: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  fullscreen: boolean;
  pin: string;
  seenWelcome: boolean;
}

/** Who took part, which visit, which task, and what consent was recorded (Phase 2). Older records only have the task label. */
interface StudyContext {
  participantGroup?: string;
  session?: 'first' | 'return';
  taskId?: string;
  consent?: string;
}

export interface StudyRecord extends StudyContext {
  id: string;
  participantCode: string;
  task: string;
  startedAt: string;
  endedAt: string;
  outcome: 'success' | 'assisted' | 'failed';
  taps: number;
  undos: number;
  errors: number;
  durationSeconds: number;
}

export interface SusResponse { id: string; participantCode: string; participantGroup: string; answers: number[]; score: number; date: string }
export interface InterviewNote { id: string; participantCode: string; participantGroup: string; answers: string[]; date: string }

export interface ActiveStudyTask extends StudyContext {
  participantCode: string;
  task: string;
  startedAt: string;
  taps: number;
  undos: number;
  errors: number;
}
