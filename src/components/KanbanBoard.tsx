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
import { useBoardStats } from '../hooks/useBoardStats';
import { useNow } from '../hooks/useNow';
import { isOverdue } from '../utils/date';
import { KanbanColumn } from './KanbanColumn';
import { TaskModal } from './TaskModal';
import { TaskCard } from './TaskCard';
import { TaskListView } from './TaskListView';
import { Toolbar, type BoardFilter } from './Toolbar';
import { TopNav } from './TopNav';
import { Sidebar, type BoardView } from './Sidebar';
import { BoardStats } from './BoardStats';
import { UndoToast } from './ui/UndoToast';

export const KanbanBoard: React.FC = () => {
  const {
    board,
    addTask,
    updateTask,
    deleteTask,
    resetBoard,
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
  const [view, setView] = useState<BoardView>('board');
  const [isNavOpen, setIsNavOpen] = useState(false);

  const now = useNow();
  const stats = useBoardStats(board, now);

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

  const totalTasks = Object.keys(board.tasks).length;

  return (
    <div className="text-on-surface selection:bg-primary/30 font-sans h-screen overflow-hidden">
      <div className="aurora-orb bg-primary top-[-10%] left-[-10%]" />
      <div className="aurora-orb bg-secondary bottom-[-10%] right-[-10%]" />
      <div className="fixed inset-0 particle-grid pointer-events-none" />

      <Sidebar
        view={view}
        onViewChange={(next) => {
          setView(next);
          setIsNavOpen(false);
        }}
        onNewTask={() => {
          openNewTask();
          setIsNavOpen(false);
        }}
        onResetBoard={resetBoard}
        taskCount={totalTasks}
        isOpen={isNavOpen}
        onClose={() => setIsNavOpen(false)}
      />

      <TopNav
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenNav={() => setIsNavOpen(true)}
      />

      <main className="lg:ml-60 mt-16 h-[calc(100vh-4rem)] px-4 sm:px-6 py-5 flex flex-col overflow-hidden">
        <Toolbar
          filter={filter}
          onFilterChange={setFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="flex-1 min-h-0 relative z-10">
          {view === 'board' ? (
            <div className="h-full overflow-x-auto overflow-y-hidden">
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
                <div className="flex gap-4 lg:gap-6 h-full items-stretch px-1 min-w-max xl:min-w-0 xl:w-full">
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
          ) : (
            <TaskListView groups={visibleColumns} onSelectTask={openEditTask} />
          )}
        </div>

        <BoardStats stats={stats} />
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
