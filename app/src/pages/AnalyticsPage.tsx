import { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';
import type { RevenueAnalytics, CustomerAnalytics, TaskAnalytics, PipelineStageAnalytics } from '../services/analyticsService';

import { AnalyticsFilters } from '../features/analytics/components/AnalyticsFilters';
import { ExportToolbar } from '../features/analytics/components/ExportToolbar';
import { RevenueAnalyticsCard } from '../features/analytics/components/RevenueAnalyticsCard';
import { CustomerAnalyticsCard } from '../features/analytics/components/CustomerAnalyticsCard';
import { TaskAnalyticsCard } from '../features/analytics/components/TaskAnalyticsCard';
import { MonthlyRevenueChart } from '../features/analytics/components/MonthlyRevenueChart';
import { PipelineAnalyticsChart } from '../features/analytics/components/PipelineAnalyticsChart';
import { TaskCompletionChart } from '../features/analytics/components/TaskCompletionChart';
import { CustomerGrowthChart } from '../features/analytics/components/CustomerGrowthChart';
import { AIInsightsPreview } from '../features/analytics/components/AIInsightsPreview';
import { QuickInsights } from '../features/analytics/components/QuickInsights';

export function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');
  
  // Data states
  const [revenueData, setRevenueData] = useState<RevenueAnalytics | null>(null);
  const [customerData, setCustomerData] = useState<CustomerAnalytics | null>(null);
  const [taskData, setTaskData] = useState<TaskAnalytics | null>(null);
  const [pipelineData, setPipelineData] = useState<PipelineStageAnalytics[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalyticsData = async (range: string) => {
    try {
      setIsLoading(true);
      setError('');
      
      const [rev, cust, tsk, pipe] = await Promise.all([
        analyticsService.getRevenueAnalytics(range),
        analyticsService.getCustomerAnalytics(range),
        analyticsService.getTaskAnalytics(range),
        analyticsService.getPipelineAnalytics(),
      ]);

      setRevenueData(rev);
      setCustomerData(cust);
      setTaskData(tsk);
      setPipelineData(pipe);
    } catch (err: any) {
      console.error('Error loading Live Analytics Center:', err);
      setError(err?.message || 'Failed to sync live analytics database matrices.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData(timeRange);
  }, [timeRange]);

  const handleRetry = () => {
    fetchAnalyticsData(timeRange);
  };

  // Check if there is zero data in database
  const isEmpty = 
    revenueData && 
    customerData && 
    taskData && 
    revenueData.totalRevenue === 0 && 
    revenueData.pipelineValue === 0 &&
    customerData.totalCustomers === 0 && 
    taskData.totalTasks === 0;

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto py-16 animate-[fadeIn_0.3s_ease-out]">
        <div className="w-16 h-16 rounded-full bg-error/10 border border-error/20 flex items-center justify-center text-error mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">
          Sync Failed
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-6 leading-relaxed">
          {error}
        </p>
        <button
          type="button"
          onClick={handleRetry}
          className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-primary to-secondary rounded-orbit-button hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-md shadow-primary/20"
        >
          Retry Database Sync
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full h-full animate-[fadeIn_0.3s_ease-out]">
      
      {/* 1. Page Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
            Enterprise Analytics Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Real-time business intelligence dashboard, pipeline metrics, and machine learning insights.
          </p>
        </div>
        
        {/* Controls Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <AnalyticsFilters timeRange={timeRange} setTimeRange={setTimeRange} />
          <ExportToolbar />
        </div>
      </div>

      {/* 2. Empty State Validation */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto py-16">
          <div className="relative w-40 h-40 mb-6 flex items-center justify-center select-none">
            <div className="absolute w-36 h-36 rounded-full border border-dashed border-gray-300 dark:border-white/10 animate-[spin_40s_linear_infinite]" />
            <div className="absolute w-24 h-24 rounded-full border border-dashed border-gray-300/80 dark:border-white/5 animate-[spin_25s_linear_infinite_reverse]" />
            <div className="absolute w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-black text-sm shadow-lg">
              Ø
            </div>
          </div>
          <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">
            No Live Records Found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold max-w-xs leading-relaxed mb-6">
            Add customers, open sales deals, or checklist tasks to auto-generate predictive dashboard charts.
          </p>
        </div>
      ) : (
        <>
          {/* 3. KPI Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RevenueAnalyticsCard
              totalRevenue={revenueData?.totalRevenue || 0}
              pipelineValue={revenueData?.pipelineValue || 0}
              averageDealValue={revenueData?.averageDealValue || 0}
              wonDealsCount={revenueData?.wonDealsCount || 0}
              growthRate={revenueData?.growthRate || 0}
            />
            <CustomerAnalyticsCard
              totalCustomers={customerData?.totalCustomers || 0}
              newCustomers={customerData?.newCustomers || 0}
              growthRate={customerData?.growthRate || 0}
              sourceBreakdown={customerData?.sourceBreakdown || []}
            />
            <TaskAnalyticsCard
              totalTasks={taskData?.totalTasks || 0}
              completedTasks={taskData?.completedTasks || 0}
              pendingTasks={taskData?.pendingTasks || 0}
              completionRate={taskData?.completionRate || 0}
              overdueTasks={taskData?.overdueTasks || 0}
            />
          </div>

          {/* 4. Insights & Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Charts Panel (2/3 width) */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <MonthlyRevenueChart trends={revenueData?.monthlyTrends || []} />
              <PipelineAnalyticsChart stagesData={pipelineData} />
              <TaskCompletionChart priorityData={taskData?.priorityBreakdown || []} />
              <CustomerGrowthChart growthTrends={customerData?.growthTrends || []} />
            </div>

            {/* Quick Insights (1/3 width) */}
            <div className="h-full flex flex-col gap-6">
              {revenueData && customerData && taskData && (
                <QuickInsights
                  revenueData={revenueData}
                  customerData={customerData}
                  taskData={taskData}
                />
              )}
              
              {/* Secondary Helper Activity Summary or similar */}
              <div className="bg-gradient-to-tr from-slate-100/50 via-slate-50 to-white/30 dark:from-slate-950/40 dark:to-slate-950/10 rounded-orbit-card border border-slate-200/50 dark:border-white/5 p-6 flex flex-col justify-between flex-1 min-h-[160px]">
                <div>
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                    Real-time Pipeline sync
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                    Database tables <strong>customers</strong>, <strong>deals</strong> and <strong>tasks</strong> are bound using reactive queries. All chart filters operate on client-side cache ranges.
                  </p>
                </div>
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-4 border-t border-slate-200/30 pt-3">
                  Last updated: {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
            
          </div>

          {/* 5. Future AI Insights */}
          <AIInsightsPreview />
        </>
      )}
    </div>
  );
}

// Premium Skeleton State Loader Component
function AnalyticsSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full h-full animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="h-7 w-64 bg-slate-200 dark:bg-white/5 rounded-orbit-input mb-2" />
          <div className="h-4 w-96 bg-slate-200 dark:bg-white/5 rounded-orbit-input" />
        </div>
        <div className="h-10 w-80 bg-slate-200 dark:bg-white/5 rounded-orbit-input" />
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-44 bg-slate-200 dark:bg-white/5 rounded-orbit-card" />
        <div className="h-44 bg-slate-200 dark:bg-white/5 rounded-orbit-card" />
        <div className="h-44 bg-slate-200 dark:bg-white/5 rounded-orbit-card" />
      </div>

      {/* Charts & Insights Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-[320px] bg-slate-200 dark:bg-white/5 rounded-orbit-card" />
          <div className="h-[320px] bg-slate-200 dark:bg-white/5 rounded-orbit-card" />
          <div className="h-[320px] bg-slate-200 dark:bg-white/5 rounded-orbit-card" />
          <div className="h-[320px] bg-slate-200 dark:bg-white/5 rounded-orbit-card" />
        </div>
        <div className="h-full min-h-[320px] bg-slate-200 dark:bg-white/5 rounded-orbit-card" />
      </div>

      {/* AI Insights Skeleton */}
      <div className="h-64 bg-slate-200 dark:bg-white/5 rounded-orbit-card" />
    </div>
  );
}
