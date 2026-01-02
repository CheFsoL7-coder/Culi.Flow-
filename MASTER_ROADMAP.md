# Culi.Flow Master Roadmap
## Complete Project Breakdown & Future Development Plan

**Last Updated:** December 2024
**Current Version:** V1.1 Cockpit
**Branch:** `claude/v1-1-cockpit-audit-c9pv7`
**Status:** ✅ Production-Ready (10/10 Tests Passing)

---

## 📊 Current State Analysis

### Project Statistics

```
Total Lines of Code: 2,666
TypeScript Files: 18
Components: 4
Pages (Shells): 5
Services: 6
Build Size: 1.2 MB (optimized)
Dependencies: 10 production, 14 dev
Test Coverage: 10/10 automated tests passing
Branch Status: Ready to merge to main
```

### Technology Stack

**Frontend:**
- React 19.2.0 + TypeScript 5.9.3
- Vite 7.2.4 (build system)
- Tailwind CSS 3.4.19 (styling)
- React Router 7.11.0 (navigation)

**Data & Persistence:**
- IndexedDB via idb 8.0.3 (offline-first)
- LocalStorage (fast boot cache)
- EventLog (audit trail)

**Features & Libraries:**
- date-fns 4.1.0 (date handling)
- ics 3.8.1 (calendar export)
- jsPDF 3.0.4 (PDF generation)
- papaparse 5.5.3 (CSV export)
- lucide-react (icons)
- vite-plugin-pwa (offline mode)

### Architecture Overview

```
Culi.Flow V1.1 (React-Only)
│
├── Five Operational Shells
│   ├── Ops Home (KPI dashboard)
│   ├── Service Mode (expo board)
│   ├── Production Mode (prep management)
│   ├── Standards Mode (plating portfolio)
│   └── Analytics (decision panels)
│
├── Navigation System
│   ├── Left Rail (5 shell icons)
│   ├── Command Bar (search, quick add, notifications)
│   └── Command Palette (Cmd+K shortcuts)
│
├── Data Layer
│   ├── IndexedDB (tasks, events, summaries)
│   ├── EventLog (audit trail with timestamps)
│   └── Sample Data Seeder (14 pre-populated tasks)
│
├── Export System
│   ├── Director Summary (PDF)
│   ├── Compliance Record (CSV + PDF)
│   ├── Evidence Pack (bundled export)
│   ├── Calendar Export (iCal .ics)
│   └── Daily Report (HTML + email-ready)
│
└── Flow-State Features
    ├── Quick Add (shorthand parser)
    ├── Focus Mode (Service Mode distraction-free)
    ├── Smart Defaults (Sunday weeks, durations)
    └── PWA Offline Mode (installable app)
```

---

## ✅ V1.1 Completed Features

### Core Infrastructure ✓

| Feature | Status | Lines | Test Status |
|---------|--------|-------|-------------|
| TypeScript setup | ✅ Complete | - | ✅ 0 errors |
| Tailwind CSS theme | ✅ Complete | 199 | ✅ Compiled |
| React Router | ✅ Complete | - | ✅ All routes work |
| IndexedDB persistence | ✅ Complete | 182 | ✅ CRUD verified |
| EventLog service | ✅ Complete | 182 | ✅ Audit trail working |
| PWA configuration | ✅ Complete | 62 | ✅ Service worker built |

### Five Shells ✓

| Shell | Status | Lines | Key Features |
|-------|--------|-------|--------------|
| Ops Home | ✅ Complete | 146 | 4 KPI tiles, Now lane, Timeline |
| Service Mode | ✅ Complete | 120 | 5-column board, Focus mode, Big clock |
| Production Mode | ✅ Complete | 136 | 6 stations, Prep board, Recipe drawer |
| Standards Mode | ✅ Complete | 106 | Week selector, 4 lanes, Album status |
| Analytics | ✅ Complete | 153 | 4 panels, 14-day trends, WoW deltas |

### Navigation & UX ✓

