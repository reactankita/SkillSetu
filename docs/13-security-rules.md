# Security & Compliance Rules — SkillSetu

## 1. Secrets & Credentials Isolation
* **Server-Side Exclusivity**: Supabase `service_role` keys and Razorpay `key_secret` are strictly held in server environment variables and never exposed to client bundles or browser contexts.
* **Client-Safe Public Keys**: Only `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_RAZORPAY_KEY_ID` are bundled into frontend assets.

---

## 2. Personal Data & ID Privacy
* **Zero Real Aadhaar Storage**: Real Aadhaar numbers or government national identity numbers are strictly disallowed from being collected, processed, or stored.
* **Document Gating**: Student college ID documents submitted during verification are stored in private storage buckets and only accessible by authorized platform administrators.

---

## 3. Server Authorization & Validation
* All database mutations are validated against user sessions and active roles.
* Booking state transitions are enforced through a strict server state machine to prevent unauthorized status overrides (e.g. clients cannot mark a job as completed on behalf of the student).
