/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { ShoppingBag } from 'lucide-react';
import {
  CATEGORIES,
  createInitialMenuItems,
  DEFAULT_CFG,
  type DietType,
  type MenuItem,
  type ShopConfig,
} from './data/menuData.ts';
import {
  calculateCartTotals,
  checkShopOpen,
  filterMenuItems,
  updateCartQuantity,
  type CartMap,
} from './utils/orderLogic.ts';
import {
  loadCart,
  loadStoreState,
  saveCart,
  saveStoreState,
  type StoreState,
} from './utils/storage.ts';
import { Header } from './components/Header.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { MenuSection } from './components/MenuSection.tsx';
import { StoryAndHowSection } from './components/StoryAndHowSection.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { SettingsView } from './components/SettingsView.tsx';

export default function App() {
  const [baseItems] = useState<MenuItem[]>(() => createInitialMenuItems());
  const [store, setStore] = useState<StoreState>({
    photos: {},
    cfg: {},
    items: {},
  });
  const [cart, setCart] = useState<CartMap>(() => loadCart());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDiet, setSelectedDiet] = useState<'all' | DietType>('all');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isSettingsView, setIsSettingsView] = useState<boolean>(
    () => window.location.hash === '#settings'
  );
  const [activeSection, setActiveSection] = useState<string>('top');
  const [srAnnouncement, setSrAnnouncement] = useState<string>('');

  // Load persisted IndexedDB store on mount
  useEffect(() => {
    loadStoreState().then((loaded) => {
      setStore(loaded);
    });
  }, []);

  // Listen to hashchange for #settings vs storefront
  useEffect(() => {
    const onHashChange = () => {
      const s = window.location.hash === '#settings';
      setIsSettingsView(s);
      if (s) window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Track active navigation section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const contactEl = document.getElementById('contact');
      const howEl = document.getElementById('how');
      const menuEl = document.getElementById('menu');

      if (contactEl && scrollY >= contactEl.offsetTop - 180) {
        setActiveSection('contact');
      } else if (howEl && scrollY >= howEl.offsetTop - 180) {
        setActiveSection('how');
      } else if (menuEl && scrollY >= menuEl.offsetTop - 180) {
        setActiveSection('menu');
      } else {
        setActiveSection('top');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Merge configuration with overrides
  const cfg: ShopConfig = useMemo(
    () => ({
      ...DEFAULT_CFG,
      ...store.cfg,
    }),
    [store.cfg]
  );

  // Merge menu items with price/sold overrides
  const items: MenuItem[] = useMemo(() => {
    return baseItems.map((item) => {
      const ov = store.items[item.key];
      if (!ov) return item;
      return {
        ...item,
        price: ov.price != null ? ov.price : item.price,
        sold: ov.sold != null ? !!ov.sold : item.sold,
      };
    });
  }, [baseItems, store.items]);

  const filteredItems = useMemo(
    () =>
      filterMenuItems(items, {
        category: selectedCategory,
        query: searchQuery,
        diet: selectedDiet,
      }),
    [items, selectedCategory, searchQuery, selectedDiet]
  );

  const featuredItems = useMemo(() => {
    return cfg.featured
      .map((name) => items.find((x) => x.name === name))
      .filter((x): x is MenuItem => Boolean(x));
  }, [cfg.featured, items]);

  const totals = useMemo(
    () => calculateCartTotals(items, cart, cfg),
    [items, cart, cfg]
  );

  const isShopOpen = useMemo(
    () => checkShopOpen(cfg.openHour, cfg.closeHour),
    [cfg.openHour, cfg.closeHour]
  );

  const minPrice = useMemo(
    () => Math.min(...items.map((x) => x.price)),
    [items]
  );

  const handleUpdateQty = (itemId: number, delta: number) => {
    const next = updateCartQuantity(cart, itemId, delta);
    setCart(next);
    saveCart(next);

    const targetItem = items.find((i) => i.id === itemId);
    if (targetItem) {
      const newQty = next[itemId] || 0;
      setSrAnnouncement(
        newQty > 0
          ? `${targetItem.name} எண்ணிக்கை ${newQty}`
          : `${targetItem.name} Cart-லிருந்து நீக்கப்பட்டது`
      );
    }
  };

  const handleClearCart = () => {
    setCart({});
    saveCart({});
    setSrAnnouncement('Cart காலி செய்யப்பட்டது');
  };

  const handleSelectCategoryAndScroll = (catId: string) => {
    setSelectedCategory(catId);
    const menuEl = document.getElementById('menu');
    menuEl?.scrollIntoView({ behavior: 'smooth' });
  };

  // Settings Handlers
  const persistStore = (nextStore: StoreState) => {
    setStore(nextStore);
    saveStoreState(nextStore);
  };

  const handleUpdatePrice = (key: string, price: number) => {
    const nextStore: StoreState = {
      ...store,
      items: {
        ...store.items,
        [key]: { ...store.items[key], price },
      },
    };
    persistStore(nextStore);
  };

  const handleUpdateSold = (key: string, sold: boolean) => {
    const nextStore: StoreState = {
      ...store,
      items: {
        ...store.items,
        [key]: { ...store.items[key], sold },
      },
    };
    persistStore(nextStore);
  };

  const handleUpdateCfg = (
    key: keyof ShopConfig,
    val: string | number | null
  ) => {
    const nextStore: StoreState = {
      ...store,
      cfg: {
        ...store.cfg,
        [key]: val,
      },
    };
    persistStore(nextStore);
  };

  const handleUpdatePhotos = (photos: Record<string, string>) => {
    const nextStore: StoreState = {
      ...store,
      photos,
    };
    persistStore(nextStore);
  };

  const handleResetAll = () => {
    const empty: StoreState = { photos: {}, cfg: {}, items: {} };
    setStore(empty);
    saveStoreState(null);
  };

  if (isSettingsView) {
    return (
      <SettingsView
        items={items}
        cfg={cfg}
        store={store}
        onUpdatePrice={handleUpdatePrice}
        onUpdateSold={handleUpdateSold}
        onUpdateCfg={handleUpdateCfg}
        onUpdatePhotos={handleUpdatePhotos}
        onResetAll={handleResetAll}
        onBackToSite={() => {
          window.location.hash = '#top';
          setIsSettingsView(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF6EA] text-[#1E241F]">
      {/* Skip to Main Content Link for Keyboard Accessibility */}
      <a
        href="#menu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[#15362B] focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-[#E3A62B]"
      >
        மெனுவிற்குச் செல்க (Skip to Menu)
      </a>

      {/* Screen Reader Live Region */}
      <div className="sr-only" role="status" aria-live="polite">
        {srAnnouncement}
      </div>

      {/* Closed Banner if outside operating hours */}
      {!isShopOpen && (
        <div
          role="status"
          className="bg-[#C4451C] px-4 py-1.5 text-center text-xs font-semibold text-white"
        >
          இப்போது கடை மூடப்பட்டுள்ளது · திறக்கும் நேரம்: {cfg.openHour}:00 –{' '}
          {cfg.closeHour}:00
        </div>
      )}

      {/* Top Bar following 3-Zone Contract */}
      <Header
        itemCount={totals.itemCount}
        subtotal={totals.subtotal}
        activeSection={activeSection}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Storefront Content */}
      <main id="top">
        <HeroSection
          totalDishes={items.length}
          minPrice={minPrice}
          categoryCount={CATEGORIES.length}
          heroPhoto={store.photos['hero']}
          isOpen={isShopOpen}
          openHour={cfg.openHour}
          closeHour={cfg.closeHour}
        />

        <MenuSection
          items={items}
          filteredItems={filteredItems}
          featuredItems={featuredItems}
          cart={cart}
          photos={store.photos}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          selectedDiet={selectedDiet}
          onSelectCategory={setSelectedCategory}
          onSearchChange={setSearchQuery}
          onSelectDiet={setSelectedDiet}
          onUpdateQty={handleUpdateQty}
        />

        <StoryAndHowSection
          cfg={cfg}
          kitchenPhoto={store.photos['kitchen']}
          onSelectCategoryAndScroll={handleSelectCategoryAndScroll}
          onOpenSettings={() => {
            window.location.hash = '#settings';
            setIsSettingsView(true);
          }}
        />
      </main>

      {/* Sticky Bottom Cart Bar (appears when items in cart and modal is closed) */}
      {totals.itemCount > 0 && !isCartOpen && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#E3A62B]/40 bg-[#15362B] py-2.5 text-white shadow-xl">
          <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
            <div>
              <strong className="font-mono-num tabular-nums block text-sm font-bold text-white sm:text-base">
                {totals.itemCount} {totals.itemCount === 1 ? 'உணவு' : 'உணவுகள்'}
              </strong>
              <span className="font-mono-num tabular-nums text-xs text-[#E3A62B]">
                மொத்தம்: ₹{totals.subtotal}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-[#E3A62B] px-5 py-2 text-sm font-bold text-[#15362B] transition-transform hover:bg-[#f2b705] active:scale-[0.98]"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              <span>Cart பார்த்து ஆர்டர் செய் →</span>
            </button>
          </div>
        </div>
      )}

      {/* Slide-over Cart & Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        totals={totals}
        cfg={cfg}
        isShopOpen={isShopOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateQty={handleUpdateQty}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
