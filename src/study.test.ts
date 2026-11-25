import { describe, expect, it } from 'vitest';
import { consentComplete, goalResult, meetsTarget, susScore } from './study';
import { studyCsvRows } from './evaluation';
import type { StudyRecord } from './types';

const record = (over: Partial<StudyRecord>): StudyRecord => ({
  id: 'r', participantCode: 'P01', task: 'Add a photo card (first time)', taskId: 'add-photo', startedAt: '', endedAt: '',
  outcome: 'success', taps: 0, undos: 0, errors: 0, durationSeconds: 90, ...over,
});

describe('SUS scoring', () => {
  it('scores the best possible answers as 100 and the worst as 0', () => {
    expect(susScore([5, 1, 5, 1, 5, 1, 5, 1, 5, 1])).toBe(100);
    expect(susScore([1, 5, 1, 5, 1, 5, 1, 5, 1, 5])).toBe(0);
  });
  it('scores all neutral answers as 50', () => {
    expect(susScore(Array(10).fill(3))).toBe(50);
  });
  it('returns null until all ten are answered', () => {
    expect(susScore([5, 1, 5, 1, 5, 1, 5, 1, 5, null])).toBeNull();
  });
});

describe('usability targets', () => {
  it('learnability: a photo card under 2 minutes without help meets the target', () => {
    expect(meetsTarget(record({ durationSeconds: 119 }))).toBe(true);
    expect(meetsTarget(record({ durationSeconds: 121 }))).toBe(false);
    expect(meetsTarget(record({ outcome: 'assisted', durationSeconds: 60 }))).toBe(false);
  });
  it('board tasks also check the tap count', () => {
    expect(meetsTarget(record({ taskId: 'water', task: 'Ask for water', taps: 1 }))).toBe(true);
    expect(meetsTarget(record({ taskId: 'water', task: 'Ask for water', taps: 3 }))).toBe(false);
  });
  it('satisfaction passes when the mean SUS is at least 68', () => {
    expect(goalResult('Satisfaction', [], [70, 66]).passed).toBe(true);
    expect(goalResult('Satisfaction', [], [60, 70]).passed).toBe(false);
    expect(goalResult('Satisfaction', [], []).passed).toBeNull();
  });
  it('learnability needs 80% of attempts to meet the target', () => {
    const records = [record({}), record({}), record({}), record({}), record({ durationSeconds: 200 })];
    expect(goalResult('Learnability', records, []).rate).toBe(0.8);
    expect(goalResult('Learnability', records, []).passed).toBe(true);
  });
  it('the CSV marks whether each attempt met its target', () => {
    const rows = studyCsvRows([record({ durationSeconds: 200 })]);
    expect(rows[0]).toContain('target_met');
    expect(rows[1][rows[0].indexOf('target_met')]).toBe('no');
  });
});

describe('consent', () => {
  const none = { adultConsent: false, parentalConsent: false, childAssent: false };
  it('a child needs parental consent and their own agreement', () => {
    expect(consentComplete('child', { ...none, parentalConsent: true })).toBe(false);
    expect(consentComplete('child', { ...none, parentalConsent: true, childAssent: true })).toBe(true);
    expect(consentComplete('child', { ...none, adultConsent: true })).toBe(false);
  });
  it('an adult needs their own signed consent', () => {
    expect(consentComplete('teacher', none)).toBe(false);
    expect(consentComplete('teacher', { ...none, adultConsent: true })).toBe(true);
  });
});
