import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useStore } from './store/useStore'
import Layout from './components/Layout'
import Onboarding from './pages/Onboarding'
import Today from './pages/Today'
import Workout from './pages/Workout'
import Library from './pages/Library'
import Progress from './pages/Progress'
import Diet from './pages/Diet'
import Coach from './pages/Coach'
import Settings from './pages/Settings'

export default function App() {
  const profile = useStore(s => s.profile)
  const { lang, theme } = useStore(s => s.settings)
  const { i18n } = useTranslation()

  // keep i18next + <html lang> in sync with the saved language
  useEffect(() => {
    i18n.changeLanguage(lang)
    document.documentElement.lang = lang
  }, [lang, i18n])

  // theme: 'system' follows the phone/PC setting, otherwise forced light/dark
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && mq.matches)
      document.documentElement.classList.toggle('dark', dark)
    }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [theme])

  // scroll to top when the page changes
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname, profile])

  if (!profile) return <Onboarding />

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Today />} />
        <Route path="/library" element={<Library />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/diet" element={<Diet />} />
        <Route path="/coach" element={<Coach />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="/workout" element={<Workout />} />
      <Route path="/profile" element={<Onboarding edit />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
