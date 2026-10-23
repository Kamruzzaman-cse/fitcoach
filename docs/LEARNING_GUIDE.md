# FitCoach — শেখার গাইড

এই গাইডে আছে অ্যাপটা কী দিয়ে বানানো, প্রতিটা টুল কেন নেওয়া হয়েছে, কোন ফাইলে কী আছে, আর পরে কীভাবে এটাকে মোবাইল অ্যাপ বানাবে। ক্রম ধরে পড়লে নিজেই এরকম অ্যাপ বানাতে পারবে।

---

## ১. বড় ছবিটা

FitCoach একটা **Single Page Application (SPA)**। মানে একটাই HTML পেজ, বাকি সব React দিয়ে ব্রাউজারে আঁকা হয়। কোনো সার্ভার বা ডেটাবেস নেই। সব ডেটা ব্রাউজারের `localStorage`-এ থাকে।

```
User clicks  →  React component  →  Zustand store (state)  →  localStorage
                       ↑                     │
                       └──── re-render ──────┘
```

এই ডিজাইনের সুবিধা: ফ্রিতে হোস্ট করা যায় (Vercel / GitHub Pages), অফলাইনে চলে, শেখা সহজ।
অসুবিধা: এক ফোনের ডেটা আরেক ফোনে যায় না। পরে Supabase বা Firebase যোগ করে এটা ঠিক করা যাবে (নিচে রোডম্যাপ দেখো)।

---

## ২. কোন টুল কেন

| টুল | কী কাজ করে | কেন এটা নিলাম |
| --- | --- | --- |
| **Node.js + npm** | প্যাকেজ ইনস্টল আর ডেভ সার্ভার চালানো | সব আধুনিক ওয়েব প্রজেক্টের ভিত্তি |
| **Vite** | ডেভ সার্ভার আর build tool | খুব দ্রুত, কনফিগ প্রায় লাগে না। `npm run dev` দিলে সাথে সাথে চালু |
| **React** | UI-কে ছোট ছোট component-এ ভাগ করা | ইন্ডাস্ট্রিতে সবচেয়ে বেশি চলে। পরে React Native-এ যাওয়াও সহজ |
| **Tailwind CSS** | ক্লাস দিয়ে স্টাইল (`bg-accent rounded-xl p-4`) | আলাদা CSS ফাইল কম লাগে, দ্রুত ডিজাইন করা যায় |
| **React Router** | পেজ বদলানো (`/#/diet`, `/#/progress`) | রিলোড ছাড়াই পেজ বদলায়। `HashRouter` নিয়েছি যাতে GitHub Pages-এ ভাঙে না |
| **Zustand** | পুরো অ্যাপের ডেটা এক জায়গায় রাখা | Redux-এর চেয়ে অনেক সহজ। `persist` দিয়ে নিজে থেকেই localStorage-এ সেভ |
| **i18next** | ইংরেজি/বাংলা অনুবাদ | সব লেখা JSON ফাইলে, কোডে শুধু `t('nav.today')` |
| **Recharts** | চার্ট (ওজন, সাপ্তাহিক ওয়ার্কআউট) | React-এর জন্যই বানানো, সহজ API |
| **vite-plugin-pwa** | অ্যাপটাকে "ইনস্টলযোগ্য" আর অফলাইন করা | ফোনে "Add to Home screen" দিলে অ্যাপের মতো খোলে |
| **Gemini API** | AI কোচ | Google-এর ফ্রি টায়ার আছে, ছাত্রদের জন্য ভালো |

---

## ৩. ফোল্ডার ম্যাপ

