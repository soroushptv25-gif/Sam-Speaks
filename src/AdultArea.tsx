import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  ArrowLeftRight, Camera, Check, ChevronLeft, CircleHelp, Download, Eye, EyeOff, FileUp, FlaskConical,
  GraduationCap, Home, ImagePlus, Layers, LayoutGrid, Pencil, Play, Plus, Printer, RotateCcw, Search,
  Settings2, Shapes, Share2, ShieldCheck, Trash2, Volume2, X,
} from 'lucide-react';
import { categoryTone, ConfirmDialog, EmptySlot, symbolLibrary, WordTile } from './components';
import { SymbolArt } from './SymbolArt';
import { BOARD_SIZE, boardSlots, nextOrder, nextPhrase, placeInSlot, removeEverywhere, slotIndexOf, swapSlots, tilesForCategory } from './board';
import { categories, defaultState, mergeWithStarterVocabulary } from './data';
import { shareBoard } from './evaluation';
import { StudyPanel, type StudyStart } from './StudyPanel';
import { photoToCard } from './photo';
import { speak } from './speech';
import { clearState } from './storage';
import type { ActiveStudyTask, AdultRole, AppState, BoardContext, Category, ChoiceSet, Context, StudyRecord, SymbolName, VocabularyTile } from './types';

type Tab = 'words' | 'add' | 'board' | 'sets' | 'share' | 'settings' | 'study' | 'about';
type SetState = React.Dispatch<React.SetStateAction<AppState>>;
interface Toast { text: string; action?: { label: string; run: () => void } }

const tabTitles: Record<Tab, string> = {
  words: 'Sam’s pictures', add: 'Add a picture', board: 'Main board', sets: 'Choice sets and practice',
  share: 'Share and print', settings: 'Settings', study: 'Usability study', about: 'Design and privacy',
};

const contextName = (context: Context) => (context === 'both' ? 'Home and School' : context === 'home' ? 'Home' : 'School');

