import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import bn from './bn.json'

/*
  i18next = translation engine.
  All UI text lives in en.json / bn.json. In components use:
    const { t } = useTranslation();  t('nav.today')
  English is the main (fallback) language.
*/
let saved = 'en'
try { saved = JSON.parse(localStorage.getItem('fitcoach-data'))?.state?.settings?.lang || 'en' } catch { /* ignore */ }

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, bn: { translation: bn } },
  lng: saved,
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
})

/* Pick the right language from a bilingual data object like { en: '...', bn: '...' } */
export const tx = (obj, lang) => (obj ? obj[lang] ?? obj.en : '')

/* Numbers in Bangla digits when language is Bangla: 12 -> ১২ */
export const num = (n, lang, opts) =>
  n == null || Number.isNaN(n) ? '–' : new Intl.NumberFormat(lang === 'bn' ? 'bn-BD' : 'en-US', { maximumFractionDigits: 1, ...opts }).format(n)

/* Convert digits inside any text: "8–12" -> "৮–১২" */
export const digits = (str, lang) =>
  lang === 'bn' ? String(str).replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]) : String(str)

export default i18n
