import type { ShopConfig } from '../data/menuData.ts';
import type { CartMap, CustomerLoyaltyStats } from './orderLogic.ts';

export interface ItemOverride {
  price?: number;
  sold?: boolean;
}

export interface StoreState {
  photos: Record<string, string>;
  cfg: Partial<ShopConfig>;
  items: Record<string, ItemOverride>;
}

const DB_NAME = 'mck';
const STORE_NAME = 'kv';
const STORE_KEY = 'store';
const CART_KEY = 'mck_cart';
const CUSTOMER_KEY = 'mck_customer';
const LOYALTY_KEY = 'mck_loyalty';

export interface SavedCustomer {
  name: string;
  phone: string;
  address: string;
}

export function loadLoyaltyStats(): CustomerLoyaltyStats {
  try {
    const raw = localStorage.getItem(LOYALTY_KEY);
    if (!raw) return { orderCount: 0, totalSpent: 0 };
    const parsed = JSON.parse(raw);
    return {
      orderCount: Math.max(0, Number(parsed.orderCount) || 0),
      totalSpent: Math.max(0, Number(parsed.totalSpent) || 0),
    };
  } catch {
    return { orderCount: 0, totalSpent: 0 };
  }
}

export function recordCompletedOrder(orderAmount: number): CustomerLoyaltyStats {
  const current = loadLoyaltyStats();
  const updated: CustomerLoyaltyStats = {
    orderCount: current.orderCount + 1,
    totalSpent: current.totalSpent + Math.max(0, orderAmount),
  };
  try {
    localStorage.setItem(LOYALTY_KEY, JSON.stringify(updated));
  } catch {
    // ignore storage errors
  }
  return updated;
}

function openDB(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains(STORE_NAME)) {
          req.result.createObjectStore(STORE_NAME);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function loadStoreState(): Promise<StoreState> {
  const empty: StoreState = { photos: {}, cfg: {}, items: {} };
  const db = await openDB();
  if (!db) return empty;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(STORE_KEY);
      req.onsuccess = () => {
        const res = req.result;
        if (res && typeof res === 'object') {
          resolve({
            photos: res.photos || {},
            cfg: res.cfg || {},
            items: res.items || {},
          });
        } else {
          resolve(empty);
        }
      };
      req.onerror = () => resolve(empty);
    } catch {
      resolve(empty);
    }
  });
}

export async function saveStoreState(state: StoreState | null): Promise<void> {
  const db = await openDB();
  if (!db) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      if (state === null) {
        tx.objectStore(STORE_NAME).delete(STORE_KEY);
      } else {
        tx.objectStore(STORE_NAME).put(state, STORE_KEY);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

export function loadCart(): CartMap {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveCart(cart: CartMap): void {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    // ignore storage errors
  }
}

export function loadCustomer(): SavedCustomer {
  try {
    const raw = localStorage.getItem(CUSTOMER_KEY);
    if (!raw) return { name: '', phone: '', address: '' };
    const parsed = JSON.parse(raw);
    return {
      name: parsed.name || '',
      phone: parsed.phone || '',
      address: parsed.address || '',
    };
  } catch {
    return { name: '', phone: '', address: '' };
  }
}

export function saveCustomer(cust: SavedCustomer): void {
  try {
    localStorage.setItem(CUSTOMER_KEY, JSON.stringify(cust));
  } catch {
    // ignore
  }
}

export function shrinkImage(file: File, maxDim: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      const scale = Math.min(1, maxDim / Math.max(w, h));
      w = Math.round(w * scale);
      h = Math.round(h * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('Canvas context unavailable'));
        return;
      }
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
}

export async function exportStandaloneHtml(state: StoreState): Promise<number> {
  const res = await fetch('/assets/aistudio/malini_cloud_kitchen_v4__1__8bdb918f.html');
  const html = await res.text();
  const openTag = '<script type="application/json" id="siteData">';
  const startIdx = html.indexOf(openTag);
  if (startIdx < 0) {
    throw new Error('Template siteData tag not found');
  }
  const endIdx = html.indexOf('</script>', startIdx);
  const jsonPayload = JSON.stringify({
    photos: state.photos,
    cfg: state.cfg,
    items: state.items,
  }).replace(/</g, '\\u003c');

  const updatedHtml =
    html.slice(0, startIdx + openTag.length) + jsonPayload + html.slice(endIdx);
  const blob = new Blob([updatedHtml], { type: 'text/html' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'malini_cloud_kitchen_v4.html';
  document.body.appendChild(link);
  link.click();
  link.remove();
  return Math.round((updatedHtml.length / 1024 / 1024) * 10) / 10;
}
