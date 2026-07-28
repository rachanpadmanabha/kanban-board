import React from 'react';
import { CURRENT_USER_ID, USERS, USER_ACCENTS } from '../data/config';
import { Icon } from './ui/Icon';

interface TopNavProps {
  readonly searchQuery: string;
  readonly onSearchChange: (value: string) => void;
  readonly onOpenNav: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ searchQuery, onSearchChange, onOpenNav }) => {
  const currentUser = USERS.find((u) => u.id === CURRENT_USER_ID);
  const others = USERS.filter((u) => u.id !== CURRENT_USER_ID);

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-60 z-30 flex items-center gap-3 sm:gap-4 px-4 sm:px-6 h-16 bg-[#0a0e1a]/60 backdrop-blur-xl border-b border-white/10">
      <button
        type="button"
        onClick={onOpenNav}
        aria-label="Open navigation"
        className="lg:hidden p-2 -ml-2 rounded-full text-on-surface-variant hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
      >
        <Icon name="list" className="w-5 h-5" />
      </button>

      <div className="relative flex-1 min-w-0 max-w-md">
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
          placeholder="Search title, description or tag..."
          className="
            w-full bg-white/5 border border-transparent rounded-full
            pl-10 pr-4 py-1.5 text-sm text-white placeholder-outline
            focus:border-primary/40 focus:bg-white/10 focus:outline-none
            transition-colors
          "
        />
      </div>

      <div className="flex items-center -space-x-2 ml-auto shrink-0">
        {others.map((user) => (
          <span
            key={user.id}
            className={`hidden sm:flex h-8 w-8 rounded-full items-center justify-center text-[10px] font-bold border-2 border-[#0a0e1a] ${USER_ACCENTS[user.accent]}`}
            title={user.name}
          >
            {user.initials}
          </span>
        ))}
        {currentUser && (
          <span
            className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-[#0a0e1a] ${USER_ACCENTS[currentUser.accent]}`}
            title={`${currentUser.name} (you)`}
          >
            {currentUser.initials}
          </span>
        )}
      </div>
    </header>
  );
};
