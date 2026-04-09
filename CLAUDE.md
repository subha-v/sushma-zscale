# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # TypeScript compile + Vite production build
npm run preview      # Preview production build locally
npm run lint         # ESLint check for TypeScript/React
```

## Environment Variables

Required in `.env`:
```
VITE_SUPABASE_URL=<supabase-project-url>
VITE_SUPABASE_ANON_KEY=<supabase-anon-key>
```

## Deployment

Build outputs to `dist/`. For Hostinger deployment:
1. `npm run build`
2. Create ZIP: `cd dist && zip -r ../zscale-production.zip .`
3. Upload and extract to `public_html`
4. Ensure `.htaccess` is included for SPA routing

## Architecture

### Tech Stack
- React 18 + TypeScript + Vite 5
- Tailwind CSS 3 with custom dark institutional theme (teal accent #01F9C6)
- React Router DOM v7 for client-side routing
- Supabase for backend data (users, businesses, career pathways, programs, reports, UTA workforce intelligence)
- Supabase Edge Functions (Deno) for AI agent backend
- Anthropic Claude API (claude-sonnet-4-6) for conversational AI agent
- Recharts for dynamic chart visualizations in agent chat
- Google Apps Script endpoint for form submissions
- react-helmet-async for meta tag management

### Key Directories
- `src/pages/` - Route-level page components
- `src/pages/dashboards/` - Role-based dashboard pages (college, edc, student, twc)
- `src/components/` - Reusable UI components
- `src/components/IRI/` - Investment Readiness Index assessment flow
- `src/components/Diagnostic/` - Advisor Match diagnostic flow
- `src/components/tools/` - Interactive tools (equity calculator, investor list, etc.)
- `src/components/dashboard/` - Shared dashboard layout, welcome banner, coming soon placeholder, info tooltip
- `src/config/api.ts` - API endpoint, form type constants, localStorage helpers
- `src/lib/supabase.ts` - Supabase client, types, and data fetching functions
- `src/lib/mockData.ts` - Fallback demo data when Supabase tables are empty
- `src/lib/uta-queries.ts` - UTA workforce intelligence query functions and TypeScript interfaces
- `src/lib/uta-mock-data.ts` - Fallback demo data for UTA workforce tables
- `src/lib/agent-api.ts` - SSE client for AI agent Edge Function
- `sql/uta-workforce/` - SQL files (01-22) for UTA workforce dataset schema, data, predictive analytics, executive suite tables, lead capture, and Grapevine EDC data
- `src/hooks/` - Custom React hooks (scroll reveal, useChat)
- `src/hooks/useChat.ts` - Chat state management hook (messages, streaming, tool activity, visualizations)
- `src/components/agent/` - AI agent chat UI components
- `src/components/agent/charts/` - Recharts-based chart components (bar, horizontal bar, pie, donut, line)
- `src/data/` - Static data (investors, checklist questions, equity benchmarks)
- `supabase/functions/chat-agent/` - Supabase Edge Function for AI agent (Deno)
- `scripts/` - Python data pipeline scripts (job scraping, skill trends, predictions)
- `.github/workflows/` - GitHub Actions CI/CD (weekly data pipeline, monthly predictions)
- `zscale-public/` - Standalone static HTML/CSS/JS version for B2G production
- `email-templates/` - Google Apps Script email templates

### Routes (App.tsx)
```
# Marketing Pages (with Header/Footer)
/                      - HomePage
/solutions             - SolutionsPage (tabbed: EDC, universities & colleges, consultants)
/preview               - PreviewPage (lead capture form → demo access)
/about                 - AboutPage (founder bio, government credentials, "Who We Serve")
/demo                  - DemoPage (demo request)

