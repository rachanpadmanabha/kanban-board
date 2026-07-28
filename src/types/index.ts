export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly tags: readonly string[];
  readonly priority: Priority;
  readonly columnId: string;
  readonly createdAt: string;
  readonly assigneeId?: string;
  /** ISO date (no time component) the task is due. */
  readonly dueDate?: string;
}

export interface Column {
  readonly id: string;
  readonly title: string;
  readonly taskIds: readonly string[];
}

export interface User {
  readonly id: string;
  readonly name: string;
  readonly initials: string;
  readonly accent: 'primary' | 'secondary' | 'tertiary' | 'error';
}

export interface Board {
  readonly columns: readonly Column[];
  readonly tasks: Readonly<Record<string, Task>>;
}

export interface TaskFormData {
  readonly title: string;
  readonly description: string;
  readonly tags: readonly string[];
  readonly priority: Priority;
  readonly columnId: string;
  readonly assigneeId?: string;
  readonly dueDate?: string;
}
