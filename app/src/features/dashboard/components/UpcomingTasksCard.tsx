import type { UpcomingTask } from '../../../services/analyticsService';

interface UpcomingTasksCardProps {
  tasks: UpcomingTask[];
}

export function UpcomingTasksCard({ tasks }: UpcomingTasksCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'text-error bg-error/10 border-error/15';
      case 'medium':
        return 'text-warning bg-warning/10 border-warning/15';
      default:
        return 'text-primary bg-primary/10 border-primary/15';
    }
  };

  const formatDueDate = (dateString?: string) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-orbit-card border border-slate-200/50 dark:border-white/5 p-6 shadow-orbit-card hover:shadow-orbit-hover hover:border-slate-300 dark:hover:border-white/10 transition-all duration-300 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
          Upcoming Tasks
        </h3>
        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-white/5 border border-slate-200/20 px-2 py-0.5 rounded-full">
          {tasks.length} pending
        </span>
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-3 bg-slate-50/50 dark:bg-slate-950/20 rounded-orbit-button border border-slate-100/50 dark:border-white/5 flex justify-between items-center gap-3"
          >
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                {task.title}
              </span>
              <span className="text-[10px] text-slate-450 dark:text-slate-550 block mt-0.5">
                {task.customers?.name || 'Individual Task'}
              </span>
            </div>
            
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <span className={`px-1.5 py-0.5 text-[8px] font-black rounded-full border ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
              <span className="text-[9px] text-slate-400 dark:text-slate-550 font-semibold">
                {formatDueDate(task.due_date)}
              </span>
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="py-6 text-center border border-dashed border-slate-200/50 dark:border-white/5 rounded-orbit-card">
            <span className="text-[10px] text-slate-405 dark:text-slate-500 font-extrabold uppercase tracking-wide">
              No Upcoming Tasks
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
