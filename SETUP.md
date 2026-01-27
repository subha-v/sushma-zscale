# zScale Capital - React/TypeScript Setup

## Project Overview

This is a modern TypeScript/React/Vite rewrite of the zScale Capital landing page. All content, brand colors, typography, and visual design have been preserved from the original HTML version.

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Custom Fonts** - Instrument Serif (headings) & Satoshi (body)

## Brand Colors

The following brand colors are configured in Tailwind:

- `dark-green`: #283618 - Primary brand color, headers, buttons
- `light-sage`: #B7B7A4 - Secondary elements, backgrounds
- `soft-gray`: #D4D4D4 - Subtle backgrounds, borders
- `off-white`: #F0EFEB - Page background
- `accent-teal`: #2A9D8F - CTAs, highlights, accent elements
- `accent-teal-dark`: #238276 - Hover states for teal

## Project Structure

```
sushma-zscale/
├── src/
│   ├── components/
│   │   ├── Header.tsx       # Fixed header with navigation
│   │   ├── Hero.tsx         # Hero section with CTA
│   │   ├── Metrics.tsx      # North Texas Venture Pulse
│   │   ├── Process.tsx      # 3-step process cards
│   │   ├── Resources.tsx    # Founder's Survival Kit
│   │   ├── Advisors.tsx     # Dallas Advisor Network
│   │   ├── FAQ.tsx          # Accordion FAQ section
│   │   ├── Newsletter.tsx   # Email signup form
│   │   └── Footer.tsx       # Footer with links
│   ├── hooks/
│   │   └── useScrollReveal.ts  # Intersection Observer hook
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # React entry point
│   └── index.css           # Global styles & Tailwind
├── index.html              # HTML entry point
├── tailwind.config.js      # Tailwind configuration
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## Installation

### Prerequisites

You may need to fix npm cache permissions first:

```bash
sudo chown -R $(whoami) "/Users/$(whoami)/.npm"
```

### Install Dependencies

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The site will be available at `http://localhost:5173`

## Build for Production

Build the optimized production bundle:

```bash
npm run build
```

The output will be in the `dist/` directory.

## Preview Production Build

After building, preview the production version:

```bash
npm run preview
```

## Features Implemented

### ✅ All Original Content Preserved
- Exact same text, links, and CTAs
- All sections from original HTML
- Complete SEO meta tags

### ✅ Brand Identity Maintained
- Instrument Serif for headings
- Satoshi for body text
- Exact color palette
- Same visual hierarchy

### ✅ Animations & Interactions
- Scroll reveal animations using Intersection Observer
- Smooth transitions with custom easing functions
- FAQ accordion functionality
- Mobile menu toggle
- Hover states and micro-interactions

### ✅ Responsive Design
- Mobile-first approach
- Breakpoints for tablet and desktop
- Adaptive layouts for all screen sizes

### ✅ Modern Development
- TypeScript for type safety
- React hooks (useState, useEffect)
- Component-based architecture
- Fast HMR (Hot Module Replacement) with Vite
- Tailwind CSS for maintainable styling

## Key Differences from Original HTML

1. **Component-Based**: Each section is now a reusable React component
2. **Type Safety**: TypeScript provides compile-time type checking
3. **Build Step**: Uses Vite for optimized production builds
4. **CSS Approach**: Tailwind utility classes instead of custom CSS
5. **State Management**: React hooks for interactive features (FAQ, mobile menu)

## Deployment

The built site can be deployed to any static hosting service:

- **Netlify**: Drop the `dist` folder or connect via Git
- **Vercel**: Import the repository or use Vercel CLI
- **GitHub Pages**: Push `dist` to gh-pages branch
- **AWS S3**: Upload `dist` contents to S3 bucket
- **Cloudflare Pages**: Connect repository

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Notes

- The original `index.html` has been renamed to `index-old.html` for reference
- All external links point to the actual zScale Capital URLs
- The scroll reveal animations use the same timing as the original
- Font loading is optimized with Google Fonts preconnect
