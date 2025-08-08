
-- Students master data
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id VARCHAR(20) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  class_grade VARCHAR(10) NOT NULL,
  institution_id UUID REFERENCES public.institutions(id) NOT NULL,
  parent_name VARCHAR(255),
  parent_phone VARCHAR(20),
  address TEXT,
  enrollment_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SPP (School Fee) Structure
CREATE TABLE public.spp_structure (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID REFERENCES public.institutions(id) NOT NULL,
  class_grade VARCHAR(10) NOT NULL,
  monthly_amount NUMERIC(15,2) NOT NULL,
  academic_year VARCHAR(10) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SPP Payments
CREATE TABLE public.spp_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) NOT NULL,
  spp_structure_id UUID REFERENCES public.spp_structure(id) NOT NULL,
  payment_month INTEGER NOT NULL CHECK (payment_month BETWEEN 1 AND 12),
  payment_year INTEGER NOT NULL,
  amount_paid NUMERIC(15,2) NOT NULL,
  payment_date DATE DEFAULT CURRENT_DATE,
  payment_method VARCHAR(20) DEFAULT 'cash' CHECK (payment_method IN ('cash', 'transfer', 'other')),
  receipt_number VARCHAR(50),
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, payment_month, payment_year)
);

-- Cash and Bank Accounts
CREATE TABLE public.cash_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_name VARCHAR(255) NOT NULL,
  account_type VARCHAR(20) NOT NULL CHECK (account_type IN ('cash', 'bank', 'savings')),
  institution_id UUID REFERENCES public.institutions(id) NOT NULL,
  account_number VARCHAR(50),
  bank_name VARCHAR(100),
  current_balance NUMERIC(15,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cash Flows
CREATE TABLE public.cash_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cash_account_id UUID REFERENCES public.cash_accounts(id) NOT NULL,
  transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('inflow', 'outflow', 'transfer')),
  amount NUMERIC(15,2) NOT NULL,
  description TEXT NOT NULL,
  reference_number VARCHAR(50),
  transaction_date DATE DEFAULT CURRENT_DATE,
  category VARCHAR(100),
  related_transaction_id UUID REFERENCES public.transactions(id),
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Financial Reports Templates
CREATE TABLE public.report_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  report_type VARCHAR(50) NOT NULL,
  template_config JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Trail
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  action_type VARCHAR(50) NOT NULL,
  table_name VARCHAR(100),
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Public Transparency Reports
CREATE TABLE public.transparency_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  report_period VARCHAR(50) NOT NULL,
  report_type VARCHAR(50) NOT NULL,
  content JSONB NOT NULL,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  institution_id UUID REFERENCES public.institutions(id),
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Advanced Budget Planning
CREATE TABLE public.budget_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  parent_id UUID REFERENCES public.budget_categories(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.budget_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID REFERENCES public.institutions(id) NOT NULL,
  budget_year INTEGER NOT NULL,
  budget_category_id UUID REFERENCES public.budget_categories(id) NOT NULL,
  planned_amount NUMERIC(15,2) NOT NULL,
  allocated_amount NUMERIC(15,2) DEFAULT 0,
  actual_amount NUMERIC(15,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'active', 'completed')),
  approved_by UUID REFERENCES public.profiles(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory Management
CREATE TABLE public.inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_code VARCHAR(50) UNIQUE NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  unit VARCHAR(20) NOT NULL,
  current_stock INTEGER DEFAULT 0,
  minimum_stock INTEGER DEFAULT 0,
  unit_price NUMERIC(15,2) DEFAULT 0,
  institution_id UUID REFERENCES public.institutions(id) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.inventory_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_item_id UUID REFERENCES public.inventory_items(id) NOT NULL,
  movement_type VARCHAR(20) NOT NULL CHECK (movement_type IN ('in', 'out', 'adjustment')),
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(15,2),
  total_value NUMERIC(15,2),
  reference_number VARCHAR(50),
  notes TEXT,
  transaction_date DATE DEFAULT CURRENT_DATE,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all new tables
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spp_structure ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spp_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cash_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cash_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transparency_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for students
CREATE POLICY "Authenticated users can view students" ON public.students
  FOR SELECT USING (true);
  
CREATE POLICY "Staff and admins can manage students" ON public.students
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

-- Create RLS policies for SPP
CREATE POLICY "Authenticated users can view spp_structure" ON public.spp_structure
  FOR SELECT USING (true);
  
CREATE POLICY "Staff and admins can manage spp_structure" ON public.spp_structure
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Authenticated users can view spp_payments" ON public.spp_payments
  FOR SELECT USING (true);
  
CREATE POLICY "Staff and admins can manage spp_payments" ON public.spp_payments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

-- Create RLS policies for cash management
CREATE POLICY "Authenticated users can view cash_accounts" ON public.cash_accounts
  FOR SELECT USING (true);
  
CREATE POLICY "Staff and admins can manage cash_accounts" ON public.cash_accounts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Authenticated users can view cash_flows" ON public.cash_flows
  FOR SELECT USING (true);
  
CREATE POLICY "Staff and admins can manage cash_flows" ON public.cash_flows
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

-- Create RLS policies for other tables (similar pattern)
CREATE POLICY "Admins can view all audit_logs" ON public.audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "All users can view published transparency_reports" ON public.transparency_reports
  FOR SELECT USING (is_published = true OR EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'staff')
  ));

CREATE POLICY "Staff and admins can manage transparency_reports" ON public.transparency_reports
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

-- Create policies for budget and inventory tables (similar pattern)
CREATE POLICY "Authenticated users can view budget_categories" ON public.budget_categories
  FOR SELECT USING (true);
  
CREATE POLICY "Staff and admins can manage budget_categories" ON public.budget_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Authenticated users can view budget_plans" ON public.budget_plans
  FOR SELECT USING (true);
  
CREATE POLICY "Staff and admins can manage budget_plans" ON public.budget_plans
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Authenticated users can view inventory" ON public.inventory_items
  FOR SELECT USING (true);
  
CREATE POLICY "Staff and admins can manage inventory" ON public.inventory_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Authenticated users can view inventory_movements" ON public.inventory_movements
  FOR SELECT USING (true);
  
CREATE POLICY "Staff and admins can manage inventory_movements" ON public.inventory_movements
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

-- Create report_templates policies
CREATE POLICY "Authenticated users can view report_templates" ON public.report_templates
  FOR SELECT USING (true);
  
CREATE POLICY "Staff and admins can manage report_templates" ON public.report_templates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_students_institution_id ON public.students(institution_id);
CREATE INDEX idx_students_student_id ON public.students(student_id);
CREATE INDEX idx_spp_payments_student_id ON public.spp_payments(student_id);
CREATE INDEX idx_spp_payments_month_year ON public.spp_payments(payment_month, payment_year);
CREATE INDEX idx_cash_flows_account_id ON public.cash_flows(cash_account_id);
CREATE INDEX idx_cash_flows_date ON public.cash_flows(transaction_date);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Insert sample budget categories
INSERT INTO public.budget_categories (name) VALUES 
  ('Operasional'),
  ('Gaji dan Tunjangan'),
  ('Sarana dan Prasarana'),
  ('Kegiatan Siswa'),
  ('Pemeliharaan'),
  ('Administrasi'),
  ('Pengembangan');
