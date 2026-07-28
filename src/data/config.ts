import type { Priority, User } from '../types';

/**
 * Priority is the only thing styled in four places at once (card border, card
 * label, modal chip, badge), so all four live together here rather than being
 * re-derived per component. Class names must stay literal for Tailwind's
 * scanner to emit them.
 */
export interface PriorityStyle {
  readonly label: string;
  readonly text: string;
  readonly border: string;
  readonly chip: string;
}

export const PRIORITY_CONFIG: Record<Priority, PriorityStyle> = {
  low: {
    label: 'Low',
    text: 'text-outline',
    border: 'border-l-outline',
    chip: 'bg-outline/20 text-outline border-outline/40',
  },
  medium: {
    label: 'Medium',
    text: 'text-primary',
    border: 'border-l-primary/60',
    chip: 'bg-primary/20 text-primary border-primary/40',
  },
  high: {
    label: 'High',
    text: 'text-warning',
    border: 'border-l-warning',
    chip: 'bg-warning/20 text-warning border-warning/40',
  },
  urgent: {
    label: 'Urgent',
    text: 'text-error',
    border: 'border-l-error',
    chip: 'bg-error/20 text-error border-error/40',
  },
};

export const PRIORITY_ORDER: readonly Priority[] = ['low', 'medium', 'high', 'urgent'];

export interface ColumnDefinition {
  readonly id: string;
  readonly title: string;
  /** Soft work-in-progress limit; the header warns past this count. */
  readonly wipLimit?: number;
}

export const DEFAULT_COLUMNS: readonly ColumnDefinition[] = [
  { id: 'todo', title: 'Todo' },
  { id: 'in-progress', title: 'In Progress', wipLimit: 3 },
  { id: 'review', title: 'Review', wipLimit: 3 },
  { id: 'done', title: 'Done' },
];

export const COLUMN_ACCENTS: Record<string, string> = {
  'todo': 'bg-outline',
  'in-progress': 'bg-primary shadow-[0_0_8px_rgba(142,213,255,0.8)]',
  'review': 'bg-secondary shadow-[0_0_8px_rgba(189,194,255,0.8)]',
  'done': 'bg-tertiary shadow-[0_0_8px_rgba(78,230,170,0.8)]',
};

export const USER_ACCENTS: Record<User['accent'], string> = {
  primary: 'bg-primary/20 text-primary border-primary/30',
  tertiary: 'bg-tertiary/20 text-tertiary border-tertiary/30',
  secondary: 'bg-secondary/20 text-secondary border-secondary/30',
  error: 'bg-error/20 text-error border-error/30',
};

export const USERS: readonly User[] = [
  { id: 'u1', name: 'Rachan K', initials: 'RK', accent: 'primary' },
  { id: 'u2', name: 'Alex M', initials: 'AM', accent: 'tertiary' },
  { id: 'u3', name: 'Sarah J', initials: 'SJ', accent: 'error' },
];

/** The signed-in user. Swap for real auth when there is a backend. */
export const CURRENT_USER_ID = 'u1';

export const AVAILABLE_TAGS: readonly string[] = [
  'Design', 'Frontend', 'Backend', 'API', 'Bug', 'Feature',
  'Docs', 'Testing', 'DevOps', 'UX',
];
