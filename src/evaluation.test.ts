import { describe, expect, it } from 'vitest';
import { finishStudyTask } from './evaluation';

describe('usability study records', () => {
  it('creates an anonymous completed record with captured metrics', () => {
    const record = finishStudyTask({
      participantCode: 'P03',
      task: 'Request water',
      startedAt: new Date(Date.now() - 5_000).toISOString(),
      taps: 3,
      undos: 1,
      errors: 1,
    }, 'assisted');

    expect(record.participantCode).toBe('P03');
    expect(record.task).toBe('Request water');
    expect(record.outcome).toBe('assisted');
    expect(record.durationSeconds).toBeGreaterThanOrEqual(5);
    expect(record).toMatchObject({ taps: 3, undos: 1, errors: 1 });
  });
});
