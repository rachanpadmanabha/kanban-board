import React from 'react';

/** Shared surface for every form control so inputs, selects and dates match. */
export const FIELD_CLASSES = `
  w-full
  bg-white/5 backdrop-blur-md
  text-white placeholder:text-outline
  rounded-DEFAULT
  border border-white/5
  px-4 py-3
  text-sm font-medium
  transition-all duration-200
  focus:border-primary/50 focus:ring-1 focus:ring-primary/50 focus:bg-white/10
  focus:outline-none
`;

export const FieldLabel: React.FC<{ htmlFor?: string; children: React.ReactNode }> = ({
  htmlFor,
  children,
}) => (
  <label htmlFor={htmlFor} className="text-[10px] font-bold text-outline uppercase tracking-widest pl-1">
    {children}
  </label>
);

export const FieldShell: React.FC<{
  id?: string;
  label: string;
  children: React.ReactNode;
}> = ({ id, label, children }) => (
  <div className="flex flex-col gap-2">
    <FieldLabel htmlFor={id}>{label}</FieldLabel>
    {children}
  </div>
);
