# Culi.Flow V1.1 Cockpit

Flow-state cockpit for kitchen operations with audit-grade logging, offline mode, and four outputs from one source.

## V1.1 Features

### Five Shells

1. **Ops Home** - One-glance readiness and next actions
   - 4 KPI tiles (Ticket Time, Prep Completion, Waste, Compliance)
   - Now lane with next 5 tasks sorted by service risk
   - Today's service timeline with run-of-show blocks

2. **Service Mode** - Expo board under pressure
   - Board columns: Backlog → Firing → Plating → Running → Done
   - Big clock with fire window cues
   - Focus mode (hides rail and non-critical widgets)
   - One-tap task completion

3. **Production Mode** - Assign, timebox, verify
   - Stations list (Hot Line, Garde, Bakery, Dish, Utility, Central)
   - Prep board with shared column component
   - Right drawer with recipe details, yields, allergens, holding notes

4. **Standards Mode** - Guided plating portfolio workflow
   - Week selector (Sunday start, locked)
   - Intake lanes: Shoot → Star → Sync → Review Monday
   - Album indicators (missing plates, late uploads, review due)
   - Review packet generator

5. **Analytics** - Decisions only
   - 4 decision panels with 14-day trends
   - Ticket time, waste, compliance, and standards metrics
   - Top exceptions list for each panel
   - Week-over-week deltas

### Navigation

- **Left Rail**: 5 icons (Home, Service, Production, Standards, Analytics)
- **Top Command Bar**: Global search, Quick Add, notifications, profile
- **Command Palette**: `Cmd/Ctrl + K` for fast actions

### Flow-State Features

1. **Focus Mode**: One tap to hide rail, enlarge active lane, show big clock
2. **Smart Defaults**: Sunday week start, default durations (5, 10, 15, 30, 60)
3. **Fast Capture**: Shorthand parser for quick task creation
   - Example: `prep 10 chicken stock 2gal @garde 9a #mike !critical /temp +oak`
4. **Minimal Alerts**: Only 3 types (overdue critical, prep blocker, standards review)

### Audit & Compliance

- **EventLog**: Every user action timestamped with actor, action, and payload
- **IndexedDB Persistence**: All data stored locally with localStorage cache
- **Compliance Record Export**: CSV and PDF with timestamps and evidence links
- **Director Summary**: One-click generation with on-track/at-risk status
- **Evidence Pack**: Bundled export with summary, compliance, exceptions, and standards

### Offline Mode

- **PWA Install**: Installable progressive web app
- **Offline Degraded Mode**: Works without network after first install
- **Print View**: Paper mirror for emergency procedures
- **Event Queue**: Actions logged offline, synced when online

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Quick Add Syntax

Create tasks with one-line shorthand:

```
[type] [duration] [title] [quantity] @station [time] #owner !priority /compliance +concept
```

**Examples:**

```
prep 10 chicken stock 2gal @garde 9a
service ribeye plating @hotline 5:30p !critical
compliance temp log @utility !critical /temp
standards ribeye photo #mike +oak
```

**Syntax Reference:**

- `type`: prep, service, admin, standards, compliance
- `duration`: minutes (number only)
- `@station`: @garde, @hotline, @bakery, @dish, @utility, @central
- `time`: 9a, 14:30, 5:30p
- `#owner`: username
- `!priority`: !critical, !high, !medium
- `/compliance`: /temp, /testmeal, /mealround, /fifo
- `+concept`: +oak, +elements, +loons

## Command Palette Actions

Press `Cmd/Ctrl + K` to open:

- Add prep task
- Start batch
- Assign owner
- Log issue
- Add plating note
- Jump to week
- Generate director summary
- Export compliance record
- Export evidence pack

## Export Capabilities

### Director Summary
- One-click PDF generation
- On-track or at-risk assessment
- Missed critical and compliance tasks
- Top misses and blockers
- Decisions needed
- Next shift risks

### Compliance Record
- CSV export with all compliance events
- PDF print view for audits
- Timestamps, actors, actions, evidence links
- Filterable by date range and compliance type

### Evidence Pack
- Comprehensive audit bundle
- Director summary included
- Full compliance record
- Exceptions list
- Standards review packet
- Evidence photo links

## V1.1 Acceptance Tests

1. **New-person test**: Complete 5 tasks and generate director summary in under 5 minutes
2. **Slammed-service test**: Run Service Mode with focus for 20 minutes, one-gesture completion
3. **Offline test**: Load in airplane mode, log events, export compliance
4. **Director summary test**: Generate director-ready summary in under 3 minutes
5. **Audit record test**: Export event log with timestamps and metadata
6. **14-day proof test**: Analytics shows trends with week-over-week deltas

## Architecture

### Data Model

**Task**
- Core entity with type, concept, station, owner, priority, status
- Compliance tracking with evidence requirements
- Full audit trail in EventLog

**EventLog**
- Every action logged with ISO timestamp
- Actor, action type, task ID, payload snapshot
- Powers compliance exports and analytics

**DailySummary**
- Auto-generated from tasks and events
- Missed critical/compliance, blockers, wins, risks
- Basis for director summary

### Persistence

- **IndexedDB**: Primary storage for tasks, events, summaries
- **localStorage**: Fast-boot cache for active tasks
- **Offline-first**: All writes go to IndexedDB, sync when online

### Visual System

- Glass panels with soft borders and backdrop blur
- High contrast typography with clear hierarchy
- 120-180ms transitions, no bounce
- Print-optimized for paper backup

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast builds and HMR
- **Tailwind CSS** for utility-first styling
- **React Router** for shell navigation
- **IndexedDB** (via idb) for persistence
- **date-fns** for date handling
- **lucide-react** for icons
- **jsPDF** for PDF exports
- **Papaparse** for CSV exports
- **Vite PWA Plugin** for offline support

## Development

### Sample Data

On first load, the app seeds 14 sample tasks across all types, stations, and priorities.

To re-seed:
1. Open browser DevTools → Application → IndexedDB
2. Delete `culiflow-v1` database
3. Refresh the page

### Focus Mode

Toggle focus mode in Service Mode to:
- Hide left rail and top command bar
- Show big clock prominently
- Enlarge board columns
- Remove distractions

### Print Mode

Use browser print (`Cmd/Ctrl + P`) to generate paper backup:
- Optimized layout for letter/A4
- High contrast for readability
- All glass effects removed
- Navigation hidden

## Deployment

Built with Vite for optimal production bundles:

```bash
npm run build
```

Output in `dist/` ready for:
- Static hosting (Vercel, Netlify, Cloudflare Pages)
- S3 + CloudFront
- GitHub Pages
- Any static file server

PWA manifest and service worker included for offline install.

## License

Proprietary - Culi.Flow V1.1

---

Built for flow-state kitchen operations with audit-grade compliance.
