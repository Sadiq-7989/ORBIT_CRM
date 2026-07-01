export function AIInsightsPreview() {
  const cards = [
    {
      id: 'forecast',
      title: 'Revenue Forecast',
      desc: 'Predictive sales trajectory for Q3/Q4 based on live pipeline conversion metrics.',
      value: '+28.4%',
      badge: 'High Confidence',
      badgeColor: 'bg-success/15 text-success',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      id: 'health',
      title: 'Customer Health Index',
      desc: 'Aggregated sentiment score, support tickets activity, and contract duration metrics.',
      value: '94 / 100',
      badge: 'Excellent',
      badgeColor: 'bg-primary/15 text-primary',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      id: 'churn',
      title: 'Churn Risk Warning',
      desc: 'Flags deals or customer accounts showcasing abnormal inactivity patterns.',
      value: '0.8%',
      badge: 'Negligible Risk',
      badgeColor: 'bg-success/15 text-success',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    {
      id: 'opportunity',
      title: 'Opportunity Score',
      desc: 'Auto-calculates leads with highest engagement value and close likelihood indices.',
      value: '86.5',
      badge: 'A+ Class Lead',
      badgeColor: 'bg-accent/15 text-accent',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    },
    {
      id: 'action',
      title: 'Next Best Action',
      desc: 'AI-assisted recommended follow-up directives to revive stalled sales or contact accounts.',
      value: 'Re-engage',
      badge: '3 Actions Pending',
      badgeColor: 'bg-warning/15 text-warning',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-orbit-card border border-slate-200/50 dark:border-white/5 p-6 shadow-orbit-card hover:shadow-orbit-hover hover:border-slate-300 dark:hover:border-white/10 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-orbit-button bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-md">
          <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            Orbit AI Insights
            <span className="px-2 py-0.5 text-[9px] font-bold text-primary bg-primary/10 rounded-full normal-case tracking-normal">
              Predictive Beta
            </span>
          </h3>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
            Machine learning analytics models powered by local intelligence pipelines
          </p>
        </div>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((c) => (
          <div
            key={c.id}
            className="group relative p-4 bg-slate-50/50 dark:bg-slate-950/20 rounded-orbit-button border border-slate-100 dark:border-white/5 hover:border-primary/20 dark:hover:border-primary/10 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            {/* Background glowing circle on hover */}
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none" />

            <div>
              {/* Header: Title & Icon */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight block">
                  {c.title}
                </span>
                <div className="text-primary dark:text-slate-400 shrink-0">
                  {c.icon}
                </div>
              </div>

              {/* Description */}
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-4">
                {c.desc}
              </p>
            </div>

            {/* Metric & Badge */}
            <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-1 mt-auto">
              <span className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                {c.value}
              </span>
              <span className={`px-2 py-0.5 text-[8px] font-extrabold rounded-full ${c.badgeColor}`}>
                {c.badge}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
