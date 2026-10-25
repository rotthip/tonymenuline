import { MenuItem } from '../types/menu';

// Import default generated menu images for robust Vite bundling
import signatureMainsImg from '../assets/images/menu_signature_mains_1792934842699.jpg';
import appetizersImg from '../assets/images/menu_appetizers_snacks_1792934843447.jpg';
import drinksImg from '../assets/images/menu_specialty_drinks_1792934844679.jpg';
import dessertsImg from '../assets/images/menu_artisan_desserts_1792934845233.jpg';

export const DEFAULT_MENUS: MenuItem[] = [
  {
    id: 'menu-1',
    title: 'Signature Chef Dishes / เมนูจานหลักซิกเนเจอร์',
    category: 'อาหารจานหลัก (Main Courses)',
    imageUrl: signatureMainsImg,
    description: 'Grilled Atlantic Salmon, Tom Yum Soup, Pad Thai, Steak Frites, Duck Confit & Risotto',
    priceRange: '฿280 - ฿650',
    order: 0,
    fileName: '01_menu_signature_mains.png',
    fileSize: '1.4 MB',
    tags: ['Best Seller', 'Chef Recommended'],
    createdAt: '2026-10-25T08:00:00.000Z',
    updatedAt: '2026-10-25T08:00:00.000Z',
  },
  {
    id: 'menu-2',
    title: 'Gourmet Appetizers & Salads / อาหารทานเล่น & สลัด',
    category: 'ของทานเล่น (Appetizers)',
    imageUrl: appetizersImg,
    description: 'Crispy Vegetable Spring Rolls, Chicken Satay, Shrimp Tempura, Caesar Salad, Caprese Salad',
    priceRange: '฿120 - ฿290',
    order: 1,
    fileName: '02_menu_appetizers_snacks.png',
    fileSize: '1.2 MB',
    tags: ['Fresh', 'Popular'],
    createdAt: '2026-10-25T08:05:00.000Z',
    updatedAt: '2026-10-25T08:05:00.000Z',
  },
  {
    id: 'menu-3',
    title: 'Specialty Espresso, Drinks & Sips / เครื่องดื่ม & กาแฟสด',
    category: 'เครื่องดื่ม (Beverages)',
    imageUrl: drinksImg,
    description: 'Artisanal Latte, Matcha Latte, Sparkling Fruit Soda, Fresh Fruit Smoothies & Cold Brew',
    priceRange: '฿75 - ฿160',
    order: 2,
    fileName: '03_menu_specialty_drinks.png',
    fileSize: '1.6 MB',
    tags: ['Cafe Specials', 'Organic'],
    createdAt: '2026-10-25T08:10:00.000Z',
    updatedAt: '2026-10-25T08:10:00.000Z',
  },
  {
    id: 'menu-4',
    title: 'Les Desserts Élégants / ขนมหวาน & เบเกอรี่',
    category: 'ของหวาน (Desserts)',
    imageUrl: dessertsImg,
    description: 'Traditional Mango Sticky Rice, Dark Chocolate Lava Cake, French Macarons & House Artisan Gelato',
    priceRange: '฿95 - ฿220',
    order: 3,
    fileName: '04_menu_artisan_desserts.png',
    fileSize: '1.3 MB',
    tags: ['Sweet Tooth', 'House Made'],
    createdAt: '2026-10-25T08:15:00.000Z',
    updatedAt: '2026-10-25T08:15:00.000Z',
  },
];

/**
 * Extracts numeric value from filename or title
 * e.g. "01_menu.png" -> 1, "menu_2.png" -> 2, "10.png" -> 10
 */
export function extractFileNameNumber(fileName?: string, title?: string, fallback: number = 9999): number {
  const str = (fileName || title || '').trim();
  const match = str.match(/(\d+)/);
  if (match) {
    return parseInt(match[1], 10);
  }
  return fallback;
}

