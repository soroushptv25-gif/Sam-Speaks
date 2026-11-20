import { useEffect, useState } from 'react';
import { LockKeyhole, Settings2, ShieldCheck, UserRound, Volume2, X } from 'lucide-react';
import { AdultArea } from './AdultArea';
import { ChildBoard, PracticeScreen } from './ChildBoard';
import { Dialog, WordTile } from './components';
import { defaultState, mergeWithStarterVocabulary } from './data';
import { finishStudyTask, loadStudyRecords, saveStudyRecords } from './evaluation';
import { loadState, saveState } from './storage';
import type { ActiveStudyTask, AppState, ChoiceSet, StudyRecord, VocabularyTile } from './types';
import './styles.css';

type Screen = 'welcome' | 'child' | 'adult' | 'practice';

function PinDialog({ pin, onClose, onUnlock }: { pin: string; onClose: () => void; onUnlock: () => void }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const check = (entry: string) => {
    if (entry === pin) return onUnlock();
    setError('That PIN does not match. Try again.');
    setValue('');
  };
  return (
    <Dialog labelledBy="pin-title" onClose={onClose} className="gate-card">
      <button className="icon-button modal-close" onClick={onClose} aria-label="Close"><X /></button>
      <div className="gate-icon"><LockKeyhole aria-hidden="true" /></div>
      <h2 id="pin-title">Grown-up PIN</h2>
      <p>Enter the 4-number PIN to change Sam’s board.</p>
      <form className="pin-form" onSubmit={(event) => { event.preventDefault(); check(value); }}>
        <label htmlFor="adult-pin" className="sr-only">4-number PIN</label>
        <input id="adult-pin" data-autofocus inputMode="numeric" type="password" autoComplete="off" maxLength={4} value={value}
          aria-invalid={Boolean(error)} aria-describedby={error ? 'pin-error' : undefined}
          onChange={(event) => { const next = event.target.value.replace(/\D/g, '').slice(0, 4); setValue(next); setError(''); if (next.length === 4) check(next); }} />
        {error && <span id="pin-error" className="pin-error" role="alert">{error}</span>}
        <button className="primary-button" type="submit" disabled={value.length !== 4}><LockKeyhole aria-hidden="true" /> Open setup</button>
      </form>
    </Dialog>
  );
}

