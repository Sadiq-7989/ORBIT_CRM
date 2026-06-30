import { supabase } from '../lib/supabase';

export interface Customer {
  id: string;
  owner_id?: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  source: string;
  notes: string;
  ai_summary?: string;
  created_at?: string;
  updated_at?: string;
}

export type CustomerInput = Omit<Customer, 'id' | 'owner_id' | 'created_at' | 'updated_at'>;

export const customerService = {
  // Fetch all customers belonging to the logged-in user
  async getCustomers(): Promise<Customer[]> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }
    return data || [];
  },

  // Create a new customer record
  async createCustomer(customer: CustomerInput): Promise<Customer> {
    const { data, error } = await supabase
      .from('customers')
      .insert([customer])
      .select()
      .single();

    if (error) {
      throw error;
    }
    return data;
  },

  // Update an existing customer record
  async updateCustomer(id: string, customer: Partial<CustomerInput>): Promise<Customer> {
    const { data, error } = await supabase
      .from('customers')
      .update({
        ...customer,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }
    return data;
  },

  // Delete a customer record
  async deleteCustomer(id: string): Promise<void> {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  },
};
