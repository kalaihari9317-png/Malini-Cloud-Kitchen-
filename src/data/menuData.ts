export type DietType = 'veg' | 'egg' | 'nonveg';

export interface MenuCategory {
  id: string;
  title: string;
  englishTitle: string;
  glyph: string;
  subtitle: string;
  timingLabel: string;
}

export interface MenuItem {
  id: number;
  key: string;
  cat: string;
  catName: string;
  name: string;
  englishName: string;
  price: number;
  desc: string;
  sold: boolean;
  diet: DietType;
  popular?: boolean;
  keywords: string;
}

export interface ShopConfig {
  whatsapp: string;
  deliveryFee: number;
  minOrder: number;
  openHour: number | null;
  closeHour: number | null;
  upi: string;
  fssai: string;
  areas: string;
  imgFolder: string;
  imgExt: string;
  featured: string[];
}

export const DEFAULT_CFG: ShopConfig = {
  whatsapp: '919600730095',
  deliveryFee: 0,
  minOrder: 0,
  openHour: null,
  closeHour: null,
  upi: '',
  fssai: '',
  areas: 'உறையூர், தில்லை நகர், அருள்நகர், சந்தோஷ் கார்டன், புத்தூர்',
  imgFolder: 'images/',
  imgExt: 'jpg',
  featured: [
    'வெஜ் மீல்ஸ்',
    'சிக்கன் நான்-வெஜ் மீல்ஸ்',
    'சிக்கன் ரைஸ்',
    'முட்டை கொத்து புரோட்டா',
  ],
};

export const CATEGORIES: MenuCategory[] = [
  {
    id: 'tiffin',
    title: 'டிபன் வகைகள்',
    englishTitle: 'Tiffin & Dinner',
    glyph: 'டி',
    subtitle: 'இட்லி, தோசை, பொங்கல், கொத்து புரோட்டா',
    timingLabel: 'காலை & இரவு',
  },
  {
    id: 'meals',
    title: 'மதிய உணவு',
    englishTitle: 'Full Meals',
    glyph: 'ம',
    subtitle: 'வெஜ் மீல்ஸ் & சிக்கன் நான்-வெஜ் மீல்ஸ்',
    timingLabel: 'மதியம் 12–3',
  },
  {
    id: 'rice',
    title: 'வெரைட்டி ரைஸ்',
    englishTitle: 'Variety Rice',
    glyph: 'வ',
    subtitle: 'சாம்பார், தயிர், புளியோதரை, லெமன் சாதம்',
    timingLabel: 'மதிய உணவு',
  },
  {
    id: 'fast',
    title: 'Fast Food வகைகள்',
    englishTitle: 'Fried Rice & Noodles',
    glyph: 'F',
    subtitle: 'சிக்கன் ரைஸ், எக் ரைஸ், நூடுல்ஸ்',
    timingLabel: 'மாலை & இரவு',
  },
  {
    id: 'side',
    title: 'சைடு டிஷ்',
    englishTitle: 'Sides & Snacks',
    glyph: 'சை',
    subtitle: 'பக்கோடா, போண்டா, பெப்பர் சிக்கன், உளுந்து பால்',
    timingLabel: 'எப்போதும்',
  },
  {
    id: 'egg',
    title: 'முட்டை வகைகள்',
    englishTitle: 'Egg Varieties',
    glyph: 'மு',
    subtitle: 'ஆம்லெட், முட்டை பொரியல், அவித்த முட்டை',
    timingLabel: 'எப்போதும்',
  },
];

interface RawDishTuple {
  cat: string;
  name: string;
  englishName: string;
  price: number;
  desc?: string;
  sold?: boolean;
  diet: DietType;
  popular?: boolean;
  keywords: string;
}

