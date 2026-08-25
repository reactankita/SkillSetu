# Deployment & Environment Configuration — SkillSetu

## 1. Environment Variables

Create `.env.local` in the project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Razorpay Configuration (Sandbox / Production)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_yourKeyId
RAZORPAY_KEY_SECRET=yourRazorpaySecret

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 2. Supabase Setup & Database Migration
1. Create a new Supabase project at [supabase.com](https://supabase.com).
2. Open the SQL Editor and execute `supabase/migrations/00001_skillsetu_schema.sql`.
3. Set up email/password authentication in Supabase Auth settings.

---

## 3. Local Development & Production Build
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```
