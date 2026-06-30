export function FuturePreviewsCard() {
  return (
    <div className="flex flex-col gap-4 mt-6">
      {/* Title Divider */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase">
          Predictive Intel (Coming Soon)
        </span>
        <div className="flex-1 h-px bg-slate-200/50 dark:bg-white/5" />
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: AI Forecast */}
        <div className="bg-white/30 dark:bg-slate-950/10 border border-dashed border-slate-300 dark:border-white/5 rounded-orbit-card p-6 shadow-sm flex flex-col gap-3 relative overflow-hidden select-none hover:border-primary/20 dark:hover:border-white/10 transition-colors duration-300">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-extrabold uppercase text-primary tracking-wider">
              AI Forecast
            </span>
            <span className="px-1.5 py-0.5 text-[8px] font-black text-accent bg-accent/10 border border-accent/15 rounded-full uppercase tracking-wide">
              AI Preview
            </span>
          </div>

          <div className="my-2">
            {/* Blurry mock graph line */}
            <div className="flex items-end gap-1.5 h-10 opacity-20 filter blur-[1px]">
              <div className="w-full bg-primary/40 h-[20%] rounded-sm animate-pulse" />
              <div className="w-full bg-primary/40 h-[45%] rounded-sm animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-full bg-primary/40 h-[30%] rounded-sm animate-pulse" style={{ animationDelay: '0.4s' }} />
              <div className="w-full bg-primary/40 h-[65%] rounded-sm animate-pulse" style={{ animationDelay: '0.6s' }} />
              <div className="w-full bg-primary/40 h-[85%] rounded-sm animate-pulse" style={{ animationDelay: '0.8s' }} />
            </div>
          </div>

          <p className="text-[11px] text-slate-450 dark:text-slate-550 leading-relaxed">
            Predict next month's deals value and sales conversion margins using historical CRM timelines.
          </p>

          {/* Locked Badge footer */}
          <div className="flex items-center gap-1.5 text-[9px] text-slate-400 dark:text-slate-550 font-bold mt-2">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Locked — Requires historical data</span>
          </div>
        </div>

        {/* Card 2: Relationship Intelligence */}
        <div className="bg-white/30 dark:bg-slate-950/10 border border-dashed border-slate-300 dark:border-white/5 rounded-orbit-card p-6 shadow-sm flex flex-col gap-3 relative overflow-hidden select-none hover:border-primary/20 dark:hover:border-white/10 transition-colors duration-300">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-extrabold uppercase text-secondary tracking-wider">
              Relationship Health
            </span>
            <span className="px-1.5 py-0.5 text-[8px] font-black text-accent bg-accent/10 border border-accent/15 rounded-full uppercase tracking-wide">
              AI Preview
            </span>
          </div>

          <div className="my-2 flex justify-center items-center h-10 opacity-20 filter blur-[1px]">
            {/* Blurry connection web */}
            <div className="flex gap-4">
              <div className="w-5 h-5 rounded-full bg-secondary" />
              <div className="w-3 h-3 rounded-full bg-slate-400 self-center" />
              <div className="w-5 h-5 rounded-full bg-accent" />
            </div>
          </div>

          <p className="text-[11px] text-slate-450 dark:text-slate-550 leading-relaxed">
            Analyze contact frequency, touchpoint sentiments, and communication gaps to score account wellness.
          </p>

          <div className="flex items-center gap-1.5 text-[9px] text-slate-400 dark:text-slate-550 font-bold mt-2">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Locked — Requires email integration</span>
          </div>
        </div>

        {/* Card 3: Churn Prediction */}
        <div className="bg-white/30 dark:bg-slate-950/10 border border-dashed border-slate-300 dark:border-white/5 rounded-orbit-card p-6 shadow-sm flex flex-col gap-3 relative overflow-hidden select-none hover:border-primary/20 dark:hover:border-white/10 transition-colors duration-300">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-extrabold uppercase text-error tracking-wider">
              Churn Analytics
            </span>
            <span className="px-1.5 py-0.5 text-[8px] font-black text-accent bg-accent/10 border border-accent/15 rounded-full uppercase tracking-wide">
              AI Preview
            </span>
          </div>

          <div className="my-2">
            {/* Blurry warning ring */}
            <div className="flex justify-center items-center h-10 opacity-20 filter blur-[1px]">
              <div className="w-8 h-8 rounded-full border-4 border-error border-t-transparent animate-spin" />
            </div>
          </div>

          <p className="text-[11px] text-slate-450 dark:text-slate-550 leading-relaxed">
            Monitor activity stagnation and delayed deals to flag customer risk percentages before they churn.
          </p>

          <div className="flex items-center gap-1.5 text-[9px] text-slate-400 dark:text-slate-550 font-bold mt-2">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Locked — Requires audit log telemetry</span>
          </div>
        </div>

      </div>
    </div>
  );
}
