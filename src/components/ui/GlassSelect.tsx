import React from 'react';
import { FIELD_CLASSES, FieldShell } from './fieldStyles';

interface Option {
  readonly value: string;
  readonly label: string;
}

interface GlassSelectProps {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly options: readonly Option[];
}

export const GlassSelect: React.FC<GlassSelectProps> = ({
  id,
  label,
  value,
  onChange,
  options,
}) => (
  <FieldShell id={id} label={label}>
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${FIELD_CLASSES} cursor-pointer appearance-none pr-10`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-surface-variant text-white">
            {option.label}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-outline"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  </FieldShell>
);
