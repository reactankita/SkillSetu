# Design System Specification — SkillSetu

## 1. Brand Essence & Foundations
SkillSetu balances **institutional trust** with **dynamic student entrepreneurship**. The visual language avoids hyper-trendy AI SaaS aesthetics (such as purple/neon gradients, glassmorphic bubbles, and floating sparkles) in favor of clear editorial hierarchy, structured grids, and purposeful action accents.

---

## 2. Color Palette & Semantic Tokens

| Token Name | Hex Code | Purpose & Semantic Usage |
|---|---|---|
| **Deep Navy (Brand/Structure)** | `#0B1727` / `#0F172A` | Primary brand color, dark navigation headers, headings, high-contrast borders, structural anchors. Represents stability and institutional trust. |
| **Navy Secondary** | `#1E293B` / `#334155` | Secondary text, subtle card backgrounds in dark mode, metadata labels. |
| **Off-White / Soft Gray** | `#F8FAFC` / `#F1F5F9` | Default page background, neutral card surfaces, filter panels. |
| **Crisp Surface White** | `#FFFFFF` | Primary card surfaces, modals, popovers, active tabs. |
| **Vibrant Orange (Action)** | `#EA580C` / `#FF6B00` | High-impact CTAs, Primary buttons ("Book Now", "Publish Service", "Post Requirement"), key badges. |
| **Muted Teal / Blue** | `#0D9488` / `#0284C7` | Supporting links, secondary interactive elements, selected chips, category accents. |
| **Verification Emerald** | `#10B981` / `#059669` | Exclusively for verified student/client badges, completed booking states, payment success indications. |
| **Alert Crimson** | `#EF4444` / `#DC2626` | Destructive actions, dispute warnings, payment failure, cancellation states. |
| **Border Gray** | `#E2E8F0` | Subtle clean card borders, table dividers, input borders. |

---

## 3. Typography: Manrope

* **Font Family**: `Manrope, system-ui, -apple-system, sans-serif`
* **Scale & Hierarchy**:
  * `Display Title`: `text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900`
  * `Page Heading (H1)`: `text-2xl sm:text-3xl font-bold tracking-tight text-slate-900`
  * `Section Heading (H2)`: `text-xl sm:text-2xl font-semibold text-slate-900`
  * `Card Title (H3)`: `text-base sm:text-lg font-semibold text-slate-900`
  * `Body Text`: `text-sm sm:text-base text-slate-600 leading-relaxed`
  * `Metadata / Microcopy`: `text-xs font-medium text-slate-500`
  * `Button / Badge Text`: `text-xs sm:text-sm font-semibold tracking-wide`

---

## 4. Elevation, Radii & Spacing

* **Border Radius**:
  * Default Components (Buttons, Inputs, Badges): `rounded-lg` (`8px`)
  * Cards, Containers, Modals: `rounded-xl` (`12px` to `16px`)
  * Avatar & Status Dots: `rounded-full`
* **Shadows**:
  * Flat/Default: `shadow-sm` (`0 1px 2px 0 rgb(0 0 0 / 0.05)`)
  * Card Hover: `hover:shadow-md` (`0 4px 6px -1px rgb(0 0 0 / 0.08)`)
  * Dialog / Popover: `shadow-xl` (`0 20px 25px -5px rgb(0 0 0 / 0.1)`)
* **Borders**: Clean `1px solid #E2E8F0` everywhere to avoid floating amorphous shapes.

---

## 5. Component Patterns

### Buttons
1. **Primary Action**: `bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg px-4 py-2.5 shadow-sm transition`
2. **Secondary / Neutral**: `bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg px-4 py-2.5 transition`
3. **Outline**: `border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium rounded-lg px-4 py-2.5 transition`
4. **Ghost / Tertiary**: `text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg px-3 py-2 transition`

### Badges & Status Chips
- **Verified Student**: `bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1`
- **Top Performer**: `bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1`
- **Payment Protected**: `bg-sky-50 text-sky-700 border border-sky-200 text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1`
- **Disputed / Alert**: `bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1`

---

## 6. Logo & Brand Mark
- Minimalist geometric SVG mark representing a modern bridge ("Setu") intersecting with skill pathways.
- Crisp vector rendering that scales seamlessly from a 16px favicon to high-resolution navbar and print.
- Wordmark formatted as **SkillSetu** with dual-tone Navy (`Skill`) and Action Orange (`Setu`).
