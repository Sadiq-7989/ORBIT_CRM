import { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import type { DashboardStats, ActivityItem, UpcomingTask } from '../../services/analyticsService';
import { DashboardHeader } from './components/DashboardHeader';
import { KPICard } from './components/KPICard';
import { SalesOverviewCard } from './components/SalesOverviewCard';
import { ActivityCard } from './components/ActivityCard';
import { QuickActionsCard } from './components/QuickActionsCard';
import { UpcomingTasksCard } from './components/UpcomingTasksCard';
import { FuturePreviewsCard } from './components/FuturePreviewsCard';

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<UpcomingTask[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const [statsData, activitiesData, tasksData] = await Promise.all([
        analyticsService.getDashboardStats(),
        analyticsService.getRecentActivities(),
        analyticsService.getUpcomingTasks(),
      ]);

      setStats(statsData);
      setActivities(activitiesData);
      setUpcomingTasks(tasksData);
    } catch (err: any) {
      console.error('Error fetching dashboard database analytics:', err);
      setError(err?.message || 'Failed to sync live dashboard data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Format currency value helper
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 w-full animate-pulse">
        {/* Header Loading */}
        <div className="h-14 bg-slate-200/50 dark:bg-white/5 rounded-orbit-card w-1/3 mb-4" />
        
        {/* KPICards Loading */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-200/50 dark:bg-white/5 border border-slate-200/30 dark:border-white/5 rounded-orbit-card" />
          ))}
        </div>

        {/* Main Grid Columns Loading */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[350px] bg-slate-200/50 dark:bg-white/5 border border-slate-200/30 dark:border-white/5 rounded-orbit-card" />
          <div className="flex flex-col gap-6">
            <div className="h-44 bg-slate-200/50 dark:bg-white/5 border border-slate-200/30 dark:border-white/5 rounded-orbit-card" />
            <div className="h-[250px] bg-slate-200/50 dark:bg-white/5 border border-slate-200/30 dark:border-white/5 rounded-orbit-card" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6 w-full h-full animate-[fadeIn_0.3s_ease-out]">
        <DashboardHeader />
        
        <div className="p-8 bg-error/10 border border-error/20 rounded-orbit-card text-center flex flex-col items-center gap-3 max-w-md mx-auto my-16">
          <div className="w-12 h-12 rounded-full bg-error/20 text-error flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
            Analytics Sync Failed
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {error}
          </p>
          <button
            type="button"
            onClick={fetchDashboardData}
            className="px-5 py-2.5 text-xs font-black text-white bg-error rounded-orbit-button hover:opacity-90 hover:scale-[1.01] transition-all cursor-pointer shadow-md"
          >
            Retry Analytics Sync
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full animate-[fadeIn_0.4s_ease-out]">
      {/* 1. Header (Greeting + Date) */}
      <DashboardHeader />

      {/* 2. KPI Cards Grid (4 items) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Customers"
          value={stats?.totalCustomers || 0}
          trend={{ value: 'Realtime', isPositive: true, label: 'synchronized data' }}
          gradient="accent"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        <KPICard
          title="Total Deals"
          value={stats?.totalDeals || 0}
          trend={{ value: 'Pipeline', isPositive: true, label: 'sales processes' }}
          gradient="primary"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
        <KPICard
          title="Pipeline Value"
          value={formatCurrency(stats?.pipelineValue || 0)}
          trend={{ value: 'Revenue', isPositive: true, label: 'cumulative quota' }}
          gradient="success"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <KPICard
          title="Open Tasks"
          value={stats?.openTasks || 0}
          trend={{ value: 'Checklist', isPositive: true, label: 'pending actions' }}
          gradient="warning"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          }
        />
      </div>

      {/* 3. Main Dashboard Body: 2/3 Sales Overview, 1/3 Quick Actions + Task/Activity stack */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Sales Overview Card (Left side, spans 2 columns) */}
        <div className="lg:col-span-2">
          <SalesOverviewCard pipelineValue={stats?.pipelineValue || 0} />
        </div>

        {/* Quick Actions + Tasks + Activity (Right side, stacked vertically) */}
        <div className="flex flex-col gap-6">
          <QuickActionsCard />
          <UpcomingTasksCard tasks={upcomingTasks} />
          <ActivityCard activities={activities} />
        </div>

      </div>

      {/* 4. Futures Previews Row */}
      <FuturePreviewsCard />

    </div>
  );
}
