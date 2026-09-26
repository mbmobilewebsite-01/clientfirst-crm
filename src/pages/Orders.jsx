import { useState } from 'react'
import { C, WEEKS } from '../utils/constants.js'
import { Card, SL, Bdg, Btn, FInput, FSelect } from '../components/UI.jsx'

// Real person at PC — Unsplash professional warehouse/office scenes
const STEP_IMAGES = {
  1: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=700&q=80",
  2: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700&q=80",
  3: "https://images.unsplash.com/photo-1556742208-999815fca738?w=700&q=80",
  4: "https://images.unsplash.com/photo-1609743522471-83c84ce23e32?w=700&q=80",
}
const STEP_CAPTIONS = {
  1: "New order received — entering customer details",
  2: "Checking inventory — selecting the right product",
  3: "Processing payment — confirming method with customer",
  4: "Packing & dispatching — order on its way",
}

function StepScene({ step }) {
  return (
    <div style={{ borderRadius:14, overflow:'hidden', marginBottom:20, position:'relative', height:180, boxShadow:'0 4px 16px rgba(0,0,0,0.1)' }}>
      <img src={STEP_IMAGES[step]} alt={STEP_CAPTIONS[step]}
        style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center' }} />
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(15,23,42,0.75) 0%, transparent 55%)' }} />
      <div style={{ position:'absolute', bottom:14, left:16, right:16 }}>
        <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.7)', letterSpacing:'1px', textTransform:'uppercase' }}>Step {step} of 4</div>
        <div style={{ fontSize:14, fontWeight:700, color:'#fff', marginTop:2 }}>{STEP_CAPTIONS[step]}</div>
      </div>
      {/* Progress dots */}
      <div style={{ position:'absolute', top:12, right:14, display:'flex', gap:5 }}>
        {[1,2,3,4].map(s => (
          <div key={s} style={{ width: s===step?20:8, height:8, borderRadius:4, background: s<=step?'#fff':'rgba(255,255,255,0.3)', transition:'all 0.3s' }} />
        ))}
      </div>
    </div>
  )
}

