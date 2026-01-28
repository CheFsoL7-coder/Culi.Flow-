import { useState, useEffect } from 'react';
import {
  Camera,
  ExternalLink,
  Check,
  X,
  ChevronDown,
  ChevronRight,
  Image,
  Link as LinkIcon,
  Download,
  Upload,
} from 'lucide-react';
import type {
  MenuWeek,
  MenuDay,
  MenuCategory,
  MenuItemCapture,
  MenuCycleAlbum,
} from '../types';
import { MENU_WEEK_CONFIGS, MENU_CATEGORIES } from '../types';
import {
  getAllAlbums,
  getAlbum,
  createEmptyAlbum,
  addMenuItem,
  updateMenuItem,
  setAlbumGooglePhotosLink,
  getCycleStats,
  exportAllAsJSON,
  importFromJSON,
} from '../services/menuCycle';

const DAYS: { key: MenuDay; label: string; short: string }[] = [
  { key: 'monday', label: 'Monday', short: 'Mon' },
  { key: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { key: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { key: 'thursday', label: 'Thursday', short: 'Thu' },
  { key: 'friday', label: 'Friday', short: 'Fri' },
  { key: 'saturday', label: 'Saturday', short: 'Sat' },
  { key: 'sunday', label: 'Sunday', short: 'Sun' },
];

const WEEKS: MenuWeek[] = [1, 2, 3, 4, 5];

export function MenuCycleMode() {
  const [selectedWeek, setSelectedWeek] = useState<MenuWeek>(1);
  const [selectedDay, setSelectedDay] = useState<MenuDay>('monday');
  const [albums, setAlbums] = useState<MenuCycleAlbum[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<MenuCategory>>(new Set());
  const [editingItem, setEditingItem] = useState<MenuCategory | null>(null);
  const [albumLinkInput, setAlbumLinkInput] = useState('');
  const [showAlbumLinkModal, setShowAlbumLinkModal] = useState(false);

  useEffect(() => {
    refreshAlbums();
  }, []);

  const refreshAlbums = () => {
    setAlbums(getAllAlbums());
  };

  const currentAlbum = getAlbum(selectedWeek, selectedDay);
  const weekConfig = MENU_WEEK_CONFIGS[selectedWeek];
  const stats = getCycleStats();

  const toggleCategory = (category: MenuCategory) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const handleSaveItem = (category: MenuCategory, data: Partial<MenuItemCapture>) => {
    addMenuItem(selectedWeek, selectedDay, {
      category,
      dishName: data.dishName || '',
      chef: data.chef,
      station: data.station,
      photoUrl: data.photoUrl,
      googlePhotosLink: data.googlePhotosLink,
      qualityChecks: data.qualityChecks || {
        temperatureCorrect: false,
        rimClean: false,
        freshGarnish: false,
      },
      critique: data.critique,
      capturedBy: data.capturedBy,
    });
    refreshAlbums();
    setEditingItem(null);
  };

  const handleSaveAlbumLink = () => {
    if (albumLinkInput.trim()) {
      setAlbumGooglePhotosLink(selectedWeek, selectedDay, albumLinkInput.trim());
      refreshAlbums();
    }
    setShowAlbumLinkModal(false);
    setAlbumLinkInput('');
  };

  const handleExport = () => {
    const data = exportAllAsJSON();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `menu-cycle-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const content = ev.target?.result as string;
          if (importFromJSON(content)) {
            refreshAlbums();
            alert('Import successful!');
          } else {
            alert('Import failed. Please check the file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const getItemForCategory = (category: MenuCategory): MenuItemCapture | undefined => {
    return currentAlbum?.items.find(i => i.category === category);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Menu Cycle Tracker</h1>
          <p className="text-zinc-400 text-sm">5-Week Elements Menu Photo Album</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleImport}
            className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition-colors"
          >
            <Upload size={16} />
            Import
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition-colors"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Week Selector */}
      <div className="flex gap-2 mb-4">
        {WEEKS.map((week) => {
          const config = MENU_WEEK_CONFIGS[week];
          const isSelected = week === selectedWeek;
          return (
            <button
              key={week}
              onClick={() => setSelectedWeek(week)}
              className={`
                flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all
                ${isSelected ? 'ring-2 ring-offset-2 ring-offset-zinc-950' : 'opacity-70 hover:opacity-100'}
              `}
              style={{
                backgroundColor: isSelected ? config.color : `${config.color}33`,
                color: isSelected ? '#fff' : config.color,
                ringColor: config.color,
              }}
            >
              <span className="text-lg">{config.emoji}</span>
              <span>Wk{week}</span>
              <span className="text-xs opacity-75">({stats.completionByWeek[week]}%)</span>
            </button>
          );
        })}
      </div>

      {/* Day Selector */}
      <div className="flex gap-1 mb-6 bg-zinc-900 p-1 rounded-lg">
        {DAYS.map((day) => {
          const isSelected = day.key === selectedDay;
          const dayAlbum = getAlbum(selectedWeek, day.key);
          const itemCount = dayAlbum?.items.length || 0;
          return (
            <button
              key={day.key}
              onClick={() => setSelectedDay(day.key)}
              className={`
                flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all relative
                ${isSelected ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}
              `}
            >
              <span className="hidden sm:inline">{day.label}</span>
              <span className="sm:hidden">{day.short}</span>
              {itemCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center text-white"
                  style={{ backgroundColor: weekConfig.color }}
                >
                  {itemCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Album Header */}
      <div
        className="rounded-xl p-4 mb-6 flex items-center justify-between"
        style={{ backgroundColor: `${weekConfig.color}22`, borderColor: weekConfig.color, borderWidth: 1 }}
      >
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>{weekConfig.emoji}</span>
            Week {selectedWeek} - {DAYS.find(d => d.key === selectedDay)?.label}
            <span className="text-sm font-normal opacity-75">({weekConfig.label} Cycle)</span>
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            {currentAlbum?.items.length || 0} of 10 items captured
          </p>
        </div>
        <div className="flex gap-2">
          {currentAlbum?.googlePhotosAlbumUrl ? (
            <a
              href={currentAlbum.googlePhotosAlbumUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition-colors"
            >
              <ExternalLink size={16} />
              View Album
            </a>
          ) : (
            <button
              onClick={() => setShowAlbumLinkModal(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
              style={{ backgroundColor: weekConfig.color }}
            >
              <LinkIcon size={16} />
              Link Google Photos
            </button>
          )}
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="space-y-3">
        {MENU_CATEGORIES.map((cat) => {
          const item = getItemForCategory(cat.key);
          const isExpanded = expandedCategories.has(cat.key);
          const isEditing = editingItem === cat.key;

          return (
            <div
              key={cat.key}
              className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800"
            >
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(cat.key)}
                className="w-full flex items-center justify-between p-4 hover:bg-zinc-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cat.emoji}</span>
                  <div className="text-left">
                    <div className="font-medium">{cat.label}</div>
                    {item ? (
                      <div className="text-sm text-zinc-400">{item.dishName}</div>
                    ) : (
                      <div className="text-sm text-zinc-500 italic">Not captured</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {item && (
                    <div className="flex gap-1">
                      {item.qualityChecks.temperatureCorrect && (
                        <span className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-xs" title="Temp OK">
                          <Check size={14} />
                        </span>
                      )}
                      {item.qualityChecks.rimClean && (
                        <span className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-xs" title="Rim Clean">
                          <Check size={14} />
                        </span>
                      )}
                      {item.qualityChecks.freshGarnish && (
                        <span className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-xs" title="Fresh Garnish">
                          <Check size={14} />
                        </span>
                      )}
                    </div>
                  )}
                  {item?.googlePhotosLink && (
                    <Image size={18} className="text-blue-400" />
                  )}
                  {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="p-4 border-t border-zinc-800 bg-zinc-950">
                  {isEditing ? (
                    <MenuItemForm
                      category={cat}
                      existingItem={item}
                      weekColor={weekConfig.color}
                      onSave={(data) => handleSaveItem(cat.key, data)}
                      onCancel={() => setEditingItem(null)}
                    />
                  ) : (
                    <div>
                      {item ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-zinc-500">Dish:</span>{' '}
                              <span className="font-medium">{item.dishName}</span>
                            </div>
                            <div>
                              <span className="text-zinc-500">Chef:</span>{' '}
                              <span>{item.chef || '-'}</span>
                            </div>
                            <div>
                              <span className="text-zinc-500">Station:</span>{' '}
                              <span>{item.station || '-'}</span>
                            </div>
                            <div>
                              <span className="text-zinc-500">Captured:</span>{' '}
                              <span>{new Date(item.capturedAt).toLocaleString()}</span>
                            </div>
                          </div>
                          {item.critique && (
                            <div className="text-sm">
                              <span className="text-zinc-500">Notes:</span>{' '}
                              <span className="text-yellow-400">{item.critique}</span>
                            </div>
                          )}
                          {item.googlePhotosLink && (
                            <a
                              href={item.googlePhotosLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
                            >
                              <ExternalLink size={14} />
                              View Photo in Google Photos
                            </a>
                          )}
                          <button
                            onClick={() => setEditingItem(cat.key)}
                            className="mt-2 px-3 py-1 text-sm bg-zinc-800 hover:bg-zinc-700 rounded transition-colors"
                          >
                            Edit
                          </button>
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <Camera size={32} className="mx-auto text-zinc-600 mb-2" />
                          <p className="text-zinc-500 mb-3">No capture for this item yet</p>
                          <button
                            onClick={() => setEditingItem(cat.key)}
                            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            style={{ backgroundColor: weekConfig.color }}
                          >
                            Add Capture
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Album Link Modal */}
      {showAlbumLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold mb-4">Link Google Photos Album</h3>
            <p className="text-sm text-zinc-400 mb-4">
              Paste the Google Photos album URL for Week {selectedWeek} {DAYS.find(d => d.key === selectedDay)?.label}
            </p>
            <input
              type="url"
              value={albumLinkInput}
              onChange={(e) => setAlbumLinkInput(e.target.value)}
              placeholder="https://photos.app.goo.gl/..."
              className="w-full px-3 py-2 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-blue-500 focus:outline-none mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowAlbumLinkModal(false);
                  setAlbumLinkInput('');
                }}
                className="px-4 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAlbumLink}
                className="px-4 py-2 text-sm rounded-lg transition-colors"
                style={{ backgroundColor: weekConfig.color }}
              >
                Save Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MENU ITEM FORM COMPONENT
// ============================================================================

interface MenuItemFormProps {
  category: { key: MenuCategory; label: string; emoji: string };
  existingItem?: MenuItemCapture;
  weekColor: string;
  onSave: (data: Partial<MenuItemCapture>) => void;
  onCancel: () => void;
}

function MenuItemForm({ category, existingItem, weekColor, onSave, onCancel }: MenuItemFormProps) {
  const [dishName, setDishName] = useState(existingItem?.dishName || '');
  const [chef, setChef] = useState(existingItem?.chef || '');
  const [station, setStation] = useState(existingItem?.station || '');
  const [googlePhotosLink, setGooglePhotosLink] = useState(existingItem?.googlePhotosLink || '');
  const [critique, setCritique] = useState(existingItem?.critique || '');
  const [tempOk, setTempOk] = useState(existingItem?.qualityChecks.temperatureCorrect || false);
  const [rimClean, setRimClean] = useState(existingItem?.qualityChecks.rimClean || false);
  const [freshGarnish, setFreshGarnish] = useState(existingItem?.qualityChecks.freshGarnish || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      dishName,
      chef,
      station,
      googlePhotosLink,
      critique,
      qualityChecks: {
        temperatureCorrect: tempOk,
        rimClean: rimClean,
        freshGarnish: freshGarnish,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Dish Name *</label>
          <input
            type="text"
            value={dishName}
            onChange={(e) => setDishName(e.target.value)}
            required
            className="w-full px-3 py-2 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-blue-500 focus:outline-none text-sm"
            placeholder={`e.g., ${category.label}`}
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Chef / Plated By</label>
          <input
            type="text"
            value={chef}
            onChange={(e) => setChef(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-blue-500 focus:outline-none text-sm"
            placeholder="Chef name"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Station</label>
          <input
            type="text"
            value={station}
            onChange={(e) => setStation(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-blue-500 focus:outline-none text-sm"
            placeholder="e.g., Hot Line, Garde"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Google Photos Link</label>
          <input
            type="url"
            value={googlePhotosLink}
            onChange={(e) => setGooglePhotosLink(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-blue-500 focus:outline-none text-sm"
            placeholder="https://photos.app.goo.gl/..."
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-zinc-400 mb-2">Quality Checks</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={tempOk}
              onChange={(e) => setTempOk(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm">Temp OK</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rimClean}
              onChange={(e) => setRimClean(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm">Rim Clean</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={freshGarnish}
              onChange={(e) => setFreshGarnish(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm">Fresh Garnish</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm text-zinc-400 mb-1">Critique / Notes</label>
        <textarea
          value={critique}
          onChange={(e) => setCritique(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-blue-500 focus:outline-none text-sm resize-none"
          placeholder="Any improvements needed..."
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm rounded-lg transition-colors font-medium"
          style={{ backgroundColor: weekColor }}
        >
          Save Capture
        </button>
      </div>
    </form>
  );
}
