import { useState } from 'react'
import { USERS, C, T } from '../utils/constants.js'

export default function Login({ onLogin, lang, setLang }) {
  const [email, setEmail] = useState('')
  const [pass,  setPass]  = useState('')
  const [err,   setErr]   = useState('')
  const t = T[lang] || T.en

  const go = () => {
    const u = USERS.find(x => x.email === email && x.password === pass)
    u ? onLogin(u) : setErr('Invalid email or password.')
  }

  // Unsplash real team/office photo — professionals working
  const bgImg = "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&q=80"

  return (
    <div style={{ minHeight: '100vh', display: 'flex', position: 'relative', fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
      {/* Left — background image */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'flex-end', padding: 48, minHeight: '100vh', overflow: 'hidden' }}>
        <img src={bgImg} alt="Team working" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(15,23,42,0.75) 0%, rgba(37,99,235,0.55) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 12 }}>ClientFirst Solutions</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: 14 }}>
            Operations &<br />Inventory CRM
          </div>
          <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, maxWidth: 380 }}>
            Track every order, product, payment, and team task — all in one place. Built for MB Mobile, Rawalakot.
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 28 }}>
            {['Orders', 'Finance', 'Team Tasks', 'Pipeline'].map(f => (
              <div key={f} style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.12)', borderRadius: 20, padding: '5px 12px', fontWeight: 600, backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}>{f}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — login form */}
      <div style={{ width: 420, background: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 40px', boxShadow: '-4px 0 40px rgba(0,0,0,0.1)' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg,${C.blue},${C.teal})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: '#fff' }}>MB</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: C.dark }}>MB Mobile</div>
            <div style={{ fontSize: 11, color: C.light }}>Powered by ClientFirst</div>
          </div>
        </div>

        {/* Language switcher */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
          {[['en','🇬🇧 English'],['ur','🇵🇰 اردو'],['ar','🇸🇦 العربية']].map(([code, label]) => (
            <button key={code} onClick={() => setLang(code)}
              style={{ flex: 1, padding: '7px 0', borderRadius: 8, border: `1.5px solid ${lang === code ? C.blue : C.border}`, background: lang === code ? C.blueLight : '#fff', color: lang === code ? C.blue : C.mid, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
              {label}
            </button>
          ))}
        </div>

        <div style={{ fontSize: 24, fontWeight: 900, color: C.dark, marginBottom: 6 }}>{t.welcome}</div>
        <div style={{ fontSize: 14, color: C.light, marginBottom: 28 }}>{t.loginSub}</div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.mid, marginBottom: 6 }}>{t.email}</div>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && go()}
            placeholder="you@example.com"
            style={{ width: '100%', border: `2px solid ${C.border}`, borderRadius: 10, padding: '12px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', color: C.dark }} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.mid, marginBottom: 6 }}>{t.password}</div>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === 'Enter' && go()}
            placeholder="••••••••"
            style={{ width: '100%', border: `2px solid ${C.border}`, borderRadius: 10, padding: '12px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', color: C.dark }} />
        </div>
        {err && <div style={{ color: C.red, fontSize: 13, marginBottom: 12, fontWeight: 600 }}>⚠ {err}</div>}
        <button onClick={go}
          style={{ width: '100%', padding: 13, borderRadius: 10, border: 'none', background: `linear-gradient(135deg,${C.blue},${C.teal})`, color: '#fff', fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', boxShadow: `0 4px 14px ${C.blue}44` }}>
          {t.signIn} →
        </button>

        {/* Demo accounts */}
        <div style={{ marginTop: 28, background: C.page, borderRadius: 12, padding: 16, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: C.light, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>Demo Accounts</div>
          {[
            { email:'ops@mbmobile.pk',       pass:'ops123',    role:'User (Saif)',       color:C.blue   },
            { email:'haroon@mbmobile.pk',     pass:'haroon123', role:'User (Haroon)',     color:C.blue   },
            { email:'admin@mbmobile.pk',      pass:'admin123',  role:'Admin (Bilal)',     color:C.teal   },
            { email:'super@clientfirst.com',  pass:'super123',  role:'Super Admin',       color:C.amber  },
          ].map(a => (
            <div key={a.email} onClick={() => { setEmail(a.email); setPass(a.pass) }}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${C.border}`, cursor: 'pointer' }}>
              <div>
                <div style={{ fontSize: 12, color: C.dark, fontWeight: 600 }}>{a.email}</div>
                <div style={{ fontSize: 11, color: C.light }}>{a.pass}</div>
              </div>
              <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 20, background: a.color + '18', color: a.color, fontWeight: 700, border: `1px solid ${a.color}33` }}>{a.role}</span>
            </div>
          ))}
          <div style={{ fontSize: 11, color: C.light, marginTop: 8 }}>Click any row to auto-fill credentials</div>
        </div>
      </div>
    </div>
  )
}