function Welcome({ state, onChild, onAdult }: { state: AppState; onChild: () => void; onAdult: () => void }) {
  const tiles = ['i', 'want', 'water'].map((id) => state.vocabulary.find((tile) => tile.id === id)).filter((tile): tile is VocabularyTile => Boolean(tile));
  return (
    <main className="welcome-screen">
      <section className="welcome-copy">
        <div className="brand-mark"><span className="brand-dot">S</span><span>Sam Speaks</span></div>
        <h1>Pictures that speak for Sam.</h1>
        <p className="welcome-lede">A calm picture board Sam can tap to say what Sam needs, with simple tools for the grown-ups who help.</p>
        <div className="welcome-actions">
          <button className="primary-button big" onClick={onChild}><UserRound aria-hidden="true" /> Open Sam’s board</button>
          <button className="secondary-button big" onClick={onAdult}><Settings2 aria-hidden="true" /> Grown-up setup</button>
        </div>
        <p className="privacy-note"><ShieldCheck aria-hidden="true" /><span>No account. No cloud. Sam’s words and photos stay on this device.</span></p>
      </section>
      <section className="welcome-preview" aria-hidden="true">
        <div className="welcome-tiles">{tiles.map((tile) => <WordTile key={tile.id} tile={tile} labels variant="compact" />)}</div>
        <div className="speech-bubble">I want water <Volume2 /></div>
      </section>
    </main>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [state, setState] = useState<AppState>(defaultState);
  const [hydrated, setHydrated] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const [activeSet, setActiveSet] = useState<ChoiceSet | null>(null);
  const [practice, setPractice] = useState<VocabularyTile[]>([]);
  const [activeStudy, setActiveStudy] = useState<ActiveStudyTask | null>(null);
  const [studyRecords, setStudyRecords] = useState<StudyRecord[]>(() => loadStudyRecords());

  useEffect(() => {
    loadState()
      .then((saved) => {
        const next = saved ? mergeWithStarterVocabulary(saved) : defaultState;
        setState(next);
        // After the first visit the app opens straight on Sam's board, never on a page of text.
        if (next.seenWelcome) setScreen('child');
      })
      .catch(() => undefined)
      .finally(() => setHydrated(true));
  }, []);
  useEffect(() => { if (hydrated) saveState(state).catch(() => undefined); }, [state, hydrated]);
  useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', state.highContrast);
    document.documentElement.classList.toggle('reduce-motion', state.reducedMotion);
  }, [state.highContrast, state.reducedMotion]);

  const enterFullscreen = () => {
    if (!state.fullscreen || document.fullscreenElement || !document.documentElement.requestFullscreen) return;
    document.documentElement.requestFullscreen().catch(() => undefined);
  };
  const leaveFullscreen = () => { if (document.fullscreenElement) document.exitFullscreen().catch(() => undefined); };

  const openBoard = () => {
    setState((current) => (current.seenWelcome ? current : { ...current, seenWelcome: true }));
    enterFullscreen();
    setScreen('child');
  };
  const unlock = () => { setPinOpen(false); leaveFullscreen(); setActiveSet(null); setScreen('adult'); };

  const startStudy = (participantCode: string, task: string) => {
    setActiveStudy({ participantCode, task, startedAt: new Date().toISOString(), taps: 0, undos: 0, errors: 0 });
    if (!task.toLowerCase().includes('grown-up')) openBoard();
  };
  const logStudyMetric = (metric: 'tap' | 'undo' | 'error') => setActiveStudy((current) => current ? {
    ...current,
    taps: current.taps + (metric === 'tap' ? 1 : 0),
    undos: current.undos + (metric === 'undo' ? 1 : 0),
    errors: current.errors + (metric === 'error' ? 1 : 0),
  } : current);
  const completeStudy = (outcome: StudyRecord['outcome']) => {
    if (!activeStudy) return;
    const next = [...studyRecords, finishStudyTask(activeStudy, outcome)];
    setStudyRecords(next); saveStudyRecords(next); setActiveStudy(null);
  };

  if (!hydrated) return <div className="loading-screen"><div className="brand-dot">S</div><span>Getting Sam’s board ready…</span></div>;

  return <>
    <div className="app-screen">
      {screen === 'welcome' && <Welcome state={state} onChild={openBoard} onAdult={() => setPinOpen(true)} />}
      {screen === 'child' && <ChildBoard state={state} activeSet={activeSet} onEndActivity={() => setActiveSet(null)} onAdult={() => setPinOpen(true)}
        activeStudy={activeStudy} onStudyMetric={logStudyMetric} onFinishStudy={completeStudy} />}
      {screen === 'practice' && <PracticeScreen tiles={practice} state={state} onDone={() => { leaveFullscreen(); setScreen('adult'); }} />}
      {screen === 'adult' && <AdultArea state={state} setState={setState}
        onOpenBoard={openBoard} onWelcome={() => setScreen('welcome')}
        onPractice={(tiles) => { setPractice(tiles); enterFullscreen(); setScreen('practice'); }}
        onStartActivity={(set) => { setActiveSet(set); openBoard(); }}
        activeStudy={activeStudy} records={studyRecords}
        onStartStudy={startStudy} onClearRecords={() => { setStudyRecords([]); saveStudyRecords([]); }} />}
    </div>
    {activeStudy && screen === 'adult' && activeStudy.task.toLowerCase().includes('grown-up') && <aside className="study-strip floating" aria-label="Usability task recorder">
      <span><strong>Study task running</strong> {activeStudy.participantCode} · {activeStudy.task}</span>
      <div><button onClick={() => completeStudy('success')}>Success</button><button onClick={() => completeStudy('assisted')}>With help</button><button onClick={() => completeStudy('failed')}>Could not complete</button></div>
    </aside>}
    {pinOpen && <PinDialog pin={state.pin} onClose={() => setPinOpen(false)} onUnlock={unlock} />}
  </>;
}
