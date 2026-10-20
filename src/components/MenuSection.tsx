import React from 'react';
import { Search, X, Plus, Minus } from 'lucide-react';
import {
  CATEGORIES,
  DIET_LABELS,
  type DietType,
  type MenuItem,
} from '../data/menuData.ts';
import type { CartMap } from '../utils/orderLogic.ts';
import { DishVisual } from './DishVisual.tsx';

interface MenuSectionProps {
  items: MenuItem[];
  filteredItems: MenuItem[];
  featuredItems: MenuItem[];
  cart: CartMap;
  photos: Record<string, string>;
  selectedCategory: string;
  searchQuery: string;
  selectedDiet: 'all' | DietType;
  onSelectCategory: (catId: string) => void;
  onSearchChange: (q: string) => void;
  onSelectDiet: (diet: 'all' | DietType) => void;
  onUpdateQty: (itemId: number, delta: number) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  items,
  filteredItems,
  featuredItems,
  cart,
  photos,
  selectedCategory,
  searchQuery,
  selectedDiet,
  onSelectCategory,
  onSearchChange,
  onSelectDiet,
  onUpdateQty,
}) => {
  const getCategoryCount = (catId: string) => {
    if (catId === 'all') return items.length;
    return items.filter((i) => i.cat === catId).length;
  };

  const renderQuantityControl = (item: MenuItem) => {
    const qty = cart[item.id] || 0;
    if (item.sold) {
      return (
        <span className="text-xs font-semibold text-[#C4451C] whitespace-nowrap shrink-0">
          இன்று இல்லை · Sold Out
        </span>
      );
    }

    if (qty > 0) {
      return (
        <div
          className="inline-flex min-h-[42px] items-center rounded-full bg-[#15362B] text-white"
          role="group"
          aria-label={`${item.name} அளவு`}
        >
          <button
            type="button"
            onClick={() => onUpdateQty(item.id, -1)}
            aria-label={`${item.name} அளவு குறை`}
            className="flex h-[42px] w-[42px] items-center justify-center rounded-l-full text-lg font-bold text-white transition-colors hover:bg-[#1F4D3A]"
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
          <span
            className="font-mono-num tabular-nums min-w-[28px] text-center text-sm font-bold text-[#E3A62B]"
            aria-live="polite"
          >
            {qty}
          </span>
          <button
            type="button"
            onClick={() => onUpdateQty(item.id, 1)}
            aria-label={`${item.name} அளவு கூட்டு`}
            className="flex h-[42px] w-[42px] items-center justify-center rounded-r-full text-lg font-bold text-white transition-colors hover:bg-[#1F4D3A]"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      );
    }

    return (
      <button
        type="button"
        onClick={() => onUpdateQty(item.id, 1)}
        aria-label={`${item.name} சேர்`}
        className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-full bg-[#15362B] px-5 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#1F4D3A] active:scale-[0.98] whitespace-nowrap shrink-0"
      >
        <Plus className="h-4 w-4 text-[#E3A62B]" aria-hidden="true" />
        <span>சேர்</span>
      </button>
    );
  };

  const renderDishCard = (
    item: MenuItem,
    showCategoryMeta: boolean,
    staggerIndex: number = 0
  ) => {
    const dietMeta = DIET_LABELS[item.diet];
    const qty = cart[item.id] || 0;
    const delayMs = Math.min(staggerIndex * 20, 120);

    return (
      <article
        key={item.key}
        style={{ animationDelay: `${delayMs}ms` }}
        className={`animate-menu-fade-in group flex flex-col overflow-hidden rounded-2xl border transition-transform duration-150 ${
          item.sold
            ? 'border-[#E2D8C0] bg-white/60 opacity-65'
            : qty > 0
            ? 'border-[#15362B] bg-white'
            : 'border-[#E2D8C0] bg-white hover:-translate-y-0.5'
        }`}
      >
        {/* Dish Imagery (65% height proportion) */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EAD9B3]">
          <DishVisual
            imgKey={item.key}
            alt={`${item.name} (${item.englishName})`}
            customSrc={photos[item.key]}
            variant="card"
            className="h-full w-full"
          />
        </div>

        {/* Card Body */}
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          {/* Clean Unboxed Metadata with Typographic Separators */}
          <div className="mb-1.5 flex flex-wrap items-center gap-1.5 text-xs font-medium text-[#4A5246]">
            <span
              className={
                item.diet === 'veg'
                  ? 'font-semibold text-[#1F5E3B]'
                  : item.diet === 'egg'
                  ? 'font-semibold text-[#9A5B13]'
                  : 'font-semibold text-[#B43215]'
              }
            >
              {dietMeta.short}
            </span>
            {showCategoryMeta && (
              <>
                <span aria-hidden="true">·</span>
                <span>{item.catName}</span>
              </>
            )}
            {item.popular && !item.sold && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-[#C4451C]">அதிகம் விற்பனையானது</span>
              </>
            )}
          </div>

          <h3
            className={`text-base font-bold leading-snug text-[#15362B] sm:text-lg ${
              item.sold ? 'line-through' : ''
            }`}
          >
            {item.name}
          </h3>

          <p className="mt-0.5 text-xs font-medium text-[#4A5246]">
            {item.englishName}
          </p>

          {item.desc && (
            <p className="mt-2 text-xs leading-relaxed text-[#4A5246] sm:text-[13.5px]">
              {item.desc}
            </p>
          )}

          {/* Price & Add to Cart Row */}
          <div className="mt-auto flex items-center justify-between gap-3 pt-4">
            <div>
              <span className="sr-only">விலை: </span>
              <strong className="font-serif-tamil tabular-nums text-xl font-bold text-[#C4451C] sm:text-2xl">
                ₹{item.price}
              </strong>
            </div>
            {renderQuantityControl(item)}
          </div>
        </div>
      </article>
    );
  };

  const visibleCategories = CATEGORIES.filter(
    (c) => selectedCategory === 'all' || c.id === selectedCategory
  );

  return (
    <div>
      {/* Section 1: Featured Signature Collection */}
      {featuredItems.length > 0 && (
        <section
          id="featured"
          aria-labelledby="featured-heading"
          className="scroll-mt-20 py-12 sm:py-16 border-b border-[#E2D8C0]"
        >
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-[#C4451C] sm:text-sm">
                  இன்றைய சிறப்பு · வாடிக்கையாளர் விருப்பம்
                </p>
                <h2
                  id="featured-heading"
                  className="font-serif-tamil mt-1 text-2xl font-bold text-[#15362B] sm:text-3xl"
                >
                  சிறப்பு உணவுகள் (Signature Dishes)
                </h2>
              </div>
              <a
                href="#menu"
                className="text-sm font-semibold text-[#15362B] underline-offset-4 hover:underline whitespace-nowrap shrink-0"
              >
                முழு மெனுவையும் பார்க்க →
              </a>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredItems.map((item) => renderDishCard(item, true))}
            </div>
          </div>
        </section>
      )}

      {/* Section 2: Full Interactive Menu with Streamlined Navigation */}
      <section id="menu" aria-labelledby="menu-heading" className="scroll-mt-20 py-12 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-[#C4451C] sm:text-sm">
                முழு மெனு · 6 பிரிவுகள்
              </p>
              <h2
                id="menu-heading"
                className="font-serif-tamil mt-1 text-2xl font-bold text-[#15362B] sm:text-4xl"
              >
                நாங்கள் சமைப்பவை எல்லாம், ஒரே இடத்தில்.
              </h2>
            </div>
            <p className="text-sm text-[#4A5246]">
              தமிழ் அல்லது ஆங்கிலத்தில் தேடலாம் (உதா: தோசை / Dosa / Meals)
            </p>
          </div>

          {/* Streamlined Search + Dietary Filter + Category Tabs */}
          <div className="mb-8 rounded-2xl border border-[#E2D8C0] bg-[#F3EBD8]/80 p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Bilingual Search Input */}
              <div className="relative flex-1">
                <label htmlFor="menu-search" className="sr-only">
                  உணவைத் தேடுங்கள் (Search dishes in Tamil or English)
                </label>
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#4A5246]"
                  aria-hidden="true"
                />
                <input
                  id="menu-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="உணவைத் தேடுங்கள்… (உதா: இட்லி, தோசை, மீல்ஸ், Dosa, Chicken)"
                  autoComplete="off"
                  className="min-h-[46px] w-full rounded-xl border border-[#CFC4A9] bg-white pl-12 pr-10 py-2.5 text-base text-[#1E241F] placeholder:text-[#6B7266] focus:border-[#15362B]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    aria-label="தேடலை அழி (Clear search)"
                    className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#4A5246] hover:bg-[#F3EBD8]"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>

              {/* Dietary Segmented Filter Control */}
              <div
                role="group"
                aria-label="உணவு வகை வடிகட்டி (Dietary filter)"
                className="flex items-center gap-1 overflow-x-auto rounded-xl bg-[#E6DEC8] p-1 no-scrollbar"
              >
                {(
                  [
                    { id: 'all', label: 'அனைத்தும்' },
                    { id: 'veg', label: 'சைவம் · Veg' },
                    { id: 'egg', label: 'முட்டை · Egg' },
                    { id: 'nonveg', label: 'அசைவம் · Non-Veg' },
                  ] as const
                ).map((d) => {
                  const active = selectedDiet === d.id;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => onSelectDiet(d.id)}
                      aria-pressed={active}
                      className={`min-h-[38px] rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 sm:text-sm ${
                        active
                          ? 'bg-[#15362B] text-white'
                          : 'text-[#1E241F] hover:bg-white/60'
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Category Filter Tabs */}
            <div
              role="tablist"
              aria-label="மெனு பிரிவுகள்"
              className="mt-4 flex items-center gap-2 overflow-x-auto pt-2 no-scrollbar"
            >
              <button
                type="button"
                role="tab"
                aria-selected={selectedCategory === 'all'}
                onClick={() => onSelectCategory('all')}
                className={`min-h-[42px] rounded-xl px-4 py-2 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === 'all'
                    ? 'bg-[#15362B] text-[#FBF6EA]'
                    : 'bg-white text-[#15362B] border border-[#E2D8C0] hover:border-[#15362B]'
                }`}
              >
                எல்லாம் ({getCategoryCount('all')})
              </button>

              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const count = getCategoryCount(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => onSelectCategory(cat.id)}
                    className={`min-h-[42px] rounded-xl px-4 py-2 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                      isSelected
                        ? 'bg-[#15362B] text-[#FBF6EA]'
                        : 'bg-white text-[#15362B] border border-[#E2D8C0] hover:border-[#15362B]'
                    }`}
                  >
                    {cat.title} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Categorized Dish Grids */}
          {filteredItems.length === 0 ? (
            <div
              key={`empty-${selectedCategory}-${selectedDiet}`}
              className="animate-menu-fade-in rounded-2xl border border-[#E2D8C0] bg-white p-10 text-center"
            >
              <p className="font-serif-tamil text-xl font-bold text-[#15362B]">
                தேடிய உணவு கிடைக்கவில்லை
              </p>
              <p className="mt-2 text-sm text-[#4A5246]">
                வேறு பெயரில் தேடுங்கள் அல்லது அனைத்து உணவுகளையும் காண கீழே உள்ள
                பொத்தானை அழுத்தவும்.
              </p>
              <button
                type="button"
                onClick={() => {
                  onSelectCategory('all');
                  onSearchChange('');
                  onSelectDiet('all');
                }}
                className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#15362B] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1F4D3A]"
              >
                எல்லா உணவுகளையும் காட்டு
              </button>
            </div>
          ) : (
            <div
              key={`grid-${selectedCategory}-${selectedDiet}`}
              role="tabpanel"
              aria-live="polite"
              className="animate-menu-fade-in space-y-12"
            >
              {visibleCategories.map((cat) => {
                const catRows = filteredItems.filter((x) => x.cat === cat.id);
                if (catRows.length === 0) return null;

                return (
                  <div key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-24">
                    <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-[#E3A62B] pb-3">
                      <div className="flex flex-wrap items-baseline gap-3">
                        <h3 className="font-serif-tamil text-xl font-bold text-[#15362B] sm:text-2xl">
                          {cat.title}
                        </h3>
                        <span className="text-sm font-medium text-[#4A5246]">
                          {cat.englishTitle} · {cat.timingLabel}
                        </span>
                      </div>
                      <span className="font-mono-num tabular-nums text-xs font-semibold text-[#4A5246]">
                        {catRows.length} உணவுகள்
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {catRows.map((item, idx) =>
                        renderDishCard(item, false, idx)
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
