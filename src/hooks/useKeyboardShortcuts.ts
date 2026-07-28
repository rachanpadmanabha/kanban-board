import { useEffect } from 'react';

interface Shortcuts {
  readonly onNewTask: () => void;
  readonly onFocusSearch: () => void;
  /** Suppressed while a dialog is open so shortcuts cannot fire behind it. */
  readonly enabled: boolean;
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
  );
}

export function useKeyboardShortcuts({ onNewTask, onFocusSearch, enabled }: Shortcuts): void {
  useEffect(() => {
    if (!enabled) return;

    const handler = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;

      if (e.key === 'n') {
        e.preventDefault();
        onNewTask();
      } else if (e.key === '/') {
        e.preventDefault();
        onFocusSearch();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [enabled, onNewTask, onFocusSearch]);
}
