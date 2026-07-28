import React, { memo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task, Column } from '../types';
import { COLUMN_ACCENTS, DEFAULT_COLUMNS } from '../data/config';
import { TaskCard } from './TaskCard';
import { Icon } from './ui/Icon';

interface KanbanColumnProps {
  readonly column: Column;
  readonly tasks: readonly Task[];
  /** Total before search/filter, so the header count is not misleading. */
  readonly totalCount: number;
  readonly onSelectTask: (task: Task) => void;
  readonly onAddTask: (columnId: string) => void;
}

const KanbanColumnView: React.FC<KanbanColumnProps> = ({
  column,
  tasks,
  totalCount,
  onSelectTask,
  onAddTask,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const isDone = column.id === 'done';
  const wipLimit = DEFAULT_COLUMNS.find((c) => c.id === column.id)?.wipLimit;
  const overWipLimit = wipLimit !== undefined && totalCount > wipLimit;
  const isFiltered = tasks.length !== totalCount;

  return (
    <section
      aria-label={`${column.title} column, ${totalCount} tasks`}
      className={`
        flex flex-col gap-4 relative h-full
        w-[280px] shrink-0 lg:w-auto lg:flex-1 lg:min-w-[220px]
        transition-colors duration-300 rounded-2xl
        ${isOver ? 'bg-white/5 ring-1 ring-white/10' : 'ring-1 ring-transparent'}
      `}
    >
      <div className="flex items-center justify-between px-2 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <span className={`w-2 h-2 rounded-full shrink-0 ${COLUMN_ACCENTS[column.id] ?? 'bg-outline'}`} />
          <h3 className="font-headline font-semibold text-white tracking-wide truncate">
            {column.title}
          </h3>
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded shrink-0 ${
              overWipLimit ? 'bg-warning/20 text-warning' : 'bg-white/5 text-outline'
            }`}
            title={overWipLimit ? `Over the WIP limit of ${wipLimit}` : undefined}
          >
            {isFiltered ? `${tasks.length}/${totalCount}` : totalCount}
            {wipLimit !== undefined && !isFiltered ? ` / ${wipLimit}` : ''}
          </span>
        </div>
        <button
          onClick={() => onAddTask(column.id)}
          className="text-on-surface-variant hover:text-white hover:bg-white/10 rounded-full p-1 cursor-pointer transition-colors"
          aria-label={`Add task to ${column.title}`}
          type="button"
        >
          <Icon name="plus" className="w-4 h-4" />
        </button>
      </div>

      <div ref={setNodeRef} className="flex-1 overflow-y-auto flex flex-col gap-3 pb-8 px-1">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onSelect={onSelectTask} isDone={isDone} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center text-outline">
            <Icon name="inbox" className="w-7 h-7 opacity-50" />
            <p className="text-xs font-medium">
              {isFiltered ? 'No matches here' : 'Nothing here yet'}
            </p>
          </div>
        )}

        <button
          onClick={() => onAddTask(column.id)}
          className="
            w-full py-3 rounded-DEFAULT border-2 border-dashed mt-1
            border-white/5 text-on-surface-variant
            hover:text-white hover:border-white/15 hover:bg-white/[0.03]
            transition-colors font-medium text-sm
            flex items-center justify-center gap-2 cursor-pointer shrink-0
          "
          type="button"
        >
          <Icon name="plus" className="w-4 h-4" />
          Add Task
        </button>
      </div>
    </section>
  );
};

export const KanbanColumn = memo(KanbanColumnView);
