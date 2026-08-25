# Information Architecture & Routing Map — SkillSetu

## 1. Primary Navigation Experiences

SkillSetu is structured into three primary operating environments and a protected administrative console:
1. **Public Experience** (Marketing, Trust, Explanatory Onboarding, Auth)
2. **Student Experience** (Skill provider workspace, Listings creator, Earnings, Booking orders, Subscription)
3. **Client Experience** (Talent discovery, Requirement posting, Booking checkout, Work approvals, Reviews)
4. **Admin Experience** (Moderation console, Verifications, Disputes, Payment settlements)

---

## 2. Route Matrix

| Route | Role / Access | Purpose & Content |
|---|---|---|
| `/` | Public | Public landing page, category showcase, featured student talent, trust model, footer |
| `/login/student` | Public | Student email/password login with demo quick-login shortcut |
| `/login/client` | Public | Client email/password login with demo quick-login shortcut |
| `/register/student` | Public | Student signup (Name, Email, College, Course, Year, Password) |
| `/register/client` | Public | Client signup (Name, Email, Phone, Organization, Password) |
| `/browse` | Public / Authenticated | **Primary marketplace discovery** (Search, Categories, Multi-filter, Service cards) |
| `/services/[id]` | Public / Authenticated | Service details, student bio, portfolio, reviews, interactive booking widget |
| `/students/[id]` | Public / Authenticated | Student Freelancer Portfolio (`SK-ST-104827`), services, credentials, reviews |
| `/dashboard` | Student / Client | Role-specific dashboard (Student: Earnings & Listings; Client: Hired & Active Bookings) |
| `/community` | Student / Client | Community opportunities board (Client posts requirement, Student submits proposals) |
| `/bookings` | Student / Client | Role-aware booking lifecycle management with status filter tabs |
| `/create` | Student Only | Service listing creator with live interactive card preview (Verification gated) |
| `/my-services` | Student Only | Student service catalog management (Published, Draft, Paused, Edit, Delete) |
| `/reviews` | Student / Client | Review history and ratings received / submitted |
| `/verification` | Student / Client | Verification center (Student College ID or Client Business ID submission) |
| `/subscription` | Student Only | Student subscription tiers (Monthly ₹199, Yearly ₹1,499) |
| `/profile` | Student / Client | Profile editor and unique SkillSetu ID card generator |
| `/admin` | Admin Only | Protected overview KPI metrics and platform summary |
| `/admin/[section]` | Admin Only | Tabular moderation (Users, Verifications, Services, Bookings, Payments, Disputes, Reports) |

---

## 3. Role Switching Architecture
- Authenticated users possess an active role (`student` or `client`).
- The user account menu provides an instant **"Switch to Client"** or **"Switch to Student"** action.
- Switching updates the application context, dynamically shifting the navigation bar, dashboard views, and contextual actions while preserving single sign-on identity.
