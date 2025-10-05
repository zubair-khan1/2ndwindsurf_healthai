-- Create health_reports table
CREATE TABLE IF NOT EXISTS health_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  file_url TEXT,
  analysis TEXT NOT NULL,
  family_member_name TEXT DEFAULT 'Self',
  relationship TEXT DEFAULT 'Self',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_health_reports_user_id ON health_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_health_reports_created_at ON health_reports(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE health_reports ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own reports
CREATE POLICY "Users can view their own reports" ON health_reports
  FOR SELECT
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Create policy to allow inserting reports
CREATE POLICY "Anyone can insert reports" ON health_reports
  FOR INSERT
  WITH CHECK (true);

-- Create storage bucket for health report files
INSERT INTO storage.buckets (id, name, public)
VALUES ('health-reports', 'health-reports', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for uploading files
CREATE POLICY "Anyone can upload health reports" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'health-reports');

-- Create storage policy for downloading files
CREATE POLICY "Users can download their own reports" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'health-reports');
