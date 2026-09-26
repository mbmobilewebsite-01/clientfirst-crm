import { useStore } from './hooks/useStore.js'
import { T } from './utils/constants.js'
import { C } from './utils/constants.js'
import { Bdg } from './components/UI.jsx'
import Login     from './pages/Login.jsx'
import Sidebar   from './components/Sidebar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Orders    from './pages/Orders.jsx'
import Operations from './pages/Operations.jsx'
import WeeklyPerf from './pages/WeeklyPerf.jsx'
import Tasks     from './pages/Tasks.jsx'
import Pipeline  from './pages/Pipeline.jsx'
import Marketing from './pages/Marketing.jsx'
import Payments  from './pages/Payments.jsx'
import Finance   from './pages/Finance.jsx'
import Settings  from './pages/Settings.jsx'

export default function App() {
  const store = useStore()
  const { user, setUser, lang, setLang, tab, setTab } = store
  const t = T[lang] || T.en

  if (!user) return <Login onLogin={u => { setUser(u); setTab('dashboard') }} lang={lang} setLang={setLang} />

  const isAdmin      = user.role === 'admin' || user.role === 'superAdmin'
  const isSuperAdmin = user.role === 'superAdmin'
  const roleLabel    = user.role === 'superAdmin' ? `⭐ ${t.superAdmin}` : user.role === 'admin' ? `🛡️ ${t.admin}` : `👤 ${t.user}`
  const roleBdg      = user.role === 'superAdmin' ? 'amber' : user.role === 'admin' ? 'teal' : 'blue'
  const pageProps    = { ...store, user, isAdmin, isSuperAdmin, lang, t }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.page, fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
      <Sidebar user={user} tab={tab} setTab={setTab} isAdmin={isAdmin} isSuperAdmin={isSuperAdmin} t={t} />
      <div style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
        {/* TOP BAR */}
        <div style={{ background: '#fff', borderBottom: `1px solid ${C.border}`, padding: '0 24px', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg,${C.blue},${C.teal})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 12, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>MB</span>
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 900, color: C.dark, letterSpacing: '0.3px', lineHeight: 1 }}>{t.appName}</div>
              <div style={{ fontSize: 10, color: C.light, marginTop: 1 }}>Rawalakot, AJK · Pakistan</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Language switcher */}
            <div style={{ display: 'flex', gap: 3, background: C.borderLight, borderRadius: 8, padding: 3 }}>
              {[['en','EN'],['ur','UR'],['ar','AR']].map(([code, label]) => (
                <button key={code} onClick={() => setLang(code)}
                  style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: lang === code ? '#fff' : 'transparent', color: lang === code ? C.blue : C.light, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: lang === code ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.15s' }}>
                  {label}
                </button>
              ))}
            </div>
            <div style={{ fontSize: 11, color: C.light, fontWeight: 600 }}>
              {new Date().toLocaleDateString('en-GB', { weekday:'short', day:'2-digit', month:'short' })}
            </div>
            <Bdg v={roleBdg}>{roleLabel}</Bdg>
          </div>
        </div>
        {/* PAGE */}
        <div style={{ padding: '24px', maxWidth: 960 }}>
          {tab === 'dashboard'  && <Dashboard  {...pageProps} />}
          {tab === 'orders'     && <Orders     {...pageProps} />}
          {tab === 'operations' && <Operations {...pageProps} />}
          {tab === 'weekly'     && <WeeklyPerf {...pageProps} />}
          {tab === 'tasks'      && <Tasks      {...pageProps} />}
          {tab === 'pipeline'   && <Pipeline   {...pageProps} />}
          {tab === 'marketing'  && <Marketing  {...pageProps} />}
          {tab === 'payments'   && <Payments   {...pageProps} />}
          {tab === 'finance'    && <Finance    {...pageProps} />}
          {tab === 'settings'   && <Settings   {...pageProps} onLogout={() => { setUser(null); setTab('dashboard') }} />}
        </div>
      </div>
    </div>
  )
}
