import type { StudyRecord } from './types';

/**
 * Phase 2 usability study support (instructor feedback points 2 and 6):
 * every usability attribute has a measurable target, SUS is scored in the app,
 * and child participants need parental consent and the child's own agreement.
 */

export type ParticipantGroup = 'child' | 'parent' | 'teacher' | 'therapist' | 'other';
export type StudySession = 'first' | 'return';
export type UsabilityAttribute = 'Effectiveness' | 'Efficiency' | 'Learnability' | 'Memorability' | 'Satisfaction' | 'Accessibility';

export const participantGroups: { id: ParticipantGroup; label: string }[] = [
  { id: 'parent', label: 'Parent or caregiver' },
  { id: 'teacher', label: 'Special education teacher' },
  { id: 'therapist', label: 'Speech therapist' },
  { id: 'child', label: 'Child (4–12)' },
  { id: 'other', label: 'Other supporter' },
];

export interface StudyTask {
  id: string;
  label: string;
  /** Where the task starts: Sam's board or the grown-up area. */
  startsOn: 'board' | 'adult';
  attribute: UsabilityAttribute;
  /** Plain-language target shown to the facilitator. */
  target: string;
  /** Success also needs: no help, time ≤ maxSeconds, taps ≤ maxTaps (when set). */
  maxSeconds?: number;
  maxTaps?: number;
  /** Counts only in this session type (memorability is a return visit). */
  session?: StudySession;
}

export const studyTasks: StudyTask[] = [
  { id: 'water', label: 'Ask for water', startsOn: 'board', attribute: 'Effectiveness', target: 'Done without help in 1 tap', maxTaps: 1 },
  { id: 'help', label: 'Ask for help', startsOn: 'board', attribute: 'Efficiency', target: 'Done without help in 1 tap and under 10 seconds', maxTaps: 1, maxSeconds: 10 },
  { id: 'feeling', label: 'Say how you feel', startsOn: 'board', attribute: 'Efficiency', target: 'Done without help in 2 taps (group, then picture)', maxTaps: 2 },
  { id: 'drink-choice', label: 'Choose a drink from a choice set', startsOn: 'board', attribute: 'Effectiveness', target: 'Done without help in 1 tap', maxTaps: 1 },
  { id: 'fix', label: 'Fix a wrong picture (sentence mode)', startsOn: 'board', attribute: 'Effectiveness', target: 'Done without help, using Undo', maxTaps: 6 },
  { id: 'add-photo', label: 'Add a photo card (first time)', startsOn: 'adult', attribute: 'Learnability', target: 'A first-time caregiver adds a photo card in under 2 minutes without help', maxSeconds: 120, session: 'first' },
  { id: 'add-photo-return', label: 'Add a photo card (return visit)', startsOn: 'adult', attribute: 'Memorability', target: 'One week later, the same caregiver adds a card in under 1 minute without help', maxSeconds: 60, session: 'return' },
  { id: 'big-pictures', label: 'Switch to big pictures and find Help', startsOn: 'adult', attribute: 'Accessibility', target: 'Done without help in under 1 minute', maxSeconds: 60 },
];

export const SUS_TARGET = 68;
/** Share of task attempts that must meet their target for the attribute to pass. */
export const PASS_RATE_TARGET = 0.8;

export interface UsabilityGoal { attribute: UsabilityAttribute; target: string; measure: string }

export const usabilityGoals: UsabilityGoal[] = [
  { attribute: 'Effectiveness', target: 'At least 80% of child-board task attempts succeed without help', measure: 'Task recorder: outcome' },
  { attribute: 'Efficiency', target: 'Help in 1 tap and under 10 s; a feeling in 2 taps', measure: 'Task recorder: time and taps' },
  { attribute: 'Learnability', target: 'A first-time caregiver adds a photo card in under 2 minutes without help', measure: 'Task recorder: first session' },
  { attribute: 'Memorability', target: 'One week later, the same caregiver adds a card in under 1 minute without help', measure: 'Task recorder: return session' },
  { attribute: 'Satisfaction', target: `Mean SUS score of ${SUS_TARGET} or higher (above average)`, measure: 'SUS questionnaire after the tasks' },
  { attribute: 'Accessibility', target: 'Every participant finds Help with big pictures on, without help, in under 1 minute; 0 WCAG AA contrast failures', measure: 'Task recorder and automated contrast check' },
];

export const taskById = (id: string) => studyTasks.find((task) => task.id === id || task.label === id);

export function meetsTarget(record: StudyRecord): boolean {
  const task = taskById(record.taskId ?? record.task);
  if (record.outcome !== 'success') return false;
  if (!task) return true;
  if (task.maxSeconds !== undefined && record.durationSeconds > task.maxSeconds) return false;
  if (task.maxTaps !== undefined && task.startsOn === 'board' && record.taps > task.maxTaps) return false;
  return true;
}

export interface GoalResult { attempts: number; met: number; rate: number | null; passed: boolean | null }

export function goalResult(attribute: UsabilityAttribute, records: StudyRecord[], susScores: number[]): GoalResult {
  if (attribute === 'Satisfaction') {
    if (!susScores.length) return { attempts: 0, met: 0, rate: null, passed: null };
    const mean = susScores.reduce((sum, score) => sum + score, 0) / susScores.length;
    return { attempts: susScores.length, met: susScores.filter((score) => score >= SUS_TARGET).length, rate: mean, passed: mean >= SUS_TARGET };
  }
  const relevant = records.filter((record) => taskById(record.taskId ?? record.task)?.attribute === attribute);
  if (!relevant.length) return { attempts: 0, met: 0, rate: null, passed: null };
  const met = relevant.filter(meetsTarget).length;
  const rate = met / relevant.length;
  // Accessibility and memorability targets say "every participant" / "the same caregiver".
  const needed = attribute === 'Accessibility' || attribute === 'Memorability' ? 1 : PASS_RATE_TARGET;
  return { attempts: relevant.length, met, rate, passed: rate >= needed };
}

/** The ten standard System Usability Scale statements (Brooke, 1996). */
export const susItems = [
  'I think that I would like to use this system frequently.',
  'I found the system unnecessarily complex.',
  'I thought the system was easy to use.',
  'I think that I would need the support of a technical person to be able to use this system.',
  'I found the various functions in this system were well integrated.',
  'I thought there was too much inconsistency in this system.',
  'I would imagine that most people would learn to use this system very quickly.',
  'I found the system very cumbersome to use.',
  'I felt very confident using the system.',
  'I needed to learn a lot of things before I could get going with this system.',
];

/** Standard SUS scoring: odd items (score − 1), even items (5 − score), sum × 2.5. Answers are 1–5. */
export function susScore(answers: (number | null)[]): number | null {
  if (answers.length !== 10 || answers.some((answer) => answer === null || answer < 1 || answer > 5)) return null;
  const sum = (answers as number[]).reduce((total, answer, index) => total + (index % 2 === 0 ? answer - 1 : 5 - answer), 0);
  return sum * 2.5;
}

export const interviewQuestions = [
  'What felt easiest?',
  'What was confusing, and where?',
  'Was any picture unclear without its word?',
  'What should we change first?',
  'Would you use this with your child or student? Why or why not?',
];

export interface Consent { adultConsent: boolean; parentalConsent: boolean; childAssent: boolean }

/** Adults sign their own consent form; a child needs a signed parental form and must agree themselves. */
export const consentComplete = (group: ParticipantGroup, consent: Consent) =>
  group === 'child' ? consent.parentalConsent && consent.childAssent : consent.adultConsent;
