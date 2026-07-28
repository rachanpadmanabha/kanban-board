import React, { useEffect } from 'react';
import { Icon } from './Icon';

const AUTO_DISMISS_MS = 7000;

interface UndoToastProps {
  readonly message: string;
  readonly onUndo: () => void;
  readonly onDismiss: () => void;
}

export const UndoToast: React.FC<UndoToastProps> = ({ message, onUndo, onDismiss }) => {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => window.clearTimeout(timer);
  }, [message, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="
        fixed bottom-6 left-1/2 -translate-x-1/2 z-50
        glass-panel rounded-full
        flex items-center gap-3 pl-5 pr-2 py-2
        shadow-2xl shadow-black/50
        animate-[slideUp_0.25s_ease-out]
      "
    >
      <span className="text-sm text-on-surface truncate max-w-[50vw]">{message}</span>
      <button
        type="button"
        onClick={onUndo}
        className="
          inline-flex items-center gap-1.5 rounded-full
          px-3 py-1.5 text-xs font-bold
          text-primary bg-primary/15 hover:bg-primary/25
          transition-colors cursor-pointer
        "
      >
        <Icon name="undo" className="w-3.5 h-3.5" />
        Undo
      </button>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="
          w-7 h-7 flex items-center justify-center rounded-full
          text-outline hover:text-white hover:bg-white/10
          transition-colors cursor-pointer
        "
      >
        <Icon name="close" className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
