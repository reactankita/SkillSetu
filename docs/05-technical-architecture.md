# Technical Architecture — SkillSetu

## 1. Stack & Runtime Strategy
- **Framework**: Next.js 14/15 App Router (`app/` directory).
- **Language**: TypeScript with strict typing.
- **Styling**: Tailwind CSS with custom design tokens and semantic variables.
- **UI Components**: Radix UI primitives, Lucide icons, accessible dialogs, sheets, and popovers.
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS) policies and Supabase Auth.
- **Client Resilience Layer**: Local synchronized state engine initialized with a rich seed dataset (15+ Indian students, 28+ services, 12+ community opportunities, 15+ reviews, multi-state bookings, notifications) to provide zero-latency operation and standalone execution even before cloud keys are provisioned.
- **Payment Processing**: Razorpay checkout integration with secure server-side fee calculations and sandbox simulation.

---

## 2. Component & Directory Structure
```text
src/
├── app/
│   ├── (auth)/
│   │   ├── login/student/
│   │   ├── login/client/
│   │   ├── register/student/
│   │   └── register/client/
│   ├── (marketplace)/
│   │   ├── layout.tsx
│   │   ├── browse/
│   │   ├── dashboard/
│   │   ├── community/
│   │   ├── bookings/
│   │   ├── create/
│   │   ├── my-services/
│   │   ├── reviews/
│   │   ├── verification/
│   │   ├── subscription/
│   │   ├── profile/
│   │   ├── services/[id]/
│   │   └── students/[id]/
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── [section]/
│   ├── api/
│   │   ├── payment/razorpay/
│   │   └── webhooks/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── brand/ (SkillSetuLogo, VerificationBadge, SkillSetuIdCard, StarRating)
│   ├── ui/ (Button, Input, Textarea, Dialog, Sheet, DropdownMenu, Tabs, Badge, Card, Avatar, Toast)
│   ├── marketplace/ (ServiceCard, StudentCard, FilterSidebar, SearchBar, BookingModal, CheckoutModal, LivePreview)
│   ├── dashboard/ (MetricCard, EarningsChart, RecentActivityTable, GrowthTipsCard)
│   ├── community/ (CommunityPostCard, PostRequirementDialog, RespondDialog, ResponsesDrawer)
│   ├── admin/ (AdminSidebar, AdminDataTable, VerificationReviewModal, DisputeResolutionModal)
│   └── layout/ (Navbar, MobileNav, NotificationBellMenu, Footer)
├── config/
│   └── site.ts
├── lib/
│   ├── data/ (seedData.ts, store.ts)
│   ├── payment/ (razorpay.ts)
│   ├── supabase/ (client.ts, server.ts)
│   └── utils.ts
└── types/
    └── index.ts
```

---

## 3. Data Synchronization & Persistence Engine
SkillSetu uses a dual-engine data abstraction:
1. `src/lib/supabase/client.ts` communicates with Supabase PostgreSQL when credentials exist.
2. `src/lib/data/store.ts` manages a reactive in-memory and `localStorage`-backed store containing complete relational graphs. All mutations (booking status updates, new services, proposal responses, dispute resolution, review postings) instantly mutate this state and notify subscribers across views.
