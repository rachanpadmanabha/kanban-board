import type { Board } from '../types';

/**
 * Seed content for a first-time visitor. Dates are generated relative to now
 * so the "2h ago" / "due in 3 days" labels stay believable over time.
 */
const daysFromNow = (days: number): string =>
  new Date(Date.now() + days * 86_400_000).toISOString();

const dueOn = (days: number): string => daysFromNow(days).slice(0, 10);

export const createSeedBoard = (): Board => ({
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
      createdAt: daysFromNow(-2),
      dueDate: dueOn(3),
      assigneeId: 'u1',
    },
    'task-2': {
      id: 'task-2',
      title: 'Implement drag-and-drop',
      description: 'Add smooth drag-and-drop between Kanban columns using dnd-kit library.',
      tags: ['Frontend', 'Feature'],
      priority: 'urgent',
      columnId: 'todo',
      createdAt: daysFromNow(-3),
      dueDate: dueOn(-1),
      assigneeId: 'u1',
    },
    'task-3': {
      id: 'task-3',
      title: 'API rate limiting',
      description: 'Set up rate limiting middleware to prevent abuse of public endpoints.',
      tags: ['Backend', 'API'],
      priority: 'medium',
      columnId: 'todo',
      createdAt: daysFromNow(-4),
      dueDate: dueOn(9),
      assigneeId: 'u1',
    },
    'task-4': {
      id: 'task-4',
      title: 'Write unit tests for hooks',
      description: 'Add comprehensive test coverage for custom React hooks.',
      tags: ['Testing', 'Frontend'],
      priority: 'low',
      columnId: 'todo',
      createdAt: daysFromNow(-4),
      assigneeId: 'u2',
    },
    'task-5': {
      id: 'task-5',
      title: 'Glassmorphic card component',
      description: 'Build reusable glass-effect card with backdrop blur and translucent borders.',
      tags: ['Frontend', 'Design'],
      priority: 'high',
      columnId: 'in-progress',
      createdAt: daysFromNow(-6),
      dueDate: dueOn(1),
      assigneeId: 'u2',
    },
    'task-6': {
      id: 'task-6',
      title: 'Local storage persistence',
      description: 'Implement board state serialization with automatic save/restore from localStorage.',
      tags: ['Frontend', 'Feature'],
      priority: 'medium',
      columnId: 'in-progress',
      createdAt: daysFromNow(-7),
      dueDate: dueOn(4),
      assigneeId: 'u2',
    },
    'task-7': {
      id: 'task-7',
      title: 'Fix modal z-index stacking',
      description: 'Resolve overlay stacking context issues when multiple modals are triggered.',
      tags: ['Bug', 'Frontend'],
      priority: 'urgent',
      columnId: 'review',
      createdAt: daysFromNow(-8),
      dueDate: dueOn(0),
      assigneeId: 'u3',
    },
    'task-8': {
      id: 'task-8',
      title: 'Setup CI/CD pipeline',
      description: 'Configure GitHub Actions for automated builds, linting, and deployments.',
      tags: ['DevOps'],
      priority: 'medium',
      columnId: 'done',
      createdAt: daysFromNow(-9),
      assigneeId: 'u3',
    },
    'task-9': {
      id: 'task-9',
      title: 'Project scaffolding',
      description: 'Initialize Vite + React + TypeScript project with Tailwind CSS integration.',
      tags: ['Frontend', 'DevOps'],
      priority: 'low',
      columnId: 'done',
      createdAt: daysFromNow(-10),
    },
  },
});
