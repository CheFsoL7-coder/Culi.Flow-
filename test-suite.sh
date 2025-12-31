#!/bin/bash
# Comprehensive V1.1 Feature Test Suite

echo "═══════════════════════════════════════════════════════════"
echo "  Culi.Flow V1.1 Cockpit - Feature Test Suite"
echo "═══════════════════════════════════════════════════════════"
echo ""

cd /home/user/Culi.Flow-/client

# Test 1: Build Compilation
echo "✓ Test 1: Build Compilation"
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "  ✅ PASS - Production build compiles successfully"
else
    echo "  ❌ FAIL - Build errors detected"
    exit 1
fi
echo ""

# Test 2: Check Critical Files
echo "✓ Test 2: Critical Files Exist"
files=(
    "src/App.tsx"
    "src/pages/OpsHome.tsx"
    "src/pages/ServiceMode.tsx"
    "src/pages/ProductionMode.tsx"
    "src/pages/StandardsMode.tsx"
    "src/pages/Analytics.tsx"
    "src/components/CommandPalette.tsx"
    "src/components/QuickAddModal.tsx"
    "src/services/db.ts"
    "src/services/exports.ts"
    "src/services/calendar.ts"
    "src/services/notifications.ts"
    "src/services/parser.ts"
    "src/services/seeder.ts"
    "src/types/index.ts"
)

all_exist=true
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ MISSING: $file"
        all_exist=false
    fi
done
echo ""

# Test 3: TypeScript Type Checking
echo "✓ Test 3: TypeScript Type Checking"
npx tsc --noEmit > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "  ✅ PASS - No type errors"
else
    echo "  ❌ FAIL - Type errors detected"
    npx tsc --noEmit 2>&1 | head -20
fi
echo ""

# Test 4: Check Dependencies
echo "✓ Test 4: Required Dependencies Installed"
deps=("react" "react-router-dom" "idb" "ics" "jspdf" "papaparse" "date-fns" "lucide-react")
for dep in "${deps[@]}"; do
    if grep -q "\"$dep\"" package.json; then
        echo "  ✅ $dep"
    else
        echo "  ❌ MISSING: $dep"
    fi
done
echo ""

# Test 5: PWA Configuration
echo "✓ Test 5: PWA Configuration"
if grep -q "vite-plugin-pwa" vite.config.ts; then
    echo "  ✅ PWA plugin configured"
else
    echo "  ❌ PWA plugin missing"
fi

if [ -f "dist/sw.js" ]; then
    echo "  ✅ Service worker generated"
else
    echo "  ⚠️  Service worker not found (run build first)"
fi
echo ""

# Test 6: Code Quality - No Console Errors in Source
echo "✓ Test 6: Code Quality Checks"
console_logs=$(grep -r "console.log" src/ --include="*.ts" --include="*.tsx" | grep -v "console.error" | wc -l)
console_errors=$(grep -r "console.error" src/ --include="*.ts" --include="*.tsx" | wc -l)
echo "  ℹ️  console.log statements: $console_logs"
echo "  ℹ️  console.error statements: $console_errors"
echo ""

# Test 7: Export Services Exist
echo "✓ Test 7: Export Services Available"
services=(
    "generateDirectorSummary"
    "exportComplianceRecordAsCSV"
    "exportEvidencePack"
    "exportTasksToCalendar"
    "generateDailyReport"
)

for service in "${services[@]}"; do
    if grep -q "$service" src/services/*.ts; then
        echo "  ✅ $service"
    else
        echo "  ❌ MISSING: $service"
    fi
done
echo ""

# Test 8: Command Palette Commands
echo "✓ Test 8: Command Palette Commands"
commands=(
    "quick-add"
    "director-summary"
    "export-compliance"
    "export-evidence"
    "export-calendar"
    "daily-report"
)

for cmd in "${commands[@]}"; do
    if grep -q "id: '$cmd'" src/components/CommandPalette.tsx; then
        echo "  ✅ $cmd"
    else
        echo "  ❌ MISSING: $cmd"
    fi
done
echo ""

# Test 9: Data Model Types
echo "✓ Test 9: Core Data Model Types"
types=(
    "Task"
    "EventLog"
    "DailySummary"
    "TaskType"
    "Station"
    "Priority"
    "ComplianceType"
)

for type in "${types[@]}"; do
    if grep -q "interface $type\|type $type" src/types/index.ts; then
        echo "  ✅ $type"
    else
        echo "  ❌ MISSING: $type"
    fi
done
echo ""

# Test 10: Build Output Size
echo "✓ Test 10: Build Output Analysis"
if [ -d "dist" ]; then
    total_size=$(du -sh dist | awk '{print $1}')
    js_files=$(find dist/assets -name "*.js" | wc -l)
    css_files=$(find dist/assets -name "*.css" | wc -l)
    echo "  ✅ Total build size: $total_size"
    echo "  ℹ️  JavaScript bundles: $js_files"
    echo "  ℹ️  CSS files: $css_files"
else
    echo "  ⚠️  No dist/ directory (run build)"
fi
echo ""

# Summary
echo "═══════════════════════════════════════════════════════════"
echo "  Test Suite Complete"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Next Steps:"
echo "  1. Start dev server: npm run dev"
echo "  2. Open http://localhost:5173"
echo "  3. Test command palette: Cmd/Ctrl+K"
echo "  4. Create tasks with Quick Add"
echo "  5. Export calendar and daily reports"
echo ""
