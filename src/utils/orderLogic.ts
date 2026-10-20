import type { DietType, MenuItem, ShopConfig } from '../data/menuData.ts';

export type CartMap = Record<number, number>;

export interface FilterCriteria {
  category: string; // 'all' or category id
  query: string;
  diet: 'all' | DietType;
  hideSoldOut?: boolean;
}

export interface CartLineItem {
  item: MenuItem;
  qty: number;
  lineTotal: number;
}

export interface CartTotals {
  lineItems: CartLineItem[];
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
  minOrderShortfall: number;
}

export interface OrderFormInput {
  name: string;
  phone: string;
  address: string;
  timeSlot: string;
  paymentMethod: string;
  note: string;
}

export interface OrderValidationResult {
  valid: boolean;
  error: string;
  field?: 'cart' | 'shop' | 'minOrder' | 'name' | 'phone' | 'address';
}

export function checkShopOpen(
  openHour: number | null,
  closeHour: number | null,
  currentHour: number = new Date().getHours()
): boolean {
  if (openHour == null || closeHour == null) return true;
  return currentHour >= openHour && currentHour < closeHour;
}

export function filterMenuItems(items: MenuItem[], criteria: FilterCriteria): MenuItem[] {
  const q = criteria.query.trim().toLowerCase();
  return items.filter((item) => {
    if (criteria.category !== 'all' && item.cat !== criteria.category) {
      return false;
    }
    if (criteria.diet !== 'all' && item.diet !== criteria.diet) {
      return false;
    }
    if (criteria.hideSoldOut && item.sold) {
      return false;
    }
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.englishName.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.catName.toLowerCase().includes(q) ||
      item.keywords.toLowerCase().includes(q)
    );
  });
}

export function updateCartQuantity(
  cart: CartMap,
  itemId: number,
  delta: number,
  maxQty: number = 50
): CartMap {
  const next = { ...cart };
  const current = next[itemId] || 0;
  const updated = current + delta;
  if (updated <= 0) {
    delete next[itemId];
  } else {
    next[itemId] = Math.min(updated, maxQty);
  }
  return next;
}

export function calculateCartTotals(
  items: MenuItem[],
  cart: CartMap,
  cfg: Pick<ShopConfig, 'deliveryFee' | 'minOrder'>
): CartTotals {
  const lineItems: CartLineItem[] = [];
  let itemCount = 0;
  let subtotal = 0;

  for (const item of items) {
    const qty = cart[item.id] || 0;
    if (qty > 0 && !item.sold) {
      const lineTotal = item.price * qty;
      lineItems.push({ item, qty, lineTotal });
      itemCount += qty;
      subtotal += lineTotal;
    }
  }

  const deliveryFee = lineItems.length > 0 ? Math.max(0, cfg.deliveryFee || 0) : 0;
  const grandTotal = subtotal + deliveryFee;
  const minOrderShortfall =
    cfg.minOrder > 0 && subtotal < cfg.minOrder ? cfg.minOrder - subtotal : 0;

  return {
    lineItems,
    itemCount,
    subtotal,
    deliveryFee,
    grandTotal,
    minOrderShortfall,
  };
}

export function sanitizePhone(phone: string): string {
  return phone.replace(/\D/g, '').slice(-10);
}

export function validateOrderForm(
  form: OrderFormInput,
  totals: CartTotals,
  isOpen: boolean,
  minOrder: number
): OrderValidationResult {
  if (totals.lineItems.length === 0) {
    return {
      valid: false,
      error: 'Cart காலியாக உள்ளது. மெனுவில் உணவைத் தேர்ந்தெடுக்கவும்.',
      field: 'cart',
    };
  }
  if (!isOpen) {
    return {
      valid: false,
      error: 'இப்போது கடை மூடப்பட்டுள்ளது. திறக்கும் நேரத்தில் ஆர்டர் செய்யவும்.',
      field: 'shop',
    };
  }
  if (minOrder > 0 && totals.subtotal < minOrder) {
    return {
      valid: false,
      error: `குறைந்தபட்ச ஆர்டர் ₹${minOrder} (இன்னும் ₹${minOrder - totals.subtotal} தேவை).`,
      field: 'minOrder',
    };
  }
  if (!form.name.trim()) {
    return {
      valid: false,
      error: 'உங்கள் பெயரை உள்ளிடவும்.',
      field: 'name',
    };
  }
  const cleanPhone = form.phone.replace(/\D/g, '');
  if (cleanPhone.length !== 10) {
    return {
      valid: false,
      error: 'சரியான 10 இலக்க போன் எண்ணை உள்ளிடவும்.',
      field: 'phone',
    };
  }
  if (!form.address.trim()) {
    return {
      valid: false,
      error: 'Delivery முகவரியை உள்ளிடவும்.',
      field: 'address',
    };
  }
  return { valid: true, error: '' };
}

