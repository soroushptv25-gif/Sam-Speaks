import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { SymbolArt } from './SymbolArt';
import { tileLabel } from './i18n';
import type { Category, Language, SymbolName, VocabularyTile } from './types';

export const categoryTone: Record<Category, string> = {
  Core: 'purple', Needs: 'blue', Actions: 'green', Feelings: 'yellow', People: 'pink', Places: 'teal', School: 'orange',
};

export function WordTile({ tile, language = 'en', labels = true, selected, onSelect, variant = 'board' }: {
  tile: VocabularyTile; language?: Language; labels?: boolean; selected?: boolean;
  onSelect?: () => void; variant?: 'board' | 'compact' | 'hero';
}) {
  const label = tileLabel(tile, language);
  const className = `word-tile tone-${categoryTone[tile.category]} variant-${variant} ${selected ? 'is-selected' : ''}`;
  const body = <>
    <span className="picture-frame"><SymbolArt name={tile.symbol} image={tile.image} label={label} decorative /></span>
    {labels && <span className="word-label">{label}</span>}
  </>;
  if (!onSelect) return <div className={className} role="img" aria-label={label}>{body}</div>;
  return <button type="button" className={className} onClick={onSelect} aria-label={labels ? undefined : label}>{body}</button>;
}

/** An empty spot on the main board. It holds the place so no other card moves. */
export function EmptySlot() {
  return <div className="word-tile empty-slot" aria-hidden="true" />;
}

/**
 * A button that only fires after a deliberate press-and-hold (pointer, Enter or Space).
 * Phase 1 HTA Task 2, sub-goal 1: adults get in quickly, a child's quick tap does nothing.
 */
export function HoldButton({ onComplete, duration = 1500, className = '', label, children }: {
  onComplete: () => void; duration?: number; className?: string; label: string; children: ReactNode;
}) {
  const timer = useRef<number | undefined>(undefined);
  const done = useRef(onComplete);
  done.current = onComplete;
  const [holding, setHolding] = useState(false);
  const start = () => {
    if (timer.current) return;
    setHolding(true);
    timer.current = window.setTimeout(() => { timer.current = undefined; setHolding(false); done.current(); }, duration);
  };
  const cancel = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = undefined;
    setHolding(false);
  };
  useEffect(() => cancel, []);
  const isHoldKey = (key: string) => key === 'Enter' || key === ' ';
  return (
    <button
      type="button"
      className={`hold-button ${holding ? 'is-holding' : ''} ${className}`}
      style={{ '--hold-ms': `${duration}ms` } as CSSProperties}
      aria-label={label}
      onPointerDown={(event) => { event.preventDefault(); start(); }}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onContextMenu={(event) => event.preventDefault()}
      onKeyDown={(event) => { if (isHoldKey(event.key)) { event.preventDefault(); if (!event.repeat) start(); } }}
      onKeyUp={(event) => { if (isHoldKey(event.key)) cancel(); }}
      onBlur={cancel}
    >
      <span className="hold-fill" aria-hidden="true" />
      <span className="hold-content">{children}</span>
    </button>
  );
}

const focusableSelector = 'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

/** Modal dialog: moves focus inside, keeps Tab inside, closes on Escape, and gives focus back afterwards. */
export function Dialog({ labelledBy, onClose, className = '', children }: {
  labelledBy: string; onClose: () => void; className?: string; children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const node = ref.current;
    const items = () => Array.from(node?.querySelectorAll<HTMLElement>(focusableSelector) ?? []);
    (node?.querySelector<HTMLElement>('[data-autofocus]') ?? items()[0])?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); close.current(); return; }
      if (event.key !== 'Tab') return;
      const list = items();
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); previous?.focus?.(); };
  }, []);
  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) close.current(); }}>
      <div ref={ref} className={`modal-card ${className}`} role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
        {children}
      </div>
    </div>
  );
}

export function ConfirmDialog({ title, body, confirmLabel, cancelLabel = 'Cancel', danger = false, onConfirm, onCancel }: {
  title: string; body: ReactNode; confirmLabel: string; cancelLabel?: string; danger?: boolean;
  onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <Dialog labelledBy="confirm-title" onClose={onCancel}>
      <h2 id="confirm-title">{title}</h2>
      <div className="modal-body">{body}</div>
      <div className="modal-actions">
        <button type="button" className="secondary-button" data-autofocus onClick={onCancel}>{cancelLabel}</button>
        <button type="button" className={danger ? 'danger-button' : 'primary-button'} onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </Dialog>
  );
}

