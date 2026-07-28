const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const DAY_MS = DAY * 1000;

/** All helpers take `now` explicitly so they stay pure and testable. */
export function timeAgo(dateStr: string | undefined, now: number): string {
  if (!dateStr) return '';
  const then = new Date(dateStr).getTime();
  if (Number.isNaN(then)) return '';

  const seconds = Math.floor((now - then) / 1000);
  if (seconds < MINUTE) return 'just now';
  if (seconds < HOUR) return `${Math.floor(seconds / MINUTE)}m ago`;
  if (seconds < DAY) return `${Math.floor(seconds / HOUR)}h ago`;
  const days = Math.floor(seconds / DAY);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export function formatAbsolute(dateStr: string | undefined): string | undefined {
  if (!dateStr) return undefined;
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

/** Whole calendar days from `now` until `dueDate`; negative once overdue. */
function daysUntilDue(dueDate: string, now: number): number | null {
  const due = new Date(`${dueDate}T00:00:00`);
  if (Number.isNaN(due.getTime())) return null;

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  return Math.round((due.getTime() - startOfToday.getTime()) / DAY_MS);
}

export function isOverdue(dueDate: string | undefined, now: number): boolean {
  if (!dueDate) return false;
  const days = daysUntilDue(dueDate, now);
  return days !== null && days < 0;
}

export interface DueDescriptor {
  readonly label: string;
  readonly tone: string;
  readonly overdue: boolean;
}

export function describeDueDate(
  dueDate: string | undefined,
  now: number,
): DueDescriptor | null {
  if (!dueDate) return null;
  const diffDays = daysUntilDue(dueDate, now);
  if (diffDays === null) return null;

  if (diffDays < 0) {
    const overdueBy = Math.abs(diffDays);
    return {
      label: overdueBy === 1 ? 'Overdue by 1 day' : `Overdue by ${overdueBy} days`,
      tone: 'text-error',
      overdue: true,
    };
  }
  if (diffDays === 0) return { label: 'Due today', tone: 'text-warning', overdue: false };
  if (diffDays === 1) return { label: 'Due tomorrow', tone: 'text-warning', overdue: false };
  if (diffDays <= 7) {
    return { label: `Due in ${diffDays} days`, tone: 'text-on-surface-variant', overdue: false };
  }

  return {
    label: `Due ${new Date(`${dueDate}T00:00:00`).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    })}`,
    tone: 'text-outline',
    overdue: false,
  };
}
