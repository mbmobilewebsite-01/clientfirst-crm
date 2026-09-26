import { useState } from 'react'
import { C } from '../utils/constants.js'

export function FInput({ label, style, ...p }) {
  const [f, setF] = useState(false)
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={{ fontSize: 13, fontWeight: 600, color: C.mid, marginBottom: 6 }}>{label}</div>}
      <input onFocus={() => setF(true)} onBlur={() => setF(false)}
        style={{ width: '100%', background: '#fff', border: `2px solid ${f ? C.blue : C.border}`, borderRadius: 10, padding: '11px 14px', fontSize: 14, color: C.dark, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.15s', ...style }} {...p} />
    </div>
  )
}

export function FSelect({ label, children, ...p }) {
  const [f, setF] = useState(false)
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={{ fontSize: 13, fontWeight: 600, color: C.mid, marginBottom: 6 }}>{label}</div>}
      <select onFocus={() => setF(true)} onBlur={() => setF(false)}
        style={{ width: '100%', background: '#fff', border: `2px solid ${f ? C.blue : C.border}`, borderRadius: 10, padding: '11px 14px', fontSize: 14, color: C.dark, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
        {...p}>{children}</select>
    </div>
  )
}

export function FTextarea({ label, style, ...p }) {
  const [f, setF] = useState(false)
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={{ fontSize: 13, fontWeight: 600, color: C.mid, marginBottom: 6 }}>{label}</div>}
      <textarea onFocus={() => setF(true)} onBlur={() => setF(false)}
        style={{ width: '100%', background: '#fff', border: `2px solid ${f ? C.blue : C.border}`, borderRadius: 10, padding: '11px 14px', fontSize: 14, color: C.dark, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical', minHeight: 90, ...style }}
        {...p} />
    </div>
  )
}

export function Btn({ children, v = 'blue', disabled, onClick, style, small }) {
  const [hov, setHov] = useState(false)
  const vs = {
    blue:    { background: hov ? C.blueDark  : C.blue,   color: '#fff', border: 'none' },
    green:   { background: hov ? '#15803d'   : C.green,  color: '#fff', border: 'none' },
    red:     { background: hov ? '#b91c1c'   : C.red,    color: '#fff', border: 'none' },
    amber:   { background: hov ? '#b45309'   : C.amber,  color: '#fff', border: 'none' },
    teal:    { background: hov ? '#0f766e'   : C.teal,   color: '#fff', border: 'none' },
    purple:  { background: hov ? '#6d28d9'   : C.purple, color: '#fff', border: 'none' },
    outline: { background: hov ? C.borderLight : '#fff', color: C.mid,  border: `2px solid ${C.border}` },
    ghost:   { background: 'transparent',                color: C.blue, border: 'none' },
  }
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ width: '100%', padding: small ? '8px 14px' : '12px', borderRadius: 10, fontSize: small ? 13 : 14, fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: disabled ? 0.35 : 1, transition: 'all 0.15s', ...vs[v], ...style }}>
      {children}
    </button>
  )
}

export function Card({ children, style }) {
  return <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, marginBottom: 14, boxShadow: '0 1px 6px rgba(0,0,0,0.05)', ...style }}>{children}</div>
}

export function SL({ children, color }) {
  return <div style={{ fontSize: 11, fontWeight: 800, color: color || C.blue, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 12 }}>{children}</div>
}

export function Bdg({ children, v = 'blue' }) {
  const m = {
    blue:   { bg: C.blueLight,   c: C.blue,   bd: C.blueBorder   },
    green:  { bg: C.greenBadge,  c: C.green,  bd: C.greenBorder  },
    teal:   { bg: C.tealLight,   c: C.teal,   bd: C.tealBorder   },
    amber:  { bg: C.amberLight,  c: C.amber,  bd: C.amberBorder  },
    red:    { bg: C.redLight,    c: C.red,    bd: C.redBorder    },
    purple: { bg: C.purpleLight, c: C.purple, bd: C.purpleBorder },
    navy:   { bg: C.blueLight,   c: C.navy,   bd: C.blueBorder   },
    gold:   { bg: C.goldLight,   c: C.amber,  bd: C.goldBorder   },
  }
  const s = m[v] || m.blue
  return <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, fontWeight: 700, background: s.bg, color: s.c, border: `1px solid ${s.bd}`, whiteSpace: 'nowrap' }}>{children}</span>
}

export function Stat({ label, value, color, icon, sub }) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 13, color: C.mid, marginTop: 4 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: C.light, marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  )
}

