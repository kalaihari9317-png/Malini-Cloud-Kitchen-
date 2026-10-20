import React from 'react';
import { MapPin, Phone, MessageCircle, Settings } from 'lucide-react';
import { CATEGORIES, type ShopConfig } from '../data/menuData.ts';
import { DishVisual } from './DishVisual.tsx';

interface StoryAndHowSectionProps {
  cfg: ShopConfig;
  kitchenPhoto?: string;
  onSelectCategoryAndScroll: (catId: string) => void;
  onOpenSettings: () => void;
}

export const StoryAndHowSection: React.FC<StoryAndHowSectionProps> = ({
  cfg,
  kitchenPhoto,
  onSelectCategoryAndScroll,
  onOpenSettings,
}) => {
  const infoLines: string[] = [];
  if (cfg.openHour != null && cfg.closeHour != null) {
    infoLines.push(`நேரம்: ${cfg.openHour}:00 – ${cfg.closeHour}:00`);
  } else {
    infoLines.push('நேரம்: காலை 7:00 – இரவு 10:00 (தினமும்)');
  }
  if (cfg.areas) {
    infoLines.push(`Delivery பகுதிகள்: ${cfg.areas}`);
  }
  infoLines.push(
    cfg.deliveryFee > 0
      ? `Delivery கட்டணம்: ₹${cfg.deliveryFee}`
      : 'Delivery விவரங்களுக்கு போன் / WhatsApp செய்யவும்.'
  );
  if (cfg.minOrder > 0) {
    infoLines.push(`குறைந்தபட்ச ஆர்டர்: ₹${cfg.minOrder}`);
  }
  if (cfg.upi) {
    infoLines.push(`UPI ID: ${cfg.upi}`);
  }

  return (
    <>
      {/* Why Malini / Home Kitchen Craftsmanship Section */}
      <section className="bg-[#F3EBD8] py-14 sm:py-20 border-t border-b border-[#E2D8C0]">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
            <div className="lg:col-span-6">
              <div className="overflow-hidden rounded-3xl border border-[#E2D8C0] bg-[#EAD9B3] aspect-[5/4]">
                <DishVisual
                  imgKey="kitchen"
                  alt="மாலினி கிளவுடு கிச்சன் வீட்டுச் சமையலறை"
                  customSrc={kitchenPhoto}
                  variant="kitchen"
                  className="h-full w-full"
                />
              </div>
            </div>

            <div className="lg:col-span-6">
              <p className="text-sm font-semibold text-[#C4451C]">ஏன் மாலினி?</p>
              <h2 className="font-serif-tamil text-balance mt-1 text-2xl font-bold leading-snug text-[#15362B] sm:text-4xl">
                வீட்டுச் சுவை, சுத்தமான சமையல், எளிய ஆர்டர்.
              </h2>

              <div className="mt-8 space-y-6">
                <div className="flex gap-4">
                  <span className="font-serif-tamil flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#15362B] text-base font-bold text-[#E3A62B]">
                    01
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-[#15362B]">
                      உண்மையான வீட்டுச் சுவை
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#4A5246] sm:text-[15px]">
                      டிபன் முதல் மதிய வாழை இலை சாப்பாடு வரை, செயற்கை நிறமூட்டிகள்
                      இன்றி வீட்டில் அரைத்த மசாலாவில் சமைக்கப்படுகிறது.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="font-serif-tamil flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#15362B] text-base font-bold text-[#E3A62B]">
                    02
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-[#15362B]">
                      ஒரே தட்டலில் WhatsApp ஆர்டர்
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#4A5246] sm:text-[15px]">
                      மெனுவில் வேண்டிய உணவைத் தேர்வு செய்து, பெயர் மற்றும் முகவரி
                      கொடுத்தால் உங்கள் ஆர்டர் நேரடியாக WhatsApp செய்தியாகத் தயாராகும்.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="font-serif-tamil flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#15362B] text-base font-bold text-[#E3A62B]">
                    03
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-[#15362B]">
                      நியாயமான, தெளிவான விலை
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#4A5246] sm:text-[15px]">
                      இட்லி (2) ₹20, வெரைட்டி ரைஸ் ₹60, வெஜ் மீல்ஸ் ₹120 –
                      மறைமுகக் கட்டணங்கள் இன்றி அனைத்து விலைகளும் மெனுவில் தெளிவாக
                      உள்ளன.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Order Section */}
      <section id="how" aria-labelledby="how-heading" className="py-14 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="mb-10">
            <p className="text-sm font-semibold text-[#C4451C]">ஆர்டர் முறை</p>
            <h2
              id="how-heading"
              className="font-serif-tamil mt-1 text-2xl font-bold text-[#15362B] sm:text-4xl"
            >
              4 எளிய படிகளில் ஆர்டர் செய்யுங்கள்
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: '1',
                title: 'மெனுவில் தேர்வு',
                desc: 'பிரிவுகளில் உங்களுக்குப் பிடித்த உணவைத் தேர்ந்தெடுத்து “+ சேர்” பொத்தானை அழுத்தவும்.',
              },
              {
                step: '2',
                title: 'Cart சரிபார்க்க',
                desc: 'அளவு மற்றும் மொத்த தொகையைப் பார்த்து உங்கள் பெயர், போன் எண், முகவரி கொடுக்கவும்.',
              },
              {
                step: '3',
                title: 'WhatsApp-ல் அனுப்ப',
                desc: 'உங்கள் ஆர்டர் விவரம் தானாகவே WhatsApp செய்தியாகத் திறக்கும்; அதை அனுப்பவும்.',
              },
              {
                step: '4',
                title: 'உறுதி & Delivery',
                desc: 'எங்கள் பதில் WhatsApp-ல் வந்த பின்பே ஆர்டர் உறுதியாகும். சூடான உணவு உங்கள் இல்லம் தேடி வரும்.',
              },
            ].map((s) => (
              <div
                key={s.step}
                className="rounded-2xl border border-[#E2D8C0] bg-white p-6"
              >
                <span className="font-serif-tamil mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#15362B] text-lg font-bold text-[#E3A62B]">
                  {s.step}
                </span>
                <h3 className="text-lg font-bold text-[#15362B]">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4A5246]">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Sunday Special Banner */}
          <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#E3A62B] bg-[#FFF3CC] p-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#9A5B13]">
                ஞாயிறு ஸ்பெஷல் · Sunday Special
              </p>
              <p className="mt-1 text-base font-semibold text-[#15362B]">
                ஞாயிற்றுக்கிழமைகளில் சிறப்பு மீன் சாப்பாடு அல்லது நீங்கள் விரும்பிக்
                கேட்பவை சமைத்துத் தரப்படும்.
              </p>
              <p className="mt-0.5 text-sm text-[#4A5246]">
                விருப்பம் இருந்தால் முன்னதாகவே போன் செய்து (96007 30095) தெரிவிக்கவும்.
              </p>
            </div>
            <a
              href="tel:+919600730095"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#15362B] px-5 py-2.5 text-sm font-semibold text-[#FBF6EA] hover:bg-[#1F4D3A] whitespace-nowrap shrink-0"
            >
              முன்பதிவுக்கு அழைக்க
            </a>
          </div>
        </div>
      </section>

      {/* Contact & Location Section */}
      <section
        id="contact"
        aria-labelledby="contact-heading"
        className="bg-[#F3EBD8] py-14 sm:py-20 border-t border-[#E2D8C0]"
      >
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-stretch">
            <div className="lg:col-span-6">
              <p className="text-sm font-semibold text-[#C4451C]">தொடர்புக்கு</p>
              <h2
                id="contact-heading"
                className="font-serif-tamil mt-1 text-2xl font-bold text-[#15362B] sm:text-4xl"
              >
                எங்களை அழைக்க, ஆர்டர் செய்ய
              </h2>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-[#E2D8C0] bg-white p-5">
                  <strong className="block text-sm font-bold text-[#15362B]">
                    முகவரி (Address)
                  </strong>
                  <p className="mt-1 text-sm text-[#4A5246] sm:text-base">
                    Kulumani Main Road, Arulnagar, Santhosh Garden, Woraiyur,
                    Trichy – 620003
                  </p>
                </div>

                <div className="rounded-2xl border border-[#E2D8C0] bg-white p-5">
                  <strong className="block text-sm font-bold text-[#15362B]">
                    ஆர்டர் / தொடர்பு எண்கள்
                  </strong>
                  <p className="font-mono-num tabular-nums mt-1 text-base font-semibold text-[#1E241F]">
                    <a href="tel:+918428509309" className="hover:underline">
                      84285 09309
                    </a>{' '}
                    ·{' '}
                    <a href="tel:+919600730095" className="hover:underline">
                      96007 30095
                    </a>
                  </p>
                </div>

                <div className="rounded-2xl border border-[#E2D8C0] bg-white p-5">
                  <strong className="block text-sm font-bold text-[#15362B]">
                    Delivery &amp; நேரம்
                  </strong>
                  <div className="mt-1 space-y-1 text-sm text-[#4A5246]">
                    {infoLines.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(
                    'வணக்கம் Malini Cloud Kitchen, உணவு ஆர்டர் செய்ய விரும்புகிறேன்.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-[#1E8A39] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#176e2d] whitespace-nowrap shrink-0"
                >
                  <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>WhatsApp-ல் ஆர்டர்</span>
                </a>
                <a
                  href="tel:+919600730095"
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full border-2 border-[#15362B] px-6 py-2.5 text-sm font-semibold text-[#15362B] hover:bg-[#15362B] hover:text-white whitespace-nowrap shrink-0"
                >
                  <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>அழைக்க: 96007 30095</span>
                </a>
              </div>
            </div>

            {/* Map & Location Card */}
            <div className="flex flex-col justify-center rounded-3xl border border-[#E2D8C0] bg-[#DDE5D3] p-8 text-center lg:col-span-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-[#C4451C] text-white">
                <MapPin className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="font-serif-tamil mt-4 text-2xl font-bold text-[#15362B]">
                உறையூர், திருச்சி – 620003
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[#4A5246] sm:text-base">
                Kulumani Main Road, Arulnagar, Santhosh Garden, Woraiyur,
                Tiruchirappalli
              </p>
              <div className="mt-6">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Kulumani+Main+Road+Arulnagar+Santhosh+Garden+Woraiyur+Trichy+620003"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#C4451C] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#a93a17] whitespace-nowrap shrink-0"
                >
                  Google Map-ல் பார்க்க →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#15362B] pt-14 pb-28 text-[#D5E0D9]">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <strong className="font-serif-tamil block text-2xl font-bold text-[#FBF6EA]">
                மாலினி கிளவுடு கிச்சன்
              </strong>
              <p className="mt-1 text-xs font-semibold tracking-wider text-[#E3A62B]">
                MALINI CLOUD KITCHEN
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[#D5E0D9]">
                சுவையான வீட்டுச் சாப்பாடு – டிபன், மதிய உணவு, வெரைட்டி ரைஸ்,
                ஃபாஸ்ட் ஃபுட். உறையூர், திருச்சி.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#E3A62B]">
                மெனு பிரிவுகள்
              </h4>
              <ul className="mt-3 space-y-2 text-sm">
                {CATEGORIES.map((cat) => (
                  <li key={cat.id}>
                    <button
                      type="button"
                      onClick={() => onSelectCategoryAndScroll(cat.id)}
                      className="text-left text-[#D5E0D9] hover:text-white hover:underline"
                    >
                      {cat.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#E3A62B]">
                தொடர்பு எண்கள்
              </h4>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <a href="tel:+918428509309" className="hover:text-white">
                    84285 09309
                  </a>
                </li>
                <li>
                  <a href="tel:+919600730095" className="hover:text-white">
                    96007 30095
                  </a>
                </li>
                <li>WhatsApp ஆர்டர் வசதி</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#E3A62B]">
                முகவரி
              </h4>
              <p className="mt-3 text-sm leading-relaxed">
                Kulumani Main Road, Arulnagar,
                <br />
                Santhosh Garden, Woraiyur,
                <br />
                Trichy – 620003
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-6 text-xs text-[#9AB2A6]">
            <div>
              © Malini Cloud Kitchen · Kulumani Main Road, Woraiyur, Trichy –
              620003 {cfg.fssai ? `· FSSAI: ${cfg.fssai}` : ''}
            </div>
            <button
              type="button"
              onClick={onOpenSettings}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-1.5 text-xs font-medium text-[#D5E0D9] hover:bg-white/10"
            >
              <Settings className="h-3.5 w-3.5 text-[#E3A62B]" aria-hidden="true" />
              <span>கடை அமைப்புகள் (Settings)</span>
            </button>
          </div>
        </div>
      </footer>
    </>
  );
};
