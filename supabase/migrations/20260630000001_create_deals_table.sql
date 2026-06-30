-- Create deals table
CREATE TABLE IF NOT EXISTS public.deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    value NUMERIC DEFAULT 0,
    stage TEXT DEFAULT 'Lead',
    probability INTEGER DEFAULT 10,
    expected_close DATE,
    notes TEXT,
    ai_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view their own deals" 
    ON public.deals FOR SELECT 
    TO authenticated
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert their own deals" 
    ON public.deals FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own deals" 
    ON public.deals FOR UPDATE 
    TO authenticated
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own deals" 
    ON public.deals FOR DELETE 
    TO authenticated
    USING (auth.uid() = owner_id);

-- Create Indexes for Query Performance
CREATE INDEX IF NOT EXISTS idx_deals_owner_id ON public.deals(owner_id);
CREATE INDEX IF NOT EXISTS idx_deals_customer_id ON public.deals(customer_id);

-- Trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_deals_updated
    BEFORE UPDATE ON public.deals
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.deals
TO authenticated;

GRANT USAGE
ON SCHEMA public
TO authenticated;
