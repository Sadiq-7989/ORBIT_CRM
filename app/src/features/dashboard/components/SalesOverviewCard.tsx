export function SalesOverviewCard() {
  return (
    <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-orbit-card border border-slate-200/50 dark:border-white/5 p-6 shadow-orbit-card hover:shadow-orbit-hover hover:border-slate-300 dark:hover:border-white/10 transition-all duration-300 flex flex-col lg:flex-row gap-6 items-stretch h-full">
      
      {/* Metrics Column (Left/Top) */}
      <div className="flex flex-col justify-between flex-1 min-w-0">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Sales Overview
            </h3>
            <span className="px-2 py-0.5 text-[9px] font-bold text-success bg-success/10 dark:bg-success/20 rounded-full">
              Live updates
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-6">
            Monthly target tracking and projections
          </p>

          {/* Stats details */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Monthly Sales Goal</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200">82.7% Achieved</span>
              </div>
              
              {/* Progress Bar Container */}
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-950/50 rounded-full overflow-hidden border border-slate-200/20 dark:border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full transition-all duration-1000"
                  style={{ width: '82.7%' }}
                />
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-3 bg-slate-50/50 dark:bg-slate-950/20 rounded-orbit-button border border-slate-100/50 dark:border-white/5">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                  Achieved
                </span>
                <span className="text-lg font-black text-slate-800 dark:text-white">
                  $248,000
                </span>
              </div>
              <div className="p-3 bg-slate-50/50 dark:bg-slate-950/20 rounded-orbit-button border border-slate-100/50 dark:border-white/5">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                  Target
                </span>
                <span className="text-lg font-black text-slate-800 dark:text-white">
                  $300,000
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Project info footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold leading-none">
            On track to hit quota by end of month
          </span>
        </div>
      </div>

      {/* Vector Illustration (Right/Bottom) */}
      <div className="flex-1 min-w-[240px] flex items-center justify-center bg-gradient-to-tr from-slate-50 to-slate-100/30 dark:from-slate-950/50 dark:to-slate-950/10 rounded-orbit-card border border-slate-200/30 dark:border-white/5 p-4 relative overflow-hidden select-none">
        
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.05)_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

        {/* Vector SVG Illustration */}
        <svg 
          className="w-full max-w-[260px] h-auto relative z-10" 
          viewBox="0 0 200 160" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Defs for gradients & filters */}
          <defs>
            <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="50%" stopColor="var(--color-secondary)" />
              <stop offset="100%" stopColor="var(--color-accent)" />
            </linearGradient>
            <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Dotted target guide rings */}
          <circle cx="100" cy="80" r="60" stroke="currentColor" className="text-slate-200 dark:text-white/5" strokeWidth="1.5" strokeDasharray="3 5" />
          <circle cx="100" cy="80" r="40" stroke="currentColor" className="text-slate-200 dark:text-white/5" strokeWidth="1" strokeDasharray="2 4" />
          
          {/* Main Orbiting Pathways */}
          <ellipse cx="100" cy="80" rx="75" ry="30" stroke="url(#accentGrad)" strokeWidth="1.5" transform="rotate(-15 100 80)" className="animate-[pulse_4s_ease-in-out_infinite]" />
          <ellipse cx="100" cy="80" rx="55" ry="20" stroke="currentColor" className="text-primary/30 dark:text-primary/20" strokeWidth="1" transform="rotate(25 100 80)" />

          {/* Abstract Bars placeholder layout */}
          <g opacity="0.85">
            {/* Bar 1 */}
            <rect x="50" y="90" width="10" height="20" rx="3" fill="url(#orbitGrad)" opacity="0.6" />
            {/* Bar 2 */}
            <rect x="70" y="70" width="10" height="40" rx="3" fill="url(#orbitGrad)" opacity="0.75" />
            {/* Bar 3 */}
            <rect x="90" y="50" width="10" height="60" rx="3" fill="url(#orbitGrad)" opacity="0.85" />
            {/* Bar 4 */}
            <rect x="110" y="35" width="10" height="75" rx="3" fill="url(#orbitGrad)" />
            {/* Bar 5 */}
            <rect x="130" y="55" width="10" height="55" rx="3" fill="url(#orbitGrad)" opacity="0.9" />
          </g>

          {/* Connected data dots & paths */}
          <path d="M 55 100 L 75 80 L 95 60 L 115 45 L 135 65" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" />
          
          <circle cx="55" cy="100" r="4.5" fill="var(--color-background-light)" className="dark:fill-slate-900" stroke="var(--color-accent)" strokeWidth="2.5" />
          <circle cx="75" cy="80" r="4.5" fill="var(--color-background-light)" className="dark:fill-slate-900" stroke="var(--color-accent)" strokeWidth="2.5" />
          <circle cx="95" cy="60" r="4.5" fill="var(--color-background-light)" className="dark:fill-slate-900" stroke="var(--color-accent)" strokeWidth="2.5" />
          <circle cx="115" cy="45" r="5" fill="var(--color-accent)" filter="url(#glow)" className="animate-ping" style={{ animationDuration: '3s' }} />
          <circle cx="115" cy="45" r="4.5" fill="var(--color-background-light)" className="dark:fill-slate-900" stroke="var(--color-accent)" strokeWidth="2.5" />
          <circle cx="135" cy="65" r="4.5" fill="var(--color-background-light)" className="dark:fill-slate-900" stroke="var(--color-accent)" strokeWidth="2.5" />

          {/* Central Orbit Core Graphic */}
          <g transform="translate(100 80) rotate(45)">
            <circle cx="0" cy="0" r="8" fill="url(#orbitGrad)" filter="url(#glow)" />
            <circle cx="0" cy="0" r="4" fill="white" />
          </g>
        </svg>

        {/* Orbiting particles overlay */}
        <div className="absolute top-8 left-12 w-1.5 h-1.5 bg-accent rounded-full animate-ping opacity-60" />
        <div className="absolute bottom-12 right-16 w-2 h-2 bg-secondary rounded-full animate-bounce opacity-40" />
      </div>

    </div>
  );
}
