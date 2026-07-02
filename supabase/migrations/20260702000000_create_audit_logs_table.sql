-- Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    action TEXT NOT NULL,
    module TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view their own audit logs" 
    ON public.audit_logs FOR SELECT 
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own audit logs" 
    ON public.audit_logs FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Improve query performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id
ON public.audit_logs(user_id);

-- trigger log customer activity
CREATE OR REPLACE FUNCTION public.log_customer_activity()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO public.audit_logs (user_id, action, module, description)
        VALUES (COALESCE(auth.uid(), NEW.owner_id), 'Customer Created', 'Customers', 'Customer "' || NEW.name || '" was added.');
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO public.audit_logs (user_id, action, module, description)
        VALUES (COALESCE(auth.uid(), NEW.owner_id), 'Customer Updated', 'Customers', 'Customer "' || NEW.name || '" was updated.');
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO public.audit_logs (user_id, action, module, description)
        VALUES (COALESCE(auth.uid(), OLD.owner_id), 'Customer Deleted', 'Customers', 'Customer "' || OLD.name || '" was deleted.');
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER trigger_log_customer_activity
AFTER INSERT OR UPDATE OR DELETE ON public.customers
FOR EACH ROW EXECUTE FUNCTION public.log_customer_activity();

-- trigger log deal activity
CREATE OR REPLACE FUNCTION public.log_deal_activity()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO public.audit_logs (user_id, action, module, description)
        VALUES (COALESCE(auth.uid(), NEW.owner_id), 'Deal Created', 'Deals', 'Deal "' || NEW.title || '" was created.');
    ELSIF (TG_OP = 'UPDATE') THEN
        IF (NEW.stage <> OLD.stage) THEN
            INSERT INTO public.audit_logs (user_id, action, module, description)
            VALUES (COALESCE(auth.uid(), NEW.owner_id), 'Deal Stage Changed', 'Deals', 'Deal "' || NEW.title || '" stage changed to "' || NEW.stage || '".');
        ELSE
            INSERT INTO public.audit_logs (user_id, action, module, description)
            VALUES (COALESCE(auth.uid(), NEW.owner_id), 'Deal Updated', 'Deals', 'Deal "' || NEW.title || '" was updated.');
        END IF;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO public.audit_logs (user_id, action, module, description)
        VALUES (COALESCE(auth.uid(), OLD.owner_id), 'Deal Deleted', 'Deals', 'Deal "' || OLD.title || '" was deleted.');
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER trigger_log_deal_activity
AFTER INSERT OR UPDATE OR DELETE ON public.deals
FOR EACH ROW EXECUTE FUNCTION public.log_deal_activity();

-- trigger log task activity
CREATE OR REPLACE FUNCTION public.log_task_activity()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO public.audit_logs (user_id, action, module, description)
        VALUES (COALESCE(auth.uid(), NEW.owner_id), 'Task Created', 'Tasks', 'Task "' || NEW.title || '" was created.');
    ELSIF (TG_OP = 'UPDATE') THEN
        IF (NEW.status = 'Completed' AND OLD.status <> 'Completed') THEN
            INSERT INTO public.audit_logs (user_id, action, module, description)
            VALUES (COALESCE(auth.uid(), NEW.owner_id), 'Task Completed', 'Tasks', 'Task "' || NEW.title || '" was completed.');
        ELSE
            INSERT INTO public.audit_logs (user_id, action, module, description)
            VALUES (COALESCE(auth.uid(), NEW.owner_id), 'Task Updated', 'Tasks', 'Task "' || NEW.title || '" was updated.');
        END IF;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO public.audit_logs (user_id, action, module, description)
        VALUES (COALESCE(auth.uid(), OLD.owner_id), 'Task Deleted', 'Tasks', 'Task "' || OLD.title || '" was deleted.');
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER trigger_log_task_activity
AFTER INSERT OR UPDATE OR DELETE ON public.tasks
FOR EACH ROW EXECUTE FUNCTION public.log_task_activity();
