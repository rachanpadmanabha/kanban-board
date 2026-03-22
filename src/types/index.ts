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
}

export interface Column {
  readonly id: string;
  readonly title: string;
  readonly taskIds: readonly string[];
}

export interface User {
  id: string;
  name: string;
  initials: string;
  color: string;
}

export interface Board {
  readonly columns: readonly Column[];
  readonly tasks: Record<string, Task>;
}

export interface TaskFormData {
  title: string;
  description: string;
  tags: string[];
  priority: Priority;
  columnId: string;
  assigneeId?: string;
}
