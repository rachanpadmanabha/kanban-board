import { useCallback } from 'react';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import type { Board, Task, TaskFormData, Column } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { INITIAL_BOARD } from '../data/mockData';

let idCounter = Date.now();
function generateId(): string {
  return `task-${++idCounter}`;
}

export function useKanbanBoard() {
  const [board, setBoard] = useLocalStorage<Board>('kanban-board-data-v3', INITIAL_BOARD);

  const addTask = useCallback((formData: TaskFormData) => {
    const id = generateId();
    const task: Task = {
      id,
      title: formData.title,
      description: formData.description,
      tags: [...formData.tags],
      priority: formData.priority,
      columnId: formData.columnId,
      createdAt: new Date().toISOString(),
    };

    setBoard(prev => ({
      ...prev,
      columns: prev.columns.map(col =>
        col.id === formData.columnId
          ? { ...col, taskIds: [...col.taskIds, id] }
          : col
      ),
      tasks: { ...prev.tasks, [id]: task },
    }));
  }, [setBoard]);

  const updateTask = useCallback((taskId: string, formData: TaskFormData) => {
    setBoard(prev => {
      const oldTask = prev.tasks[taskId];
      if (!oldTask) return prev;

      const updatedTask: Task = {
        ...oldTask,
        title: formData.title,
        description: formData.description,
        tags: [...formData.tags],
        priority: formData.priority,
        columnId: formData.columnId,
      };

      let newColumns = prev.columns;
      if (oldTask.columnId !== formData.columnId) {
        newColumns = prev.columns.map(col => {
          if (col.id === oldTask.columnId) {
            return { ...col, taskIds: col.taskIds.filter(id => id !== taskId) };
          }
          if (col.id === formData.columnId) {
            return { ...col, taskIds: [...col.taskIds, taskId] };
          }
          return col;
        });
      }

      return {
        ...prev,
        columns: newColumns,
        tasks: { ...prev.tasks, [taskId]: updatedTask },
      };
    });
  }, [setBoard]);

  const deleteTask = useCallback((taskId: string) => {
    setBoard(prev => {
      const { [taskId]: _, ...remainingTasks } = prev.tasks;
      void _;
      return {
        ...prev,
        columns: prev.columns.map(col => ({
          ...col,
          taskIds: col.taskIds.filter(id => id !== taskId),
        })),
        tasks: remainingTasks,
      };
    });
  }, [setBoard]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) return;

    setBoard(prev => {
      const activeTask = prev.tasks[activeId];
      if (!activeTask) return prev;

      // Find what column we're dropping over
      const overTask = prev.tasks[overId];
      const overColumnId = overTask ? overTask.columnId : overId;

      // Find source column
      const sourceCol = prev.columns.find(c => c.id === activeTask.columnId);
      if (!sourceCol) return prev;

      // Find target column
      const targetCol = prev.columns.find(c => c.id === overColumnId);
      if (!targetCol) return prev;

      // Same column — reorder
      if (sourceCol.id === targetCol.id) {
        const oldIndex = sourceCol.taskIds.indexOf(activeId);
        const newIndex = overTask
          ? sourceCol.taskIds.indexOf(overId)
          : sourceCol.taskIds.length;

        if (oldIndex === -1) return prev;

        const newTaskIds = arrayMove([...sourceCol.taskIds], oldIndex, newIndex);
        return {
          ...prev,
          columns: prev.columns.map(col =>
            col.id === sourceCol.id ? { ...col, taskIds: newTaskIds } : col
          ),
        };
      }

      // Different column — move
      const newSourceTaskIds = sourceCol.taskIds.filter(id => id !== activeId);
      const insertIndex = overTask
        ? targetCol.taskIds.indexOf(overId)
        : targetCol.taskIds.length;
      const newTargetTaskIds = [...targetCol.taskIds];
      newTargetTaskIds.splice(insertIndex, 0, activeId);

      return {
        ...prev,
        columns: prev.columns.map(col => {
          if (col.id === sourceCol.id) return { ...col, taskIds: newSourceTaskIds };
          if (col.id === targetCol.id) return { ...col, taskIds: newTargetTaskIds };
          return col;
        }),
        tasks: {
          ...prev.tasks,
          [activeId]: { ...activeTask, columnId: targetCol.id },
        },
      };
    });
  }, [setBoard]);

  const getColumnTasks = useCallback((column: Column): Task[] => {
    return column.taskIds
      .map(id => board.tasks[id])
      .filter((t): t is Task => Boolean(t));
  }, [board.tasks]);

  const handleDragStart = useCallback((_event: DragStartEvent) => {
    // Can be used for visual feedback if needed
  }, []);

  return {
    board,
    addTask,
    updateTask,
    deleteTask,
    handleDragStart,
    handleDragEnd,
    getColumnTasks,
  };
}
