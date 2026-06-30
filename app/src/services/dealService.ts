import { supabase } from '../lib/supabase';

export interface Deal {
  id: string;
  owner_id?: string;
  customer_id: string;
  title: string;
  value: number;
  stage: string;
  probability: number;
  expected_close?: string;
  notes?: string;
  ai_summary?: string;
  created_at?: string;
  updated_at?: string;
  customers?: {
    name: string;
    company: string;
  } | null;
}

export type DealInput = Omit<Deal, 'id' | 'owner_id' | 'created_at' | 'updated_at' | 'customers'>;

export const dealService = {
  // Fetch all deals, joining customer information
  async getDeals(): Promise<Deal[]> {
    const { data, error } = await supabase
      .from('deals')
      .select('*, customers (name, company)')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }
    return data || [];
  },

  // Create a new deal record
  async createDeal(deal: DealInput): Promise<Deal> {
    const { data, error } = await supabase
      .from('deals')
      .insert([deal])
      .select('*, customers (name, company)')
      .single();

    if (error) {
      throw error;
    }
    return data;
  },

  // Update an existing deal record (including changing stage/drag-and-drop)
  async updateDeal(id: string, deal: Partial<DealInput>): Promise<Deal> {
    const { data, error } = await supabase
      .from('deals')
      .update({
        ...deal,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*, customers (name, company)')
      .single();

    if (error) {
      throw error;
    }
    return data;
  },

  // Delete a deal record
  async deleteDeal(id: string): Promise<void> {
    const { error } = await supabase
      .from('deals')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  },
};