```
fitcoach/
├── index.html              ← একমাত্র HTML, এখানে <div id="root"> আছে
├── vite.config.js          ← Vite + React + Tailwind + PWA সেটআপ
├── package.json            ← কোন প্যাকেজ লাগবে, কোন কমান্ড চলবে
├── public/icon.svg         ← অ্যাপের আইকন
├── api/coach.js            ← Vercel সার্ভার ফাংশন: সবার জন্য AI কোচ (key গোপন থাকে)
└── src/
    ├── main.jsx            ← শুরু এখান থেকে: React-কে root-এ বসায়
    ├── App.jsx             ← রাউট, থিম, ভাষা ঠিক করে
    ├── index.css           ← Tailwind + রঙের টোকেন (লাইট/ডার্ক)
    ├── i18n/
    │   ├── en.json         ← সব ইংরেজি লেখা
    │   ├── bn.json         ← সব বাংলা লেখা (একই key)
    │   └── index.js        ← i18next সেটআপ + tx(), num(), digits() হেল্পার
    ├── data/
    │   ├── exercises.js    ← ৩৯টা এক্সারসাইজ, দুই ভাষায়, বিকল্পসহ
    │   └── foods.js        ← দেশি খাবারের ক্যালরি/প্রোটিন
    ├── lib/
    │   ├── fitness.js      ← ওয়ার্কআউট টেমপ্লেট, BMR/TDEE হিসাব, তারিখ
    │   ├── schedule.js     ← সাপ্তাহিক প্ল্যান, মিস হলে কোন দিন করবে
    │   ├── nutrition.js    ← খাবারের মোট হিসাব
    │   └── ai.js           ← Gemini-কে প্রশ্ন পাঠানো
    ├── store/useStore.js   ← পুরো অ্যাপের state আর action
    ├── components/         ← বারবার ব্যবহার হওয়া অংশ
    └── pages/              ← প্রতিটা স্ক্রিন
```

**নিয়ম যেটা মেনে চলেছি:** ডেটা (`data/`), হিসাব (`lib/`), স্টেট (`store/`) আর UI (`pages/`, `components/`) আলাদা। তাই পরে মোবাইল অ্যাপ বানালে `data`, `lib`, `store` হুবহু কপি করা যাবে, শুধু UI নতুন করে লিখতে হবে।

---

## ৪. পড়ার ক্রম (এভাবে কোড পড়ো)

1. **`src/main.jsx`**: দেখো React কীভাবে শুরু হয়।
2. **`src/App.jsx`**: `<Routes>` দেখো। প্রোফাইল না থাকলে Onboarding দেখায়।
3. **`src/store/useStore.js`**: সবচেয়ে গুরুত্বপূর্ণ ফাইল। `startWorkout`, `finishWorkout`, `addFood` এসব action দেখো।
4. **`src/lib/fitness.js`**: `buildWorkout()` কীভাবে template থেকে প্ল্যান বানায়, `calcNutrition()` কীভাবে ক্যালরি হিসাব করে।
5. **`src/pages/Today.jsx`**: একটা সাধারণ পেজ কীভাবে store থেকে ডেটা নিয়ে দেখায়।
6. **`src/pages/Workout.jsx`**: সবচেয়ে জটিল পেজ। `useState`, `useEffect` দিয়ে রেস্ট টাইমার কীভাবে চলে।
7. **`src/i18n/`**: একটা নতুন key দুই JSON-এ যোগ করে দেখো।

---

## ৫. মূল ধারণাগুলো ছোট করে

### Component আর Props
```jsx
function Stat({ label, value }) {          // props নিচ্ছে
  return <div>{label}: {value}</div>
}
<Stat label="This week" value="3/6" />     // ব্যবহার
```

### useState: component-এর নিজের ছোট ডেটা
```jsx
const [rest, setRest] = useState(0)   // rest = 0
setRest(90)                           // বদলালে পেজ আবার আঁকা হয়
```

### useEffect: কোনো কিছু বদলালে কাজ করা
```jsx
useEffect(() => {
  if (rest <= 0) return
  const id = setTimeout(() => setRest(r => r - 1), 1000)   // প্রতি সেকেন্ডে ১ কমে
  return () => clearTimeout(id)                             // cleanup
}, [rest])
```

### Zustand store: পুরো অ্যাপের শেয়ার করা ডেটা
```js
const sessions = useStore(s => s.sessions)       // পড়া
const addFood  = useStore(s => s.addFood)        // action নেওয়া
addFood('egg_boiled', 2)                         // ২টা ডিম যোগ
```
`persist` middleware থাকায় প্রতিবার বদলালে localStorage-এ `fitcoach-data` নামে সেভ হয়।

### অনুবাদ
```jsx
const { t, i18n } = useTranslation()
t('nav.today')                      // "Today" অথবা "আজ"
tx(exercise.target, i18n.language)  // ডেটার { en, bn } থেকে সঠিকটা
num(12, 'bn')                       // "১২"
```

