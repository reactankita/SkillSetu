# Complete Routing Map — SkillSetu

## 1. Route Layouts & Access Hierarchy

```text
/                                -> Public Landing Page
/login/student                   -> Student Authentication (Email/Password + Quick Demo Login)
/login/client                    -> Client Authentication (Email/Password + Quick Demo Login)
/register/student                -> Student Registration
/register/client                 -> Client Registration

(Marketplace Layout - Global Nav + Bell + User Menu + Footer)
  /browse                        -> Primary Discovery Grid & Filter Center
  /services/[id]                 -> Service Detail, Portfolio & Booking Widget
  /students/[id]                 -> Student Freelancer Portfolio & Credentials
  /dashboard                     -> Role-aware Dashboard (Student / Client views)
  /community                     -> Community Opportunities (Post & Respond)
  /bookings                      -> Booking Lifecycle Tracker
  /reviews                       -> Reviews received / authored
  /profile                       -> Profile settings & SkillSetu ID card
  /verification                  -> Student / Client verification tracker
  /subscription                  -> Student monetization tiers
  /create                        -> Student Service Creator (Verification gated)
  /my-services                   -> Student Service Catalog Manager

(Admin Layout - Protected Sidebar + Header)
  /admin                         -> Executive Platform Metrics Overview
  /admin/users                   -> User Directory & Status Management
  /admin/verifications           -> Student & Client Verification Approval Queue
  /admin/services                -> Services Moderation & Status Toggle
  /admin/bookings                -> Platform-wide Booking Oversight
  /admin/payments                -> Payment Protection & Settlement Log
  /admin/disputes                -> Dispute Resolution Center
  /admin/reviews                 -> Review Moderation
  /admin/community               -> Requirement Board Moderation
  /admin/reports                 -> Compliance & Anomaly Reports
```

---

## 2. Navigation State Matrix

| Viewport / Role | Primary Navbar Links | Right Utility Items |
|---|---|---|
| **Public Visitor** | Browse, Community, How It Works | Login, Register, "Offer Skills" CTA |
| **Logged-in Student** | Browse, Dashboard, Community, Bookings, Create, Reviews, Profile | Notification Bell, "Student" Badge, User Menu (Profile, Settings, Verification, Subscription, Switch to Client, Logout) |
| **Logged-in Client** | Browse, Dashboard, Community, Bookings, Reviews, Profile | Notification Bell, "Client" Badge, User Menu (Profile, Settings, Verification, Switch to Student, Logout) |
| **Admin Console** | Overview, Users, Verifications, Services, Bookings, Payments, Disputes, Reviews, Community, Reports | "Admin Area" Badge, "Exit Admin" Link |
