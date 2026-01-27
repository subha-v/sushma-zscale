# zScale Capital Website

A modern, performant, SEO-friendly landing page for zScale Capital - the North Texas Startup Ecosystem Hub.

## 🚀 Quick Start

```bash
# Fix npm permissions (if needed)
sudo chown -R $(whoami) "/Users/$(whoami)/.npm"

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📋 Overview

This is a modern TypeScript/React/Vite application that provides the same content and design as the original HTML version, but with improved maintainability, type safety, and developer experience.

## ✨ Features

- **Modern Tech Stack**: React 18 + TypeScript + Vite + Tailwind CSS
- **SEO Optimized**: Comprehensive meta tags, Open Graph data, and semantic HTML
- **Fully Responsive**: Mobile-first design optimized for all devices
- **Smooth Animations**: Scroll-reveal animations and micro-interactions
- **Accessibility**: Proper ARIA labels, semantic markup, and keyboard navigation
- **Type Safety**: TypeScript for catching errors at compile time
- **Fast Development**: Hot Module Replacement (HMR) with Vite

## 🎨 Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Dark Green | `#283618` | Primary brand color, headers, buttons |
| Light Sage | `#B7B7A4` | Secondary elements, backgrounds |
| Soft Gray | `#D4D4D4` | Subtle backgrounds, borders |
| Off-White | `#F0EFEB` | Page background |
| Accent Teal | `#2A9D8F` | CTAs, highlights, accent elements |

## 📦 Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **Typography**: Instrument Serif (display) + Satoshi (body)
- **Animations**: CSS transitions with Intersection Observer API

## 📂 Project Structure

```
src/
├── components/          # React components for each section
│   ├── Header.tsx      # Navigation header
│   ├── Hero.tsx        # Hero section
│   ├── Metrics.tsx     # Statistics section
│   ├── Process.tsx     # 3-step process
│   ├── Resources.tsx   # Resource cards
│   ├── Advisors.tsx    # Advisor network
│   ├── FAQ.tsx         # FAQ accordion
│   ├── Newsletter.tsx  # Email signup
│   └── Footer.tsx      # Site footer
├── hooks/              # Custom React hooks
│   └── useScrollReveal.ts
├── App.tsx            # Main application
├── main.tsx           # React entry point
└── index.css          # Global styles
```

## 🛠️ Development

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm or yarn

### Local Development

```bash
# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🚢 Deployment

The built site can be deployed to any static hosting service:

1. **Build the project**: `npm run build`
2. **Deploy the `dist/` folder** to:
   - Netlify
   - Vercel
   - GitHub Pages
   - AWS S3 + CloudFront
   - Cloudflare Pages

## 📱 Sections

1. **Hero** - Main value proposition with CTAs and key stats
2. **Metrics** - North Texas Venture Pulse statistics
3. **Process** - 3-step readiness system (Audit, Optimize, Deploy)
4. **Resources** - Founder's Survival Kit tools
5. **Advisors** - Dallas Advisor Network showcase
6. **FAQ** - Common questions with accordion UI
7. **Newsletter** - Dallas Startup Weekly signup
8. **Footer** - Navigation links and social media

## 🔗 Links

- [Live Site](https://zscalecapital.com)
- [LinkedIn](https://linkedin.com/company/zscale-capital)
- [Twitter/X](https://x.com/zScaleCapital)

## 📄 License

Copyright 2026 zScale Capital. All rights reserved.

---

For detailed setup instructions, see [SETUP.md](./SETUP.md)
