# Design System: Arctic Glassmorphism — "The Polar Prism"
**Project ID:** 15905917205411598030

## 1. Visual Theme & Atmosphere
A high-precision instrument carved from ice and light. Not a flat dashboard — an ethereal, multi-dimensional workspace using intentional asymmetry, chromatic depth, and luminous precision. Every element feels "etched" rather than printed.

## 2. Color Palette & Roles

### Surface Hierarchy (Layered Ice)
| Level | Token | Hex | Role |
|:------|:------|:----|:-----|
| L0 — The Void | `surface_container_lowest` | #0a0e1a | Global background |
| L1 — The Base | `surface` | #0f131f | Main board area |
| L2 — The Lane | `surface_container_low` | #171b28 | Column backgrounds |
| L3 — The Card | `surface_container_highest` | #313442 | Task cards |

### Accent Colors
| Name | Hex | Role |
|:-----|:----|:-----|
| Glacial Blue | #38bdf8 | Primary actions, focus, CTA gradient |
| Arctic Violet | #818cf8 | Tags, secondary metadata |
| Frost Green | #4ee6aa / #34d399 | Success states, "Done" column |
| Amber Glow | #fbbf24 | High priority |
| Aurora Red | #f87171 / #ffb4ab | Urgent/danger states |
| Primary Light | #8ed5ff | CTA gradient start, surface tint |

### Glass & Gradient Rule
- **Glass fill:** `rgba(255, 255, 255, 0.06–0.08)`
- **Backdrop blur:** `20–24px`
- **Ghost border:** `1px solid rgba(255,255,255,0.08–0.1)` — light refraction, never opaque
- **CTA gradient:** `linear-gradient(135deg, #8ed5ff, #38bdf8)`

## 3. Typography Rules
Font: **Inter** exclusively. High-contrast legibility like a premium technical journal.

| Level | Size | Weight | Color | Use |
|:------|:-----|:-------|:------|:----|
| Display | 3.5rem | 700 | #fff 95% | Hero metrics |
| Headline | 1.5rem | 600 | #fff 95% | Column titles, modal headers |
| Title | 1.125rem | 500 | #fff 95% | Card titles |
| Body | 0.875rem | 400 | #94a3b8 | Descriptions |
| Label | 0.6875rem | 600 | #bdc8d1 | Tags, timestamps |

## 4. Component Stylings
* **Buttons:** Pill-shaped (`rounded-full`). Primary: gradient fill + glow. Glass: translucent + blur.
* **Cards:** 16px rounded, `surface_container_highest` at 80% opacity + blur. No dividers — spacing only.
* **Inputs:** `surface_container_low` default. Focus: ghost border in `#8ed5ff` + 4px outer glow.
* **Chips/Badges:** `rounded-full`, `surface_container_highest` bg, `secondary` (#bdc2ff) text.

## 5. Layout Principles
- Generous spacing: 24px column gaps, 12px card gaps, 20px card padding
- No hard dividers — depth and spacing define structure
- Custom scrollbar: 4px, appears only on scroll
- 16px or `full` rounding only — no small radii

## 6. Do's & Don'ts
**Do:** Use glassmorphism transparency, aurora gradient backgrounds, `#4ee6aa` for success.
**Don't:** Use pure black, standard 4/8px radii, opaque borders, or generic grays.
