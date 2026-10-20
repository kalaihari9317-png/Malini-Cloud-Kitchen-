import React from 'react';
import { Phone, ArrowRight } from 'lucide-react';
import { DishVisual } from './DishVisual.tsx';

interface HeroSectionProps {
  totalDishes: number;
  minPrice: number;
  categoryCount: number;
  heroPhoto?: string;
  isOpen: boolean;
  openHour: number | null;
  closeHour: number | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  totalDishes,
  minPrice,
  categoryCount,
  heroPhoto,
  isOpen,
  openHour,
  closeHour,
}) => {
  return (
    <section className="pt-8 pb-14 sm:pt-12 sm:pb-20 border-b border-[#E2D8C0]">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        {/* 2-Column Hero Split with items-stretch */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-stretch lg:gap-12">
          {/* Left Column: Editorial Value Proposition & Actions */}
          <div className="flex flex-col justify-center lg:col-span-7">
            <div className="mb-3 flex flex-wrap items-center gap-2 text-sm font-semibold text-[#C4451C]">
              <span>உறையூர், திருச்சி</span>
              <span aria-hidden="true">·</span>
              <span>பாரம்பரிய வீட்டுச் சாப்பாடு</span>
              {!isOpen && openHour != null && closeHour != null && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#15362B]">
                    நேரம்: {openHour}:00 – {closeHour}:00
                  </span>
                </>
              )}
            </div>

            <h1 className="font-serif-tamil text-balance text-[clamp(2rem,4vw,3.35rem)] font-bold leading-[1.35] text-[#15362B]">
              சுவையான வீட்டுச் சாப்பாடு, உங்கள் வாசல் வரை.
            </h1>

            <p className="mt-4 max-w-[58ch] text-base leading-relaxed text-[#4A5246] sm:text-lg">
              டிபன், மதிய உணவு, வெரைட்டி ரைஸ், ஃபாஸ்ட் ஃபுட் – சுத்தமான வீட்டு
              மசாலாவில் சமைத்த உணவுகளை மெனுவில் தேர்வு செய்து WhatsApp-ல்
              எளிதாக ஆர்டர் செய்யுங்கள்.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <a
                href="#menu"
                className="inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-full bg-[#C4451C] px-7 py-3 text-base font-semibold text-white transition-transform duration-150 hover:bg-[#a93a17] active:scale-[0.98] whitespace-nowrap shrink-0"
              >
                <span>மெனு பார்த்து ஆர்டர் செய்ய</span>
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </a>

              <a
                href="tel:+919600730095"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border-2 border-[#15362B] bg-transparent px-6 py-3 text-base font-semibold text-[#15362B] transition-colors duration-150 hover:bg-[#15362B] hover:text-[#FBF6EA] whitespace-nowrap shrink-0"
              >
                <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>அழைக்க: 96007 30095</span>
              </a>
            </div>

            {/* Quiet unboxed regional & service metadata */}
            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-[#4A5246] sm:text-sm">
              <span>குளுமணி மெயின் ரோடு, அருள்நகர், உறையூர்</span>
              <span aria-hidden="true">·</span>
              <span>WhatsApp ஆர்டர்: 96007 30095 / 84285 09309</span>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="relative flex flex-col lg:col-span-5">
            <div className="relative h-full min-h-[290px] w-full overflow-hidden rounded-3xl border border-[#E2D8C0] bg-[#15362B] sm:min-h-[360px]">
              <DishVisual
                imgKey="hero"
                alt="மாலினி கிளவுடு கிச்சன் வாழை இலை விருந்து மற்றும் டிபன் வகைகள்"
                customSrc={heroPhoto}
                variant="hero"
                className="h-full w-full"
              />
              {/* Measured contrast scrim at bottom */}
              <div className=" inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-5 text-[#FBF6EA] absolute">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium text-[#E3A62B]">
                      மதிய உணவு &amp; டிபன்
                    </p>
                    <p className="font-serif-tamil text-lg font-bold leading-snug text-white">
                      வாழை இலை விருந்து சுவையில் வீட்டுச் சாப்பாடு
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="block text-xs text-[#E2D8C0]">மதிய மீல்ஸ்</span>
                    <strong className="font-mono-num tabular-nums text-xl font-bold text-[#E3A62B]">
                      ₹120 முதல்
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column KPI Strip below the Hero Split */}
        <div className="mt-10 grid grid-cols-2 gap-6 border-t border-[#E2D8C0] pt-8 sm:grid-cols-4">
          <div>
            <strong className="font-serif-tamil tabular-nums block text-2xl font-bold text-[#15362B] sm:text-3xl">
              {totalDishes}+
            </strong>
            <span className="mt-1 block text-xs font-medium text-[#4A5246] sm:text-sm">
              சுவையான உணவு வகைகள்
            </span>
          </div>

          <div>
            <strong className="font-serif-tamil tabular-nums block text-2xl font-bold text-[#15362B] sm:text-3xl">
              ₹{minPrice}
            </strong>
            <span className="mt-1 block text-xs font-medium text-[#4A5246] sm:text-sm">
              ஆரம்ப விலை (இட்லி / முட்டை)
            </span>
          </div>

          <div>
            <strong className="font-serif-tamil tabular-nums block text-2xl font-bold text-[#15362B] sm:text-3xl">
              {categoryCount} பிரிவுகள்
            </strong>
            <span className="mt-1 block text-xs font-medium text-[#4A5246] sm:text-sm">
              டிபன், மீல்ஸ், ரைஸ் &amp; Fast Food
            </span>
          </div>

          <div>
            <strong className="font-serif-tamil block text-2xl font-bold text-[#15362B] sm:text-3xl">
              WhatsApp
            </strong>
            <span className="mt-1 block text-xs font-medium text-[#4A5246] sm:text-sm">
              உடனடி ஆர்டர் &amp; நேரடி உறுதிப்பாடு
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
