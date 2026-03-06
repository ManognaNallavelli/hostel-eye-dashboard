
-- Timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ==================== STUDENTS ====================
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  rfid_tag_id TEXT NOT NULL UNIQUE,
  room_number TEXT NOT NULL,
  phone TEXT,
  parent_phone TEXT,
  status TEXT NOT NULL DEFAULT 'inside' CHECK (status IN ('inside', 'outside')),
  last_entry_time TIMESTAMPTZ,
  last_exit_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view students" ON public.students FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert students" ON public.students FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update students" ON public.students FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete students" ON public.students FOR DELETE TO authenticated USING (true);

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_students_student_id ON public.students (student_id);
CREATE INDEX idx_students_name ON public.students (name);
CREATE INDEX idx_students_room ON public.students (room_number);
CREATE INDEX idx_students_status ON public.students (status);

-- ==================== ACCESS LOGS ====================
CREATE TABLE public.access_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT NOT NULL,
  name TEXT NOT NULL,
  rfid_tag_id TEXT,
  entry_time TIMESTAMPTZ,
  exit_time TIMESTAMPTZ,
  status TEXT NOT NULL CHECK (status IN ('inside', 'outside')),
  camera_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.access_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view access_logs" ON public.access_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert access_logs" ON public.access_logs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update access_logs" ON public.access_logs FOR UPDATE TO authenticated USING (true);

CREATE INDEX idx_access_logs_student_id ON public.access_logs (student_id);
CREATE INDEX idx_access_logs_status ON public.access_logs (status);
CREATE INDEX idx_access_logs_created_at ON public.access_logs (created_at);

-- ==================== ALERTS ====================
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_id TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('Unauthorized Entry', 'Crowd Limit Exceeded', 'Prolonged Absence', 'Emergency Tracking', 'Late Return', 'RFID Mismatch')),
  message TEXT NOT NULL,
  camera_id TEXT,
  student_id TEXT,
  location TEXT,
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'warning', 'info')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view alerts" ON public.alerts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert alerts" ON public.alerts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update alerts" ON public.alerts FOR UPDATE TO authenticated USING (true);

CREATE INDEX idx_alerts_type ON public.alerts (type);
CREATE INDEX idx_alerts_severity ON public.alerts (severity);
CREATE INDEX idx_alerts_status ON public.alerts (status);
CREATE INDEX idx_alerts_created_at ON public.alerts (created_at);

-- ==================== CAMERAS ====================
CREATE TABLE public.cameras (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  camera_id TEXT NOT NULL UNIQUE,
  location TEXT NOT NULL,
  stream_url TEXT,
  people_detected INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'online' CHECK (status IN ('online', 'offline')),
  last_updated TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.cameras ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view cameras" ON public.cameras FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert cameras" ON public.cameras FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update cameras" ON public.cameras FOR UPDATE TO authenticated USING (true);

-- ==================== EMERGENCY TRACKING ====================
CREATE TABLE public.emergency_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.emergency_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view emergency_tracking" ON public.emergency_tracking FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert emergency_tracking" ON public.emergency_tracking FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update emergency_tracking" ON public.emergency_tracking FOR UPDATE TO authenticated USING (true);

CREATE INDEX idx_emergency_student_id ON public.emergency_tracking (student_id);
CREATE INDEX idx_emergency_status ON public.emergency_tracking (status);

-- ==================== ACTIVITY FEED ====================
CREATE TABLE public.activity_feed (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_feed ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view activity_feed" ON public.activity_feed FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert activity_feed" ON public.activity_feed FOR INSERT TO authenticated WITH CHECK (true);

CREATE INDEX idx_activity_feed_created_at ON public.activity_feed (created_at);
