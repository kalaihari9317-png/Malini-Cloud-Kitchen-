import React, { useState } from 'react';

interface DishVisualProps {
  imgKey: string;
  alt: string;
  customSrc?: string;
  className?: string;
  variant?: 'hero' | 'kitchen' | 'card' | 'thumb';
}

export const DishVisual: React.FC<DishVisualProps> = ({
  imgKey,
  alt,
  customSrc,
  className = '',
  variant = 'card',
}) => {
  const [imgError, setImgError] = useState(false);

  if (customSrc && !imgError) {
    return (
      <div className={`relative overflow-hidden bg-[#EAD9B3] ${className}`}>
        <img
          src={customSrc}
          alt={alt}
          referrerPolicy="no-referrer"
          loading={variant === 'hero' ? 'eager' : 'lazy'}
          onError={() => setImgError(true)}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden select-none ${className}`}
      role="img"
      aria-label={alt}
    >
      {renderCulinaryIllustration(imgKey, variant)}
    </div>
  );
};

function renderCulinaryIllustration(imgKey: string, variant: string) {
  // 1. Hero Banana Leaf Feast
  if (imgKey === 'hero') {
    return (
      <svg
        viewBox="0 0 640 520"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full object-cover"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="heroBg" cx="50%" cy="42%" r="68%">
            <stop offset="0%" stopColor="#265A45" />
            <stop offset="65%" stopColor="#15362B" />
            <stop offset="100%" stopColor="#0E261E" />
          </radialGradient>
          <linearGradient id="bananaLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#468942" />
            <stop offset="50%" stopColor="#347031" />
            <stop offset="100%" stopColor="#245323" />
          </linearGradient>
          <radialGradient id="brassBowl" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#F8D26A" />
            <stop offset="65%" stopColor="#D69524" />
            <stop offset="100%" stopColor="#99640E" />
          </radialGradient>
          <radialGradient id="riceMound" cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="80%" stopColor="#F5EFE0" />
            <stop offset="100%" stopColor="#E2D6BE" />
          </radialGradient>
        </defs>

        {/* Warm dark teakwood & brass background */}
        <rect width="640" height="520" fill="url(#heroBg)" />
        <g transform="translate(0, -34)">
          <circle cx="320" cy="260" r="235" fill="#1F4D3A" opacity="0.45" />
          <circle
            cx="320"
            cy="260"
            r="215"
            fill="none"
            stroke="#E3A62B"
            strokeWidth="1.5"
            strokeDasharray="6 6"
            opacity="0.35"
          />

          {/* Traditional Brass Thali Rim */}
          <ellipse cx="320" cy="272" rx="240" ry="178" fill="#B57C1E" opacity="0.35" />
          <ellipse
            cx="320"
            cy="266"
            rx="234"
            ry="172"
            fill="#224938"
            stroke="#E3A62B"
            strokeWidth="3"
          />

          {/* Fresh Green Banana Leaf (Vazhai Ilai) */}
          <path
            d="M 102 266 C 102 154, 212 110, 330 110 C 455 110, 538 170, 538 266 C 538 362, 455 418, 326 418 C 202 418, 102 372, 102 266 Z"
            fill="url(#bananaLeaf)"
            stroke="#5AA354"
            strokeWidth="2"
          />
          {/* Banana Leaf Center Vein & Ribbing */}
          <path
            d="M 110 266 Q 320 258 530 266"
            stroke="#6BB662"
            strokeWidth="3"
            fill="none"
            opacity="0.7"
          />
          <g stroke="#599E52" strokeWidth="1.2" opacity="0.45">
            <line x1="160" y1="265" x2="140" y2="165" />
            <line x1="210" y1="264" x2="190" y2="135" />
            <line x1="265" y1="263" x2="250" y2="118" />
            <line x1="320" y1="262" x2="310" y2="115" />
            <line x1="375" y1="263" x2="370" y2="118" />
            <line x1="430" y1="264" x2="430" y2="135" />
            <line x1="480" y1="265" x2="485" y2="168" />
            <line x1="160" y1="267" x2="145" y2="365" />
            <line x1="215" y1="266" x2="200" y2="395" />
            <line x1="275" y1="265" x2="265" y2="408" />
            <line x1="335" y1="265" x2="330" y2="410" />
            <line x1="395" y1="265" x2="395" y2="400" />
            <line x1="455" y1="266" x2="460" y2="375" />
          </g>

          {/* Bowl 1: Sambar */}
          <g transform="translate(185, 175)">
            <circle r="35" fill="url(#brassBowl)" />
            <circle r="30" fill="#D95B26" />
            <circle cx="-8" cy="-4" r="6" fill="#5D8C3B" />
            <circle cx="9" cy="6" r="5" fill="#F2B705" />
            <path d="M-12 8 Q0 -6 14 4" stroke="#305A20" strokeWidth="2.5" fill="none" />
          </g>

          {/* Bowl 2: Kara / Chicken Kulambu */}
          <g transform="translate(272, 155)">
            <circle r="37" fill="url(#brassBowl)" />
            <circle r="32" fill="#A92F14" />
            <circle cx="-6" cy="-5" r="8" fill="#7D1F0B" />
            <circle cx="8" cy="7" r="7" fill="#C4451C" />
            <circle cx="4" cy="-8" r="3" fill="#468942" />
          </g>

          {/* Bowl 3: Pepper Rasam */}
          <g transform="translate(362, 156)">
            <circle r="34" fill="url(#brassBowl)" />
            <circle r="29" fill="#782812" />
            <circle cx="-7" cy="4" r="2.5" fill="#1E241F" />
            <circle cx="6" cy="-6" r="2.5" fill="#5AA354" />
            <circle cx="9" cy="6" r="2" fill="#E3A62B" />
          </g>

          {/* Bowl 4: Kootu / Thalicha Thayir */}
          <g transform="translate(445, 180)">
            <circle r="33" fill="url(#brassBowl)" />
            <circle r="28" fill="#FBF6EA" />
            <circle cx="-5" cy="-4" r="2" fill="#1E241F" />
            <circle cx="6" cy="4" r="2" fill="#1E241F" />
            <path d="M-8 6 Q2 0 10 -4" stroke="#3D7A35" strokeWidth="2.5" fill="none" />
          </g>

          {/* Steaming White Ponni Rice Mound */}
          <ellipse cx="290" cy="320" rx="95" ry="64" fill="url(#riceMound)" />
          <ellipse cx="285" cy="314" rx="80" ry="50" fill="#FFFFFF" />
          <ellipse cx="286" cy="306" rx="30" ry="17" fill="#F2B705" opacity="0.75" />
          <circle cx="278" cy="303" r="3" fill="#468942" />
          <circle cx="295" cy="309" r="2.5" fill="#C4451C" />

          {/* Crispy Golden Roast Dosa Cone & Fluffy Idlis */}
          <path
            d="M 382 350 L 492 252 L 512 334 Z"
            fill="#DDA84B"
            stroke="#B5751D"
            strokeWidth="2.5"
          />
          <path d="M 398 340 L 485 265" stroke="#BC7D22" strokeWidth="1.5" opacity="0.6" />
          <ellipse cx="425" cy="358" rx="33" ry="22" fill="#FFFDF8" stroke="#E6DEC8" strokeWidth="1.5" />
          <ellipse cx="468" cy="344" rx="31" ry="21" fill="#FFFDF8" stroke="#E6DEC8" strokeWidth="1.5" />
          <circle cx="425" cy="354" r="8" fill="#C4451C" opacity="0.65" />
          <circle cx="468" cy="340" r="7" fill="#C4451C" opacity="0.65" />

          {/* Crispy Appalam & Pickle */}
          <circle cx="156" cy="296" r="30" fill="#F7E4A3" stroke="#E0BE63" strokeWidth="2" />
          <circle cx="145" cy="285" r="26" fill="#FBF0C4" stroke="#E0BE63" strokeWidth="1.5" />
          <circle cx="165" cy="354" r="15" fill="#B82914" />
          <circle cx="162" cy="351" r="5" fill="#E3A62B" opacity="0.6" />
        </g>
      </svg>
    );
  }

  // 2. Kitchen / Why Malini Craftsmanship Visual
  if (imgKey === 'kitchen') {
    return (
      <svg
        viewBox="0 0 600 480"
        className="h-full w-full object-cover"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="kitBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5E6C8" />
            <stop offset="100%" stopColor="#E4CFA3" />
          </linearGradient>
        </defs>
        <rect width="600" height="480" fill="url(#kitBg)" />
        {/* Decorative Kolam Geometry */}
        <circle
          cx="300"
          cy="220"
          r="175"
          fill="#FBF6EA"
          stroke="#E3A62B"
          strokeWidth="2"
          strokeDasharray="8 6"
        />
        {/* Wooden Shelf with Spice Jars */}
        <rect x="110" y="96" width="380" height="10" rx="5" fill="#8C5828" />
        {[145, 215, 285, 355, 425].map((x, idx) => (
          <g key={x} transform={`translate(${x}, 48)`}>
            <rect x="0" y="8" width="34" height="40" rx="6" fill="#FFFDF8" stroke="#C7B698" strokeWidth="2" />
            <rect x="4" y="0" width="26" height="9" rx="3" fill="#15362B" />
            <rect
              x="4"
              y="22"
              width="26"
              height="22"
              rx="3"
              fill={['#C4451C', '#E3A62B', '#3E6B36', '#7A3E18', '#D97224'][idx]}
            />
          </g>
        ))}

        {/* Traditional Brass Uruli / Cooking Vessel on Stove */}
        <rect x="140" y="348" width="320" height="22" rx="8" fill="#15362B" />
        {/* Warm Cooking Flame */}
        <path d="M 240 348 Q 300 315 360 348" fill="#E3A62B" opacity="0.85" />
        <path d="M 260 348 Q 300 324 340 348" fill="#C4451C" />

        {/* Brass Cooking Pot */}
        <path
          d="M 175 235 L 425 235 C 445 305, 395 342, 300 342 C 205 342, 155 305, 175 235 Z"
          fill="#D69524"
          stroke="#9B6611"
          strokeWidth="3"
        />
        <ellipse cx="300" cy="235" rx="125" ry="24" fill="#8E2B12" stroke="#F0B949" strokeWidth="4" />
        {/* Simmering Sambar & Curry Leaves */}
        <ellipse cx="300" cy="235" rx="112" ry="18" fill="#C4451C" />
        <circle cx="260" cy="234" r="9" fill="#E3A62B" />
        <circle cx="330" cy="237" r="8" fill="#468942" />
        <circle cx="295" cy="231" r="6" fill="#FBF6EA" opacity="0.8" />

        {/* Rising Aromatic Steam */}
        <path
          d="M 265 202 Q 252 175 270 150"
          stroke="#15362B"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.35"
        />
        <path
          d="M 300 196 Q 316 168 298 140"
          stroke="#15362B"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.35"
        />
        <path
          d="M 335 202 Q 322 175 340 150"
          stroke="#15362B"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.35"
        />

        {/* Caption Banner inside Kitchen Visual */}
        <rect x="130" y="392" width="340" height="44" rx="22" fill="#15362B" />
        <text
          x="300"
          y="420"
          textAnchor="middle"
          fill="#FBF6EA"
          fontSize="16"
          fontWeight="600"
          fontFamily="Noto Sans Tamil, sans-serif"
        >
          100% வீட்டுச் சமையல் · சுத்தமான மசாலா
        </text>
      </svg>
    );
  }

  // 3. Individual Dish Illustrations (d01 - d35)
  const num = parseInt(imgKey.replace(/\D/g, ''), 10) || 1;

  // Veg Meals (d22) & Non-Veg Meals (d23)
  if (num === 22 || num === 23) {
    const isNonVeg = num === 23;
    return (
      <svg viewBox="0 0 400 280" className="h-full w-full object-cover" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="280" fill={isNonVeg ? '#2C1812' : '#15362B'} />
        <path
          d="M 34 145 C 34 68, 115 36, 205 36 C 300 36, 366 78, 366 145 C 366 212, 298 246, 200 246 C 102 246, 34 212, 34 145 Z"
          fill="#387734"
          stroke="#59A353"
          strokeWidth="2"
        />
        <line x1="42" y1="145" x2="358" y2="145" stroke="#63B25C" strokeWidth="2" opacity="0.6" />
        {/* Katori Bowls */}
        <circle cx="115" cy="92" r="24" fill="#E3A62B" />
        <circle cx="115" cy="92" r="20" fill={isNonVeg ? '#9E240E' : '#D95B26'} />
        <circle cx="175" cy="82" r="24" fill="#E3A62B" />
        <circle cx="175" cy="82" r="20" fill="#7D2410" />
        <circle cx="235" cy="84" r="24" fill="#E3A62B" />
        <circle cx="235" cy="84" r="20" fill="#FBF6EA" />
        <circle cx="292" cy="98" r="24" fill="#E3A62B" />
        <circle cx="292" cy="98" r="20" fill={isNonVeg ? '#B82914' : '#4C8B3B'} />
        {/* Steamed Rice Mound */}
        <ellipse cx="195" cy="182" rx="74" ry="44" fill="#FFFDF9" />
        <ellipse cx="195" cy="176" rx="26" ry="13" fill={isNonVeg ? '#B82914' : '#E3A62B'} opacity="0.8" />
        {/* Appalam */}
        <circle cx="92" cy="175" r="24" fill="#F8E7A2" stroke="#DFBD5E" strokeWidth="1.5" />
        {/* Side Highlight (Chicken 65 or Poriyal) */}
        {isNonVeg ? (
          <g transform="translate(295, 178)">
            <circle cx="-10" cy="-6" r="12" fill="#B82914" />
            <circle cx="8" cy="-4" r="11" fill="#9E1F0C" />
            <circle cx="0" cy="10" r="12" fill="#C4451C" />
          </g>
        ) : (
          <circle cx="295" cy="178" r="20" fill="#5D9A44" />
        )}
      </svg>
    );
  }

  // Idli / Idiyappam / Mini Podi Idli (d01, d03, d11)
  if (num === 1 || num === 3 || num === 11) {
    const isPodi = num === 11;
    return (
      <svg viewBox="0 0 400 280" className="h-full w-full object-cover" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="280" fill="#F3E5C8" />
        <ellipse cx="200" cy="150" rx="145" ry="96" fill="#295E49" />
        <ellipse cx="200" cy="146" rx="132" ry="86" fill="#3B7D38" />
        {isPodi ? (
          <g>
            {[
              [145, 130],
              [180, 122],
              [215, 128],
              [248, 140],
              [155, 162],
              [192, 158],
              [228, 165],
              [175, 186],
              [212, 188],
            ].map(([cx, cy], i) => (
              <ellipse
                key={i}
                cx={cx}
                cy={cy}
                rx="18"
                ry="13"
                fill="#E37A38"
                stroke="#C4451C"
                strokeWidth="1.5"
              />
            ))}
          </g>
        ) : (
          <g>
            <ellipse cx="160" cy="155" rx="46" ry="32" fill="#FFFFFF" stroke="#E6DEC8" strokeWidth="2" />
            <ellipse cx="236" cy="148" rx="46" ry="32" fill="#FFFFFF" stroke="#E6DEC8" strokeWidth="2" />
            {num === 3 && (
              <g stroke="#E5D9C3" strokeWidth="1.2" fill="none">
                <circle cx="160" cy="155" r="28" />
                <circle cx="160" cy="155" r="18" />
                <circle cx="236" cy="148" r="28" />
                <circle cx="236" cy="148" r="18" />
              </g>
            )}
          </g>
        )}
        {/* Chutney & Sambar bowls */}
        <circle cx="155" cy="90" r="22" fill="#E3A62B" />
        <circle cx="155" cy="90" r="18" fill="#D95B26" />
        <circle cx="215" cy="86" r="20" fill="#E3A62B" />
        <circle cx="215" cy="86" r="16" fill="#FBF6EA" />
        <circle cx="268" cy="96" r="19" fill="#E3A62B" />
        <circle cx="268" cy="96" r="15" fill="#C4451C" />
      </svg>
    );
  }

  // Dosa / Uttapam / Poori / Chapati / Pongal (d02, d04, d05, d06, d07, d08, d09, d10)
  if (num >= 2 && num <= 10) {
    const isPongal = num === 5;
    return (
      <svg viewBox="0 0 400 280" className="h-full w-full object-cover" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="280" fill="#EFE0BE" />
        <ellipse cx="200" cy="148" rx="150" ry="98" fill="#15362B" />
        <ellipse cx="200" cy="144" rx="136" ry="86" fill="#357331" />
        {isPongal ? (
          <g>
            <ellipse cx="195" cy="154" rx="68" ry="46" fill="#F9E5A2" />
            <ellipse cx="195" cy="146" rx="28" ry="16" fill="#E3A62B" />
            <circle cx="175" cy="142" r="3.5" fill="#1E241F" />
            <circle cx="212" cy="155" r="3.5" fill="#1E241F" />
            <path d="M182 162 Q195 152 208 160" stroke="#387734" strokeWidth="3" fill="none" />
          </g>
        ) : (
          <g>
            <ellipse
              cx="176"
              cy="156"
              rx="66"
              ry="42"
              fill="#DDA242"
              stroke="#B27318"
              strokeWidth="2"
            />
            <ellipse
              cx="232"
              cy="146"
              rx="62"
              ry="38"
              fill="#E7B358"
              stroke="#B27318"
              strokeWidth="2"
            />
            {(num === 6 || num === 7 || num === 8 || num === 9) && (
              <g>
                <circle cx="225" cy="142" r="18" fill={num === 9 ? '#F7D154' : '#C4451C'} opacity="0.55" />
                <circle cx="215" cy="138" r="3" fill="#387734" />
                <circle cx="238" cy="148" r="3" fill="#387734" />
              </g>
            )}
          </g>
        )}
        <circle cx="145" cy="86" r="20" fill="#E3A62B" />
        <circle cx="145" cy="86" r="16" fill="#FBF6EA" />
        <circle cx="202" cy="82" r="20" fill="#E3A62B" />
        <circle cx="202" cy="82" r="16" fill="#D95B26" />
      </svg>
    );
  }

  // Kothu Chapati / Kothu Parotta (d12, d13, d14)
  if (num >= 12 && num <= 14) {
    return (
      <svg viewBox="0 0 400 280" className="h-full w-full object-cover" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="280" fill="#2A1F18" />
        <ellipse cx="200" cy="148" rx="142" ry="94" fill="#3D7736" stroke="#E3A62B" strokeWidth="2.5" />
        <ellipse cx="192" cy="150" rx="88" ry="58" fill="#D57A34" />
        <ellipse cx="192" cy="146" rx="74" ry="46" fill="#C4451C" opacity="0.65" />
        {[
          [155, 138],
          [185, 128],
          [215, 138],
          [168, 160],
          [202, 162],
          [228, 152],
        ].map(([x, y], i) => (
          <g key={i}>
            <rect
              x={x - 10}
              y={y - 6}
              width="20"
              height="12"
              rx="4"
              fill={i % 2 === 0 ? '#F2B705' : '#FBF6EA'}
              transform={`rotate(${i * 25} ${x} ${y})`}
            />
            <circle cx={x + 6} cy={y - 4} r="3" fill="#468942" />
          </g>
        ))}
        {/* Salna Bowl */}
        <circle cx="292" cy="112" r="26" fill="#E3A62B" />
        <circle cx="292" cy="112" r="22" fill="#A92F14" />
      </svg>
    );
  }

  // Variety Rice (d15 - d21)
  if (num >= 15 && num <= 21) {
    const riceColors: Record<number, { main: string; accent: string }> = {
      15: { main: '#DE7A2E', accent: '#468942' }, // Sambar
      16: { main: '#FFFDF8', accent: '#3D7A35' }, // Curd
      17: { main: '#C45328', accent: '#1E241F' }, // Rasam
      18: { main: '#9C421A', accent: '#E3A62B' }, // Puliyodharai
      19: { main: '#F5CB39', accent: '#468942' }, // Lemon
      20: { main: '#D44827', accent: '#468942' }, // Tomato
      21: { main: '#3D7A38', accent: '#F2B705' }, // Malli
    };
    const col = riceColors[num] || { main: '#E3A62B', accent: '#15362B' };
    return (
      <svg viewBox="0 0 400 280" className="h-full w-full object-cover" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="280" fill="#F2E4C6" />
        <circle cx="200" cy="144" r="98" fill="#15362B" />
        <circle cx="200" cy="144" r="84" fill={col.main} stroke="#E3A62B" strokeWidth="3" />
        <circle cx="178" cy="128" r="5" fill={col.accent} />
        <circle cx="218" cy="136" r="6" fill={col.accent} />
        <circle cx="195" cy="160" r="5" fill={col.accent} />
        <circle cx="204" cy="120" r="4" fill="#1E241F" />
        <circle cx="172" cy="154" r="4" fill="#1E241F" />
        {/* Appalam on the side */}
        <circle cx="295" cy="182" r="28" fill="#F8E7A2" stroke="#DFBD5E" strokeWidth="2" />
      </svg>
    );
  }

  // Egg Dishes (d24 - d26) & Egg Bonda (d30)
  if ((num >= 24 && num <= 26) || num === 30) {
    return (
      <svg viewBox="0 0 400 280" className="h-full w-full object-cover" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="280" fill="#F4E6C8" />
        <ellipse cx="200" cy="146" rx="135" ry="88" fill="#1F4D3A" />
        {num === 26 ? (
          <g>
            <ellipse cx="168" cy="146" rx="38" ry="28" fill="#FFFFFF" />
            <circle cx="168" cy="146" r="15" fill="#F2B705" />
            <ellipse cx="236" cy="146" rx="38" ry="28" fill="#FFFFFF" />
            <circle cx="236" cy="146" r="15" fill="#F2B705" />
          </g>
        ) : (
          <g>
            <ellipse cx="200" cy="146" rx="86" ry="54" fill="#F4C13B" stroke="#C98A1B" strokeWidth="2.5" />
            <circle cx="180" cy="138" r="4" fill="#387734" />
            <circle cx="216" cy="152" r="4" fill="#C4451C" />
            <circle cx="205" cy="132" r="3" fill="#1E241F" />
          </g>
        )}
      </svg>
    );
  }

  // Side Dishes & Fast Food (d27 - d35)
  const isFastFood = num >= 32;
  return (
    <svg viewBox="0 0 400 280" className="h-full w-full object-cover" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="280" fill={isFastFood ? '#1C2E24' : '#EFE0BE'} />
      <circle
        cx="200"
        cy="144"
        r="96"
        fill={isFastFood ? '#FFFDF8' : '#15362B'}
        stroke="#E3A62B"
        strokeWidth="3"
      />
      <circle
        cx="200"
        cy="144"
        r="80"
        fill={num === 29 ? '#F5EFE0' : num === 31 ? '#8F2611' : '#DF8B38'}
      />
      {num >= 34 ? (
        <g stroke="#F7D154" strokeWidth="4" fill="none" strokeLinecap="round">
          <path d="M 145 130 Q 175 110 205 135 T 255 130" />
          <path d="M 140 150 Q 175 130 205 155 T 260 148" />
          <path d="M 150 168 Q 180 150 210 172 T 250 165" />
        </g>
      ) : (
        <g>
          <circle cx="176" cy="132" r="14" fill="#C4451C" opacity="0.85" />
          <circle cx="218" cy="136" r="13" fill="#B82914" opacity="0.85" />
          <circle cx="196" cy="162" r="15" fill="#C4451C" opacity="0.85" />
          <circle cx="185" cy="144" r="4" fill="#468942" />
          <circle cx="215" cy="155" r="4" fill="#468942" />
        </g>
      )}
    </svg>
  );
}