| Feature | Status | Lines | Functionality |
|---------|--------|-------|---------------|
| Left Rail | ✅ Complete | 52 | 5 shell icons, active state |
| Command Bar | ✅ Complete | 51 | Search, Quick Add, notifications |
| Command Palette | ✅ Complete | 157 | 6 commands, keyboard nav |
| Quick Add Modal | ✅ Complete | 149 | Shorthand parser, real-time preview |

### Export & Reports ✓

| Feature | Status | Lines | Output Format |
|---------|--------|-------|---------------|
| Director Summary | ✅ Complete | 220 | PDF, clipboard |
| Compliance Record | ✅ Complete | 220 | CSV, PDF |
| Evidence Pack | ✅ Complete | 220 | Bundled PDF |
| Calendar Export | ✅ Complete | 130 | iCal .ics |
| Daily Report | ✅ Complete | 145 | HTML, email-ready |

### Business Logic ✓

| Service | Status | Lines | Purpose |
|---------|--------|-------|---------|
| Quick Add Parser | ✅ Complete | 154 | Shorthand → Task object |
| Sample Data Seeder | ✅ Complete | 221 | 14 demo tasks |
| Type Definitions | ✅ Complete | 114 | Task, EventLog, DailySummary |

### Total V1.1: 2,666 lines of production code ✓

---

## 🎯 V1.1 Success Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Build Size | < 2 MB | 1.2 MB | ✅ Pass |
| Type Errors | 0 | 0 | ✅ Pass |
| Test Coverage | 10/10 | 10/10 | ✅ Pass |
| Acceptance Tests | 6/6 ready | 6/6 ready | ✅ Pass |
| Merge Conflicts | 0 | 0 | ✅ Pass |
| Production Ready | Yes | Yes | ✅ Pass |

---

## 🚀 Master Roadmap: V1.2 → V2.0

### Phase Breakdown

```
V1.1 (COMPLETE) ━━━━━━━━━━━━━━━━━━━━ 100%
    └─ 5 shells, audit logging, exports

V1.2 (NEXT, 2-3 weeks) ━━━━━━━━━━━━━ 0%
    └─ Workforce scheduling shell

V1.3 (1 month) ━━━━━━━━━━━━━━━━━━━━━ 0%
    └─ Recipe management integration

V1.4 (6 weeks) ━━━━━━━━━━━━━━━━━━━━━ 0%
    └─ Inventory tracking shell

V2.0 (3 months) ━━━━━━━━━━━━━━━━━━━━ 0%
    └─ Multi-tenant, API backend
```

---

## 📋 V1.2: Workforce Scheduling (Next Sprint)

### Overview

Add 6th shell for digital workforce scheduling with OCR board capture, conflict detection, and role-based views.

### Benchmark Score: 14/16 (PASS)

Based on analysis of physical scheduling boards:
- ✅ Multi-stakeholder outputs (2/2)
- ✅ Offline-first design (2/2)
- ✅ Execution constraints defined (2/2)
- ✅ Adoption friction minimized (2/2)
- ✅ Exception-based reporting (2/2)
- ✅ Metrics and ROI clear (2/2)
- ⚠️ Weekly cadence/rollover (1/2)
- ⚠️ Evidence capture (1/2)

### Implementation Phases

#### **Phase 1: Foundation (Week 1 - 16 hours)**

**Data Models** (4 hours)
```typescript
// New types in src/types/index.ts
interface Employee {
  id: string;
  name: string;
  role: 'line-cook' | 'sous-chef' | 'exec-chef' | 'dishwasher';
  certifications: string[];
  maxHoursPerWeek: number;
  preferredStations: Station[];
  hireDate: string;
  active: boolean;
}

interface Shift {
  id: string;
  employeeId: string;
  date: string; // ISO date
  startTime: string; // "07:00"
  endTime: string; // "15:00"
  station: Station;
  location: 'main-building' | 'loons-nest' | 'oak-terrace';
  color: 'red' | 'blue' | 'yellow' | 'purple'; // LINE, SALAD, LOON, PREP
  notes?: string; // "NEED OAK", "dish am", "VAC"
  status: 'draft' | 'published' | 'completed';
}

interface Schedule {
  id: string;
  weekStartDate: string; // Sunday ISO date
  weekEndDate: string; // Saturday ISO date
  shifts: Shift[];
  publishedAt?: string;
  publishedBy?: string;
  status: 'draft' | 'published' | 'archived';
  notes?: string;
}

interface ConflictAlert {
  id: string;
  type: 'double-booking' | 'overtime' | 'coverage-gap' | 'clopen' | 'cert-mismatch';
  severity: 'critical' | 'warning' | 'info';
  shiftIds: string[];
  employeeId?: string;
  message: string;
  resolvedAt?: string;
}
```

