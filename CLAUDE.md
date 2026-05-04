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
- `src/components/tracker/` - Texas Talent Pipeline Tracker components (TrackerCard, TrackerFilters, TrackerSubscribeForm, TrackerClaimForm, TrackerHeroStats, CitedBySection)
- `src/lib/tracker-types.ts` - Tracker TypeScript types and category metadata
- `src/lib/tracker-queries.ts` - Tracker Supabase query functions with mock data fallback
- `src/lib/tracker-mock-data.ts` - Fallback demo data for tracker tables
- `sql/uta-workforce/` - SQL files (01-25) for UTA workforce dataset schema, data, predictive analytics, executive suite tables, lead capture, Grapevine EDC data, intelligence pipeline, tracker tables, and tool waitlist
- `src/hooks/` - Custom React hooks (scroll reveal, useChat)
- `src/hooks/useChat.ts` - Chat state management hook (messages, streaming, tool activity, visualizations)
- `src/components/agent/` - AI agent chat UI components
- `src/components/agent/charts/` - Recharts-based chart components (bar, horizontal bar, pie, donut, line)
- `src/components/intelligence/` - Workforce Intelligence Brief newsletter components (subscribe form, reading progress bar, author byline/bio, share button)
- `src/data/intelligence-issues/` - Static newsletter issue data (types, issue-1 through issue-3, index)
- `src/data/tool-definitions.ts` - TOOL_DEFINITIONS constant with metadata for 4 upcoming tool pages
- `src/data/` - Static data (investors, checklist questions, equity benchmarks)
- `src/styles/wib-issue.css` - Cream reading theme for newsletter issue pages (scoped under `.wib-issue-scope`)
- `src/lib/intelligence-queries.ts` - Newsletter subscribe and view count functions (Supabase + Google Apps Script)
- `src/lib/tool-waitlist.ts` - Tool waitlist signup function (Supabase + Google Apps Script fallback)
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
/about                 - AboutPage (story, founder, credentials, publications)
/demo                  - DemoPage (demo request)
/intelligence          - IntelligenceArchivePage (newsletter archive)
/intelligence/:slug    - IntelligenceIssuePage (individual issue reading page)
/tracker               - TrackerPage (Texas Talent Pipeline Tracker — public list)
/tracker/:slug         - TrackerEntryPage (individual tracker entry detail)
/tools/region-comparison    - ToolPlaceholderPage (region comparison waitlist)
/tools/expansion-readiness  - ToolPlaceholderPage (expansion readiness scorecard waitlist)
/tools/edc-directory        - ToolPlaceholderPage (EDC directory waitlist)
/tools/talent-source-finder - ToolPlaceholderPage (talent source finder waitlist)

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

### Header Navigation
7-item desktop nav: Solutions, Tracker, Tools (hover dropdown), The Brief, About, Login. "Request Demo" CTA button at right.

**Tools Dropdown** (hover, 150ms fade-in/out):
- Region Comparison → `/tools/region-comparison`
- Expansion Readiness Scorecard → `/tools/expansion-readiness`
- EDC Directory → `/tools/edc-directory`
- Talent Source Finder → `/tools/talent-source-finder`

Dropdown panel: `bg-ink-card border border-ink-border rounded-xl`, left-aligned below "Tools" label. Active state on any `/tools/*` path. "Tracker" is top-level link to `/tracker`. "The Brief" is top-level link to `/intelligence`. Mobile menu shows Tools items expanded inline. Login uses `text-zinc-400` for de-emphasis.

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

Demo login provides 10 test accounts (3 college, 3 EDC incl. Grapevine, 2 student, 2 TWC) stored in `DEMO_USERS` within `src/lib/supabase.ts` with `-2026` token suffix. Login falls back to local tokens when Supabase is unavailable. The demo login page also features an AI Agent card that links to `/agent`. Both LoginPage and DemoLogin use the `zscale-logo.png` image (same as Header/Footer/DashboardLayout).

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
│                              zScale Architecture                                 │
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
│  │  │  (Nav/Menu) │  │  /           → HomePage            │  │  4-col grid │   │ │
│  │  │   Tools     │  │  /solutions  → SolutionsPage       │  │  Credentials│   │ │
│  │  │  Dropdown   │  │  /preview    → PreviewPage         │  │  LinkedIn   │   │ │
│  │  │             │  │  /about      → AboutPage           │  │             │   │ │
│  │  │             │  │  /tracker    → TrackerPage         │  │             │   │ │
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

