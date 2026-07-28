import React from 'react';
import { FIELD_CLASSES, FieldShell } from './fieldStyles';

interface GlassInputProps {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
  readonly multiline?: boolean;
  readonly rows?: number;
  readonly type?: 'text' | 'date';
  readonly maxLength?: number;
}

export const GlassInput: React.FC<GlassInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = '',
  multiline = false,
  rows = 3,
  type = 'text',
  maxLength,
}) => (
  <FieldShell id={id} label={label}>
    {multiline ? (
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={`${FIELD_CLASSES} resize-none`}
      />
    ) : (
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`${FIELD_CLASSES} ${type === 'date' ? '[color-scheme:dark] cursor-pointer' : ''}`}
      />
    )}
  </FieldShell>
);
