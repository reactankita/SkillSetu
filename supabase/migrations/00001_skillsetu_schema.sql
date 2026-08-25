-- SkillSetu PostgreSQL Relational Schema & Row Level Security (RLS)
-- Production migration script for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('student', 'client', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Student Profiles Table
CREATE TABLE IF NOT EXISTS public.student_profiles (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    skillsetu_id TEXT NOT NULL UNIQUE,
    college TEXT NOT NULL,
    course TEXT NOT NULL,
    year TEXT NOT NULL,
    location TEXT NOT NULL,
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
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'under_review', 'verified', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Client Profiles Table
CREATE TABLE IF NOT EXISTS public.client_profiles (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    skillsetu_id TEXT NOT NULL UNIQUE,
    organization_name TEXT,
    organization_type TEXT,
    location TEXT NOT NULL,
    about TEXT,
    total_spent INT DEFAULT 0,
    hired_count INT DEFAULT 0,
    rating_given_avg NUMERIC(3,2) DEFAULT 5.00,
    verification_status TEXT DEFAULT 'verified' CHECK (verification_status IN ('pending', 'under_review', 'verified', 'rejected', 'needs_review')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Student Verification Submissions
CREATE TABLE IF NOT EXISTS public.student_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    college_id_number TEXT NOT NULL,
    college_email TEXT NOT NULL,
    id_card_doc_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'verified', 'rejected')),
    rejection_reason TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ
);

-- 5. Client Verification Submissions
CREATE TABLE IF NOT EXISTS public.client_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES public.client_profiles(id) ON DELETE CASCADE,
    org_proof_url TEXT,
    gst_or_id_doc TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'verified', 'rejected', 'needs_review')),
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ
);

-- 6. Services Table
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

-- 7. Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_code TEXT NOT NULL UNIQUE,
    service_id UUID NOT NULL REFERENCES public.services(id),
    student_id UUID NOT NULL REFERENCES public.student_profiles(id),
    client_id UUID NOT NULL REFERENCES public.client_profiles(id),
    booking_date DATE NOT NULL,
    time_slot TEXT NOT NULL,
    duration_hours INT DEFAULT 1,
    message TEXT,
    service_price INT NOT NULL,
    platform_fee INT NOT NULL,
    total_amount INT NOT NULL,
    status TEXT NOT NULL DEFAULT 'CONFIRMED' CHECK (status IN (
        'REQUESTED', 'ACCEPTED', 'PAYMENT_PENDING', 'CONFIRMED',
        'ACTIVE', 'COMPLETED_BY_STUDENT', 'CONFIRMED_BY_CLIENT',
        'CANCELLED', 'DISPUTED', 'RESOLVED'
    )),
    payment_status TEXT NOT NULL DEFAULT 'PROTECTED' CHECK (payment_status IN ('PENDING', 'PROTECTED', 'RELEASED', 'REFUNDED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Booking Events (Audit log)
CREATE TABLE IF NOT EXISTS public.booking_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    actor_id UUID NOT NULL REFERENCES public.profiles(id),
    actor_role TEXT NOT NULL,
    event_type TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.client_profiles(id),
    student_id UUID NOT NULL REFERENCES public.student_profiles(id),
    amount INT NOT NULL,
    platform_fee INT NOT NULL,
    net_student_amount INT NOT NULL,
    currency TEXT DEFAULT 'INR',
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    status TEXT NOT NULL CHECK (status IN ('PENDING', 'PROTECTED', 'RELEASED', 'REFUNDED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    released_at TIMESTAMPTZ
);

-- 10. Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL UNIQUE REFERENCES public.bookings(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES public.services(id),
    student_id UUID NOT NULL REFERENCES public.student_profiles(id),
    client_id UUID NOT NULL REFERENCES public.client_profiles(id),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    client_name TEXT NOT NULL,
    client_org TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Community Posts (Client Requirements)
CREATE TABLE IF NOT EXISTS public.community_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES public.client_profiles(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    client_org TEXT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    budget INT NOT NULL,
    deadline TEXT NOT NULL,
    delivery_mode TEXT NOT NULL CHECK (delivery_mode IN ('online', 'on_campus', 'both')),
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed')),
    responses_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Community Responses (Student Proposals)
CREATE TABLE IF NOT EXISTS public.community_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    student_avatar TEXT,
    student_college TEXT NOT NULL,
    proposal_text TEXT NOT NULL,
    proposed_rate INT NOT NULL,
    status TEXT DEFAULT 'applied' CHECK (status IN ('applied', 'shortlisted', 'accepted', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link_url TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Subscriptions Table (Student Monetization)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    plan TEXT NOT NULL CHECK (plan IN ('monthly_199', 'yearly_1499')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due')),
    billing_period_start TIMESTAMPTZ DEFAULT NOW(),
    billing_period_end TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
    amount INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Disputes Table
CREATE TABLE IF NOT EXISTS public.disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id),
    raised_by_id UUID NOT NULL REFERENCES public.profiles(id),
    raised_by_name TEXT NOT NULL,
    issue_type TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'reported' CHECK (status IN ('reported', 'under_review', 'resolved', 'refunded', 'released')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category);
CREATE INDEX IF NOT EXISTS idx_services_status ON public.services(status);
CREATE INDEX IF NOT EXISTS idx_services_student_id ON public.services(student_id);
CREATE INDEX IF NOT EXISTS idx_bookings_student_id ON public.bookings(student_id);
CREATE INDEX IF NOT EXISTS idx_bookings_client_id ON public.bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_status ON public.community_posts(status);

-- Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, self update
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Student Profiles: Public read, self update
CREATE POLICY "Student profiles are viewable by everyone" ON public.student_profiles FOR SELECT USING (true);
CREATE POLICY "Students can update own student profile" ON public.student_profiles FOR UPDATE USING (auth.uid() = id);

-- Services: Published services are viewable by everyone; Students manage own services
CREATE POLICY "Published services are viewable by everyone" ON public.services FOR SELECT USING (status = 'published' OR auth.uid() = student_id);
CREATE POLICY "Students can insert own services" ON public.services FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students can update own services" ON public.services FOR UPDATE USING (auth.uid() = student_id);
CREATE POLICY "Students can delete own services" ON public.services FOR DELETE USING (auth.uid() = student_id);

-- Bookings: Viewable and manageable by involved parties or admin
CREATE POLICY "Bookings viewable by student, client, or admin" ON public.bookings FOR SELECT USING (auth.uid() = student_id OR auth.uid() = client_id);
CREATE POLICY "Clients can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Participants can update bookings" ON public.bookings FOR UPDATE USING (auth.uid() = student_id OR auth.uid() = client_id);

-- Notifications: Only owner can view/update
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