### থিম (লাইট/ডার্ক)
`index.css`-এ `:root`-এ লাইট রং আর `.dark`-এ ডার্ক রং। `App.jsx` `<html>`-এ `dark` ক্লাস যোগ বা বাদ দেয়। Tailwind-এর `bg-surface`, `text-muted` এসব ক্লাস ওই রং থেকেই আসে, তাই কোনো component-এ আলাদা করে ডার্ক মোড লিখতে হয়নি।

---

## ৬. স্মার্ট লজিকগুলো

- **নিজের জিমের দিন (`lib/schedule.js`):** প্রোফাইলে `trainingDays` আছে, যেমন রবিবার বাদে `[6,1,2,3,4,5]` (JS-এ ০ = রবিবার, ৬ = শনিবার)। `weekPlan()` শনিবার থেকে শুরু করে ওই দিনগুলোতে split-এর ওয়ার্কআউট ক্রমে বসায়। রবিবার বন্ধ দিলে Push/Pull/Legs হয়: শনি Push, সোম Pull, মঙ্গল Legs, বুধ Push, বৃহঃ Pull, শুক্র Legs।
- **মিস হলে কোন দিন করবে (`recommendDay()`):** এই সপ্তাহের বাকি ফাঁকা দিনগুলো খোঁজে। যে দিনের আগে বা পরে একই ওয়ার্কআউট আছে সেটা বাদ দেয়, কারণ একই মাসলকে টানা দুই দিন চাপ দিলে রিকভারি হয় না। বাকিগুলোর মধ্যে সবচেয়ে আগের দিনটা সাজেস্ট করে।
- **ফাঁকা দিন না থাকলে (`shiftPlan()`):** মিস হওয়া ওয়ার্কআউট পরের জিমের দিনে যায়, সেই দিনেরটা তার পরের দিনে, এভাবে চলে। সপ্তাহের শেষ ওয়ার্কআউটটা বাদ পড়ে।
- **সব পরিবর্তন `reschedules` লিস্টে থাকে:** `{ from, to, templateKey, group }`। আসল প্ল্যান কখনো বদলায় না, তাই "Undo" দিলেই আগের অবস্থা ফিরে আসে। একসাথে করা পরিবর্তনগুলোর `group` এক, তাই Undo সবগুলো একসাথে ফেরায়।
- **`scheduledFor`:** প্রতিটা সেশনে লেখা থাকে কোন দিনের ওয়ার্কআউট এটা। তাই শনিবারের মিস হওয়া ওয়ার্কআউট সোমবার করলে শনিবারটাই "শেষ" দেখায়, সোমবারের নিজেরটা না।
- **Progressive overload:** নতুন ওয়ার্কআউট শুরু করলে `lastPerformance()` আগেরবারের ওজন/রেপ বসিয়ে দেয়। তুমি শুধু একটু বাড়াবে।
- **Swap:** প্রতিটা এক্সারসাইজের `alts` লিস্ট আছে। একবার swap করলে মনে রাখে (`swaps`), পরের বারও সেটাই দেখায়।
- **Equipment preference:** "Free weights" বা "Home" বাছলে `pickForEquipment()` মেশিনের জায়গায় ডাম্বেল/বডিওয়েট বিকল্প বসায়।
- **ক্যালরি:** Mifflin-St Jeor সূত্রে BMR, তারপর সপ্তাহে কয়দিন জিম সেটা দিয়ে TDEE, তারপর লক্ষ্য অনুযায়ী কম/বেশি।

---

## ৭. চালানো আর GitHub-এ তোলা

```bash
npm install          # প্রথমবার প্যাকেজ নামাবে
npm run dev          # http://localhost:5173 এ চালু
npm run build        # dist/ ফোল্ডারে ফাইনাল ফাইল
```

GitHub-এ তোলা:
```bash
git init
git add .
git commit -m "FitCoach v1.0"
git branch -M main
git remote add origin https://github.com/Kamruzzaman-cse/fitcoach.git
git push -u origin main
```
(আগে GitHub-এ `fitcoach` নামে খালি repo বানিয়ে নিও।)

তারপর repo-র **Settings → Pages → Source**-এ **GitHub Actions** বেছে নাও। `.github/workflows/deploy.yml` ফাইলটা প্রতিবার push করলে নিজে থেকেই `npm run build` চালিয়ে অ্যাপটা `https://kamruzzaman-cse.github.io/fitcoach/`-এ পাবলিশ করে। repo-র **Actions** ট্যাবে গিয়ে দেখতে পারবে build চলছে কিনা।