SQL files in `sql/uta-workforce/` are designed to be copy-pasted into Supabase SQL Editor in numbered order (01-25). Files 01-12 create the core workforce dataset. Files 13-18 add predictive analytics (schema, views, crosswalk data, BLS projections, seed predictions, verification). File 19 adds executive suite tables (program scorecards, compliance reports, site selection, employer monitoring, career advisor sessions). File 20 adds the `demo_leads` lead capture table. File 21 adds intelligence pipeline tables. File 22 adds Grapevine EDC data (10 employers, 10 jobs, 6 dev projects, 7 industries, 8 labor stats, 2 site selection packages, 4 employer alerts, 6 regional comparison stats, 8 businesses). File 23 adds newsletter tables. File 24 adds Texas Talent Pipeline Tracker tables (tracker_entries, tracker_claims, tracker_subscribers, tracker_citations, pilot_pipeline) with 2 triggers (auto-create pilot_pipeline from claims and edu/gov subscribers), RLS policies, and 5 seed entries. File 25 adds the `tool_waitlist` table for upcoming tool page email signups. All INSERTs use `ON CONFLICT DO NOTHING` for safe re-runs. All `CREATE POLICY` statements use `DROP POLICY IF EXISTS` before creation. Foreign keys use subquery references by name (not hardcoded UUIDs). RLS is enabled with public read policies on all tables.

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

**SEO** (`index.html`): Comprehensive structured data and meta tags for AI search and traditional search engines.
- **Title:** "zScale | Economic Intelligence for Regions Building the AI Economy"
- **Description:** Real-time data on businesses, jobs, capital flows and talent pipelines for universities, EDCs, employers and workforce boards
- **OG title:** "zScale | Economic Intelligence for Regions Building the AI Economy"
- **OG description:** "Real-time data on businesses, jobs, capital flows and talent pipelines. Universities, EDCs, employers and workforce boards run on the same numbers."
- **Keywords:** economic intelligence, talent pipeline intelligence, Texas workforce data, labor market analytics, regional economic development, HB8 compliance, program ROI scoring, employer demand analytics, EDC data platform, skills gap analysis, site selection data, career outcomes tracking, AI economy, workforce intelligence
- **Robots:** `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1`
- **Canonical:** `https://zscalecapital.com/`
- **Organization JSON-LD:** Schema.org structured data with founder (Sushma Vadlamannati), contact (sales), areaServed (Texas), knowsAbout (7 topics)
- **WebSite JSON-LD:** For Google sitelinks search box
- **Social card:** `/images/zscale-social-card.png` (1200x1200 square with text)
- **Favicon:** `/favicon.png` (Z monogram), cache-busted with `?v=7.0`

**Logo & Image Assets** (`public/images/`):
- `zscale-logo.png` — Wide banner logo used in Header (h-20/80px desktop, h-14/56px mobile), Footer (h-16/64px), LoginPage, DemoLogin, DashboardLayout, AdminDashboard. Alt text: "zScale"
- `zscale-social-card.png` — Square logo with text used for OG/Twitter social card images and Schema.org publisher logo
- `sushma-headshot.png` — Founder photo used on AboutPage (280px portrait). Newsletter issue pages still reference the legacy `sushma-headshot.jpg`
- `favicon.png` — Z monogram used as site favicon and apple-touch-icon (at `/public/favicon.png`)