export function AdultArea({ state, setState, onOpenBoard, onWelcome, onPractice, onStartActivity, activeStudy, records, onStartStudy, onClearRecords }: {
  state: AppState; setState: SetState;
  onOpenBoard: () => void; onWelcome: () => void;
  onPractice: (tiles: VocabularyTile[]) => void;
  onStartActivity: (set: ChoiceSet) => void;
  activeStudy: ActiveStudyTask | null; records: StudyRecord[];
  onStartStudy: (start: StudyStart) => void; onClearRecords: () => void;
}) {
  const [tab, setTab] = useState<Tab>('words');
  const [editing, setEditing] = useState<VocabularyTile | null>(null);
  const [highlightId, setHighlightId] = useState<string>();
  const [toast, setToast] = useState<Toast | null>(null);
  const [confirm, setConfirm] = useState<{ title: string; body: string; label: string; run: () => void } | null>(null);

  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(null), toast.action ? 7000 : 3500); return () => window.clearTimeout(timer); }, [toast]);

  const go = (next: Tab) => { if (next === 'add') setEditing(null); setTab(next); };
  const practiseTile = (tile: VocabularyTile) => onPractice([tile]);

  const saveTile = (tile: VocabularyTile, slotChoices: Partial<Record<BoardContext, number>>) => {
    setState((current) => {
      let slots = current.slots;
      (Object.entries(slotChoices) as [BoardContext, number][]).forEach(([context, index]) => { slots = placeInSlot(slots, context, index, tile.id); });
      const exists = current.vocabulary.some((item) => item.id === tile.id);
      return { ...current, slots, vocabulary: exists ? current.vocabulary.map((item) => (item.id === tile.id ? tile : item)) : [...current.vocabulary, tile] };
    });
    setEditing(null);
    setTab('words');
    setHighlightId(tile.id);
    setToast({ text: `“${tile.label}” saved.`, action: { label: 'Practise it with Sam', run: () => practiseTile(tile) } });
  };

  const toggleHidden = (tile: VocabularyTile) => {
    setState((current) => ({ ...current, vocabulary: current.vocabulary.map((item) => (item.id === tile.id ? { ...item, hidden: !item.hidden } : item)) }));
    setToast({ text: tile.hidden ? `“${tile.label}” is back on Sam’s board, in the same spot.` : `“${tile.label}” is hidden. Its spot stays empty so nothing else moves.` });
  };

  const deleteTile = (tile: VocabularyTile) => setConfirm({
    title: `Delete “${tile.label}”?`,
    body: 'This removes the picture from this device. Its spot on the main board stays empty, so other pictures do not move.',
    label: 'Delete picture',
    run: () => {
      setState((current) => ({
        ...current,
        vocabulary: current.vocabulary.filter((item) => item.id !== tile.id),
        slots: removeEverywhere(current.slots, tile.id),
        choiceSets: current.choiceSets.map((set) => ({ ...set, tileIds: set.tileIds.filter((id) => id !== tile.id) })),
      }));
      setToast({ text: `“${tile.label}” deleted.` });
    },
  });

  const resetData = () => setConfirm({
    title: 'Start again with the starter pictures?',
    body: 'This removes added photos, choice sets and settings from this device, and sets the PIN back to the demo PIN. Study records are kept.',
    label: 'Reset everything',
    run: async () => { await clearState(); setState({ ...defaultState, seenWelcome: true }); setToast({ text: 'Demo data reset.' }); },
  });

  const nav: { group: string; items: { id: Tab; icon: ReactNode; label: string }[] }[] = [
    { group: 'Sam’s words', items: [
      { id: 'words', icon: <LayoutGrid />, label: 'Sam’s pictures' },
      { id: 'add', icon: <Plus />, label: 'Add a picture' },
      { id: 'board', icon: <ArrowLeftRight />, label: 'Main board' },
      { id: 'sets', icon: <Layers />, label: 'Choice sets & practice' },
      { id: 'share', icon: <Share2 />, label: 'Share & print' },
    ] },
    { group: 'Setup', items: [{ id: 'settings', icon: <Settings2 />, label: 'Settings' }] },
    { group: 'Course project', items: [
      { id: 'study', icon: <FlaskConical />, label: 'Usability study' },
      { id: 'about', icon: <CircleHelp />, label: 'Design & privacy' },
    ] },
  ];

  return (
    <main className="adult-shell">
      <aside className="adult-sidebar">
        <button className="brand-button light" onClick={onWelcome} aria-label="Sam Speaks: show the welcome page"><span className="brand-dot">S</span><span>Sam Speaks</span></button>
        <nav className="adult-nav" aria-label="Setup sections">
          {nav.map((section) => <div className="nav-group" key={section.group}>
            <span className="nav-group-label">{section.group}</span>
            {section.items.map((item) => <button key={item.id} className={tab === item.id ? 'active' : ''} aria-current={tab === item.id ? 'page' : undefined} onClick={() => go(item.id)} title={item.label}>{item.icon}<span>{item.label}</span></button>)}
          </div>)}
        </nav>
        <div className="sidebar-bottom">
          <button className="view-child-button" onClick={onOpenBoard} title="Open Sam’s board"><ChevronLeft /><span>Open Sam’s board</span></button>
          <button className="reset-link" onClick={resetData} title="Reset demo data"><RotateCcw /><span>Reset demo data</span></button>
        </div>
      </aside>

      <section className="adult-main">
        <header className="adult-topbar"><h1>{tab === 'add' && editing ? `Edit “${editing.label}”` : tabTitles[tab]}</h1></header>
        {tab === 'words' && <WordLibrary state={state} highlightId={highlightId} onEdit={(tile) => { setEditing(tile); setTab('add'); }} onToggle={toggleHidden} onDelete={deleteTile} onPractise={practiseTile} onAdd={() => go('add')} />}
        {tab === 'add' && <TileForm key={editing?.id ?? 'new'} existing={editing} state={state} onSave={saveTile} onCancel={() => { setEditing(null); setTab('words'); }} />}
        {tab === 'board' && <BoardEditor state={state} setState={setState} />}
        {tab === 'sets' && <ChoiceSets state={state} setState={setState} onShow={onStartActivity} onPractise={onPractice} onToast={(text) => setToast({ text })} />}
        {tab === 'share' && <SharePrint state={state} setState={setState} onToast={(text) => setToast({ text })} />}
        {tab === 'settings' && <SettingsPanel state={state} setState={setState} onToast={(text) => setToast({ text })} />}
        {tab === 'study' && <StudyPanel active={activeStudy} records={records} onStart={onStartStudy} onClear={() => setConfirm({ title: 'Remove all study records?', body: 'Export the CSV first if you still need them. This cannot be undone.', label: 'Remove records', run: onClearRecords })} />}
        {tab === 'about' && <AboutPanel />}
      </section>

      {toast && <div className="toast" role="status"><Check aria-hidden="true" /><span>{toast.text}</span>
        {toast.action && <button onClick={() => { toast.action!.run(); setToast(null); }}>{toast.action.label}</button>}
        <button className="toast-close" onClick={() => setToast(null)} aria-label="Dismiss"><X /></button>
      </div>}
      {confirm && <ConfirmDialog title={confirm.title} body={<p>{confirm.body}</p>} confirmLabel={confirm.label} danger
        onCancel={() => setConfirm(null)} onConfirm={() => { confirm.run(); setConfirm(null); }} />}
    </main>
  );
}

function mainBoardSpots(state: AppState, id: string) {
  return (['home', 'school'] as BoardContext[])
    .map((context) => ({ context, index: slotIndexOf(state.slots, context, id) }))
    .filter((spot) => spot.index >= 0);
}