এটাকে বলে **CI/CD**: কোড push করলেই অটোমেটিক build আর deploy। ইন্ডাস্ট্রিতে সবাই এভাবেই কাজ করে।

GitHub Pages-এ সার্ভার ফাংশন চলে না, তাই সেখানে AI কোচ ব্যবহার করতে প্রত্যেক ইউজারকে নিজের ফ্রি Gemini key দিতে হবে। key ছাড়া সবাইকে কোচ দিতে চাইলে একই repo Vercel-এও import করো (নিচে ৯ নম্বর অংশ দেখো)।

---

## ৮. নিজে চেষ্টা করার মতো কাজ (সহজ থেকে কঠিন)

1. `foods.js`-এ নতুন একটা খাবার যোগ করো (যেমন পান্তা ভাত)।
2. `exercises.js`-এ নতুন এক্সারসাইজ যোগ করো, আর কোনো template-এ বসাও।
3. রেস্ট টাইমার ৯০ সেকেন্ডের বদলে সেটিংস থেকে বদলানো যায় এমন করো।
4. Progress পেজে "Personal Record" (সবচেয়ে ভারী সেট) একটা কার্ডে দেখাও।
5. প্রতিটা এক্সারসাইজের নিজের ছবি `public/exercises/` ফোল্ডারে রেখে দেখাও।

---

## ৯. ভবিষ্যৎ রোডম্যাপ: ওয়েব থেকে আসল অ্যাপ

**ধাপ ১: PWA (এখনই আছে)।** ফোনে ইনস্টল হয়, অফলাইনে চলে।

**সবাই যাতে ব্যবহার করতে পারে (এখনই করা যায়):** Vercel-এ deploy করো আর Environment Variables-এ `GEMINI_API_KEY` দাও। তাহলে `api/coach.js` সার্ভারে তোমার key দিয়ে Gemini-কে কল করবে। ইউজারদের কোনো key লাগবে না, আর তোমার key-ও কেউ দেখতে পাবে না। প্রত্যেক ইউজারের ডেটা তার নিজের ফোন/ব্রাউজারে থাকে, তাই কোনো সাইন-আপ ছাড়াই যে কেউ লিংক খুলে ব্যবহার শুরু করতে পারবে। AI Studio-তে মাঝে মাঝে usage দেখে নিও। অনেক ইউজার হলে `api/coach.js`-এ rate limit যোগ করবে।

**ধাপ ২: লগইন আর ক্লাউড সেভ।** **Supabase** (ফ্রি, Postgres ডেটাবেস + Auth) যোগ করো। `useStore.js`-এর action-গুলো localStorage-এর বদলে Supabase-এ লিখবে। AI key-ও তখন Supabase Edge Function বা Vercel Function-এ সরাবে, যাতে ইউজার দেখতে না পায়।

**ধাপ ৩: Play Store অ্যাপ।** দুটো রাস্তা:
- **Capacitor (সবচেয়ে সহজ):** এই কোডই Android অ্যাপে মুড়ে দেয়।
  ```bash
  npm i @capacitor/core @capacitor/cli @capacitor/android
  npx cap init FitCoach com.kamruzzaman.fitcoach --web-dir dist
  npm run build && npx cap add android && npx cap open android
  ```
  Android Studio-তে APK বানাবে। তোমার ডেস্কটপ PC-তেই চলবে।
- **React Native / Expo (বেশি native অনুভূতি):** `data/`, `lib/`, `store/` কপি করবে, শুধু `pages/` নতুন করে লিখবে।

**ধাপ ৪: ব্যবসা।** জিমগুলোর জন্য ট্রেইনার ড্যাশবোর্ড, মেম্বারের প্রোগ্রেস দেখা, মাসিক সাবস্ক্রিপশন। এখান থেকেই এটা SaaS হতে পারে।

---

## ১০. শেখার রিসোর্স

- React: https://react.dev/learn
- Vite: https://vite.dev/guide/
- Tailwind CSS: https://tailwindcss.com/docs
- Zustand: https://zustand.docs.pmnd.rs
- react-i18next: https://react.i18next.com
- Recharts: https://recharts.org
- Gemini API: https://ai.google.dev/gemini-api/docs
- Capacitor: https://capacitorjs.com/docs
