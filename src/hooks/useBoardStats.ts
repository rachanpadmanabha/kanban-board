import { useMemo } from 'react';
import type { Board, Task } from '../types';
import { isOverdue } from '../utils/date';

export interface BoardStat {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly detail: string;
  readonly tone: string;
}

const DONE_COLUMN_ID = 'done';
const WEEK_MS = 7 * 86_400_000;

export function useBoardStats(board: Board, now: number): readonly BoardStat[] {
  return useMemo(() => {
    const tasks = Object.values(board.tasks) as Task[];
    const total = tasks.length;
    const open = tasks.filter((t) => t.columnId !== DONE_COLUMN_ID);

    const done = total - open.length;
    const completion = total === 0 ? 0 : Math.round((done / total) * 100);
    const inProgress = tasks.filter((t) => t.columnId === 'in-progress').length;
    const overdue = open.filter((t) => isOverdue(t.dueDate, now)).length;
    const dueThisWeek = open.filter((t) => {
      if (!t.dueDate || isOverdue(t.dueDate, now)) return false;
      return new Date(`${t.dueDate}T00:00:00`).getTime() - now <= WEEK_MS;
    }).length;

    return [
      {
        id: 'completion',
        label: 'Completion',
        value: `${completion}%`,
        detail: total === 0 ? 'No tasks yet' : `${done} of ${total} done`,
        tone: 'text-tertiary',
      },
      {
        id: 'in-progress',
        label: 'In Progress',
        value: String(inProgress),
        detail: `${open.length} still open`,
        tone: 'text-primary',
      },
      {
        id: 'overdue',
        label: 'Overdue',
        value: String(overdue),
        detail: overdue === 0 ? 'All on track' : 'Needs attention',
        tone: overdue === 0 ? 'text-tertiary' : 'text-error',
      },
      {
        id: 'due-soon',
        label: 'Due This Week',
        value: String(dueThisWeek),
        detail: dueThisWeek === 0 ? 'Nothing scheduled' : 'Upcoming deadlines',
        tone: dueThisWeek === 0 ? 'text-outline' : 'text-warning',
      },
    ];
  }, [board, now]);
}
