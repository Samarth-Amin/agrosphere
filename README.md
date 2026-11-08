# AgroSphere Pro · Smart Agricultural Management & Marketplace Platform

Recreated and modernized from the original prototype using **Nuxt 4**, **Nitro Engine**, **Nuxt UI (Tailwind CSS)**, **Fira Sans & Public Sans typography**, and the **UI/UX Pro Max + Impeccable + Interface Design** design systems.

---

## 🌟 Upgrades Overview

| Area | Original Prototype (ASP.NET MVC 8) | AgroSphere Pro (Nuxt 4 + Nuxt UI) |
| :--- | :--- | :--- |
| **User Experience & UI** | Fixed 220px rigid sidebar, plain HTML inputs, basic CSS | Organic Biophilic design system, responsive navigation, dark/light themes, Lucide SVG icons, status badges, and smooth modal flows. |
| **Craft Standards** | Basic styling, unformatted tabular rows | Audited and verified against **Impeccable** craft floor standards (zero slop, verified 4.5:1 text contrast, custom scrollbars, themed selection). |
| **Full-Stack Architecture** | Monolithic controllers with raw SQLite `ALTER TABLE` hacks | Decoupled Nitro full-stack REST API with type-safe route handlers, structured query models, and in-memory mock database. |
| **Produce Marketplace & Orders** | Basic form submit | Live listing search, grade filters, dynamic purchase modal with instant consignment volume calculation, and automated batch generation. |
| **Batch Provenance & Traceability** | Static view with hardcoded data | Interactive grain-to-shelf traceability portal with verified origin certificates, quality grade parameters, and logistics milestone timeline. |
| **Finance & Mandi Forecast** | Plain list | Financial cash flow journal with double-entry records, gross revenue vs operating expenses, profit margin calculation, and APMC price trend models. |
| **Community Knowledge Hub** | Basic forum table | Categorized agronomy discussion threads with helpful upvotes and interactive reply threads. |

---

## 🚀 Quick Start Instructions

To run the development server with Hot Module Replacement (HMR):
```bash
cd /home/samarth/.gemini/antigravity/scratch/agrosphere
npm run dev
```
The application will launch at `http://localhost:3000`.

To build and run the production server:
```bash
npm run build
node .output/server/index.mjs
```

---

## 📁 Project Structure

```text
agrosphere/
├── app/
│   ├── app.vue                 # Dashboard shell & typography config
│   ├── components/
│   │   ├── AppHeader.vue       # Header with live weather & Mandi ticker
│   │   └── AppSidebar.vue      # Operable multi-section navigation
│   └── pages/
│       ├── index.vue           # Executive Farm Command Center
│       ├── farms/
│       │   ├── index.vue       # Registered farms & acreage management
│       │   ├── crops.vue       # Field sowing & seasonal harvest tracker
│       │   └── inventory.vue   # Warehouse & input stock telemetry
│       ├── market/
│       │   ├── index.vue       # Produce marketplace & instant buying
│       │   ├── orders.vue      # Orders, consignments & logistics
│       │   └── trace.vue       # QR batch provenance verification
│       ├── finance/
│       │   ├── index.vue       # Cash flow ledger & operating margin
│       │   ├── forecast.vue    # Mandi commodity price intelligence
│       │   └── subsidies.vue   # Government subsidies navigator
│       └── community/
│           └── index.vue       # Peer agronomy forum & replies
├── server/
│   ├── api/                    # Nitro full-stack REST API routes
│   └── utils/
│       └── db.ts               # Seed data & in-memory database engine
├── PRODUCT.md                  # Product brief & target audience definition
└── DESIGN.md                   # Design tokens, color system & craft rules
```