**Government Credentials** (displayed on AboutPage "Credentials and compliance" section and small Footer credentials line only):
- SAM.gov Registration: Active, UEI `DPKYDLDKEFG9`, CAGE `1A0X9`, expires Mar 2027
- NAICS Codes: 541611, 541511, 541512, 541612, 541720, 541910
- Legal entity: zScale Capital LLC (Texas)
- NO WOSB, Women-Owned Small Business, Minority-Owned, PSC codes, or business classification on homepage, header, or footer brand areas

**Brand Consistency:**
- All pages use `zscale-logo.png` image (not the old `zscale-capital-logo.png`)
- Public-facing alt text: "zScale" (not "zScale Capital")
- "Universities & Colleges" (not "Community Colleges") across all pages
- No em-dashes anywhere in new copy
- No Oxford commas (no comma before "and"/"or" in lists)
- Sentence case headings (not Title Case)
- Footer tagline: "Talent pipeline intelligence for Texas institutions"
- Footer credentials line: "SAM.gov Registered · UEI DPKYDLDKEFG9 · CAGE 1A0X9" (text-xs text-white/30)
- Footer columns: Platform, Solutions, Company, Legal (no subscribe form)
- Copyright: 2026
- Demo tokens use `-2026` suffix

**HomePage Features:**
- H1: "The economic intelligence layer for regions building the AI economy"
- Hero with Dallas skyline background, data ticker (Q2 2026)
- Trust strip: "SAM.gov registered" + "Serves 4 Texas regions" + "Updated weekly" (no WOSB, no UEI/CAGE)
- 4-card audience grid: Universities and colleges, EDCs, Workforce boards, Site selection consultants
- 2-row feature blocks: "Talent pipeline tracking" (text + pipeline visual) and "AI question layer" (text + ChatPreview)
- ChatPreview: IntersectionObserver triggers staggered typewriter animation (user bubble, typing dots, AI response with tool activity pill, data rows slide in one-by-one, live indicator)
- Tracker section (conditional on featured entries)
- Published research section (2 latest issues + subscribe form)
- Final CTA: "See your region's pipeline"
- Schema.org SoftwareApplication JSON-LD via Helmet

**AboutPage Design** (institutional pattern, Stripe/Linear-inspired):
- Structurally distinct from HomePage (no duplicated content)
- Section labels: `text-xs uppercase tracking-[0.2em]` above every H2
- Typography: `tracking-[-0.02em]` on headings for institutional feel
- 7 sections (top to bottom):
  1. **Hero** — Left-aligned (not centered), max-w-[720px], label "About", H1 "We map how talent moves from classrooms to employers across Texas", lead paragraph
  2. **The Story** — Two-column grid: label + H2 "Why we built this" on left, 3 editorial paragraphs on right. No stats strip, no cards.
  3. **How We Work** — 3-column principles grid with numbered labels (01/02/03): "Start with public data", "Make it legible", "Let the numbers argue"
  4. **Founder** — 2-column: `lg:grid-cols-[280px_1fr]` (280px photo on desktop, 200px centered on mobile). Photo: `sushma-headshot.png`, rounded-2xl, `bg-ink-card`, `object-cover object-center`, no decorative circle/ring/white background. Bio: name, title, 2 body paragraphs, credentials data row (15 yrs experience / $500M+ budget / 200+ reports), LinkedIn button. No employer pills, no "Grapevine, Texas"
  5. **What We Publish** — 3 cards: The Workforce Intelligence Brief, Texas Talent Pipeline Tracker, Interactive Tools. Each links to its respective route.
  6. **Credentials and Compliance** — Data table with `divide-y` rows: SAM.gov, UEI, CAGE, NAICS, Legal entity, State. No WOSB.
  7. **Get In Touch** — Minimal section with email + 2 CTA buttons (Request a demo, Explore the platform)
- Meta tags via react-helmet-async (title: "About | zScale")

### Workforce Intelligence Brief (Newsletter)

A bi-weekly newsletter published at `/intelligence` with individual issue pages at `/intelligence/:slug`. Three issues published so far. Content is stored as static TypeScript data in `src/data/intelligence-issues/`.

**Routes:**
- `/intelligence` → `IntelligenceArchivePage` — newsletter archive with issue cards, subscribe forms, tag filters
- `/intelligence/:slug` → `IntelligenceIssuePage` — individual issue reading experience

