# Culi.Flow V1.1

**Flow-state cockpit for kitchen operations with audit-grade logging**

## Quick Start

```bash
cd client
npm install
npm run dev
```

Visit http://localhost:5173

## What's Included

**Five Operational Shells:**
- **Ops Home** - KPI tiles, Now lane, Today timeline
- **Service Mode** - Expo board with Focus mode and big clock
- **Production Mode** - Stations, prep board, recipe drawer
- **Standards Mode** - Week selector, plating workflow
- **Analytics** - 14-day trends with decision panels

**Core Features:**
- Audit-grade EventLog with IndexedDB persistence
- Quick Add with shorthand parser (`prep 10 chicken stock 2gal @garde 9a`)
- Command Palette (Cmd/Ctrl + K)
- Director summary, compliance records, evidence packs
- iCalendar export for task scheduling
- Daily report generation (email-ready)
- PWA with offline support

## Documentation

See [client/README.md](client/README.md) for complete documentation, architecture details, and acceptance tests.

## Tech Stack

- React 18 + TypeScript
- Vite build system
- Tailwind CSS v3
- IndexedDB for offline-first persistence
- PWA with service worker

## Build & Deploy

```bash
cd client
npm run build
```

Output in `client/dist/` ready for static hosting (Vercel, Netlify, Cloudflare Pages, etc.)

---

**License:** Proprietary - Culi.Flow V1.1