function WordLibrary({ state, highlightId, onEdit, onToggle, onDelete, onPractise, onAdd }: {
  state: AppState; highlightId?: string;
  onEdit: (tile: VocabularyTile) => void; onToggle: (tile: VocabularyTile) => void;
  onDelete: (tile: VocabularyTile) => void; onPractise: (tile: VocabularyTile) => void; onAdd: () => void;
}) {
  const [where, setWhere] = useState<'all' | 'home' | 'school' | 'hidden'>('all');
  const [category, setCategory] = useState<(typeof categories)[number]>('All');
  const [query, setQuery] = useState('');
  const highlighted = useRef<HTMLElement>(null);
  useEffect(() => { highlighted.current?.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, [highlightId]);

  const words = state.vocabulary
    .filter((tile) => (where === 'hidden' ? tile.hidden : !tile.hidden && (where === 'all' || tile.context === where || tile.context === 'both')))
    .filter((tile) => category === 'All' || tile.category === category)
    .filter((tile) => !query.trim() || `${tile.label} ${tile.phrase}`.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => a.order - b.order);

  return <div className="panel-stack">
    <div className="library-toolbar">
      <label className="search-field"><Search aria-hidden="true" /><span className="sr-only">Search pictures</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search pictures" /></label>
      <button className="primary-button" onClick={onAdd}><Plus /> Add a picture</button>
    </div>
    <div className="filter-row">
      <div className="segmented" role="group" aria-label="Which board">
        {(['all', 'home', 'school', 'hidden'] as const).map((item) => <button key={item} className={where === item ? 'active' : ''} aria-pressed={where === item} onClick={() => setWhere(item)}>{item === 'all' ? 'All' : item === 'hidden' ? 'Hidden' : contextName(item)}</button>)}
      </div>
      <label className="inline-select">Group<select value={category} onChange={(event) => setCategory(event.target.value as typeof category)}>{categories.map((item) => <option key={item} value={item}>{item === 'All' ? 'All groups' : item}</option>)}</select></label>
      <span className="result-count">{words.length} picture{words.length === 1 ? '' : 's'}</span>
    </div>
    <div className="word-list">
      {words.length ? words.map((tile) => {
        const spots = mainBoardSpots(state, tile.id);
        return <article ref={tile.id === highlightId ? highlighted : undefined} className={`library-card ${tile.hidden ? 'is-hidden' : ''} ${tile.id === highlightId ? 'is-new' : ''}`} key={tile.id}>
          <div className={`library-art tone-${categoryTone[tile.category]}`}><SymbolArt name={tile.symbol} image={tile.image} label={tile.label} decorative /></div>
          <div className="library-copy">
            <h3>{tile.label}</h3>
            <p>Says “{tile.phrase}”</p>
            <p className="library-meta">Group: {tile.category} · Shows on {contextName(tile.context)}{spots.length ? ` · Main board: ${spots.map((spot) => `${contextName(spot.context)} spot ${spot.index + 1}`).join(', ')}` : ''}{tile.image ? ' · Photo' : ''}</p>
          </div>
          <div className="library-actions">
            <button onClick={() => onPractise(tile)}><Play aria-hidden="true" /> Practise</button>
            <button onClick={() => onEdit(tile)}><Pencil aria-hidden="true" /> Edit</button>
            <button onClick={() => onToggle(tile)}>{tile.hidden ? <Eye aria-hidden="true" /> : <EyeOff aria-hidden="true" />} {tile.hidden ? 'Show again' : 'Hide'}</button>
            {tile.createdBy && <button className="danger-text" onClick={() => onDelete(tile)}><Trash2 aria-hidden="true" /> Delete</button>}
          </div>
        </article>;
      }) : <div className="empty-state"><Search /><h3>No pictures match</h3><p>Try another group or clear the search. Hidden pictures are under “Hidden”.</p></div>}
    </div>
  </div>;
}

function SlotPicker({ state, context, value, onChange }: { state: AppState; context: BoardContext; value: number | undefined; onChange: (index: number | undefined) => void }) {
  const slots = boardSlots(state, context);
  const chosen = value !== undefined ? slots[value] : null;
  return <div className="slot-picker">
    <div className="slot-picker-head"><strong>{contextName(context)} main board</strong>{value !== undefined && <button type="button" className="text-button" onClick={() => onChange(undefined)}>Don’t add</button>}</div>
    <div className="slot-grid">
      {slots.map((tile, index) => <button type="button" key={index} className={`slot ${value === index ? 'chosen' : ''} ${tile ? '' : 'is-empty'}`} aria-pressed={value === index}
        aria-label={tile ? `Spot ${index + 1}: ${tile.label}` : `Spot ${index + 1}: empty`} onClick={() => onChange(index)}>
        {tile ? <SymbolArt name={tile.symbol} image={tile.image} label={tile.label} decorative /> : <span>Empty</span>}
        <small>{index + 1}</small>
      </button>)}
    </div>
    <p className="field-note">{value === undefined ? 'Optional. Pick a spot to put this picture on the main board.'
      : chosen ? `Replaces “${chosen.label}” in spot ${value + 1}. “${chosen.label}” stays in ${chosen.category}; nothing else moves.`
      : `Goes into empty spot ${value + 1}. Nothing else moves.`}</p>
  </div>;
}

function TileForm({ existing, state, onSave, onCancel }: {
  existing: VocabularyTile | null; state: AppState;
  onSave: (tile: VocabularyTile, slots: Partial<Record<BoardContext, number>>) => void; onCancel: () => void;
}) {
  const [source, setSource] = useState<'photo' | 'drawing' | null>(existing ? (existing.image ? 'photo' : 'drawing') : null);
  const [image, setImage] = useState(existing?.image ?? '');
  const [symbol, setSymbol] = useState<SymbolName | null>(existing && !existing.image ? existing.symbol : null);
  const [symbolQuery, setSymbolQuery] = useState('');
  const [label, setLabel] = useState(existing?.label ?? '');
  const [phrase, setPhrase] = useState(existing?.phrase ?? '');
  const [phraseEdited, setPhraseEdited] = useState(Boolean(existing && existing.phrase !== existing.label));
  const [labelAr, setLabelAr] = useState(existing?.labelAr ?? '');
  const [phraseAr, setPhraseAr] = useState(existing?.phraseAr ?? '');
  const [category, setCategory] = useState<Category | ''>(existing?.category ?? '');
  const [context, setContext] = useState<Context>(existing?.context ?? 'home');
  const [role, setRole] = useState<AdultRole>(existing?.createdBy ?? 'Parent');
  const [slotChoice, setSlotChoice] = useState<Partial<Record<BoardContext, number>>>({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleFile = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    try {
      setImage(await photoToCard(file));
      setSource('photo');
      setError('');
    } catch (problem) {
      const reason = problem instanceof Error ? problem.message : '';
      setError(reason === 'not-image' ? 'That file is not a picture. Choose a photo (JPG, PNG or HEIC).' : reason === 'too-big' ? 'That photo is very large. Choose one under 25 MB.' : 'That photo could not be opened. Try taking it again.');
    } finally { setBusy(false); }
  };

  const filteredSymbols = symbolLibrary.filter((item) => !symbolQuery.trim() || `${item.label} ${item.words ?? ''} ${item.value}`.toLowerCase().includes(symbolQuery.trim().toLowerCase()));
  const contexts: BoardContext[] = context === 'both' ? ['home', 'school'] : [context];

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!image && !symbol) return setError('Step 1: take a photo, choose one, or pick a drawing.');
    if (!label.trim()) return setError('Step 2: type the word to show under the picture.');
    if (!category) return setError('Step 3: choose which group the picture belongs to.');
    const finalPhrase = phrase.trim() || label.trim();
    const duplicate = state.vocabulary.find((tile) => tile.id !== existing?.id && tile.label.toLowerCase() === label.trim().toLowerCase() && (tile.context === context || tile.context === 'both' || context === 'both'));
    if (duplicate) return setError(`There is already a picture called “${duplicate.label}”. Edit that one, or use a different word.`);
    const chosenSlots = Object.fromEntries(Object.entries(slotChoice).filter(([key]) => contexts.includes(key as BoardContext)));
    onSave({
      id: existing?.id ?? `custom-${Date.now()}`,
      label: label.trim(), phrase: finalPhrase,
      labelAr: labelAr.trim() || undefined, phraseAr: phraseAr.trim() || undefined,
      category, context, symbol: symbol ?? existing?.symbol ?? 'person', image: image || undefined,
      hidden: existing?.hidden ?? false, core: existing?.core,
      order: existing?.order ?? nextOrder(state.vocabulary), createdBy: existing?.createdBy ?? role,
    }, chosenSlots);
  };

  const preview: VocabularyTile = { id: 'preview', label: label || 'Your word', phrase: phrase || label || 'your word', category: category || 'Needs', context, symbol: symbol ?? 'person', image: image || undefined, order: 0 };
  const hasPicture = Boolean(image || symbol);

  return <form className="tile-form" onSubmit={submit} noValidate>
    <section className="form-card">
      <div className="step-title"><span>1</span><div><h2>Choose the picture</h2><p>A familiar photo or a simple drawing. Photos are cropped to a square for you.</p></div></div>
      <div className="source-choices">
        <label className={`source-card ${source === 'photo' && image ? 'active' : ''}`}><input type="file" accept="image/*" capture="environment" onChange={(event) => handleFile(event.target.files?.[0])} /><Camera aria-hidden="true" /><strong>Take a photo</strong><span>Uses the camera</span></label>
        <label className="source-card"><input type="file" accept="image/*" onChange={(event) => handleFile(event.target.files?.[0])} /><ImagePlus aria-hidden="true" /><strong>Choose a photo</strong><span>From this device</span></label>
        <button type="button" className={`source-card ${source === 'drawing' ? 'active' : ''}`} onClick={() => { setSource('drawing'); setImage(''); }} aria-pressed={source === 'drawing'}><Shapes aria-hidden="true" /><strong>Use a drawing</strong><span>{symbolLibrary.length} to choose from</span></button>
      </div>
      {busy && <p className="field-note" role="status">Preparing the photo…</p>}
      {source === 'drawing' && <div className="drawing-picker">
        <label className="search-field"><Search aria-hidden="true" /><span className="sr-only">Search drawings</span><input value={symbolQuery} onChange={(event) => setSymbolQuery(event.target.value)} placeholder="Search drawings, for example “park”" /></label>
        <div className="symbol-choice-grid" role="group" aria-label="Drawings">
          {filteredSymbols.map((choice) => <button type="button" key={choice.value} className={symbol === choice.value ? 'active' : ''} aria-pressed={symbol === choice.value}
            onClick={() => { setSymbol(choice.value); setImage(''); setError(''); }}><SymbolArt name={choice.value} label={choice.label} decorative /><span>{choice.label}</span></button>)}
          {!filteredSymbols.length && <p className="field-note">No drawing matches. Try a photo instead.</p>}
        </div>
      </div>}
    </section>

    <section className="form-card">
      <div className="step-title"><span>2</span><div><h2>Name it</h2><p>The word under the picture, and what Sam’s tablet says out loud.</p></div></div>
      <div className="form-grid two">
        <label>Word under the picture<input value={label} maxLength={24} onChange={(event) => { setLabel(event.target.value); setPhrase((current) => nextPhrase(event.target.value, current, phraseEdited)); }} placeholder="park" /></label>
        <label>Sam’s tablet says<input value={phrase} maxLength={60} onChange={(event) => { setPhrase(event.target.value); setPhraseEdited(event.target.value !== '' ); }} placeholder="I want to go to the park" /></label>
      </div>
      <details className="language-details" open={Boolean(labelAr || phraseAr)}>
        <summary>Arabic words (optional)</summary>
        <div className="form-grid two" dir="rtl" lang="ar">
          <label>الكلمة تحت الصورة<input value={labelAr} maxLength={24} onChange={(event) => setLabelAr(event.target.value)} /></label>
          <label>ما يقوله الجهاز<input value={phraseAr} maxLength={60} onChange={(event) => setPhraseAr(event.target.value)} /></label>
        </div>
      </details>
    </section>

    <section className="form-card">
      <div className="step-title"><span>3</span><div><h2>Where does it go?</h2><p>The group Sam finds it in, and which board shows it.</p></div></div>
      <div className="form-grid three">
        <label>Group<select value={category} onChange={(event) => setCategory(event.target.value as Category)}><option value="" disabled>Choose a group</option>{categories.filter((item) => item !== 'All').map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Show on<select value={context} onChange={(event) => setContext(event.target.value as Context)}><option value="home">Home only</option><option value="school">School only</option><option value="both">Home and School</option></select></label>
        {!existing && <label>Added by<select value={role} onChange={(event) => { const next = event.target.value as AdultRole; setRole(next); if (next === 'Teacher') setContext('school'); }}><option>Parent</option><option>Teacher</option><option>Therapist</option></select></label>}
      </div>
      <div className="slot-pickers">{contexts.map((item) => <SlotPicker key={item} state={state} context={item} value={slotChoice[item]} onChange={(index) => setSlotChoice((current) => ({ ...current, [item]: index }))} />)}</div>
    </section>

    <aside className="live-preview" aria-label="Preview">
      <h3>Sam will see</h3>
      {hasPicture ? <WordTile tile={preview} labels variant="compact" /> : <div className="preview-placeholder"><ImagePlus aria-hidden="true" /><span>Choose a picture in step 1</span></div>}
      <button type="button" className="preview-speech" onClick={() => speak(preview.phrase, 'en')} disabled={!label}><Volume2 aria-hidden="true" /> Hear “{preview.phrase}”</button>
    </aside>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="form-actions"><button type="button" className="secondary-button" onClick={onCancel}>Cancel</button><button className="primary-button" type="submit" disabled={busy}><Check aria-hidden="true" /> Save picture</button></div>
  </form>;
}

function BoardEditor({ state, setState }: { state: AppState; setState: SetState }) {
  const [context, setContext] = useState<BoardContext>('home');
  const [selected, setSelected] = useState<number>();
  const slots = boardSlots(state, context);
  const candidates = tilesForCategory(state, context, 'All');
  const clickSlot = (index: number) => {
    if (selected === undefined) return setSelected(index);
    if (selected === index) return setSelected(undefined);
    setState((current) => ({ ...current, slots: swapSlots(current.slots, context, selected, index) }));
    setSelected(undefined);
  };
  const put = (id: string | null) => {
    if (selected === undefined) return;
    setState((current) => ({ ...current, slots: placeInSlot(current.slots, context, selected, id) }));
  };
  return <div className="panel-stack">
    <div className="explain-card"><ShieldCheck aria-hidden="true" /><p><strong>Each picture keeps its spot.</strong> Sam learns where pictures are by position, so they only move when you move them here. Adding, hiding or deleting a picture never shifts the others.</p></div>
    <div className="segmented" role="group" aria-label="Which board">
      <button className={context === 'home' ? 'active' : ''} aria-pressed={context === 'home'} onClick={() => { setContext('home'); setSelected(undefined); }}><Home /> Home</button>
      <button className={context === 'school' ? 'active' : ''} aria-pressed={context === 'school'} onClick={() => { setContext('school'); setSelected(undefined); }}><GraduationCap /> School</button>
    </div>
    <div className="board-editor">
      <div className="editor-grid">{slots.map((tile, index) => <button key={index} className={`editor-slot ${selected === index ? 'chosen' : ''} ${tile ? '' : 'is-empty'}`} aria-pressed={selected === index} onClick={() => clickSlot(index)}
        aria-label={`Spot ${index + 1}: ${tile ? tile.label : 'empty'}`}>
        {tile ? <WordTile tile={tile} labels variant="compact" /> : <EmptySlot />}<small>{index + 1}</small></button>)}</div>
      <div className="editor-side">
        {selected === undefined
          ? <p className="field-note">Tap a spot to choose it. Then tap another spot to swap the two, or pick a different picture for it below.</p>
          : <>
            <h2>Spot {selected + 1}</h2>
            <p className="field-note">Tap another spot to swap. Or:</p>
            <label className="stack-label">Put this picture here<select value={state.slots[context][selected] ?? ''} onChange={(event) => put(event.target.value || null)}>
              <option value="">Leave empty</option>
              {candidates.map((tile) => <option key={tile.id} value={tile.id}>{tile.label} ({tile.category})</option>)}
            </select></label>
            <button className="secondary-button" onClick={() => setSelected(undefined)}>Done</button>
          </>}
        <p className="field-note">Main board: {slots.filter(Boolean).length} of {BOARD_SIZE} spots used.</p>
      </div>
    </div>
  </div>;
}

function ChoiceSets({ state, setState, onShow, onPractise, onToast }: {
  state: AppState; setState: SetState; onShow: (set: ChoiceSet) => void; onPractise: (tiles: VocabularyTile[]) => void; onToast: (text: string) => void;
}) {
  const [editing, setEditing] = useState<ChoiceSet | null>(null);
  const tilesOf = (set: ChoiceSet) => set.tileIds.map((id) => state.vocabulary.find((tile) => tile.id === id)).filter((tile): tile is VocabularyTile => Boolean(tile));
  const save = (set: ChoiceSet) => {
    setState((current) => ({ ...current, choiceSets: current.choiceSets.some((item) => item.id === set.id) ? current.choiceSets.map((item) => (item.id === set.id ? set : item)) : [...current.choiceSets, set] }));
    setEditing(null);
    onToast(`“${set.name}” saved.`);
  };
  if (editing) return <ChoiceSetEditor set={editing} state={state} onSave={save} onCancel={() => setEditing(null)} />;
  return <div className="panel-stack">
    <div className="explain-card"><Layers aria-hidden="true" /><p><strong>Show Sam just 2 to 4 pictures for one moment</strong>, like choosing a drink or a feelings check. Sam’s main board is not changed. To finish, press and hold the button at the top of Sam’s screen.</p></div>
    <div className="set-list">
      {state.choiceSets.map((set) => {
        const tiles = tilesOf(set);
        return <article className="set-card" key={set.id}>
          <h3>{set.name}</h3>
          <div className="set-pictures">{tiles.map((tile) => <WordTile key={tile.id} tile={tile} labels variant="compact" />)}</div>
          <div className="set-actions">
            <button className="primary-button" disabled={tiles.length < 2} onClick={() => onShow(set)}><Play aria-hidden="true" /> Show to Sam</button>
            <button className="secondary-button" disabled={!tiles.length} onClick={() => onPractise(tiles)}><GraduationCap aria-hidden="true" /> Practise</button>
            <button className="text-button" onClick={() => setEditing(set)}><Pencil aria-hidden="true" /> Edit</button>
            <button className="text-button danger-text" onClick={() => { setState((current) => ({ ...current, choiceSets: current.choiceSets.filter((item) => item.id !== set.id) })); onToast(`“${set.name}” removed.`); }}><Trash2 aria-hidden="true" /> Remove</button>
          </div>
        </article>;
      })}
      <button className="add-set-card" onClick={() => setEditing({ id: `set-${Date.now()}`, name: '', tileIds: [] })}><Plus aria-hidden="true" /><span>New choice set</span></button>
    </div>
  </div>;
}

function ChoiceSetEditor({ set, state, onSave, onCancel }: { set: ChoiceSet; state: AppState; onSave: (set: ChoiceSet) => void; onCancel: () => void }) {
  const [name, setName] = useState(set.name);
  const [ids, setIds] = useState(set.tileIds);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const pool = useMemo(() => state.vocabulary.filter((tile) => !tile.hidden).sort((a, b) => a.order - b.order), [state.vocabulary]);
  const shown = pool.filter((tile) => !query.trim() || `${tile.label} ${tile.category}`.toLowerCase().includes(query.trim().toLowerCase()));
  const toggle = (id: string) => setIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : current.length >= 4 ? current : [...current, id]));
  return <form className="panel-stack" onSubmit={(event) => {
    event.preventDefault();
    if (!name.trim()) return setError('Give the set a name you will recognise, like “Snack time”.');
    if (ids.length < 2) return setError('Choose at least 2 pictures.');
    onSave({ ...set, name: name.trim(), tileIds: ids });
  }} noValidate>
    <div className="form-card">
      <label className="stack-label">Name of this set<input value={name} maxLength={40} onChange={(event) => setName(event.target.value)} placeholder="Snack time" /></label>
      <p className="field-note">Pick 2 to 4 pictures, in the order Sam will see them. {ids.length} of 4 chosen.</p>
      <div className="set-pictures chosen-row">{ids.map((id) => { const tile = pool.find((item) => item.id === id); return tile ? <button type="button" key={id} className="chosen-chip" onClick={() => toggle(id)} aria-label={`Remove ${tile.label}`}><WordTile tile={tile} labels variant="compact" /><X aria-hidden="true" /></button> : null; })}</div>
      <label className="search-field"><Search aria-hidden="true" /><span className="sr-only">Search pictures</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search pictures" /></label>
      <div className="symbol-choice-grid">{shown.map((tile) => <button type="button" key={tile.id} className={ids.includes(tile.id) ? 'active' : ''} aria-pressed={ids.includes(tile.id)} disabled={!ids.includes(tile.id) && ids.length >= 4} onClick={() => toggle(tile.id)}>
        <SymbolArt name={tile.symbol} image={tile.image} label={tile.label} decorative /><span>{tile.label}</span></button>)}</div>
    </div>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="form-actions"><button type="button" className="secondary-button" onClick={onCancel}>Cancel</button><button className="primary-button" type="submit"><Check aria-hidden="true" /> Save set</button></div>
  </form>;
}

