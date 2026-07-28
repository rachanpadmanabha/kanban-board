import { useCallback, useRef, useState } from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import type { Board, Task, TaskFormData } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { createSeedBoard } from '../data/seed';

const STORAGE_KEY = 'kanban-board-data-v4';

function isBoard(value: unknown): value is Board {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<Board>;
  return (
    Array.isArray(candidate.columns) &&
    candidate.columns.every(
      (c) => typeof c?.id === 'string' && typeof c?.title === 'string' && Array.isArray(c?.taskIds),
    ) &&
    typeof candidate.tasks === 'object' &&
    candidate.tasks !== null
  );
}

function newTaskId(): string {
  return crypto.randomUUID();
}

export function useKanbanBoard() {
  const [board, setBoard] = useLocalStorage<Board>(STORAGE_KEY, createSeedBoard, {
    validate: isBoard,
  });

  // A single-level undo, enough to make deletion non-destructive.
  const [undoLabel, setUndoLabel] = useState<string | null>(null);
  const undoSnapshot = useRef<Board | null>(null);

  const snapshot = useCallback((label: string, current: Board) => {
    undoSnapshot.current = current;
    setUndoLabel(label);
  }, []);

  const undo = useCallback(() => {
    if (!undoSnapshot.current) return;
    setBoard(undoSnapshot.current);
    undoSnapshot.current = null;
    setUndoLabel(null);
  }, [setBoard]);

  const dismissUndo = useCallback(() => {
    undoSnapshot.current = null;
    setUndoLabel(null);
  }, []);

  const addTask = useCallback((formData: TaskFormData) => {
    const id = newTaskId();
    const task: Task = {
      ...formData,
      id,
      tags: [...formData.tags],
      createdAt: new Date().toISOString(),
    };

    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((col) =>
        col.id === formData.columnId ? { ...col, taskIds: [...col.taskIds, id] } : col,
      ),
      tasks: { ...prev.tasks, [id]: task },
    }));
  }, [setBoard]);

  const updateTask = useCallback((taskId: string, formData: TaskFormData) => {
    setBoard((prev) => {
      const oldTask = prev.tasks[taskId];
      if (!oldTask) return prev;

      const updatedTask: Task = {
        ...oldTask,
        ...formData,
        tags: [...formData.tags],
      };

      let newColumns = prev.columns;
      if (oldTask.columnId !== formData.columnId) {
        newColumns = prev.columns.map((col) => {
          if (col.id === oldTask.columnId) {
            return { ...col, taskIds: col.taskIds.filter((id) => id !== taskId) };
          }
          if (col.id === formData.columnId) {
            return { ...col, taskIds: [...col.taskIds, taskId] };
          }
          return col;
        });
      }

      return { ...prev, columns: newColumns, tasks: { ...prev.tasks, [taskId]: updatedTask } };
    });
  }, [setBoard]);

  const deleteTask = useCallback((taskId: string) => {
    setBoard((prev) => {
      const target = prev.tasks[taskId];
      if (!target) return prev;

      snapshot(`Deleted "${target.title}"`, prev);

      const { [taskId]: _removed, ...remainingTasks } = prev.tasks;
      void _removed;

      return {
        ...prev,
        columns: prev.columns.map((col) => ({
          ...col,
          taskIds: col.taskIds.filter((id) => id !== taskId),
        })),
        tasks: remainingTasks,
      };
    });
  }, [setBoard, snapshot]);

  const resetBoard = useCallback(() => {
    setBoard((prev) => {
      snapshot('Board reset', prev);
      return createSeedBoard();
    });
  }, [setBoard, snapshot]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) return;

    setBoard((prev) => {
      const activeTask = prev.tasks[activeId];
      if (!activeTask) return prev;

      const overTask = prev.tasks[overId];
      const overColumnId = overTask ? overTask.columnId : overId;

      const sourceCol = prev.columns.find((c) => c.id === activeTask.columnId);
      const targetCol = prev.columns.find((c) => c.id === overColumnId);
      if (!sourceCol || !targetCol) return prev;

      if (sourceCol.id === targetCol.id) {
        const oldIndex = sourceCol.taskIds.indexOf(activeId);
        if (oldIndex === -1) return prev;
        const newIndex = overTask ? sourceCol.taskIds.indexOf(overId) : sourceCol.taskIds.length - 1;

        return {
          ...prev,
          columns: prev.columns.map((col) =>
            col.id === sourceCol.id
              ? { ...col, taskIds: arrayMove([...sourceCol.taskIds], oldIndex, newIndex) }
              : col,
          ),
        };
      }

      const newSourceTaskIds = sourceCol.taskIds.filter((id) => id !== activeId);
      const insertIndex = overTask ? targetCol.taskIds.indexOf(overId) : targetCol.taskIds.length;
      const newTargetTaskIds = [...targetCol.taskIds];
      newTargetTaskIds.splice(insertIndex, 0, activeId);

      return {
        ...prev,
        columns: prev.columns.map((col) => {
          if (col.id === sourceCol.id) return { ...col, taskIds: newSourceTaskIds };
          if (col.id === targetCol.id) return { ...col, taskIds: newTargetTaskIds };
          return col;
        }),
        tasks: { ...prev.tasks, [activeId]: { ...activeTask, columnId: targetCol.id } },
      };
    });
  }, [setBoard]);

  return {
    board,
    addTask,
    updateTask,
    deleteTask,
    resetBoard,
    handleDragEnd,
    undoLabel,
    undo,
    dismissUndo,
  };
}
