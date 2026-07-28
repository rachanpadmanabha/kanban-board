import React, { useState } from 'react';
import type { Task, TaskFormData, Priority } from '../types';
import {
  AVAILABLE_TAGS,
  DEFAULT_COLUMNS,
  PRIORITY_CONFIG,
  PRIORITY_ORDER,
  USERS,
} from '../data/config';
import { Modal } from './ui/Modal';
import { GlassButton } from './ui/GlassButton';
import { GlassInput } from './ui/GlassInput';
import { GlassSelect } from './ui/GlassSelect';
import { FieldLabel } from './ui/fieldStyles';
import { TagBadge } from './ui/Badge';

interface TaskModalProps {
  readonly onClose: () => void;
  readonly onSave: (data: TaskFormData) => void;
  readonly onDelete?: () => void;
  readonly task?: Task | null;
  readonly defaultColumnId?: string;
}

const TITLE_MAX = 120;

export const TaskModal: React.FC<TaskModalProps> = ({
  onClose,
  onSave,
  onDelete,
  task,
  defaultColumnId = 'todo',
}) => {
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [priority, setPriority] = useState<Priority>(task?.priority ?? 'medium');
  const [tags, setTags] = useState<readonly string[]>(task?.tags ?? []);
  const [columnId, setColumnId] = useState(task?.columnId ?? defaultColumnId);
  const [assigneeId, setAssigneeId] = useState(task?.assigneeId ?? '');
  const [dueDate, setDueDate] = useState(task?.dueDate ?? '');
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const isEdit = Boolean(task);
  const canSave = title.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;
    onSave({
      title: title.trim(),
      description: description.trim(),
      priority,
      tags,
      columnId,
      assigneeId: assigneeId || undefined,
      dueDate: dueDate || undefined,
    });
  };

  const toggleTag = (tag: string) =>
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  return (
    <Modal onClose={onClose} title={isEdit ? 'Edit Task' : 'New Task'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <GlassInput
          id="task-title"
          label="Title"
          value={title}
          onChange={setTitle}
          placeholder="What needs to be done?"
          maxLength={TITLE_MAX}
        />

        <GlassInput
          id="task-description"
          label="Description"
          value={description}
          onChange={setDescription}
          placeholder="Add details..."
          multiline
          rows={3}
        />

        <fieldset className="flex flex-col gap-2 border-0 p-0 m-0">
          <legend className="text-[10px] font-bold text-outline uppercase tracking-widest pl-1 mb-2">
            Priority
          </legend>
          <div className="flex flex-wrap gap-2">
            {PRIORITY_ORDER.map((p) => {
              const config = PRIORITY_CONFIG[p];
              const isSelected = priority === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  aria-pressed={isSelected}
                  className={`
                    px-4 py-2 rounded-full text-xs font-bold border
                    transition-colors duration-200 cursor-pointer
                    ${isSelected
                      ? config.chip
                      : 'bg-white/5 border-transparent text-outline hover:bg-white/10 hover:text-white'}
                  `}
                >
                  {config.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-2 border-0 p-0 m-0">
          <legend className="text-[10px] font-bold text-outline uppercase tracking-widest pl-1 mb-2">
            Tags
          </legend>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_TAGS.map((tag) => {
              const isSelected = tags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  aria-pressed={isSelected}
                  className={`
                    px-3 py-1.5 rounded-full text-[10px] font-bold border
                    transition-colors duration-200 cursor-pointer
                    ${isSelected
                      ? 'text-primary bg-primary-container/20 border-primary/30'
                      : 'text-outline bg-white/5 border-transparent hover:bg-white/10 hover:text-white'}
                  `}
                >
                  {isSelected ? '✓ ' : ''}
                  {tag}
                </button>
              );
            })}
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tags.map((tag) => (
                <TagBadge key={tag} tag={tag} removable onRemove={() => toggleTag(tag)} />
              ))}
            </div>
          )}
        </fieldset>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <GlassSelect
            id="task-status"
            label="Status"
            value={columnId}
            onChange={setColumnId}
            options={DEFAULT_COLUMNS.map((c) => ({ value: c.id, label: c.title }))}
          />
          <GlassSelect
            id="task-assignee"
            label="Assignee"
            value={assigneeId}
            onChange={setAssigneeId}
            options={[
              { value: '', label: 'Unassigned' },
              ...USERS.map((u) => ({ value: u.id, label: u.name })),
            ]}
          />
        </div>

        <GlassInput
          id="task-due-date"
          label="Due date"
          type="date"
          value={dueDate}
          onChange={setDueDate}
        />

        <div className="flex items-center justify-between gap-3 pt-2 mt-1 flex-wrap">
          <div>
            {isEdit && onDelete && !confirmingDelete && (
              <GlassButton variant="danger" size="sm" onClick={() => setConfirmingDelete(true)}>
                Delete Task
              </GlassButton>
            )}
            {confirmingDelete && (
              <div className="flex items-center gap-2">
                <FieldLabel>Delete?</FieldLabel>
                <GlassButton variant="danger" size="sm" onClick={onDelete}>
                  Yes, delete
                </GlassButton>
                <GlassButton variant="ghost" size="sm" onClick={() => setConfirmingDelete(false)}>
                  Keep
                </GlassButton>
              </div>
            )}
          </div>
          <div className="flex gap-2 ml-auto">
            <GlassButton variant="ghost" size="md" onClick={onClose}>
              Cancel
            </GlassButton>
            <GlassButton variant="primary" size="md" type="submit" disabled={!canSave}>
              {isEdit ? 'Save Changes' : 'Create Task'}
            </GlassButton>
          </div>
        </div>
      </form>
    </Modal>
  );
};