function SharePrint({ state, setState, onToast }: { state: AppState; setState: SetState; onToast: (text: string) => void }) {
  const [source, setSource] = useState('board-home');
  const [size, setSize] = useState<'large' | 'medium'>('large');
  const [pendingImport, setPendingImport] = useState<AppState | null>(null);

  const printTiles = (() => {
    if (source === 'board-home' || source === 'board-school') return boardSlots(state, source === 'board-home' ? 'home' : 'school').filter((tile): tile is VocabularyTile => Boolean(tile));
    if (source.startsWith('set:')) { const set = state.choiceSets.find((item) => `set:${item.id}` === source); return (set?.tileIds ?? []).map((id) => state.vocabulary.find((tile) => tile.id === id)).filter((tile): tile is VocabularyTile => Boolean(tile)); }
    return state.vocabulary.filter((tile) => !tile.hidden && tile.category === source.replace('cat:', '')).sort((a, b) => a.order - b.order);
  })();

  const share = async () => {
    const result = await shareBoard(state);
    onToast(result === 'shared' ? 'Board sent.' : result === 'saved' ? 'Saved “sam-speaks-board.json”. Send it by WhatsApp or email; the other person opens it with “Open a board”.' : 'Sharing cancelled.');
  };

  const readImport = (file?: File) => {
    if (!file) return;
    file.text().then((text) => {
      const parsed = JSON.parse(text) as Partial<AppState>;
      if (!Array.isArray(parsed.vocabulary) || !parsed.vocabulary.length) throw new Error('invalid');
      setPendingImport(mergeWithStarterVocabulary({ ...parsed, pin: state.pin, seenWelcome: true }));
    }).catch(() => onToast('That file is not a Sam Speaks board.'));
  };

  const print = () => {
    document.body.classList.add('printing-cards');
    const done = () => { document.body.classList.remove('printing-cards'); window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done);
    window.print();
  };

  return <div className="share-layout">
    <section className="form-card">
      <h2><Share2 aria-hidden="true" /> Send Sam’s board to family or school</h2>
      <p>Everyone who helps Sam can use the same pictures. On a phone or tablet this opens the share menu (WhatsApp, Messages, email). The PIN is never sent.</p>
      <div className="data-actions">
        <button className="primary-button" onClick={share}><Share2 aria-hidden="true" /> Send Sam’s board</button>
        <label className="secondary-button file-button"><FileUp aria-hidden="true" /> Open a board someone sent<input type="file" accept="application/json,.json" onChange={(event) => { readImport(event.target.files?.[0]); event.target.value = ''; }} /></label>
      </div>
    </section>
    <section className="form-card">
      <h2><Printer aria-hidden="true" /> Print picture cards</h2>
      <p>For paper boards, a fridge, or families who prefer not to use a tablet yet.</p>
      <div className="form-grid two">
        <label>What to print<select value={source} onChange={(event) => setSource(event.target.value)}>
          <option value="board-home">Home main board</option><option value="board-school">School main board</option>
          {categories.filter((item) => item !== 'All').map((item) => <option key={item} value={`cat:${item}`}>Group: {item}</option>)}
          {state.choiceSets.map((set) => <option key={set.id} value={`set:${set.id}`}>Choice set: {set.name}</option>)}
        </select></label>
        <label>Card size<select value={size} onChange={(event) => setSize(event.target.value as 'large' | 'medium')}><option value="large">Large (6 per page)</option><option value="medium">Medium (12 per page)</option></select></label>
      </div>
      <button className="primary-button" onClick={print} disabled={!printTiles.length}><Printer aria-hidden="true" /> Print {printTiles.length} card{printTiles.length === 1 ? '' : 's'}</button>
    </section>
    <section className={`print-sheet size-${size}`} aria-label="Print preview">
      {printTiles.map((tile) => <div className={`print-card tone-${categoryTone[tile.category]}`} key={tile.id}><span className="picture-frame"><SymbolArt name={tile.symbol} image={tile.image} label={tile.label} decorative /></span><strong>{tile.label}</strong></div>)}
    </section>
    {pendingImport && <ConfirmDialog title="Replace Sam’s board on this device?" body={<p>The board you opened has {pendingImport.vocabulary.length} pictures. It replaces the pictures, main board and choice sets here. Your PIN stays the same.</p>}
      confirmLabel="Replace board" onCancel={() => setPendingImport(null)} onConfirm={() => { setState(pendingImport); setPendingImport(null); onToast('Board opened and saved on this device.'); }} />}
  </div>;
}

