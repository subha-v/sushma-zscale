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
- Google Apps Script endpoint for form submissions
- react-helmet-async for meta tag management

### Key Directories
- `src/pages/` - Route-level page components
- `src/pages/dashboards/` - Role-based dashboard pages (college, edc, student, twc)
- `src/components/` - Reusable UI components
- `src/components/IRI/` - Investment Readiness Index assessment flow
- `src/components/Diagnostic/` - Advisor Match diagnostic flow
- `src/components/tools/` - Interactive tools (equity calculator, investor list, etc.)
- `src/components/dashboard/` - Shared dashboard layout component
- `src/config/api.ts` - API endpoint, form type constants, localStorage helpers
- `src/lib/supabase.ts` - Supabase client, types, and data fetching functions
- `src/lib/mockData.ts` - Fallback demo data when Supabase tables are empty
- `src/lib/uta-queries.ts` - UTA workforce intelligence query functions and TypeScript interfaces
- `src/lib/uta-mock-data.ts` - Fallback demo data for UTA workforce tables
- `src/lib/agent-api.ts` - SSE client for AI agent Edge Function
- `sql/uta-workforce/` - SQL files (01-12) for UTA workforce dataset schema and data
- `src/hooks/` - Custom React hooks (scroll reveal, useChat)
- `src/hooks/useChat.ts` - Chat state management hook (messages, streaming, tool activity)
- `src/components/agent/` - AI agent chat UI components
- `src/data/` - Static data (investors, checklist questions, equity benchmarks)
- `supabase/functions/chat-agent/` - Supabase Edge Function for AI agent (Deno)
- `zscale-public/` - Standalone static HTML/CSS/JS version for B2G production
- `email-templates/` - Google Apps Script email templates

### Routes (App.tsx)
```
# Marketing Pages (with Header/Footer)
/                      - HomePage
/solutions             - SolutionsPage (tabbed: EDC, colleges, consultants)
/preview               - PreviewPage (free preview dashboard)
/about                 - AboutPage
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
Four role-based dashboards with shared `DashboardLayout` component (sidebar + header). Each dashboard:
- Checks auth via `getStoredUser()` from `src/lib/supabase.ts`
- Falls back to mock data from `src/lib/mockData.ts` when Supabase is empty
- Has its own `NAV_ITEMS` configuration for sidebar navigation

Demo login provides 8 test accounts (2 per role) stored in `DEMO_USERS` within `src/lib/supabase.ts`. Login falls back to local tokens when Supabase is unavailable. The demo login page also features an AI Agent card that links to `/agent`.

### AI Agent Chat System
A conversational AI interface at `/agent` powered by Claude Sonnet 4.6 via a Supabase Edge Function. Architecture:

```
Browser (React SPA) → POST /functions/v1/chat-agent (SSE stream)
  → Supabase Edge Function (Deno)
    ├── Calls Anthropic Messages API with 10 tool definitions
    ├── Executes Supabase queries when Claude uses tools
    └── Streams text deltas back as Server-Sent Events
```

**Backend** (`supabase/functions/chat-agent/`):
- `index.ts` - Main handler: CORS, SSE streaming, tool use loop (up to 8 rounds)
- `tools.ts` - 10 tool definitions (JSON schema) + executor map
- `queries.ts` - Deno-compatible Supabase query functions (port of `uta-queries.ts`) with mock data fallback
- `system-prompt.ts` - UTA Workforce Intelligence Agent persona and instructions

**Frontend**:
- `src/lib/agent-api.ts` - SSE client: POST to Edge Function, parse stream events
- `src/hooks/useChat.ts` - Chat state: messages, streaming, tool activity, abort controller
- `src/components/agent/ChatMessage.tsx` - Message bubbles with markdown rendering (bold, lists, tables, code)
- `src/components/agent/ChatInput.tsx` - Auto-resizing textarea with send/stop buttons
- `src/components/agent/SuggestedQuestions.tsx` - 4 categories of clickable question prompts
- `src/components/agent/ToolActivityIndicator.tsx` - Animated tool activity pills

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

9. **AI Agent via Supabase Edge Function** - Conversational AI chat uses a Supabase Edge Function (Deno) that calls the Anthropic Claude API with 10 tool definitions mapped to UTA workforce Supabase queries. SSE streaming sends text deltas and tool activity events to the React frontend. Deployed with `--no-verify-jwt` for public access. Mock data fallback ensures the agent works even when Supabase tables are empty.

## UTA Workforce Intelligence Dataset

A comprehensive Supabase dataset for a personalized AI agent serving UT Arlington's career center and workforce staff. Populated with real research data about UTA programs, Arlington employers, labor market statistics, and skills alignment.

### Supabase Tables (10 new tables)

| Table | Purpose | Records |
|-------|---------|---------|
| `uta_colleges` | UTA's 10 colleges/schools with enrollment, deans, URLs | ~10 |
| `uta_programs` | All academic programs (BS, BA, MS, PhD, etc.) across all colleges | ~180 |
| `uta_program_outcomes` | Graduation rates, starting salaries, employment rates, top employers per program | ~30 |
| `arlington_employers` | Arlington/DFW area employers with industry, size, UTA hiring flag | ~55 |
| `arlington_job_openings` | Representative job postings with salaries, skills, education requirements | ~80 |
| `arlington_development` | Economic development projects (Globe Life Field, GM plant, E-Space HQ, etc.) | ~15 |
| `arlington_industries` | Industry sectors with employment counts, wages, growth rates | ~18 |
| `uta_employer_partnerships` | Program-to-employer links (internships, co-ops, hiring pipelines, advisory boards) | ~50 |
| `uta_skills_alignment` | Skills gap analysis mapping program curricula to industry demands | ~90 |
| `arlington_labor_stats` | BLS/TWC labor market metrics (employment, wages, education, demographics) | ~60 |

### Key Data Points
- **UTA Facts:** 44,956 students, 9 colleges, 180+ programs, 54% 6-yr graduation rate, 75%+ employment within 6 months
- **Starting Salaries:** Nursing BSN $70,300, CS BS $68,300, SE BS $67,500, CompE BS $66,700, AeroE BS $66,000
- **Top Employers:** GM Assembly (5,200), Texas Health Resources (29,000 DFW), Lockheed Martin (18,000), Arlington ISD (8,400), Bell Textron (7,500), D.R. Horton (Fortune 500 HQ)
- **Labor Market:** Fort Worth-Arlington employment 1,212,800 (May 2025), Tarrant County avg weekly wages $1,501

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

Fallback mock data in `src/lib/uta-mock-data.ts` (5-10 records per table) for dev/demo when Supabase is unavailable.

### SQL Files

SQL files in `sql/uta-workforce/` are designed to be copy-pasted into Supabase SQL Editor in numbered order (01-12). All INSERTs use `ON CONFLICT DO NOTHING` for safe re-runs. Foreign keys use subquery references by name (not hardcoded UUIDs). RLS is enabled with public read policies on all tables.
