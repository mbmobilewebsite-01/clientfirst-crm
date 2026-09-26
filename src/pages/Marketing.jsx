import { useState } from 'react'
import { C, PLATFORMS, WEEKS } from '../utils/constants.js'
import { Card, SL, Bdg, Btn, FInput, FSelect, FTextarea, BarChart, StatusMsg } from '../components/UI.jsx'

export default function Marketing({ ads, setAds, t }) {
  const [view,   setView]   = useState(null)
  const [form,   setForm]   = useState({ platform:'', product:'', area:'', spend:'', week:'Week 1' })
  const [posts,  setPosts]  = useState([])
  const [smForm, setSmForm] = useState({ platform:'', content:'', date:'' })
  const [status, setStatus] = useState(null)
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}))

  const saveAd = () => {
    if (!form.platform||!form.spend) { setStatus({type:'error',msg:'Platform and spend required.'}); return }
    setAds(a => [...a, {id:Date.now(),...form, at:new Date().toLocaleDateString()}])
    setStatus({type:'success',msg:'Ad spend recorded!'})
    setForm({ platform:'', product:'', area:'', spend:'', week:'Week 1' })
    setTimeout(() => setStatus(null), 2500)
  }

  const totalSpend = ads.reduce((s,a)=>s+parseInt(a.spend||0),0)
  const byWeek = WEEKS.map(w=>({ label:w.replace('Week ','W'), value:ads.filter(a=>a.week===w).reduce((s,a)=>s+parseInt(a.spend||0),0) }))

  if (!view) return (
    <div>
      <div style={{ fontSize:22, fontWeight:900, color:C.dark, marginBottom:18 }}>{t.marketing}</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:16 }}>
        <div onClick={()=>setView('social')} style={{ background:'#fff', border:`2px solid ${C.border}`, borderRadius:16, padding:24, cursor:'pointer', textAlign:'center', transition:'all 0.15s' }}>
          <div style={{ fontSize:32, marginBottom:8 }}>📱</div>
          <div style={{ fontSize:16, fontWeight:700, color:C.dark }}>Social Media</div>
          <div style={{ fontSize:12, color:C.mid, marginTop:4 }}>TikTok, Instagram, Facebook...</div>
          <div style={{ marginTop:10 }}><Bdg v="purple">{posts.length} posts</Bdg></div>
        </div>
        <div onClick={()=>setView('ads')} style={{ background:'#fff', border:`2px solid ${C.border}`, borderRadius:16, padding:24, cursor:'pointer', textAlign:'center', transition:'all 0.15s' }}>
          <div style={{ fontSize:32, marginBottom:8 }}>📊</div>
          <div style={{ fontSize:16, fontWeight:700, color:C.dark }}>Paid Ads</div>
          <div style={{ fontSize:12, color:C.mid, marginTop:4 }}>Track ad spend by product</div>
          <div style={{ marginTop:10 }}><Bdg v="red">PKR {totalSpend.toLocaleString()} spent</Bdg></div>
        </div>
      </div>
      {ads.length>0 && <Card><SL color={C.purple}>Weekly Ad Spend</SL><BarChart data={byWeek} color={C.purple} /><div style={{ textAlign:'right', marginTop:8 }}><Bdg v="purple">Total: PKR {totalSpend.toLocaleString()}</Bdg></div></Card>}
    </div>
  )

  if (view==='social') return (
    <div>
      <button onClick={()=>setView(null)} style={{ background:'none', border:'none', color:C.blue, fontWeight:700, fontSize:14, cursor:'pointer', marginBottom:16 }}>← Back</button>
      <div style={{ fontSize:20, fontWeight:900, color:C.dark, marginBottom:16 }}>Social Media</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
        {PLATFORMS.map(pl=>(
          <div key={pl} style={{ background:'#fff', border:`1.5px solid ${C.border}`, borderRadius:12, padding:'12px 16px', display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:18 }}>{pl==='TikTok'?'🎵':pl==='Instagram'?'📸':pl==='Facebook'?'👥':pl==='YouTube'?'▶️':pl==='WhatsApp'?'💬':'📣'}</span>
            <div style={{ fontSize:14, fontWeight:600, color:C.dark, flex:1 }}>{pl}</div>
            <Bdg v="blue">{posts.filter(p=>p.platform===pl).length}</Bdg>
          </div>
        ))}
      </div>
      <Card>
        <SL>Add Post</SL>
        <FSelect label="Platform" value={smForm.platform} onChange={e=>setSmForm(s=>({...s,platform:e.target.value}))}>
          <option value="">Select...</option>{PLATFORMS.map(p=><option key={p}>{p}</option>)}
        </FSelect>
        <FTextarea label="Content / Caption" value={smForm.content} onChange={e=>setSmForm(s=>({...s,content:e.target.value}))} style={{ minHeight:80 }} />
        <FInput label="Post Date" type="date" value={smForm.date} onChange={e=>setSmForm(s=>({...s,date:e.target.value}))} />
        <Btn v="purple" onClick={()=>{ if (!smForm.platform) return; setPosts(p=>[...p,{...smForm,id:Date.now()}]); setSmForm({platform:'',content:'',date:''}) }}>Add Post</Btn>
      </Card>
      {posts.length>0 && <Card><SL color={C.purple}>Post History — {posts.length}</SL>{posts.map((p,i)=><div key={i} style={{ padding:'10px 0', borderBottom:`1px solid ${C.border}` }}><div style={{ display:'flex', justifyContent:'space-between' }}><Bdg v="purple">{p.platform}</Bdg><span style={{ fontSize:12, color:C.light }}>{p.date}</span></div><div style={{ fontSize:13, color:C.mid, marginTop:6 }}>{p.content}</div></div>)}</Card>}
    </div>
  )

  return (
    <div>
      <button onClick={()=>setView(null)} style={{ background:'none', border:'none', color:C.blue, fontWeight:700, fontSize:14, cursor:'pointer', marginBottom:16 }}>← Back</button>
      <div style={{ fontSize:20, fontWeight:900, color:C.dark, marginBottom:16 }}>Paid Ads Tracker</div>
      <Card>
        <SL>Add Ad Spend</SL>
        <FSelect label="Platform *" value={form.platform} onChange={set('platform')}>
          <option value="">Select...</option>{['Facebook','Instagram','TikTok','Google'].map(p=><option key={p}>{p}</option>)}
        </FSelect>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <FInput label="Product Advertised" value={form.product} onChange={set('product')} placeholder="e.g. Samsung A15" />
          <FInput label="Target Area"        value={form.area}    onChange={set('area')}    placeholder="e.g. Rawalakot"   />
          <FInput label="Spend (PKR) *" type="number" value={form.spend} onChange={set('spend')} placeholder="e.g. 1500" />
          <FSelect label="Week" value={form.week} onChange={set('week')}>{WEEKS.map(w=><option key={w}>{w}</option>)}</FSelect>
        </div>
        <Btn v="blue" onClick={saveAd}>Add Ad Spend</Btn>
        <StatusMsg s={status} />
      </Card>
      {ads.length>0 && <Card><SL color={C.purple}>Ad History — Total: PKR {totalSpend.toLocaleString()}</SL>{ads.map((a,i)=><div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:`1px solid ${C.border}` }}><div><div style={{ fontSize:14, fontWeight:600, color:C.dark }}>{a.platform} — {a.product||'General'}</div><div style={{ fontSize:12, color:C.mid }}>{a.area} · {a.week}</div></div><Bdg v="purple">PKR {a.spend}</Bdg></div>)}</Card>}
    </div>
  )
}
