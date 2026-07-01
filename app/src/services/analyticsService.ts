import { supabase } from '../lib/supabase';

export interface DashboardStats {
  totalCustomers: number;
  totalDeals: number;
  pipelineValue: number;
  openTasks: number;
  completedTasks: number;
}

export interface ActivityItem {
  id: string;
  type: 'customer' | 'deal' | 'task';
  content: string;
  created_at: string;
}

export interface UpcomingTask {
  id: string;
  title: string;
  due_date?: string;
  priority: string;
  customers?: {
    name: string;
  } | null;
}

export interface RevenueAnalytics {
  totalRevenue: number;
  pipelineValue: number;
  averageDealValue: number;
  wonDealsCount: number;
  growthRate: number;
  monthlyTrends: Array<{
    month: string;
    revenue: number;
    pipeline: number;
  }>;
  recentWonDeals: Array<{
    id: string;
    title: string;
    value: number;
    customerName?: string;
    closedAt: string;
  }>;
}

export interface CustomerAnalytics {
  totalCustomers: number;
  newCustomers: number;
  growthRate: number;
  sourceBreakdown: Array<{
    source: string;
    count: number;
  }>;
  statusBreakdown: Array<{
    status: string;
    count: number;
  }>;
  growthTrends: Array<{
    month: string;
    count: number;
  }>;
}

export interface TaskAnalytics {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
  overdueTasks: number;
  priorityBreakdown: Array<{
    priority: string;
    count: number;
    completed: number;
    pending: number;
  }>;
  completionTrends: Array<{
    month: string;
    completed: number;
    created: number;
  }>;
}

export interface PipelineStageAnalytics {
  stage: string;
  value: number;
  count: number;
  averageProbability: number;
}

function getPeriodStatus(dateStr: string | Date | undefined, timeRange: string): 'current' | 'previous' | 'outside' {
  if (!dateStr) return 'outside';
  const date = new Date(dateStr);
  const now = new Date();
  
  if (timeRange === 'all') {
    return 'current';
  }
  
  if (timeRange === '30d') {
    const currentLimit = new Date();
    currentLimit.setDate(now.getDate() - 30);
    const previousLimit = new Date();
    previousLimit.setDate(now.getDate() - 60);
    
    if (date >= currentLimit) return 'current';
    if (date >= previousLimit) return 'previous';
    return 'outside';
  }
  
  if (timeRange === '90d') {
    const currentLimit = new Date();
    currentLimit.setDate(now.getDate() - 90);
    const previousLimit = new Date();
    previousLimit.setDate(now.getDate() - 180);
    
    if (date >= currentLimit) return 'current';
    if (date >= previousLimit) return 'previous';
    return 'outside';
  }
  
  if (timeRange === 'ytd') {
    const currentLimit = new Date(now.getFullYear(), 0, 1);
    const previousLimit = new Date(now.getFullYear() - 1, 0, 1);
    
    if (date >= currentLimit) return 'current';
    if (date >= previousLimit && date < currentLimit) return 'previous';
    return 'outside';
  }
  
  return 'outside';
}

