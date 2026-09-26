import { useState } from 'react'
import { C, WEEKS } from '../utils/constants.js'
import { Card, SL, Stat, Bdg, LineGraph, Modal, FSelect, FInput, Btn, StatusMsg } from '../components/UI.jsx'

function LossReturnModal({ onClose, products, setProducts, setActivityLog, user, t }) {
  const [mode, setMode] = useState(null)
  const [form, setForm] = useState({ productId: '', amount: '', note: '' })
  const [status, setStatus] = useState(null)

  const handleProductChange = e => {
    const id  = e.target.value
    const sel = products.find(p => p.id === parseInt(id))
    if (sel) {
      const cost = parseInt(sel.wholesale||0) + parseInt(sel.delivery||0) + parseInt(sel.flyer||0)
      setForm(f => ({ ...f, productId: id, amount: cost > 0 ? cost.toString() : sel.sellPrice || '' }))
    } else setForm(f => ({ ...f, productId: id, amount: '' }))
  }

  const sel = products.find(p => p.id === parseInt(form.productId))

  const save = () => {
    if (!form.productId || !form.amount) { setStatus({ type:'error', msg:'Select a product and enter amount.' }); return }
    const field = mode === 'loss' ? 'loss' : 'returnAmt'
    setProducts(prev => prev.map(p => p.id === parseInt(form.productId) ? { ...p, [field]: (parseInt(p[field]||0) + parseInt(form.amount)).toString() } : p))
    setActivityLog(a => [{ id:Date.now(), who:user.name, what:`${mode==='loss'?'Loss':'Return'} of PKR ${form.amount} for "${sel?.name||'product'}"`, when:new Date().toLocaleString(), type:mode }, ...a])
    setStatus({ type:'success', msg:`PKR ${form.amount} ${mode} recorded!` })
    setTimeout(() => { setStatus(null); setForm({ productId:'', amount:'', note:'' }); setMode(null) }, 2000)
  }

  return (
    <Modal title={mode ? `Record ${mode === 'loss' ? 'Loss' : 'Return'}` : 'What are you recording?'}>
      {!mode && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {[['loss','📉','Loss by Product',C.red,'Damaged, stolen, or sold below cost'],
            ['return','↩️','Return Amount',C.amber,'Customer returned item']
          ].map(([m,icon,label,color,sub]) => (
            <div key={m} onClick={() => setMode(m)}
              style={{ background: color+'0d', border:`2px solid ${color}33`, borderRadius:12, padding:20, textAlign:'center', cursor:'pointer' }}>
              <div style={{ fontSize:28, marginBottom:6 }}>{icon}</div>
              <div style={{ fontSize:14, fontWeight:700, color }}>{label}</div>
              <div style={{ fontSize:12, color:C.mid, marginTop:4 }}>{sub}</div>
            </div>
          ))}
        </div>
      )}
      {mode && <>
        <div style={{ background:mode==='loss'?C.redLight:C.amberLight, border:`1px solid ${mode==='loss'?C.redBorder:C.amberBorder}`, borderRadius:10, padding:'10px 14px', marginBottom:14, fontSize:13, color:mode==='loss'?C.red:C.amber, lineHeight:1.6 }}>
          💡 Auto-filled with total cost (Wholesale + Delivery + Flyer). Edit if the loss is partial.
        </div>
        <FSelect label="Select Product *" value={form.productId} onChange={handleProductChange}>
          <option value="">Choose product...</option>
          {products.map(p => <option key={p.id} value={p.id}>{p.name} — {p.brand} (WS: PKR {p.wholesale})</option>)}
        </FSelect>
        {sel && (
          <div style={{ background:C.blueLight, border:`1px solid ${C.blueBorder}`, borderRadius:10, padding:'12px 14px', marginBottom:14, fontSize:13, color:C.blue }}>
            <strong>{sel.name}</strong>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:4, marginTop:6 }}>
              <span>Sell: PKR {sel.sellPrice}</span>
              <span>WS: PKR {sel.wholesale}</span>
              <span>Delivery: PKR {sel.delivery||0}</span>
              <span>Flyer: PKR {sel.flyer||0}</span>
            </div>
            <div style={{ marginTop:8, fontWeight:700 }}>Total Cost: PKR {(parseInt(sel.wholesale||0)+parseInt(sel.delivery||0)+parseInt(sel.flyer||0)).toLocaleString()}</div>
          </div>
        )}
        <FInput label="Amount (PKR) *" type="number" value={form.amount} onChange={e => setForm(f=>({...f,amount:e.target.value}))} placeholder="e.g. 2500" />
        <FInput label="Note (optional)" value={form.note} onChange={e => setForm(f=>({...f,note:e.target.value}))} placeholder="e.g. Screen cracked during delivery" />
        <StatusMsg s={status} />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:8 }}>
          <Btn v="outline" onClick={() => { setMode(null); setForm({ productId:'', amount:'', note:'' }) }}>← Back</Btn>
          <Btn v={mode==='loss'?'red':'amber'} onClick={save}>Save {mode==='loss'?'Loss':'Return'}</Btn>
        </div>
      </>}
      <Btn v="outline" onClick={onClose} style={{ marginTop:10 }}>Close</Btn>
    </Modal>
  )
}

