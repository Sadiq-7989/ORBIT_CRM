import { useNavigate } from 'react-router-dom';
import type { RevenueAnalytics, CustomerAnalytics, TaskAnalytics } from '../../../services/analyticsService';

interface QuickInsightsProps {
  revenueData: RevenueAnalytics;
  customerData: CustomerAnalytics;
  taskData: TaskAnalytics;
}

export function QuickInsights({ revenueData, customerData, taskData }: QuickInsightsProps) {
  const navigate = useNavigate();

  // Generate dynamic observations based on stats
  const insights: Array<{
    type: 'positive' | 'warning' | 'info';
    text: string;
    actionLabel: string;
    actionPath: string;
  }> = [];

  // Won Revenue & Growth
  if (revenueData.growthRate > 20) {
    insights.push({
      type: 'positive',
      text: `Outstanding revenue performance! Live Won Deals expanded by ${revenueData.growthRate.toFixed(1)}% compared to the prior period.`,
      actionLabel: 'View Portfolio',
      actionPath: '/deals',
    });
  } else if (revenueData.growthRate < -5) {
    insights.push({
      type: 'warning',
      text: `Revenue velocity slowed down by ${Math.abs(revenueData.growthRate).toFixed(1)}%. Review deal delays in Negotiation.`,
      actionLabel: 'Review pipeline',
      actionPath: '/deals',
    });
  } else {
    insights.push({
      type: 'info',
      text: `Won sales revenue is steady with an average deal size of $${Math.round(revenueData.averageDealValue).toLocaleString()}.`,
      actionLabel: 'Analyze pipeline',
      actionPath: '/deals',
    });
  }

  // Customers Source & Volume
  if (customerData.newCustomers > 0) {
    // Find top source
    const topSource = [...customerData.sourceBreakdown].sort((a, b) => b.count - a.count)[0]?.source || 'organic channels';
    insights.push({
      type: 'positive',
      text: `Acquired ${customerData.newCustomers} new clients. Client acquisitions are heavily driven via "${topSource}".`,
      actionLabel: 'Browse Directory',
      actionPath: '/customers',
    });
  }

  // Tasks Checklist Health
  if (taskData.overdueTasks > 0) {
    insights.push({
      type: 'warning',
      text: `High alert! You have ${taskData.overdueTasks} pending tasks that have passed their due dates.`,
      actionLabel: 'Solve Tasks',
      actionPath: '/tasks',
    });
  } else if (taskData.completionRate > 80) {
    insights.push({
      type: 'positive',
      text: `Checklist execution is at ${taskData.completionRate.toFixed(0)}%. Team is performing at supreme operational velocity.`,
      actionLabel: 'Task Planner',
      actionPath: '/tasks',
    });
  } else if (taskData.pendingTasks > 0) {
    insights.push({
      type: 'info',
      text: `Operational workload stands at ${taskData.pendingTasks} open tasks. Priorities look well-balanced.`,
      actionLabel: 'Open Checklist',
      actionPath: '/tasks',
    });
  }

  return (
    <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-orbit-card border border-slate-200/50 dark:border-white/5 p-6 shadow-orbit-card hover:shadow-orbit-hover hover:border-slate-300 dark:hover:border-white/10 transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
          Quick Insights
        </h3>
      </div>

      <div className="space-y-3">
        {insights.map((insight, idx) => {
          const typeColors = {
            positive: 'border-success/20 bg-success/5 dark:bg-success/10 text-slate-800 dark:text-slate-200',
            warning: 'border-error/20 bg-error/5 dark:bg-error/10 text-slate-800 dark:text-slate-200',
            info: 'border-primary/20 bg-primary/5 dark:bg-primary/10 text-slate-800 dark:text-slate-200',
          };

          const bulletColors = {
            positive: 'bg-success',
            warning: 'bg-error',
            info: 'bg-primary',
          };

          return (
            <div
              key={idx}
              className={`p-3.5 rounded-orbit-button border ${typeColors[insight.type]} flex items-start justify-between gap-3 text-xs font-semibold leading-relaxed`}
            >
              <div className="flex items-start gap-2.5">
                <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${bulletColors[insight.type]}`} />
                <span>{insight.text}</span>
              </div>
              <button
                type="button"
                onClick={() => navigate(insight.actionPath)}
                className="text-[10px] font-black uppercase tracking-wider text-primary hover:text-secondary shrink-0 cursor-pointer transition-colors duration-200 mt-0.5"
              >
                {insight.actionLabel} &rarr;
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
