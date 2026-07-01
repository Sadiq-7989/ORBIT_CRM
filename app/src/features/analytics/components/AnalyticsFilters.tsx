interface AnalyticsFiltersProps {
  timeRange: string;
  setTimeRange: (range: string) => void;
}

export function AnalyticsFilters({ timeRange, setTimeRange }: AnalyticsFiltersProps) {
  const options = [
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: 'ytd', label: 'Year to Date' },
    { value: 'all', label: 'All Time' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 p-1 bg-slate-100/80 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-orbit-button backdrop-blur-md">
      {options.map((opt) => {
        const isActive = timeRange === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setTimeRange(opt.value)}
            className={`px-4 py-2 text-xs font-bold transition-all duration-300 rounded-orbit-input cursor-pointer ${
              isActive
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md shadow-primary/20 scale-[1.02]'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-white/5'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
