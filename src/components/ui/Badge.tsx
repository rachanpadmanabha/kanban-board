import React from 'react';

interface TagBadgeProps {
  readonly tag: string;
  readonly removable?: boolean;
  readonly onRemove?: () => void;
}

export const TagBadge: React.FC<TagBadgeProps> = ({ tag, removable = false, onRemove }) => {
  return (
    <span
      className="
        inline-flex items-center gap-1
        px-2 py-0.5
        rounded-full
        text-[10px] font-bold leading-none
        text-secondary bg-secondary-container/30
        transition-colors duration-200
      "
    >
      {tag}
      {removable && onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="ml-0.5 text-secondary/60 hover:text-secondary cursor-pointer transition-colors"
          aria-label={`Remove ${tag}`}
          type="button"
        >
          ×
        </button>
      )}
    </span>
  );
};
