-- ==============================================================================
-- SKILLSETU SCHEMA MIGRATION: 00002_portfolio_builder.sql
-- Built-in Portfolio Builder & Project Showcase with Row Level Security (RLS)
-- ==============================================================================

-- 1. PORTFOLIOS TABLE
CREATE TABLE IF NOT EXISTS public.portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  headline TEXT NOT NULL,
  about_bio TEXT,
  theme TEXT NOT NULL DEFAULT 'professional' CHECK (theme IN ('professional', 'creative', 'minimal')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'unpublished')),
  skills TEXT[] DEFAULT '{}',
  contact_email TEXT,
  contact_phone TEXT,
  social_links JSONB DEFAULT '{}'::jsonb,
  views_count INTEGER DEFAULT 0 CHECK (views_count >= 0),
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_student_portfolio UNIQUE (student_id)
);

-- 2. PORTFOLIO PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  connected_service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  short_description TEXT NOT NULL,
  detailed_description TEXT,
  role TEXT NOT NULL,
  tools_used TEXT[] DEFAULT '{}',
  duration TEXT,
  completion_date TEXT,
  client_or_organization TEXT,
  project_outcome TEXT,
  cover_image_url TEXT NOT NULL,
  live_url TEXT,
  github_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PORTFOLIO PROJECT MEDIA TABLE
CREATE TABLE IF NOT EXISTS public.portfolio_project_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.portfolio_projects(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'document', 'pdf')),
  url TEXT NOT NULL,
  title TEXT,
  is_cover BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. PORTFOLIO EXPERIENCE TABLE
CREATE TABLE IF NOT EXISTS public.portfolio_experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  organization TEXT NOT NULL,
  duration TEXT NOT NULL,
  description TEXT,
  is_current BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. PORTFOLIO EDUCATION TABLE
CREATE TABLE IF NOT EXISTS public.portfolio_education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  degree_or_course TEXT NOT NULL,
  institution TEXT NOT NULL,
  year TEXT NOT NULL,
  grade_or_score TEXT,
  highlights TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. PORTFOLIO CERTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.portfolio_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date TEXT NOT NULL,
  credential_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. PORTFOLIO ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.portfolio_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  year TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_portfolios_student ON public.portfolios(student_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_username ON public.portfolios(username);
CREATE INDEX IF NOT EXISTS idx_portfolios_status ON public.portfolios(status);
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_portfolio ON public.portfolio_projects(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_service ON public.portfolio_projects(connected_service_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_category ON public.portfolio_projects(category);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_project_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_achievements ENABLE ROW LEVEL SECURITY;

-- Portfolios: Public can view published portfolios. Owner student has full access.
CREATE POLICY "Public can view published portfolios"
  ON public.portfolios FOR SELECT
  USING (status = 'published' OR auth.uid() = student_id);

CREATE POLICY "Students can manage own portfolio"
  ON public.portfolios FOR ALL
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

-- Projects: Public can view projects of published portfolios. Owner student has full access.
CREATE POLICY "Public can view projects of published portfolios"
  ON public.portfolio_projects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.portfolios
      WHERE portfolios.id = portfolio_projects.portfolio_id
      AND (portfolios.status = 'published' OR portfolios.student_id = auth.uid())
    )
  );

CREATE POLICY "Students can manage own portfolio projects"
  ON public.portfolio_projects FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.portfolios
      WHERE portfolios.id = portfolio_projects.portfolio_id
      AND portfolios.student_id = auth.uid()
    )
  );
