import React from 'react';

interface GlassInputProps {
  readonly label: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
  readonly multiline?: boolean;
  readonly rows?: number;
  readonly id: string;
}

export const GlassInput: React.FC<GlassInputProps> = ({
  label,
  value,
  onChange,
  placeholder = '',
  multiline = false,
  rows = 3,
  id,
}) => {
  const inputClasses = `
    w-full
    bg-white/5 backdrop-blur-md
    text-white placeholder:text-outline
    rounded-DEFAULT
    border border-white/5
    px-4 py-3
    text-sm font-medium
    transition-all duration-200
    focus:border-primary/50 focus:ring-1 focus:ring-primary/50 focus:bg-white/10
    focus:outline-none focus:shadow-lg focus:shadow-primary/5
  `;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[10px] font-bold text-outline uppercase tracking-widest pl-1">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={`${inputClasses} resize-none`}
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClasses}
        />
      )}
    </div>
  );
};
