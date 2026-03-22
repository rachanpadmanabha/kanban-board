import React from 'react';
import type { Priority } from '../../types';
import { PRIORITY_CONFIG } from '../../data/mockData';

interface BadgeProps {
  readonly children: React.ReactNode;
  readonly color?: string;
  readonly className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, color, className = '' }) => {
  return (
    <span
      className={`
        inline-flex items-center
        px-2.5 py-1
        rounded-full
        text-[10px] font-bold leading-none
        tracking-widest uppercase
        bg-white/10
        transition-colors duration-200
        ${className}
      `}
      style={color ? { color, borderLeftColor: color, borderLeftWidth: '2px' } : undefined}
    >
      {children}
    </span>
  );
};

interface PriorityBadgeProps {
  readonly priority: Priority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const config = PRIORITY_CONFIG[priority];
  return (
    <Badge color={config.color}>
      {config.label}
    </Badge>
  );
};

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
