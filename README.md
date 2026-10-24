# FitCoach

A bilingual (English / বাংলা) personal gym trainer web app. Built with React, works offline, and installs on your phone like an app.

**Use it now: https://fitcoach-bd.vercel.app**

No sign-up needed. Open the link, answer a few questions and start training. On your phone, tap "Add to Home screen" to install it like an app. Your data stays on your own device.

## Features

- **Personal plan**: pick your goal, your gym days (for example every day except Sunday) and machines or free weights. The app builds a Full Body, Upper/Lower or Push/Pull/Legs week around your days.
- **Workout logger**: log weight and reps for every set, auto-filled from last time, with a 90-second rest timer.
- **Machine busy? Swap it**: every exercise has alternatives (machine, dumbbell, bodyweight).
- **Exercise library**: 39 exercises with step-by-step instructions in English and Bangla, plus photo and video links.
- **Progress**: body-weight chart, workouts per week, strength progress per exercise, full history.
- **Diet**: calorie and macro targets (Mifflin-St Jeor), Bangladeshi food database (bhaat, ruti, dal, egg, fish...), custom foods, water tracker.
- **AI coach**: chat with a Gemini-powered coach that knows your profile and recent workouts, in English or Bangla.
- **Smart rescheduling**: missed a workout, or busy on a gym day? If you picked backup days, the app recommends the best one to make it up (avoiding back-to-back sessions for the same muscles). Otherwise it offers to shift the rest of the week by one day. Everything can be undone.
- Light/dark theme, backup export/import, installable PWA.

## Tech stack

| Part | Tool |
| --- | --- |
| UI | React 18 |
| Build tool | Vite 6 |
| Styling | Tailwind CSS 4 |
| Routing | React Router 6 (HashRouter) |
| State + storage | Zustand with `persist` (localStorage) |
| Translations | i18next + react-i18next |
| Charts | Recharts |
| Offline / install | vite-plugin-pwa |
| AI | Google Gemini API |

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build     # output in dist/
npm run preview   # test the production build
```

## Deploy

**Vercel**: import the GitHub repo, framework preset "Vite", build command `npm run build`, output `dist`.

Live at **https://fitcoach-bd.vercel.app**. Every push to `main` redeploys automatically.

## AI coach setup

**Public (recommended, everyone can use the coach without a key)**

1. Get a free key at https://aistudio.google.com/apikey
2. Deploy to Vercel, then go to Project → Settings → Environment Variables and add `GEMINI_API_KEY`.
3. Redeploy. The app calls `api/coach` (see `api/coach.js`), so the key never reaches the browser.

**Personal key**: on hosts without serverless functions (GitHub Pages), users can paste their own key in the Coach tab. It is stored only in their browser.

Watch your Gemini usage in AI Studio. If the app gets popular, add rate limiting (for example Upstash) to `api/coach.js`.

## Project structure

```
src/
  main.jsx            entry point
  App.jsx             routes, theme, language
  index.css           Tailwind + theme colors
  i18n/               en.json, bn.json, helpers
  data/               exercises.js, foods.js
  lib/                fitness.js (plans, BMR/TDEE), schedule.js (week plan, make-up days), nutrition.js, ai.js
  store/useStore.js   all app state (Zustand)
  components/         Layout, Icon, Bar, ExerciseInfo, WeekStrip, MakeupCard
  pages/              Onboarding, Today, Workout, Library, Progress, Diet, Coach, Settings
api/
  coach.js            Vercel serverless function for the shared AI coach
```

## Roadmap

- [ ] User accounts and cloud sync (Supabase or Firebase)
- [ ] Android/iOS app with Capacitor (same code)
- [ ] Exercise images/GIFs stored in the app
- [ ] Reminders and notifications

Nutrition values are approximate. This app is not medical advice.

## License

MIT © Kamruzzaman Amit
