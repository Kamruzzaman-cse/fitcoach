# FitCoach

A bilingual (English / বাংলা) personal gym trainer web app. Built with React, works offline, and installs on your phone like an app.

## Features

- **Personal plan**: answer a few questions (goal, days per week, machines or free weights) and get a Full Body, Upper/Lower or Push/Pull/Legs split.
- **Workout logger**: log weight and reps for every set, auto-filled from last time, with a 90-second rest timer.
- **Machine busy? Swap it**: every exercise has alternatives (machine, dumbbell, bodyweight).
- **Exercise library**: 39 exercises with step-by-step instructions in English and Bangla, plus photo and video links.
- **Progress**: body-weight chart, workouts per week, strength progress per exercise, full history.
- **Diet**: calorie and macro targets (Mifflin-St Jeor), Bangladeshi food database (bhaat, ruti, dal, egg, fish...), custom foods, water tracker.
- **AI coach**: chat with a Gemini-powered coach that knows your profile and recent workouts, in English or Bangla.
- **Missed a day?** The plan is a rotation, so you always just do the next workout.
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

**GitHub Pages**: run `npm run build` and publish the `dist` folder (the app uses relative paths and HashRouter, so it works in a sub-folder).

## AI coach setup

1. Get a free key at https://aistudio.google.com/apikey
2. Open the Coach tab and paste it.

The key is stored only in your browser. For a public app with many users, move the Gemini call into a backend (for example a Vercel serverless function) so the key stays secret.

## Project structure

```
src/
  main.jsx            entry point
  App.jsx             routes, theme, language
  index.css           Tailwind + theme colors
  i18n/               en.json, bn.json, helpers
  data/               exercises.js, foods.js
  lib/                fitness.js (plans, BMR/TDEE), nutrition.js, ai.js
  store/useStore.js   all app state (Zustand)
  components/         Layout, Icon, Bar, ExerciseInfo
  pages/              Onboarding, Today, Workout, Library, Progress, Diet, Coach, Settings
```

## Roadmap

- [ ] User accounts and cloud sync (Supabase or Firebase)
- [ ] Android/iOS app with Capacitor (same code)
- [ ] Exercise images/GIFs stored in the app
- [ ] Reminders and notifications

Nutrition values are approximate. This app is not medical advice.

## License

MIT © Kamruzzaman Amit