**Data Model** (`src/data/intelligence-issues/types.ts`):
```typescript
interface IntelligenceIssue {
  slug: string;
  issueNumber: number;
  title: string;
  subtitle: string;
  summary: string;
  publishedAt: string;
  readTimeMinutes: number;
  tags: string[];
  ogImage?: string;
  linkedinUrl?: string;
  bodyHtml: string;          // Raw HTML rendered via dangerouslySetInnerHTML
  heroImage?: string;        // Future: real hero photo
  heroGradient?: string;     // Future: custom gradient
  authorName?: string;       // Default: Sushma Vadlamannati
  authorTitle?: string;      // Default: Founder & CEO, zScale Capital
  authorPhoto?: string;      // Default: /images/sushma-headshot.jpg
  authorLinkedIn?: string;   // Default: LinkedIn profile URL
  wordCount?: number;        // For Schema.org JSON-LD
}
```

**Published Issues:**
| Issue | Slug | Topic | Read Time |
|-------|------|-------|-----------|
| #1 | `issue-1-graduate-underemployment` | 52% graduate underemployment + OBBBA earnings test | 7 min |
| #2 | `issue-2-degree-safety-net` | Degree as safety net collapse + Texas apprenticeship response | 10 min |
| #3 | `issue-3-jobs-coming` | AI infrastructure spending + 5.25M worker shortfall | 12 min |

**Issue Page Layout** (`IntelligenceIssuePage.tsx`, top to bottom):
1. **Reading Progress Bar** — 3px accent-colored bar fixed at viewport top (z-1001), tracks scroll position
2. **Dark Hero Section** — Full-width `bg-[#050505]` with teal grid pattern, back link, issue meta (number, date, read time), title (Cormorant Garamond serif), subtitle, tag pills. Ends with a **hard edge** (no gradient fade).
3. **Cream Reading Surface** — Full-width `#f9f8f5` background (`.wib-reading-surface`), constrained content at 740px (`.wib-reading-container`). Hard color transition from dark hero above.
   - **Author Byline** (`.wib-author-byline`) — Photo (48px) + name + title + ShareButton, inside cream surface
   - **Article Body** (`.wib-issue-scope`) — 680px max-width, 18px body text, Cormorant Garamond headings, `#0F6E56` accent color, `dangerouslySetInnerHTML`
   - **Mid-Article Subscribe CTA** — Portal-rendered into `<div id="wib-mid-subscribe">` using `cream-inline` variant
   - **End-of-Article Mark** — Decorative SVG divider with horizontal lines
   - **Author Bio** (`.wib-author-bio`) — White card with photo (72px), bio paragraph, LinkedIn link
   - **Subscribe CTA** (`.wib-subscribe-cta`) — "Stay ahead of the data" with `cream-inline` subscribe form
   - **Share Button** (`.wib-bottom-share`) — Centered LinkedIn share
4. **Related Issues Section** — Back to dark `bg-[#050505]` with `border-t border-[#1a1a1a]`, 3-column card grid. Hard color transition from cream above.

**Mid-Article Subscribe Portal Pattern:**
Since `bodyHtml` is rendered via `dangerouslySetInnerHTML`, React components can't be embedded directly. Each issue's bodyHtml includes `<div id="wib-mid-subscribe"></div>` at the ~800-word mark. After render, a `useEffect` finds this DOM element and `createPortal` renders the `IntelligenceSubscribeForm variant="mid-article"` into it.

**Components** (`src/components/intelligence/`):
- `ReadingProgressBar.tsx` — 3px scroll-tracking bar, fixed at viewport top
- `AuthorByline.tsx` — Photo + name + title + ShareButton row
- `AuthorBioBox.tsx` — End-of-article author card with bio and LinkedIn link
- `ShareButton.tsx` — LinkedIn share link (opens new window)
- `IntelligenceSubscribeForm.tsx` — 5 variants: `inline-large` (archive hero), `inline-small` (bottom CTA), `compact` (footer), `mid-article` (cream-themed card for inside article), `cream-inline` (form-only, no card wrapper, for use inside cream-themed containers like subscribe CTA and mid-article portal)

