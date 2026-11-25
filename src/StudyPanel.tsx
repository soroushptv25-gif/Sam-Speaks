import { useState } from 'react';
import { CheckCircle2, ClipboardList, Download, FlaskConical, MessageSquareText, ShieldCheck, Target, Trash2 } from 'lucide-react';
import { downloadInterviewCsv, downloadStudyCsv, downloadSusCsv, loadInterviews, loadSus, saveInterviews, saveSus } from './evaluation';
import {
  consentComplete, goalResult, interviewQuestions, meetsTarget, participantGroups, studyTasks, SUS_TARGET, susItems, susScore, usabilityGoals,
  type Consent, type ParticipantGroup, type StudySession,
} from './study';
import type { ActiveStudyTask, InterviewNote, StudyRecord, SusResponse } from './types';

export interface StudyStart {
  participantCode: string; participantGroup: ParticipantGroup; session: StudySession; taskId: string; task: string; consent: string; startsOn: 'board' | 'adult';
}

const adultGroups = participantGroups.filter((group) => group.id !== 'child');
const today = () => new Date().toISOString().slice(0, 10);

export function StudyPanel({ active, records, onStart, onClear }: {
  active: ActiveStudyTask | null; records: StudyRecord[]; onStart: (start: StudyStart) => void; onClear: () => void;
}) {
  const [sus, setSus] = useState<SusResponse[]>(() => loadSus());
  const [interviews, setInterviews] = useState<InterviewNote[]>(() => loadInterviews());
  const susScores = sus.map((item) => item.score);

  return <div className="evaluation-layout">
    <GoalsCard records={records} susScores={susScores} />
    <TaskCard active={active} onStart={onStart} />
    <section className="evaluation-card">
      <div className="evaluation-heading"><h2>{records.length} task record{records.length === 1 ? '' : 's'}</h2><div className="data-actions"><button className="secondary-button" disabled={!records.length} onClick={() => downloadStudyCsv(records)}><Download aria-hidden="true" /> Export CSV</button><button className="text-button danger-text" disabled={!records.length} onClick={onClear}><Trash2 aria-hidden="true" /> Remove all</button></div></div>
      {records.length ? <div className="records-table" role="table" aria-label="Study records"><div className="record-row record-head" role="row"><span role="columnheader">Participant</span><span role="columnheader">Task</span><span role="columnheader">Outcome</span><span role="columnheader">Time</span><span role="columnheader">Taps</span><span role="columnheader">Errors</span><span role="columnheader">Target met</span></div>{records.map((record) => <div className="record-row" role="row" key={record.id}><strong role="cell">{record.participantCode}</strong><span role="cell">{record.task}{record.session === 'return' ? ' (return visit)' : ''}</span><span role="cell" className={`outcome ${record.outcome}`}>{record.outcome}</span><span role="cell">{record.durationSeconds}s</span><span role="cell">{record.taps}</span><span role="cell">{record.errors}</span><span role="cell">{meetsTarget(record) ? 'Yes' : 'No'}</span></div>)}</div> : <div className="empty-state compact"><FlaskConical aria-hidden="true" /><h3>No test data yet</h3><p>Run a real session with consent, then export the anonymous data for analysis.</p></div>}
    </section>
    <SusCard items={sus} onSave={(item) => { const next = [...sus, item]; setSus(next); saveSus(next); }} onClear={() => { setSus([]); saveSus([]); }} />
    <InterviewCard items={interviews} onSave={(item) => { const next = [...interviews, item]; setInterviews(next); saveInterviews(next); }} onClear={() => { setInterviews([]); saveInterviews([]); }} />
    <aside className="explain-card"><ShieldCheck aria-hidden="true" /><p><strong>Use anonymous codes only.</strong> Never type names. Everything here stays on this device until you export it. Stop any session straight away if a child seems upset or wants to stop.</p></aside>
  </div>;
}

function GoalsCard({ records, susScores }: { records: StudyRecord[]; susScores: number[] }) {
  return <section className="evaluation-card">
    <h2><Target aria-hidden="true" className="heading-icon" /> Usability targets</h2>
    <p>Each usability goal has a number to meet. Results fill in as you record tasks and SUS answers.</p>
    <div className="records-table" role="table" aria-label="Usability targets">
      <div className="goal-row record-head" role="row"><span role="columnheader">Goal</span><span role="columnheader">Target</span><span role="columnheader">Result</span></div>
      {usabilityGoals.map((goal) => {
        const result = goalResult(goal.attribute, records, susScores);
        const text = result.rate === null ? 'No data yet'
          : goal.attribute === 'Satisfaction' ? `Mean SUS ${result.rate.toFixed(1)} from ${result.attempts} ${result.attempts === 1 ? 'person' : 'people'}`
          : `${result.met} of ${result.attempts} met (${Math.round(result.rate * 100)}%)`;
        return <div className="goal-row" role="row" key={goal.attribute}>
          <strong role="cell">{goal.attribute}</strong>
          <span role="cell">{goal.target}<small>{goal.measure}</small></span>
          <span role="cell" className={`goal-result ${result.passed === null ? '' : result.passed ? 'met' : 'missed'}`}>{result.passed !== null && (result.passed ? 'Met: ' : 'Not met: ')}{text}</span>
        </div>;
      })}
    </div>
  </section>;
}

