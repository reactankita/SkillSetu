# Core Product Rules & Business Logic — SkillSetu

## Non-Negotiable Product Rules

1. **First Authenticated Destination**: Post-login or post-registration destination is always `/browse`. Direct redirection to `/dashboard` is disallowed.
2. **Strict Role Separation**: Student and Client workflows are distinct. Students manage services, bookings, earnings, and subscriptions; Clients discover talent, book services, post requirements, and confirm completions.
3. **Role Switching**: The user can toggle between Student and Client personas seamlessly via the user account menu.
4. **Mandatory Student Verification**: Only students with `verification_status = 'verified'` can publish active service listings. Unverified students are guided to the verification page.
5. **Verified Reviews Only**: Client reviews can only be submitted after a booking has reached `CONFIRMED_BY_CLIENT` or `COMPLETED_BY_STUDENT` status, preventing spam or fake reviews.
6. **Platform Commission Architecture**: Clients pay a 5% platform convenience fee at checkout (e.g. ₹2,000 service + ₹100 fee = ₹2,100 total). Students receive the full agreed service price.
7. **Student Subscription Monetization**: Students have access to monthly (₹199) and yearly (₹1,499) subscription tiers for enhanced exposure and zero listing deductions.
8. **Notification System**: Notifications live exclusively under the top navigation header bell icon. "Notifications" must never exist as a standalone navigation link.
9. **Strict Anti-Escrow Terminology**: The word "escrow" is strictly prohibited from visible UI. Use **"Payment Protected"** / **"Payment Secured Until Completion"**.
10. **Broad Marketplace Scope**: The marketplace covers Technology, Design, Art, Photography, Videography, Events, Decoration, Tutoring, Content, Music, Crafts, and Business. It is not limited to programming.
11. **No Fake Controls**: Every filter, button, search bar, dropdown, and tab must actively update the UI and underlying data.
12. **Zero Real Aadhaar Data**: National ID verification is simulated in prototype mode; real Aadhaar numbers are never collected or stored.
13. **Security Isolation**: Database service keys and payment secrets remain strictly server-side.
14. **Referential Integrity**: All dashboard metrics, earnings, booking counts, and review averages are derived directly from the relational data graph.