**CSS** (`src/styles/wib-issue.css`):
- Full-width cream reading surface: `.wib-reading-surface` (`#f9f8f5` bg), `.wib-reading-container` (740px max, centered)
- Article body scoped under `.wib-issue-scope` (680px max, 18px/1.125rem body text, 1.75 line-height)
- Layout components: `.wib-author-byline`, `.wib-divider`, `.wib-end-mark`, `.wib-author-bio`, `.wib-subscribe-cta`, `.wib-bottom-share`
- Cream reading theme (`#f9f8f5` background, `#1a1a1a` text, Cormorant Garamond headings, forest green `#0F6E56` accents)
- Chart components: `.wib-chart`, `.wib-bar-*`, `.wib-line-*`, `.wib-stat-card`
- Drop-cap on first paragraph after stat cards (`.wib-stats + p::first-letter`)
- Chart captions (`.wib-chart-caption`): italic, smaller, gray
- Mid-subscribe portal target (`#wib-mid-subscribe`): margin spacing
- Callout boxes (`.wib-callout`): green gradient CTA blocks
- **Design rule:** Hard color transitions between dark hero / cream surface / dark related-issues. No gradient fades between zones.

**SEO:**
- `react-helmet-async` for per-issue meta tags (og:title, og:description, og:type=article, canonical URL)
- Schema.org `NewsArticle` JSON-LD in `<script type="application/ld+json">` via Helmet
- JSON-LD includes: headline, description, datePublished, author (Person), publisher (Organization), wordCount, keywords, isAccessibleForFree

**Subscribe System:**
- Subscribes via `subscribeToIntelligence()` from `src/lib/intelligence-queries.ts` (Supabase + Google Apps Script)
- Subscription state persisted in `localStorage` via `STORAGE_KEYS.WIB_SUBSCRIBED`
- Honeypot field for bot protection
- 5 source types tracked: `archive_page`, `issue_inline`, `homepage_footer`, `network_page`, `mid_article`

**Editorial Style Rules** (for future issues):
- No em-dashes — use commas or periods instead
- No Oxford commas — no comma before "and"/"or" in lists
- No formulaic section headers like "The Data Point", "The Insight", "The Question"
- Each chart should have a 1-2 sentence caption (`<p class="wib-chart-caption">`)
- Include `<div id="wib-mid-subscribe"></div>` at ~800-word mark
- Keep `wib-callout` blocks for zScale CTAs
- Keep legitimate external quotes in blockquotes
- Author info flows from issue data fields (authorName, authorPhoto, etc.)

### Texas Talent Pipeline Tracker

A public-facing tracker at `/tracker` that maps talent flows from Texas universities/colleges to the employers and industries that hire them, plus institutional expansions, corporate moves, innovation programs and site selection signals.

**Routes:**
- `/tracker` → `TrackerPage` — hero, stats strip, 5-tab filter (Pipelines default), entry card grid, subscribe form
- `/tracker/:slug` → `TrackerEntryPage` — entry detail with analysis callout, key metrics, citations, claim form, related entries

**Supabase Tables** (SQL: `sql/uta-workforce/24-tracker-tables.sql`):

| Table | Purpose | RLS |
|-------|---------|-----|
| `tracker_entries` | Core tracked events (pipeline, institution, company, innovation, site_selection) | anon SELECT where status='published' |
| `tracker_claims` | "Claim this entry" form submissions | anon INSERT |
| `tracker_subscribers` | Email subscribers to tracker digest | anon INSERT |
| `tracker_citations` | Press citations of tracker entries | anon SELECT |
| `pilot_pipeline` | Private CRM for conversion tracking | service_role only (NO anon) |

**Triggers:**
- `auto_create_pilot_from_claim()` — On INSERT to `tracker_claims` → creates `pilot_pipeline` row at stage `warm`
- `auto_create_pilot_from_subscriber()` — On INSERT to `tracker_subscribers` WHERE `is_edu_email` or `is_gov_email` → creates `pilot_pipeline` row at stage `cold`

