import { supabase } from '../lib/supabase';

export interface Task {
  id: string;
  owner_id?: string;
  customer_id?: string | null;
  deal_id?: string | null;
  title: string;
  description?: string;
  priority: string; // Low, Medium, High
  status: string; // Pending, Completed
  due_date?: string;
  completed_at?: string | null;
  ai_summary?: string;
  created_at?: string;
  updated_at?: string;
  customers?: {
    name: string;
    company: string;
  } | null;
  deals?: {
    title: string;
  } | null;
}

export type TaskInput = Omit<Task, 'id' | 'owner_id' | 'created_at' | 'updated_at' | 'customers' | 'deals' | 'completed_at'>;

export const taskService = {
  // Fetch all tasks belonging to the user, joining customer & deal names
  async getTasks(): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*, customers (name, company), deals (title)')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }
    return data || [];
  },

  // Create a task record
  async createTask(task: TaskInput): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select('*, customers (name, company), deals (title)')
      .single();

    if (error) {
      throw error;
    }
    return data;
  },

  // Update a task record
  async updateTask(id: string, task: Partial<TaskInput> & { completed_at?: string | null }): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        ...task,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*, customers (name, company), deals (title)')
      .single();

    if (error) {
      throw error;
    }
    return data;
  },

  // Complete a task (toggle status to Completed or Pending)
  async toggleTaskCompletion(id: string, currentStatus: string): Promise<Task> {
    const isCompleting = currentStatus !== 'Completed';
    const updates = {
      status: isCompleting ? 'Completed' : 'Pending',
      completed_at: isCompleting ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select('*, customers (name, company), deals (title)')
      .single();

    if (error) {
      throw error;
    }
    return data;
  },

  // Delete a task record
  async deleteTask(id: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  },
};
