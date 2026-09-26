import { C } from '../utils/constants.js'

export default function Sidebar({ user, tab, setTab, isAdmin, isSuperAdmin, t }) {
  const NAV = [
    { id:'dashboard',  label:`🏠 ${t.dashboard}`,  show: true        },
    { id:'orders',     label:`🛒 ${t.orders}`,      show: true        },
    { id:'operations', label:`📦 ${t.operations}`,  show: true        },
    { id:'weekly',     label:`📈 ${t.weekly}`,      show: true        },
    { id:'tasks',      label:`✅ ${t.tasks}`,        show: true        },
    { id:'pipeline',   label:`🔄 ${t.pipeline}`,    show: isAdmin     },
    { id:'marketing',  label:`📣 ${t.marketing}`,   show: isAdmin     },
    { id:'payments',   label:`💰 ${t.payments}`,    show: isAdmin     },
    { id:'finance',    label:`📊 ${t.finance}`,     show: isSuperAdmin},
    { id:'settings',   label:`⚙️ ${t.settings}`,    show: true        },
  ].filter(n => n.show)

  const roleColor = user.role === 'superAdmin' ? C.amber : user.role === 'admin' ? C.teal : C.blue
  const roleLabel = user.role === 'superAdmin' ? `⭐ ${t.superAdmin}` : user.role === 'admin' ? `🛡️ ${t.admin}` : `👤 ${t.user}`

  return (
    <div style={{ width: 210, flexShrink: 0, background: '#fff', borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
      {/* Brand */}
      <div style={{ padding: '20px 16px 16px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: C.light, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4 }}>ClientFirst Solutions</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.dark }}>CRM Platform</div>
      </div>
      {/* User pill */}
      <div style={{ margin: '12px 10px 4px', background: C.blueLight, borderRadius: 10, padding: '10px 12px', border: `1px solid ${C.blueBorder}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: roleColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
            {user.name[0]}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.dark }}>{user.name}</div>
            <div style={{ fontSize: 11, color: roleColor, fontWeight: 600 }}>{roleLabel}</div>
          </div>
        </div>
      </div>
      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 8px' }}>
        {NAV.map(n => {
          const active = tab === n.id
          return (
            <button key={n.id} onClick={() => setTab(n.id)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '10px 12px', borderRadius: 9, border: 'none', marginBottom: 2, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s', textAlign: 'left', background: active ? C.blueLight : 'transparent', color: active ? C.blue : C.mid, fontWeight: active ? 700 : 500, fontSize: 13, borderLeft: active ? `3px solid ${C.blue}` : '3px solid transparent' }}>
              {n.label}
            </button>
          )
        })}
      </nav>
      <div style={{ padding: 12, borderTop: `1px solid ${C.border}`, fontSize: 10, color: C.lighter, textAlign: 'center' }}>
        © 2026 ClientFirst Solutions
      </div>
    </div>
  )
}