export function StatusMsg({ s }) {
  if (!s?.msg) return null
  const m = {
    loading: { bg: C.amberLight,  bd: C.amberBorder,  c: C.amber },
    success: { bg: C.greenLight,  bd: C.greenBorder,  c: C.green },
    error:   { bg: C.redLight,    bd: C.redBorder,    c: C.red   },
  }
  const x = m[s.type] || m.error
  return <div style={{ background: x.bg, border: `1.5px solid ${x.bd}`, color: x.c, borderRadius: 10, padding: '11px 14px', fontSize: 14, marginTop: 10, fontWeight: 600 }}>{s.type === 'loading' && '⟳ '}{s.msg}</div>
}

export function Modal({ title, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20, backdropFilter: 'blur(4px)' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 28, maxWidth: 460, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ fontSize: 17, fontWeight: 800, color: C.dark, marginBottom: 16 }}>{title}</div>
        {children}
      </div>
    </div>
  )
}

export function LineGraph({ data, color }) {
  const col = color || C.green
  if (!data?.length || data.every(d => d.value === 0))
    return <div style={{ textAlign: 'center', color: C.light, padding: 24, fontSize: 13 }}>No data yet</div>
  const max = Math.max(...data.map(d => d.value), 1)
  const W = 320, H = 100, pad = 16
  const pts = data.map((d, i) => ({
    x: pad + (i / (data.length - 1 || 1)) * (W - 2 * pad),
    y: H - pad - (d.value / max) * (H - 2 * pad),
    ...d
  }))
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const area = `${path} L${pts[pts.length-1].x},${H} L${pts[0].x},${H} Z`
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={col} stopOpacity="0.15" />
          <stop offset="100%" stopColor={col} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#grad)" />
      <path d={path} fill="none" stroke={col} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={4} fill="#fff" stroke={col} strokeWidth={2} />
          <text x={p.x} y={H + 2} textAnchor="middle" fontSize={9} fill={C.light}>{p.label}</text>
          {p.value > 0 && <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize={9} fill={col} fontWeight="700">{p.value.toLocaleString()}</text>}
        </g>
      ))}
    </svg>
  )
}

export function BarChart({ data, color }) {
  const col = color || C.blue
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 100 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          {d.value > 0 && <div style={{ fontSize: 10, color: C.mid, fontWeight: 600 }}>{d.value}</div>}
          <div style={{ width: '100%', background: col, borderRadius: '4px 4px 0 0', height: `${(d.value / max) * 75}px`, minHeight: d.value > 0 ? 4 : 2, opacity: 0.85 }} />
          <div style={{ fontSize: 10, color: C.light, textAlign: 'center' }}>{d.label}</div>
        </div>
      ))}
    </div>
  )
}

export function DonutChart({ slices }) {
  const total = slices.reduce((s, x) => s + x.value, 0)
  if (total === 0) return <div style={{ textAlign: 'center', color: C.light, padding: 20, fontSize: 13 }}>No data yet</div>
  let cum = 0
  const r = 58, inner = 34, cx = 75, cy = 75
  const paths = slices.filter(s => s.value > 0).map(s => {
    const pct = s.value / total
    const a1  = cum * 2 * Math.PI - Math.PI / 2
    cum += pct
    const a2  = cum * 2 * Math.PI - Math.PI / 2
    const lg  = pct > 0.5 ? 1 : 0
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1)
    const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2)
    const ix1 = cx + inner * Math.cos(a1), iy1 = cy + inner * Math.sin(a1)
    const ix2 = cx + inner * Math.cos(a2), iy2 = cy + inner * Math.sin(a2)
    return { d: `M${x1},${y1} A${r},${r} 0 ${lg},1 ${x2},${y2} L${ix2},${iy2} A${inner},${inner} 0 ${lg},0 ${ix1},${iy1} Z`, ...s, pct: Math.round(pct * 100) }
  })
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <svg width={150} height={150} viewBox="0 0 150 150" style={{ flexShrink: 0 }}>
        {paths.map((p, i) => <path key={i} d={p.d} fill={p.color} />)}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize={10} fill={C.mid}>Total</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize={11} fill={C.dark} fontWeight="800">PKR {total.toLocaleString()}</text>
      </svg>
      <div style={{ flex: 1 }}>
        {paths.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: p.color, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{p.label}</div>
              <div style={{ fontSize: 11, color: C.mid }}>PKR {p.value.toLocaleString()} · {p.pct}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
