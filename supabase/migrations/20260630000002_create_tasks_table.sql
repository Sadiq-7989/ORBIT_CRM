-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    deal_id UUID REFERENCES public.deals(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT DEFAULT 'Medium',
    status TEXT DEFAULT 'Pending',
    due_date DATE,
    completed_at TIMESTAMP WITH TIME ZONE,
    ai_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view their own tasks" 
    ON public.tasks FOR SELECT 
    TO authenticated
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert their own tasks" 
    ON public.tasks FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own tasks" 
    ON public.tasks FOR UPDATE 
    TO authenticated
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own tasks" 
    ON public.tasks FOR DELETE 
    TO authenticated
    USING (auth.uid() = owner_id);

-- Create Indexes for Query Performance
CREATE INDEX IF NOT EXISTS idx_tasks_owner_id ON public.tasks(owner_id);
CREATE INDEX IF NOT EXISTS idx_tasks_customer_id ON public.tasks(customer_id);
CREATE INDEX IF NOT EXISTS idx_tasks_deal_id ON public.tasks(deal_id);

-- Trigger to automatically update updated_at timestamp
CREATE TRIGGER on_tasks_updated
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.tasks
TO authenticated;

GRANT USAGE
ON SCHEMA public
TO authenticated;
