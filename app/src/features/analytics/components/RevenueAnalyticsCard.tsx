import { useNavigate } from 'react-router-dom';

interface RevenueAnalyticsCardProps {
  totalRevenue: number;
  pipelineValue: number;
  averageDealValue: number;
  wonDealsCount: number;
  growthRate: number;
}

export function RevenueAnalyticsCard({
  totalRevenue,
  pipelineValue,
  averageDealValue,
  wonDealsCount,
  growthRate,
}: RevenueAnalyticsCardProps) {
  const navigate = useNavigate();

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleCardClick = () => {
    navigate('/deals');
  };

  const isPositiveGrowth = growthRate >= 0;

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-orbit-card border border-slate-200/50 dark:border-white/5 p-6 shadow-orbit-card hover:shadow-orbit-hover hover:border-primary/30 dark:hover:border-primary/20 hover:scale-[1.01] transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Title & Icon Row */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Revenue Performance
          </span>
          <div className="w-10 h-10 rounded-orbit-button bg-gradient-to-br from-primary/20 to-primary/5 text-primary border border-primary/20 dark:from-primary/30 dark:to-primary/10 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Large Metric */}
        <div className="mb-2">
          <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(totalRevenue)}
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
            vs previous period
          </span>
        </div>
      </div>

      {/* Grid of sub-metrics */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 dark:border-white/5">
        <div>
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-0.5">
            Avg Deal
          </span>
          <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
            {formatCurrency(averageDealValue)}
          </span>
        </div>
        <div>
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-0.5">
            Won Deals
          </span>
          <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
            {wonDealsCount}
          </span>
        </div>
        <div>
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-0.5">
            Open Pipeline
          </span>
          <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
            {formatCurrency(pipelineValue)}
          </span>
        </div>
      </div>
    </div>
  );
}
