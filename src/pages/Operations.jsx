import { useState } from 'react'
import { C, MB_CATS } from '../utils/constants.js'
import { Card, SL, Bdg, Btn, FInput, FSelect, StatusMsg, Modal } from '../components/UI.jsx'

export default function Operations({ user, products, setProducts, setActivityLog, t }) {
  const empty = { name:'', brand:'', category:'', sellPrice:'', wholesale:'', delivery:'', flyer:'' }
  const [form,       setForm]       = useState(empty)
  const [status,     setStatus]     = useState(null)
  const [showCatalog,setShowCatalog]= useState(false)
  const [confirmDel, setConfirmDel] = useState(null)
  const set = k => e => setForm(f => ({...f, [k]:e.target.value}))
  const ok = form.name && form.brand && form.category && form.sellPrice

  const save = () => {
    if (!ok) { setStatus({ type:'error', msg:'Name, brand, category and sell price are required.' }); return }
    const entry = {
      id: Date.now(), name:form.name.trim(), brand:form.brand.trim(),
      category: MB_CATS.find(c=>c.v===form.category)?.en || form.category,
      sellPrice:form.sellPrice, wholesale:form.wholesale||'0',
      delivery:form.delivery||'0', flyer:form.flyer||'0',
      loss:'0', returnAmt:'0', status:'draft',
      addedAt:new Date().toLocaleTimeString(), addedBy:user.name,
    }
    setProducts(p => [...p, entry])
    setActivityLog(a => [{id:Date.now(), who:user.name, what:`Added product "${entry.name}"`, when:new Date().toLocaleString(), type:'product_add'}, ...a])
    setStatus({ type:'success', msg:`"${entry.name}" saved to catalog and added to Pipeline!` })
    setForm(empty)
    setTimeout(() => setStatus(null), 3000)
  }

  const doDelete = id => {
    const p = products.find(x => x.id===id)
    setProducts(prev => prev.filter(x => x.id!==id))
    setActivityLog(a => [{id:Date.now(), who:user.name, what:`Deleted product "${p?.name}"`, when:new Date().toLocaleString(), type:'product_delete'}, ...a])
    setConfirmDel(null)
  }

  const estProfit = form.sellPrice && form.wholesale
    ? parseInt(form.sellPrice||0) - parseInt(form.wholesale||0) - parseInt(form.delivery||0) - parseInt(form.flyer||0)
    : null

  return (
    <div>
      {confirmDel && (
        <Modal title="Delete this product?">
          <div style={{ fontSize:14, color:C.mid, marginBottom:16 }}>This cannot be undone.</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <Btn v="outline" onClick={() => setConfirmDel(null)}>Cancel</Btn>
            <Btn v="red" onClick={() => doDelete(confirmDel)}>Yes, Delete</Btn>
          </div>
        </Modal>
      )}

      <div style={{ fontSize:22, fontWeight:900, color:C.dark, marginBottom:4 }}>{t.operations}</div>
      <div style={{ background:C.blueLight, border:`1px solid ${C.blueBorder}`, borderRadius:12, padding:'14px 18px', marginBottom:16, fontSize:13, color:C.blue, fontWeight:600 }}>
        💡 Add products here to build your catalog. Each product goes into the Pipeline for review before deployment to your website. Record losses and returns from the Dashboard.
      </div>

      <Card>
        <SL>{t.addProduct}</SL>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <FInput label={`${t.productName} *`} value={form.name}  onChange={set('name')}  placeholder="e.g. Samsung Galaxy A15" />
          <FInput label={`${t.brand} *`}       value={form.brand} onChange={set('brand')} placeholder="e.g. Samsung"            />
        </div>
        <FSelect label={`${t.category} *`} value={form.category} onChange={e => setForm(f=>({...f,category:e.target.value}))}>
          <option value="">Select a category...</option>
          {MB_CATS.map(c => <option key={c.v} value={c.v}>{c.en}</option>)}
        </FSelect>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <FInput label={`${t.sellPrice} *`} type="number" value={form.sellPrice} onChange={set('sellPrice')} placeholder="45000" />
          <FInput label={t.wholesale}         type="number" value={form.wholesale} onChange={set('wholesale')} placeholder="40000" />
          <FInput label={t.delivery}          type="number" value={form.delivery}  onChange={set('delivery')}  placeholder="200"   />
          <FInput label={t.flyer}             type="number" value={form.flyer}     onChange={set('flyer')}     placeholder="100"   />
        </div>
        {estProfit !== null && (
          <div style={{ background:estProfit>=0?C.greenLight:C.redLight, border:`1px solid ${estProfit>=0?C.greenBorder:C.redBorder}`, borderRadius:10, padding:'10px 14px', fontSize:14, color:estProfit>=0?C.green:C.red, fontWeight:700, marginBottom:8 }}>
            Est. Profit per unit: PKR {estProfit.toLocaleString()} {estProfit<0?'⚠️ Selling below cost!':'✓'}
          </div>
        )}
        <Btn v="blue" disabled={!ok} onClick={save}>{t.save} to Catalog</Btn>
        <StatusMsg s={status} />
      </Card>

      <Btn v="outline" onClick={() => setShowCatalog(s => !s)}>
        {showCatalog ? '▲ Hide Catalog' : `▼ View Catalog (${products.length} products)`}
      </Btn>

      {showCatalog && (
        <div style={{ marginTop:16 }}>
          <SL color={C.green}>Product Catalog — {products.length} items</SL>
          {products.length === 0 && <div style={{ textAlign:'center', color:C.light, padding:28 }}>No products yet.</div>}
          {products.slice().reverse().map(p => {
            const net = parseInt(p.sellPrice||0) - parseInt(p.wholesale||0) - parseInt(p.delivery||0) - parseInt(p.flyer||0) - parseInt(p.loss||0) - parseInt(p.returnAmt||0)
            return (
              <div key={p.id} style={{ background:'#fff', border:`1.5px solid ${C.greenBorder}`, borderRadius:12, padding:'15px 18px', marginBottom:10 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:16, fontWeight:700, color:C.dark }}>{p.name}</div>
                    <div style={{ fontSize:13, color:C.mid, marginTop:2 }}>{p.brand} · {p.category}</div>
                    <div style={{ display:'flex', gap:8, marginTop:8, flexWrap:'wrap' }}>
                      <Bdg v="green">Sell: PKR {p.sellPrice}</Bdg>
                      {p.wholesale!=='0' && <Bdg v="blue">WS: {p.wholesale}</Bdg>}
                      {p.delivery!=='0'  && <Bdg v="teal">🚚 {p.delivery}</Bdg>}
                      {p.flyer!=='0'     && <Bdg v="purple">📄 {p.flyer}</Bdg>}
                      {p.loss!=='0'      && <Bdg v="red">📉 Loss: {p.loss}</Bdg>}
                      {p.returnAmt!=='0' && <Bdg v="red">↩ Return: {p.returnAmt}</Bdg>}
                      <Bdg v={net>=0?'teal':'red'}>Net: PKR {net.toLocaleString()}</Bdg>
                    </div>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:6, alignItems:'flex-end', marginLeft:12 }}>
                    <Bdg v={p.status==='deployed'?'green':p.status==='reviewed'?'teal':'amber'}>{p.status}</Bdg>
                    <button onClick={() => setConfirmDel(p.id)} style={{ fontSize:12, color:C.red, background:C.redLight, border:`1px solid ${C.redBorder}`, borderRadius:7, padding:'4px 10px', cursor:'pointer', fontWeight:700 }}>🗑 Delete</button>
                  </div>
                </div>
                <div style={{ fontSize:11, color:C.light, marginTop:8, borderTop:`1px solid ${C.border}`, paddingTop:7 }}>Added by {p.addedBy} at {p.addedAt}</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
