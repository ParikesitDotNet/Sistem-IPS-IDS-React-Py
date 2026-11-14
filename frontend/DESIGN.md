DESIGN.md — Aegis Defense IDS/IPS SOC Dashboard

1. Visual Direction & Philosophy
   Aesthetic: Clean, light-mode Material UI / Enterprise Analytics Dashboard (inspired by Modular Admin).
   Contrast Strategy: High-contrast split layout featuring a rich, dark emerald-to-navy gradient sidebar paired with an airy, crisp off-white main workspace (`#F4F5F7`) and pure white (`#FFFFFF`) elevated cards.
   Data Density: Spacious, breathable layouts with thin hairline dividers, subtle drop shadows, and scannable sparklines/progress bars rather than heavy dark-mode borders.

---

2. Color Palette
   Surfaces & Backgrounds
   Main Canvas Background: `#F4F5F7` (Light cool gray)
   Card Surface: `#FFFFFF` (Pure white)
   Top Navbar Surface: `#FFFFFF` with bottom border `#E2E8F0`
   Sidebar Background: Vertical linear gradient from `#3B6E5C` (Muted Sage/Emerald at top) transitioning through `#234B54` (Deep Teal) to `#132644` (Deep Navy at bottom). Subtle diagonal geometric overlay texture at `5%` opacity.
   Brand & Accent Colors
   Primary Brand Accent (Lime Green): `#8BC34A` (Used for active sidebar text/icon, primary chart lines, positive trend percentages, primary bar fills).
   Secondary Brand Accent (Royal Purple): `#8E44AD` / `#9B59B6` (Used for top-bar outlined action buttons, sparklines, progress bars, and card header icons).
   Secondary Chart Fill (Cool Gray): `#ECEFF1` with `#90A4AE` dashed stroke (Used for comparative baselines/secondary series).
   Typography & Semantic Colors
   Primary Text (Headings/Metrics): `#333333` / `#2D3748`
   Secondary Text (Labels/Subtitles): `#757575` / `#718096`
   Muted Text (Axis labels/Timestamps): `#9E9E9E`
   Sidebar Text (Inactive): `#D1DCE5` (85% opacity)
   Sidebar Text (Active): `#8BC34A` (Lime Green)
   Positive Delta: `#8BC34A` (e.g., `+12.4%`)
   Negative/Alert Delta: `#E57373` (e.g., `-5%` or critical spikes)

---

3. Typography
   Font Family: `'Roboto', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif`
   Scale & Weights:
   Card Titles: `15px` (`0.9375rem`), Weight `500` (Medium), Color `#4A5568`
   KPI Metric Values: `22px` (`1.375rem`), Weight `500` (Medium), Color `#2D3748`
   KPI Delta Badges: `12px` (`0.75rem`), Weight `700` (Bold), Inline superscript/baseline alignment
   Table Headers: `13px` (`0.8125rem`), Weight `600` (SemiBold), Color `#4A5568`
   Table Body / Sidebar Items: `13px` (`0.8125rem`), Weight `400` (Regular)
   Chart Axis Ticks: `11px` (`0.6875rem`), Weight `400`, Color `#9E9E9E`

---

4. Layout & Grid Architecture
   Global Shell
   Left Sidebar: Fixed width `240px` (`w-60`). Full viewport height (`100vh`).
   Header: Brand logo mark (Hexagon/Shield in Lime Green `#8BC34A`) + Title `"AEGIS DEFENSE"` + small purple pill badge (`IDS / IPS SOC` in `#8E44AD`).
   Navigation Groups: Centered muted section headers (`MAIN MENU`, `DETECTION & PREVENTION`, `GOVERNANCE & SYSTEM`) in `11px` `#A0AEC0`.
   Nav Items: Left-aligned icon (`18px`) + label (`13px`). Expandable groups show a right-aligned chevron (`v`). Active state has no heavy background pill—just `#8BC34A` text/icon color (or a very subtle `rgba(255,255,255,0.08)` highlight).
   Top Header Bar: Fixed height `64px` (`h-16`), `#FFFFFF` background.
   Left: Hamburger menu toggle icon (`#757575`).
   Center: Outlined purple pill/rounded buttons (`border: 1px solid #9B59B6`, text `#8E44AD`, `12px` uppercase, `border-radius: 4px`): e.g., `[ <> LIVE TELEMETRY ]`, `[ ! THREAT COPILOT ]`, `[ * SIMULATED DATA ]`.
   Right: Search magnifying glass icon, Notification bell with green badge (`12`), Circular user avatar + `"Y. Parikesit"` dropdown.
   Dashboard Grid (Overview View)
   16px–20px uniform gap (`gap-5`) inside a padded `#F4F5F7` container (`p-6`):
   Row 1 (Full-Width Hero Card — 12 Columns):
   Left 75%: Smooth spline area/line chart ("Network Traffic & Threat Volume"). Series 1: Solid Lime Green (`#8BC34A`) with circular data point markers. Series 2: Dashed Gray (`#90A4AE`) with soft gray area fill (`#F5F7FA`). Dual Y-axes (left & right).
   Right 25%: Top Threat Signatures / Sensor Breakdown list. Displays Signature/Sensor Name, count + percentage right-aligned, and a thin (`4px` height) horizontal purple (`#8E44AD`) progress bar beneath each item.
   Row 2 (4-Column KPI Strip — 3 Columns each):
   Compact white cards (`border-radius: 4px`, subtle shadow).
   Left side of card: Muted label (`12px`, e.g., `Total Alerts`), bold value (`22px`, e.g., `24,850`), and inline colored percentage delta (`+12.4%` in `#8BC34A`).
   Right side of card: Inline purple (`#8E44AD`) sparkline SVG (`width: 80px`, `height: 35px`) showing recent trend.
   Row 3 (Split Bottom Row — 6 Columns + 6 Columns):
   Left Card: Clean data table ("Recent Security Alerts"). Header with purple list icon + title + vertical three-dot menu (`⋮`). Columns: `Source / Signature`, `Events`, `Severity`, `Timestamp`. Horizontal hairline borders (`#EDF2F7`) between rows; no vertical borders.
   Right Card: Grouped vertical bar chart ("Threat Severity & Blocked Breakdown"). Header with purple bar-chart icon + title + `⋮` menu. Paired vertical bars per category: Solid Lime Green (`#8BC34A`) for Blocked/Mitigated vs. Light Gray (`#ECEFF1` with `#B0BEC5` 1px border) for Total Detected.

---

5. Component Styling Rules
   Cards: `background: #FFFFFF`, `border-radius: 4px`, `box-shadow: 0 1px 3px rgba(0,0,0,0.08)`, `border: none`.
   Card Headers: Include a small `18px` purple (`#8E44AD`) icon to the left of the title and a gray three-dot kebab menu (`⋮`) on the far right.
   No Dark Mode / Neon Glows: Strictly avoid dark slate backgrounds (`#0B0F19`), glowing borders, or saturated royal blue (`#2563EB`) buttons.
