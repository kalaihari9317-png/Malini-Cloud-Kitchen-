import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialMenuItems, DEFAULT_CFG } from '../data/menuData.ts';
import {
  calculateCartTotals,
  checkShopOpen,
  evaluateCustomerLoyalty,
  filterMenuItems,
  formatWhatsAppMessage,
  updateCartQuantity,
  validateOrderForm,
} from './orderLogic.ts';

test('createInitialMenuItems produces all 35 authentic menu items across 6 categories', () => {
  const items = createInitialMenuItems();
  assert.equal(items.length, 35);
  assert.equal(items[0].key, 'd01');
  assert.equal(items[0].name, 'இட்லி (2)');
  assert.equal(items[0].price, 20);
  assert.equal(items[34].key, 'd35');
  assert.equal(items[34].name, 'எக் நூடுல்ஸ்');
});

test('filterMenuItems supports Tamil and English search queries and dietary filters', () => {
  const items = createInitialMenuItems();

  // Search in English for "dosa"
  const dosaResults = filterMenuItems(items, {
    category: 'all',
    query: 'dosa',
    diet: 'all',
  });
  assert.ok(dosaResults.length >= 3);
  assert.ok(dosaResults.some((x) => x.name.includes('தோசை')));

  // Search in Tamil for "மீல்ஸ்"
  const mealsResults = filterMenuItems(items, {
    category: 'all',
    query: 'மீல்ஸ்',
    diet: 'all',
  });
  assert.equal(mealsResults.length, 2);

  // Filter by category 'rice' and diet 'veg'
  const vegRice = filterMenuItems(items, {
    category: 'rice',
    query: '',
    diet: 'veg',
  });
  assert.equal(vegRice.length, 7);

  // Filter by diet 'nonveg'
  const nonVegItems = filterMenuItems(items, {
    category: 'all',
    query: '',
    diet: 'nonveg',
  });
  assert.ok(nonVegItems.every((x) => x.diet === 'nonveg'));
  assert.equal(nonVegItems.length, 5);
});

test('updateCartQuantity and calculateCartTotals compute accurate counts and subtotals', () => {
  const items = createInitialMenuItems();
  let cart = {};
  // Add 2 Idlis (₹20 each = ₹40) and 1 Veg Meals (₹120)
  cart = updateCartQuantity(cart, 0, 2);
  cart = updateCartQuantity(cart, 21, 1);

  const totals = calculateCartTotals(items, cart, {
    deliveryFee: 20,
    minOrder: 100,
  });

  assert.equal(totals.itemCount, 3);
  assert.equal(totals.subtotal, 160);
  assert.equal(totals.deliveryFee, 20);
  assert.equal(totals.grandTotal, 180);
  assert.equal(totals.minOrderShortfall, 0);

  // Decrement Idli to 0
  cart = updateCartQuantity(cart, 0, -2);
  assert.equal(cart[0], undefined);
});

test('validateOrderForm catches empty cart, missing fields, invalid phone, and formats WhatsApp URL', () => {
  const items = createInitialMenuItems();
  const cart = { 0: 2, 21: 1 }; // ₹40 + ₹120 = ₹160
  const totals = calculateCartTotals(items, cart, DEFAULT_CFG);

  const badPhoneResult = validateOrderForm(
    {
      name: 'கார்த்திக்',
      phone: '98765',
      address: 'உறையூர், திருச்சி',
      timeSlot: 'மதியம் (12–2)',
      paymentMethod: 'UPI / GPay',
      note: 'காரம் குறைவாக',
    },
    totals,
    true,
    0
  );
  assert.equal(badPhoneResult.valid, false);
  assert.equal(badPhoneResult.field, 'phone');

  const validForm = {
    name: 'கார்த்திக்',
    phone: '9876543210',
    address: 'அருள்நகர், உறையூர், திருச்சி',
    timeSlot: 'மதியம் (12–2)',
    paymentMethod: 'UPI / GPay',
    note: 'காரம் குறைவாக',
  };
  const validResult = validateOrderForm(validForm, totals, true, 0);
  assert.equal(validResult.valid, true);

  const { message, whatsappUrl } = formatWhatsAppMessage(
    validForm,
    totals,
    DEFAULT_CFG.whatsapp
  );
  assert.ok(message.includes('*புதிய ஆர்டர் – Malini Cloud Kitchen*'));
  assert.ok(message.includes('• இட்லி (2) × 2 = ₹40'));
  assert.ok(message.includes('• வெஜ் மீல்ஸ் × 1 = ₹120'));
  assert.ok(message.includes('*மொத்தம்: ₹160*'));
  assert.ok(whatsappUrl.startsWith('https://wa.me/919600730095?text='));
});

test('checkShopOpen evaluates operating hours accurately', () => {
  assert.equal(checkShopOpen(null, null, 3), true);
  assert.equal(checkShopOpen(7, 22, 12), true);
  assert.equal(checkShopOpen(7, 22, 23), false);
});

test('evaluateCustomerLoyalty unlocks Loyal Customer badge by order count or cumulative spend', () => {
  // New customer with ₹140 in cart
  const progress = evaluateCustomerLoyalty({ orderCount: 1, totalSpent: 200 }, 140);
  assert.equal(progress.isLoyal, false);
  assert.equal(progress.effectiveSpend, 340);
  assert.equal(progress.spendRemaining, 160);
  assert.equal(progress.ordersRemaining, 2);
  assert.equal(progress.progressPercent, 68);

  // Unlocks by reaching ₹500 cumulative spend
  const loyalBySpend = evaluateCustomerLoyalty({ orderCount: 1, totalSpent: 380 }, 150);
  assert.equal(loyalBySpend.isLoyal, true);
  assert.equal(loyalBySpend.reason, 'spend');
  assert.equal(loyalBySpend.progressPercent, 100);

  // Unlocks by reaching 3 previous orders
  const loyalByOrders = evaluateCustomerLoyalty({ orderCount: 3, totalSpent: 240 }, 60);
  assert.equal(loyalByOrders.isLoyal, true);
  assert.equal(loyalByOrders.reason, 'orders');
});

