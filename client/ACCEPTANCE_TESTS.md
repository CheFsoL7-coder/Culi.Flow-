# V1.1 Acceptance Test Checklist

## Test Environment Setup

```bash
cd client
npm install
npm run dev
# Open http://localhost:5173
```

---

## Test 1: New-Person Test ⏱️ Target: < 5 minutes

**Pass Condition:** New user completes 5 tasks and generates director summary in under 5 minutes with zero coaching.

### Steps:
1. Open app (sample data auto-loads)
2. Navigate to Ops Home
3. Click first task in "Now" lane → Mark complete (1/5)
4. Click second task → Mark complete (2/5)
5. Click third task → Mark complete (3/5)
6. Press `Cmd/Ctrl + K` → Type "quick" → Enter
7. Type: `prep 15 stock 2gal @garde 2p` → Create (4/5)
8. Navigate to Service Mode
9. Click any task in Backlog → Auto-moves to next column (5/5)
10. Press `Cmd/Ctrl + K` → Type "director" → Enter
11. PDF downloads automatically

**Result:** ✅ / ❌
**Time:** _____ minutes
**Notes:** _______________

---

## Test 2: Slammed-Service Test ⏱️ Target: 20 minutes

**Pass Condition:** Service Mode runs for 20 minutes with focus mode on, one-gesture completion, no navigation hunting.

### Steps:
1. Navigate to Service Mode
2. Click "Focus Mode" button (top right)
3. Verify: Left rail hidden, command bar hidden, big clock visible
4. Complete 15 tasks using one-click advancement
5. Each task should move: Backlog → Firing → Plating → Running → Done
6. Track time: No menu navigation required

**Result:** ✅ / ❌
**Tasks Completed:** _____ / 15
**Navigation Hunting:** Yes / No
**Notes:** _______________

---

## Test 3: Offline Test ✈️

**Pass Condition:** App loads in airplane mode after first install, logs events, exports compliance record.

### Steps:
1. Load app normally (allow IndexedDB initialization)
2. Create 3 tasks using Quick Add
3. Complete 1 task
4. **Enable airplane mode / disconnect network**
5. Refresh browser
6. Verify app loads (should show cached tasks)
7. Create 1 new task (should save to IndexedDB)
8. Complete 1 task
9. Press `Cmd/Ctrl + K` → "compliance" → Enter
10. CSV downloads

**Result:** ✅ / ❌
**Offline Load:** Success / Fail
**Tasks Created Offline:** _____ / 1
**CSV Export Offline:** Success / Fail
**Notes:** _______________

---

## Test 4: Director Summary Test ⏱️ Target: < 3 minutes

**Pass Condition:** Generate director-ready summary in under 3 minutes with copy and export.

### Steps:
1. Ensure at least 10 tasks exist (use sample data)
2. Mark 2 critical tasks as overdue (edit dueAt to yesterday)
3. Mark 1 compliance task as incomplete
4. Press `Cmd/Ctrl + K`
5. Type "director" → Enter
6. PDF downloads
7. Open PDF → Verify sections:
   - Overall status (on-track / at-risk)
   - Missed critical tasks (should show 2)
   - Missed compliance (should show 1)
   - Top misses, blockers, decisions, next shift risks

**Result:** ✅ / ❌
**Time:** _____ minutes
**PDF Quality:** Good / Poor
**All Sections Present:** Yes / No
**Notes:** _______________

---

## Test 5: Audit Record Test 📋

**Pass Condition:** Export event log with timestamps and task metadata.

### Steps:
1. Create 5 tasks (using Quick Add or UI)
2. Complete 3 tasks
3. Update 1 task (change status manually)
4. Press `Cmd/Ctrl + K` → "compliance" → Enter
5. CSV downloads
6. Open CSV → Verify columns:
   - Timestamp (ISO format)
   - Actor
   - Action (task_created, task_completed, status_changed)
   - Task (task title)
   - Compliance Type (if applicable)
   - Evidence (links if applicable)

**Result:** ✅ / ❌
**Events Logged:** _____ (should be 9+)
**Timestamps Valid:** Yes / No
**Metadata Complete:** Yes / No
**Notes:** _______________

---

## Test 6: 14-Day Proof Test 📊

