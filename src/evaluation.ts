import type { ActiveStudyTask, AppState, StudyRecord } from './types';

const RECORDS_KEY = 'sam-speaks-study-records';

export function loadStudyRecords(): StudyRecord[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(RECORDS_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStudyRecords(records: StudyRecord[]) {
  try { localStorage.setItem(RECORDS_KEY, JSON.stringify(records)); } catch { /* storage blocked: records stay in memory */ }
}

export function finishStudyTask(active: ActiveStudyTask, outcome: StudyRecord['outcome']): StudyRecord {
  const endedAt = new Date();
  return {
    id: `study-${Date.now()}`,
    participantCode: active.participantCode,
    task: active.task,
    startedAt: active.startedAt,
    endedAt: endedAt.toISOString(),
    outcome,
    taps: active.taps,
    undos: active.undos,
    errors: active.errors,
    durationSeconds: Math.max(1, Math.round((endedAt.getTime() - new Date(active.startedAt).getTime()) / 1000)),
  };
}

const csvCell = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadStudyCsv(records: StudyRecord[]) {
  const header = ['participant_code', 'task', 'outcome', 'duration_seconds', 'taps', 'undos', 'errors', 'started_at', 'ended_at'];
  const rows = records.map((record) => [
    record.participantCode, record.task, record.outcome, record.durationSeconds,
    record.taps, record.undos, record.errors, record.startedAt, record.endedAt,
  ]);
  const csv = [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\n');
  downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), `sam-speaks-usability-${new Date().toISOString().slice(0, 10)}.csv`);
}

const BOARD_FILE = 'sam-speaks-board.json';

/** The shared file never carries the grown-up PIN; the receiving device keeps its own. */
export function boardFile(state: AppState) {
  const { pin: _pin, seenWelcome: _seen, ...shareable } = state;
  return new File([JSON.stringify(shareable, null, 2)], BOARD_FILE, { type: 'application/json' });
}

/**
 * One-step sharing (Phase 1: "sharing a board should be one step").
 * Uses the phone's share sheet (WhatsApp, Messages, email) when the browser
 * supports it, and otherwise saves the file so it can be sent by hand.
 */
export async function shareBoard(state: AppState): Promise<'shared' | 'saved' | 'cancelled'> {
  const file = boardFile(state);
  const nav = navigator as Navigator & { canShare?: (data: ShareData) => boolean };
  if (nav.share && nav.canShare?.({ files: [file] })) {
    try {
      await nav.share({ files: [file], title: 'Sam’s picture board', text: 'Open this in Sam Speaks to use the same pictures.' });
      return 'shared';
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled';
    }
  }
  downloadBlob(file, BOARD_FILE);
  return 'saved';
}
