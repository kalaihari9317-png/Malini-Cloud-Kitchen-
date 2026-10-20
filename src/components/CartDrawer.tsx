import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Copy,
  ExternalLink,
  Award,
} from 'lucide-react';
import {
  evaluateCustomerLoyalty,
  formatWhatsAppMessage,
  validateOrderForm,
  type CartTotals,
  type CustomerLoyaltyStats,
  type OrderFormInput,
} from '../utils/orderLogic.ts';
import {
  loadCustomer,
  loadLoyaltyStats,
  recordCompletedOrder,
  saveCustomer,
} from '../utils/storage.ts';
import type { ShopConfig } from '../data/menuData.ts';

interface CartDrawerProps {
  isOpen: boolean;
  totals: CartTotals;
  cfg: ShopConfig;
  isShopOpen: boolean;
  onClose: () => void;
  onUpdateQty: (itemId: number, delta: number) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  totals,
  cfg,
  isShopOpen,
  onClose,
  onUpdateQty,
  onClearCart,
}) => {
  const savedCust = loadCustomer();
  const [form, setForm] = useState<OrderFormInput>({
    name: savedCust.name,
    phone: savedCust.phone,
    address: savedCust.address,
    timeSlot: 'உடனே',
    paymentMethod: 'Cash on Delivery',
    note: '',
  });
  const [loyaltyStats, setLoyaltyStats] = useState<CustomerLoyaltyStats>(() =>
    loadLoyaltyStats()
  );
  const [hasRecordedCurrentOrder, setHasRecordedCurrentOrder] = useState(false);
  const [error, setError] = useState('');
  const [submittedOrder, setSubmittedOrder] = useState<{
    message: string;
    whatsappUrl: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setLoyaltyStats(loadLoyaltyStats());
    } else {
      setError('');
      setSubmittedOrder(null);
      setCopied(false);
      setHasRecordedCurrentOrder(false);
    }
  }, [isOpen]);

  const loyalty = useMemo(
    () =>
      evaluateCustomerLoyalty(
        loyaltyStats,
        hasRecordedCurrentOrder ? 0 : totals.subtotal
      ),
    [loyaltyStats, totals.subtotal, hasRecordedCurrentOrder]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateOrderForm(
      form,
      totals,
      isShopOpen,
      cfg.minOrder
    );
    if (!validation.valid) {
      setError(validation.error);
      if (validation.field === 'name') nameRef.current?.focus();
      if (validation.field === 'phone') phoneRef.current?.focus();
      if (validation.field === 'address') addressRef.current?.focus();
      return;
    }

    setError('');
    saveCustomer({
      name: form.name.trim(),
      phone: form.phone.replace(/\D/g, ''),
      address: form.address.trim(),
    });

    let nextStats = loyaltyStats;
    if (!hasRecordedCurrentOrder) {
      nextStats = recordCompletedOrder(totals.grandTotal);
      setLoyaltyStats(nextStats);
      setHasRecordedCurrentOrder(true);
    }

    const postOrderLoyalty = evaluateCustomerLoyalty(nextStats, 0);
    const formatted = formatWhatsAppMessage(
      form,
      totals,
      cfg.whatsapp,
      postOrderLoyalty.isLoyal
    );
    setSubmittedOrder(formatted);
  };

  const handleCopyMessage = async () => {
    if (!submittedOrder) return;
    try {
      await navigator.clipboard.writeText(submittedOrder.message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore clipboard errors
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-dialog-title"
        className="flex max-h-[92vh] w-full max-w-[540px] flex-col overflow-hidden rounded-t-3xl bg-[#FBF6EA] sm:rounded-3xl border border-[#E2D8C0]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#E2D8C0] bg-[#15362B] px-6 py-4 text-[#FBF6EA]">
          <div>
            <h2
              id="cart-dialog-title"
              className="font-serif-tamil text-xl font-bold text-white"
            >
              உங்கள் ஆர்டர் (Your Cart)
            </h2>
            <p className="text-xs text-[#D5E0D9]">
              {totals.itemCount} உணவுகள் · மெனுவிலிருந்து தேர்வு செய்தவை
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cart மூடு"
            className="flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/15"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Loyal Customer Badge / Progress UI Element */}
          <div className="mb-4" data-testid="loyalty-card">
            {loyalty.isLoyal ? (
              <div
                role="status"
                className="flex items-start gap-3.5 rounded-2xl border border-[#E3A62B] bg-[#15362B] p-4 text-[#FBF6EA]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E3A62B] text-[#15362B]">
                  <Award className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong className="font-serif-tamil text-sm font-bold text-[#E3A62B] sm:text-base">
                      தொடர் வாடிக்கையாளர் · Loyal Customer
                    </strong>
                    <span className="font-mono-num tabular-nums text-xs font-semibold text-[#D5E0D9]">
                      {loyalty.orderCount > 0
                        ? `${loyalty.orderCount} ஆர்டர்கள் · ₹${loyalty.effectiveSpend}`
                        : `மொத்த மதிப்பு ₹${loyalty.effectiveSpend}`}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-[#D5E0D9]">
                    எங்கள் தொடர் வாடிக்கையாளர் என்பதால் உங்கள் WhatsApp ஆர்டரில்
                    சிறப்பு முன்னுரிமை அடையாளம் சேர்க்கப்பட்டுள்ளது!
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-[#E3A62B]/80 bg-[#FFF8E6] p-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Award
                      className="h-4 w-4 shrink-0 text-[#9A5B13]"
                      aria-hidden="true"
                    />
                    <strong className="text-xs font-bold text-[#15362B] sm:text-sm">
                      தொடர் வாடிக்கையாளர் திட்டம் · Loyal Customer
                    </strong>
                  </div>
                  <span className="font-mono-num tabular-nums text-xs font-semibold text-[#9A5B13]">
                    ₹{loyalty.effectiveSpend} / ₹{loyalty.targetSpend} ·{' '}
                    {loyalty.orderCount}/{loyalty.targetOrders} ஆர்டர்கள்
                  </span>
                </div>

                <div
                  role="progressbar"
                  aria-label="Loyal Customer முன்னேற்றம்"
                  aria-valuenow={loyalty.progressPercent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#E6DEC8]"
                >
                  <div
                    className="h-full rounded-full bg-[#15362B] transition-all duration-200"
                    style={{ width: `${loyalty.progressPercent}%` }}
                  />
                </div>

                <p className="mt-1.5 text-xs text-[#4A5246]">
                  இன்னும்{' '}
                  <strong className="font-mono-num tabular-nums text-[#C4451C]">
                    ₹{loyalty.spendRemaining}
                  </strong>{' '}
                  மதிப்புள்ள உணவு சேர்த்தால் (அல்லது இன்னும்{' '}
                  <strong className="font-mono-num tabular-nums text-[#15362B]">
                    {loyalty.ordersRemaining}
                  </strong>{' '}
                  ஆர்டர்களில்) <strong>Loyal Customer</strong> சிறப்பு தகுதி
                  பெறுவீர்கள்!
                </p>
              </div>
            )}
          </div>

          {totals.lineItems.length === 0 ? (
            <div className="py-10 text-center">
              <p className="font-serif-tamil text-lg font-bold text-[#15362B]">
                Cart காலியாக உள்ளது
              </p>
              <p className="mt-1 text-sm text-[#4A5246]">
                மெனுவில் உங்களுக்குப் பிடித்த உணவைச் சேர்க்கவும்.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#15362B] px-6 py-2.5 text-sm font-semibold text-white"
              >
                மெனு பார்க்க
              </button>
            </div>
          ) : submittedOrder ? (
            /* Post-Submit Order Confirmation & WhatsApp Launch View */
            <div className="space-y-4">
              <div className="rounded-2xl border border-[#1E8A39]/40 bg-[#EBF7EE] p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 h-6 w-6 shrink-0 text-[#1E8A39]"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-bold text-[#15362B]">
                      உங்கள் ஆர்டர் செய்தி தயாராக உள்ளது!
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#4A5246]">
                      கீழே உள்ள பொத்தானை அழுத்தி WhatsApp-ல் எங்களுக்கு அனுப்பவும்.
                      எங்கள் பதில் வந்த பின்பே ஆர்டர் உறுதியாகும்.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[#E2D8C0] bg-white p-4">
                <p className="mb-2 text-xs font-semibold text-[#4A5246]">
                  WhatsApp ஆர்டர் விவரம்:
                </p>
                <pre className="whitespace-pre-wrap font-sans-tamil text-xs leading-relaxed text-[#1E241F]">
                  {submittedOrder.message}
                </pre>
              </div>

              <div className="flex flex-col gap-3">
                <a
                  href={submittedOrder.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#1E8A39] px-6 py-3 text-base font-semibold text-white hover:bg-[#176e2d]"
                >
                  <span>WhatsApp-ல் திறந்து அனுப்பவும்</span>
                  <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
                </a>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full border border-[#15362B] bg-white px-4 py-2 text-xs font-semibold text-[#15362B] hover:bg-[#F3EBD8]"
                  >
                    <Copy className="h-4 w-4" aria-hidden="true" />
                    <span>
                      {copied ? 'நகலெடுக்கப்பட்டது!' : 'செய்தியை நகலெடு (Copy)'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSubmittedOrder(null)}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#E2D8C0] bg-white px-4 py-2 text-xs font-semibold text-[#4A5246] hover:bg-[#F3EBD8]"
                  >
                    திருத்தவும்
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Itemized Cart & Customer Checkout Form */
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#4A5246]">
                  தேர்ந்தெடுத்த உணவுகள்
                </span>
                <button
                  type="button"
                  onClick={onClearCart}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#C4451C] hover:underline"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Cart காலி செய்</span>
                </button>
              </div>

              <div className="divide-y divide-[#E2D8C0] rounded-2xl border border-[#E2D8C0] bg-white px-4">
                {totals.lineItems.map(({ item, qty, lineTotal }) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[#15362B] text-sm">
                        {item.name}
                      </p>
                      <p className="font-mono-num tabular-nums text-xs text-[#4A5246]">
                        ₹{item.price} × {qty}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="inline-flex items-center rounded-full bg-[#15362B] text-white">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.id, -1)}
                          aria-label={`${item.name} அளவு குறை`}
                          className="flex h-8 w-8 items-center justify-center rounded-l-full hover:bg-[#1F4D3A]"
                        >
                          <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                        <span className="font-mono-num tabular-nums min-w-[24px] text-center text-xs font-bold text-[#E3A62B]">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.id, 1)}
                          aria-label={`${item.name} அளவு கூட்டு`}
                          className="flex h-8 w-8 items-center justify-center rounded-r-full hover:bg-[#1F4D3A]"
                        >
                          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>

                      <strong className="font-mono-num tabular-nums min-w-[52px] text-right text-sm font-bold text-[#1E241F]">
                        ₹{lineTotal}
                      </strong>
                    </div>
                  </div>
                ))}

                {totals.deliveryFee > 0 && (
                  <div className="flex items-center justify-between py-2.5 text-sm">
                    <span className="text-[#4A5246]">Delivery கட்டணம்</span>
                    <strong className="font-mono-num tabular-nums">
                      ₹{totals.deliveryFee}
                    </strong>
                  </div>
                )}

                <div className="flex items-center justify-between py-3 text-base font-bold">
                  <span className="text-[#15362B]">மொத்தம் (Grand Total)</span>
                  <span className="font-mono-num tabular-nums text-lg text-[#C4451C]">
                    ₹{totals.grandTotal}
                  </span>
                </div>
              </div>

              {totals.minOrderShortfall > 0 && (
                <p className="mt-2 text-xs font-semibold text-[#C4451C]">
                  குறைந்தபட்ச ஆர்டர் ₹{cfg.minOrder} (இன்னும் ₹
                  {totals.minOrderShortfall} தேவை)
                </p>
              )}

              {/* Checkout Form */}
              <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-3 pb-2">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="cn"
                      className="block text-xs font-bold text-[#15362B]"
                    >
                      உங்கள் பெயர் *
                    </label>
                    <input
                      ref={nameRef}
                      id="cn"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="பெயரை உள்ளிடவும்"
                      autoComplete="name"
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#BDB9A2] bg-white px-3.5 py-2 text-sm text-[#1E241F]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="cp"
                      className="block text-xs font-bold text-[#15362B]"
                    >
                      போன் எண் (10 இலக்கம்) *
                    </label>
                    <input
                      ref={phoneRef}
                      id="cp"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      required
                      value={form.phone}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          phone: e.target.value.replace(/\D/g, '').slice(0, 10),
                        })
                      }
                      placeholder="10 இலக்க மொபைல் எண்"
                      autoComplete="tel"
                      className="font-mono-num tabular-nums mt-1 min-h-[42px] w-full rounded-xl border border-[#BDB9A2] bg-white px-3.5 py-2 text-sm text-[#1E241F]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="ca"
                    className="block text-xs font-bold text-[#15362B]"
                  >
                    Delivery முகவரி *
                  </label>
                  <textarea
                    ref={addressRef}
                    id="ca"
                    rows={2}
                    required
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    placeholder="வீட்டு எண், தெரு, பகுதி (உறையூர் / திருச்சி)"
                    autoComplete="street-address"
                    className="mt-1 w-full rounded-xl border border-[#BDB9A2] bg-white px-3.5 py-2 text-sm text-[#1E241F]"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="ct"
                      className="block text-xs font-bold text-[#15362B]"
                    >
                      வேண்டிய நேரம்
                    </label>
                    <select
                      id="ct"
                      value={form.timeSlot}
                      onChange={(e) =>
                        setForm({ ...form, timeSlot: e.target.value })
                      }
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#BDB9A2] bg-white px-3 py-2 text-sm text-[#1E241F]"
                    >
                      <option value="உடனே">உடனே</option>
                      <option value="காலை (7–10)">காலை (7–10)</option>
                      <option value="மதியம் (12–2)">மதியம் (12–2)</option>
                      <option value="மாலை (4–7)">மாலை (4–7)</option>
                      <option value="இரவு (7–10)">இரவு (7–10)</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="cm"
                      className="block text-xs font-bold text-[#15362B]"
                    >
                      பணம் செலுத்தும் முறை
                    </label>
                    <select
                      id="cm"
                      value={form.paymentMethod}
                      onChange={(e) =>
                        setForm({ ...form, paymentMethod: e.target.value })
                      }
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#BDB9A2] bg-white px-3 py-2 text-sm text-[#1E241F]"
                    >
                      <option value="Cash on Delivery">Cash on Delivery</option>
                      <option value="UPI / GPay">UPI / GPay</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="cx"
                    className="block text-xs font-bold text-[#15362B]"
                  >
                    சமையல் குறிப்பு (விருப்பம்)
                  </label>
                  <input
                    id="cx"
                    type="text"
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    placeholder="உதா: காரம் குறைவாக, வெங்காயம் வேண்டாம்"
                    className="mt-1 min-h-[42px] w-full rounded-xl border border-[#BDB9A2] bg-white px-3.5 py-2 text-sm text-[#1E241F]"
                  />
                </div>

                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-[#C4451C]/40 bg-[#FDECE7] px-3.5 py-2.5 text-xs font-semibold text-[#C4451C]"
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="mt-2 inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[#1E8A39] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[#176e2d]"
                >
                  WhatsApp-ல் ஆர்டர் அனுப்ப
                </button>

                <p className="text-center text-xs text-[#4A5246]">
                  WhatsApp திறக்கும் முன் ஆர்டர் விவரத்தைச் சரிபார்க்கலாம். ஆர்டர்
                  உறுதி WhatsApp-ல் பதில் வந்த பின்பே.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
