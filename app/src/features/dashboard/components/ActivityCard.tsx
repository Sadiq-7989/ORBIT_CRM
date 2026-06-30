interface ActivityItem {
  id: string;
  type: 'customer' | 'deal' | 'task';
  content: React.ReactNode;
  time: string;
}

export function ActivityCard() {
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'customer',
      content: (
        <span>
          New customer <strong className="font-bold text-slate-850 dark:text-slate-200">Sarah Jenkins</strong> added by User
        </span>
      ),
      time: '12 mins ago',
    },
    {
      id: '2',
      type: 'deal',
      content: (
        <span>
          Deal <strong className="font-bold text-slate-850 dark:text-slate-200">Acme Corp Expansion</strong> moved to <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-warning/10 text-warning dark:bg-warning/20">Negotiation</span>
        </span>
      ),
      time: '1 hour ago',
    },
    {
      id: '3',
      type: 'task',
      content: (
        <span>
          Task <strong className="font-bold text-slate-850 dark:text-slate-200">Follow-up phone call</strong> completed by User
        </span>
      ),
      time: '3 hours ago',
    },
    {
      id: '4',
      type: 'customer',
      content: (
        <span>
          New customer <strong className="font-bold text-slate-850 dark:text-slate-200">Apex Holdings</strong> imported
        </span>
      ),
      time: '5 hours ago',
    },
  ];

  const getIcon = (type: 'customer' | 'deal' | 'task') => {
    switch (type) {
      case 'customer':
        return (
          <div className="w-8 h-8 rounded-full bg-accent/15 text-accent border border-accent/10 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
        );
      case 'deal':
        return (
          <div className="w-8 h-8 rounded-full bg-secondary/15 text-secondary border border-secondary/10 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        );
      case 'task':
        return (
          <div className="w-8 h-8 rounded-full bg-success/15 text-success border border-success/10 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-orbit-card border border-slate-200/50 dark:border-white/5 p-6 shadow-orbit-card hover:shadow-orbit-hover hover:border-slate-300 dark:hover:border-white/10 transition-all duration-300 flex flex-col h-full">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
          Recent Activity
        </h3>
        <span className="text-[10px] font-bold text-primary dark:text-secondary hover:underline cursor-pointer">
          View Audit Log
        </span>
      </div>

      {/* Timeline List */}
      <div className="flex-1 flex flex-col gap-4">
        {activities.map((activity, index) => (
          <div key={activity.id} className="relative flex items-start gap-3">
            {/* Timeline vertical connector line */}
            {index !== activities.length - 1 && (
              <span className="absolute left-4 top-8 bottom-0 w-px bg-slate-200 dark:bg-slate-800/80 -z-10" />
            )}

            {/* Icon */}
            <div className="flex-shrink-0">{getIcon(activity.type)}</div>

            {/* Content & Time */}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-655 dark:text-slate-300 leading-normal mb-0.5">
                {activity.content}
              </p>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                {activity.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
