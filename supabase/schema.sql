-- ============================================================
-- Charity Agutu Martha – Portfolio Platform Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL DEFAULT 'Charity Agutu Martha',
  professional_title TEXT NOT NULL DEFAULT 'Data Scientist & Machine Learning Practitioner',
  tagline TEXT NOT NULL DEFAULT 'Transforming complex datasets into actionable insights through machine learning, predictive analytics, and business intelligence.',
  bio TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  location TEXT DEFAULT 'Nairobi, Kenya',
  profile_image_url TEXT,
  resume_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SKILLS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('programming','data_science','machine_learning','visualization','business_intelligence','other')),
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PROJECTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  problem_statement TEXT,
  methodology TEXT,
  results TEXT,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  github_url TEXT,
  live_url TEXT,
  image_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- EXPERIENCE TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization TEXT NOT NULL,
  position TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN NOT NULL DEFAULT false,
  description TEXT NOT NULL DEFAULT '',
  achievements TEXT[] NOT NULL DEFAULT '{}',
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CERTIFICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  institution TEXT NOT NULL,
  date_earned DATE NOT NULL,
  credential_url TEXT,
  pdf_url TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MESSAGES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MEDIA TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL DEFAULT 0,
  category TEXT NOT NULL CHECK (category IN ('profile_images','project_images','certificates','documents','gallery')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Public read access for portfolio data
CREATE POLICY "Public can read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public can read skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Public can read published projects" ON projects FOR SELECT USING (is_archived = false);
CREATE POLICY "Public can read experience" ON experience FOR SELECT USING (true);
CREATE POLICY "Public can read certifications" ON certifications FOR SELECT USING (true);
CREATE POLICY "Public can insert messages" ON messages FOR INSERT WITH CHECK (true);

-- Admin full access (authenticated users)
CREATE POLICY "Admin manages profiles" ON profiles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manages skills" ON skills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manages projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manages experience" ON experience FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manages certifications" ON certifications FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manages messages" ON messages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manages media" ON media FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
INSERT INTO storage.buckets (id, name, public) VALUES
  ('profile-images', 'profile-images', true),
  ('project-images', 'project-images', true),
  ('certificates', 'certificates', true),
  ('resumes', 'resumes', true),
  ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public read profile-images" ON storage.objects FOR SELECT USING (bucket_id = 'profile-images');
CREATE POLICY "Auth upload profile-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'profile-images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth delete profile-images" ON storage.objects FOR DELETE USING (bucket_id = 'profile-images' AND auth.role() = 'authenticated');

CREATE POLICY "Public read project-images" ON storage.objects FOR SELECT USING (bucket_id = 'project-images');
CREATE POLICY "Auth upload project-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'project-images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth delete project-images" ON storage.objects FOR DELETE USING (bucket_id = 'project-images' AND auth.role() = 'authenticated');

CREATE POLICY "Public read certificates" ON storage.objects FOR SELECT USING (bucket_id = 'certificates');
CREATE POLICY "Auth upload certificates" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'certificates' AND auth.role() = 'authenticated');
CREATE POLICY "Auth delete certificates" ON storage.objects FOR DELETE USING (bucket_id = 'certificates' AND auth.role() = 'authenticated');

CREATE POLICY "Public read resumes" ON storage.objects FOR SELECT USING (bucket_id = 'resumes');
CREATE POLICY "Auth upload resumes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resumes' AND auth.role() = 'authenticated');
CREATE POLICY "Auth delete resumes" ON storage.objects FOR DELETE USING (bucket_id = 'resumes' AND auth.role() = 'authenticated');

CREATE POLICY "Public read gallery" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Auth upload gallery" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'authenticated');
CREATE POLICY "Auth delete gallery" ON storage.objects FOR DELETE USING (bucket_id = 'gallery' AND auth.role() = 'authenticated');

-- ============================================================
-- SEED DATA
-- ============================================================
INSERT INTO profiles (name, professional_title, tagline, bio, email, linkedin_url, github_url, location)
VALUES (
  'Charity Agutu Martha',
  'Data Scientist & Machine Learning Practitioner',
  'Transforming complex datasets into actionable insights through machine learning, predictive analytics, and business intelligence.',
  'I am a passionate Data Scientist and Machine Learning Practitioner with expertise in transforming raw data into strategic business value. Currently completing my Data Science Bootcamp at Moringa School, I specialize in predictive analytics, healthcare data, and business intelligence dashboards. I am driven by the belief that data-driven decisions lead to meaningful impact.',
  'charityagutu@gmail.com',
  'https://linkedin.com/in/charityagutu',
  'https://github.com/charityagutu',
  'Nairobi, Kenya'
) ON CONFLICT DO NOTHING;

INSERT INTO skills (name, category, display_order) VALUES
  ('Python', 'programming', 1),
  ('SQL', 'programming', 2),
  ('Pandas', 'data_science', 1),
  ('NumPy', 'data_science', 2),
  ('Scikit-Learn', 'machine_learning', 1),
  ('Classification', 'machine_learning', 2),
  ('Regression', 'machine_learning', 3),
  ('Forecasting', 'machine_learning', 4),
  ('Tableau', 'visualization', 1),
  ('Matplotlib', 'visualization', 2),
  ('Seaborn', 'visualization', 3),
  ('Dashboard Development', 'business_intelligence', 1),
  ('Reporting', 'business_intelligence', 2),
  ('ETL', 'business_intelligence', 3)
ON CONFLICT DO NOTHING;

INSERT INTO projects (title, slug, description, problem_statement, methodology, results, technologies, github_url, is_featured)
VALUES (
  'Predicting H1N1 Vaccination Uptake',
  'h1n1-vaccination-prediction',
  'A machine learning model to predict the likelihood of individuals receiving the H1N1 flu vaccine based on behavioral, demographic, and health-related features.',
  'With low vaccination rates posing a major public health risk, this project aimed to identify key drivers of vaccination uptake to enable targeted health communication campaigns.',
  'Data cleaning, exploratory data analysis, feature engineering, and training multiple classification models including Logistic Regression, Random Forest, and XGBoost. Model selection based on ROC-AUC score.',
  'Achieved 85% accuracy and 0.87 ROC-AUC score. Identified top predictors: doctor recommendation, health insurance status, and perceived vaccine effectiveness. Improved forecast accuracy by 15%.',
  ARRAY['Python', 'Scikit-Learn', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn'],
  'https://github.com/charityagutu/h1n1-vaccination-prediction',
  true
) ON CONFLICT DO NOTHING;

INSERT INTO experience (organization, position, start_date, end_date, is_current, description, achievements, display_order)
VALUES (
  'Moringa School',
  'Data Science Bootcamp Student',
  '2025-01-01',
  '2025-11-30',
  false,
  'Intensive full-stack Data Science program covering the complete data science workflow from data collection to deployment.',
  ARRAY['Data cleaning and preprocessing techniques', 'Machine learning model development', 'Interactive dashboard development with Tableau', 'Predictive analytics and forecasting', 'End-to-end project delivery'],
  1
) ON CONFLICT DO NOTHING;
