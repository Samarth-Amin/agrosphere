# Design System: AgroSphere Pro

## Design Philosophy & Tone
- **Mode**: Operate (Clean, high scanability, dense utility, reliable data-rich workflows).
- **Theme**: Organic Biophilic with Modern Enterprise Precision.
- **Brand Essence**: Grounded agriculture meets intelligent telemetry. Clear, trustworthy, vibrant, and accessible.

## Color Palette & Tokens
- **Primary Brand (Emerald)**:
  - `primary-50`: `#effdf5`
  - `primary-500`: `#22c55e`
  - `primary-600`: `#16a34a`
  - `primary-700`: `#15803d` (Primary CTA & Brand Anchor)
  - `primary-900`: `#14532d`
- **Harvest Accent (Amber / Gold)**:
  - `accent-500`: `#f59e0b`
  - `accent-600`: `#d97706`
  - `accent-700`: `#b45309` (Price tags, badges, high-priority notifications)
- **Neutral Surfaces (Slate & Stone)**:
  - Light Background: `#f8fafc` / subtle tint `#f0fdf4`
  - Card Surfaces: `#ffffff`
  - Borders: `#e2e8f0` (1px subtle border)
  - Dark Mode Background: `#09130e` / `#0f172a`
  - Dark Mode Card: `#131f18` / `#1e293b`
- **Text & Contrast**:
  - Headings & Primary Text: `#0f172a` (Light) / `#f8fafc` (Dark) [Contrast > 9:1]
  - Secondary & Muted Text: `#475569` (Light) / `#94a3b8` (Dark) [Contrast > 4.5:1]
  - Destructive: `#dc2626`

## Typography Scale
- Display / Page Titles: `text-2xl font-bold tracking-tight text-slate-900 dark:text-white`
- Section Headers: `text-lg font-semibold text-slate-800 dark:text-slate-100`
- Body Text: `text-sm font-normal text-slate-600 dark:text-slate-300 leading-relaxed`
- Code & Identifiers: `font-mono text-xs font-medium tracking-wide`

## Interaction Standards
- **Buttons**: Minimum hit area 40px, rounded-lg, focus-visible ring 2px, 150ms smooth transition.
- **Icons**: Lucide icons exclusively via `@iconify-json/lucide` (`i-lucide-*`). No emojis as UI icons.
- **Feedback**: Dynamic badge indicators (e.g., status badges for crops, orders, and forecasts).
- **Data Tables**: Striped hover states, formatted currency (`₹`), unit chips, contextual action triggers.
