import React, { useCallback, useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import type { Task, TaskFormData } from '../types';
import { CURRENT_USER_ID } from '../data/config';
import { useKanbanBoard } from '../hooks/useKanbanBoard';
import { useNow } from '../hooks/useNow';
import { isOverdue } from '../utils/date';
import { KanbanColumn } from './KanbanColumn';
import { TaskModal } from './TaskModal';
import { TaskCard } from './TaskCard';
import { Toolbar, type BoardFilter } from './Toolbar';
import { TopNav } from './TopNav';
import { UndoToast } from './ui/UndoToast';

export const KanbanBoard: React.FC = () => {
  const {
    board,
    addTask,
    updateTask,
    deleteTask,
    handleDragEnd,
    undoLabel,
    undo,
    dismissUndo,
  } = useKanbanBoard();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultColumnId, setDefaultColumnId] = useState('todo');
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<BoardFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const now = useNow();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const openNewTask = useCallback((columnId = 'todo') => {
    setEditingTask(null);
    setDefaultColumnId(columnId);
    setIsTaskModalOpen(true);
  }, []);

  const openEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    setDefaultColumnId(task.columnId);
    setIsTaskModalOpen(true);
  }, []);

  const closeTaskModal = useCallback(() => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  }, []);

  const handleSave = useCallback((data: TaskFormData) => {
    if (editingTask) updateTask(editingTask.id, data);
    else addTask(data);
    closeTaskModal();
  }, [editingTask, updateTask, addTask, closeTaskModal]);

  const handleDelete = useCallback(() => {
    if (!editingTask) return;
    deleteTask(editingTask.id);
    closeTaskModal();
  }, [editingTask, deleteTask, closeTaskModal]);

  /**
   * Filtering runs once per board/query change rather than once per column per
   * render, and produces stable array identities so memoised columns hold.
   */
  const visibleColumns = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const matches = (task: Task) => {
      if (filter === 'my-tasks' && task.assigneeId !== CURRENT_USER_ID) return false;
      if (filter === 'high-priority' && task.priority !== 'high' && task.priority !== 'urgent') {
        return false;
      }
      if (filter === 'overdue' && (task.columnId === 'done' || !isOverdue(task.dueDate, now))) {
        return false;
      }
      if (!query) return true;
      return (
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    };

    return board.columns.map((column) => {
      const all = column.taskIds
        .map((id) => board.tasks[id])
        .filter((t): t is Task => Boolean(t));
      return { column, tasks: all.filter(matches), totalCount: all.length };
    });
  }, [board, filter, searchQuery, now]);

  const visibleCount = visibleColumns.reduce((sum, c) => sum + c.tasks.length, 0);
  const isFiltering = filter !== 'all' || searchQuery.trim().length > 0;

  return (
    <div className="text-on-surface selection:bg-primary/30 font-sans h-screen flex flex-col overflow-hidden">
      <div className="aurora-orb bg-primary top-[-10%] left-[-10%]" />
      <div className="aurora-orb bg-secondary bottom-[-10%] right-[-10%]" />
      <div className="fixed inset-0 particle-grid pointer-events-none" />

      <TopNav searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="mt-16 px-4 sm:px-8 py-6 flex-1 flex flex-col overflow-hidden">
        <Toolbar
          filter={filter}
          onFilterChange={setFilter}
          onNewTask={() => openNewTask()}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="flex-1 overflow-x-auto overflow-y-hidden relative z-10 w-full pb-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={(e) => setActiveTask(board.tasks[String(e.active.id)] ?? null)}
            onDragEnd={(e) => {
              handleDragEnd(e);
              setActiveTask(null);
            }}
            onDragCancel={() => setActiveTask(null)}
          >
            <div className="flex gap-4 lg:gap-6 h-full items-stretch px-1 min-w-max lg:min-w-0 lg:w-full">
              {visibleColumns.map(({ column, tasks, totalCount }) => (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  tasks={tasks}
                  totalCount={totalCount}
                  onSelectTask={openEditTask}
                  onAddTask={openNewTask}
                />
              ))}
            </div>

            <DragOverlay dropAnimation={null}>
              {activeTask && (
                <div className="w-[280px] rotate-[2deg] cursor-grabbing">
                  <TaskCard task={activeTask} onSelect={() => {}} isOverlay />
                </div>
              )}
            </DragOverlay>
          </DndContext>
        </div>

        {isFiltering && visibleCount === 0 && (
          <p className="text-center text-sm text-outline pb-4 relative z-10">
            No tasks match the current filter.
          </p>
        )}
      </main>

      {isTaskModalOpen && (
        <TaskModal
          key={editingTask?.id ?? `new-${defaultColumnId}`}
          onClose={closeTaskModal}
          onSave={handleSave}
          onDelete={editingTask ? handleDelete : undefined}
          task={editingTask}
          defaultColumnId={defaultColumnId}
        />
      )}

      {undoLabel && <UndoToast message={undoLabel} onUndo={undo} onDismiss={dismissUndo} />}
    </div>
  );
};
