# Testing & QA Checklist — SkillSetu

## 1. Automated Verification
- [ ] TypeScript compilation (`tsc --noEmit`) passes without errors.
- [ ] ESLint checks (`npm run lint`) pass without warnings or errors.
- [ ] Production build (`npm run build`) completes successfully.

---

## 2. End-to-End User Journey Verification

### Journey A: Student Lifecycle
- [ ] Public landing page loads cleanly with Manrope typography and correct branding.
- [ ] Student registration / quick login sets active role to `student` and redirects to `/browse`.
- [ ] Unverified student visiting `/create` receives clear guidance and links to `/verification`.
- [ ] Submitting verification updates status to `verified`, granting the "Verified Student" badge and `SK-ST-*` ID.
- [ ] Creating a service with multi-unit pricing and live preview adds it to `/browse` and `/my-services`.
- [ ] Receiving a booking allows accepting, tracking, and marking it completed (`COMPLETED_BY_STUDENT`).
- [ ] Earnings and completed jobs count update automatically on `/dashboard`.

### Journey B: Client Lifecycle
- [ ] Client login sets active role to `client` and redirects to `/browse`.
- [ ] Searching and applying multi-dimensional filters (Price, Category, Delivery Mode, Verified) correctly refines results.
- [ ] Opening a service detail page and booking a date/slot computes the 5% platform fee dynamically.
- [ ] Completing "Payment Protected" checkout sets booking status to `CONFIRMED` and payment to `PROTECTED`.
- [ ] Client confirms completion on `/bookings`, releasing payment to student and opening the 5-star review dialog.
- [ ] Submitted review appears instantly on the student's profile and review tab.

### Journey C: Community Marketplace
- [ ] Client posts a requirement with title, budget, deadline, and category.
- [ ] Requirement appears in `/community`.
- [ ] Student applies with a proposal and quote.
- [ ] Client reviews applicants in drawer and accepts/hires the student.

### Journey D: Role Switching & Session Management
- [ ] Switching between Student and Client via the user account dropdown dynamically swaps the navigation bar and dashboard context.
- [ ] Notifications bell displays unread counts, opens notification items, and marks them read.
- [ ] Logout clears session state and redirects to public experience.

### Journey E: Admin Moderation Console
- [ ] Accessing `/admin` renders high-density KPI metrics and moderation tabs.
- [ ] Admin can approve/reject pending student verifications.
- [ ] Admin can review disputes, resolve issues, and trigger payment release/refund.
