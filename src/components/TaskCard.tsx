import React, { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../types';
import { PRIORITY_CONFIG, USERS, USER_ACCENTS } from '../data/config';
import { Icon } from './ui/Icon';
import { useNow } from '../hooks/useNow';
import { describeDueDate, formatAbsolute, timeAgo } from '../utils/date';

interface TaskCardProps {
  readonly task: Task;
  /** Takes the task rather than a closure so memoised cards stay memoised. */
  readonly onSelect: (task: Task) => void;
  readonly isDone?: boolean;
  /** Overlay copies render outside the DnD context and must not re-register. */
  readonly isOverlay?: boolean;
}

const TaskCardView: React.FC<TaskCardProps> = ({
  task,
  onSelect,
  isDone = false,
  isOverlay = false,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    disabled: isOverlay,
  });

  const now = useNow();
  const priority = PRIORITY_CONFIG[task.priority];
  const assignee = task.assigneeId ? USERS.find((u) => u.id === task.assigneeId) : undefined;
  const due = describeDueDate(task.dueDate, now);

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      onClick={() => onSelect(task)}
      // Space is dnd-kit's keyboard drag activator, so only Enter opens the task.
      // This must stay after the {...listeners} spread or it would shadow it.
      onKeyDown={(e) => {
        if (e.key !== 'Enter') {
          listeners?.onKeyDown?.(e);
          return;
        }
        e.preventDefault();
        onSelect(task);
      }}
      aria-label={`${task.title}. Priority ${priority.label}. Press Enter to edit, Space to start dragging.`}
      className={`
        glass-card p-4 rounded-DEFAULT group cursor-grab active:cursor-grabbing
        border-l-4 ${priority.border}
        transition-[background-color,border-color,box-shadow] duration-200 ease-out
        flex flex-col shrink-0
        hover:bg-white/10 hover:border-white/20 hover:shadow-[var(--shadow-glow-glacial)]
        ${isDragging ? 'opacity-40' : ''}
        ${isDone ? 'bg-white/[0.02] opacity-70' : ''}
      `}
    >
      <div className="flex justify-between items-start mb-2 gap-2">
        <span
          className={`text-[10px] font-bold tracking-widest uppercase ${isDone ? 'text-tertiary' : priority.text}`}
        >
          {isDone ? 'Success' : priority.label}
        </span>
        {isDone && <Icon name="check" className="w-4 h-4 text-tertiary shrink-0" />}
      </div>

      <h4
        className={`font-medium mb-2 leading-snug transition-colors ${
          isDone ? 'text-outline line-through' : 'text-white group-hover:text-primary'
        }`}
      >
        {task.title}
      </h4>

      {task.description && (
        <p className={`text-sm mb-3 line-clamp-2 ${isDone ? 'text-white/40' : 'text-on-surface-variant'}`}>
          {task.description}
        </p>
      )}

      {!isDone && due && (
        <div
          className={`inline-flex items-center gap-1.5 mb-3 text-[11px] font-semibold ${due.tone}`}
          title={formatAbsolute(task.dueDate)}
        >
          <Icon name={due.overdue ? 'warning' : 'clock'} className="w-3.5 h-3.5" />
          {due.label}
        </div>
      )}

      <div className="flex items-end justify-between gap-2 mt-auto">
        <div className="flex flex-wrap gap-1.5 min-w-0">
          {!isDone &&
            task.tags.slice(0, 2).map((tag, i) => (
              <span
                key={tag}
                className={`${
                  i === 0
                    ? 'bg-primary-container/20 text-primary'
                    : 'bg-secondary-container/30 text-secondary'
                } text-[10px] font-bold px-2 py-0.5 rounded-full`}
              >
                {tag}
              </span>
            ))}
          {!isDone && task.tags.length > 2 && (
            <span className="bg-white/10 text-on-surface-variant text-[10px] font-bold px-2 py-0.5 rounded-full">
              +{task.tags.length - 2}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {assignee && (
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold border ${USER_ACCENTS[assignee.accent]}`}
              title={`Assigned to ${assignee.name}`}
            >
              {assignee.initials}
            </span>
          )}
          <span
            className="text-[10px] text-outline whitespace-nowrap"
            title={formatAbsolute(task.createdAt)}
          >
            {isDone ? `Done ${timeAgo(task.createdAt, now)}` : timeAgo(task.createdAt, now)}
          </span>
        </div>
      </div>
    </div>
  );
};

export const TaskCard = memo(TaskCardView);
