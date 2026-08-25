# Product Requirements Document — SkillSetu

## 1. Executive Summary
SkillSetu is a high-trust, production-ready marketplace web application tailored for the Indian ecosystem. It connects verified college students offering real-world skills and services with clients (startups, small businesses, student clubs, event organizers, and individuals).

## 2. Target Personas
1. **Verified Student Provider**:
   - Indian college undergraduate/postgraduate seeking monetization for practical skills (Coding, UI/UX, Event Photography, Tutoring, Video Editing, Decoration, Model Making, Content Writing).
   - Needs: Legitimate proof of college enrollment, fair payment protection, portfolio exhibition, booking schedule management, direct client reviews.
2. **Marketplace Client**:
   - Startups, local businesses, festival organizers, parents, or fellow students needing cost-effective, high-quality talent with quick turnaround.
   - Needs: Verified talent credentials, transparent pricing breakdown, secure payment protection, milestone completion confirmation.
3. **Platform Administrator**:
   - Platform operations team managing user verifications, service compliance, dispute resolutions, payments, and community moderation.

## 3. Core Functional Modules
1. **Public Discovery & Onboarding**:
   - Hero with clear dual-path onboarding (Student vs Client).
   - Category exploration spanning 12+ categories.
   - Featured student talent showcase with realistic work samples.
   - Trust and payment safety breakdown.
2. **Authentication & Role Separation**:
   - Supabase Auth integration supporting email/password registration for students (college, course, year) and clients (organization, phone).
   - Persistent role switching from account menu.
   - First destination after login: `/browse`.
3. **Marketplace & Discovery (`/browse`)**:
   - Multi-parameter search across skills, titles, student names, and categories.
   - Filters: Category, Price range slider, Delivery mode (Online/On Campus), Minimum Rating, Availability, Verified Only.
   - Sorting: Recommended, Top Rated, Most Booked, Price Low-High, Price High-Low, Newest.
4. **Service Creation & Management (`/create`, `/my-services`)**:
   - Mandatory verification gating: Only verified students can publish.
   - Pricing units: Per Hour, Per Project, Per Session, Per Item.
   - Live interactive card preview.
   - Portfolio showcase and team service toggle.
5. **Booking & Payment Protection Lifecycle**:
   - Date picker, time slot selector, duration, and custom project requirements.
   - Dynamic price breakdown: Service Price + 5% Platform Fee = Total Client Payment.
   - Razorpay integration flow with mock sandbox support.
   - Terms strictly standardized to "Payment Protected" (Zero "escrow" mentions).
   - Strict 10-state booking machine (`REQUESTED` to `CONFIRMED_BY_CLIENT` / `DISPUTED`).
6. **Community Opportunity Board (`/community`)**:
   - Client requirement posting.
   - Student proposal submission with custom quotes.
   - Client response review and direct hiring.
7. **Verification Center (`/verification`)**:
   - Student college ID upload and credential verification.
   - Client business / individual identity verification.
8. **Student Subscription Monetization (`/subscription`)**:
   - Monthly (₹199) and Yearly (₹1,499) plans for listing privileges, zero commission deductions, and badge highlights.
9. **Admin Portal (`/admin`)**:
   - Dedicated moderation for verifications, disputes, services, payments, reviews, and categories.

## 4. Non-Functional Requirements
- **Performance**: Sub-second page navigation via Next.js App Router and server-rendered static generation.
- **Accessibility**: WCAG AA compliance, semantic HTML, visible focus states, ARIA dialogs.
- **Responsiveness**: Flawless experience across Mobile (375px+), Tablet (768px+), Laptop (1024px+), and Desktop (1440px+).
- **Security**: Supabase RLS policies, server-side authorization checks, no client-side payment secrets, no real Aadhaar storage.
