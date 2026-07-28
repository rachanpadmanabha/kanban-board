import React, { useEffect, useId, useRef } from 'react';

interface ModalProps {
  readonly onClose: () => void;
  readonly title: string;
  readonly children: React.ReactNode;
}

const FOCUSABLE =
  'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Mount this only while the dialog should be visible — callers control the
 * lifetime so that dialog contents get fresh state on every open.
 */
export const Modal: React.FC<ModalProps> = ({ onClose, title, children }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const focusable = () =>
      Array.from(contentRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);

    focusable()[0]?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      const elements = focusable();
      if (elements.length === 0) return;

      const first = elements[0];
      const last = elements[elements.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || !contentRef.current?.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/60 backdrop-blur-[8px]
        animate-[fadeIn_0.2s_ease-out]
      "
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        ref={contentRef}
        className="
          w-full max-w-[520px] mx-4
          glass-panel
          rounded-[2rem]
          shadow-2xl shadow-black/50
          animate-[slideUp_0.3s_ease-out]
        "
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h2 id={titleId} className="text-lg font-semibold text-text-primary tracking-tight">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="
              w-8 h-8 flex items-center justify-center
              rounded-full
              bg-glass hover:bg-glass-hover
              text-text-secondary hover:text-text-primary
              transition-all duration-200
              cursor-pointer
            "
            aria-label="Close dialog"
            type="button"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="px-6 pb-6 pt-2 max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
