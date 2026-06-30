import type { Task } from '../../../services/taskService';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({ task, onToggleComplete, onEdit, onDelete }: TaskCardProps) {
  const isCompleted = task.status === 'Completed';

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return (
          <span className="px-2 py-0.5 text-[9px] font-bold text-error bg-error/10 dark:bg-error/20 rounded-full border border-error/15">
            High Priority
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 text-[9px] font-bold text-warning bg-warning/10 dark:bg-warning/20 rounded-full border border-warning/15">
            Medium Priority
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-[9px] font-bold text-primary bg-primary/10 dark:bg-slate-950/40 rounded-full border border-primary/15">
            Low Priority
          </span>
        );
    }
  };

  const getFormattedDate = (dateString?: string) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div
      className={`bg-white/60 dark:bg-slate-900/40 backdrop-blur-md rounded-orbit-card border p-4.5 shadow-sm hover:shadow-orbit-hover hover:border-slate-350 dark:hover:border-white/10 transition-all duration-200 flex gap-4 group/card items-start ${
        isCompleted
          ? 'border-slate-200/30 dark:border-white/5 opacity-60'
          : 'border-slate-200/50 dark:border-white/5'
      }`}
    >
      {/* Checkbox */}
      <button
        type="button"
        onClick={() => onToggleComplete(task)}
        className="mt-1 flex-shrink-0 w-5 h-5 rounded-md border border-slate-300 dark:border-slate-700 flex items-center justify-center cursor-pointer transition-all hover:border-primary active:scale-95 bg-white/50 dark:bg-slate-950/20"
      >
        {isCompleted && (
          <svg className="w-3.5 h-3.5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Content details */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div>
          <h4
            className={`text-xs font-black text-slate-900 dark:text-white leading-snug transition-all ${
              isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
            }`}
          >
            {task.title}
          </h4>
          {task.description && (
            <p
              className={`text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-normal ${
                isCompleted ? 'line-through text-slate-400/75 dark:text-slate-500/75' : ''
              }`}
            >
              {task.description}
            </p>
          )}
        </div>

        {/* Badges and tags */}
        <div className="flex flex-wrap items-center gap-2 mt-0.5">
          {getPriorityBadge(task.priority)}

          {/* Customer / Deal references */}
          {task.customers?.name && (
            <span className="px-2 py-0.5 text-[9px] font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/30 border border-slate-200/30 dark:border-white/5 rounded-full">
              {task.customers.name}
            </span>
          )}

          {task.deals?.title && (
            <span className="px-2 py-0.5 text-[9px] font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/30 border border-slate-200/30 dark:border-white/5 rounded-full truncate max-w-[120px]">
              Deal: {task.deals.title}
            </span>
          )}
        </div>

        {/* Due Date Indicator */}
        <div className="flex items-center gap-1.5 text-[9px] text-slate-400 dark:text-slate-500 font-bold mt-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className={!isCompleted && task.due_date && new Date(task.due_date) < new Date() ? 'text-error' : ''}>
            {getFormattedDate(task.due_date)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover/card:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => onEdit(task)}
          title="Edit Task"
          className="p-1 text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-white/5 rounded transition-colors cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onDelete(task)}
          title="Delete Task"
          className="p-1 text-slate-400 hover:text-error hover:bg-slate-100 dark:hover:bg-white/5 rounded transition-colors cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

    </div>
  );
}
