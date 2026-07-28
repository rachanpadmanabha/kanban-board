import React, { useMemo } from 'react';
import type { Column, Task } from '../types';
import { PRIORITY_CONFIG, PRIORITY_ORDER, USERS, USER_ACCENTS } from '../data/config';
import { useNow } from '../hooks/useNow';
import { describeDueDate, formatAbsolute } from '../utils/date';
import { Icon } from './ui/Icon';

interface TaskListViewProps {
  readonly groups: readonly { column: Column; tasks: readonly Task[] }[];
  readonly onSelectTask: (task: Task) => void;
}

/** Highest priority first, then soonest due date, then title. */
function compareTasks(a: Task, b: Task): number {
  const byPriority = PRIORITY_ORDER.indexOf(b.priority) - PRIORITY_ORDER.indexOf(a.priority);
  if (byPriority !== 0) return byPriority;

  if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
  if (a.dueDate) return -1;
  if (b.dueDate) return 1;

  return a.title.localeCompare(b.title);
}

export const TaskListView: React.FC<TaskListViewProps> = ({ groups, onSelectTask }) => {
  const now = useNow();

  const rows = useMemo(
    () =>
      groups
        .flatMap(({ column, tasks }) => tasks.map((task) => ({ task, columnTitle: column.title })))
        .sort((a, b) => compareTasks(a.task, b.task)),
    [groups],
  );

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-outline">
        <Icon name="inbox" className="w-8 h-8 opacity-50" />
        <p className="text-sm font-medium">No tasks match the current filter.</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pb-6">
      <ul aria-label="All tasks" className="flex flex-col gap-2">
        {rows.map(({ task, columnTitle }) => {
          const priority = PRIORITY_CONFIG[task.priority];
          const assignee = task.assigneeId
            ? USERS.find((u) => u.id === task.assigneeId)
            : undefined;
          const due = describeDueDate(task.dueDate, now);

          return (
            <li key={task.id}>
              <button
                type="button"
                onClick={() => onSelectTask(task)}
                className={`
                  glass-card w-full text-left rounded-DEFAULT
                  border-l-4 ${priority.border}
                  px-4 py-3 flex items-center gap-4
                  hover:bg-white/10 transition-colors cursor-pointer
                `}
              >
                <span className={`text-[10px] font-bold uppercase tracking-widest w-16 shrink-0 ${priority.text}`}>
                  {priority.label}
                </span>

                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-medium text-white truncate">
                    {task.title}
                  </span>
                  {task.description && (
                    <span className="block text-xs text-on-surface-variant truncate mt-0.5">
                      {task.description}
                    </span>
                  )}
                </span>

                {due && (
                  <span
                    className={`hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold shrink-0 ${due.tone}`}
                    title={formatAbsolute(task.dueDate)}
                  >
                    <Icon name={due.overdue ? 'warning' : 'clock'} className="w-3.5 h-3.5" />
                    {due.label}
                  </span>
                )}

                <span className="hidden md:block text-[11px] text-outline w-24 shrink-0 text-right">
                  {columnTitle}
                </span>

                {assignee ? (
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border shrink-0 ${USER_ACCENTS[assignee.accent]}`}
                    title={`Assigned to ${assignee.name}`}
                  >
                    {assignee.initials}
                  </span>
                ) : (
                  <span className="w-6 shrink-0" aria-hidden="true" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
