
-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'staff' CHECK (role IN ('admin', 'staff', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create institutions table
CREATE TABLE public.institutions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('TK', 'SD', 'SMP', 'SMA', 'MTQ', 'KEWIRAUSAHAAN')),
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  institution_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount DECIMAL(15,2) NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create budgets table for budget management
CREATE TABLE public.budgets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  institution_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  planned_amount DECIMAL(15,2) NOT NULL,
  actual_amount DECIMAL(15,2) DEFAULT 0,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Institutions policies (all authenticated users can view)
CREATE POLICY "Authenticated users can view institutions" ON public.institutions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage institutions" ON public.institutions
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Transactions policies
CREATE POLICY "Authenticated users can view transactions" ON public.transactions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Staff and admins can manage transactions" ON public.transactions
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')));

-- Budgets policies
CREATE POLICY "Authenticated users can view budgets" ON public.budgets
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Staff and admins can manage budgets" ON public.budgets
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')));

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email, 'staff');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert sample institutions
INSERT INTO public.institutions (name, type, description, color) VALUES
  ('TK Al-Hidayah', 'TK', 'Taman Kanak-kanak Al-Hidayah', '#3B82F6'),
  ('SD Al-Hidayah', 'SD', 'Sekolah Dasar Al-Hidayah', '#10B981'),
  ('SMP Al-Hidayah', 'SMP', 'Sekolah Menengah Pertama Al-Hidayah', '#F59E0B'),
  ('SMA Al-Hidayah', 'SMA', 'Sekolah Menengah Atas Al-Hidayah', '#8B5CF6'),
  ('MTQ Al-Hidayah', 'MTQ', 'Madrasah Tahfidz Al-Quran Al-Hidayah', '#F97316'),
  ('Unit Kewirausahaan', 'KEWIRAUSAHAAN', 'Unit Usaha Yayasan Al-Hidayah', '#EF4444');

-- Insert sample transactions
INSERT INTO public.transactions (institution_id, type, amount, description, category, date) VALUES
  ((SELECT id FROM public.institutions WHERE name = 'SD Al-Hidayah'), 'income', 25000000, 'SPP Bulan Januari', 'SPP', '2024-01-15'),
  ((SELECT id FROM public.institutions WHERE name = 'SMA Al-Hidayah'), 'expense', 15000000, 'Gaji Guru', 'Gaji', '2024-01-10'),
  ((SELECT id FROM public.institutions WHERE name = 'TK Al-Hidayah'), 'income', 12000000, 'Uang Pangkal Siswa Baru', 'Uang Pangkal', '2024-01-08'),
  ((SELECT id FROM public.institutions WHERE name = 'Unit Kewirausahaan'), 'income', 8000000, 'Penjualan Produk Kantin', 'Penjualan', '2024-01-12'),
  ((SELECT id FROM public.institutions WHERE name = 'SMP Al-Hidayah'), 'expense', 5000000, 'Pembelian Alat Tulis', 'Operasional', '2024-01-14');
