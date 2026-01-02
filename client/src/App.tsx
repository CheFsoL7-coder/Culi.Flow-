import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LeftRail } from './components/LeftRail';
import { CommandBar } from './components/CommandBar';
import { CommandPalette } from './components/CommandPalette';
import { QuickAddModal } from './components/QuickAddModal';
import { OpsHome } from './pages/OpsHome';
import { ServiceMode } from './pages/ServiceMode';
import { ProductionMode } from './pages/ProductionMode';
import { StandardsMode } from './pages/StandardsMode';
import { ScheduleMode } from './pages/ScheduleMode';
import { Analytics } from './pages/Analytics';
import { initDB } from './services/db';
import {
  generateDirectorSummary,
  exportDirectorSummaryAsPDF,
  exportComplianceRecordAsCSV,
  exportEvidencePack,
} from './services/exports';
import { exportTasksToCalendar } from './services/calendar';
import {
  generateDailyReport,
  copyDailyReportToClipboard,
  downloadDailyReportAsHTML,
} from './services/notifications';
import { seedSampleData } from './services/seeder';
import { getAllTasks } from './services/db';

function App() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [focusMode] = useState(false);

  useEffect(() => {
    // Initialize IndexedDB and seed data if empty
    initDB()
      .then(async () => {
        const tasks = await getAllTasks();
        if (tasks.length === 0) {
          console.log('No tasks found, seeding sample data...');
          await seedSampleData();
        }
      })
      .catch((err) => console.error('Failed to initialize DB:', err));

    // Command palette keyboard shortcut (Cmd/Ctrl + K)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleGenerateDirectorSummary = async () => {
    const summary = await generateDirectorSummary();
    exportDirectorSummaryAsPDF(summary);
  };

  const handleExportCompliance = async () => {
    await exportComplianceRecordAsCSV();
  };

  const handleExportEvidence = async () => {
    await exportEvidencePack();
  };

  const handleExportCalendar = async () => {
    await exportTasksToCalendar();
  };

  const handleGenerateDailyReport = async () => {
    const report = await generateDailyReport();
    copyDailyReportToClipboard(report);
    downloadDailyReportAsHTML(report);
    alert('Daily report copied to clipboard and downloaded as HTML!');
  };

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-zinc-950 text-white">
        <LeftRail hidden={focusMode} />

        <div className="flex-1 flex flex-col ml-20">
          <CommandBar
            hidden={focusMode}
            onQuickAddClick={() => setIsQuickAddOpen(true)}
            onSearchClick={() => setIsCommandPaletteOpen(true)}
          />

          <main className="flex-1 overflow-y-auto mt-16">
            <Routes>
              <Route path="/" element={<OpsHome />} />
              <Route path="/service" element={<ServiceMode />} />
              <Route path="/production" element={<ProductionMode />} />
              <Route path="/standards" element={<StandardsMode />} />
              <Route path="/schedule" element={<ScheduleMode />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </main>
        </div>

        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onQuickAdd={() => {
            setIsCommandPaletteOpen(false);
            setIsQuickAddOpen(true);
          }}
          onGenerateDirectorSummary={handleGenerateDirectorSummary}
          onExportCompliance={handleExportCompliance}
          onExportEvidence={handleExportEvidence}
          onExportCalendar={handleExportCalendar}
          onGenerateDailyReport={handleGenerateDailyReport}
        />

        <QuickAddModal
          isOpen={isQuickAddOpen}
          onClose={() => setIsQuickAddOpen(false)}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
