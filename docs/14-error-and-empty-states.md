# Error, Loading & Empty State Patterns — SkillSetu

## 1. UX State Principles
Every data-driven interface in SkillSetu accounts for three critical states:
1. **Loading State**: Clean skeleton placeholders maintaining layout stability without layout shift.
2. **Error State**: Clear human explanation of what failed, with a retry button or safe fallback link.
3. **Empty State**: Contextual illustration/icon, reassuring message, and a prominent primary action CTA.

---

## 2. Key Empty States & Recovery Actions

| Screen / Component | Empty State Scenario | UX Message & Action |
|---|---|---|
| `/browse` | No services match active filters | "No services found matching your criteria. Try adjusting your filters or search keywords." + **Reset Filters** button |
| `/bookings` (Student) | No bookings in selected tab | "No bookings found in this category. Share your profile or create new services to attract clients." + **Create Service** button |
| `/bookings` (Client) | No active or past bookings | "You haven't hired any students yet. Explore verified student services." + **Browse Talent** button |
| `/my-services` | Student has no published listings | "You haven't listed any skills yet. Monetize your expertise today." + **Create First Listing** button |
| `/community` | No requirements found in category | "No requirements posted in this category yet." + **Post Requirement** button |
| Notifications Menu | No unread notifications | "You're all caught up! New booking updates and messages will appear here." |
| `/reviews` | No reviews yet | "No reviews yet. Completed bookings will generate verified client reviews here." |
