import type {
  MenuWeek,
  MenuDay,
  MenuCategory,
  MenuItemCapture,
  MenuCycleAlbum,
} from '../types';

const STORAGE_KEY = 'culiflow-menu-cycle';

// ============================================================================
// LOCAL STORAGE PERSISTENCE
// ============================================================================

interface MenuCycleStore {
  albums: MenuCycleAlbum[];
  lastUpdate: string;
}

function loadStore(): MenuCycleStore {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load menu cycle data:', error);
  }
  return { albums: [], lastUpdate: new Date().toISOString() };
}

function saveStore(store: MenuCycleStore): void {
  try {
    store.lastUpdate = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (error) {
    console.error('Failed to save menu cycle data:', error);
  }
}

// ============================================================================
// ALBUM OPERATIONS
// ============================================================================

export function generateAlbumId(week: MenuWeek, day: MenuDay): string {
  return `album-w${week}-${day}`;
}

export function generateItemId(week: MenuWeek, day: MenuDay, category: MenuCategory): string {
  return `item-w${week}-${day}-${category}-${Date.now()}`;
}

export function getAllAlbums(): MenuCycleAlbum[] {
  const store = loadStore();
  return store.albums;
}

export function getAlbum(week: MenuWeek, day: MenuDay): MenuCycleAlbum | undefined {
  const store = loadStore();
  return store.albums.find(a => a.week === week && a.day === day);
}

export function getAlbumsByWeek(week: MenuWeek): MenuCycleAlbum[] {
  const store = loadStore();
  return store.albums.filter(a => a.week === week);
}

export function createOrUpdateAlbum(album: MenuCycleAlbum): MenuCycleAlbum {
  const store = loadStore();
  const existingIndex = store.albums.findIndex(
    a => a.week === album.week && a.day === album.day
  );

  album.updatedAt = new Date().toISOString();

  if (existingIndex >= 0) {
    store.albums[existingIndex] = album;
  } else {
    album.createdAt = album.createdAt || new Date().toISOString();
    store.albums.push(album);
  }

  saveStore(store);
  return album;
}

export function createEmptyAlbum(week: MenuWeek, day: MenuDay): MenuCycleAlbum {
  const album: MenuCycleAlbum = {
    id: generateAlbumId(week, day),
    week,
    day,
    items: [],
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return createOrUpdateAlbum(album);
}

export function deleteAlbum(week: MenuWeek, day: MenuDay): void {
  const store = loadStore();
  store.albums = store.albums.filter(a => !(a.week === week && a.day === day));
  saveStore(store);
}

// ============================================================================
// MENU ITEM OPERATIONS
// ============================================================================

export function addMenuItem(
  week: MenuWeek,
  day: MenuDay,
  item: Omit<MenuItemCapture, 'id' | 'week' | 'day' | 'capturedAt'>
): MenuItemCapture {
  let album = getAlbum(week, day);
  if (!album) {
    album = createEmptyAlbum(week, day);
  }

  const newItem: MenuItemCapture = {
    ...item,
    id: generateItemId(week, day, item.category),
    week,
    day,
    capturedAt: new Date().toISOString(),
  };

  // Remove existing item for same category if exists
  album.items = album.items.filter(i => i.category !== item.category);
  album.items.push(newItem);

  createOrUpdateAlbum(album);
  return newItem;
}

export function updateMenuItem(
  week: MenuWeek,
  day: MenuDay,
  itemId: string,
  updates: Partial<MenuItemCapture>
): MenuItemCapture | undefined {
  const album = getAlbum(week, day);
  if (!album) return undefined;

  const itemIndex = album.items.findIndex(i => i.id === itemId);
  if (itemIndex < 0) return undefined;

  album.items[itemIndex] = {
    ...album.items[itemIndex],
    ...updates,
  };

  createOrUpdateAlbum(album);
  return album.items[itemIndex];
}

export function deleteMenuItem(week: MenuWeek, day: MenuDay, itemId: string): void {
  const album = getAlbum(week, day);
  if (!album) return;

  album.items = album.items.filter(i => i.id !== itemId);
  createOrUpdateAlbum(album);
}

export function getMenuItem(
  week: MenuWeek,
  day: MenuDay,
  category: MenuCategory
): MenuItemCapture | undefined {
  const album = getAlbum(week, day);
  if (!album) return undefined;
  return album.items.find(i => i.category === category);
}

// ============================================================================
// GOOGLE PHOTOS INTEGRATION
// ============================================================================

export function setAlbumGooglePhotosLink(
  week: MenuWeek,
  day: MenuDay,
  url: string
): void {
  let album = getAlbum(week, day);
  if (!album) {
    album = createEmptyAlbum(week, day);
  }
  album.googlePhotosAlbumUrl = url;
  createOrUpdateAlbum(album);
}

export function setItemGooglePhotosLink(
  week: MenuWeek,
  day: MenuDay,
  category: MenuCategory,
  url: string
): void {
  const item = getMenuItem(week, day, category);
  if (item) {
    updateMenuItem(week, day, item.id, { googlePhotosLink: url });
  }
}

// ============================================================================
// CYCLE STATISTICS
// ============================================================================

export interface CycleStats {
  totalAlbums: number;
  completeAlbums: number;
  totalItems: number;
  itemsByWeek: Record<MenuWeek, number>;
  completionByWeek: Record<MenuWeek, number>;
}

export function getCycleStats(): CycleStats {
  const albums = getAllAlbums();
  const stats: CycleStats = {
    totalAlbums: albums.length,
    completeAlbums: albums.filter(a => a.status === 'complete' || a.status === 'approved').length,
    totalItems: albums.reduce((sum, a) => sum + a.items.length, 0),
    itemsByWeek: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    completionByWeek: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  };

  for (const album of albums) {
    stats.itemsByWeek[album.week] += album.items.length;
    // 7 days * 10 items = 70 items per week for 100% completion
    stats.completionByWeek[album.week] = Math.round(
      (stats.itemsByWeek[album.week] / 70) * 100
    );
  }

  return stats;
}

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

export function exportAlbumAsJSON(week: MenuWeek, day: MenuDay): string {
  const album = getAlbum(week, day);
  if (!album) return '{}';
  return JSON.stringify(album, null, 2);
}

export function exportWeekAsJSON(week: MenuWeek): string {
  const albums = getAlbumsByWeek(week);
  return JSON.stringify(albums, null, 2);
}

export function exportAllAsJSON(): string {
  const store = loadStore();
  return JSON.stringify(store, null, 2);
}

export function importFromJSON(jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData);
    if (data.albums && Array.isArray(data.albums)) {
      saveStore(data as MenuCycleStore);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to import menu cycle data:', error);
    return false;
  }
}

// ============================================================================
// CLEAR DATA
// ============================================================================

export function clearAllMenuCycleData(): void {
  localStorage.removeItem(STORAGE_KEY);
}
