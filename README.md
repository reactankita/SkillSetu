# SkillSetu (स्किल सेतु)
### *Skills that connect. Opportunities that grow.*

SkillSetu is a full-stack student freelancing and services marketplace built for the Indian ecosystem. It connects verified college students with startups, student clubs, event organizers, and local businesses who need quality work delivered on time.

---

## 💡 The Problem We're Solving

Across India, thousands of college students possess practical skills — from building full-stack web apps and designing mobile UI, to shooting college fests, editing viral Instagram reels, tutoring JEE physics, and creating custom stage backdrops.

However, finding freelance work today is messy:
- Students rely on informal WhatsApp groups, word-of-mouth, or overcrowded international freelancing websites where they compete against 10-year veterans.
- Clients worry about unverified strangers, missed deadlines, or paying upfront with zero accountability.

**SkillSetu is the bridge ("Setu").** We verify college credentials before a student can list services, protect payments until clients confirm work is delivered satisfactorily, and provide a clean, transparent platform for student talent to thrive.

---

## ✨ What Makes SkillSetu Different

- **🎓 Verified College Credentials**: Every student provider submits their college ID and institutional email before publishing. No anonymous or fake profiles.
- **🔒 Protected Payments**: Clients authorize payments at checkout, and funds remain protected by SkillSetu until the student delivers the agreed work. No risk of ghosting or no-shows.
- **🎨 Real-World Diversity (Not Just Coding)**: Covers 12+ categories including Technology, UI/UX Design, Event Photography, Video Editing, Stage Decoration, JEE Tutoring, Music Jingles, Scale Models, and Content Writing.
- **👥 Role Separation & Instant Switching**: Seamlessly toggle between hiring as a **Client** and offering services as a **Student** from the account menu.
- **📢 Community Opportunities Board**: Clients can post urgent festival gigs or startup project briefs, and verified students apply directly with custom quotes.
- **📊 Clean, Honest Dashboards**: Real earnings charts, active listings management, actionable booking workflows, and authentic client reviews.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, React Server Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a restrained design token palette:
  - *Deep Navy (`#0B1727`)* for structure and institutional trust
  - *Action Orange (`#EA580C`)* for high-impact CTAs
  - *Soft Gray (`#F8FAFC`)* for clean surfaces
  - *Emerald Green (`#10B981`)* for verified credentials
- **Typography**: [Manrope](https://fonts.google.com/specimen/Manrope)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL with Row Level Security)
- **Payment Engine**: [Razorpay](https://razorpay.com/) checkout architecture + simulated sandbox mode
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/reactankita/SkillSetu.git
cd SkillSetu
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Default local configuration (`.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder-anon-key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_placeholder
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Try the 1-Click Demo Accounts

SkillSetu includes a built-in synchronized state store pre-seeded with 15+ Indian college students (*IIT Bombay, COEP, BITS Pilani, NID, NIFT, IISc*), 28+ published services, and multi-state bookings:

- **Student Login**: Go to `/login/student` → Click **"1-Click Demo"** to log in as *Sarah Chen (IIT Bombay)*.
- **Client Login**: Go to `/login/client` → Click **"1-Click Demo"** to log in as *Tech Fest Committee*.
- **Admin Portal**: Go to `/admin` to review the verification approval queue, monitor platform metrics, and resolve open dispute tickets.

---

## 🗄️ Supabase PostgreSQL Migration (Optional for Cloud Setup)

To connect your own live Supabase cloud database:
1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Run the migration script located at:
   [`supabase/migrations/00001_skillsetu_schema.sql`](./supabase/migrations/00001_skillsetu_schema.sql)
4. Add your Supabase project URL and anon API key into `.env.local`.

---

## 📖 Complete Documentation

Detailed technical architecture and design system documents are in the [`/docs`](./docs) folder:

- [`01-reference-audit.md`](./docs/01-reference-audit.md) — Reference prototype audit & UX fixes
- [`02-product-requirements.md`](./docs/02-product-requirements.md) — Personas & functional scope
- [`03-design-system.md`](./docs/03-design-system.md) — Color tokens, typography, and badges
- [`04-information-architecture.md`](./docs/04-information-architecture.md) — Routing and role switching
- [`05-technical-architecture.md`](./docs/05-technical-architecture.md) — Next.js App Router & data layer
- [`06-database-schema.md`](./docs/06-database-schema.md) — PostgreSQL tables & RLS policies
- [`07-authentication-and-authorization.md`](./docs/07-authentication-and-authorization.md) — Supabase Auth & sessions
- [`08-payment-flow.md`](./docs/08-payment-flow.md) — Payment protection lifecycle (zero escrow wording)
- [`09-verification-system.md`](./docs/09-verification-system.md) — Student & client verification workflows
- [`10-routing-map.md`](./docs/10-routing-map.md) — Complete routing map
- [`11-component-system.md`](./docs/11-component-system.md) — UI primitives & domain components
- [`12-mock-data-strategy.md`](./docs/12-mock-data-strategy.md) — Relational seed dataset matrix
- [`13-security-rules.md`](./docs/13-security-rules.md) — Privacy rules & server secrets
- [`14-error-and-empty-states.md`](./docs/14-error-and-empty-states.md) — Error and empty state patterns
- [`15-testing-checklist.md`](./docs/15-testing-checklist.md) — E2E test verification guide
- [`16-deployment.md`](./docs/16-deployment.md) — Production deployment & environment setup
- [`17-product-rules.md`](./docs/17-product-rules.md) — Core business logic rules

---

## 📄 License
© 2026 SkillSetu. Built for the Indian student and startup community.
