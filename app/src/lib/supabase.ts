import { createClient } from '@supabase/supabase-js';

// Read from environment variables, fallback to placeholders to avoid runtime crash on load
const rawUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
// Strip trailing /rest/v1/ or trailing slashes to prevent route errors
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
