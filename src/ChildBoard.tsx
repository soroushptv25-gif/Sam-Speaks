import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Delete, FlaskConical, GraduationCap, Hand, Home, LockKeyhole, Trash2, Volume2, X } from 'lucide-react';
import { categoryTone, EmptySlot, HoldButton, WordTile } from './components';
import { SymbolArt } from './SymbolArt';
import { boardSlots, tilesForCategory, tilesForExpanded } from './board';
import { categories, type CategoryFilter } from './data';
import { categoryName, childText, tileLabel, tilePhrase } from './i18n';
import { appendWord, messageToSpeech, removeLastWord } from './message';
import { speak, speechAvailable } from './speech';
import type { ActiveStudyTask, AppState, BoardContext, Category, ChoiceSet, StudyRecord, VocabularyTile } from './types';

const categoryIcon: Record<Category, VocabularyTile['symbol']> = {
  Core: 'want', Needs: 'water', Actions: 'play', Feelings: 'happy', People: 'family', Places: 'home', School: 'school',
};

export function ChildBoard({ state, activeSet, onEndActivity, onAdult, activeStudy, onStudyMetric, onFinishStudy }: {
  state: AppState;
  activeSet: ChoiceSet | null;
  onEndActivity: () => void;
  onAdult: () => void;
  activeStudy: ActiveStudyTask | null;
  onStudyMetric: (metric: 'tap' | 'undo' | 'error') => void;
  onFinishStudy: (outcome: StudyRecord['outcome']) => void;
}) {
  const lang = state.language;
  const t = childText[lang];
  const [context, setContext] = useState<BoardContext>('home');
  const [category, setCategory] = useState<CategoryFilter>('All');
  const [message, setMessage] = useState<VocabularyTile[]>([]);
  const [lastSaid, setLastSaid] = useState<VocabularyTile | null>(null);
  const [selectedId, setSelectedId] = useState<string>();
  const [speaking, setSpeaking] = useState(false);
  const [notice, setNotice] = useState('');
  const sentence = state.messageMode === 'sentence';

  const visible = tilesForCategory(state, context, 'All');
  const availableCategories = categories.filter((item) => item === 'All' || visible.some((tile) => tile.category === item));
  const setTiles = activeSet
    ? activeSet.tileIds.map((id) => state.vocabulary.find((tile) => tile.id === id)).filter((tile): tile is VocabularyTile => Boolean(tile))
    : [];

  useEffect(() => { if (!selectedId) return; const timer = window.setTimeout(() => setSelectedId(undefined), 900); return () => window.clearTimeout(timer); }, [selectedId]);

  const say = (text: string) => {
    const started = speak(text, lang, {
      onStart: () => setSpeaking(true),
      onEnd: () => setSpeaking(false),
      onError: () => { setSpeaking(false); setNotice('Speech could not play on this device.'); onStudyMetric('error'); },
    });
    if (!started) { setNotice('Speech is not available on this device. The picture is still shown.'); onStudyMetric('error'); }
  };

  const select = (tile: VocabularyTile) => {
    onStudyMetric('tap');
    setSelectedId(tile.id);
    if (sentence) {
      setMessage((current) => appendWord(current, tile));
      setNotice(`${tileLabel(tile, lang)} added.`);
      if (state.audioFeedback) say(tileLabel(tile, lang));
    } else {
      setLastSaid(tile);
      setNotice(`${tileLabel(tile, lang)}.`);
      if (state.audioFeedback) say(tilePhrase(tile, lang));
    }
  };

  const speakMessage = () => {
    onStudyMetric('tap');
    const text = messageToSpeech(message, (tile) => tilePhrase(tile, lang));
    if (!text) { onStudyMetric('error'); return; }
    say(text);
  };

  const switchContext = (next: BoardContext) => {
    onStudyMetric('tap');
    setContext(next);
    setCategory('All');
  };

  const renderBoard = () => {
    if (category === 'All' && state.layout === 'focus') {
      return <div className="board-grid fit">{boardSlots(state, context).map((tile, index) => tile
        ? <WordTile key={`${index}-${tile.id}`} tile={tile} language={lang} labels={state.labels} selected={selectedId === tile.id} onSelect={() => select(tile)} />
        : <EmptySlot key={`empty-${index}`} />)}</div>;
    }
    if (category === 'All') {
      const { main, rest } = tilesForExpanded(state, context);
      return <div className="board-grid scroll dense">
        {main.map((tile, index) => tile
          ? <WordTile key={`m-${index}-${tile.id}`} tile={tile} language={lang} labels={state.labels} selected={selectedId === tile.id} onSelect={() => select(tile)} />
          : <EmptySlot key={`empty-${index}`} />)}
        {rest.map((tile) => <WordTile key={tile.id} tile={tile} language={lang} labels={state.labels} selected={selectedId === tile.id} onSelect={() => select(tile)} />)}
      </div>;
    }
    const tiles = tilesForCategory(state, context, category);
    if (!tiles.length) return <div className="board-empty"><span>{t.empty}</span></div>;
    return <div className={`board-grid scroll ${state.layout === 'expanded' ? 'dense' : ''}`}>
      {tiles.map((tile) => <WordTile key={tile.id} tile={tile} language={lang} labels={state.labels} selected={selectedId === tile.id} onSelect={() => select(tile)} />)}
    </div>;
  };

  return (
    <main className={`child-shell spacing-${state.spacing}`} dir={lang === 'ar' ? 'rtl' : 'ltr'} lang={lang}>
      <h1 className="sr-only">Sam’s communication board</h1>
      {activeStudy && <aside className="study-strip" aria-label="Usability task recorder" dir="ltr" lang="en">
        <div><FlaskConical /><span><strong>Study task running</strong>{activeStudy.participantCode} · {activeStudy.task}</span></div>
        <div><button onClick={() => onFinishStudy('success')}>Success</button><button onClick={() => onFinishStudy('assisted')}>With help</button><button onClick={() => onFinishStudy('failed')}>Could not complete</button></div>
      </aside>}

      <header className="child-header">
        {activeSet
          ? <HoldButton className="end-activity" onComplete={onEndActivity} label={`${t.holdToFinish}: press and hold`}><X /><span>{t.holdToFinish}</span></HoldButton>
          : <div className="context-switcher" role="group" aria-label="Which board">
              <button className={context === 'home' ? 'active' : ''} aria-pressed={context === 'home'} onClick={() => switchContext('home')}><Home /> {t.home}</button>
              <button className={context === 'school' ? 'active' : ''} aria-pressed={context === 'school'} onClick={() => switchContext('school')}><GraduationCap /> {t.school}</button>
            </div>}
        <HoldButton className="grown-up-lock" onComplete={onAdult} label="Grown-ups: press and hold to open setup"><LockKeyhole /><span>{t.grownUps}</span></HoldButton>
      </header>

      {sentence ? (
        <section className={`message-bar ${speaking ? 'is-speaking' : ''}`} aria-label="Message">
          {message.length
            ? <ol className="message-strip">{message.map((tile, index) => <li key={`${tile.id}-${index}`}>
                <span className={`chip-art tone-${categoryTone[tile.category]}`}><SymbolArt name={tile.symbol} image={tile.image} label={tileLabel(tile, lang)} decorative /></span>
                <span>{tileLabel(tile, lang)}</span></li>)}</ol>
            : <p className="message-hint"><Hand aria-hidden="true" /> {t.tapPicture}</p>}
          <div className="message-controls">
            <button className="bar-button" onClick={() => { onStudyMetric('tap'); onStudyMetric('undo'); setMessage((current) => removeLastWord(current)); }} disabled={!message.length}><Delete aria-hidden="true" /><span>{t.undo}</span></button>
            <button className="bar-button" onClick={() => { onStudyMetric('tap'); setMessage([]); }} disabled={!message.length}><Trash2 aria-hidden="true" /><span>{t.clear}</span></button>
            <button className="speak-button" onClick={speakMessage} disabled={!message.length}><Volume2 aria-hidden="true" /><span>{t.speak}</span></button>
          </div>
        </section>
      ) : (
        <section className={`message-bar single ${speaking ? 'is-speaking' : ''}`} aria-label="Last picture">
          {lastSaid
            ? <div className="last-said"><span className="chip-art big"><SymbolArt name={lastSaid.symbol} image={lastSaid.image} label={tileLabel(lastSaid, lang)} decorative /></span><strong>{tileLabel(lastSaid, lang)}</strong></div>
            : <p className="message-hint"><Hand aria-hidden="true" /> {state.audioFeedback || !speechAvailable() ? t.tapPicture : t.speechOff}</p>}
          <button className="speak-button" disabled={!lastSaid} onClick={() => { if (lastSaid) { onStudyMetric('tap'); say(tilePhrase(lastSaid, lang)); } }}><Volume2 aria-hidden="true" /><span>{t.sayAgain}</span></button>
        </section>
      )}

      {activeSet ? (
        <section className="board-area" aria-label="Choices">
          <div className="choice-grid" style={{ ['--count' as string]: Math.max(1, setTiles.length) }}>
            {setTiles.map((tile) => <WordTile key={tile.id} tile={tile} language={lang} labels={state.labels} variant="hero" selected={selectedId === tile.id} onSelect={() => select(tile)} />)}
          </div>
        </section>
      ) : <>
        <nav className="category-row" aria-label="Picture groups">
          {availableCategories.map((item) => <button key={item} className={category === item ? 'active' : ''} aria-pressed={category === item}
            onClick={() => { onStudyMetric('tap'); setCategory(item); }}>
            {item !== 'All' && <SymbolArt name={categoryIcon[item]} label="" decorative />}
            <span>{categoryName(item, lang)}</span>
          </button>)}
        </nav>
        <section className="board-area" aria-label={`${context === 'home' ? t.home : t.school}: ${categoryName(category, lang)}`}>{renderBoard()}</section>
      </>}
      <p className="sr-only" role="status" aria-live="polite">{notice}</p>
    </main>
  );
}

