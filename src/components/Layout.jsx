import { NavLink, Outlet, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useStore } from '../store/useStore'
import { Icon } from './Icon'

const TABS = [
  { to: '/', key: 'today', icon: 'home' },
  { to: '/library', key: 'library', icon: 'dumbbell' },
  { to: '/progress', key: 'progress', icon: 'chart' },
  { to: '/diet', key: 'diet', icon: 'food' },
  { to: '/coach', key: 'coach', icon: 'chat' }
]

export default function Layout() {
  const { t } = useTranslation()
  const lang = useStore(s => s.settings.lang)
  const setSetting = useStore(s => s.setSetting)

  return (
    <div className="min-h-full flex flex-col">
      <header className="sticky top-0 z-20 bg-bg/95 backdrop-blur border-b border-line" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="mx-auto max-w-3xl flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img src="./icon.svg" alt="" className="w-8 h-8" />
            <span className="heading text-2xl">{t('app.name')}</span>
          </Link>
          <div className="flex items-center gap-2">
            {/* language toggle */}
            <button
              type="button"
              onClick={() => setSetting('lang', lang === 'en' ? 'bn' : 'en')}
              className="btn-ghost !px-3 !py-1.5 text-sm"
              aria-label="Change language"
            >
              {lang === 'en' ? 'বাংলা' : 'English'}
            </button>
            <NavLink to="/settings" className="btn-ghost !p-2" aria-label={t('common.settings')}>
              <Icon name="settings" />
            </NavLink>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-3xl px-4 pt-4 pb-28">
        <Outlet />
      </main>

      {/* bottom tab bar - feels like a mobile app */}
      <nav className="fixed bottom-0 inset-x-0 z-20 bg-surface border-t border-line" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="mx-auto max-w-3xl grid grid-cols-5">
          {TABS.map(tab => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium ${isActive ? 'text-accent' : 'text-muted'}`
              }
            >
              <Icon name={tab.icon} />
              {t('nav.' + tab.key)}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
