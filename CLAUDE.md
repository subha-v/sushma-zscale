# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # TypeScript compile + Vite production build
npm run preview      # Preview production build locally
npm run lint         # ESLint check for TypeScript/React
```

## Deployment

Build outputs to `dist/`. For Hostinger deployment:
1. `npm run build`
2. Create ZIP: `cd dist && zip -r ../zscale-production.zip .`
3. Upload and extract to `public_html`
4. Ensure `.htaccess` is included for SPA routing

## Architecture

### Tech Stack
- React 18 + TypeScript + Vite
- Tailwind CSS with custom theme (dark institutional theme, teal accent #01F9C6)
- React Router DOM for client-side routing
- Form submissions go to Google Apps Script endpoint

### Key Directories
- `src/pages/` - Route-level page components
- `src/components/` - Reusable UI components
- `src/components/IRI/` - Investment Readiness Index assessment flow
- `src/components/Diagnostic/` - Advisor Match diagnostic flow
- `src/components/tools/` - Interactive tools (equity calculator, investor list, etc.)
- `src/config/api.ts` - API endpoint and form type constants
- `src/hooks/` - Custom React hooks (scroll reveal, etc.)

### Modal Pattern
All modals use `createPortal` to render to `document.body` to avoid positioning issues when modals are triggered from within positioned containers (like the Header). Key modal components:
- `Modal.tsx` - Shared base modal used by most modals
- `IRIModal.tsx` - Multi-step IRI assessment
- `DiagnosticModal.tsx` - Multi-step Advisor Match diagnostic

### Form Submissions
All forms submit to a single Google Apps Script endpoint defined in `src/config/api.ts`. Form types are identified by `FORM_TYPES` constant. User progress (IRI score, contact info) is persisted in localStorage using `STORAGE_KEYS`.

### Tailwind Theme
Custom colors defined in `tailwind.config.js`:
- `ink-*` - Dark background variants
- `accent` - Bright teal (#01F9C6)
- Custom typography scale with `h1`-`h4`, `body`, `label`, etc.

### Routes
```
/                      - HomePage
/ecosystem-map         - EcosystemMap
/intelligence          - IntelligenceHub
/library               - VentureLibrary
/tools/investor-tier-list
/tools/equity-calculator
/tools/accelerator-checklist
/tools/valuation
/membership
/team
```

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           zScale Capital Architecture                            │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                 CLIENT (Browser)                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                          React Router (BrowserRouter)                       │ │
│  ├────────────────────────────────────────────────────────────────────────────┤ │
│  │                                                                             │ │
│  │  ┌─────────────┐  ┌─────────────────────────────────────┐  ┌─────────────┐ │ │
│  │  │   Header    │  │              <Routes>                │  │   Footer    │ │ │
│  │  │  (Nav/Menu) │  │                                      │  │             │ │ │
│  │  │             │  │  /                 → HomePage        │  │             │ │ │
│  │  │  Dropdowns: │  │  /ecosystem-map    → EcosystemMap    │  │  Links      │ │ │
│  │  │  • Platform │  │  /intelligence     → IntelligenceHub │  │  Newsletter │ │ │
│  │  │  • Network  │  │  /library          → VentureLibrary  │  │  Social     │ │ │
│  │  │  • Intel    │  │  /tools/*          → Tool Pages      │  │             │ │ │
│  │  │             │  │  /membership       → Membership      │  │             │ │ │
│  │  │  Modal      │  │  /team             → Team            │  │             │ │ │
│  │  │  Triggers   │  │                                      │  │             │ │ │
│  │  └─────────────┘  └─────────────────────────────────────┘  └─────────────┘ │ │
│  │                                                                             │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                     Modals (Rendered via createPortal to body)              │ │
│  ├────────────────────────────────────────────────────────────────────────────┤ │
│  │                                                                             │ │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────────┐  │ │
│  │  │    IRIModal      │  │ DiagnosticModal  │  │   Modal.tsx (Shared)     │  │ │
│  │  │  (6-step flow)   │  │  (5-step flow)   │  │                          │  │ │
│  │  │                  │  │                  │  │  Used by:                │  │ │
│  │  │  Steps:          │  │  Steps:          │  │  • ShadowCapitalModal    │  │ │
│  │  │  1. Contact      │  │  1. Contact      │  │  • VentureBenchmarksModal│  │ │
│  │  │  2. PMF Evidence │  │  2. PMF Evidence │  │  • EcosystemMapDownload  │  │ │
│  │  │  3. Unit Econ    │  │  3. Financial    │  │  • ToolLeadCaptureModal  │  │ │
│  │  │  4. Team         │  │  4. Team         │  │  • SuccessModal          │  │ │
│  │  │  5. Infra        │  │  5. Advisors     │  │                          │  │ │
│  │  │  6. Capital      │  │                  │  │                          │  │ │
│  │  │                  │  │  → Results View  │  │                          │  │ │
│  │  │  → Results View  │  │                  │  │                          │  │ │
│  │  └──────────────────┘  └──────────────────┘  └──────────────────────────┘  │ │
│  │                                                                             │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DATA FLOW & PERSISTENCE                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────┐         ┌─────────────────────────────────┐   │
│  │      localStorage           │         │    Google Apps Script API       │   │
│  │                             │         │                                  │   │
│  │  STORAGE_KEYS:              │         │  GOOGLE_SCRIPT_URL               │   │
│  │  • zscale_iri_score         │  ────►  │                                  │   │
│  │  • zscale_iri_completed     │         │  Routes to Google Sheets tabs:   │   │
│  │  • zscale_user_email        │         │  • ecosystem_map                 │   │
│  │  • zscale_user_first_name   │         │  • advisor_match                 │   │
│  │  • zscale_user_last_name    │         │  • readiness_index               │   │
│  │  • zscale_user_company      │         │  • newsletter                    │   │
│  │  • zscale_user_sector       │         │  • tool_access                   │   │
│  │  • zscale_is_premium        │         │  • valuation_tool                │   │
│  │                             │         │  • equity_evaluator              │   │
│  │  Used for:                  │         │  • shadow_capital                │   │
│  │  • Tool unlock progression  │         │  • venture_benchmarks            │   │
│  │  • Pre-filling forms        │         │                                  │   │
│  │  • Premium gating           │         │                                  │   │
│  └─────────────────────────────┘         └─────────────────────────────────┘   │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                               HOMEPAGE SECTIONS                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────┐ ┌─────────┐ ┌──────────────┐ ┌────────────────┐ ┌─────────────┐   │
│  │  Hero   │ │ Metrics │ │ FounderTools │ │ DallasExitGap  │ │  Success    │   │
│  │         │ │ (Stats) │ │  (4 Tools)   │ │   (Charts)     │ │ Benchmarks  │   │
│  └─────────┘ └─────────┘ └──────────────┘ └────────────────┘ └─────────────┘   │
│                                                                                  │
│  ┌──────────────┐ ┌─────────────┐ ┌────────────┐ ┌───────────────────────────┐  │
│  │   Advisors   │ │     FAQ     │ │ Newsletter │ │ ReadinessAssessmentPopup  │  │
│  │   (Network)  │ │ (Accordion) │ │  (Signup)  │ │     (Auto-trigger)        │  │
│  └──────────────┘ └─────────────┘ └────────────┘ └───────────────────────────┘  │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                 TOOL PAGES                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  /tools/investor-tier-list     /tools/equity-calculator                         │
│  ┌─────────────────────────┐   ┌─────────────────────────┐                      │
│  │  InvestorTierList       │   │  EquityCalculator       │                      │
│  │  • FilterSidebar        │   │  • EquitySlider         │                      │
│  │  • InvestorTable        │   │  • BenchmarkComparison  │                      │
│  │  • ActivePulse          │   │  • DonutChart           │                      │
│  └─────────────────────────┘   └─────────────────────────┘                      │
│                                                                                  │
│  /tools/accelerator-checklist  /tools/valuation                                 │
│  ┌─────────────────────────┐   ┌─────────────────────────┐                      │
│  │  AcceleratorChecklist   │   │  ValuationTool          │                      │
│  │  • ChecklistCategory    │   │  • ScoreGauge           │                      │
│  │  • ChecklistItem        │   │  • TrafficLight         │                      │
│  │  • TrafficLight         │   │                         │                      │
│  └─────────────────────────┘   └─────────────────────────┘                      │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              BUILD & DEPLOYMENT                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   Source                    Build                      Deploy                    │
│  ┌─────────┐              ┌─────────┐               ┌─────────────┐             │
│  │  src/   │  npm build   │  dist/  │   ZIP + FTP   │  Hostinger  │             │
│  │  *.tsx  │ ──────────►  │  *.js   │ ────────────► │  public_html│             │
│  │  *.css  │  (tsc+vite)  │  *.css  │               │             │             │
│  └─────────┘              └─────────┘               └─────────────┘             │
│                                                                                  │
│  TypeScript ──► ESBuild (via Vite) ──► Minified JS bundles                      │
│  Tailwind CSS ──► PostCSS ──► Purged/Minified CSS                               │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              TECH STACK SUMMARY                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  Frontend:        React 18 + TypeScript                                         │
│  Routing:         React Router DOM v7                                           │
│  Styling:         Tailwind CSS 3 (custom dark theme)                            │
│  Build:           Vite 5 + ESBuild                                              │
│  Linting:         ESLint + TypeScript ESLint                                    │
│  Backend:         Google Apps Script (form submissions)                         │
│  Hosting:         Hostinger (static files + .htaccess for SPA)                  │
│  Persistence:     localStorage (client-side user progress)                      │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Key Architecture Decisions

1. **Portal-based Modals** - All modals render to `document.body` via `createPortal` to avoid CSS positioning conflicts with the fixed Header

2. **Single API Endpoint** - All forms submit to one Google Apps Script URL with a `formType` discriminator that routes to different Google Sheets tabs

3. **Progression System** - IRI score stored in localStorage unlocks advanced tools (50+ for Advisor Match, 70+ for Valuation/Equity tools)

4. **SPA Architecture** - Client-side routing with `.htaccess` rewrite rules for Hostinger deployment
