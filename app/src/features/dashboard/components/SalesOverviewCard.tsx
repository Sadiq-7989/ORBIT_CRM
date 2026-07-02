import type { DashboardStats } from '../../../services/analyticsService';
import hero from '../../../assets/hero.png';

interface SalesOverviewCardProps {
  stats: DashboardStats | null;
  target?: number;
}

export function SalesOverviewCard({ stats, target = 1000000 }: SalesOverviewCardProps) {
  const pipelineValue = stats?.pipelineValue || 0;
  const totalDeals = stats?.totalDeals || 0;
  const openTasks = stats?.openTasks || 0;

  const achievedPercent = Math.min(Math.round((pipelineValue / target) * 1000) / 10, 100);

  // Formatted currencies
  const formattedAchieved = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(pipelineValue);

  const formattedTarget = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(target);

  // Average deal value calculation
  const avgDealValue = totalDeals > 0 ? Math.round(pipelineValue / totalDeals) : 0;
  const formattedAvg = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(avgDealValue);

  // Expected Value (Weighted at 70% probability)
  const expectedRevenue = Math.round(pipelineValue * 0.7);
  const formattedExpected = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(expectedRevenue);

  const getStatusText = () => {
    if (achievedPercent >= 90) return 'Close to achieving this quarter quota!';
    if (achievedPercent >= 50) return 'More than half way to target, keep closing deals!';
    if (achievedPercent > 0) return 'On track to grow CRM sales portfolio';
    return 'Create and close deals to start progress';
  };

  // Get dynamic Business Health
  const getBusinessHealth = () => {
    if (!stats) {
      return {
        status: 'Unknown',
        explanation: 'Loading live business metrics...',
        color: 'text-slate-400 dark:text-slate-500 bg-slate-100/50 dark:bg-white/5 border-slate-200/50 dark:border-white/5',
        dot: '⚪'
      };
    }

    const hasDeals = totalDeals > 0;
    const highWorkload = openTasks > 8;

    if (achievedPercent >= 80 && hasDeals && !highWorkload) {
      return {
        status: 'Excellent',
        explanation: 'Strong target achievement, positive deal velocity, and fully optimized task capacity.',
        color: 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        dot: '🟢'
      };
    }
    
    if (achievedPercent >= 40 && hasDeals) {
      return {
        status: 'Good',
        explanation: 'Steady progress toward quarterly target. Monitor pending checklists and priorities.',
        color: 'text-indigo-700 dark:text-indigo-450 bg-indigo-500/10 border-indigo-500/20',
        dot: '🟡'
      };
    }

    if (highWorkload || !hasDeals) {
      return {
        status: 'Needs Attention',
        explanation: 'Pipeline activity is stagnant or workload checklists require immediate mitigation.',
        color: 'text-amber-700 dark:text-amber-450 bg-amber-500/10 border-amber-500/20',
        dot: '🟠'
      };
    }

    return {
      status: 'Critical',
      explanation: 'No active deals recorded in pipeline or high volume of overdue task backlogs.',
      color: 'text-rose-700 dark:text-rose-450 bg-rose-500/10 border-rose-500/20',
      dot: '🔴'
    };
  };

  const health = getBusinessHealth();

  const generateInsights = () => {
    if (!stats) return [
      'Establishing analytics pipeline telemetry...',
      'Computing forecast parameters...'
    ];

    const insights = [];
    insights.push(`Sales target progress has reached ${achievedPercent}% of the quarterly target.`);
    if (totalDeals > 0) {
      insights.push(`Managing ${totalDeals} active opportunities with a mean valuation of ${formattedAvg}.`);
    } else {
      insights.push('Pipeline is inactive. Add deals under negotiated accounts to populate predictions.');
    }
    insights.push(`Expected (70% weighted probability) pipeline yield is forecasted at ${formattedExpected}.`);
    if (openTasks > 5) {
      insights.push(`Backlog Warning: ${openTasks} pending action tasks require follow-up attention.`);
    } else {
      insights.push(`Tasks status: checklist workload is normal with only ${openTasks} open follow-ups.`);
    }

    return insights;
  };

  const insights = generateInsights();

  return (
    <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-orbit-card border border-slate-200/50 dark:border-white/5 p-6 shadow-orbit-card hover:shadow-orbit-hover hover:border-slate-300 dark:hover:border-white/10 transition-all duration-300 h-fit">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Left Side Content - Spans 2 columns on medium+ screens */}
        <div className="lg:col-span-2 flex flex-col justify-between gap-5">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Sales Overview
              </h3>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[9px] font-bold text-success bg-success/10 dark:bg-success/20 rounded-full border border-success/20">
                  Live updates
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-4">
              Monthly target tracking, forecasts, and live portfolio health analytics
            </p>

            {/* Target Progress Bar */}
            <div className="mb-5 bg-slate-50/50 dark:bg-slate-950/10 p-3 rounded-orbit-input border border-slate-100 dark:border-white/5">
              <div className="flex justify-between items-center text-[11px] mb-1.5 font-bold">
                <span className="text-slate-500 dark:text-slate-400">Quarterly Target Progress</span>
                <span className="text-slate-800 dark:text-slate-200">{achievedPercent}% Achieved</span>
              </div>
              
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-950/50 rounded-full overflow-hidden border border-slate-200/20 dark:border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full transition-all duration-1000"
                  style={{ width: `${achievedPercent}%` }}
                />
              </div>
            </div>

            {/* 2x2 Executive Metrics Grid (Represented as a 4-col compact dashboard) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              <div className="p-3 bg-slate-50/50 dark:bg-slate-950/20 rounded-orbit-input border border-slate-100/50 dark:border-white/5">
                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-0.5">
                  Achieved
                </span>
                <span className="text-sm font-black text-slate-800 dark:text-white">
                  {formattedAchieved}
                </span>
              </div>
              <div className="p-3 bg-slate-50/50 dark:bg-slate-950/20 rounded-orbit-input border border-slate-100/50 dark:border-white/5">
                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-0.5">
                  Target
                </span>
                <span className="text-sm font-black text-slate-800 dark:text-white">
                  {formattedTarget}
                </span>
              </div>
              <div className="p-3 bg-slate-50/50 dark:bg-slate-950/20 rounded-orbit-input border border-slate-100/50 dark:border-white/5">
                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-0.5">
                  Average Value
                </span>
                <span className="text-sm font-black text-slate-800 dark:text-white">
                  {formattedAvg}
                </span>
              </div>
              <div className="p-3 bg-slate-50/50 dark:bg-slate-950/20 rounded-orbit-input border border-slate-100/50 dark:border-white/5">
                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-0.5">
                  Expected (70%)
                </span>
                <span className="text-sm font-black text-slate-800 dark:text-white">
                  {formattedExpected}
                </span>
              </div>
            </div>

            {/* Dynamic Executive Health summary panel */}
            <div className={`p-3 border rounded-orbit-input flex flex-col gap-1 mb-5 transition-colors ${health.color}`}>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <span>{health.dot}</span> Executive Health Summary: {health.status}
                </span>
              </div>
              <p className="text-[10px] font-bold opacity-90 leading-normal">
                {health.explanation}
              </p>
            </div>

            {/* Dynamic Executive business insights list */}
            <div className="p-4 bg-slate-50/50 dark:bg-slate-950/20 rounded-orbit-input border border-slate-150/50 dark:border-white/5">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">
                Executive Insights
              </span>
              <ul className="space-y-1.5 text-[10px] text-slate-650 dark:text-slate-350 font-bold">
                {insights.map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary mt-0.5 select-none">•</span>
                    <span className="leading-relaxed">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Strategy Recommendation Status footer */}
          <div className="p-3 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-orbit-input flex items-center gap-2.5 mt-2">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-[9px] text-primary font-black uppercase tracking-wider leading-none shrink-0">
              Strategic recommendation:
            </span>
            <span className="text-[11px] text-slate-700 dark:text-slate-350 font-bold leading-normal">
              {getStatusText()}
            </span>
          </div>

          {/* Premium Bottom Hero Section */}
          <div className="relative w-full max-w-[420px] h-fit px-1 overflow-hidden select-none mt-4 hidden lg:flex items-center justify-center self-center mx-auto">
            <img
              src={hero}
              alt="Orbit CRM Hero Illustration"
              className="w-full h-auto object-contain select-none pointer-events-none"
            />
          </div>
        </div>

        {/* Right Side Illustration - Spans 1 column */}
        <div className="lg:col-span-1 flex items-center justify-center bg-gradient-to-tr from-slate-50 to-slate-100/30 dark:from-slate-950/50 dark:to-slate-950/10 rounded-orbit-card border border-slate-200/30 dark:border-white/5 p-4 relative overflow-hidden select-none max-h-[420px] lg:max-h-none">
          
          {/* Decorative Grid Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.05)_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

          {/* Vector SVG Illustration */}
          <svg 
            className="w-full max-w-[200px] lg:max-w-[240px] h-auto relative z-10" 
            viewBox="0 0 200 160" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
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
              <rect x="50" y="90" width="10" height="20" rx="3" fill="url(#orbitGrad)" opacity="0.6" />
              <rect x="70" y="70" width="10" height="40" rx="3" fill="url(#orbitGrad)" opacity="0.75" />
              <rect x="90" y="50" width="10" height="60" rx="3" fill="url(#orbitGrad)" opacity="0.85" />
              <rect x="110" y="35" width="10" height="75" rx="3" fill="url(#orbitGrad)" />
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
    </div>
  );
}
