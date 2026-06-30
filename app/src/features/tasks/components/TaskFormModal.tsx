import { useState, useEffect } from 'react';
import { customerService } from '../../../services/customerService';
import { dealService } from '../../../services/dealService';
import type { Customer } from '../../../services/customerService';
import type { Deal } from '../../../services/dealService';
import type { Task, TaskInput } from '../../../services/taskService';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: TaskInput) => Promise<void>;
  task?: Task;
}

export function TaskFormModal({ isOpen, onClose, onSubmit, task }: TaskFormModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Pending');
  const [dueDate, setDueDate] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [dealId, setDealId] = useState('');

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch dropdown records when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsLoadingMetadata(true);
      Promise.all([customerService.getCustomers(), dealService.getDeals()])
        .then(([customersList, dealsList]) => {
          setCustomers(customersList);
          setDeals(dealsList);
        })
        .catch((err) => {
          console.error('Error fetching task metadata:', err);
        })
        .finally(() => {
          setIsLoadingMetadata(false);
        });
    }
  }, [isOpen]);

  // Set form fields based on task state
  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setPriority(task.priority || 'Medium');
      setStatus(task.status || 'Pending');
      setDueDate(task.due_date || '');
      setCustomerId(task.customer_id || '');
      setDealId(task.deal_id || '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setStatus('Pending');
      setDueDate('');
      setCustomerId('');
      setDealId('');
    }
    setError('');
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
        due_date: dueDate || undefined,
        customer_id: customerId || undefined,
        deal_id: dealId || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save task record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Backdrop click close */}
      <div className="absolute inset-0" onClick={onClose} />
      
      {/* Form Container */}
      <div className="relative bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/10 rounded-orbit-modal p-6 md:p-8 w-full max-w-lg shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto z-10 animate-[scaleUp_0.15s_ease-out]">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-white/5">
          <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">
            {task ? 'Edit Task' : 'Add Task'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l18 18" />
            </svg>
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="p-3 bg-error/10 text-error border border-error/20 rounded-orbit-button text-xs font-bold flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Title Input */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="task-title" className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Task Title *
              </label>
              <input
                id="task-title"
                type="text"
                placeholder="Send follow-up proposal email"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-orbit-input text-slate-900 dark:text-gray-100 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/50 transition-all"
                required
              />
            </div>

            {/* Description Input */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="task-desc" className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Description
              </label>
              <textarea
                id="task-desc"
                placeholder="Describe details or agenda topics..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                rows={3}
                className="w-full px-4 py-2.5 text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-orbit-input text-slate-900 dark:text-gray-100 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/50 transition-all resize-none"
              />
            </div>

            {/* Priority Selection */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="task-priority" className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Priority
              </label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-orbit-input text-slate-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/50 transition-all select-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Status Selection */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="task-status" className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Status
              </label>
              <select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-orbit-input text-slate-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/50 transition-all select-none"
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Due Date Input */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="task-due" className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Due Date
              </label>
              <input
                id="task-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-orbit-input text-slate-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/50 transition-all"
              />
            </div>

            {/* Customer Select dropdown */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="task-customer" className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Associate Customer
              </label>
              <select
                id="task-customer"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                disabled={isSubmitting || isLoadingMetadata}
                className="w-full px-4 py-2.5 text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-orbit-input text-slate-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/50 transition-all select-none"
              >
                <option value="">-- None --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.company ? `(${c.company})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Deal Select dropdown */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="task-deal" className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Associate Deal
              </label>
              <select
                id="task-deal"
                value={dealId}
                onChange={(e) => setDealId(e.target.value)}
                disabled={isSubmitting || isLoadingMetadata}
                className="w-full px-4 py-2.5 text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-orbit-input text-slate-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/50 transition-all select-none"
              >
                <option value="">-- None --</option>
                {deals.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-white/5 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-bold text-gray-500 dark:text-slate-350 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-orbit-button border border-slate-200/30 dark:border-white/5 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-primary to-secondary rounded-orbit-button hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5 cursor-pointer border border-white/10 shadow-md shadow-primary/15"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Task</span>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