export default function Orders({ user, products, orders, setOrders, setPayments, setActivityLog, t }) {
  const [step,  setStep]  = useState(1)
  const [order, setOrder] = useState({ customerName:'', area:'', phone:'', productId:'', qty:'1', paymentMethod:'cod', note:'', week:'Week 1' })
  const [done,  setDone]  = useState(false)
  const [search, setSearch] = useState('')
  const set = k => e => setOrder(o => ({ ...o, [k]: e.target.value }))

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  )

  const sel       = products.find(p => p.id === parseInt(order.productId))
  const qty       = parseInt(order.qty || 1)
  const sellPrice = parseInt(sel?.sellPrice || 0)
  const wholesale = parseInt(sel?.wholesale || 0)
  const delivery  = parseInt(sel?.delivery  || 0)
  const flyer     = parseInt(sel?.flyer     || 0)
  const totalSell      = sellPrice * qty
  const totalWholesale = wholesale * qty
  const totalDelivery  = delivery  * qty
  const totalFlyer     = flyer     * qty
  const orderProfit    = totalSell - totalWholesale - totalDelivery - totalFlyer

  const canNext = {
    1: order.customerName && order.area,
    2: order.productId && order.qty,
    3: order.paymentMethod,
    4: true,
  }

  const methodLabel = { cod: t.cod, easypaisa: t.easypaisa, jazzcash: t.jazzcash }

  const confirmOrder = () => {
    const entry = {
      id: Date.now(),
      customerName: order.customerName, area: order.area, phone: order.phone,
      product: sel?.name, brand: sel?.brand, category: sel?.category,
      qty, sellPrice, wholesale, delivery, flyer,
      totalSell, totalWholesale, totalDelivery, totalFlyer, orderProfit,
      paymentMethod: order.paymentMethod, note: order.note,
      status: 'dispatched', at: new Date().toLocaleString(), by: user.name, week: order.week,
    }
    setOrders(o => [entry, ...o])
    setPayments(p => [...p, { id:Date.now()+1, amount:totalSell.toString(), method:order.paymentMethod, note:`Order: ${sel?.name} ×${qty} — ${order.customerName}`, week:order.week, at:new Date().toLocaleString(), type:'order' }])
    setActivityLog(a => [{ id:Date.now(), who:user.name, what:`Order dispatched: "${sel?.name}" ×${qty} → ${order.customerName}, ${order.area} | Revenue PKR ${totalSell.toLocaleString()} | Profit PKR ${orderProfit.toLocaleString()}`, when:new Date().toLocaleString(), type:'order' }, ...a])
    setDone(true)
  }

  const reset = () => { setStep(1); setOrder({ customerName:'', area:'', phone:'', productId:'', qty:'1', paymentMethod:'cod', note:'', week:'Week 1' }); setDone(false); setSearch('') }

  if (done) return (
    <div>
      <StepScene step={4} />
      <div style={{ textAlign:'center', padding:'16px 0' }}>
        <div style={{ fontSize:26, fontWeight:900, color:C.green, marginBottom:8 }}>{t.orderDispatched} 🎉</div>
        <div style={{ fontSize:14, color:C.mid, marginBottom:16 }}>{sel?.name} × {qty} → {order.customerName}, {order.area}</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, maxWidth:320, margin:'0 auto 20px' }}>
          <div style={{ background:C.greenLight, border:`1px solid ${C.greenBorder}`, borderRadius:10, padding:14 }}>
            <div style={{ fontSize:11, color:C.mid, fontWeight:600 }}>{t.revenue}</div>
            <div style={{ fontSize:20, fontWeight:900, color:C.green }}>PKR {totalSell.toLocaleString()}</div>
          </div>
          <div style={{ background:orderProfit>=0?C.tealLight:C.redLight, border:`1px solid ${orderProfit>=0?C.tealBorder:C.redBorder}`, borderRadius:10, padding:14 }}>
            <div style={{ fontSize:11, color:C.mid, fontWeight:600 }}>{t.orderProfit}</div>
            <div style={{ fontSize:20, fontWeight:900, color:orderProfit>=0?C.teal:C.red }}>PKR {orderProfit.toLocaleString()}</div>
          </div>
        </div>
        <Btn v="blue" onClick={reset} style={{ maxWidth:220, margin:'0 auto' }}>{t.processAnother}</Btn>
      </div>
      {orders.length > 0 && <OrderHistory orders={orders} methodLabel={methodLabel} t={t} />}
    </div>
  )

  return (
    <div>
      <div style={{ fontSize:22, fontWeight:900, color:C.dark, marginBottom:2 }}>{t.orders}</div>
      <div style={{ fontSize:13, color:C.light, marginBottom:16 }}>Follow each step to process a customer order correctly.</div>

      <StepScene step={step} />

      <Card>
        {step === 1 && <>
          <SL>{t.step1}</SL>
          <FInput label={`${t.customerName} *`} value={order.customerName} onChange={set('customerName')} placeholder="e.g. Ahmed Khan" />
          <FInput label={`${t.area} *`}         value={order.area}         onChange={set('area')}         placeholder="e.g. Rawalakot, Islamabad" />
          <FInput label={t.phone}               value={order.phone}        onChange={set('phone')}        placeholder="e.g. 0300-1234567" type="tel" />
        </>}

        {step === 2 && <>
          <SL>{t.step2}</SL>
          {products.length === 0
            ? <div style={{ textAlign:'center', padding:24 }}>
                <div style={{ fontSize:14, color:C.mid, marginBottom:12 }}>No products in catalog yet.</div>
                <div style={{ fontSize:13, color:C.light }}>Add products in Operations tab first, then come back to process orders.</div>
              </div>
            : <>
              {/* Product search */}
              <div style={{ position:'relative', marginBottom:14 }}>
                <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', fontSize:16, color:C.light }}>🔍</span>
                <input value={search} onChange={e => { setSearch(e.target.value); setOrder(o => ({...o, productId:''})) }}
                  placeholder={t.searchProduct}
                  style={{ width:'100%', border:`2px solid ${C.border}`, borderRadius:10, padding:'11px 14px 11px 38px', fontSize:14, outline:'none', boxSizing:'border-box', fontFamily:'inherit', color:C.dark }} />
              </div>
              {/* Product grid */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14, maxHeight:240, overflowY:'auto' }}>
                {filteredProducts.map(p => (
                  <div key={p.id} onClick={() => { setOrder(o => ({...o, productId:p.id.toString()})); setSearch('') }}
                    style={{ padding:'10px 12px', borderRadius:10, border:`2px solid ${order.productId===p.id.toString()?C.blue:C.border}`, background:order.productId===p.id.toString()?C.blueLight:'#fff', cursor:'pointer', transition:'all 0.12s' }}>
                    <div style={{ fontSize:13, fontWeight:700, color:C.dark }}>{p.name}</div>
                    <div style={{ fontSize:11, color:C.mid }}>{p.brand}</div>
                    <div style={{ fontSize:12, fontWeight:700, color:C.green, marginTop:4 }}>PKR {p.sellPrice}</div>
                  </div>
                ))}
                {filteredProducts.length === 0 && <div style={{ gridColumn:'1/-1', textAlign:'center', color:C.light, padding:16, fontSize:13 }}>No products match "{search}"</div>}
              </div>
              {sel && (
                <div style={{ background:C.blueLight, border:`1px solid ${C.blueBorder}`, borderRadius:10, padding:'12px 14px', marginBottom:14, fontSize:13, color:C.blue }}>
                  <div style={{ fontWeight:800, fontSize:14, marginBottom:4 }}>✓ {sel.name} selected</div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:4 }}>
                    <span>Sell: <strong>PKR {sel.sellPrice}</strong></span>
                    <span>WS: <strong>PKR {sel.wholesale}</strong></span>
                    <span>Delivery: <strong>PKR {sel.delivery||0}</strong></span>
                    <span>Flyer: <strong>PKR {sel.flyer||0}</strong></span>
                  </div>
                </div>
              )}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <FInput label={`${t.qty} *`} type="number" value={order.qty} onChange={set('qty')} placeholder="1" min="1" />
                <FSelect label="Week *" value={order.week} onChange={set('week')}>
                  {WEEKS.map(w => <option key={w}>{w}</option>)}
                </FSelect>
              </div>
              {sel && order.qty && (
                <div style={{ background:C.amberLight, border:`1px solid ${C.amberBorder}`, borderRadius:10, padding:'10px 14px', fontSize:14, color:C.amber, fontWeight:700 }}>
                  Subtotal: PKR {(sellPrice * qty).toLocaleString()}
                </div>
              )}
            </>}
        </>}

        {step === 3 && <>
          <SL>{t.step3}</SL>
          {[
            ['cod',       `💵 ${t.cod}`,       'Customer pays cash when package arrives', C.blue  ],
            ['easypaisa', `📱 ${t.easypaisa}`, 'Customer paid via Easypaisa',             C.green ],
            ['jazzcash',  `📲 ${t.jazzcash}`,  'Customer paid via JazzCash',              C.teal  ],
          ].map(([val, label, desc, color]) => (
            <div key={val} onClick={() => setOrder(o => ({ ...o, paymentMethod:val }))}
              style={{ padding:'14px 16px', borderRadius:12, border:`2px solid ${order.paymentMethod===val?color:C.border}`, background:order.paymentMethod===val?color+'11':'#fff', marginBottom:10, cursor:'pointer', transition:'all 0.15s' }}>
              <div style={{ fontSize:14, fontWeight:700, color:order.paymentMethod===val?color:C.dark }}>{label}</div>
              <div style={{ fontSize:12, color:C.mid, marginTop:2 }}>{desc}</div>
            </div>
          ))}
          <FInput label="Note (optional)" value={order.note} onChange={set('note')} placeholder="e.g. Handle carefully, fragile item" />
        </>}

        {step === 4 && <>
          <SL color={C.green}>{t.step4}</SL>
          {[
            ['Customer', order.customerName],
            ['Area',     order.area],
            ...(order.phone ? [['Phone', order.phone]] : []),
            ['Product',  `${sel?.name} × ${qty}`],
            ['Week',     order.week],
            ['Payment',  methodLabel[order.paymentMethod]],
          ].map(([k,v],i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:`1px solid ${C.border}` }}>
              <span style={{ fontSize:13, color:C.mid, fontWeight:600 }}>{k}</span>
              <span style={{ fontSize:14, color:C.dark, fontWeight:600 }}>{v}</span>
            </div>
          ))}
          {/* Financial breakdown */}
          <div style={{ background:C.page, borderRadius:10, padding:14, marginTop:14 }}>
            <div style={{ fontSize:11, fontWeight:800, color:C.blue, letterSpacing:'0.6px', textTransform:'uppercase', marginBottom:10 }}>Financial Breakdown</div>
            {[
              ['Sell Price',   `PKR ${totalSell.toLocaleString()}`,      C.green],
              ['− Wholesale',  `PKR ${totalWholesale.toLocaleString()}`, C.red  ],
              ['− Delivery',   `PKR ${totalDelivery.toLocaleString()}`,  C.red  ],
              ['− Flyer',      `PKR ${totalFlyer.toLocaleString()}`,     C.red  ],
            ].map(([k,v,col],i) => (
              <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:`1px solid ${C.border}` }}>
                <span style={{ fontSize:13, color:C.mid }}>{k}</span>
                <span style={{ fontSize:13, fontWeight:700, color:col }}>{v}</span>
              </div>
            ))}
            <div style={{ display:'flex', justifyContent:'space-between', padding:'10px 0 0' }}>
              <span style={{ fontSize:14, fontWeight:900, color:C.dark }}>= {t.orderProfit}</span>
              <span style={{ fontSize:16, fontWeight:900, color:orderProfit>=0?C.teal:C.red }}>PKR {orderProfit.toLocaleString()}</span>
            </div>
          </div>
          <div style={{ background:C.greenLight, border:`1px solid ${C.greenBorder}`, borderRadius:10, padding:'12px 14px', marginTop:12, fontSize:13, color:C.green, fontWeight:600 }}>
            ✓ Revenue PKR {totalSell.toLocaleString()} and Profit PKR {orderProfit.toLocaleString()} will be recorded in Finance automatically.
          </div>
        </>}
      </Card>

      <div style={{ display:'grid', gridTemplateColumns:step>1?'1fr 1fr':'1fr', gap:10 }}>
        {step > 1 && <Btn v="outline" onClick={() => setStep(s => s-1)}>← Back</Btn>}
        {step < 4  && <Btn v="blue"   disabled={!canNext[step]} onClick={() => setStep(s => s+1)}>Next Step →</Btn>}
        {step === 4 && <Btn v="green" onClick={confirmOrder}>🚀 {t.confirmDispatch}</Btn>}
      </div>

      {orders.length > 0 && <OrderHistory orders={orders} methodLabel={methodLabel} t={t} />}
    </div>
  )
}

