import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task, Column } from '../types';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  readonly column: Column;
  readonly tasks: Task[];
  readonly onTaskClick: (task: Task) => void;
  readonly onAddTask: (columnId: string) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  tasks,
  onTaskClick,
  onAddTask,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const isDone = column.id === 'done';

  const dotClasses: Record<string, string> = {
    'todo': 'bg-outline shadow-none',
    'in-progress': 'bg-primary shadow-[0_0_8px_rgba(142,213,255,0.8)]',
    'review': 'bg-secondary shadow-[0_0_8px_rgba(189,194,255,0.8)]',
    'done': 'bg-tertiary shadow-[0_0_8px_rgba(78,230,170,0.8)]',
  };
  const dotClass = dotClasses[column.id] || 'bg-outline';

  return (
    <div
      className={`
        flex flex-col gap-6 relative h-full
        w-[280px] shrink-0 lg:w-auto lg:flex-1 lg:min-w-[220px]
        transition-all duration-300 rounded-2xl
        ${isOver ? 'bg-white/5 ring-1 ring-white/10 p-2 -m-2' : ''}
      `}
    >
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${dotClass}`}></div>
          <h3 className="font-headline font-semibold text-white tracking-wide">
            {column.title}
          </h3>
          <span className="text-xs font-bold bg-white/5 px-2 py-0.5 rounded text-outline">
            {tasks.length}
          </span>
        </div>
        <button className="text-on-surface-variant hover:text-white cursor-pointer transition-colors" aria-label="More options">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        </button>
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 overflow-y-auto flex flex-col gap-4 pb-12 px-1"
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
              isDone={isDone}
            />
          ))}
        </SortableContext>

        <button
          onClick={() => onAddTask(column.id)}
          className={`
            w-full py-4 rounded-DEFAULT border-2 border-dashed
            border-white/5 text-on-surface-variant hover:text-white hover:border-white/10
            transition-all font-medium text-sm flex items-center justify-center gap-2 cursor-pointer
            ${tasks.length === 0 ? 'mt-4' : 'mt-2'}
          `}
          type="button"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Add Task
        </button>
      </div>
    </div>
  );
};