# Auth & Dashboards (no Header/Footer)
/login                 - LoginPage (demo/zscale credentials)
/demo-login            - DemoLogin (multi-role demo account selector + AI Agent card)
/dashboard/college/*   - CollegeDashboard (HB8 funding & curriculum)
/dashboard/edc/*       - EDCDashboard (sectoral health & talent)
/dashboard/student/*   - StudentDashboard (career GPS & hidden market)
/dashboard/twc/*       - TWCDashboard (apprenticeship & workforce)
/agent                 - AgentChat (AI-powered workforce intelligence chat)
```

Header and Footer are conditionally hidden on `/dashboard/*`, `/demo-login`, `/login`, and `/agent` routes.

### Dashboard System
Four role-based dashboards with shared `DashboardLayout` component (sidebar + header + overlay AI chat panel). Each dashboard:
- Checks auth via `getStoredUser()` from `src/lib/supabase.ts`
- Falls back to mock data from `src/lib/mockData.ts` when Supabase is empty
- Has its own `NAV_ITEMS` configuration for sidebar navigation
- Passes `role` prop to DashboardLayout for role-aware AI chat
- Pruned nav items: College (3), EDC (6), Student (1 + quick actions), TWC (1 + quick actions)
- No emoji icons in nav — text-only labels
- Compact metrics bar replaces 5-card stat grids (no `border-l-4` patterns)
- Dismissable `WelcomeBanner` per session (stored in `sessionStorage`)
- Catch-all routes show `ComingSoonPage` placeholder with AI Agent CTA

**Overlay AI Chat Panel** (in `DashboardLayout`):
- Slides from right as an overlay (not a separate page)
- Rendered via `createPortal` to `document.body`
- Drag-to-resize on left edge (min 320px, max 85% viewport)
- Expand/collapse toggle (384px default ↔ 700px expanded)
- Mobile: full-width panel
- Escape key closes, focus management for a11y
- `AskAgentContext` React context lets sub-pages open the chat panel with pre-filled questions via `useAskAgent()` hook

**Mobile-Responsive Sidebar:**
- Hidden by default below `lg` (1024px) breakpoint
- Hamburger button in header opens sidebar as overlay
- Auto-closes on nav link click
- 48px touch targets (WCAG minimum)

Demo login provides 10 test accounts (3 college, 3 EDC incl. Grapevine, 2 student, 2 TWC) stored in `DEMO_USERS` within `src/lib/supabase.ts` with `-2026` token suffix. Login falls back to local tokens when Supabase is unavailable. The demo login page also features an AI Agent card that links to `/agent`. Both LoginPage and DemoLogin use the real `zscale-capital-logo.png` image (same as Header/Footer/DashboardLayout).

### AI Agent Chat System
A conversational AI interface at `/agent` powered by Claude Sonnet 4.6 via a Supabase Edge Function. Architecture:

```
Browser (React SPA) → POST /functions/v1/chat-agent (SSE stream)
  → Supabase Edge Function (Deno)
    ├── Calls Anthropic Messages API with 30+ tool definitions
    ├── Executes Supabase queries when Claude uses tools
    ├── Emits visualization SSE events when Claude calls generate_visualization
    └── Streams text deltas back as Server-Sent Events

User toggles "Visualize" → message sent with [VISUALIZE] hint
  → Claude calls generate_visualization tool with chart data
    → Backend emits visualization SSE event to frontend
    → Frontend renders clickable chart link in message
    → User clicks link → fullscreen modal with recharts chart
```

**Backend** (`supabase/functions/chat-agent/`):
- `index.ts` - Main handler: CORS, SSE streaming, tool use loop (up to 8 rounds), visualization SSE events. Accepts `role` from request body and injects into system prompt for role-aware responses.
- `tools.ts` - 30+ tool definitions (JSON schema) + executor map (includes `generate_visualization`)
- `queries.ts` - Deno-compatible Supabase query functions (port of `uta-queries.ts`) with mock data fallback (includes Arlington + Grapevine data)
- `system-prompt.ts` - UTA Workforce Intelligence Agent persona, instructions, visualization guidelines, and Grapevine key facts

**Frontend**:
- `src/lib/agent-api.ts` - SSE client: POST to Edge Function, parse stream events (including `visualization` events), `VisualizationData` type. Accepts optional `role` parameter to send user role context to backend.
- `src/hooks/useChat.ts` - Chat state: messages, streaming, tool activity, visualizations, abort controller. Accepts optional `role` parameter passed to `streamChat()`.
- `src/components/agent/ChatMessage.tsx` - Message bubbles with markdown rendering (bold, lists, tables, code) + chart link buttons
- `src/components/agent/ChatInput.tsx` - Auto-resizing textarea with send/stop buttons + "Visualize data" toggle. Accepts optional `inputRef` for external focus management (used by DashboardLayout chat panel).
- `src/components/agent/SuggestedQuestions.tsx` - 4 categories of clickable question prompts
- `src/components/agent/ToolActivityIndicator.tsx` - Animated tool activity pills
- `src/components/agent/charts/ChartCard.tsx` - Clickable chart link that opens fullscreen modal (via `createPortal`)
- `src/components/agent/charts/ChartRenderer.tsx` - Chart type router, shared theme constants, `normalizeChartData` utility
- `src/components/agent/charts/BarChartViz.tsx` - Vertical bar chart (recharts)
- `src/components/agent/charts/HorizontalBarChartViz.tsx` - Horizontal bar chart for long labels
- `src/components/agent/charts/PieChartViz.tsx` - Pie chart with percentage labels
- `src/components/agent/charts/DonutChartViz.tsx` - Donut chart with inner radius
- `src/components/agent/charts/LineChartViz.tsx` - Line chart with dot markers

**Deployment** (Supabase Edge Function):
```bash
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
supabase functions deploy chat-agent --no-verify-jwt
```

Required Supabase secrets: `ANTHROPIC_API_KEY`. `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are auto-available in Edge Functions.

### Modal Pattern
All modals use `createPortal` to render to `document.body` to avoid positioning issues when modals are triggered from within positioned containers (like the Header). Key modal components:
- `Modal.tsx` - Shared base modal used by most modals
- `IRIModal.tsx` - Multi-step IRI assessment (6 steps)
- `DiagnosticModal.tsx` - Multi-step Advisor Match diagnostic (5 steps)

### Form Submissions
All forms submit to a single Google Apps Script endpoint defined in `src/config/api.ts`. Form types are identified by `FORM_TYPES` constant. User progress (IRI score, contact info) is persisted in localStorage using `STORAGE_KEYS`.

### Data Persistence
- **localStorage** - User progress (IRI score, contact info, premium status) via `STORAGE_KEYS` in `src/config/api.ts`
- **sessionStorage** - Auth state (`zscale_authenticated`)
- **Supabase** - Backend data (users, businesses, career pathways, academic programs, reports) + UTA workforce intelligence (see below)

### Progression System
- IRI score >= 50 unlocks Advisor Match
- IRI score >= 70 unlocks Valuation & Equity tools
- Premium flag enables Alpha tier access
- Tools have lead capture gates (`ToolAccessGate`)

### Tailwind Theme
Custom colors defined in `tailwind.config.js`:
- `ink-*` - Dark background variants (DEFAULT: #0A0A0B, light, medium, border, card)
- `accent` - Bright teal (#01F9C6) with hover, light, and green variants
- Custom typography: Inter (sans), Cormorant Garamond (serif), JetBrains Mono (mono)
- Custom font sizes: `h1` (64px), `h2` (48px), `h3` (32px), `h4` (24px), `body`, `label`, `button`, `caption`
- Custom animations: fadeIn, scaleIn, pulse-dot, marquee, slideInRight, slideInLeft
- Custom shadows: card, card-hover, glow, glow-teal

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
│  │                     React Router (BrowserRouter)                            │ │
│  ├────────────────────────────────────────────────────────────────────────────┤ │
│  │                                                                             │ │
│  │  Marketing Pages (with Header/Footer):                                      │ │
│  │  ┌─────────────┐  ┌───────────────────────────────────┐  ┌─────────────┐   │ │
│  │  │   Header    │  │           <Routes>                 │  │   Footer    │   │ │
│  │  │  (Nav/Menu) │  │  /           → HomePage            │  │  Links      │   │ │
│  │  │             │  │  /solutions  → SolutionsPage       │  │  Newsletter │   │ │
│  │  │  Modal      │  │  /preview    → PreviewPage         │  │  Social     │   │ │
│  │  │  Triggers   │  │  /about      → AboutPage           │  │             │   │ │
│  │  │             │  │  /demo       → DemoPage            │  │             │   │ │
│  │  └─────────────┘  └───────────────────────────────────┘  └─────────────┘   │ │
│  │                                                                             │ │
│  │  Dashboard Pages (no Header/Footer):                                        │ │
│  │  ┌─────────────────────────────────────────────────────────────────────┐    │ │
│  │  │  /login       → LoginPage                                           │    │ │
│  │  │  /demo-login  → DemoLogin (8 test accounts, 4 roles)               │    │ │
│  │  │  /dashboard/college/* → CollegeDashboard                            │    │ │
│  │  │  /dashboard/edc/*     → EDCDashboard                                │    │ │
│  │  │  /dashboard/student/* → StudentDashboard                            │    │ │
│  │  │  /dashboard/twc/*     → TWCDashboard                                │    │ │
│  │  │  /agent              → AgentChat (AI workforce intelligence)        │    │ │
│  │  │                                                                     │    │ │
│  │  │  All use shared DashboardLayout (sidebar + header + user info)      │    │ │
│  │  └─────────────────────────────────────────────────────────────────────┘    │ │
│  │                                                                             │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                  Modals (Rendered via createPortal to body)                 │ │
│  ├────────────────────────────────────────────────────────────────────────────┤ │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────────┐  │ │
│  │  │    IRIModal       │  │ DiagnosticModal  │  │   Modal.tsx (Shared)     │  │ │
│  │  │  (6-step flow)    │  │  (5-step flow)   │  │  Used by:               │  │ │
│  │  │  1. Contact       │  │  1. Contact      │  │  • ShadowCapitalModal   │  │ │
│  │  │  2. PMF Evidence  │  │  2. PMF Evidence │  │  • VentureBenchmarks    │  │ │
│  │  │  3. Unit Econ     │  │  3. Financial    │  │  • EcosystemMapDownload │  │ │
│  │  │  4. Team          │  │  4. Team         │  │  • ToolLeadCapture      │  │ │
│  │  │  5. Infra         │  │  5. Advisors     │  │  • SuccessModal         │  │ │
│  │  │  6. Capital       │  │                  │  │                          │  │ │
│  │  └──────────────────┘  └──────────────────┘  └──────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DATA FLOW & PERSISTENCE                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────────────┐  │
│  │   localStorage   │  │  sessionStorage  │  │         Supabase             │  │
│  │                  │  │                  │  │                              │  │
│  │  STORAGE_KEYS:   │  │  zscale_         │  │  Tables:                    │  │
│  │  • iri_score     │  │  authenticated   │  │  • users (role-based)       │  │
│  │  • iri_completed │  │                  │  │  • businesses               │  │
│  │  • user_email    │  │  Used for:       │  │  • career_pathways          │  │
│  │  • user_name     │  │  • Auth state    │  │  • academic_programs        │  │
│  │  • user_company  │  │                  │  │  • reports                  │  │
│  │  • user_sector   │  │                  │  │                              │  │
│  │  • is_premium    │  │                  │  │  Fallback: mockData.ts      │  │
│  │                  │  │                  │  │                              │  │
│  │  Used for:       │  └──────────────────┘  └──────────────────────────────┘  │
│  │  • Tool unlock   │                                                          │
│  │  • Pre-fill forms│         ┌──────────────────────────────────────┐         │
│  │  • Premium gate  │         │       Google Apps Script API         │         │
│  │  • Stored user   │         │                                      │         │
│  └──────────────────┘  ────►  │  Routes to Google Sheets tabs:       │         │
│                                │  ecosystem_map, advisor_match,       │         │
│                                │  readiness_index, newsletter,        │         │
│                                │  tool_access, valuation_tool,        │         │
│                                │  equity_evaluator, shadow_capital,   │         │
│                                │  venture_benchmarks, build_app       │         │
│                                └──────────────────────────────────────┘         │
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
│  Vite Config: manual vendor chunk (react, react-dom, react-router-dom)          │
│  No sourcemaps in production                                                     │
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
│  Backend:         Supabase (data) + Google Apps Script (forms)                  │
│  AI Agent:        Claude Sonnet 4.6 via Supabase Edge Function (Deno)           │
│  Charts:          Recharts (bar, pie, donut, line) in agent chat modals        │
│  Meta Tags:       react-helmet-async                                            │
│  Hosting:         Hostinger (static files + .htaccess for SPA)                  │
│  Persistence:     localStorage + sessionStorage + Supabase                      │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Key Architecture Decisions

1. **Portal-based Modals** - All modals render to `document.body` via `createPortal` to avoid CSS positioning conflicts with the fixed Header

2. **Single Form API Endpoint** - All forms submit to one Google Apps Script URL with a `formType` discriminator that routes to different Google Sheets tabs

3. **Supabase + Mock Data Fallback** - Dashboard data comes from Supabase, with `mockData.ts` providing fallback demo data when tables are empty

4. **Role-based Dashboard System** - Four separate dashboards (college, edc, student, twc) with shared `DashboardLayout`, each with its own navigation and data views

5. **Conditional Header/Footer** - `AppContent` checks `location.pathname` to hide Header/Footer on dashboard and auth routes

6. **Progression System** - IRI score stored in localStorage unlocks advanced tools (50+ for Advisor Match, 70+ for Valuation/Equity tools)

7. **SPA Architecture** - Client-side routing with `.htaccess` rewrite rules for Hostinger deployment

8. **Demo Login with Fallback** - `demoLogin()` tries Supabase first, falls back to local `DEMO_USERS` tokens for offline/demo scenarios

9. **AI Agent via Supabase Edge Function** - Conversational AI chat uses a Supabase Edge Function (Deno) that calls the Anthropic Claude API with 30+ tool definitions mapped to UTA workforce Supabase queries (Arlington + Grapevine + regional data). SSE streaming sends text deltas, tool activity, and visualization events to the React frontend. Deployed with `--no-verify-jwt` for public access. Mock data fallback ensures the agent works even when Supabase tables are empty.

10. **Dynamic Chart Visualizations** - The AI agent can generate charts via the `generate_visualization` tool. Charts render using recharts in a fullscreen modal (via `createPortal`). Supports bar, horizontal bar, pie, donut, and line charts with a distinct 10-color palette. The "Visualize data" toggle in ChatInput prepends a `[VISUALIZE]` hint to messages. Data is normalized client-side (`normalizeChartData`) to handle string-formatted numbers. `ResponsiveContainer` uses fixed pixel height (350px) — percentage heights don't work in flex/portal modal layouts.

## UTA Workforce Intelligence Dataset

A comprehensive Supabase dataset for a personalized AI agent serving UT Arlington's career center and workforce staff. Populated with real research data about UTA programs, Arlington/Grapevine/DFW employers, labor market statistics, and skills alignment.

### Supabase Tables (18 tables)

| Table | Purpose | Records |
|-------|---------|---------|
| `uta_colleges` | UTA's 10 colleges/schools with enrollment, deans, URLs | ~10 |
| `uta_programs` | All academic programs (BS, BA, MS, PhD, etc.) across all colleges | ~180 |
| `uta_program_outcomes` | Graduation rates, starting salaries, employment rates, top employers per program | ~30 |
| `arlington_employers` | Arlington/Grapevine/DFW area employers with industry, size, UTA hiring flag | ~65 |
| `arlington_job_openings` | Representative job postings with salaries, skills, education requirements | ~90 |
| `arlington_development` | Economic development projects (Globe Life Field, GM plant, Kubota HQ, DFW Terminal F, etc.) | ~21 |
| `arlington_industries` | Industry sectors with employment counts, wages, growth rates (incl. Grapevine) | ~25 |
| `uta_employer_partnerships` | Program-to-employer links (internships, co-ops, hiring pipelines, advisory boards) | ~50 |
| `uta_skills_alignment` | Skills gap analysis mapping program curricula to industry demands | ~90 |
| `arlington_labor_stats` | BLS/TWC labor market metrics (employment, wages, education, demographics) incl. Grapevine, Southlake, Frisco | ~75 |
| `cip_soc_crosswalk` | Maps CIP codes (programs) to SOC codes (BLS occupations) | ~45 |
| `bls_occupation_projections` | BLS 10-year employment projections (2022-2032) | ~35 |
| `skills_catalog` | Normalized skill dictionary with emerging/declining flags | ~30 |
| `skills_trend_snapshots` | Weekly snapshots of skill demand from job postings | ~40+ |
| `program_predictions` | Composite program success scores (0-100) with sub-scores | ~9 |
| `employer_predictions` | Employer hiring outlook forecasts with factors | ~6 |
| `salary_predictions` | Salary trajectory forecasts (1/3/5/10 year projections) | ~9 |
| `prediction_accuracy_log` | Tracks prediction vs actual outcomes for calibration | 0 |

### Key Data Points
- **UTA Facts:** 44,956 students, 9 colleges, 180+ programs, 54% 6-yr graduation rate, 75%+ employment within 6 months
- **Starting Salaries:** Nursing BSN $70,300, CS BS $68,300, SE BS $67,500, CompE BS $66,700, AeroE BS $66,000
- **Top Employers (Arlington):** GM Assembly (5,200), Texas Health Resources (29,000 DFW), Lockheed Martin (18,000), Arlington ISD (8,400), Bell Textron (7,500), D.R. Horton (Fortune 500 HQ)
- **Top Employers (Grapevine):** Gaylord Texan (2,000), BSW Grapevine (2,000), Grapevine Mills (2,000), GCISD (1,861), DFW Airport (1,500), Paycom (1,000), Kubota NA HQ (500), GameStop HQ (500)
- **Labor Market:** Fort Worth-Arlington employment 1,212,800 (May 2025), Tarrant County avg weekly wages $1,501
- **Grapevine Facts:** Pop 51,320, median HH income $112K, unemployment 3.4%, $2B+ EDC investment since 2014, adjacent to DFW Airport

### TypeScript Integration

Query functions in `src/lib/uta-queries.ts`:
```typescript
getUTAColleges()                          // All 10 colleges
getUTAPrograms(collegeId?)                // Programs, optionally filtered by college
getUTAProgramOutcomes(programId?)         // Salary/employment data per program
getArlingtonEmployers(industry?)          // Employers, optionally filtered by industry
getArlingtonJobOpenings(employerId?)      // Job postings with skills and salary ranges
getArlingtonDevelopment()                 // Economic development projects
getArlingtonIndustries()                  // Industry sectors with employment data
getUTAEmployerPartnerships(programId?)    // Program-employer partnership links
getUTASkillsAlignment(programId?)         // Skills gap analysis
getArlingtonLaborStats(category?)         // Labor market statistics by category
getUTADashboardSummary()                  // Aggregated summary across all tables
```

Fallback mock data in `src/lib/uta-mock-data.ts` (5-15 records per table, including Grapevine) for dev/demo when Supabase is unavailable.

### SQL Files

SQL files in `sql/uta-workforce/` are designed to be copy-pasted into Supabase SQL Editor in numbered order (01-22). Files 01-12 create the core workforce dataset. Files 13-18 add predictive analytics (schema, views, crosswalk data, BLS projections, seed predictions, verification). File 19 adds executive suite tables (program scorecards, compliance reports, site selection, employer monitoring, career advisor sessions). File 20 adds the `demo_leads` lead capture table. File 21 adds intelligence pipeline tables. File 22 adds Grapevine EDC data (10 employers, 10 jobs, 6 dev projects, 7 industries, 8 labor stats, 2 site selection packages, 4 employer alerts, 6 regional comparison stats, 8 businesses). All INSERTs use `ON CONFLICT DO NOTHING` for safe re-runs. All `CREATE POLICY` statements use `DROP POLICY IF EXISTS` before creation. Foreign keys use subquery references by name (not hardcoded UUIDs). RLS is enabled with public read policies on all tables.

### Predictive Analytics Pipeline

Python scripts in `scripts/` compute and refresh predictions:

| Script | Schedule | Purpose |
|--------|----------|---------|
| `scrape_jobs.py` | Weekly (Mon 6am UTC) | Scrapes DFW job postings via JobSpy, extracts skills, upserts into `skills_trend_snapshots` |
| `compute_skills_trends.py` | Weekly (after scrape) | Analyzes 12-week skill trends, flags emerging/declining skills via linear regression |
| `predict_program_success.py` | Monthly (1st, 8am UTC) | Computes program success scores and salary trajectories using BLS + outcomes data |
| `predict_employer_hiring.py` | Monthly (after program) | Classifies employer hiring outlook based on openings, industry growth, and dev projects |

GitHub Actions in `.github/workflows/`: `weekly-data-pipeline.yml` and `monthly-predictions.yml`. Requires `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` as repository secrets.

### AI Agent Prediction Tools (7 new)

| Tool | Purpose |
|------|---------|
| `get_program_prediction` | Program success scores & outlook (0-100 composite) |
| `get_emerging_skills` | Skills growing in DFW job market demand |
| `get_declining_skills` | Skills losing market demand |
| `get_employer_outlook` | Employer hiring predictions (declining/stable/growing/rapidly_growing) |
| `get_salary_forecast` | Salary trajectory projections (1/3/5/10 year) |
| `get_predictive_skills_gap` | Future-aware skills gap analysis with emerging/declining context |
| `compare_programs` | Side-by-side program comparison (2-5 programs) |

### Executive Suite Tables (5 new)

| Table | Purpose | Records |
|-------|---------|---------|
| `program_scorecards` | Program ROI scorecards with overall scores, health status, HB8 compliance | ~9 |
| `compliance_reports` | HB8 and board compliance report tracking with pass/fail indicators | ~5 |
| `site_selection_packages` | EDC site selection talent/labor packages for relocating companies (Arlington + Grapevine) | ~7 |
| `employer_monitoring` | Employer hiring signals and alerts (surges, freezes, expansions) incl. Grapevine | ~10 |
| `career_advisor_sessions` | Student AI career advisor session tracking and analytics | ~5 |

SQL file: `sql/uta-workforce/19-executive-suite-tables.sql` (safe re-runs with `ON CONFLICT DO NOTHING`)

### Executive Suite AI Agent Tools (12 new)

| Tool | Query Function | Purpose |
|------|---------------|---------|
| `get_program_scorecard` | `queryProgramScorecards` | Program ROI scorecards with AI recommendations |
| `get_at_risk_programs` | `queryAtRiskPrograms` | Programs with critical/at_risk health status |
| `detect_curriculum_gaps` | `queryCurriculumGaps` | Missing skills that industry demands |
| `generate_compliance_report` | `queryComplianceReport` | HB8 compliance reports with pass/fail |
| `get_compliance_status` | `queryComplianceStatus` | Overview of all report statuses |
| `generate_site_selection_package` | `querySiteSelectionPackage` | Talent packages for relocating companies |
| `compare_regions` | `queryRegionalComparison` | Side-by-side regional labor market comparison |
| `get_employer_alerts` | `queryEmployerAlerts` | Unacknowledged employer monitoring signals |
| `get_employer_intelligence` | `queryEmployerIntelligence` | Deep-dive employer profiles |
| `generate_bod_report` | `queryBoardReportData` | Board of Directors aggregate performance report |
| `get_talent_pipeline` | `queryTalentPipeline` | Program-to-employer talent flow mapping |
| `get_career_advisor_stats` | `queryCareerAdvisorStats` | AI advisor usage analytics |

### Executive Suite Dashboard Sub-Pages

All 4 dashboards now use internal `Routes`/`Route` from React Router for sub-page routing. The existing wildcard routes in `App.tsx` (`/dashboard/college/*`, etc.) handle the top-level routing.

| Dashboard | New Sub-Page | Path | Component |
|-----------|-------------|------|-----------|
| College | Program Scorecards | `/dashboard/college/scorecards` | `ProgramScorecards.tsx` |
| College | Compliance Reports | `/dashboard/college/compliance-reports` | `ComplianceReportsPage.tsx` |
| EDC | Skills Demand | `/dashboard/edc/skills-demand` | `SkillsDemandPage.tsx` |
| EDC | Talent Pipeline | `/dashboard/edc/talent-pipeline` | `TalentPipelinePage.tsx` |
| EDC | Site Selection | `/dashboard/edc/site-selection` | `SiteSelectionPage.tsx` |
| EDC | Employer Alerts | `/dashboard/edc/employer-alerts` | `EmployerAlertsPage.tsx` |
| EDC | Regional Comparison | `/dashboard/edc/regional-comparison` | `RegionalComparisonPage.tsx` |
| Student | AI Career Advisor | `/dashboard/student/career-advisor` | `CareerAdvisorPage.tsx` (route removed from StudentDashboard — replaced by overlay chat panel) |

**Shared DashboardLayout** (`src/components/dashboard/DashboardLayout.tsx`) includes an overlay AI chat panel (slide-out from right) with drag-to-resize and expand/collapse toggle. The sidebar "Ask AI Agent" button opens this panel instead of navigating to `/agent`. Exports `useAskAgent()` hook via `AskAgentContext` so sub-pages can open the chat with pre-filled questions. Also includes mobile-responsive sidebar (hamburger menu below `lg` breakpoint).

**Additional Components:**
- `src/components/dashboard/WelcomeBanner.tsx` - Dismissable per-session welcome banner with role stats and CTA buttons
- `src/components/dashboard/ComingSoonPage.tsx` - Warm placeholder for catch-all routes with "Ask AI Agent" CTA
- `src/components/dashboard/InfoTooltip.tsx` - Shared hover tooltip for table column headers and metric labels. Renders an info icon (ℹ) with a hover-activated popover. Props: `text` (string or JSX), `align` ('left' | 'right' | 'center'), `className` (width override). Uses `group-hover/tip` for scoped hover targeting. Used across all 6 EDC dashboard pages to explain calculated metrics (Risk scores, Status/Demand/Trend columns, Signal Strength, partnership types, etc.).

**SuggestedQuestions** (`src/components/agent/SuggestedQuestions.tsx`) now accepts an optional `role` prop (`'college' | 'edc' | 'student' | 'twc' | 'general'`) that shows role-specific question categories. Default/general shows the original 5 categories plus a new "Executive Suite" category. EDC role with Grapevine county (`countyFips === '48439'`) shows a tailored `edc-grapevine` variant with 4 categories covering 5 demo moments: Site Selection, Employer Intelligence, Skills & Talent, and Regional & Board.

**System Prompt** (`supabase/functions/chat-agent/system-prompt.ts`) now includes Executive Suite capabilities section with role detection, report generation guidelines, HB8 compliance specifics, and proactive intelligence instructions.

### Dashboard Data Sources

Each page uses different data sources. Only main dashboard default views query Supabase and show a live/fallback indicator (pulsing teal or yellow dot in footer). Sub-pages use hardcoded mock data with no Supabase queries.

| Page | Route | Data Source | Live Indicator |
|------|-------|-------------|----------------|
| College default (ROI Heatmap) | `/dashboard/college` | Supabase `academic_programs` → fallback `MOCK_PROGRAMS` | Pulsing teal/yellow dot |
| Program Scorecards | `/dashboard/college/scorecards` | Supabase `program_scorecards` (join `uta_programs`, `uta_colleges`) → fallback `MOCK_SCORECARDS` | Pulsing teal/yellow dot |
| Compliance Reports | `/dashboard/college/compliance-reports` | Supabase `compliance_reports` (join `uta_programs`) → fallback `MOCK_REPORTS` | Pulsing teal/yellow dot |
| EDC default (Sectoral Health) | `/dashboard/edc` | Supabase `businesses` → fallback `MOCK_BUSINESSES` | Pulsing teal/yellow dot |
| Skills Demand | `/dashboard/edc/skills-demand` | Supabase `skills_catalog` (emerging/declining) + `uta_skills_alignment` (join `uta_programs`) → fallback `MOCK_EMERGING_SKILLS`, `MOCK_DECLINING_SKILLS`, `MOCK_SKILLS_GAP` | Pulsing teal/yellow dot |
| Talent Pipeline | `/dashboard/edc/talent-pipeline` | Supabase `uta_employer_partnerships` (join `uta_programs`, `uta_colleges`, `arlington_employers`) → fallback `MOCK_PIPELINE` | Pulsing teal/yellow dot |
| Site Selection | `/dashboard/edc/site-selection` | Supabase `site_selection_packages` → fallback `MOCK_PACKAGES` | Pulsing teal/yellow dot |
| Employer Alerts | `/dashboard/edc/employer-alerts` | Supabase `employer_monitoring` (join `arlington_employers`) → fallback `MOCK_ALERTS` | Pulsing teal/yellow dot |
| Regional Comparison | `/dashboard/edc/regional-comparison` | Supabase `arlington_labor_stats` (Grapevine/Southlake/Frisco/Colleyville) → fallback `MOCK_CITIES` | Pulsing teal/yellow dot |
| Student default (Career GPS) | `/dashboard/student` | Supabase `career_pathways` → fallback `MOCK_CAREER_PATHWAYS` | Pulsing teal/yellow dot |
| TWC default (Overview) | `/dashboard/twc` | Supabase `career_pathways` + `institutions` → fallback mocks | Pulsing teal/yellow dot |
| AI Agent Chat | `/agent` | AI agent via Supabase Edge Function (30+ tools query Supabase) | None |

**Note:** The AI Agent (both standalone `/agent` and the overlay chat panel in dashboards) queries Supabase indirectly through the Edge Function's 30+ tool definitions. The Edge Function's `queries.ts` has its own mock data fallback for each query.

### Lead Capture System

The PreviewPage (`/preview`) gates demo access behind a 4-field lead capture form that stores prospect data in Supabase before redirecting to the demo login.

**Flow:** PreviewPage form → Supabase `demo_leads` insert → `sessionStorage` auth set → redirect to `/demo-login`

**Supabase Table:** `demo_leads` (SQL file: `sql/uta-workforce/20-demo-leads-table.sql`)

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Auto-generated primary key |
| `full_name` | TEXT | Required |
| `email` | TEXT | Required |
| `institution` | TEXT | Required |
| `role_title` | TEXT | Required |
| `email_domain` | TEXT | Generated column: `split_part(email, '@', 2)` |
| `is_edu_email` | BOOLEAN | Generated: detects `.edu` domains |
| `is_gov_email` | BOOLEAN | Generated: detects `.gov` / `.mil` domains |
| `source` | TEXT | Default `'preview_page'` |
| `sessions_count` | INTEGER | Default 0 |
| `last_visited_at` | TIMESTAMPTZ | Nullable |
| `created_at` | TIMESTAMPTZ | Default `now()` |

**RLS:** Anonymous insert allowed (lead capture uses anon key). Only service role can read/update (admin/analytics). Lead capture failure never blocks demo access — the form gracefully continues on insert error.

### Grapevine EDC Data (Multi-City Support)

The platform now supports data for multiple cities beyond Arlington. File `sql/uta-workforce/22-grapevine-data.sql` adds Grapevine, TX data into existing tables (no new tables created). All records use `city='Grapevine'` to distinguish from Arlington data.

**Grapevine Key Facts:**
- Population: 51,320 | Median HH Income: $112,000 | Unemployment: ~3.4%
- $2B+ total investment since 2014 (Grapevine EDC)
- Adjacent to DFW International Airport (4th busiest US airport)
- Target industries: Corporate HQ, Hospitality/Tourism, Retail, Entertainment

**Data added to existing tables:**
- `arlington_employers`: 10 Grapevine employers (DFW Airport, Kubota NA HQ, Paycom, GameStop HQ, Gaylord Texan, Great Wolf Lodge, BSW Grapevine, GCISD, Hilton DFW Lakes, Grapevine Mills)
- `arlington_job_openings`: 10 Grapevine job postings
- `arlington_development`: 6 projects (Kubota HQ $51M, DFW Terminal F $4B, TEXRail TOD $114M, Gaylord expansion $174M, SH-114 $99M, Hotel Vin $40M)
- `arlington_industries`: 7 Grapevine industries with "(Grapevine)" suffix
- `arlington_labor_stats`: 8 Grapevine stats + 6 regional comparison stats (Southlake, Frisco)
- `site_selection_packages`: 2 Grapevine packages (Corporate HQ, Hospitality expansion)
- `employer_monitoring`: 4 Grapevine alerts (Kubota expansion, Paycom hiring, Gaylord renovation, DFW Terminal F)
- `businesses`: 8 Grapevine businesses for EDC dashboard

**Mock data updated in:** `queries.ts` (Edge Function), `uta-mock-data.ts` (frontend), `mockData.ts` (EDC dashboard)

**AI Agent updates:** System prompt includes Grapevine key facts. Tool descriptions reference "Arlington/Grapevine/DFW". Suggested questions include Grapevine-specific prompts for EDC role. Regional comparisons include Grapevine, Southlake, Frisco.

### Marketing Pages — SEO & Branding

**SEO** (`index.html`): Meta tags target B2G workforce intelligence keywords (not VC/startup). Title: "zScale Capital | AI-Powered Workforce Intelligence for Universities & EDCs". Keywords include: workforce intelligence platform, labor market analytics, HB8 compliance, program ROI scoring, economic development data.

**Government Credentials** (displayed on AboutPage and trust bars):
- SAM.gov Registration: Active, UEI `DPKYDLDKEFG9`, CAGE `1A0X9`, expires Mar 2027
- Business Classification: Women-Owned Small Business, Minority-Owned, Small Business (SBA)
- NAICS Codes: 541611, 541511, 541512, 541612, 541720, 541910
- PSC Codes: DA01, B506, B507, R408
- WOSB (SBA) and WBENC certifications in progress (displayed as footnote, not primary credential)
- Congressional District: Texas 24

**Brand Consistency:**
- All pages use `zscale-capital-logo.png` image (no text "Z" placeholders)
- "Universities & Colleges" (not "Community Colleges") across all pages
- Trust bars on HomePage and PreviewPage: "Built for Texas Universities & EDCs" (no partnership claims)
- Copyright: 2026
- Demo tokens use `-2026` suffix

**HomePage Features:**
- Animated AI Chat Preview section: IntersectionObserver triggers staggered typewriter animation (user bubble → typing dots → AI response with tool activity pill → data rows slide in one-by-one → live indicator). Uses `ChatPreview` component with step-based state machine.
- Trust Bar: SAM.gov Registered, Women-Owned Small Business, UEI + CAGE codes
- Hero with Dallas skyline background, data ticker (Q1 2026)

**AboutPage Design** (institutional B2G pattern):
- Manifesto hero: "The data exists. Most institutions just can't use it."
- Borderless stats with `divide-x` separators (no card borders)
- Founder section: rectangular photo (`rounded-2xl`), company credential pills, fast-scan mini-stats row (`15 yrs`, `$500M+`, `200+`)
- "Who We Serve" section: 3 audience cards (Universities, EDCs, Workforce Boards)
- Government credentials formatted as data tables with `divide-y` rows
- Section labels: `text-xs uppercase tracking-[0.2em]` above every H2
- Typography: `tracking-[-0.02em]` on headings for institutional feel