function OrderHistory({ orders, methodLabel, t }) {
  const totalRev    = orders.reduce((s,o) => s+o.totalSell, 0)
  const totalProfit = orders.reduce((s,o) => s+o.orderProfit, 0)
  return (
    <div style={{ marginTop:20 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
        <div style={{ fontSize:14, fontWeight:800, color:C.dark }}>{t.orderHistory} — {orders.length}</div>
        <div style={{ display:'flex', gap:8 }}>
          <Bdg v="green">Revenue: PKR {totalRev.toLocaleString()}</Bdg>
          <Bdg v={totalProfit>=0?'teal':'red'}>Profit: PKR {totalProfit.toLocaleString()}</Bdg>
        </div>
      </div>
      {orders.map((o,i) => (
        <div key={i} style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:12, padding:'13px 16px', marginBottom:8 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:C.dark }}>{o.product} × {o.qty}</div>
              <div style={{ fontSize:13, color:C.mid }}>{o.customerName} · {o.area} · {methodLabel[o.paymentMethod]}</div>
              <div style={{ fontSize:11, color:C.light, marginTop:2 }}>WS: {o.totalWholesale} · Del: {o.totalDelivery} · Flyer: {o.totalFlyer} · {o.week} · by {o.by}</div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:4, alignItems:'flex-end' }}>
              <Bdg v="green">PKR {o.totalSell.toLocaleString()}</Bdg>
              <Bdg v={o.orderProfit>=0?'teal':'red'}>+PKR {o.orderProfit.toLocaleString()}</Bdg>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