function Toggle({ label, help, on, onChange }: { label: string; help: string; on: boolean; onChange: () => void }) {
  return <div className="setting-row"><div><strong>{label}</strong><span>{help}</span></div><button type="button" role="switch" aria-checked={on} aria-label={label} className={`switch ${on ? 'on' : ''}`} onClick={onChange}><span /></button></div>;
}

function SettingsPanel({ state, setState, onToast }: { state: AppState; setState: SetState; onToast: (text: string) => void }) {
  const set = <K extends keyof AppState>(key: K, value: AppState[K]) => setState((current) => ({ ...current, [key]: value }));
  const [pinA, setPinA] = useState('');
  const [pinB, setPinB] = useState('');
  const [pinError, setPinError] = useState('');
  const changePin = (event: React.FormEvent) => {
    event.preventDefault();
    if (!/^\d{4}$/.test(pinA)) return setPinError('The PIN must be 4 numbers.');
    if (pinA !== pinB) return setPinError('The two PINs are different. Type them again.');
    set('pin', pinA); setPinA(''); setPinB(''); setPinError(''); onToast('PIN changed.');
  };
  return <div className="settings-layout">
    <section className="settings-card wide">
      <h2>How Sam talks</h2>
      <div className="choice-cards">
        <button className={state.messageMode === 'single' ? 'active' : ''} aria-pressed={state.messageMode === 'single'} onClick={() => set('messageMode', 'single')}><strong>One picture at a time</strong><span>Each tap says the word straight away. Best for starting out and for younger children.</span>{state.messageMode === 'single' && <Check aria-hidden="true" />}</button>
        <button className={state.messageMode === 'sentence' ? 'active' : ''} aria-pressed={state.messageMode === 'sentence'} onClick={() => set('messageMode', 'sentence')}><strong>Build a sentence</strong><span>Pictures line up, like “I want water”, then Sam taps Speak. For children ready to combine words.</span>{state.messageMode === 'sentence' && <Check aria-hidden="true" />}</button>
      </div>
    </section>
    <section className="settings-card">
      <h2>How many pictures</h2>
      <div className="choice-cards">
        <button className={state.layout === 'focus' ? 'active' : ''} aria-pressed={state.layout === 'focus'} onClick={() => set('layout', 'focus')}><div className="mini-grid focus"><i /><i /><i /><i /></div><strong>12 big pictures</strong><span>The main board fits on one screen.</span>{state.layout === 'focus' && <Check aria-hidden="true" />}</button>
        <button className={state.layout === 'expanded' ? 'active' : ''} aria-pressed={state.layout === 'expanded'} onClick={() => set('layout', 'expanded')}><div className="mini-grid expanded"><i /><i /><i /><i /><i /><i /></div><strong>More words</strong><span>Smaller pictures; scroll for more.</span>{state.layout === 'expanded' && <Check aria-hidden="true" />}</button>
      </div>
      <div className="setting-row"><div><strong>Space between pictures</strong><span>More room makes accurate tapping easier.</span></div><div className="segmented" role="group" aria-label="Space between pictures"><button className={state.spacing === 'cozy' ? 'active' : ''} aria-pressed={state.spacing === 'cozy'} onClick={() => set('spacing', 'cozy')}>Less</button><button className={state.spacing === 'roomy' ? 'active' : ''} aria-pressed={state.spacing === 'roomy'} onClick={() => set('spacing', 'roomy')}>More</button></div></div>
    </section>
    <section className="settings-card">
      <h2>Language and sound</h2>
      <div className="setting-row"><div><strong>Language on Sam’s board</strong><span>Words and voice. These grown-up screens stay in English.</span></div><div className="segmented" role="group" aria-label="Language"><button className={state.language === 'en' ? 'active' : ''} aria-pressed={state.language === 'en'} onClick={() => set('language', 'en')}>English</button><button lang="ar" className={state.language === 'ar' ? 'active' : ''} aria-pressed={state.language === 'ar'} onClick={() => set('language', 'ar')}>العربية</button></div></div>
      <Toggle label="Speak each picture" help="Sam hears the word as soon as a picture is tapped." on={state.audioFeedback} onChange={() => set('audioFeedback', !state.audioFeedback)} />
      <Toggle label="Words under pictures" help="Short words help Sam and others learn each picture." on={state.labels} onChange={() => set('labels', !state.labels)} />
    </section>
    <section className="settings-card">
      <h2>Comfort and safety</h2>
      <Toggle label="Full screen for Sam" help="Hides the browser so Sam is less likely to leave the board. For a full lock, use the tablet’s own guided-access setting." on={state.fullscreen} onChange={() => set('fullscreen', !state.fullscreen)} />
      <Toggle label="Stronger contrast" help="Darker outlines and text." on={state.highContrast} onChange={() => set('highContrast', !state.highContrast)} />
      <Toggle label="Less movement" help="Turns off animations." on={state.reducedMotion} onChange={() => set('reducedMotion', !state.reducedMotion)} />
    </section>
    <section className="settings-card">
      <h2>Grown-up PIN</h2>
      <p className="field-note">Needed after the press-and-hold to open these screens. Choose one Sam does not know.</p>
      <form className="form-grid two" onSubmit={changePin} noValidate>
        <label>New PIN<input inputMode="numeric" maxLength={4} value={pinA} onChange={(event) => setPinA(event.target.value.replace(/\D/g, ''))} autoComplete="new-password" type="password" /></label>
        <label>Type it again<input inputMode="numeric" maxLength={4} value={pinB} onChange={(event) => setPinB(event.target.value.replace(/\D/g, ''))} autoComplete="new-password" type="password" /></label>
        {pinError && <p className="form-error" role="alert">{pinError}</p>}
        <button className="secondary-button" type="submit">Change PIN</button>
      </form>
    </section>
  </div>;
}


