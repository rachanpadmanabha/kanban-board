import React, { useState } from 'react';
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
import { useKanbanBoard } from '../hooks/useKanbanBoard';
import { KanbanColumn } from './KanbanColumn';
import { TaskModal } from './TaskModal';
import { TaskCard } from './TaskCard';

export const KanbanBoard: React.FC = () => {
  const { board, addTask, updateTask, deleteTask, handleDragStart, handleDragEnd } = useKanbanBoard();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'my-tasks' | 'high-priority'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const currentUserId = 'u1'; // Assume standard user is u1
  const [defaultColumnId, setDefaultColumnId] = useState('todo');
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
      onPointerDown: (e: any) => {
        // Only require movement on interactive elements (e.g., buttons, inputs)
        const isInteractive = (e.target as HTMLElement)?.closest('button, input, select, textarea');
        if (isInteractive) return false;
        return true;
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const openNewTask = (columnId: string = 'todo') => {
    setEditingTask(null);
    setDefaultColumnId(columnId);
    setIsTaskModalOpen(true);
  };

  const openEditTask = (task: Task) => {
    setEditingTask(task);
    setDefaultColumnId(task.columnId);
    setIsTaskModalOpen(true);
  };

  const handleSave = (data: TaskFormData) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
    } else {
      addTask(data);
    }
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const handleDelete = () => {
    if (editingTask) {
      deleteTask(editingTask.id);
      setIsTaskModalOpen(false);
      setEditingTask(null);
    }
  };

  const getFilteredTasks = (taskIds: readonly string[]) => {
    return taskIds
      .map(id => board.tasks[id])
      .filter(t => {
        if (!t) return false;
        if (filter === 'my-tasks' && t.assigneeId !== currentUserId) return false;
        if (filter === 'high-priority' && t.priority !== 'high' && t.priority !== 'urgent') return false;
        if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
      });
  };

  return (
    <div className="text-on-surface selection:bg-primary/30 font-sans h-screen flex flex-col overflow-hidden">
      {/* ── Ambient Aurora Background ── */}
      <div className="aurora-orb bg-primary top-[-10%] left-[-10%]" />
      <div className="aurora-orb bg-secondary bottom-[-10%] right-[-10%]" />
      <div className="fixed inset-0 particle-grid pointer-events-none" />

      {/* ── TopNavBar ── */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-16 bg-[#0a0e1a]/40 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-[#0a0e1a]/50">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-bold bg-gradient-to-br from-white to-sky-300 bg-clip-text text-transparent font-['Inter'] tracking-tight">
            Arctic Kanban
          </span>
          <div className="hidden md:flex gap-6 items-center h-full">
            <a className="text-sky-300 font-semibold border-b-2 border-sky-400 pb-1 font-['Inter'] tracking-tight" href="#">Board</a>
            <a className="text-on-surface-variant hover:text-white transition-colors font-['Inter'] tracking-tight" href="#">List</a>
            <a className="text-on-surface-variant hover:text-white transition-colors font-['Inter'] tracking-tight" href="#">Timeline</a>
            <a className="text-on-surface-variant hover:text-white transition-colors font-['Inter'] tracking-tight" href="#">Analytics</a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden lg:block">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-white/5 border-none rounded-full pl-10 pr-4 py-1.5 text-sm w-64 focus:ring-1 focus:ring-primary/50 text-white placeholder-outline transition-all focus:outline-none" 
              placeholder="Search tasks..." 
              type="text"
            />
          </div>
          <button className="p-2 text-on-surface-variant hover:text-white hover:bg-white/5 rounded-full transition-all cursor-pointer">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
            </svg>
          </button>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-on-primary ml-2 cursor-pointer shadow-lg">
            RK
          </div>
        </div>
      </nav>

      {/* ── Main Canvas ── */}
      <main className="mt-16 p-8 flex-1 flex flex-col overflow-hidden">
        
        {/* Board Toolbar */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 shrink-0 relative z-10">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex gap-2">
              <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${filter === 'all' ? 'glass-card text-white' : 'bg-white/5 hover:bg-white/10 text-on-surface-variant'}`}
              >All Tasks</button>
              <button 
                onClick={() => setFilter('my-tasks')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${filter === 'my-tasks' ? 'glass-card text-white' : 'bg-white/5 hover:bg-white/10 text-on-surface-variant'}`}
              >My Tasks</button>
              <button 
                 onClick={() => setFilter('high-priority')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${filter === 'high-priority' ? 'glass-card text-white' : 'bg-white/5 hover:bg-white/10 text-on-surface-variant'}`}
              >High Priority</button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="glass-card px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-white/10 transition-colors cursor-pointer">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
              Filter
            </button>
            <button 
              onClick={() => openNewTask()}
              className="py-2 px-5 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-full flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              New Task
            </button>
          </div>
        </header>

        {/* Board Area */}
        <div className="flex-1 overflow-hidden relative z-10 w-full h-full pb-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={(e) => {
              handleDragStart(e);
              const task = board.tasks[String(e.active.id)];
              if (task) setActiveTask(task);
            }}
            onDragEnd={(e) => {
              handleDragEnd(e);
              setActiveTask(null);
            }}
            onDragCancel={() => setActiveTask(null)}
          >
            <div className="flex gap-4 lg:gap-8 h-full items-start w-full px-1">
              {board.columns.map(column => (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  tasks={getFilteredTasks(column.taskIds)}
                  onTaskClick={openEditTask}
                  onAddTask={openNewTask}
                />
              ))}
            </div>

            <DragOverlay>
              {activeTask ? (
                <div className="w-[280px] lg:w-[320px] rotate-[2deg] opacity-90">
                  <TaskCard task={activeTask} onClick={() => {}} />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </main>

      {/* ── Task Modal ── */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => { setIsTaskModalOpen(false); setEditingTask(null); }}
        onSave={handleSave}
        onDelete={editingTask ? handleDelete : undefined}
        task={editingTask}
        defaultColumnId={defaultColumnId}
      />
    </div>
  );
};
