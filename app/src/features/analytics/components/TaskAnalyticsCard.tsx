import { useNavigate } from 'react-router-dom';

interface TaskAnalyticsCardProps {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
  overdueTasks: number;
}

export function TaskAnalyticsCard({
  totalTasks,
  completedTasks,
  pendingTasks,
  completionRate,
  overdueTasks,
}: TaskAnalyticsCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate('/tasks');
  };

  const isHighCompletion = completionRate >= 70;

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-orbit-card border border-slate-200/50 dark:border-white/5 p-6 shadow-orbit-card hover:shadow-orbit-hover hover:border-accent/30 dark:hover:border-accent/20 hover:scale-[1.01] transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Title & Icon Row */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Task Efficiency
          </span>
          <div className="w-10 h-10 rounded-orbit-button bg-gradient-to-br from-accent/20 to-accent/5 text-accent border border-accent/20 dark:from-accent/30 dark:to-accent/10 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
        </div>

        {/* Large Metric */}
        <div className="mb-2">
          <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {completionRate.toFixed(0)}%
          </span>
        </div>

        {/* Trend/Ratio Indicator */}
        <div className="flex items-center gap-1.5 mb-4">
          <span
            className={`flex items-center gap-0.5 px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
              isHighCompletion
                ? 'bg-success/10 text-success dark:bg-success/20'
                : 'bg-warning/10 text-warning dark:bg-warning/20'
            }`}
          >
            {completedTasks}/{totalTasks}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
            tasks completed
          </span>
        </div>
      </div>

      {/* Grid of sub-metrics */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-white/5">
        <div>
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-0.5">
            Active Tasks
          </span>
          <span className="text-sm font-black text-slate-800 dark:text-slate-200">
            {pendingTasks}
          </span>
        </div>
        <div>
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-0.5">
            Overdue Priority
          </span>
          <span
            className={`text-sm font-black ${
              overdueTasks > 0 ? 'text-error animate-pulse' : 'text-slate-800 dark:text-slate-200'
            }`}
          >
            {overdueTasks}
          </span>
        </div>
      </div>
    </div>
  );
}
