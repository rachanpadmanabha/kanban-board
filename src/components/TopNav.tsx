import React from 'react';
import { CURRENT_USER_ID, USERS, USER_ACCENTS } from '../data/config';
import { Icon } from './ui/Icon';

interface TopNavProps {
  readonly searchQuery: string;
  readonly onSearchChange: (value: string) => void;
}

export const TopNav: React.FC<TopNavProps> = ({ searchQuery, onSearchChange }) => {
  const currentUser = USERS.find((u) => u.id === CURRENT_USER_ID);

  return (
    <header className="fixed top-0 w-full z-40 flex justify-between items-center gap-4 px-4 sm:px-8 h-16 bg-[#0a0e1a]/60 backdrop-blur-xl border-b border-white/10">
      <span className="text-xl sm:text-2xl font-bold bg-gradient-to-br from-white to-sky-300 bg-clip-text text-transparent tracking-tight shrink-0">
        Arctic Kanban
      </span>

      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <div className="relative flex-1 min-w-0 max-w-64">
          <Icon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4"
          />
          <label htmlFor="board-search" className="sr-only">
            Search tasks
          </label>
          <input
            id="board-search"
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks..."
            className="
              w-full bg-white/5 border border-transparent rounded-full
              pl-10 pr-4 py-1.5 text-sm text-white placeholder-outline
              focus:border-primary/40 focus:bg-white/10 focus:outline-none
              transition-colors
            "
          />
        </div>

        {currentUser && (
          <span
            className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border shrink-0 ${USER_ACCENTS[currentUser.accent]}`}
            title={currentUser.name}
          >
            {currentUser.initials}
          </span>
        )}
      </div>
    </header>
  );
};
