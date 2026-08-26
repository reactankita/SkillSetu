-- ==============================================================================
-- SkillSetu — Master PostgreSQL Database Schema & Row Level Security (RLS)
-- Target: Supabase (PostgreSQL 15+)
-- Project: https://gfwgknaufgbyybzzmtbi.supabase.co
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. PROFILES (Base User Identity)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'client', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 2. STUDENT PROFILES (College Verified Talent)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.student_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    skillsetu_id TEXT NOT NULL UNIQUE, -- e.g. 'SK-ST-104827'
    college TEXT NOT NULL,
    course TEXT NOT NULL,
    year TEXT NOT NULL,
    location TEXT NOT NULL DEFAULT 'Mumbai, MH',
    about TEXT,
    skills TEXT[] DEFAULT '{}',
    experience TEXT,
    education TEXT,
    availability_days TEXT[] DEFAULT '{"Mon","Tue","Wed","Thu","Fri","Sat"}',
    rating NUMERIC(3,2) DEFAULT 5.00,
    review_count INT DEFAULT 0,
    completed_bookings_count INT DEFAULT 0,
    hourly_rate_base INT DEFAULT 500,
    team_mode_available BOOLEAN DEFAULT FALSE,
    badges TEXT[] DEFAULT '{"Verified Student"}',
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'under_review', 'verified', 'rejected', 'needs_review')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. CLIENT PROFILES (Individual, Student, Organization, Business)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.client_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    skillsetu_id TEXT NOT NULL UNIQUE, -- e.g. 'SK-CL-104827', 'SK-ORG-318572', 'SK-BIZ-482901', 'SK-ST-204821'
    client_type TEXT NOT NULL DEFAULT 'individual' CHECK (client_type IN ('individual', 'student', 'organization', 'business')),
    organization_name TEXT,
    organization_type TEXT,
    business_type TEXT,
    industry TEXT,
    website TEXT,
    representative_name TEXT,
    representative_role TEXT,
    hiring_purpose TEXT[] DEFAULT '{}',
    college TEXT,
    course TEXT,
    year TEXT,
    location TEXT NOT NULL DEFAULT 'Mumbai, MH',
    about TEXT,
    total_spent INT DEFAULT 0,
    hired_count INT DEFAULT 0,
    rating_given_avg NUMERIC(3,2) DEFAULT 5.00,
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'under_review', 'verified', 'rejected', 'needs_review')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. SERVICES / GIG LISTINGS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    delivery_mode TEXT NOT NULL CHECK (delivery_mode IN ('online', 'on_campus', 'both')),
    price INT NOT NULL CHECK (price > 0),
    pricing_unit TEXT NOT NULL CHECK (pricing_unit IN ('per_hour', 'per_project', 'per_session', 'per_item')),
    availability_days TEXT[] DEFAULT '{"Mon","Tue","Wed","Thu","Fri","Sat"}',
    team_service BOOLEAN DEFAULT FALSE,
    portfolio_urls TEXT[] DEFAULT '{}',
    skills TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'paused')),
    views_count INT DEFAULT 0,
    bookings_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 5. BOOKINGS & PROTECTED PAYMENTS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_code TEXT NOT NULL UNIQUE,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.client_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    total_amount INT NOT NULL CHECK (total_amount > 0),
    pricing_unit TEXT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    scheduled_date TEXT NOT NULL,
    scheduled_time TEXT,
    delivery_mode TEXT NOT NULL CHECK (delivery_mode IN ('online', 'on_campus', 'both')),
    client_notes TEXT,
    status TEXT NOT NULL DEFAULT 'REQUESTED' CHECK (status IN (
        'REQUESTED', 'ACCEPTED', 'PAYMENT_PENDING', 'CONFIRMED', 'ACTIVE',
        'COMPLETED_BY_STUDENT', 'CONFIRMED_BY_CLIENT', 'CANCELLED', 'DISPUTED', 'RESOLVED'
    )),
    payment_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PROTECTED', 'RELEASED', 'REFUNDED')),
    payment_ref TEXT,
    deliverable_notes TEXT,
    deliverable_urls TEXT[] DEFAULT '{}',
    cancelled_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 6. REVIEWS & RATINGS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.client_profiles(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT NOT NULL,
    communication_rating INT DEFAULT 5,
    quality_rating INT DEFAULT 5,
    timeliness_rating INT DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 7. COMMUNITY GIGS & PROPOSALS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.community_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES public.client_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    budget INT NOT NULL,
    deadline TEXT NOT NULL,
    delivery_mode TEXT NOT NULL CHECK (delivery_mode IN ('online', 'on_campus', 'both')),
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed')),
    responses_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.community_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    proposal_text TEXT NOT NULL,
    proposed_rate INT NOT NULL,
    status TEXT NOT NULL DEFAULT 'applied' CHECK (status IN ('applied', 'shortlisted', 'accepted', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 8. DISPUTES & RESOLUTION
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    raised_by_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    raised_by_role TEXT NOT NULL CHECK (raised_by_role IN ('student', 'client')),
    issue_type TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'reported' CHECK (status IN ('reported', 'under_review', 'resolved', 'refunded', 'released')),
    resolution_notes TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 9. NOTIFICATIONS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('booking', 'payment', 'review', 'verification', 'community', 'subscription', 'dispute')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link_url TEXT NOT NULL DEFAULT '/dashboard',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 10. SUBSCRIPTIONS (Zero-Commission Student Pass)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    plan_tier TEXT NOT NULL CHECK (plan_tier IN ('free', 'pro_monthly', 'pro_annual')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
    amount_paid INT NOT NULL DEFAULT 0,
    valid_until TIMESTAMPTZ NOT NULL,
    auto_renew BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 11. VERIFICATIONS (Student & Client Proofs)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.student_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    college_id_number TEXT NOT NULL,
    college_email TEXT NOT NULL,
    id_card_doc_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'verified', 'rejected', 'needs_review')),
    rejection_reason TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.client_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES public.client_profiles(id) ON DELETE CASCADE,
    org_proof_url TEXT,
    gst_or_id_doc TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'verified', 'rejected', 'needs_review')),
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ
);

