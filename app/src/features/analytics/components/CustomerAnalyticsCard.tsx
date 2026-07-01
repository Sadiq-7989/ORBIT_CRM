import { useNavigate } from 'react-router-dom';

interface CustomerAnalyticsCardProps {
  totalCustomers: number;
  newCustomers: number;
  growthRate: number;
  sourceBreakdown: Array<{ source: string; count: number }>;
}

export function CustomerAnalyticsCard({
  totalCustomers,
  newCustomers,
  growthRate,
  sourceBreakdown,
}: CustomerAnalyticsCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate('/customers');
  };

  const isPositiveGrowth = growthRate >= 0;

  // Get top source
  const sortedSources = [...sourceBreakdown].sort((a, b) => b.count - a.count);
  const topSource = sortedSources[0]?.source || 'None';

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-orbit-card border border-slate-200/50 dark:border-white/5 p-6 shadow-orbit-card hover:shadow-orbit-hover hover:border-secondary/30 dark:hover:border-secondary/20 hover:scale-[1.01] transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Title & Icon Row */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Customer Growth
          </span>
          <div className="w-10 h-10 rounded-orbit-button bg-gradient-to-br from-secondary/20 to-secondary/5 text-secondary border border-secondary/20 dark:from-secondary/30 dark:to-secondary/10 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>

        {/* Large Metric */}
        <div className="mb-2">
          <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {totalCustomers}
          </span>
        </div>

        {/* Trend Indicator */}
        <div className="flex items-center gap-1.5 mb-4">
          <span
            className={`flex items-center gap-0.5 px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
              isPositiveGrowth
                ? 'bg-success/10 text-success dark:bg-success/20'
                : 'bg-error/10 text-error dark:bg-error/20'
            }`}
          >
            {isPositiveGrowth ? '+' : ''}
            {growthRate.toFixed(1)}%
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
            growth rate
          </span>
        </div>
      </div>

      {/* Grid of sub-metrics */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-white/5">
        <div>
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-0.5">
            New Registrations
          </span>
          <span className="text-sm font-black text-slate-800 dark:text-slate-200">
            +{newCustomers}
          </span>
        </div>
        <div>
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-0.5">
            Top Channel
          </span>
          <span className="text-sm font-black text-slate-800 dark:text-slate-200 truncate block">
            {topSource}
          </span>
        </div>
      </div>
    </div>
  );
}