const RAW_DISHES: RawDishTuple[] = [
  // Tiffin (d01 - d14)
  {
    cat: 'tiffin',
    name: 'இட்லி (2)',
    englishName: 'Steamed Idli (2 Pcs)',
    price: 20,
    desc: 'பஞ்சு போன்ற சூடான இட்லி · சாம்பார் & சட்னி உடன்',
    diet: 'veg',
    popular: true,
    keywords: 'idli idly tiffin breakfast dinner இட்லி',
  },
  {
    cat: 'tiffin',
    name: 'தோசை (2)',
    englishName: 'Roast Dosa (2 Pcs)',
    price: 60,
    desc: 'தேங்காய் பால் + சீனி அல்லது சாம்பார் & சட்னி',
    diet: 'veg',
    popular: true,
    keywords: 'dosa dosai coconut milk தோசை தேங்காய் பால்',
  },
  {
    cat: 'tiffin',
    name: 'இடியாப்பம் (3)',
    englishName: 'Idiyappam String Hoppers (3 Pcs)',
    price: 50,
    desc: 'மென்மையான வீட்டு இடியாப்பம் · தேங்காய் பால் உடன்',
    diet: 'veg',
    keywords: 'idiyappam string hoppers இடியாப்பம்',
  },
  {
    cat: 'tiffin',
    name: 'பூரி (2 பீஸ்)',
    englishName: 'Poori Masala (2 Pcs)',
    price: 60,
    desc: 'உருளைக்கிழங்கு மசாலா உடன் சுடச்சுட பூரி',
    diet: 'veg',
    keywords: 'poori puri potato masala பூரி',
  },
  {
    cat: 'tiffin',
    name: 'பொங்கல்',
    englishName: 'Ghee Ven Pongal',
    price: 50,
    desc: 'நெய் மணக்கும் வெண்பொங்கல் · சாம்பார் & சட்னி',
    diet: 'veg',
    keywords: 'pongal venpongal ghee பொங்கல்',
  },
  {
    cat: 'tiffin',
    name: 'ஊத்தப்பம் (2 பீஸ்)',
    englishName: 'Uttapam (2 Pcs)',
    price: 60,
    desc: 'மெத்தென்ற வீட்டு ஊத்தப்பம் · சாம்பார் & சட்னி',
    diet: 'veg',
    keywords: 'uthappam uttapam oothappam ஊத்தப்பம்',
  },
  {
    cat: 'tiffin',
    name: 'ஆனியன் ஊத்தப்பம் (1) + நார்மல் தோசை (1)',
    englishName: 'Onion Uttapam (1) + Plain Dosa (1)',
    price: 70,
    desc: 'வெங்காய ஊத்தப்பம் மற்றும் மொறுமொறு தோசை காம்போ',
    diet: 'veg',
    keywords: 'onion uttapam dosa combo ஆனியன் ஊத்தப்பம் தோசை',
  },
  {
    cat: 'tiffin',
    name: 'ஆனியன் ஊத்தப்பம் (1) + நார்மல் ஊத்தப்பம் (1)',
    englishName: 'Onion Uttapam (1) + Plain Uttapam (1)',
    price: 70,
    desc: 'இரட்டை ஊத்தப்பம் காம்போ · சாம்பார் & சட்னி',
    diet: 'veg',
    keywords: 'onion uttapam combo ஆனியன் ஊத்தப்பம்',
  },
  {
    cat: 'tiffin',
    name: 'முட்டை தோசை (1) + நார்மல் தோசை (1)',
    englishName: 'Egg Dosa (1) + Plain Dosa (1)',
    price: 80,
    desc: 'மிளகு தூவிய முட்டை தோசை மற்றும் சாதா தோசை',
    diet: 'egg',
    keywords: 'egg dosa muttai dosai combo முட்டை தோசை',
  },
  {
    cat: 'tiffin',
    name: 'சப்பாத்தி + குருமா',
    englishName: 'Chapati with Veg Kurma',
    price: 60,
    desc: 'மென்மையான கோதுமை சப்பாத்தி மற்றும் வீட்டுக் குருமா',
    diet: 'veg',
    keywords: 'chapati chapathi roti kurma சப்பாத்தி குருமா',
  },
  {
    cat: 'tiffin',
    name: 'சிறிய பொடி இட்லி (20 பீஸ்)',
    englishName: 'Mini Podi Idli (20 Pcs)',
    price: 60,
    desc: 'நல்லெண்ணெய் மற்றும் வீட்டு இட்லி பொடி புரட்டிய மினி இட்லி',
    diet: 'veg',
    popular: true,
    keywords: 'mini podi idli ghee idly பொடி இட்லி',
  },
  {
    cat: 'tiffin',
    name: 'முட்டை கொத்து சப்பாத்தி',
    englishName: 'Egg Kothu Chapati',
    price: 90,
    desc: 'முட்டை, வெங்காயம், குருமா சேர்த்து கொத்திய சப்பாத்தி',
    diet: 'egg',
    keywords: 'egg kothu chapati chapathi முட்டை கொத்து சப்பாத்தி',
  },
  {
    cat: 'tiffin',
    name: 'சிக்கன் கொத்து சப்பாத்தி',
    englishName: 'Chicken Kothu Chapati',
    price: 120,
    desc: 'சிக்கன் மசாலா மற்றும் முட்டை சேர்த்து கொத்திய சப்பாத்தி',
    diet: 'nonveg',
    keywords: 'chicken kothu chapati chapathi சிக்கன் கொத்து சப்பாத்தி',
  },
  {
    cat: 'tiffin',
    name: 'முட்டை கொத்து புரோட்டா',
    englishName: 'Egg Kothu Parotta',
    price: 80,
    desc: 'சூடான கல்லில் முட்டை & சால்னா சேர்த்து கொத்திய புரோட்டா',
    diet: 'egg',
    popular: true,
    keywords: 'egg kothu parotta porotta barotta முட்டை கொத்து புரோட்டா',
  },

  // Variety Rice (d15 - d21)
  {
    cat: 'rice',
    name: 'சாம்பார் சாதம்',
    englishName: 'Sambar Rice',
    price: 60,
    desc: 'பருப்பு, காய்கறி சேர்த்த மணக்க மணக்க சாம்பார் சாதம்',
    diet: 'veg',
    popular: true,
    keywords: 'sambar sadam rice சாம்பார் சாதம்',
  },
  {
    cat: 'rice',
    name: 'தயிர் சாதம்',
    englishName: 'Curd Rice',
    price: 60,
    desc: 'கடுகு, கறிவேப்பிலை தாளித்த குளிர்ச்சியான தயிர் சாதம்',
    diet: 'veg',
    keywords: 'curd rice thayir sadam தயிர் சாதம்',
  },
  {
    cat: 'rice',
    name: 'ரசம் சாதம்',
    englishName: 'Rasam Rice',
    price: 60,
    desc: 'மிளகு சீரக மணம் கமழும் வீட்டு ரசம் சாதம்',
    diet: 'veg',
    keywords: 'rasam sadam rice ரசம் சாதம்',
  },
  {
    cat: 'rice',
    name: 'புளியோதரை',
    englishName: 'Puliyodharai Tamarind Rice',
    price: 60,
    desc: 'வேர்க்கடலை தாளித்த பாரம்பரிய கோவில் சுவை புளியோதரை',
    diet: 'veg',
    keywords: 'puliyodharai tamarind rice puli sadam புளியோதரை',
  },
  {
    cat: 'rice',
    name: 'லெமன் சாதம்',
    englishName: 'Lemon Rice',
    price: 60,
    desc: 'எலுமிச்சை மற்றும் கடலைப்பருப்பு தாளித்த லெமன் சாதம்',
    diet: 'veg',
    keywords: 'lemon rice elumichai sadam லெமன் சாதம்',
  },
  {
    cat: 'rice',
    name: 'தக்காளி சாதம்',
    englishName: 'Tomato Rice',
    price: 60,
    desc: 'பழுத்த தக்காளி மற்றும் மசாலா சேர்த்து சமைத்த தக்காளி சாதம்',
    diet: 'veg',
    keywords: 'tomato rice thakkali sadam தக்காளி சாதம்',
  },
  {
    cat: 'rice',
    name: 'மல்லி சாதம்',
    englishName: 'Coriander Malli Rice',
    price: 60,
    desc: 'புதிய கொத்தமல்லி அரைத்து தாளித்த மணமான மல்லி சாதம்',
    diet: 'veg',
    keywords: 'coriander rice malli sadam மல்லி சாதம்',
  },

  // Meals (d22 - d23)
  {
    cat: 'meals',
    name: 'வெஜ் மீல்ஸ்',
    englishName: 'Traditional Veg Full Meals',
    price: 120,
    desc: '750 கிராம் சாதம் + சாம்பார், ரசம், மோர், புளிக்குழம்பு, கூட்டு, பொரியல், அப்பளம், ஊறுகாய்',
    diet: 'veg',
    popular: true,
    keywords: 'veg meals lunch sappadu vegetarian வெஜ் மீல்ஸ் சாப்பாடு',
  },
  {
    cat: 'meals',
    name: 'சிக்கன் நான்-வெஜ் மீல்ஸ்',
    englishName: 'Chicken Non-Veg Full Meals',
    price: 150,
    desc: '750 கிராம் சாதம் + சிக்கன் குழம்பு, ரசம், மோர், அப்பளம், சிக்கன் 65 (100 கிராம்)',
    diet: 'nonveg',
    popular: true,
    keywords: 'chicken non-veg meals lunch sappadu சிக்கன் நான்-வெஜ் மீல்ஸ்',
  },

  // Egg (d24 - d26)
  {
    cat: 'egg',
    name: 'ஆம்லெட்',
    englishName: 'Onion Green Chilli Omelette',
    price: 25,
    desc: 'சின்ன வெங்காயம், பச்சை மிளகாய், மிளகு சேர்த்த ஆம்லெட்',
    diet: 'egg',
    keywords: 'omelette omlet muttai ஆம்லெட் முட்டை',
  },
  {
    cat: 'egg',
    name: 'முட்டை பொரியல்',
    englishName: 'Egg Podimas / Poriyal',
    price: 30,
    desc: 'வெங்காயம், மிளகு சேர்த்து வறுத்த முட்டை பொடிமாஸ்',
    diet: 'egg',
    keywords: 'egg poriyal podimas scramble முட்டை பொரியல்',
  },
  {
    cat: 'egg',
    name: 'அவித்த முட்டை',
    englishName: 'Boiled Egg',
    price: 20,
    desc: 'மிளகு உப்பு தூவிய சத்தான அவித்த முட்டை',
    diet: 'egg',
    keywords: 'boiled egg avitha muttai அவித்த முட்டை',
  },

  // Side Dish (d27 - d31)
  {
    cat: 'side',
    name: 'ஆனியன் பக்கோடா (150 கிராம்)',
    englishName: 'Crispy Onion Pakoda (150g)',
    price: 70,
    desc: 'கறிவேப்பிலை மணம் கமழும் மொறுமொறு வெங்காய பக்கோடா',
    diet: 'veg',
    keywords: 'onion pakoda pakora snack ஆனியன் பக்கோடா',
  },
  {
    cat: 'side',
    name: 'முகைகேக்ஸ் பக்கோடா (100 கிராம்)',
    englishName: 'Special Crispy Pakoda (100g)',
    price: 50,
    desc: 'மொறுமொறுப்பான சூடான மாலை நேர பக்கோடா',
    diet: 'veg',
    keywords: 'pakoda snack முகைகேக்ஸ் பக்கோடா',
  },
  {
    cat: 'side',
    name: 'கருப்பு உளுந்து பால் (200 மி.லி)',
    englishName: 'Traditional Black Urad Dal Milk (200ml)',
    price: 60,
    desc: 'கருப்பட்டி மற்றும் சுக்கு சேர்த்த ஆரோக்கியமான கருப்பு உளுந்து பால்',
    diet: 'veg',
    popular: true,
    keywords: 'karuppu ulundhu paal black urad health drink கருப்பு உளுந்து பால்',
  },
  {
    cat: 'side',
    name: 'முட்டை போண்டா (2 பீஸ்)',
    englishName: 'Egg Bonda (2 Pcs)',
    price: 40,
    desc: 'கடலை மாவில் பொரித்த சூடான முட்டை போண்டா',
    diet: 'egg',
    keywords: 'egg bonda muttai bajji முட்டை போண்டா',
  },
  {
    cat: 'side',
    name: 'பெப்பர் சிக்கன்',
    englishName: 'Chettinad Pepper Chicken Fry',
    price: 120,
    desc: 'குறுமிளகு மற்றும் கறிவேப்பிலை வறுத்து செய்த காரசாரமான பெப்பர் சிக்கன்',
    diet: 'nonveg',
    popular: true,
    keywords: 'pepper chicken fry starter பெப்பர் சிக்கன்',
  },

  // Fast Food (d32 - d35)
  {
    cat: 'fast',
    name: 'சிக்கன் ரைஸ்',
    englishName: 'Chicken Fried Rice',
    price: 100,
    desc: 'சிக்கன் துண்டுகள், முட்டை மற்றும் காய்கறிகள் சேர்த்த ஃப்ரைடு ரைஸ்',
    diet: 'nonveg',
    popular: true,
    keywords: 'chicken fried rice fast food சிக்கன் ரைஸ்',
  },
  {
    cat: 'fast',
    name: 'எக் ரைஸ்',
    englishName: 'Egg Fried Rice',
    price: 80,
    desc: 'முட்டை மற்றும் காய்கறிகள் சேர்த்து மிளகு தூவிய எக் ஃப்ரைடு ரைஸ்',
    diet: 'egg',
    keywords: 'egg fried rice fast food எக் ரைஸ்',
  },
  {
    cat: 'fast',
    name: 'சிக்கன் நூடுல்ஸ்',
    englishName: 'Chicken Noodles',
    price: 100,
    desc: 'சுவையான சிக்கன் மற்றும் காய்கறி சேர்த்த சூடான நூடுல்ஸ்',
    diet: 'nonveg',
    keywords: 'chicken noodles fast food சிக்கன் நூடுல்ஸ்',
  },
  {
    cat: 'fast',
    name: 'எக் நூடுல்ஸ்',
    englishName: 'Egg Noodles',
    price: 80,
    desc: 'முட்டை மற்றும் காய்கறிகள் சேர்த்த சுவையான எக் நூடுல்ஸ்',
    diet: 'egg',
    keywords: 'egg noodles fast food எக் நூடுல்ஸ்',
  },
];

export function createInitialMenuItems(): MenuItem[] {
  return RAW_DISHES.map((dish, index) => {
    const catObj = CATEGORIES.find((c) => c.id === dish.cat);
    return {
      id: index,
      key: 'd' + String(index + 1).padStart(2, '0'),
      cat: dish.cat,
      catName: catObj ? catObj.title : dish.cat,
      name: dish.name,
      englishName: dish.englishName,
      price: dish.price,
      desc: dish.desc || '',
      sold: !!dish.sold,
      diet: dish.diet,
      popular: dish.popular,
      keywords: dish.keywords,
    };
  });
}

export const DIET_LABELS: Record<DietType, { tamil: string; english: string; short: string }> = {
  veg: { tamil: 'சைவம்', english: 'Veg', short: 'சைவம் · Veg' },
  egg: { tamil: 'முட்டை', english: 'Egg', short: 'முட்டை · Egg' },
  nonveg: { tamil: 'அசைவம்', english: 'Non-Veg', short: 'அசைவம் · Non-Veg' },
};
