import { supabase } from '../lib/supabase';

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  module: string;
  description: string;
  created_at: string;
}

// LocalStorage fallback helpers to mirror / run offline when Supabase does not have the table yet
const LOCAL_STORAGE_KEY = 'orbit_audit_logs';

function getLocalLogs(): AuditLog[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveLocalLogs(logs: AuditLog[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(logs));
  } catch (e) {
    console.error(e);
  }
}

export const auditService = {
  // Logs activity both locally and to Supabase
  async logActivity(action: string, module: string, description: string): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || 'local-user';

      const newLog = {
        action,
        module,
        description,
        user_id: userId,
      };

      // Try inserting into Supabase
      const { error } = await supabase.from('audit_logs').insert([newLog]);
      
      // Always write to localStorage as local fallback/mirror
      const localLogs = getLocalLogs();
      const fullLog: AuditLog = {
        id: crypto.randomUUID(),
        ...newLog,
        created_at: new Date().toISOString()
      };
      saveLocalLogs([fullLog, ...localLogs]);

      if (error) {
        console.warn('Supabase logging failed, fell back to local storage:', error.message);
      }
    } catch (err) {
      console.error('Failed to log activity:', err);
    }
  },

  // Fetches audit logs, falling back to localStorage if table doesn't exist
  async getAuditLogs(filters?: { timeRange?: string; module?: string; search?: string }): Promise<AuditLog[]> {
    try {
      let query = supabase.from('audit_logs').select('*').order('created_at', { ascending: false });

      if (filters?.module && filters.module !== 'All') {
        query = query.eq('module', filters.module);
      }

      if (filters?.timeRange) {
        const now = new Date();
        if (filters.timeRange === 'Today') {
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
          query = query.gte('created_at', today);
        } else if (filters.timeRange === 'Last 7 Days') {
          const last7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
          query = query.gte('created_at', last7);
        } else if (filters.timeRange === 'Last 30 Days') {
          const last30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
          query = query.gte('created_at', last30);
        }
      }

      if (filters?.search) {
        query = query.ilike('description', `%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) {
        throw error;
      }
      return data || [];
    } catch (err) {
      console.warn('Supabase fetch failed, loading from local storage fallback:', err);
      // Fallback filtering on local storage logs
      let logs = getLocalLogs();

      if (filters?.module && filters.module !== 'All') {
        logs = logs.filter(l => l.module === filters.module);
      }

      if (filters?.timeRange) {
        const now = new Date();
        let cutoff = new Date(0);
        if (filters.timeRange === 'Today') {
          cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        } else if (filters.timeRange === 'Last 7 Days') {
          cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else if (filters.timeRange === 'Last 30 Days') {
          cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }
        logs = logs.filter(l => new Date(l.created_at) >= cutoff);
      }

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        logs = logs.filter(l => l.description.toLowerCase().includes(searchLower) || l.action.toLowerCase().includes(searchLower));
      }

      return logs;
    }
  }
};