export interface CustomerLoyaltyStats {
  orderCount: number;
  totalSpent: number;
}

export interface LoyaltyEvaluation {
  isLoyal: boolean;
  reason: 'orders' | 'spend' | 'both' | 'none';
  orderCount: number;
  totalSpent: number;
  effectiveSpend: number;
  targetOrders: number;
  targetSpend: number;
  ordersRemaining: number;
  spendRemaining: number;
  progressPercent: number;
}

export const LOYALTY_TARGET_ORDERS = 3;
export const LOYALTY_TARGET_SPEND = 500;

export function evaluateCustomerLoyalty(
  stats: CustomerLoyaltyStats,
  currentCartSubtotal: number = 0
): LoyaltyEvaluation {
  const orderCount = Math.max(0, stats.orderCount || 0);
  const totalSpent = Math.max(0, stats.totalSpent || 0);
  const effectiveSpend = totalSpent + Math.max(0, currentCartSubtotal || 0);

  const metOrders = orderCount >= LOYALTY_TARGET_ORDERS;
  const metSpend = effectiveSpend >= LOYALTY_TARGET_SPEND;
  const isLoyal = metOrders || metSpend;

  const reason: LoyaltyEvaluation['reason'] =
    metOrders && metSpend
      ? 'both'
      : metOrders
      ? 'orders'
      : metSpend
      ? 'spend'
      : 'none';

  const ordersRemaining = Math.max(0, LOYALTY_TARGET_ORDERS - orderCount);
  const spendRemaining = Math.max(0, LOYALTY_TARGET_SPEND - effectiveSpend);

  const orderProgress = Math.min(100, (orderCount / LOYALTY_TARGET_ORDERS) * 100);
  const spendProgress = Math.min(100, (effectiveSpend / LOYALTY_TARGET_SPEND) * 100);
  const progressPercent = Math.round(Math.max(orderProgress, spendProgress));

  return {
    isLoyal,
    reason,
    orderCount,
    totalSpent,
    effectiveSpend,
    targetOrders: LOYALTY_TARGET_ORDERS,
    targetSpend: LOYALTY_TARGET_SPEND,
    ordersRemaining,
    spendRemaining,
    progressPercent,
  };
}

export function formatWhatsAppMessage(
  form: OrderFormInput,
  totals: CartTotals,
  whatsappNumber: string,
  isLoyalCustomer: boolean = false
): { message: string; whatsappUrl: string } {
  const cleanPhone = form.phone.replace(/\D/g, '');
  const lines: string[] = ['*புதிய ஆர்டர் – Malini Cloud Kitchen*'];
  if (isLoyalCustomer) {
    lines.push('★ *தொடர் வாடிக்கையாளர் (Loyal Customer)*');
  }
  lines.push('');

  for (const row of totals.lineItems) {
    lines.push(`• ${row.item.name} × ${row.qty} = ₹${row.lineTotal}`);
  }

  lines.push('');
  if (totals.deliveryFee > 0) {
    lines.push(`Delivery: ₹${totals.deliveryFee}`);
  }
  lines.push(`*மொத்தம்: ₹${totals.grandTotal}*`);
  lines.push('');
  lines.push(`பெயர்: ${form.name.trim()}`);
  lines.push(`போன்: ${cleanPhone}`);
  lines.push(`முகவரி: ${form.address.trim()}`);
  lines.push(`நேரம்: ${form.timeSlot}`);
  lines.push(`பணம்: ${form.paymentMethod}`);

  if (form.note.trim()) {
    lines.push(`குறிப்பு: ${form.note.trim()}`);
  }

  const message = lines.join('\n');
  const cleanWa = whatsappNumber.replace(/\D/g, '') || '919600730095';
  const whatsappUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(message)}`;

  return { message, whatsappUrl };
}
