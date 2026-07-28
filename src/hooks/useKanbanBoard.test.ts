import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import type { DragEndEvent } from '@dnd-kit/core';
import { useKanbanBoard } from './useKanbanBoard';

const drag = (activeId: string, overId: string) =>
  ({ active: { id: activeId }, over: { id: overId } }) as unknown as DragEndEvent;

const columnOf = (
  result: { current: ReturnType<typeof useKanbanBoard> },
  id: string,
) => result.current.board.columns.find((c) => c.id === id)!;

describe('useKanbanBoard', () => {
  it('seeds from the sample board on first load', () => {
    const { result } = renderHook(() => useKanbanBoard());
    expect(columnOf(result, 'todo').taskIds).toHaveLength(4);
    expect(Object.keys(result.current.board.tasks)).toHaveLength(9);
  });

  it('adds a task to the requested column with a unique id', () => {
    const { result } = renderHook(() => useKanbanBoard());

    act(() => {
      result.current.addTask({
        title: 'Review the audit',
        description: '',
        tags: ['Docs'],
        priority: 'high',
        columnId: 'review',
      });
    });

    const review = columnOf(result, 'review');
    expect(review.taskIds).toHaveLength(2);
    const added = result.current.board.tasks[review.taskIds[1]];
    expect(added.title).toBe('Review the audit');
    expect(added.createdAt).toBeTruthy();
  });

  it('moves a task between columns and updates its columnId', () => {
    const { result } = renderHook(() => useKanbanBoard());

    act(() => result.current.handleDragEnd(drag('task-1', 'done')));

    expect(columnOf(result, 'todo').taskIds).not.toContain('task-1');
    expect(columnOf(result, 'done').taskIds).toContain('task-1');
    expect(result.current.board.tasks['task-1'].columnId).toBe('done');
  });

  it('inserts at the position of the task it was dropped onto', () => {
    const { result } = renderHook(() => useKanbanBoard());

    // task-7 is the only card in Review; drop it onto task-5, first in progress.
    act(() => result.current.handleDragEnd(drag('task-7', 'task-5')));

    expect(columnOf(result, 'in-progress').taskIds).toEqual(['task-7', 'task-5', 'task-6']);
  });

  // Regression: dropping onto the column body passed taskIds.length to
  // arrayMove, which is out of range and silently dropped the reorder.
  it('reorders within a column when dropped on the column body', () => {
    const { result } = renderHook(() => useKanbanBoard());
    expect(columnOf(result, 'todo').taskIds[0]).toBe('task-1');

    act(() => result.current.handleDragEnd(drag('task-1', 'todo')));

    expect(columnOf(result, 'todo').taskIds).toEqual([
      'task-2',
      'task-3',
      'task-4',
      'task-1',
    ]);
  });

  it('ignores drops outside any droppable', () => {
    const { result } = renderHook(() => useKanbanBoard());
    const before = result.current.board;

    act(() =>
      result.current.handleDragEnd({ active: { id: 'task-1' }, over: null } as DragEndEvent),
    );

    expect(result.current.board).toBe(before);
  });

  it('restores a deleted task through undo', () => {
    const { result } = renderHook(() => useKanbanBoard());

    act(() => result.current.deleteTask('task-1'));
    expect(result.current.board.tasks['task-1']).toBeUndefined();
    expect(result.current.undoLabel).toBe('Deleted "Design token audit"');

    act(() => result.current.undo());
    expect(result.current.board.tasks['task-1']).toBeDefined();
    expect(result.current.undoLabel).toBeNull();
  });

  it('moves a task when its status is changed from the edit form', () => {
    const { result } = renderHook(() => useKanbanBoard());
    const original = result.current.board.tasks['task-1'];

    act(() => {
      result.current.updateTask('task-1', {
        ...original,
        columnId: 'done',
      });
    });

    expect(columnOf(result, 'todo').taskIds).not.toContain('task-1');
    expect(columnOf(result, 'done').taskIds).toContain('task-1');
  });
});
