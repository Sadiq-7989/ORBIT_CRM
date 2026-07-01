import { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import type { Task, TaskInput } from '../services/taskService';
import { TaskList } from '../features/tasks/components/TaskList';
import { TaskFormModal } from '../features/tasks/components/TaskFormModal';
import { DeleteTaskDialog } from '../features/tasks/components/DeleteTaskDialog';

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err: any) {
      console.error('Error fetching tasks:', err);
      setError(err?.message || 'Failed to retrieve task records.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Modal actions
  const handleOpenAddModal = () => {
    setSelectedTask(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  const handleOpenDeleteDialog = (task: Task) => {
    setSelectedTask(task);
    setIsDeleteOpen(true);
  };

  // Submit Operations
  const handleFormSubmit = async (input: TaskInput) => {
    if (selectedTask) {
      // Edit operation
      const updated = await taskService.updateTask(selectedTask.id, input);
      setTasks((prev) => prev.map((t) => (t.id === selectedTask.id ? updated : t)));
    } else {
      // Add operation
      const created = await taskService.createTask(input);
      setTasks((prev) => [created, ...prev]);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedTask) {
      await taskService.deleteTask(selectedTask.id);
      setTasks((prev) => prev.filter((t) => t.id !== selectedTask.id));
    }
  };

  // Checkbox complete toggle with optimistic state update
  const handleToggleComplete = async (task: Task) => {
    const originalTasks = [...tasks];
    const targetStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? {
              ...t,
              status: targetStatus,
              completed_at: targetStatus === 'Completed' ? new Date().toISOString() : null,
            }
          : t
      )
    );

    try {
      await taskService.toggleTaskCompletion(task.id, task.status);
    } catch (err) {
      console.error('Error toggling task completion:', err);
      setTasks(originalTasks);
    }
  };

  // Filter tasks based on Search, Status, and Priority
  const filteredTasks = tasks.filter((task) => {
    // 1. Search Query Filter
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      task.title.toLowerCase().includes(query) ||
      (task.description && task.description.toLowerCase().includes(query)) ||
      (task.customers?.name && task.customers.name.toLowerCase().includes(query)) ||
      (task.deals?.title && task.deals.title.toLowerCase().includes(query));

    // 2. Status Filter
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Pending' && task.status !== 'Completed') ||
      (statusFilter === 'Completed' && task.status === 'Completed');

    // 3. Priority Filter
    const matchesPriority =
      priorityFilter === 'All' || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="flex flex-col gap-6 w-full h-full animate-[fadeIn_0.3s_ease-out]">
      
      {/* 1. Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
            Checklist Tasks
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Track follow-ups, schedule customer check-ins, and assign tasks.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="self-start sm:self-center px-4 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-primary to-secondary rounded-orbit-button hover:opacity-90 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10 active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
        >
          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M12 4v16m8-8H4" />
          </svg>
          <span>Create Task</span>
        </button>
      </div>

      {/* 2. Search & Filters Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/30 dark:bg-slate-950/20 backdrop-blur-sm p-4 border border-slate-200/50 dark:border-white/5 rounded-orbit-card shadow-sm">
        
        {/* Search */}
        <div className="relative group w-full md:max-w-xs">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/60 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-orbit-input text-slate-900 dark:text-gray-100 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/50 focus:bg-white dark:focus:bg-slate-950/80 transition-all text-xs"
          />
        </div>

        {/* Filter Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white/60 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-orbit-input text-slate-900 dark:text-gray-100 focus:outline-none select-none font-bold"
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
            <span>Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white/60 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-orbit-input text-slate-900 dark:text-gray-100 focus:outline-none select-none font-bold"
            >
              <option value="All">All</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

      </div>

      {/* 3. Checklist Grid / Content */}
      {isLoading ? (
        /* Loading States */
        <div className="w-full space-y-4 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 bg-white/60 dark:bg-slate-900/40 border border-slate-200/50 dark:border-white/5 rounded-orbit-card flex items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3 w-2/3">
                <div className="w-5 h-5 rounded bg-slate-200 dark:bg-white/5 shrink-0" />
                <div className="space-y-2 w-full">
                  <div className="h-3 bg-slate-200 dark:bg-white/5 rounded w-1/2" />
                  <div className="h-2.5 bg-slate-200/60 dark:bg-white/5 rounded w-1/3" />
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="h-5 w-14 bg-slate-200 dark:bg-white/5 rounded-full" />
                <div className="h-5 w-14 bg-slate-200 dark:bg-white/5 rounded-full" />
                <div className="h-7 w-12 bg-slate-200 dark:bg-white/5 rounded-orbit-button" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        /* Error banner */
        <div className="p-6 bg-error/10 border border-error/20 rounded-orbit-card text-center flex flex-col items-center gap-3 max-w-md mx-auto my-12">
          <div className="w-10 h-10 rounded-full bg-error/20 text-error flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Database Fetch Failed</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">{error}</p>
          <button
            type="button"
            onClick={fetchTasks}
            className="px-4 py-2 text-xs font-bold text-white bg-error rounded-orbit-button hover:opacity-90 hover:scale-[1.01] transition-all cursor-pointer"
          >
            Retry Fetch
          </button>
        </div>
      ) : filteredTasks.length === 0 ? (
        /* Empty States */
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto py-16">
          <div className="relative w-40 h-40 mb-6 flex items-center justify-center select-none">
            <div className="absolute w-36 h-36 rounded-full border border-dashed border-gray-300 dark:border-white/10 animate-[spin_40s_linear_infinite]" />
            <div className="absolute w-24 h-24 rounded-full border border-dashed border-gray-300/80 dark:border-white/5 animate-[spin_20s_linear_infinite_reverse]" />
            <div className="absolute w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-black text-base shadow-xl shadow-primary/20">
              T
            </div>
            <div className="absolute w-2.5 h-2.5 rounded-full bg-accent shadow-md shadow-accent/40 top-5 left-10 animate-bounce" />
          </div>

          <h3 className="text-base font-black tracking-tight text-slate-900 dark:text-white mb-2 uppercase">
            {searchQuery || statusFilter !== 'All' || priorityFilter !== 'All' ? 'No Results Found' : 'No Tasks Yet'}
          </h3>
          <p className="text-xs text-gray-500 dark:text-slate-400 font-medium leading-relaxed mb-6">
            {searchQuery || statusFilter !== 'All' || priorityFilter !== 'All'
              ? 'We couldn\'t find any checklist tasks matching your filters. Try resetting search queries or selection ranges.'
              : 'Add your first checklist task to organize meetings, follow-ups, and pipeline records.'}
          </p>
          {!(searchQuery || statusFilter !== 'All' || priorityFilter !== 'All') && (
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-5 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-primary to-secondary rounded-orbit-button hover:opacity-90 transition-all border border-white/10 shadow-md shadow-primary/20 cursor-pointer"
            >
              Add Your First Task
            </button>
          )}
        </div>
      ) : (
        /* Checklist items rendering */
        <div className="flex-1 w-full max-w-3xl mx-auto overflow-y-auto">
          <TaskList
            tasks={filteredTasks}
            onToggleComplete={handleToggleComplete}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteDialog}
          />
        </div>
      )}

      {/* Forms & Dialog overlays */}
      <TaskFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        task={selectedTask}
      />

      <DeleteTaskDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        taskTitle={selectedTask?.title}
      />

    </div>
  );
}
