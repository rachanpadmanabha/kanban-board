import React from 'react';

interface GlassCardProps {
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly hover?: boolean;
  readonly onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hover = false,
  onClick,
}) => {
  return (
    <div
      className={`
        bg-glass backdrop-blur-[20px]
        border border-glass-border
        rounded-[var(--radius-card)]
        shadow-[var(--shadow-card)]
        transition-all duration-300 ease-out
        ${hover ? 'hover:bg-glass-hover hover:backdrop-blur-[32px] hover:shadow-[var(--shadow-glow-glacial)] hover:-translate-y-0.5 cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
    >
      {children}
    </div>
  );
};
