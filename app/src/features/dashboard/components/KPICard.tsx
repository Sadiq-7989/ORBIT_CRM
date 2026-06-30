interface TrendProps {
  value: string;
  isPositive: boolean;
  label?: string;
}

interface KPICardProps {
  title: string;
  value: string | number;
  trend: TrendProps;
  icon: React.ReactNode;
  gradient: 'primary' | 'secondary' | 'accent' | 'success' | 'warning';
}

export function KPICard({ title, value, trend, icon, gradient }: KPICardProps) {
  // Gradients for the icon container
  const gradientClasses = {
    primary: 'from-primary/20 to-primary/5 text-primary border-primary/20 dark:from-primary/30 dark:to-primary/10',
    secondary: 'from-secondary/20 to-secondary/5 text-secondary border-secondary/20 dark:from-secondary/30 dark:to-secondary/10',
    accent: 'from-accent/20 to-accent/5 text-accent border-accent/20 dark:from-accent/30 dark:to-accent/10',
    success: 'from-success/20 to-success/5 text-success border-success/20 dark:from-success/30 dark:to-success/10',
    warning: 'from-warning/20 to-warning/5 text-warning border-warning/20 dark:from-warning/30 dark:to-warning/10',
  };

  return (
    <div className="group bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-orbit-card border border-slate-200/50 dark:border-white/5 p-6 shadow-orbit-card hover:shadow-orbit-hover hover:border-slate-300 dark:hover:border-white/10 hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between">
      {/* Top row: Icon & Title */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-orbit-button bg-gradient-to-br ${gradientClasses[gradient]} border flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300`}>
          {icon}
        </div>
      </div>

      {/* Middle row: Value */}
      <div className="mb-3">
        <span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {value}
        </span>
      </div>

      {/* Bottom row: Trend Indicator */}
      <div className="flex items-center gap-1.5 mt-auto">
        <span
          className={`flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold rounded-full ${
            trend.isPositive
              ? 'bg-success/10 text-success dark:bg-success/20'
              : 'bg-error/10 text-error dark:bg-error/20'
          }`}
        >
          {trend.isPositive ? (
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          ) : (
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          )}
          {trend.value}
        </span>
        {trend.label && (
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
            {trend.label}
          </span>
        )}
      </div>
    </div>
  );
}