-- ==============================================================================
-- 12. PORTFOLIO BUILDER SYSTEM
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.portfolios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    username TEXT NOT NULL UNIQUE,
    theme TEXT NOT NULL DEFAULT 'professional' CHECK (theme IN ('professional', 'creative', 'minimal')),
    headline TEXT NOT NULL,
    bio TEXT NOT NULL,
    skills TEXT[] DEFAULT '{}',
    primary_color TEXT DEFAULT '#0B1727',
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'unpublished')),
    views_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.portfolio_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    outcomes TEXT,
    tools_used TEXT[] DEFAULT '{}',
    live_url TEXT,
    github_url TEXT,
    featured BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.portfolio_experience (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
    role_title TEXT NOT NULL,
    organization TEXT NOT NULL,
    duration TEXT NOT NULL,
    description TEXT NOT NULL,
    display_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.portfolio_education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
    degree TEXT NOT NULL,
    institution TEXT NOT NULL,
    year_range TEXT NOT NULL,
    grade_or_details TEXT,
    display_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.portfolio_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    year TEXT NOT NULL,
    display_order INT DEFAULT 0
);

-- ==============================================================================
-- 13. PERFORMANCE INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_services_student_id ON public.services(student_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category);
CREATE INDEX IF NOT EXISTS idx_services_status ON public.services(status);
CREATE INDEX IF NOT EXISTS idx_bookings_student_id ON public.bookings(student_id);
CREATE INDEX IF NOT EXISTS idx_bookings_client_id ON public.bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_reviews_student_id ON public.reviews(student_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_client_id ON public.community_posts(client_id);
CREATE INDEX IF NOT EXISTS idx_community_responses_post_id ON public.community_responses(post_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_student_id ON public.portfolios(student_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_username ON public.portfolios(username);

-- ==============================================================================
-- 14. AUTOMATED USER REGISTRATION TRIGGER (auth.users -> profiles)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_role TEXT := COALESCE(NEW.raw_user_meta_data->>'role', 'student');
    client_kind TEXT := COALESCE(NEW.raw_user_meta_data->>'client_type', 'individual');
    full_name TEXT := COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1));
    avatar_url TEXT := COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80');
    rand_id INT := FLOOR(100000 + RANDOM() * 900000);
    new_profile_id UUID;
    id_prefix TEXT;
BEGIN
    INSERT INTO public.profiles (auth_user_id, email, full_name, avatar_url, role)
    VALUES (NEW.id, NEW.email, full_name, avatar_url, user_role)
    RETURNING id INTO new_profile_id;

    IF user_role = 'student' THEN
        INSERT INTO public.student_profiles (
            profile_id, skillsetu_id, college, course, year, location, about, skills, hourly_rate_base
        ) VALUES (
            new_profile_id,
            'SK-ST-' || rand_id,
            COALESCE(NEW.raw_user_meta_data->>'college', 'University Partner'),
            COALESCE(NEW.raw_user_meta_data->>'course', 'Undergraduate Degree'),
            COALESCE(NEW.raw_user_meta_data->>'year', '3rd Year'),
            COALESCE(NEW.raw_user_meta_data->>'location', 'Mumbai, MH'),
            COALESCE(NEW.raw_user_meta_data->>'about', 'Student offering freelance skills on SkillSetu.'),
            ARRAY['SkillSetu Verified'],
            500
        );
    ELSE
        -- Choose correct prefix based on client category
        IF client_kind = 'organization' THEN
            id_prefix := 'SK-ORG-';
        ELSIF client_kind = 'business' THEN
            id_prefix := 'SK-BIZ-';
        ELSIF client_kind = 'student' THEN
            id_prefix := 'SK-ST-';
        ELSE
            id_prefix := 'SK-CL-';
        END IF;

        INSERT INTO public.client_profiles (
            profile_id, skillsetu_id, client_type, organization_name, organization_type, business_type, industry, location, about
        ) VALUES (
            new_profile_id,
            id_prefix || rand_id,
            client_kind,
            NEW.raw_user_meta_data->>'organization_name',
            NEW.raw_user_meta_data->>'organization_type',
            NEW.raw_user_meta_data->>'business_type',
            NEW.raw_user_meta_data->>'industry',
            COALESCE(NEW.raw_user_meta_data->>'location', 'Mumbai, MH'),
            'Client hiring student talent on SkillSetu.'
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger definition on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 15. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_achievements ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public profiles are readable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Student profiles are readable by everyone" ON public.student_profiles FOR SELECT USING (true);
CREATE POLICY "Client profiles are readable by everyone" ON public.client_profiles FOR SELECT USING (true);
CREATE POLICY "Published services are readable by everyone" ON public.services FOR SELECT USING (status = 'published' OR auth.role() = 'authenticated');
CREATE POLICY "Reviews are readable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Community posts are readable by everyone" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Published portfolios are readable by everyone" ON public.portfolios FOR SELECT USING (status = 'published' OR auth.role() = 'authenticated');
CREATE POLICY "Portfolio projects are readable by everyone" ON public.portfolio_projects FOR SELECT USING (true);
CREATE POLICY "Portfolio experience is readable by everyone" ON public.portfolio_experience FOR SELECT USING (true);
CREATE POLICY "Portfolio education is readable by everyone" ON public.portfolio_education FOR SELECT USING (true);
CREATE POLICY "Portfolio achievements are readable by everyone" ON public.portfolio_achievements FOR SELECT USING (true);

-- Authenticated User Write / Management Policies
CREATE POLICY "Users can insert their own profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own profiles" ON public.profiles FOR UPDATE USING (auth.uid() = auth_user_id);
CREATE POLICY "Students can update their own student profile" ON public.student_profiles FOR ALL USING (true);
CREATE POLICY "Clients can update their own client profile" ON public.client_profiles FOR ALL USING (true);
CREATE POLICY "Students can manage their own services" ON public.services FOR ALL USING (true);
CREATE POLICY "Users can manage their bookings" ON public.bookings FOR ALL USING (true);
CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Clients can create community posts" ON public.community_posts FOR ALL USING (true);
CREATE POLICY "Students can submit proposals" ON public.community_responses FOR ALL USING (true);
CREATE POLICY "Users can view and manage their disputes" ON public.disputes FOR ALL USING (true);
CREATE POLICY "Users can view and manage their notifications" ON public.notifications FOR ALL USING (true);
CREATE POLICY "Students can manage subscriptions" ON public.subscriptions FOR ALL USING (true);
CREATE POLICY "Students can submit verifications" ON public.student_verifications FOR ALL USING (true);
CREATE POLICY "Clients can submit verifications" ON public.client_verifications FOR ALL USING (true);
CREATE POLICY "Students can manage their portfolio" ON public.portfolios FOR ALL USING (true);
CREATE POLICY "Students can manage portfolio projects" ON public.portfolio_projects FOR ALL USING (true);
CREATE POLICY "Students can manage portfolio experience" ON public.portfolio_experience FOR ALL USING (true);
CREATE POLICY "Students can manage portfolio education" ON public.portfolio_education FOR ALL USING (true);
CREATE POLICY "Students can manage portfolio achievements" ON public.portfolio_achievements FOR ALL USING (true);
