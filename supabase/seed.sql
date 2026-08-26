-- ==============================================================================
-- SkillSetu — Seed Data Migration for Supabase Database
-- Project: https://gfwgknaufgbyybzzmtbi.supabase.co
-- ==============================================================================

-- 1. Insert Initial Student User Profile
INSERT INTO public.profiles (id, email, full_name, avatar_url, phone, role)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'sarah.chen@iitb.ac.in', 'Sarah Chen', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80', '+91 98201 44102', 'student'),
    ('22222222-2222-2222-2222-222222222222', 'arjun.mehta@coep.ac.in', 'Arjun Mehta', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80', '+91 98220 11983', 'student'),
    ('33333333-3333-3333-3333-333333333333', 'meera.iyer@nift.ac.in', 'Meera Iyer', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80', '+91 98450 33219', 'student')
ON CONFLICT (email) DO NOTHING;

-- 2. Insert Student Profiles
INSERT INTO public.student_profiles (id, profile_id, skillsetu_id, college, course, year, location, about, skills, hourly_rate_base, rating, review_count, completed_bookings_count, badges, verification_status)
VALUES 
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'SK-ST-104827', 'IIT Bombay', 'B.Tech Computer Science', '4th Year', 'Mumbai, MH (Remote / In-Person)', 'Full-stack developer building scalable web applications with Next.js, TypeScript, PostgreSQL, and Supabase.', ARRAY['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Supabase', 'Tailwind CSS'], 850, 4.9, 128, 124, ARRAY['Verified Student', 'Top Performer', 'Skill Certified'], 'verified'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'SK-ST-104828', 'COEP Pune', 'B.Tech Mechanical & Robotics', '3rd Year', 'Pune, MH', 'Hardware prototyping specialist, 3D printing engineer, and robotics builder for student technical clubs and hackathons.', ARRAY['Arduino', 'Raspberry Pi', '3D Printing', 'AutoCAD', 'SolidWorks', 'Circuit Design'], 600, 4.7, 45, 42, ARRAY['Verified Student', 'Skill Certified'], 'verified'),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 'SK-ST-104829', 'NIFT Mumbai', 'B.Des Fashion & Visual Communication', '3rd Year', 'Mumbai, MH', 'Brand identity designer, merchandise illustrator, and editorial stylist for youth brands and college cultural festivals.', ARRAY['Brand Identity', 'Illustration', 'Photoshop', 'Illustrator', 'Merchandise Design'], 750, 4.9, 89, 88, ARRAY['Verified Student', 'Top Performer'], 'verified')
ON CONFLICT (skillsetu_id) DO NOTHING;