function TaskCard({ active, onStart }: { active: ActiveStudyTask | null; onStart: (start: StudyStart) => void }) {
  const [participant, setParticipant] = useState('P01');
  const [group, setGroup] = useState<ParticipantGroup>('parent');
  const [session, setSession] = useState<StudySession>('first');
  const [taskId, setTaskId] = useState(studyTasks[0].id);
  const [consent, setConsent] = useState<Consent>({ adultConsent: false, parentalConsent: false, childAssent: false });
  const task = studyTasks.find((item) => item.id === taskId) ?? studyTasks[0];
  const consentOk = consentComplete(group, consent);
  const canStart = participant.trim() && consentOk && !active;
  const tick = (key: keyof Consent) => setConsent((current) => ({ ...current, [key]: !current[key] }));
  const start = () => {
    const consentText = group === 'child' ? 'parental consent signed; child agreed' : 'adult consent signed';
    onStart({ participantCode: participant.trim(), participantGroup: group, session, taskId: task.id, task: task.label, consent: consentText, startsOn: task.startsOn });
    setConsent({ adultConsent: false, parentalConsent: false, childAssent: false });
  };
  return <section className="evaluation-card">
    <h2>Run one task</h2>
    <p>Sam Speaks records time, taps, undo actions and errors, and checks the result against the task’s target.</p>
    <div className="form-grid three">
      <label>Participant code<input value={participant} maxLength={12} onChange={(event) => setParticipant(event.target.value)} placeholder="P01" /></label>
      <label>Who is taking part<select value={group} onChange={(event) => { setGroup(event.target.value as ParticipantGroup); setConsent({ adultConsent: false, parentalConsent: false, childAssent: false }); }}>
        {participantGroups.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
      </select></label>
      <label>Task<select value={taskId} onChange={(event) => { const next = studyTasks.find((item) => item.id === event.target.value); setTaskId(event.target.value); if (next?.session) setSession(next.session); }}>
        {studyTasks.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
      </select></label>
    </div>
    <div className="setting-row"><div><strong>Visit</strong><span>A return visit, about a week later, measures memorability.</span></div><div className="segmented" role="group" aria-label="Visit"><button className={session === 'first' ? 'active' : ''} aria-pressed={session === 'first'} onClick={() => setSession('first')}>First visit</button><button className={session === 'return' ? 'active' : ''} aria-pressed={session === 'return'} onClick={() => setSession('return')}>Return visit</button></div></div>
    <p className="task-target"><Target aria-hidden="true" /><span><strong>{task.attribute} target:</strong> {task.target}</span></p>
    <fieldset className="consent-box">
      <legend>Consent (required before starting)</legend>
      {group === 'child' ? <>
        <label><input type="checkbox" checked={consent.parentalConsent} onChange={() => tick('parentalConsent')} /> A parent or guardian has signed the parental consent form</label>
        <label><input type="checkbox" checked={consent.childAssent} onChange={() => tick('childAssent')} /> The child agreed to take part and knows they can stop at any time</label>
      </> : <label><input type="checkbox" checked={consent.adultConsent} onChange={() => tick('adultConsent')} /> The participant has read and signed the consent form</label>}
    </fieldset>
    <button className="primary-button" disabled={!canStart} onClick={start}><FlaskConical aria-hidden="true" /> {task.startsOn === 'board' ? 'Start task on Sam’s board' : 'Start task in the grown-up area'}</button>
    {!consentOk && !active && <p className="form-hint">Tick the consent {group === 'child' ? 'boxes' : 'box'} to start.</p>}
    {active && <p className="active-study-note"><FlaskConical aria-hidden="true" /><span><strong>Recording {active.participantCode}</strong> {active.task}</span></p>}
  </section>;
}

function SusCard({ items, onSave, onClear }: { items: SusResponse[]; onSave: (item: SusResponse) => void; onClear: () => void }) {
  const [participant, setParticipant] = useState('P01');
  const [group, setGroup] = useState<ParticipantGroup>('parent');
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(10).fill(null));
  const score = susScore(answers);
  const mean = items.length ? items.reduce((sum, item) => sum + item.score, 0) / items.length : null;
  const save = () => {
    if (score === null || !participant.trim()) return;
    onSave({ id: `sus-${Date.now()}`, participantCode: participant.trim(), participantGroup: group, answers: answers as number[], score, date: today() });
    setAnswers(Array(10).fill(null));
  };
  return <section className="evaluation-card">
    <div className="evaluation-heading"><h2><ClipboardList aria-hidden="true" className="heading-icon" /> System Usability Scale (SUS)</h2><div className="data-actions"><button className="secondary-button" disabled={!items.length} onClick={() => downloadSusCsv(items)}><Download aria-hidden="true" /> Export CSV</button><button className="text-button danger-text" disabled={!items.length} onClick={onClear}><Trash2 aria-hidden="true" /> Remove all</button></div></div>
    <p>Give this to each adult after the tasks. 1 means strongly disagree and 5 means strongly agree. Target: a mean score of {SUS_TARGET} or more.</p>
    {mean !== null && <p className="active-study-note"><CheckCircle2 aria-hidden="true" /><span><strong>Mean SUS {mean.toFixed(1)}</strong> from {items.length} {items.length === 1 ? 'person' : 'people'}: {mean >= SUS_TARGET ? 'target met' : 'below the target'}</span></p>}
    <div className="form-grid two">
      <label>Participant code<input value={participant} maxLength={12} onChange={(event) => setParticipant(event.target.value)} /></label>
      <label>Who answered<select value={group} onChange={(event) => setGroup(event.target.value as ParticipantGroup)}>{adultGroups.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
    </div>
    <ol className="sus-list">
      {susItems.map((statement, index) => <li key={statement}>
        <fieldset><legend><strong>{index + 1}.</strong> {statement}</legend>
          <div className="sus-scale">{[1, 2, 3, 4, 5].map((value) => <label key={value} className={answers[index] === value ? 'chosen' : ''}>
            <input type="radio" name={`sus-${index}`} value={value} checked={answers[index] === value} onChange={() => setAnswers((current) => current.map((answer, i) => i === index ? value : answer))} />
            <span>{value}</span>
          </label>)}</div>
        </fieldset>
      </li>)}
    </ol>
    <div className="evaluation-heading"><strong>{score === null ? `${answers.filter((answer) => answer !== null).length} of 10 answered` : `Score: ${score}`}</strong><button className="primary-button" disabled={score === null || !participant.trim()} onClick={save}>Save SUS answers</button></div>
  </section>;
}

function InterviewCard({ items, onSave, onClear }: { items: InterviewNote[]; onSave: (item: InterviewNote) => void; onClear: () => void }) {
  const [participant, setParticipant] = useState('P01');
  const [group, setGroup] = useState<ParticipantGroup>('parent');
  const [answers, setAnswers] = useState<string[]>(() => interviewQuestions.map(() => ''));
  const filled = answers.some((answer) => answer.trim());
  const save = () => {
    onSave({ id: `int-${Date.now()}`, participantCode: participant.trim(), participantGroup: group, answers: answers.map((answer) => answer.trim()), date: today() });
    setAnswers(interviewQuestions.map(() => ''));
  };
  return <section className="evaluation-card">
    <div className="evaluation-heading"><h2><MessageSquareText aria-hidden="true" className="heading-icon" /> Post-test interview</h2><div className="data-actions"><button className="secondary-button" disabled={!items.length} onClick={() => downloadInterviewCsv(items)}><Download aria-hidden="true" /> Export CSV ({items.length})</button><button className="text-button danger-text" disabled={!items.length} onClick={onClear}><Trash2 aria-hidden="true" /> Remove all</button></div></div>
    <p>Ask these five questions after SUS, and write short notes. Do not write names or medical details.</p>
    <div className="form-grid two">
      <label>Participant code<input value={participant} maxLength={12} onChange={(event) => setParticipant(event.target.value)} /></label>
      <label>Who answered<select value={group} onChange={(event) => setGroup(event.target.value as ParticipantGroup)}>{participantGroups.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
    </div>
    {interviewQuestions.map((question, index) => <label className="stack-label" key={question}>{index + 1}. {question}
      <textarea rows={2} value={answers[index]} onChange={(event) => setAnswers((current) => current.map((answer, i) => i === index ? event.target.value : answer))} />
    </label>)}
    <button className="primary-button" disabled={!filled || !participant.trim()} onClick={save}>Save interview notes</button>
  </section>;
}
