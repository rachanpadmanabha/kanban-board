import type { Board, User } from '../types';

export const USERS: User[] = [
  { id: 'u1', name: 'Rachan K', initials: 'RK', color: 'bg-primary/20 text-primary border-primary/30' },
  { id: 'u2', name: 'Alex M', initials: 'AM', color: 'bg-tertiary/20 text-tertiary border-tertiary/30' },
  { id: 'u3', name: 'Sarah J', initials: 'SJ', color: 'bg-error/20 text-error border-error/30' },
];

export const DEFAULT_COLUMNS = [
  { id: 'todo', title: 'Todo' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
] as const;

export const PRIORITY_CONFIG = {
  low: { label: 'Low', color: '#94a3b8', bgClass: 'bg-text-secondary/10' },
  medium: { label: 'Medium', color: '#38bdf8', bgClass: 'bg-glacial/10' },
  high: { label: 'High', color: '#fbbf24', bgClass: 'bg-amber/10' },
  urgent: { label: 'Urgent', color: '#f87171', bgClass: 'bg-aurora-red/10' },
} as const;

export const COLUMN_STATUS_COLORS: Record<string, string> = {
  'todo': '#94a3b8',
  'in-progress': '#38bdf8',
  'review': '#bdc2ff',
  'done': '#4ee6aa',
};

export const AVAILABLE_TAGS = [
  'Design', 'Frontend', 'Backend', 'API', 'Bug', 'Feature',
  'Docs', 'Testing', 'DevOps', 'UX',
] as const;

export const INITIAL_BOARD: Board = {
  columns: [
    { id: 'todo', title: 'Todo', taskIds: ['task-1', 'task-2', 'task-3', 'task-4'] },
    { id: 'in-progress', title: 'In Progress', taskIds: ['task-5', 'task-6'] },
    { id: 'review', title: 'Review', taskIds: ['task-7'] },
    { id: 'done', title: 'Done', taskIds: ['task-8', 'task-9'] },
  ],
  tasks: {
    'task-1': {
      id: 'task-1',
      title: 'Design token audit',
      description: 'Review and consolidate the design token palette for consistency across all components.',
      tags: ['Design', 'UX'],
      priority: 'high',
      columnId: 'todo',
      createdAt: '2026-03-20T10:00:00Z',
      assigneeId: 'u1',
    },
    'task-2': {
      id: 'task-2',
      title: 'Implement drag-and-drop',
      description: 'Add smooth drag-and-drop between Kanban columns using dnd-kit library.',
      tags: ['Frontend', 'Feature'],
      priority: 'urgent',
      columnId: 'todo',
      createdAt: '2026-03-19T09:15:00Z',
      assigneeId: 'u1',
    },
    'task-3': {
      id: 'task-3',
      title: 'API rate limiting',
      description: 'Set up rate limiting middleware to prevent abuse of public endpoints.',
      tags: ['Backend', 'API'],
      priority: 'medium',
      columnId: 'todo',
      createdAt: '2026-03-18T10:00:00Z',
      assigneeId: 'u1',
    },
    'task-4': {
      id: 'task-4',
      title: 'Write unit tests for hooks',
      description: 'Add comprehensive test coverage for custom React hooks.',
      tags: ['Testing', 'Frontend'],
      priority: 'low',
      columnId: 'todo',
      createdAt: '2026-03-18T11:30:00Z',
      assigneeId: 'u2',
    },
    'task-5': {
      id: 'task-5',
      title: 'Glassmorphic card component',
      description: 'Build reusable glass-effect card with backdrop blur and translucent borders.',
      tags: ['Frontend', 'Design'],
      priority: 'high',
      columnId: 'in-progress',
      createdAt: '2026-03-16T11:00:00Z',
      assigneeId: 'u2',
    },
    'task-6': {
      id: 'task-6',
      title: 'Local storage persistence',
      description: 'Implement board state serialization with automatic save/restore from localStorage.',
      tags: ['Frontend', 'Feature'],
      priority: 'medium',
      columnId: 'in-progress',
      createdAt: '2026-03-15T13:20:00Z',
      assigneeId: 'u2',
    },
    'task-7': {
      id: 'task-7',
      title: 'Fix modal z-index stacking',
      description: 'Resolve overlay stacking context issues when multiple modals are triggered.',
      tags: ['Bug', 'Frontend'],
      priority: 'urgent',
      columnId: 'review',
      createdAt: '2026-03-14T08:00:00Z',
      assigneeId: 'u3',
    },
    'task-8': {
      id: 'task-8',
      title: 'Setup CI/CD pipeline',
      description: 'Configure GitHub Actions for automated builds, linting, and deployments.',
      tags: ['DevOps'],
      priority: 'medium',
      columnId: 'done',
      createdAt: '2026-03-13T14:45:00Z',
      assigneeId: 'u3',
    },
    'task-9': {
      id: 'task-9',
      title: 'Project scaffolding',
      description: 'Initialize Vite + React + TypeScript project with Tailwind CSS integration.',
      tags: ['Frontend', 'DevOps'],
      priority: 'low',
      columnId: 'done',
      createdAt: '2026-03-12T09:00:00Z',
    },
  },
};
