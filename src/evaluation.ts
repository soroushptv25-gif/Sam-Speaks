import { interviewQuestions, meetsTarget, susItems } from './study';
import type { ActiveStudyTask, AppState, InterviewNote, StudyRecord, SusResponse } from './types';

const RECORDS_KEY = 'sam-speaks-study-records';
const SUS_KEY = 'sam-speaks-sus';
const INTERVIEW_KEY = 'sam-speaks-interviews';

function loadList<T>(key: string): T[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) ?? '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
function saveList<T>(key: string, items: T[]) {
  try { localStorage.setItem(key, JSON.stringify(items)); } catch { /* storage blocked: data stays in memory */ }
}

export const loadStudyRecords = () => loadList<StudyRecord>(RECORDS_KEY);
export const saveStudyRecords = (records: StudyRecord[]) => saveList(RECORDS_KEY, records);
export const loadSus = () => loadList<SusResponse>(SUS_KEY);
export const saveSus = (items: SusResponse[]) => saveList(SUS_KEY, items);
export const loadInterviews = () => loadList<InterviewNote>(INTERVIEW_KEY);
export const saveInterviews = (items: InterviewNote[]) => saveList(INTERVIEW_KEY, items);

export function finishStudyTask(active: ActiveStudyTask, outcome: StudyRecord['outcome']): StudyRecord {
  const endedAt = new Date();
  return {
    id: `study-${Date.now()}`,
    participantCode: active.participantCode,
    participantGroup: active.participantGroup,
    session: active.session,
    taskId: active.taskId,
    consent: active.consent,
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

export const toCsv = (rows: (string | number)[][]) => rows.map((row) => row.map(csvCell).join(',')).join('\n');

function downloadCsv(rows: (string | number)[][], name: string) {
  downloadBlob(new Blob(['﻿' + toCsv(rows)], { type: 'text/csv;charset=utf-8' }), `sam-speaks-${name}-${new Date().toISOString().slice(0, 10)}.csv`);
}

export function studyCsvRows(records: StudyRecord[]) {
  const header = ['participant_code', 'participant_group', 'session', 'task', 'outcome', 'target_met', 'duration_seconds', 'taps', 'undos', 'errors', 'consent', 'started_at', 'ended_at'];
  return [header, ...records.map((record) => [
    record.participantCode, record.participantGroup ?? '', record.session ?? '', record.task, record.outcome, meetsTarget(record) ? 'yes' : 'no',
    record.durationSeconds, record.taps, record.undos, record.errors, record.consent ?? '', record.startedAt, record.endedAt,
  ])];
}

export const downloadStudyCsv = (records: StudyRecord[]) => downloadCsv(studyCsvRows(records), 'usability-tasks');

export const downloadSusCsv = (items: SusResponse[]) => downloadCsv([
  ['participant_code', 'participant_group', 'date', ...susItems.map((_, index) => `q${index + 1}`), 'sus_score'],
  ...items.map((item) => [item.participantCode, item.participantGroup, item.date, ...item.answers, item.score]),
], 'sus');

export const downloadInterviewCsv = (items: InterviewNote[]) => downloadCsv([
  ['participant_code', 'participant_group', 'date', ...interviewQuestions],
  ...items.map((item) => [item.participantCode, item.participantGroup, item.date, ...item.answers]),
], 'post-test-interview');

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
