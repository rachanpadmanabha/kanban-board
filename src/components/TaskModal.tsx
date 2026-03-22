import React, { useState } from 'react';
import type { Task, TaskFormData, Priority } from '../types';
import { AVAILABLE_TAGS, PRIORITY_CONFIG, DEFAULT_COLUMNS, USERS } from '../data/mockData';
import { Modal } from './ui/Modal';
import { GlassButton } from './ui/GlassButton';
import { GlassInput } from './ui/GlassInput';
import { TagBadge } from './ui/Badge';

interface TaskModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSave: (data: TaskFormData) => void;
  readonly onDelete?: () => void;
  readonly task?: Task | null;
  readonly defaultColumnId?: string;
}

const priorityOptions: Priority[] = ['low', 'medium', 'high', 'urgent'];

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  task,
  defaultColumnId = 'todo',
}) => {
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [priority, setPriority] = useState<Priority>(task?.priority ?? 'medium');
  const [tags, setTags] = useState<string[]>(task ? [...task.tags] : []);
  const [columnId, setColumnId] = useState(task?.columnId ?? defaultColumnId);
  const [assigneeId, setAssigneeId] = useState<string>(task?.assigneeId ?? '');

  // Reset form when task changes
  React.useEffect(() => {
    setTitle(task?.title ?? '');
    setDescription(task?.description ?? '');
    setPriority(task?.priority ?? 'medium');
    setTags(task ? [...task.tags] : []);
    setColumnId(task?.columnId ?? defaultColumnId);
    setAssigneeId(task?.assigneeId ?? '');
  }, [task, defaultColumnId]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    const formData: TaskFormData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      tags,
      columnId,
      assigneeId: assigneeId || undefined,
    };
    onSave(formData);
    onClose();
  };

  const toggleTag = (tag: string) => {
    setTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const isEdit = Boolean(task);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Task' : 'New Task'}>
      <div className="flex flex-col gap-5">
        {/* Title */}
        <GlassInput
          id="task-title"
          label="Title"
          value={title}
          onChange={setTitle}
          placeholder="What needs to be done?"
        />

        {/* Description */}
        <GlassInput
          id="task-description"
          label="Description"
          value={description}
          onChange={setDescription}
          placeholder="Add details..."
          multiline
          rows={3}
        />

        {/* Priority */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-text-hint uppercase tracking-wider">
            Priority
          </label>
          <div className="flex gap-2">
            {priorityOptions.map(p => {
              const config = PRIORITY_CONFIG[p];
              const isSelected = priority === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`
                    px-4 py-2 rounded-full text-xs font-bold
                    transition-all duration-200 cursor-pointer border
                    ${isSelected
                      ? 'shadow-lg bg-surface-variant text-white border-white/20'
                      : 'bg-white/5 border-transparent text-outline hover:bg-white/10 hover:text-white'
                    }
                  `}
                  style={isSelected ? { color: config.color, borderColor: config.color } : { borderLeftColor: config.color, borderLeftWidth: '3px' }}
                >
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-outline uppercase tracking-widest pl-1">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_TAGS.map(tag => {
              const isSelected = tags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`
                    px-3 py-1.5 rounded-full text-[10px] font-bold
                    transition-all duration-200 cursor-pointer border
                    ${isSelected
                      ? 'text-primary bg-primary-container/20 border-primary/30'
                      : 'text-outline bg-white/5 border-transparent hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  {isSelected ? '✓ ' : ''}{tag}
                </button>
              );
            })}
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tags.map(tag => (
                <TagBadge key={tag} tag={tag} removable onRemove={() => toggleTag(tag)} />
              ))}
            </div>
          )}
        </div>

        {/* Status */}
        <div className="flex flex-col gap-2">
          <label htmlFor="task-status" className="text-[10px] font-bold text-outline uppercase tracking-widest pl-1">
            Status
          </label>
          <select
            id="task-status"
            value={columnId}
            onChange={e => setColumnId(e.target.value)}
            className="
              w-full bg-white/5 backdrop-blur-md
              text-white
              rounded-DEFAULT
              border border-white/5
              px-4 py-3 text-sm font-medium
              transition-all duration-200 cursor-pointer
              focus:border-primary/50 focus:ring-1 focus:ring-primary/50 focus:bg-white/10
              focus:outline-none appearance-none
            "
          >
            {DEFAULT_COLUMNS.map(col => (
              <option key={col.id} value={col.id} className="bg-surface-variant text-white">
                {col.title}
              </option>
            ))}
          </select>
        </div>

        {/* Assignee */}
        <div className="flex flex-col gap-2">
          <label htmlFor="task-assignee" className="text-[10px] font-bold text-outline uppercase tracking-widest pl-1">
            Assignee
          </label>
          <select
            id="task-assignee"
            value={assigneeId}
            onChange={e => setAssigneeId(e.target.value)}
            className="
              w-full bg-white/5 backdrop-blur-md
              text-white
              rounded-DEFAULT
              border border-white/5
              px-4 py-3 text-sm font-medium
              transition-all duration-200 cursor-pointer
              focus:border-primary/50 focus:ring-1 focus:ring-primary/50 focus:bg-white/10
              focus:outline-none appearance-none
            "
          >
            <option value="" className="bg-surface-variant text-white">Unassigned</option>
            {USERS.map(user => (
              <option key={user.id} value={user.id} className="bg-surface-variant text-white">
                {user.name}
              </option>
            ))}
          </select>
        </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 mt-1">
        <div>
          {isEdit && onDelete && (
            <GlassButton variant="danger" size="sm" onClick={() => { onDelete(); onClose(); }}>
              Delete Task
            </GlassButton>
          )}
        </div>
        <div className="flex gap-2">
            <GlassButton variant="ghost" size="md" onClick={onClose}>
              Cancel
            </GlassButton>
            <GlassButton
              variant="primary"
              size="md"
              onClick={handleSubmit}
              disabled={!title.trim()}
            >
              {isEdit ? 'Save Changes' : 'Create Task'}
            </GlassButton>
          </div>
        </div>
      </div>
    </Modal>
  );
};
