import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../types';
import { USERS } from '../data/mockData';

interface TaskCardProps {
  readonly task: Task;
  readonly onClick: () => void;
  readonly isDone?: boolean;
}

const priorityClasses: Record<string, { border: string; text: string; bg: string }> = {
  low: { border: 'border-l-outline', text: 'text-outline', bg: 'bg-outline/20' },
  medium: { border: 'border-l-primary/50', text: 'text-primary', bg: 'bg-primary/20' },
  high: { border: 'border-l-secondary', text: 'text-secondary', bg: 'bg-secondary/20' },
  urgent: { border: 'border-l-error', text: 'text-error', bg: 'bg-error/20' },
};

function timeAgo(dateStr: string): string {
  if (!dateStr) return '';
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, isDone = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const pClass = priorityClasses[task.priority] || priorityClasses.medium;
  const assignee = task.assigneeId ? USERS.find(u => u.id === task.assigneeId) : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick(); }}
      role="button"
      tabIndex={0}
      aria-label={`Task: ${task.title}`}
      className={`
        glass-card p-5 rounded-DEFAULT group cursor-grab active:cursor-grabbing border-l-4 ${pClass.border}
        transition-all duration-300 ease-out flex flex-col shrink-0
        hover:bg-white/10 hover:border-white/20
        ${isDragging ? 'opacity-50 scale-[1.02] shadow-2xl z-50 rotate-[2deg]' : ''}
        ${isDone ? 'bg-white/[0.02] opacity-70' : ''}
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] font-bold tracking-widest uppercase ${isDone ? 'text-tertiary' : pClass.text}`}>
          {isDone ? 'Success' : task.priority}
        </span>
        {isDone && (
          <svg className="w-4 h-4 text-tertiary" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        )}
      </div>

      <h4 className={`font-medium mb-2 transition-colors ${isDone ? 'text-outline line-through' : 'text-white group-hover:text-primary'}`}>
        {task.title}
      </h4>

      {task.description && (
        <p className={`text-sm mb-4 line-clamp-2 ${isDone ? 'text-white/40' : 'text-on-surface-variant'}`}>
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-auto">
        <div className="flex flex-wrap gap-2">
          {!isDone && task.tags.slice(0, 2).map((tag, i) => (
            <span key={tag} className={`${i === 0 ? 'bg-primary-container/20 text-primary' : 'bg-secondary-container/30 text-secondary'} text-[10px] font-bold px-2 py-0.5 rounded-full`}>
              {tag}
            </span>
          ))}
          {!isDone && task.tags.length > 2 && (
            <span className="bg-white/10 text-on-surface-variant text-[10px] font-bold px-2 py-0.5 rounded-full">
              +{task.tags.length - 2}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {assignee && (
            <div 
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold border ${assignee.color}`} 
              title={assignee.name}
              aria-label={`Assigned to ${assignee.name}`}
            >
              {assignee.initials}
            </div>
          )}
          <span className="text-[10px] text-outline font-label whitespace-nowrap shrink-0">
            {isDone ? `Completed ${timeAgo(task.createdAt)}` : timeAgo(task.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};
