# Component System & UI Architecture — SkillSetu

## 1. Design Token & UI Primitive Layer

SkillSetu builds upon accessible Radix UI primitives and Tailwind CSS styling:

| Component | Path | Responsibility |
|---|---|---|
| `Button` | `src/components/ui/button.tsx` | Primary (Orange), Secondary (Navy), Outline, Ghost, Destructive variants with loading states |
| `Input` / `Textarea` | `src/components/ui/input.tsx` | Clean focus rings, label integration, error message slots |
| `Badge` | `src/components/ui/badge.tsx` | Verified, Top Performer, Payment Protected, Status variants |
| `Dialog` / `Sheet` | `src/components/ui/dialog.tsx` | Accessible modals for booking, dispute reporting, proposals |
| `DropdownMenu` | `src/components/ui/dropdown-menu.tsx` | User profile menu, sort selectors, table row actions |
| `Tabs` | `src/components/ui/tabs.tsx` | Booking filters (Upcoming/Active/Completed/Disputed), admin tabs |
| `Card` | `src/components/ui/card.tsx` | Base container with subtle border and crisp elevation |

---

## 2. Domain-Specific Component Catalog

### Brand Components
- `SkillSetuLogo`: Geometric bridge SVG wordmark with responsive scaling.
- `VerificationBadge`: Emerald badge for verified students and clients.
- `SkillSetuIdCard`: Visual ID badge showing student/client photo, university/org, and unique ID code (`SK-ST-104827`).
- `StarRating`: Accessible interactive and static star scoring component.

### Marketplace Components
- `ServiceCard`: Displays student avatar, name, verified badge, university tag, service title, category, rating, price unit, and instant booking trigger.
- `FilterSidebar`: Price range, delivery mode (Online/On Campus), category selector, rating filter, verified toggle.
- `BookingModal`: Date, time slot, duration, message, and real-time commission calculation.
- `PaymentProtectedCheckoutModal`: Simulated Razorpay payment sheet confirming payment protection.
- `LiveServicePreview`: Real-time reactive preview rendered in the service creation flow.

### Dashboard & Community Components
- `MetricCard`: KPI display with trend direction and semantic icons.
- `EarningsChart`: Visual SVG trend of monthly earnings.
- `RecentActivityTable`: Actionable booking rows with status chips and direct workflow triggers.
- `CommunityPostCard`: Client requirement card with budget, deadline, category, and proposal button.
- `NotificationBellMenu`: Header dropdown listing live notifications with unread indicators and target links.