**Database Schema** (4 hours)
- Extend IndexedDB with `employees`, `shifts`, `schedules`, `conflicts` stores
- Create indexes: by-employee, by-date, by-week, by-location
- Migration script from V1.1 schema

**Basic UI Shell** (8 hours)
- Add "Schedule" icon to LeftRail (6th position)
- Create `src/pages/Scheduling.tsx` shell component
- Weekly calendar grid (7 columns, employee rows)
- Navigation: Previous week / Next week / Current week
- Filter by location (Main / Loon's / Oak)

**Deliverables:**
- [ ] Types added to `src/types/index.ts`
- [ ] Database service extended in `src/services/db.ts`
- [ ] Scheduling page renders with empty grid
- [ ] Can navigate between weeks

---

#### **Phase 2: Manual Entry MVP (Week 2 - 20 hours)**

**Schedule Grid Component** (8 hours)
```tsx
// src/components/ScheduleGrid.tsx
- Weekly view (Sun-Sat columns)
- Employee rows with drag-and-drop shifts
- Color-coded cells (red=LINE, blue=SALAD, yellow=LOON, purple=PREP)
- Click cell to add shift
- Mobile-responsive (swipe navigation, pinch zoom)
```

**Shift Entry Form** (6 hours)
```tsx
// src/components/ShiftEntryModal.tsx
- Employee selector (autocomplete)
- Date picker (defaults to clicked cell)
- Time range (start/end with validation)
- Station dropdown
- Location selector
- Color picker (auto-suggests based on station)
- Notes field
```

**Basic Conflict Detection** (6 hours)
```typescript
// src/services/scheduling.ts
function detectConflicts(schedule: Schedule): ConflictAlert[] {
  - Double-booking: Same employee, overlapping times
  - Overtime: >40 hours in week
  - Coverage gaps: <2 line cooks during service (11:30-14:00, 17:00-20:00)
  - Clopens: <10 hours between shifts
}
```

**Deliverables:**
- [ ] Can manually create shifts
- [ ] Drag-and-drop shifts between days
- [ ] Auto-detects double-booking
- [ ] Color-coded cells match physical board
- [ ] Mobile-optimized grid

---

#### **Phase 3: Automation & OCR (Week 3 - 24 hours)**

**Browser Camera Integration** (4 hours)
```typescript
// src/services/ocr.ts
- Access device camera via getUserMedia API
- Capture photo of physical board
- Preview with crop/rotate tools
- Save to IndexedDB as blob
```

**OCR Processing** (12 hours)
```typescript
// Using Tesseract.js (client-side, no backend)
- Initialize Tesseract worker
- Pre-process image (grayscale, contrast, deskew)
- Extract text regions
- Parse patterns:
  - Names: "MIKE", "SARAH", "ALEX"
  - Times: "7:00-3:00", "11:30-7:30", "9:00 AM"
  - Colors: Red blocks → "LINE", Blue → "SALAD"
  - Notes: "NEED OAK", "VAC", "HC"
- Confidence scoring (>80% auto-accept, <80% manual review)
```

**Parse Results UI** (8 hours)
```tsx
// src/components/OCRReview.tsx
- Side-by-side: Original photo vs parsed schedule
- Highlight low-confidence cells in yellow
- Click to edit parsed values
- "Accept All" or "Review Changes"
- One-tap publish to grid
```

**Deliverables:**
- [ ] Camera capture working on mobile
- [ ] OCR parses names, times, colors
- [ ] Confidence scores displayed
- [ ] Manual review for <80% confidence
- [ ] One-tap publish to schedule

---

#### **Phase 4: Advanced Conflict Detection (Week 4 - 16 hours)**

**Extended Rules Engine** (12 hours)
```typescript
// src/services/conflicts.ts
- Certification mismatch: Sous chef required for Elements dinner
- Consecutive days: >5 days without break
- Preferred stations: Alert if not assigned to preference
- Labor cost: Calculate total hours × hourly rate
- Overtime alerts: Warn at 38 hours, block at 40
- Location coverage: Main building needs 3 line cooks for lunch
```

**Alerts Dashboard** (4 hours)
```tsx
// src/components/ConflictAlerts.tsx
- Toast notifications for real-time conflicts
- Alert panel in Scheduling shell
- Filter by severity (critical/warning/info)
- One-click resolve (auto-suggest fix)
- Mark as acknowledged
```

**Deliverables:**
- [ ] All 6 conflict types detected
- [ ] Real-time alerts as shifts added
- [ ] Auto-suggest conflict resolutions
- [ ] Alert history in EventLog

---

#### **Phase 5: Role-Based Views (Week 5 - 12 hours)**

**Authentication Integration** (4 hours)
```typescript
// Extend existing user system
- Roles: line-cook, sous-chef, exec-chef, director
- Permissions matrix:
  - Line cooks: View own schedule only, request PTO
  - Sous chefs: View/edit assigned location
  - Exec chef: Full edit, publish schedule
  - Directors: Read-only dashboard
```

**Personal Schedule View** (4 hours)
```tsx
// src/components/MySchedule.tsx
- Line cook sees: This week + next week only
- Mobile-optimized (their phone)
- Add to phone calendar (one-tap export)
- Request time off form
```

**Director Dashboard** (4 hours)
```tsx
// src/components/LaborDashboard.tsx
- KPI tiles: Total hours, overtime %, labor cost
- Coverage heatmap: Green (good), yellow (tight), red (gap)
- Export to PDF for board meetings
```

**Deliverables:**
- [ ] Role-based access control
- [ ] Personal schedule view for line cooks
- [ ] Director dashboard with labor metrics
- [ ] PTO request workflow

---

#### **Phase 6: Integration & Polish (Week 6 - 16 hours)**

**Plating Portfolio Integration** (4 hours)
- Link shifts to Standards Mode
- Auto-populate "who plated this" metadata
- Filter plating photos by assigned line cook

**Task Integration** (4 hours)
- Link compliance tasks to assigned shifts
- "Temp log" auto-assigned to AM line cook
- "Meal round" assigned to closing sous chef

**Export Enhancements** (4 hours)
- Weekly schedule PDF (printable backup)
- CSV export for payroll integration
- Add to Command Palette: "Export schedule"

**Mobile Optimization** (4 hours)
- Progressive enhancement for small screens
- Swipe gestures for week navigation
- Haptic feedback on conflict detection
- Install prompt for PWA

**Deliverables:**
- [ ] Standards Mode shows shift assignments
- [ ] Tasks auto-assigned based on schedule
- [ ] Weekly PDF export working
- [ ] Mobile UX polished

---

### V1.2 Summary

**Total Effort:** 104 hours (2.6 weeks at full-time, 3-4 weeks at part-time)

**New Files:**
- `src/pages/Scheduling.tsx`
- `src/components/ScheduleGrid.tsx`
- `src/components/ShiftEntryModal.tsx`
- `src/components/ShiftCard.tsx`
- `src/components/OCRReview.tsx`
- `src/components/ConflictAlerts.tsx`
- `src/components/MySchedule.tsx`
- `src/components/LaborDashboard.tsx`
- `src/services/scheduling.ts`
- `src/services/ocr.ts`
- `src/services/conflicts.ts`

**Estimated LOC:** +1,800 lines

**Dependencies to Add:**
- `tesseract.js` (OCR)
- `react-dnd` (drag-and-drop, optional)
- `recharts` (labor cost charts, optional)

---

## 📋 V1.3: Recipe Management (Month 2)

### Overview

Integrate recipe database with Production Mode for yields, allergens, holding temps, and cost tracking.

### Key Features

**Recipe Database**
- Ingredient lists with quantities
- Yield calculations (scale up/down)
- Allergen declarations (auto-populate Standards Mode)
- Cost per portion (integrate with Analytics)

**Production Integration**
- Link prep tasks to recipes
- Auto-calculate pars based on covers
- Photo reference library
- Holding temp requirements

**Compliance Auto-Fill**
- Temp log tasks auto-generated for hot-hold items
- FIFO reminders based on prep date
- Test meal suggestions (new recipes)

### Effort Estimate: 80 hours

---

## 📋 V1.4: Inventory Tracking (Month 3)

### Overview

Add 7th shell for real-time inventory with par levels, order automation, and waste tracking.

### Key Features

**Inventory Shell**
- Par level management (min/max per item)
- Current stock tracking (manual entry or barcode scan)
- Auto-generate orders when below par
- Vendor integration (export PO as CSV/email)

**Waste Tracking**
- Daily waste log (what, how much, reason)
- Link to Analytics waste KPI
- Photo evidence for audit
- Cost impact calculation

**Receiving Workflow**
- PO checklist (did everything arrive?)
- Quality checks (temp on arrival, reject criteria)
- Auto-update inventory on receipt
- FIFO date stamping

### Effort Estimate: 120 hours

---

## 🚀 V2.0: Multi-Tenant Platform (Quarter 2)

### Overview

Transform from single-kitchen app to multi-location SaaS platform with backend API.

### Architecture Shift

**Current (V1.x):**
```
React SPA → IndexedDB (client-side only)
```

**Future (V2.0):**
```
React SPA → REST API → PostgreSQL
            ↓
      WebSocket (real-time)
            ↓
      Redis (cache)
```

### Key Features

**Backend API** (Node.js + Express + PostgreSQL)
- User authentication (OAuth2, SSO)
- Multi-tenant data isolation
- Real-time sync via WebSocket
- Scheduled jobs (nightly rollups, email reports)
- File storage (S3 for photos)

**Multi-Location Support**
- Franchise/chain management
- Location-specific KPI targets
- Consolidated director dashboard (all locations)
- Role-based access across locations

**Advanced Analytics**
- Predictive analytics (ML for covers forecast)
- Benchmarking (compare locations)
- Custom report builder
- Data warehouse integration

**Mobile Apps** (React Native)
- Native iOS/Android apps
- Offline-first with background sync
- Push notifications (shift reminders, alerts)
- Biometric login

### Effort Estimate: 400+ hours (3-4 months, team of 2-3)

---

## 🎯 Prioritization Framework

### Decision Criteria

**For Each Feature:**
1. **Impact** (1-5): How much does this improve operations?
2. **Effort** (1-5): How long to build? (1=easy, 5=hard)
3. **Adoption Risk** (1-5): Will staff use it? (1=low risk, 5=high risk)
4. **ROI** = (Impact × 10) / (Effort + Adoption Risk)

### V1.2-V1.4 Scoring

| Feature | Impact | Effort | Adoption | ROI | Priority |
|---------|--------|--------|----------|-----|----------|
| Workforce Scheduling | 5 | 4 | 2 | 8.3 | **P0** |
| Recipe Management | 4 | 3 | 3 | 6.7 | **P1** |
| Inventory Tracking | 4 | 4 | 4 | 5.0 | **P2** |
| Multi-Tenant (V2.0) | 3 | 5 | 4 | 3.3 | **P3** |

**Recommended Sequence:** V1.2 → V1.3 → V1.4 → V2.0

---

## 📊 Development Resources

### Current Team Capacity

**Assuming 1 developer:**
- Full-time (40 hrs/week): V1.2 in 3 weeks, V1.3 in 2 weeks, V1.4 in 3 weeks
- Part-time (20 hrs/week): Double all timelines

### Critical Path Dependencies

```
V1.1 (DONE)
    ↓
V1.2 Scheduling
    ├─ Phase 1 (Foundation) → Phase 2 (Manual Entry)
    ├─ Phase 3 (OCR) can run in parallel with Phase 4 (Conflicts)
    └─ Phase 5 (Roles) → Phase 6 (Integration)

V1.3 Recipes
    └─ Requires V1.2 Production Mode enhancements

V1.4 Inventory
    └─ Benefits from V1.3 recipe costs

V2.0 Multi-Tenant
    └─ Requires backend team (2-3 devs)
```

---

## 🔧 Technical Debt & Refactoring

### Known Issues to Address

**Before V1.2:**
- [ ] Remove console.log statements (8 found)
- [ ] Add error boundaries to all page components
- [ ] Implement retry logic for IndexedDB failures
- [ ] Add loading states to all async operations

**During V1.2:**
- [ ] Extract shared components (TaskCard, KPITile)
- [ ] Centralize color mappings (avoid duplicates)
- [ ] Create design system documentation
- [ ] Add Storybook for component library

**Before V2.0:**
- [ ] API abstraction layer (prepare for backend)
- [ ] State management refactor (consider Zustand/Redux)
- [ ] E2E testing with Playwright
- [ ] Performance profiling and optimization

---

## 📈 Success Metrics by Version

### V1.2 Scheduling

**Adoption Targets:**
- 80% of staff view schedule weekly (via mobile)
- <10 min to publish weekly schedule (vs 30 min manual)
- >90% OCR accuracy on physical board capture
- <5 conflict alerts per week after optimization

**Business Metrics:**
- 2 hours/week saved on schedule creation
- 50% reduction in scheduling conflicts
- 100% audit trail for labor compliance

### V1.3 Recipe Management

**Usage Targets:**
- 100% of active recipes digitized
- <2 min to scale recipe for different yields
- Allergen auto-populate in 100% of Standards Mode entries

**Business Metrics:**
- 10% reduction in food cost (better portion control)
- Zero allergen incidents (improved tracking)

### V1.4 Inventory

**Adoption Targets:**
- Daily inventory checks by 80% of sous chefs
- Auto-orders generated for 90% of purchases
- <5 min daily waste log entry

**Business Metrics:**
- 15% reduction in waste (better tracking)
- $500/month savings on emergency orders (better par levels)
- Zero stockouts on critical items

---

## 🚦 Go/No-Go Gates

### V1.2 Launch Criteria

**Before deploying to production:**
- [ ] All 6 conflict types detected accurately
- [ ] OCR >80% accuracy on real boards (tested with 10 samples)
- [ ] Mobile UX validated by 3 line cooks
- [ ] Zero critical bugs in 2-week pilot
- [ ] Director approves labor cost dashboard

**Kill Criteria (abort V1.2 if):**
- OCR accuracy <60% after 2 weeks of tuning
- <40% adoption after 1 month
- Schedule entry takes >20 min (vs <10 target)

---

## 🎯 Immediate Next Steps

### This Week

1. **Decision Point:** Approve V1.2 Scheduling roadmap? (Yes/No/Modify)
2. **Kick-off:** Start Phase 1 (Foundation) if approved
3. **Stakeholder Alignment:** Share roadmap with exec chef, director
4. **Resource Allocation:** Confirm developer availability (full/part-time)

### Week 1 Tasks (if approved)

- [ ] Create feature branch: `feature/v1.2-scheduling`
- [ ] Add Employee, Shift, Schedule types to `src/types/index.ts`
- [ ] Extend IndexedDB schema in `src/services/db.ts`
- [ ] Add "Schedule" icon to LeftRail
- [ ] Create empty `src/pages/Scheduling.tsx` shell
- [ ] Build basic weekly grid layout (no data yet)

---

## 📞 Review & Approval

**Roadmap Author:** Claude (AI Development Assistant)
**Date Created:** December 2024
**Version:** 1.0

**Sign-off Required:**
- [ ] Executive Chef (feature priority)
- [ ] Director (budget/resources)
- [ ] IT/Operations (technical feasibility)

**Next Review Date:** After V1.2 Phase 1 completion (Week 1)

---

## 📚 Appendix: Reference Documents

- [V1.1 README](client/README.md) - Current feature documentation
- [Acceptance Tests](client/ACCEPTANCE_TESTS.md) - V1.1 test checklist
- [Test Suite](test-suite.sh) - Automated validation script
- Physical Board Analysis - Scheduling requirements (from images)

---

**End of Master Roadmap**