/**
 * Teaching mode (Phase 1, P1: "show the picture, say the word, keep it fun").
 * One big picture at a time; it speaks when it appears and again on every tap.
 */
export function PracticeScreen({ tiles, state, onDone }: { tiles: VocabularyTile[]; state: AppState; onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const lang = state.language;
  const tile = tiles[index];
  useEffect(() => { if (tile && state.audioFeedback) speak(tilePhrase(tile, lang), lang); }, [tile, lang, state.audioFeedback]);
  if (!tile) return null;
  const go = (step: number) => setIndex((current) => Math.min(tiles.length - 1, Math.max(0, current + step)));
  const rtl = lang === 'ar';
  return (
    <main className="practice-shell" dir={rtl ? 'rtl' : 'ltr'} lang={lang}>
      <h1 className="sr-only">Practice: {tileLabel(tile, lang)}</h1>
      <header className="practice-top">
        <HoldButton className="end-activity" onComplete={onDone} label="Finish practice: press and hold"><X /><span>{childText[lang].holdToFinish}</span></HoldButton>
      </header>
      <div className="practice-stage">
        <button className="practice-arrow" onClick={() => go(-1)} disabled={index === 0} aria-label="Previous picture">{rtl ? <ArrowRight /> : <ArrowLeft />}</button>
        <WordTile tile={tile} language={lang} labels variant="hero" onSelect={() => speak(tilePhrase(tile, lang), lang)} />
        <button className="practice-arrow" onClick={() => go(1)} disabled={index === tiles.length - 1} aria-label="Next picture">{rtl ? <ArrowLeft /> : <ArrowRight />}</button>
      </div>
      {tiles.length > 1 && <ol className="practice-dots" aria-label={`Picture ${index + 1} of ${tiles.length}`}>{tiles.map((item, i) => <li key={item.id} className={i === index ? 'active' : ''} />)}</ol>}
    </main>
  );
}
