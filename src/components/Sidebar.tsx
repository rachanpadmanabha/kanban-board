import React from 'react';
import { Icon, type IconName } from './ui/Icon';

export type BoardView = 'board' | 'list';

const VIEWS: readonly { id: BoardView; label: string; icon: IconName }[] = [
  { id: 'board', label: 'Board', icon: 'board' },
  { id: 'list', label: 'List', icon: 'list' },
];

interface SidebarProps {
  readonly view: BoardView;
  readonly onViewChange: (view: BoardView) => void;
  readonly onNewTask: () => void;
  readonly onResetBoard: () => void;
  readonly taskCount: number;
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  view,
  onViewChange,
  onNewTask,
  onResetBoard,
  taskCount,
  isOpen,
  onClose,
}) => (
  <>
    {isOpen && (
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
      />
    )}

    <nav
      aria-label="Views"
      className={`
        fixed top-0 left-0 z-40 h-screen w-60 shrink-0
        flex flex-col gap-6 px-4 pt-6 pb-5
        bg-[#0a0e1a]/80 backdrop-blur-xl border-r border-white/10
        transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}
    >
      <div className="px-2">
        <p className="text-lg font-bold bg-gradient-to-br from-white to-sky-300 bg-clip-text text-transparent tracking-tight">
          Arctic Kanban
        </p>
        <p className="text-[11px] text-outline mt-0.5">
          {taskCount} {taskCount === 1 ? 'task' : 'tasks'} on this board
        </p>
      </div>

      <button
        type="button"
        onClick={onNewTask}
        title="New task (N)"
        className="
          w-full py-2.5 rounded-full
          bg-gradient-to-br from-primary to-primary-container
          text-on-primary font-bold text-sm
          flex items-center justify-center gap-2
          shadow-lg shadow-primary/20
          hover:brightness-110 active:scale-95 transition-all cursor-pointer
        "
      >
        <Icon name="plus" className="w-4 h-4" />
        New Task
        <kbd className="ml-1 rounded bg-black/20 px-1.5 py-0.5 text-[10px] font-semibold">N</kbd>
      </button>

      <ul className="flex flex-col gap-1">
        {VIEWS.map(({ id, label, icon }) => {
          const isActive = view === id;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onViewChange(id)}
                aria-current={isActive ? 'page' : undefined}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-DEFAULT
                  text-sm font-medium transition-colors cursor-pointer
                  ${isActive
                    ? 'glass-card text-white'
                    : 'text-on-surface-variant hover:text-white hover:bg-white/5'}
                `}
              >
                <Icon name={icon} className="w-4 h-4 shrink-0" />
                {label}
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={onResetBoard}
        className="
          mt-auto w-full flex items-center gap-3 px-3 py-2 rounded-DEFAULT
          text-sm font-medium text-outline
          hover:text-white hover:bg-white/5 transition-colors cursor-pointer
        "
      >
        <Icon name="archive" className="w-4 h-4 shrink-0" />
        Reset to sample board
      </button>
    </nav>
  </>
);
