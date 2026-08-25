# Authentication & Authorization — SkillSetu

## 1. Authentication Architecture
SkillSetu uses Supabase Auth with custom user metadata and automatic profile provisioning.

### Registration Requirements
1. **Student Registration (`/register/student`)**:
   - `full_name`: Candidate's legal name
   - `email`: Preferred email (or college email)
   - `college`: Indian University / Institute (e.g. *IIT Bombay, COEP Technological University, BITS Pilani, NIFT Mumbai*)
   - `course`: Degree/Major (e.g. *B.Tech Computer Science, B.Des Interaction Design*)
   - `year`: Academic year (e.g. *3rd Year*)
   - `password`: Minimum 8 characters
2. **Client Registration (`/register/client`)**:
   - `full_name`: Contact person name
   - `email`: Business / Individual email
   - `phone`: Mobile contact number
   - `organization`: Company / Startup / Club / Individual name
   - `password`: Minimum 8 characters

---

## 2. Post-Authentication Routing Rule
- After successful login or registration, the application **MUST ALWAYS redirect to `/browse`**.
- Direct redirection to `/dashboard` is strictly disallowed, ensuring users immediately see active marketplace talent and opportunities.

---

## 3. Session Persistence & Role Switching
- Users have an active working role saved in application state and session tokens.
- Clicking **"Switch to Client"** or **"Switch to Student"** in the top navigation account menu toggles the active persona immediately without requiring re-authentication.
- Role switching unlocks contextual views:
  - **Student View**: Dashboard, Create Listing, My Services, Earnings, Subscriptions, Student Verification.
  - **Client View**: Dashboard, Post Requirement, Spending, Protected Payments, Hired Talent.

---

## 4. Row Level Security (RLS) Policies
1. `profiles`: Read public; update self only.
2. `student_profiles`: Read public; update self only.
3. `services`: Read published public; create/update/delete owner student only. Unverified students are prevented from creating `status = 'published'` rows.
4. `bookings`: Read participant student, participant client, or admin only. Update governed by booking state transition rules.
5. `payments`: Read participant student, participant client, or admin only. Create/Update restricted to server-side payment handlers.
6. `reviews`: Read public; create restricted to client of a `CONFIRMED_BY_CLIENT` booking with no prior review.
7. `admin_*`: Restricted strictly to users with `role = 'admin'`.