**Pass Condition:** Analytics shows 14-day trends, top exceptions, week-over-week deltas.

### Steps:
1. Navigate to Analytics
2. Verify 4 decision panels visible:
   - Ticket Time
   - Waste
   - Compliance
   - Standards
3. Each panel should show:
   - Current value vs target
   - 14-day trend chart
   - Top 3 exceptions list
4. Scroll to "Week-over-Week Deltas"
5. Verify 3 metrics:
   - Critical Completion
   - Compliance Completion
   - Prep Throughput

**Result:** ✅ / ❌
**All Panels Visible:** Yes / No
**Trends Displayed:** Yes / No
**WoW Deltas Shown:** Yes / No
**Notes:** _______________

---

## Additional Feature Tests

### Test 7: Quick Add Shorthand Parser

**Sample Inputs:**
```
prep 10 chicken stock 2gal @garde 9a
service ribeye plating @hotline 5:30p !critical
compliance temp log @utility !critical /temp
standards photo ribeye #mike +oak
```

**Verify each parses correctly:**
- Type, duration, title, quantity
- Station (@garde, @hotline, @utility)
- Time (9a, 5:30p)
- Owner (#mike)
- Priority (!critical)
- Compliance tag (/temp)
- Concept tag (+oak)

**Result:** ✅ / ❌
**Parsing Accuracy:** _____ / 4

---

### Test 8: Calendar Export

1. Create 5 tasks with due dates
2. Press `Cmd/Ctrl + K` → "calendar" → Enter
3. Download .ics file
4. Import to Google Calendar / Outlook / Apple Calendar
5. Verify events appear with:
   - Correct date/time
   - Task title
   - Duration
   - Location (station)

**Result:** ✅ / ❌
**Import Success:** Yes / No
**Data Accuracy:** Good / Poor

---

### Test 9: Daily Report

1. Complete 5 tasks today
2. Leave 2 critical tasks incomplete
3. Press `Cmd/Ctrl + K` → "daily" → Enter
4. Verify:
   - HTML file downloads
   - Text copied to clipboard
   - Metrics accurate (completion %, critical %, compliance %)
   - Top misses listed

**Result:** ✅ / ❌
**Metrics Accurate:** Yes / No
**HTML Readable:** Yes / No

---

### Test 10: Five Shells Navigation

Navigate to each shell and verify core elements:

**Ops Home:**
- [ ] 4 KPI tiles visible
- [ ] Now lane shows next 5 tasks
- [ ] Today timeline blocks visible

**Service Mode:**
- [ ] 5 board columns (Backlog → Done)
- [ ] Focus mode toggle works
- [ ] Big clock displays (in focus mode)

**Production Mode:**
- [ ] 6 stations listed
- [ ] Prep board with 4 columns
- [ ] Recipe drawer opens on task click

**Standards Mode:**
- [ ] Week selector (Sunday locked)
- [ ] 4 intake lanes (Shoot, Star, Sync, Review)
- [ ] Album indicators (missing plates, late uploads, review due)

**Analytics:**
- [ ] 4 decision panels
- [ ] 14-day trend charts
- [ ] Top exceptions for each panel
- [ ] Week-over-week deltas

**Result:** ✅ / ❌
**All Shells Functional:** Yes / No

---

## Overall V1.1 Certification

**Tests Passed:** _____ / 10
**Critical Failures:** _____
**Recommendation:** PASS / FAIL / CONDITIONAL

**Sign-off:**
- Tester: _______________
- Date: _______________
- Notes: _______________

---

## Performance Benchmarks

- [ ] Initial load < 3 seconds
- [ ] Task creation < 500ms
- [ ] Export generation < 2 seconds
- [ ] Command palette opens instantly
- [ ] Shell navigation < 200ms
- [ ] Offline mode functional
- [ ] Build size < 2MB (currently 1.2MB ✅)

---

## Known Limitations

1. Sample data used for testing (production requires real data)
2. Analytics trends use simulated data (requires historical events)
3. Email sending requires integration (currently export-only)
4. Real-time sync not implemented (offline-first design)

---

**V1.1 Ready for Production:** YES / NO / WITH CAVEATS

**Next Steps:**
1. Deploy to staging environment
2. Run user acceptance testing
3. Configure production data sources
4. Set up monitoring and error tracking
