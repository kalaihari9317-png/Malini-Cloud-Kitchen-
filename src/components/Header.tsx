import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface HeaderProps {
  itemCount: number;
  subtotal: number;
  activeSection: string;
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  itemCount,
  subtotal,
  activeSection,
  onOpenCart,
}) => {
  const navItems = [
    { id: 'top', label: 'முகப்பு', href: '#top' },
    { id: 'menu', label: 'மெனு', href: '#menu' },
    { id: 'how', label: 'ஆர்டர் முறை', href: '#how' },
    { id: 'contact', label: 'தொடர்புக்கு', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-[#E2D8C0] bg-[#FBF6EA]/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between gap-2 px-3.5 sm:h-[70px] sm:gap-8 sm:px-6">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="font-serif-tamil text-[17px] font-bold tracking-tight text-[#15362B] whitespace-nowrap shrink-0 sm:text-xl md:text-2xl"
        >
          மாலினி கிளவுடு கிச்சன்
        </a>

        {/* Zone 2: 4 concise single-line text navigation links */}
        <nav
          aria-label="முதன்மை வழிசெலுத்தல்"
          className="hidden md:flex items-center gap-8 text-[15px] font-medium text-[#4A5246]"
        >
          {navItems.map((nav) => {
            const isActive = activeSection === nav.id;
            return (
              <a
                key={nav.id}
                href={nav.href}
                aria-current={isActive ? 'page' : undefined}
                className={`py-1.5 whitespace-nowrap shrink-0 border-b-2 transition-colors duration-150 ${
                  isActive
                    ? 'border-[#C4451C] text-[#15362B] font-semibold'
                    : 'border-transparent hover:text-[#15362B] hover:border-[#15362B]/30'
                }`}
              >
                {nav.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={
              itemCount > 0
                ? `Cart பார்க்க, ${itemCount} உணவுகள், மொத்தம் ₹${subtotal}`
                : 'Cart பார்க்க (காலியாக உள்ளது)'
            }
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-[#15362B] px-3.5 py-1.5 text-xs font-semibold text-[#FBF6EA] transition-colors duration-150 hover:bg-[#1F4D3A] whitespace-nowrap shrink-0 sm:min-h-[44px] sm:gap-2.5 sm:px-5 sm:py-2 sm:text-sm"
          >
            <ShoppingBag className="h-3.5 w-3.5 text-[#E3A62B] shrink-0 sm:h-4 sm:w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Cart பார்க்க</span>
            <span className="sm:hidden">Cart</span>
            <span className="font-mono-num tabular-nums text-[#E3A62B]">
              ({itemCount}{itemCount > 0 ? ` · ₹${subtotal}` : ''})
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