-- 3. Insert Client User Profiles
INSERT INTO public.profiles (id, email, full_name, avatar_url, phone, role)
VALUES 
    ('44444444-4444-4444-4444-444444444444', 'rohan.kapoor@techfest.org', 'Rohan Kapoor', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80', '+91 98200 99112', 'client'),
    ('55555555-5555-5555-5555-555555555555', 'sneha.pillai@startupsprint.co', 'Sneha Pillai', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80', '+91 98451 88990', 'client'),
    ('66666666-6666-6666-6666-666666666666', 'ananya.deshmukh@gmail.com', 'Ananya Deshmukh', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80', '+91 99201 33445', 'client')
ON CONFLICT (email) DO NOTHING;

-- 4. Insert Client Profiles
INSERT INTO public.client_profiles (id, profile_id, skillsetu_id, client_type, organization_name, organization_type, business_type, industry, website, representative_name, representative_role, location, about, total_spent, hired_count, rating_given_avg, verification_status)
VALUES 
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', '44444444-4444-4444-4444-444444444444', 'SK-ORG-318572', 'organization', 'Tech Fest Committee', 'Student Committee', NULL, NULL, 'https://techfest.org', 'Rohan Kapoor', 'Coordinator & Operations Lead', 'Mumbai, MH', 'Organizing committee for national-level college technical festivals requiring photography, event apps, stage decoration, and branding.', 34500, 14, 4.9, 'verified'),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '55555555-5555-5555-5555-555555555555', 'SK-BIZ-482901', 'business', 'Startup Sprint Labs', NULL, 'Startup', 'Tech & Software', 'https://startupsprint.co', 'Sneha Pillai', 'Founder & CEO', 'Bengaluru, KA', 'Early-stage startup incubator hiring student developers, UI designers, and content writers for MVP sprints.', 56000, 21, 4.9, 'verified'),
    ('ffffffff-ffff-ffff-ffff-ffffffffffff', '66666666-6666-6666-6666-666666666666', 'SK-CL-104827', 'individual', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Mumbai, MH', 'Individual hiring student photographers and acoustic musicians for family celebrations and personal creative projects.', 12500, 5, 5.0, 'verified')
ON CONFLICT (skillsetu_id) DO NOTHING;

-- 5. Insert Services
INSERT INTO public.services (id, student_id, title, slug, category, description, location, delivery_mode, price, pricing_unit, team_service, skills, status, views_count, bookings_count)
VALUES 
    ('10000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Full-Stack Web App Development (Next.js & Supabase)', 'full-stack-web-app-development', 'Technology', 'End-to-end production web application built with Next.js 14/15, Tailwind CSS, TypeScript, and Supabase / PostgreSQL. Includes authentication, responsive UI, database schema, and payment gateway integration.', 'Remote / Mumbai', 'online', 850, 'per_hour', TRUE, ARRAY['React', 'Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS'], 'published', 1420, 42),
    ('10000000-0000-0000-0000-000000000002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Hardware Prototyping & Custom 3D Printing', 'hardware-prototyping-3d-printing', 'Engineering', 'Custom 3D CAD modeling and high-precision SLA/FDM 3D printing for engineering prototypes, robotics fixtures, and college project enclosures.', 'Pune, MH', 'both', 600, 'per_item', FALSE, ARRAY['3D Printing', 'CAD', 'SolidWorks', 'Arduino', 'Rapid Prototyping'], 'published', 840, 26),
    ('10000000-0000-0000-0000-000000000003', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Festival Brand Identity & Custom Merchandise Illustration', 'festival-brand-identity-merchandise', 'Design & Creative', 'Comprehensive visual branding including festival logos, mascot illustrations, t-shirt prints, social media templates, and event banners.', 'Mumbai / Remote', 'online', 750, 'per_project', TRUE, ARRAY['Brand Identity', 'Vector Illustration', 'Photoshop', 'Typography'], 'published', 1190, 38)
ON CONFLICT (slug) DO NOTHING;

-- 6. Insert Portfolios
INSERT INTO public.portfolios (id, student_id, username, theme, headline, bio, skills, status)
VALUES 
    ('20000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'sarah-chen', 'professional', 'Full-Stack Engineer & Distributed Systems Enthusiast at IIT Bombay', 'Passionate computer science undergraduate specialized in Next.js, Supabase, distributed cloud architecture, and high-performance Web APIs.', ARRAY['Next.js', 'TypeScript', 'PostgreSQL', 'Supabase', 'Docker', 'Tailwind CSS'], 'published'),
    ('20000000-0000-0000-0000-000000000002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'arjun-mehta', 'creative', 'Robotics Engineer & Rapid Hardware Prototyper at COEP', 'Mechanical engineering student specializing in rapid prototyping, 3D printing enclosures, and microcontroller sensor integration.', ARRAY['AutoCAD', 'SolidWorks', '3D Printing', 'Embedded C', 'Robotics'], 'published'),
    ('20000000-0000-0000-0000-000000000003', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'meera-iyer', 'minimal', 'Visual Communication & Identity Designer at NIFT Mumbai', 'Designing typography-first brand identities, college cultural fest merchandise, and bespoke illustration systems.', ARRAY['Figma', 'Illustrator', 'Visual Identity', 'Typography', 'Merchandise'], 'published')
ON CONFLICT (username) DO NOTHING;
