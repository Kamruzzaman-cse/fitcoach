/*
  Common Bangladeshi foods, per serving.
  Values are APPROXIMATE (home cooking varies a lot) — good enough for daily tracking.
  kcal = calories, p = protein (g), c = carbs (g), f = fat (g)
*/
export const FOODS = [
  { id: 'rice', name: { en: 'Cooked white rice', bn: 'ভাত' }, serving: { en: '1 cup (160 g)', bn: '১ কাপ (১৬০ গ্রাম)' }, kcal: 205, p: 4.3, c: 45, f: 0.4 },
  { id: 'ruti', name: { en: 'Roti (atta)', bn: 'রুটি (আটা)' }, serving: { en: '1 medium', bn: '১টা মাঝারি' }, kcal: 110, p: 3.5, c: 22, f: 1 },
  { id: 'paratha', name: { en: 'Paratha', bn: 'পরোটা' }, serving: { en: '1 piece', bn: '১টা' }, kcal: 260, p: 5, c: 35, f: 11 },
  { id: 'bread', name: { en: 'Bread', bn: 'পাউরুটি' }, serving: { en: '1 slice', bn: '১ স্লাইস' }, kcal: 75, p: 2.5, c: 14, f: 1 },
  { id: 'oats', name: { en: 'Oats (dry)', bn: 'ওটস (শুকনা)' }, serving: { en: '40 g', bn: '৪০ গ্রাম' }, kcal: 150, p: 5, c: 27, f: 2.7 },
  { id: 'muri', name: { en: 'Puffed rice', bn: 'মুড়ি' }, serving: { en: '1 cup', bn: '১ কাপ' }, kcal: 60, p: 1, c: 13, f: 0.1 },
  { id: 'khichuri', name: { en: 'Khichuri', bn: 'খিচুড়ি' }, serving: { en: '1 cup', bn: '১ কাপ' }, kcal: 300, p: 10, c: 45, f: 9 },
  { id: 'biryani', name: { en: 'Biryani / Tehari', bn: 'বিরিয়ানি / তেহারি' }, serving: { en: '1 plate', bn: '১ প্লেট' }, kcal: 650, p: 25, c: 80, f: 25 },

  { id: 'egg_boiled', name: { en: 'Boiled egg', bn: 'সেদ্ধ ডিম' }, serving: { en: '1 large', bn: '১টা' }, kcal: 78, p: 6.3, c: 0.6, f: 5.3 },
  { id: 'omelette', name: { en: 'Omelette / fried egg', bn: 'ডিম ভাজি / অমলেট' }, serving: { en: '1 egg', bn: '১টা ডিম' }, kcal: 100, p: 6.5, c: 1, f: 8 },
  { id: 'chicken_breast', name: { en: 'Chicken breast (cooked)', bn: 'মুরগির বুকের মাংস (রান্না)' }, serving: { en: '100 g', bn: '১০০ গ্রাম' }, kcal: 165, p: 31, c: 0, f: 3.6 },
  { id: 'chicken_curry', name: { en: 'Chicken curry', bn: 'মুরগির তরকারি' }, serving: { en: '1 piece + gravy', bn: '১ পিস + ঝোল' }, kcal: 200, p: 20, c: 5, f: 11 },
  { id: 'beef_curry', name: { en: 'Beef curry', bn: 'গরুর মাংস' }, serving: { en: '100 g', bn: '১০০ গ্রাম' }, kcal: 250, p: 24, c: 4, f: 15 },
  { id: 'rui_curry', name: { en: 'Rui fish curry', bn: 'রুই মাছের তরকারি' }, serving: { en: '1 piece', bn: '১ পিস' }, kcal: 160, p: 17, c: 4, f: 8 },
  { id: 'ilish', name: { en: 'Hilsa (fried)', bn: 'ইলিশ ভাজা' }, serving: { en: '1 piece', bn: '১ পিস' }, kcal: 280, p: 21, c: 2, f: 20 },
  { id: 'tilapia', name: { en: 'Tilapia (cooked)', bn: 'তেলাপিয়া (রান্না)' }, serving: { en: '100 g', bn: '১০০ গ্রাম' }, kcal: 130, p: 26, c: 0, f: 2.7 },
  { id: 'chingri', name: { en: 'Prawn curry', bn: 'চিংড়ি তরকারি' }, serving: { en: '100 g', bn: '১০০ গ্রাম' }, kcal: 150, p: 18, c: 4, f: 7 },
  { id: 'dal', name: { en: 'Lentil soup (dal)', bn: 'ডাল' }, serving: { en: '1 bowl', bn: '১ বাটি' }, kcal: 150, p: 9, c: 22, f: 3 },
  { id: 'chola', name: { en: 'Chickpeas (chola)', bn: 'ছোলা' }, serving: { en: '1 cup', bn: '১ কাপ' }, kcal: 270, p: 14.5, c: 45, f: 4 },
  { id: 'soya', name: { en: 'Soya chunks (dry)', bn: 'সয়াবিন বড়ি (শুকনা)' }, serving: { en: '50 g', bn: '৫০ গ্রাম' }, kcal: 170, p: 26, c: 16, f: 0.3 },
  { id: 'whey', name: { en: 'Whey protein', bn: 'হোয়ে প্রোটিন' }, serving: { en: '1 scoop', bn: '১ স্কুপ' }, kcal: 120, p: 24, c: 3, f: 1.5 },

  { id: 'milk', name: { en: 'Milk (whole)', bn: 'দুধ' }, serving: { en: '1 glass (250 ml)', bn: '১ গ্লাস (২৫০ মিলি)' }, kcal: 150, p: 8, c: 12, f: 8 },
  { id: 'doi', name: { en: 'Plain yogurt (tok doi)', bn: 'টক দই' }, serving: { en: '100 g', bn: '১০০ গ্রাম' }, kcal: 60, p: 3.5, c: 4.7, f: 3.3 },
  { id: 'mishti_doi', name: { en: 'Sweet yogurt', bn: 'মিষ্টি দই' }, serving: { en: '100 g', bn: '১০০ গ্রাম' }, kcal: 150, p: 4, c: 25, f: 4 },
  { id: 'cha', name: { en: 'Milk tea with sugar', bn: 'দুধ চা (চিনিসহ)' }, serving: { en: '1 cup', bn: '১ কাপ' }, kcal: 60, p: 1.5, c: 9, f: 2 },

  { id: 'vegetables', name: { en: 'Mixed vegetable curry', bn: 'সবজি' }, serving: { en: '1 cup', bn: '১ কাপ' }, kcal: 120, p: 3, c: 12, f: 7 },
  { id: 'aloo_bhorta', name: { en: 'Mashed potato (bhorta)', bn: 'আলু ভর্তা' }, serving: { en: '½ cup', bn: '½ কাপ' }, kcal: 150, p: 2, c: 18, f: 8 },
  { id: 'banana', name: { en: 'Banana', bn: 'কলা' }, serving: { en: '1 medium', bn: '১টা' }, kcal: 105, p: 1.3, c: 27, f: 0.4 },
  { id: 'apple', name: { en: 'Apple', bn: 'আপেল' }, serving: { en: '1 medium', bn: '১টা' }, kcal: 95, p: 0.5, c: 25, f: 0.3 },
  { id: 'dates', name: { en: 'Dates', bn: 'খেজুর' }, serving: { en: '3 pieces', bn: '৩টা' }, kcal: 70, p: 0.6, c: 18, f: 0.1 },
  { id: 'peanuts', name: { en: 'Peanuts', bn: 'চিনাবাদাম' }, serving: { en: '30 g (a handful)', bn: '৩০ গ্রাম (এক মুঠো)' }, kcal: 170, p: 7, c: 5, f: 14 },
  { id: 'singara', name: { en: 'Singara / Samosa', bn: 'সিঙ্গারা / সমুচা' }, serving: { en: '1 piece', bn: '১টা' }, kcal: 150, p: 3, c: 17, f: 8 },
  { id: 'puri', name: { en: 'Puri', bn: 'পুরি' }, serving: { en: '1 piece', bn: '১টা' }, kcal: 100, p: 2, c: 12, f: 5 },
  { id: 'soft_drink', name: { en: 'Soft drink', bn: 'কোমল পানীয়' }, serving: { en: '250 ml', bn: '২৫০ মিলি' }, kcal: 105, p: 0, c: 27, f: 0 }
]

export const FOOD_BY_ID = Object.fromEntries(FOODS.map(f => [f.id, f]))