function AboutPanel() {
  const items = [
    { title: 'One child, several helpers', text: 'Sam gets a simple board with nothing to edit. Parents, teachers and therapists get these plain-language screens behind a press-and-hold and a PIN.' },
    { title: 'Pictures stay where they are', text: 'The main board has 12 fixed spots. Adding, hiding or deleting a picture never moves another one, so Sam can rely on position and muscle memory.' },
    { title: 'Start simple, grow later', text: 'One picture at a time by default. Sentence building, more words and a second language are switched on when Sam is ready.' },
    { title: 'Photos or drawings', text: 'Families disagreed on photos versus drawings, so both are supported. Photos are cropped automatically.' },
    { title: 'Private by default', text: 'No account, no cloud, no analytics. Pictures stay on this device unless a grown-up chooses to send the board.' },
    { title: 'Supportive, not clinical', text: 'The app does not diagnose, score progress or replace a speech therapist.' },
  ];
  return <div className="about-panel">
    <div className="principle-grid">{items.map((item) => <article key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
    <div className="prototype-note"><strong>Classroom prototype limits</strong><p>The grown-up gate and the simulated roles are a demonstration, not secure login. Speech quality depends on the device’s built-in voices. The Arabic words were written for the prototype and should be checked by a native speaker. This is not a medical device.</p></div>
  </div>;
}
