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
};