export default function Dashboard({ user, setTab, products, setProducts, tasks, orders, activityLog, setActivityLog, isAdmin, t }) {
  const [showLR, setShowLR] = useState(false)

  const total    = products.length
  const pending  = products.filter(p => p.status === 'draft').length
  const deployed = products.filter(p => p.status === 'deployed').length
  const pendingT = tasks.filter(tk => tk.status === 'pending').length
  const totalRev = orders.reduce((s,o) => s + o.totalSell, 0)
  const totalProfit = orders.reduce((s,o) => s + o.orderProfit, 0)

  const weeklyRev = WEEKS.map(w => ({
    label: w.replace('Week ','W'),
    value: orders.filter(o => o.week === w).reduce((s,o) => s + o.totalSell, 0)
  }))

  return (
    <div>
      {showLR && <LossReturnModal onClose={() => setShowLR(false)} products={products} setProducts={setProducts} setActivityLog={setActivityLog} user={user} t={t} />}

      <div style={{ fontSize:22, fontWeight:900, color:C.dark, marginBottom:2 }}>{t.dashboard}</div>
      <div style={{ fontSize:13, color:C.light, marginBottom:20 }}>
        {new Date().toLocaleDateString('en-GB',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}
      </div>

      {/* Loss / Return banner */}
      <div style={{ background:`linear-gradient(135deg,#fff5f5,#fffbeb)`, border:`1.5px solid ${C.redBorder}`, borderRadius:14, padding:'14px 20px', marginBottom:16, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontSize:14, fontWeight:800, color:C.red, marginBottom:2 }}>📉 {t.lossReturn}</div>
          <div style={{ fontSize:13, color:C.mid }}>{t.lossReturnSub}</div>
        </div>
        <Btn v="red" onClick={() => setShowLR(true)} style={{ width:'auto', padding:'9px 20px' }}>{t.reportNow}</Btn>
      </div>

      {/* KPI cards */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
        <Stat label={t.totalProducts} value={total}    color={C.blue}  icon="📦" />
        <Stat label={t.pendingReview} value={pending}  color={C.amber} icon="⏳" />
        <Stat label={t.deployed}      value={deployed} color={C.green} icon="🚀" />
        <Stat label={t.pendingTasks}  value={pendingT} color={C.teal}  icon="✅" />
      </div>

      {/* Revenue graph — admin+ only */}
      {isAdmin && (
        <Card>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
            <SL color={C.green}>{t.weeklyRevenue} — {orders.length} orders</SL>
            <div style={{ display:'flex', gap:8 }}>
              <Bdg v="green">Revenue: PKR {totalRev.toLocaleString()}</Bdg>
              <Bdg v={totalProfit>=0?'teal':'red'}>Profit: PKR {totalProfit.toLocaleString()}</Bdg>
            </div>
          </div>
          <LineGraph data={weeklyRev} color={C.green} />
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:10 }}>
            <Bdg v="red">{t.low}: PKR {Math.min(...weeklyRev.map(w=>w.value)).toLocaleString()}</Bdg>
            <Bdg v="green">{t.high}: PKR {Math.max(...weeklyRev.map(w=>w.value)).toLocaleString()}</Bdg>
          </div>
        </Card>
      )}

      {/* Quick actions */}
      <Card>
        <SL>{t.quickActions}</SL>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          <Btn v="blue"  onClick={() => setTab('orders')}>🛒 {t.newOrder}</Btn>
          <Btn v="teal"  onClick={() => setTab('tasks')}>✅ {t.viewTasks}</Btn>
          {isAdmin && <>
            <Btn v="amber"  onClick={() => setTab('pipeline')}>🔄 {t.pipeline}</Btn>
            <Btn v="purple" onClick={() => setTab('marketing')}>📣 {t.marketing}</Btn>
          </>}
        </div>
      </Card>

      {/* Activity log */}
      {activityLog.length > 0 && (
        <Card>
          <SL color={C.teal}>{t.recentActivity}</SL>
          {activityLog.slice(0,8).map((a,i) => (
            <div key={i} style={{ padding:'10px 0', borderBottom: i < 7 ? `1px solid ${C.border}` : 'none' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div>
                  <span style={{ fontWeight:700, color:C.dark, fontSize:13 }}>{a.who}</span>
                  <span style={{ fontSize:13, color:C.mid }}> — {a.what}</span>
                  {a.note && <div style={{ fontSize:12, color:C.light, marginTop:2 }}>↳ {a.note}</div>}
                </div>
                <div style={{ fontSize:11, color:C.lighter, flexShrink:0, marginLeft:12 }}>{a.when}</div>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  )
}
