-- Add status column to reports table to support draft functionality
ALTER TABLE public.reports 
ADD COLUMN status text NOT NULL DEFAULT 'submitted' 
CHECK (status IN ('draft', 'submitted'));

-- Create index for better performance when filtering by status
CREATE INDEX idx_reports_status ON public.reports(status);

-- Update existing reports to have 'submitted' status
UPDATE public.reports SET status = 'submitted' WHERE status IS NULL;

-- Add RLS policy for drafts (users can only see their own drafts, but submitted reports are public)
-- Note: This assumes user authentication will be implemented later
-- For now, all reports remain publicly viewable as per existing policy