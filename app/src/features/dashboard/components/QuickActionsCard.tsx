interface ActionItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  colorClass: string;
}

export function QuickActionsCard() {
  const actions: ActionItem[] = [
    {
      label: 'Add Customer',
      icon: (
        <svg className="w-5 h-5 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      onClick: () => alert('Quick Action: Add Customer'),
      colorClass: 'text-accent border-accent/20 hover:bg-accent/5 dark:hover:bg-accent/10 hover:border-accent/40',
    },
    {
      label: 'Create Deal',
      icon: (
        <svg className="w-5 h-5 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      onClick: () => alert('Quick Action: Create Deal'),
      colorClass: 'text-primary border-primary/20 hover:bg-primary/5 dark:hover:bg-primary/10 hover:border-primary/40',
    },
    {
      label: 'Add Task',
      icon: (
        <svg className="w-5 h-5 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      onClick: () => alert('Quick Action: Add Task'),
      colorClass: 'text-success border-success/20 hover:bg-success/5 dark:hover:bg-success/10 hover:border-success/40',
    },
    {
      label: 'Export Report',
      icon: (
        <svg className="w-5 h-5 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      onClick: () => alert('Quick Action: Export Report'),
      colorClass: 'text-secondary border-secondary/20 hover:bg-secondary/5 dark:hover:bg-secondary/10 hover:border-secondary/40',
    },
  ];

  return (
    <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-orbit-card border border-slate-200/50 dark:border-white/5 p-6 shadow-orbit-card hover:shadow-orbit-hover hover:border-slate-300 dark:hover:border-white/10 transition-all duration-300 flex flex-col justify-between">
      {/* Card Header */}
      <div className="mb-4">
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
          Quick Actions
        </h3>
        <p className="text-[10px] text-slate-500 dark:text-slate-450 mt-1">
          Perform administrative actions instantly.
        </p>
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            type="button"
            onClick={action.onClick}
            className={`flex flex-col items-center justify-center p-4 border rounded-orbit-button text-xs font-bold transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] cursor-pointer bg-white/30 dark:bg-slate-950/20 backdrop-blur-sm ${action.colorClass}`}
          >
            {action.icon}
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