**TypeScript Types** (`src/lib/tracker-types.ts`):
- `TrackerEntry`, `TrackerCategory` ('pipeline' | 'institution' | 'company' | 'innovation' | 'site_selection'), `TrackerClaim`, `TrackerCitation`, `PilotPipelineEntry`
- `TRACKER_CATEGORIES` — category metadata (label, color, bgColor)
- `PIPELINE_STAGES` and `PIPELINE_STAGE_LABELS` — CRM stage constants

**Query Functions** (`src/lib/tracker-queries.ts`):
```typescript
getTrackerEntries(category?, search?, limit?, offset?) → TrackerEntry[]
getTrackerEntryBySlug(slug) → TrackerEntry | null
getFeaturedEntries(limit = 3) → TrackerEntry[]
getTrackerStats() → { total, byCategory, lastUpdated }
submitTrackerClaim(claim) → { success, error }
submitTrackerSubscription(sub) → { success, error }
getCitationsForEntry(entryId) → TrackerCitation[]
getRecentCitations(limit = 10) → TrackerCitation[]
getPipelineEntries(stage?) → PilotPipelineEntry[]
updatePipelineEntry(id, updates) → { success, error }
getRecentTrackerEntries(days = 14) → TrackerEntry[]
```

**Components** (`src/components/tracker/`):
- `TrackerCard.tsx` — Entry card with category pill, hero stat badge, analysis callout (3px teal left border), supports `compact` prop for homepage
- `TrackerFilters.tsx` — 5-tab filter bar (Pipelines default), count badges, search input
- `TrackerSubscribeForm.tsx` — Email subscribe with inline/compact variants, honeypot bot protection
- `TrackerClaimForm.tsx` — Claim modal using shared Modal component
- `TrackerHeroStats.tsx` — Stats strip (total entries, categories, active pipelines, last updated)
- `CitedBySection.tsx` — Press citations display with publication links

**Admin Pages** (inside existing `AdminDashboard`, PIN-gated):
- `PipelineCRM.tsx` (`/dashboard/admin/pipeline`) — Stage counts, sortable table, inline stage dropdown, expandable notes, overdue date highlighting
- `NewsletterDraft.tsx` (`/dashboard/admin/newsletter-draft`) — Read-only markdown builder from last 14 days entries, grouped by category, copy-to-clipboard

**Homepage Integration:**
- Featured tracker section between feature blocks and published research
- Shows 3 `is_featured=true` entries using `TrackerCard compact` variant
- "Explore the full tracker" link to `/tracker`

**Form Types** added to `src/config/api.ts`:
- `FORM_TYPES.TRACKER_CLAIM` — tracker claim submissions
- `FORM_TYPES.TRACKER_SUBSCRIBE` — tracker digest subscriptions
- `FORM_TYPES.TOOL_WAITLIST` — tool waitlist signups

### Tool Placeholder Pages

4 upcoming tool pages at `/tools/*` sharing a single `ToolPlaceholderPage` component. Each displays a hero with title, subtitle, feature list, "Coming soon" badge, and email waitlist form.

**Tool definitions** (`src/data/tool-definitions.ts`):
- `region-comparison` — Compare talent pipelines across Texas MSAs (Q3 2026)
- `expansion-readiness` — 12-factor county readiness scoring (Q3 2026)
- `edc-directory` — Searchable directory of every Texas EDC (Q4 2026)
- `talent-source-finder` — Match job titles/SOC codes to producing institutions (Q4 2026)

**Waitlist system:**
- `src/lib/tool-waitlist.ts` — `joinToolWaitlist(email, toolKey)` inserts into Supabase `tool_waitlist` table + Google Apps Script fallback
- `sql/uta-workforce/25-tool-waitlist.sql` — Table with generated `email_domain`, `is_edu_email`, `is_gov_email` columns, `UNIQUE(email, tool_key)`, anon INSERT RLS