export const analyticsService = {
  // Return key overview stats count for the dashboard KPICards
  async getDashboardStats(): Promise<DashboardStats> {
    const [customersRes, dealsRes, dealsValRes, openTasksRes, completedTasksRes] = await Promise.all([
      supabase.from('customers').select('id', { count: 'exact', head: true }),
      supabase.from('deals').select('id', { count: 'exact', head: true }),
      supabase.from('deals').select('value'),
      supabase.from('tasks').select('id', { count: 'exact', head: true }).neq('status', 'Completed'),
      supabase.from('tasks').select('id', { count: 'exact', head: true }).eq('status', 'Completed'),
    ]);

    if (customersRes.error) throw customersRes.error;
    if (dealsRes.error) throw dealsRes.error;
    if (dealsValRes.error) throw dealsValRes.error;
    if (openTasksRes.error) throw openTasksRes.error;
    if (completedTasksRes.error) throw completedTasksRes.error;

    const pipelineValue = (dealsValRes.data || []).reduce((sum, d) => sum + Number(d.value || 0), 0);

    return {
      totalCustomers: customersRes.count || 0,
      totalDeals: dealsRes.count || 0,
      pipelineValue,
      openTasks: openTasksRes.count || 0,
      completedTasks: completedTasksRes.count || 0,
    };
  },

  // Return deal stages total values grouped by column stage for the SalesOverview progress bar
  async getPipelineStats(): Promise<Record<string, number>> {
    const { data, error } = await supabase
      .from('deals')
      .select('value, stage');

    if (error) {
      throw error;
    }

    const stages = ['Lead', 'Contacted', 'Negotiation', 'Won', 'Lost'];
    const stats = stages.reduce((acc, stage) => {
      acc[stage] = 0;
      return acc;
    }, {} as Record<string, number>);

    (data || []).forEach((deal) => {
      const stage = deal.stage || 'Lead';
      if (stages.includes(stage)) {
        stats[stage] += Number(deal.value || 0);
      }
    });

    return stats;
  },

  // Return a unified timeline of recent additions/updates across all database collections
  async getRecentActivities(): Promise<ActivityItem[]> {
    const [customersRes, dealsRes, tasksRes] = await Promise.all([
      supabase.from('customers').select('id, name, company, created_at').order('created_at', { ascending: false }).limit(5),
      supabase.from('deals').select('id, title, created_at, customers (name)').order('created_at', { ascending: false }).limit(5),
      supabase.from('tasks').select('id, title, status, created_at, updated_at').order('created_at', { ascending: false }).limit(5),
    ]);

    if (customersRes.error) throw customersRes.error;
    if (dealsRes.error) throw dealsRes.error;
    if (tasksRes.error) throw tasksRes.error;

    const activities: ActivityItem[] = [];

    // Map customer additions
    (customersRes.data || []).forEach((c) => {
      activities.push({
        id: `c-${c.id}`,
        type: 'customer',
        content: `New customer **${c.name}** was added to Customer directory${c.company ? ` under ${c.company}` : ''}`,
        created_at: c.created_at || new Date().toISOString(),
      });
    });

    // Map deal creation
    (dealsRes.data || []).forEach((d) => {
      const customerName = (d as any).customers?.name;
      activities.push({
        id: `d-${d.id}`,
        type: 'deal',
        content: `Deal **${d.title}** was opened${customerName ? ` for customer ${customerName}` : ''}`,
        created_at: d.created_at || new Date().toISOString(),
      });
    });

    // Map task creation or completion
    (tasksRes.data || []).forEach((t) => {
      const isCompleted = t.status === 'Completed';
      activities.push({
        id: `t-${t.id}`,
        type: 'task',
        content: isCompleted 
          ? `Task **${t.title}** was marked as completed`
          : `New task **${t.title}** was created in Checklist`,
        created_at: isCompleted ? (t.updated_at || t.created_at || new Date().toISOString()) : (t.created_at || new Date().toISOString()),
      });
    });

    // Sort by timestamp descending
    return activities
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
  },

  // Return upcoming pending tasks sorted by due_date
  async getUpcomingTasks(): Promise<UpcomingTask[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('id, title, due_date, priority, customers (name)')
      .neq('status', 'Completed')
      .order('due_date', { ascending: true, nullsFirst: false })
      .limit(5);

    if (error) {
      throw error;
    }

    return (data || []) as any as UpcomingTask[];
  },

  async getRevenueAnalytics(timeRange: string = '30d'): Promise<RevenueAnalytics> {
    const { data, error } = await supabase
      .from('deals')
      .select('id, title, value, stage, created_at, expected_close, updated_at, customers (name)');

    if (error) throw error;

    const deals = data || [];
    
    let currentWonRevenue = 0;
    let previousWonRevenue = 0;
    let currentTotalValue = 0;
    let currentDealsCount = 0;
    let currentWonCount = 0;
    let pipelineValue = 0;

    deals.forEach((d) => {
      const date = d.created_at;
      const status = getPeriodStatus(date, timeRange);
      const isWon = d.stage === 'Won';
      const isOpen = d.stage !== 'Won' && d.stage !== 'Lost';
      const val = Number(d.value || 0);

      if (status === 'current') {
        currentDealsCount++;
        currentTotalValue += val;
        if (isWon) {
          currentWonRevenue += val;
          currentWonCount++;
        } else if (isOpen) {
          pipelineValue += val;
        }
      } else if (status === 'previous') {
        if (isWon) {
          previousWonRevenue += val;
        }
      }
    });

    const averageDealValue = currentDealsCount > 0 ? currentTotalValue / currentDealsCount : 0;

    let growthRate = 0;
    if (previousWonRevenue > 0) {
      growthRate = ((currentWonRevenue - previousWonRevenue) / previousWonRevenue) * 100;
    } else if (currentWonRevenue > 0) {
      growthRate = 100;
    }

    const monthlyTrendsMap: Record<string, { revenue: number; pipeline: number }> = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${months[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
      monthlyTrendsMap[key] = { revenue: 0, pipeline: 0 };
    }

    deals.forEach((d) => {
      const date = new Date(d.created_at);
      const key = `${months[date.getMonth()]} ${date.getFullYear().toString().slice(-2)}`;
      const val = Number(d.value || 0);
      const isWon = d.stage === 'Won';
      const isOpen = d.stage !== 'Won' && d.stage !== 'Lost';

      if (monthlyTrendsMap[key]) {
        if (isWon) {
          monthlyTrendsMap[key].revenue += val;
        } else if (isOpen) {
          monthlyTrendsMap[key].pipeline += val;
        }
      }
    });

    const monthlyTrends = Object.entries(monthlyTrendsMap).map(([month, stats]) => ({
      month,
      revenue: stats.revenue,
      pipeline: stats.pipeline,
    }));

    const recentWonDeals = deals
      .filter((d) => d.stage === 'Won' && getPeriodStatus(d.created_at, timeRange) === 'current')
      .sort((a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime())
      .slice(0, 5)
      .map((d) => ({
        id: d.id,
        title: d.title,
        value: Number(d.value || 0),
        customerName: (d as any).customers?.name || undefined,
        closedAt: d.updated_at || d.created_at,
      }));

    return {
      totalRevenue: currentWonRevenue,
      pipelineValue,
      averageDealValue,
      wonDealsCount: currentWonCount,
      growthRate,
      monthlyTrends,
      recentWonDeals,
    };
  },

  async getCustomerAnalytics(timeRange: string = '30d'): Promise<CustomerAnalytics> {
    const { data, error } = await supabase
      .from('customers')
      .select('id, created_at, source, status');

    if (error) throw error;

    const customers = data || [];
    
    let currentNewCustomers = 0;
    let previousNewCustomers = 0;

    const sourceMap: Record<string, number> = {};
    const statusMap: Record<string, number> = {};

    customers.forEach((c) => {
      const status = getPeriodStatus(c.created_at, timeRange);
      const src = c.source || 'Other';
      const st = c.status || 'Lead';

      if (status === 'current') {
        currentNewCustomers++;
        sourceMap[src] = (sourceMap[src] || 0) + 1;
        statusMap[st] = (statusMap[st] || 0) + 1;
      } else if (status === 'previous') {
        previousNewCustomers++;
      }
    });

    let growthRate = 0;
    if (previousNewCustomers > 0) {
      growthRate = ((currentNewCustomers - previousNewCustomers) / previousNewCustomers) * 100;
    } else if (currentNewCustomers > 0) {
      growthRate = 100;
    }

    const sourceBreakdown = Object.entries(sourceMap).map(([source, count]) => ({ source, count }));
    const statusBreakdown = Object.entries(statusMap).map(([status, count]) => ({ status, count }));

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const trendMonths: Array<{ key: string; dateLimit: Date }> = [];
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${months[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
      const limit = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
      trendMonths.push({ key, dateLimit: limit });
    }

    const growthTrends = trendMonths.map(({ key, dateLimit }) => {
      const count = customers.filter((c) => new Date(c.created_at) <= dateLimit).length;
      return { month: key, count };
    });

    return {
      totalCustomers: customers.length,
      newCustomers: currentNewCustomers,
      growthRate,
      sourceBreakdown,
      statusBreakdown,
      growthTrends,
    };
  },

  async getTaskAnalytics(timeRange: string = '30d'): Promise<TaskAnalytics> {
    const { data, error } = await supabase
      .from('tasks')
      .select('id, status, priority, due_date, completed_at, created_at');

    if (error) throw error;

    const tasks = data || [];
    
    let totalTasks = 0;
    let completedTasks = 0;
    let overdueTasks = 0;

    const priorityMap: Record<string, { completed: number; pending: number; count: number }> = {
      High: { completed: 0, pending: 0, count: 0 },
      Medium: { completed: 0, pending: 0, count: 0 },
      Low: { completed: 0, pending: 0, count: 0 },
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    tasks.forEach((t) => {
      const status = getPeriodStatus(t.created_at, timeRange);
      if (status === 'current') {
        totalTasks++;
        const isCompleted = t.status === 'Completed';
        if (isCompleted) {
          completedTasks++;
        }
        
        const prio = t.priority || 'Medium';
        if (prio === 'High' || prio === 'Medium' || prio === 'Low') {
          priorityMap[prio].count++;
          if (isCompleted) {
            priorityMap[prio].completed++;
          } else {
            priorityMap[prio].pending++;
          }
        }

        if (!isCompleted && t.due_date) {
          const dueDate = new Date(t.due_date);
          if (dueDate < today) {
            overdueTasks++;
          }
        }
      }
    });

    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const priorityBreakdown = Object.entries(priorityMap).map(([priority, stats]) => ({
      priority,
      count: stats.count,
      completed: stats.completed,
      pending: stats.pending,
    }));

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const trendMonthsMap: Record<string, { completed: number; created: number }> = {};

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${months[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
      trendMonthsMap[key] = { completed: 0, created: 0 };
    }

    tasks.forEach((t) => {
      const createdDate = new Date(t.created_at);
      const createdKey = `${months[createdDate.getMonth()]} ${createdDate.getFullYear().toString().slice(-2)}`;
      if (trendMonthsMap[createdKey]) {
        trendMonthsMap[createdKey].created++;
      }

      if (t.status === 'Completed' && t.completed_at) {
        const compDate = new Date(t.completed_at);
        const compKey = `${months[compDate.getMonth()]} ${compDate.getFullYear().toString().slice(-2)}`;
        if (trendMonthsMap[compKey]) {
          trendMonthsMap[compKey].completed++;
        }
      }
    });

    const completionTrends = Object.entries(trendMonthsMap).map(([month, counts]) => ({
      month,
      completed: counts.completed,
      created: counts.created,
    }));

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate,
      overdueTasks,
      priorityBreakdown,
      completionTrends,
    };
  },

  async getPipelineAnalytics(): Promise<PipelineStageAnalytics[]> {
    const { data, error } = await supabase
      .from('deals')
      .select('stage, value, probability');

    if (error) throw error;

    const deals = data || [];
    const stages = ['Lead', 'Contacted', 'Negotiation', 'Won', 'Lost'];
    
    const stageStatsMap = stages.reduce((acc, stage) => {
      acc[stage] = { value: 0, count: 0, probSum: 0 };
      return acc;
    }, {} as Record<string, { value: number; count: number; probSum: number }>);

    deals.forEach((d) => {
      const stage = d.stage || 'Lead';
      if (stageStatsMap[stage]) {
        stageStatsMap[stage].value += Number(d.value || 0);
        stageStatsMap[stage].count += 1;
        stageStatsMap[stage].probSum += Number(d.probability || 0);
      }
    });

    return stages.map((stage) => {
      const stats = stageStatsMap[stage];
      return {
        stage,
        value: stats.value,
        count: stats.count,
        averageProbability: stats.count > 0 ? stats.probSum / stats.count : 0,
      };
    });
  },
};
