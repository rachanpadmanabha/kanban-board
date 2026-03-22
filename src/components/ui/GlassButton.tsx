import React from 'react';

interface GlassButtonProps {
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly variant?: 'primary' | 'ghost' | 'danger';
  readonly size?: 'sm' | 'md' | 'lg';
  readonly onClick?: () => void;
  readonly type?: 'button' | 'submit';
  readonly disabled?: boolean;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  className = '',
  variant = 'ghost',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
}) => {
  const sizeClasses = {
    sm: 'px-4 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
  };

  const variantClasses = {
    primary: `
      bg-gradient-to-br from-primary to-primary-container
      text-on-primary font-bold
      shadow-lg shadow-primary/20
      hover:brightness-110
      active:scale-95
    `,
    ghost: `
      bg-white/5 backdrop-blur-md
      border border-white/10
      text-on-surface-variant
      hover:bg-white/10
      hover:text-white
      active:scale-95
    `,
    danger: `
      bg-error/10 text-error
      hover:bg-error/20
      active:scale-95
    `,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-full flex-shrink-0
        transition-all duration-200 cursor-pointer
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100 disabled:active:scale-100
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
};
