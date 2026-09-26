import { C } from '../utils/constants.js'
import { Btn, Bdg } from '../components/UI.jsx'

export default function Pipeline({ user, products, setProducts, setActivityLog, t }) {
  const upd = (id, s) => {
    const p = products.find(x => x.id===id)
    setProducts(prev => prev.map(x => x.id===id ? {...x, status:s} : x))
    setActivityLog(a => [{id:Date.now(), who:user.name, what:`Moved "${p?.name}" to ${s}`, when:new Date().toLocaleString(), type:'pipeline'}, ...a])
  }
  const rm = id => {
    const p = products.find(x => x.id===id)
    setProducts(prev => prev.filter(x => x.id!==id))
    setActivityLog(a => [{id:Date.now(), who:user.name, what:`Rejected "${p?.name}"`, when:new Date().toLocaleString(), type:'pipeline'}, ...a])
  }
  const cols = ['draft','reviewed','deployed']
  const meta = {
    draft:    { label:t.draft,         color:C.amber,  icon:'📝', hint:'Newly added — needs review'  },
    reviewed: { label:t.reviewed,      color:C.teal,   icon:'✅', hint:'Approved — ready to deploy'  },
    deployed: { label:t.deployedLabel, color:C.green,  icon:'🚀', hint:'Live on website'              },
  }
  return (
    <div>
      <div style={{ fontSize:22, fontWeight:900, color:C.dark, marginBottom:4 }}>{t.pipeline}</div>
      <div style={{ fontSize:13, color:C.light, marginBottom:18 }}>Manage products from draft through to deployment on your website.</div>
      <div style={{ background:C.blueLight, border:`1px solid ${C.blueBorder}`, borderRadius:12, padding:'12px 16px', marginBottom:18, fontSize:13, color:C.blue, fontWeight:600 }}>
        📌 Click "Deploy to Website" when a product is ready. The Dashboard deployed counter updates automatically.
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14 }}>
        {cols.map(col => {
          const items = products.filter(p => p.status===col)
          const m = meta[col]
          return (
            <div key={col} style={{ background:C.page, border:`1.5px solid ${C.border}`, borderRadius:14, padding:14 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                <span>{m.icon}</span>
                <span style={{ fontSize:12, fontWeight:800, color:m.color, textTransform:'uppercase', letterSpacing:'0.5px' }}>{m.label}</span>
                <span style={{ marginLeft:'auto', background:m.color+'22', color:m.color, borderRadius:20, padding:'2px 9px', fontSize:12, fontWeight:700 }}>{items.length}</span>
              </div>
              <div style={{ fontSize:11, color:C.light, marginBottom:12 }}>{m.hint}</div>
              {items.length===0 && <div style={{ fontSize:13, color:C.lighter, textAlign:'center', padding:'20px 0' }}>Empty</div>}
              {items.map(p => (
                <div key={p.id} style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:10, padding:12, marginBottom:8 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:C.dark, marginBottom:2 }}>{p.name}</div>
                  <div style={{ fontSize:12, color:C.mid, marginBottom:8 }}>{p.brand} · PKR {p.sellPrice}</div>
                  <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                    {col==='draft'    && <><Btn v="teal"  small onClick={() => upd(p.id,'reviewed')}>✅ {t.approve}</Btn><Btn v="red" small onClick={() => rm(p.id)}>✗ {t.reject}</Btn></>}
                    {col==='reviewed' && <><Btn v="green" small onClick={() => upd(p.id,'deployed')}>🚀 {t.deploy}</Btn><Btn v="outline" small onClick={() => upd(p.id,'draft')}>← Back to Draft</Btn></>}
                    {col==='deployed' && <><Bdg v="green">🚀 {t.deployedLabel}</Bdg><Btn v="outline" small onClick={() => upd(p.id,'reviewed')} style={{ marginTop:6 }}>↩ Undeploy</Btn></>}
                  </div>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
