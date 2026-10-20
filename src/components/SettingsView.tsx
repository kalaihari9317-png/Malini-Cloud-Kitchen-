import React, { useRef, useState } from 'react';
import { ArrowLeft, Upload, Trash2, Download, RotateCcw } from 'lucide-react';
import {
  CATEGORIES,
  type MenuItem,
  type ShopConfig,
} from '../data/menuData.ts';
import {
  exportStandaloneHtml,
  shrinkImage,
  type StoreState,
} from '../utils/storage.ts';
import { DishVisual } from './DishVisual.tsx';

interface SettingsViewProps {
  items: MenuItem[];
  cfg: ShopConfig;
  store: StoreState;
  onUpdatePrice: (key: string, price: number) => void;
  onUpdateSold: (key: string, sold: boolean) => void;
  onUpdateCfg: (key: keyof ShopConfig, val: string | number | null) => void;
  onUpdatePhotos: (newPhotos: Record<string, string>) => void;
  onResetAll: () => void;
  onBackToSite: () => void;
}

type PickTarget =
  | { type: 'bulk' }
  | { type: 'one'; key: string }
  | { type: 'cat'; cat: string };

export const SettingsView: React.FC<SettingsViewProps> = ({
  items,
  cfg,
  store,
  onUpdatePrice,
  onUpdateSold,
  onUpdateCfg,
  onUpdatePhotos,
  onResetAll,
  onBackToSite,
}) => {
  const [toast, setToast] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pickTargetRef = useRef<PickTarget | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const triggerPick = (target: PickTarget, multiple: boolean) => {
    pickTargetRef.current = target;
    if (fileInputRef.current) {
      fileInputRef.current.multiple = multiple;
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const normName = (s: string) =>
    s
      .toLowerCase()
      .replace(/\.[^.]+$/, '')
      .replace(/[\s_\-()+.]/g, '');

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const mode = pickTargetRef.current;
    if (!files.length || !mode) return;

    showToast('படங்களைச் சுருக்கி ஏற்றுகிறது… காத்திருக்கவும்');
    const updatedPhotos: Record<string, string> = { ...store.photos };
    let ok = 0;
    const bad: string[] = [];

    const putPhoto = async (key: string, f: File) => {
      try {
        const maxDim = key === 'hero' || key === 'kitchen' ? 1200 : 900;
        updatedPhotos[key] = await shrinkImage(f, maxDim);
        ok++;
      } catch {
        bad.push(f.name);
      }
    };

    if (mode.type === 'one') {
      await putPhoto(mode.key, files[0]);
    } else if (mode.type === 'cat') {
      files.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true })
      );
      const rows = items.filter((x) => x.cat === mode.cat);
      let targets = rows.filter((x) => !updatedPhotos[x.key]);
      if (!targets.length) targets = rows;
      for (let i = 0; i < files.length; i++) {
        if (i < targets.length) {
          await putPhoto(targets[i].key, files[i]);
        } else {
          bad.push(`${files[i].name} (இடம் இல்லை)`);
        }
      }
    } else {
      for (const f of files) {
        const base = f.name
          .replace(/\.[^.]+$/, '')
          .toLowerCase()
          .trim();
        let key: string | null = null;
        if (base === 'hero' || base === 'kitchen') {
          key = base;
        } else if (/^d\d{2}$/.test(base) && items.some((x) => x.key === base)) {
          key = base;
        } else {
          const matched = items.find(
            (x) =>
              normName(x.name) === normName(f.name) ||
              normName(x.englishName) === normName(f.name)
          );
          if (matched) key = matched.key;
        }
        if (key) {
          await putPhoto(key, f);
        } else {
          bad.push(f.name);
        }
      }
    }

    onUpdatePhotos(updatedPhotos);
    showToast(
      `${ok} படங்கள் சேர்க்கப்பட்டன` +
        (bad.length ? ` · பொருந்தாதவை: ${bad.join(', ')}` : '')
    );
  };

  const handleExport = async () => {
    try {
      const sizeMb = await exportStandaloneHtml(store);
      showToast(
        `பதிவிறக்கம் தொடங்கியது (${sizeMb} MB). இந்தக் கோப்பை உங்கள் வெப்சைட்டில் மாற்றுங்கள்.`
      );
    } catch {
      showToast('பதிவிறக்கம் செய்ய இயலவில்லை. மீண்டும் முயலவும்.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF6EA] pb-24">
      <header className="sticky top-0 z-30 bg-[#15362B] py-4 text-white">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-4 sm:px-6">
          <h1 className="font-serif-tamil text-xl font-bold text-white">
            ⚙ கடை அமைப்புகள் (Settings – மாலினி கிளவுடு கிச்சன்)
          </h1>
          <button
            type="button"
            onClick={onBackToSite}
            className="inline-flex items-center gap-2 rounded-full bg-[#E3A62B] px-4 py-2 text-sm font-bold text-[#15362B] hover:bg-[#f2b705]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>வெப்சைட்டுக்குத் திரும்ப</span>
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[1200px] px-4 pt-6 sm:px-6">
        <div className="mb-6 rounded-2xl border border-[#E3A62B] bg-[#FFF3CC] p-4 text-sm text-[#1E241F]">
          <strong>கவனிக்க:</strong> இங்கே செய்யும் விலை, இருப்பு மற்றும் பட மாற்றங்கள்
          உடனடியாக வெப்சைட்டில் பிரதிபலிக்கும். எல்லாம் முடிந்ததும் கீழே உள்ள{' '}
          <strong>“புதிய HTML பதிவிறக்கு”</strong> பொத்தானை அழுத்தி முழு கோப்பையும்
          பதிவிறக்கிக் கொள்ளலாம்.
        </div>

        {/* 1. Bulk Photo Upload */}
        <div className="mb-6 rounded-2xl border border-[#E2D8C0] bg-white p-6">
          <h2 className="font-serif-tamil text-xl font-bold text-[#15362B]">
            1. எல்லாப் படங்களும் ஒரே நேரத்தில் ஏற்ற
          </h2>
          <p className="mt-1 text-sm text-[#4A5246]">
            படங்களின் பெயரை <strong>hero</strong>, <strong>kitchen</strong>,{' '}
            <strong>d01 … d35</strong> அல்லது <strong>உணவின் பெயர்</strong> என்று
            வைத்திருந்தால் தானாகப் பொருந்திவிடும்.
          </p>
          <button
            type="button"
            onClick={() => triggerPick({ type: 'bulk' }, true)}
            className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#C4451C] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#a93a17]"
          >
            <Upload className="h-4 w-4" aria-hidden="true" />
            <span>படங்களைத் தேர்வு செய்ய (பல)</span>
          </button>
        </div>

        {/* 2. Hero & Kitchen Photos */}
        <div className="mb-6 rounded-2xl border border-[#E2D8C0] bg-white p-6">
          <h2 className="font-serif-tamil text-xl font-bold text-[#15362B]">
            2. முகப்புப் படங்கள்
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {(
              [
                ['hero', 'முகப்புப் பெரிய படம் (Hero Banner)'],
                ['kitchen', '“ஏன் மாலினி” சமையலறைப் படம்'],
              ] as const
            ).map(([key, label]) => (
              <div
                key={key}
                className="flex flex-wrap items-center gap-4 rounded-xl border border-[#E2D8C0] p-4"
              >
                <div className="h-24 w-32 overflow-hidden rounded-xl border border-[#E2D8C0]">
                  <DishVisual
                    imgKey={key}
                    alt={label}
                    customSrc={store.photos[key]}
                    variant="thumb"
                    className="h-full w-full"
                  />
                </div>
                <div>
                  <strong className="block text-sm font-bold text-[#15362B]">
                    {label}
                  </strong>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => triggerPick({ type: 'one', key }, false)}
                      className="rounded-full border border-[#15362B] px-4 py-1.5 text-xs font-semibold text-[#15362B] hover:bg-[#15362B] hover:text-white"
                    >
                      படம் மாற்ற
                    </button>
                    {store.photos[key] && (
                      <button
                        type="button"
                        onClick={() => {
                          const next = { ...store.photos };
                          delete next[key];
                          onUpdatePhotos(next);
                          showToast('படம் நீக்கப்பட்டது');
                        }}
                        aria-label={`${label} படத்தை நீக்கு`}
                        className="rounded-full p-1.5 text-[#C4451C] hover:bg-[#FDECE7]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Menu Items Price, Availability & Photo Editor */}
        <div className="mb-6 rounded-2xl border border-[#E2D8C0] bg-white p-6">
          <h2 className="font-serif-tamil text-xl font-bold text-[#15362B]">
            3. உணவுகள் – படம், விலை, இருப்பு (35 உணவுகள்)
          </h2>
          <p className="mt-1 text-sm text-[#4A5246]">
            விலையை மாற்றினால் அல்லது “இன்று இல்லை” தேர்வு செய்தால் உடனடியாக
            மெனுவில் மாறும்.
          </p>

          <div className="mt-4 space-y-4">
            {CATEGORIES.map((cat) => {
              const catItems = items.filter((x) => x.cat === cat.id);
              return (
                <details
                  key={cat.id}
                  open={cat.id === 'tiffin' || cat.id === 'meals'}
                  className="rounded-xl border border-[#E2D8C0] bg-[#FBF6EA]/50 p-4"
                >
                  <summary className="flex cursor-pointer items-center justify-between font-serif-tamil text-lg font-bold text-[#15362B]">
                    <span>{cat.title}</span>
                    <span className="font-sans-tamil text-xs font-normal text-[#4A5246]">
                      {catItems.length} உணவுகள்
                    </span>
                  </summary>

                  <div className="mt-3 mb-2">
                    <button
                      type="button"
                      onClick={() =>
                        triggerPick({ type: 'cat', cat: cat.id }, true)
                      }
                      className="rounded-full border border-[#15362B] bg-white px-4 py-1.5 text-xs font-semibold text-[#15362B] hover:bg-[#15362B] hover:text-white"
                    >
                      இந்தப் பிரிவுக்கு பல படங்கள் ஏற்ற (வரிசையாக)
                    </button>
                  </div>

                  <div className="divide-y divide-[#E2D8C0]">
                    {catItems.map((item) => (
                      <div
                        key={item.key}
                        className="flex flex-wrap items-center justify-between gap-4 py-3"
                      >
                        <div className="flex items-center gap-3 min-w-[220px] flex-1">
                          <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-[#E2D8C0]">
                            <DishVisual
                              imgKey={item.key}
                              alt={item.name}
                              customSrc={store.photos[item.key]}
                              variant="thumb"
                              className="h-full w-full"
                            />
                          </div>
                          <div>
                            <strong className="block text-sm font-bold text-[#15362B]">
                              {item.name}
                            </strong>
                            <span className="text-xs text-[#4A5246]">
                              {item.key} · {item.englishName}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                          <label className="flex items-center gap-1.5 text-sm font-semibold text-[#15362B]">
                            <span>₹</span>
                            <input
                              type="number"
                              min={0}
                              aria-label={`${item.name} விலை`}
                              value={item.price}
                              onChange={(e) => {
                                const val = Math.max(
                                  0,
                                  parseInt(e.target.value, 10) || 0
                                );
                                onUpdatePrice(item.key, val);
                                showToast(`${item.name} விலை ₹${val} என சேமிக்கப்பட்டது`);
                              }}
                              className="font-mono-num tabular-nums w-20 rounded-lg border border-[#BDB9A2] bg-white px-2.5 py-1.5 text-sm"
                            />
                          </label>

                          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-[#1E241F]">
                            <input
                              type="checkbox"
                              checked={item.sold}
                              onChange={(e) => {
                                onUpdateSold(item.key, e.target.checked);
                                showToast(
                                  `${item.name} நிலை மாற்றியமைக்கப்பட்டது`
                                );
                              }}
                              className="h-4 w-4 accent-[#C4451C]"
                            />
                            <span>இன்று இல்லை</span>
                          </label>

                          <button
                            type="button"
                            onClick={() =>
                              triggerPick({ type: 'one', key: item.key }, false)
                            }
                            className="rounded-full border border-[#15362B] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#15362B] hover:bg-[#15362B] hover:text-white"
                          >
                            படம்
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              );
            })}
          </div>
        </div>

        {/* 4. Shop Configuration */}
        <div className="mb-6 rounded-2xl border border-[#E2D8C0] bg-white p-6">
          <h2 className="font-serif-tamil text-xl font-bold text-[#15362B]">
            4. கடை விவரங்கள்
          </h2>
          <p className="mt-1 text-sm text-[#4A5246]">
            திறக்கும் / மூடும் மணியை நிரப்பினால், மூடிய நேரத்தில் ஆர்டர் தடுக்கப்படும்.
            காலியாக விட்டால் எப்போதும் திறந்திருக்கும்.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label
                htmlFor="cf-whatsapp"
                className="block text-xs font-bold text-[#15362B]"
              >
                WhatsApp எண் (91 உடன்)
              </label>
              <input
                id="cf-whatsapp"
                type="text"
                value={cfg.whatsapp}
                onChange={(e) => onUpdateCfg('whatsapp', e.target.value.trim())}
                className="font-mono-num mt-1 w-full rounded-xl border border-[#BDB9A2] px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="cf-deliveryFee"
                className="block text-xs font-bold text-[#15362B]"
              >
                Delivery கட்டணம் ₹
              </label>
              <input
                id="cf-deliveryFee"
                type="number"
                min={0}
                value={cfg.deliveryFee}
                onChange={(e) =>
                  onUpdateCfg(
                    'deliveryFee',
                    Math.max(0, parseInt(e.target.value, 10) || 0)
                  )
                }
                className="font-mono-num mt-1 w-full rounded-xl border border-[#BDB9A2] px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="cf-minOrder"
                className="block text-xs font-bold text-[#15362B]"
              >
                குறைந்தபட்ச ஆர்டர் ₹
              </label>
              <input
                id="cf-minOrder"
                type="number"
                min={0}
                value={cfg.minOrder}
                onChange={(e) =>
                  onUpdateCfg(
                    'minOrder',
                    Math.max(0, parseInt(e.target.value, 10) || 0)
                  )
                }
                className="font-mono-num mt-1 w-full rounded-xl border border-[#BDB9A2] px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="cf-upi"
                className="block text-xs font-bold text-[#15362B]"
              >
                UPI ID
              </label>
              <input
                id="cf-upi"
                type="text"
                value={cfg.upi}
                onChange={(e) => onUpdateCfg('upi', e.target.value.trim())}
                placeholder="malini@upi"
                className="mt-1 w-full rounded-xl border border-[#BDB9A2] px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="cf-openHour"
                className="block text-xs font-bold text-[#15362B]"
              >
                திறக்கும் மணி (0–23)
              </label>
              <input
                id="cf-openHour"
                type="number"
                min={0}
                max={23}
                value={cfg.openHour ?? ''}
                onChange={(e) =>
                  onUpdateCfg(
                    'openHour',
                    e.target.value === ''
                      ? null
                      : Math.min(23, Math.max(0, parseInt(e.target.value, 10) || 0))
                  )
                }
                className="font-mono-num mt-1 w-full rounded-xl border border-[#BDB9A2] px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="cf-closeHour"
                className="block text-xs font-bold text-[#15362B]"
              >
                மூடும் மணி (1–24)
              </label>
              <input
                id="cf-closeHour"
                type="number"
                min={1}
                max={24}
                value={cfg.closeHour ?? ''}
                onChange={(e) =>
                  onUpdateCfg(
                    'closeHour',
                    e.target.value === ''
                      ? null
                      : Math.min(24, Math.max(1, parseInt(e.target.value, 10) || 24))
                  )
                }
                className="font-mono-num mt-1 w-full rounded-xl border border-[#BDB9A2] px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="cf-areas"
                className="block text-xs font-bold text-[#15362B]"
              >
                Delivery பகுதிகள்
              </label>
              <input
                id="cf-areas"
                type="text"
                value={cfg.areas}
                onChange={(e) => onUpdateCfg('areas', e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#BDB9A2] px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="cf-fssai"
                className="block text-xs font-bold text-[#15362B]"
              >
                FSSAI எண்
              </label>
              <input
                id="cf-fssai"
                type="text"
                value={cfg.fssai}
                onChange={(e) => onUpdateCfg('fssai', e.target.value.trim())}
                className="mt-1 w-full rounded-xl border border-[#BDB9A2] px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        {/* 5. Export & Reset */}
        <div className="rounded-2xl border border-[#E2D8C0] bg-white p-6">
          <h2 className="font-serif-tamil text-xl font-bold text-[#15362B]">
            5. சேமித்து வெளியிட
          </h2>
          <p className="mt-1 text-sm text-[#4A5246]">
            படங்கள் மற்றும் விலைகள் சேர்த்து முடித்ததும் புதிய HTML-ஐப் பதிவிறக்கலாம்.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#C4451C] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#a93a17]"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>புதிய HTML பதிவிறக்கு</span>
            </button>

            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#15362B] px-5 py-2.5 text-sm font-semibold text-[#15362B] hover:bg-[#F3EBD8]"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                <span>மாற்றங்களை அழி (Reset)</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onResetAll();
                    setConfirmReset(false);
                    showToast('அனைத்து மாற்றங்களும் மீட்டமைக்கப்பட்டன');
                  }}
                  className="rounded-full bg-[#C4451C] px-4 py-2 text-xs font-bold text-white"
                >
                  ஆம், அனைத்தையும் அழி
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="rounded-full border border-[#E2D8C0] px-4 py-2 text-xs font-semibold text-[#4A5246]"
                >
                  வேண்டாம்
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFilesSelected}
      />

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#15362B] px-6 py-3 text-sm font-semibold text-white shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  );
};
