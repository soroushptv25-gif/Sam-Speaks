import { speechLang } from './i18n';
import type { Language } from './types';

export const speechAvailable = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

/** Speaks with the browser's built-in voice for the chosen language. Returns false if speech is unavailable. */
export function speak(text: string, language: Language, handlers: { onStart?: () => void; onEnd?: () => void; onError?: () => void } = {}) {
  if (!speechAvailable() || !text.trim()) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = speechLang[language];
  const voice = window.speechSynthesis.getVoices().find((item) => item.lang.toLowerCase().startsWith(language));
  if (voice) utterance.voice = voice;
  utterance.rate = 0.9;
  utterance.onstart = () => handlers.onStart?.();
  utterance.onend = () => handlers.onEnd?.();
  utterance.onerror = () => handlers.onError?.();
  window.speechSynthesis.speak(utterance);
  return true;
}