/**
 * Sorts menus by numeric value in fileName from least to greatest (น้อย ไป มาก)
 */
export function sortMenusByFileNameNumber(items: MenuItem[]): MenuItem[] {
  return [...items].sort((a, b) => {
    const numA = extractFileNameNumber(a.fileName, a.title, a.order);
    const numB = extractFileNameNumber(b.fileName, b.title, b.order);
    if (numA !== numB) {
      return numA - numB;
    }
    const nameA = a.fileName || a.title || '';
    const nameB = b.fileName || b.title || '';
    return nameA.localeCompare(nameB, undefined, { numeric: true, sensitivity: 'base' });
  });
}

const DB_NAME = 'MenuShowcaseDB';
const STORE_NAME = 'menus';
const DB_VERSION = 1;
const LOCALSTORAGE_KEY = 'menushowcase_items_v1';

// Open or create IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

// Fetch all menus sorted by order
export async function getMenus(): Promise<MenuItem[]> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        let results = request.result as MenuItem[];
        if (!results || results.length === 0) {
          // Check localStorage fallback
          const lsData = localStorage.getItem(LOCALSTORAGE_KEY);
          if (lsData) {
            try {
              results = JSON.parse(lsData);
            } catch {
              results = DEFAULT_MENUS;
            }
          } else {
            results = DEFAULT_MENUS;
          }
          // Seed IndexedDB
          saveAllMenus(results).catch(console.error);
        }
        results = sortMenusByFileNameNumber(results);
        resolve(results);
      };

      request.onerror = () => {
        fallbackGet(resolve);
      };
    });
  } catch {
    return new Promise((resolve) => fallbackGet(resolve));
  }
}

function fallbackGet(resolve: (value: MenuItem[]) => void) {
  try {
    const ls = localStorage.getItem(LOCALSTORAGE_KEY);
    if (ls) {
      const parsed = JSON.parse(ls);
      resolve(sortMenusByFileNameNumber(parsed));
      return;
    }
  } catch (err) {
    console.error('Failed reading localStorage', err);
  }
  resolve(sortMenusByFileNameNumber(DEFAULT_MENUS));
}

// Save all menus in batch
export async function saveAllMenus(menus: MenuItem[]): Promise<void> {
  // Update localStorage as mirror backup
  try {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(menus));
  } catch (e) {
    console.warn('LocalStorage limit exceeded, relying solely on IndexedDB', e);
  }

  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.clear();
      menus.forEach((item) => store.put(item));
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error('Error saving to IndexedDB', err);
  }
}

// Save a single new menu
export async function saveMenu(menu: MenuItem): Promise<MenuItem[]> {
  const current = await getMenus();
  const nextOrder = current.length > 0 ? Math.max(...current.map((m) => m.order)) + 1 : 0;
  const newMenu = { ...menu, order: nextOrder };
  const updated = [...current, newMenu];
  await saveAllMenus(updated);
  return updated;
}

// Update menu fields
export async function updateMenu(id: string, updates: Partial<MenuItem>): Promise<MenuItem[]> {
  const current = await getMenus();
  const updated = current.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
    }
    return item;
  });
  await saveAllMenus(updated);
  return updated;
}

// Delete a menu
export async function deleteMenu(id: string): Promise<MenuItem[]> {
  const current = await getMenus();
  const updated = current
    .filter((m) => m.id !== id)
    .map((item, index) => ({
      ...item,
      order: index,
    }));
  await saveAllMenus(updated);
  return updated;
}

// Reorder menus after drag and drop
export async function reorderMenus(orderedMenus: MenuItem[]): Promise<MenuItem[]> {
  const updated = orderedMenus.map((item, index) => ({
    ...item,
    order: index,
  }));
  await saveAllMenus(updated);
  return updated;
}

// Reset to default sample menus
export async function resetToDefaultMenus(): Promise<MenuItem[]> {
  await saveAllMenus(DEFAULT_MENUS);
  return DEFAULT_MENUS;
}