/** Every drawing in the app, with a plain name and extra search words. */
export const symbolLibrary: { value: SymbolName; label: string; words?: string }[] = [
  { value: 'person', label: 'Me / I', words: 'self child boy girl' }, { value: 'want', label: 'Want' }, { value: 'need', label: 'Need' },
  { value: 'more', label: 'More' }, { value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'help', label: 'Help' },
  { value: 'stop', label: 'Stop' }, { value: 'go', label: 'Go' }, { value: 'like', label: 'Like', words: 'love heart' },
  { value: 'water', label: 'Water', words: 'drink glass' }, { value: 'juice', label: 'Juice', words: 'drink orange' },
  { value: 'milk', label: 'Milk', words: 'drink' }, { value: 'bottle', label: 'Bottle', words: 'drink' },
  { value: 'food', label: 'Food', words: 'eat meal snack' }, { value: 'lunch', label: 'Lunch', words: 'eat meal plate' },
  { value: 'bathroom', label: 'Toilet', words: 'bathroom potty' }, { value: 'wash', label: 'Wash', words: 'sink hands bath' },
  { value: 'play', label: 'Play', words: 'game' }, { value: 'toys', label: 'Toys', words: 'teddy blocks' },
  { value: 'book', label: 'Book', words: 'read story' }, { value: 'music', label: 'Music', words: 'song' },
  { value: 'draw', label: 'Draw', words: 'colour art' }, { value: 'listen', label: 'Listen', words: 'ear hear' },
  { value: 'tell', label: 'Tell', words: 'talk say' }, { value: 'choose', label: 'Choose', words: 'pick' },
  { value: 'outside', label: 'Outside', words: 'tree garden' }, { value: 'park', label: 'Park', words: 'tree bench garden' },
  { value: 'rest', label: 'Rest', words: 'sofa sit' }, { value: 'sleep', label: 'Sleep', words: 'bed night' },
  { value: 'break', label: 'Break', words: 'pause rest' }, { value: 'hug', label: 'Hug', words: 'cuddle' },
  { value: 'happy', label: 'Happy' }, { value: 'sad', label: 'Sad' }, { value: 'tired', label: 'Tired' },
  { value: 'angry', label: 'Angry', words: 'mad cross' }, { value: 'scared', label: 'Scared', words: 'afraid' },
  { value: 'worried', label: 'Worried' }, { value: 'calm', label: 'Calm' }, { value: 'excited', label: 'Excited' },
  { value: 'confused', label: 'Confused' }, { value: 'uncomfortable', label: 'Uncomfortable' }, { value: 'proud', label: 'Proud' },
  { value: 'feel', label: 'Feel' }, { value: 'hurt', label: 'Pain', words: 'hurt ouch' }, { value: 'sick', label: 'Sick', words: 'ill' },
  { value: 'hot', label: 'Hot' }, { value: 'cold', label: 'Cold' }, { value: 'quiet', label: 'Quiet' },
  { value: 'loud', label: 'Too loud', words: 'noise' }, { value: 'space', label: 'Space', words: 'alone' },
  { value: 'parent', label: 'Mum / Dad', words: 'parent mother father' }, { value: 'grandparent', label: 'Grandma / Grandpa', words: 'grandmother grandfather nana' },
  { value: 'family', label: 'Family' }, { value: 'friend', label: 'Friend' }, { value: 'classmate', label: 'Classmate' },
  { value: 'teacher', label: 'Teacher' }, { value: 'therapist', label: 'Therapist' }, { value: 'nurse', label: 'Nurse', words: 'doctor' },
  { value: 'home', label: 'Home', words: 'house' }, { value: 'bedroom', label: 'Bedroom' }, { value: 'kitchen', label: 'Kitchen' },
  { value: 'school', label: 'School' }, { value: 'quiet-place', label: 'Quiet place' }, { value: 'playground', label: 'Playground' },
  { value: 'cafeteria', label: 'Cafeteria' }, { value: 'bus', label: 'Bus', words: 'car travel' },
  { value: 'question', label: 'Question' }, { value: 'answer', label: 'Answer' }, { value: 'pencil', label: 'Pencil', words: 'write' },
  { value: 'computer', label: 'Computer', words: 'tablet screen' }, { value: 'lesson', label: 'Lesson', words: 'board class' },
  { value: 'recess', label: 'Recess', words: 'ball' }, { value: 'homework', label: 'Homework' },
  { value: 'finished', label: 'Finished', words: 'done' }, { value: 'again', label: 'Again' }, { value: 'different', label: 'Different' },
  { value: 'wait', label: 'Wait', words: 'time' },
];
