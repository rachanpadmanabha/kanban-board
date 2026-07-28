import React from 'react';
import { Icon } from './ui/Icon';

export type BoardFilter = 'all' | 'my-tasks' | 'high-priority' | 'overdue';

const FILTERS: readonly { id: BoardFilter; label: string }[] = [
  { id: 'all', label: 'All Tasks' },
  { id: 'my-tasks', label: 'My Tasks' },
  { id: 'high-priority', label: 'High Priority' },
  { id: 'overdue', label: 'Overdue' },
];

interface ToolbarProps {
  readonly filter: BoardFilter;
  readonly onFilterChange: (filter: BoardFilter) => void;
  readonly onNewTask: () => void;
  readonly searchQuery: string;
  readonly onSearchChange: (value: string) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  filter,
  onFilterChange,
  onNewTask,
  searchQuery,
  onSearchChange,
}) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0 relative z-10">
    <div className="flex gap-2 overflow-x-auto pb-1 -mb-1" role="group" aria-label="Filter tasks">
      {FILTERS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => onFilterChange(id)}
          aria-pressed={filter === id}
          className={`
            px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap
            transition-colors cursor-pointer
            ${filter === id
              ? 'glass-card text-white'
              : 'bg-white/5 hover:bg-white/10 text-on-surface-variant'}
          `}
        >
          {label}
        </button>
      ))}
    </div>

    <div className="flex items-center gap-3">
      {searchQuery && (
        <button
          type="button"
          onClick={() => onSearchChange('')}
          className="text-xs text-outline hover:text-white transition-colors cursor-pointer whitespace-nowrap"
        >
          Clear search
        </button>
      )}
      <button
        type="button"
        onClick={onNewTask}
        className="
          py-2 px-5 rounded-full
          bg-gradient-to-br from-primary to-primary-container
          text-on-primary font-bold text-sm
          flex items-center justify-center gap-2
          shadow-lg shadow-primary/20
          hover:brightness-110 active:scale-95 transition-all cursor-pointer
        "
      >
        <Icon name="plus" className="w-4 h-4" />
        New Task
      </button>
    </div>
  </div>
);
