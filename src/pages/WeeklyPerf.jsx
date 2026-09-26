import { C, MB_CATS, WEEKS } from '../utils/constants.js'
import { Card, SL, Bdg, BarChart, LineGraph } from '../components/UI.jsx'

export default function WeeklyPerf({ products, orders, t }) {
  const totalOrders  = orders.length
  const totalRevenue = orders.reduce((s,o) => s+o.totalSell, 0)
  const totalProfit  = orders.reduce((s,o) => s+o.orderProfit, 0)

  const byCat = MB_CATS.map(c => ({
    label: c.en.split(' ').slice(1).join(' ').substring(0,8),
    value: orders.filter(o => o.category===c.en).length
  })).filter(x => x.value>0)

  const weeklyRev = WEEKS.map(w => ({
    label: w.replace('Week ','W'),
    value: orders.filter(o=>o.week===w).reduce((s,o)=>s+o.totalSell,0)
  }))

  return (
    <div>
      <div style={{ fontSize:22, fontWeight:900, color:C.dark, marginBottom:18 }}>{t.weekly}</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:16 }}>
        <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:14, padding:18, textAlign:'center' }}>
          <div style={{ fontSize:32, fontWeight:900, color:C.blue }}>{totalOrders}</div>
          <div style={{ fontSize:13, color:C.mid, marginTop:4 }}>Orders Processed</div>
        </div>
        <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:14, padding:18, textAlign:'center' }}>
          <div style={{ fontSize:20, fontWeight:900, color:C.green }}>PKR {totalRevenue.toLocaleString()}</div>
          <div style={{ fontSize:13, color:C.mid, marginTop:4 }}>{t.totalRevenue}</div>
        </div>
        <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:14, padding:18, textAlign:'center' }}>
          <div style={{ fontSize:20, fontWeight:900, color:totalProfit>=0?C.teal:C.red }}>PKR {totalProfit.toLocaleString()}</div>
          <div style={{ fontSize:13, color:C.mid, marginTop:4 }}>{t.orderProfit}</div>
        </div>
      </div>
      <Card>
        <SL color={C.green}>{t.weeklyRevenue}</SL>
        <LineGraph data={weeklyRev} color={C.green} />
      </Card>
      <Card>
        <SL color={C.teal}>Orders by Category</SL>
        {byCat.length===0
          ? <div style={{ textAlign:'center', color:C.light, padding:28 }}>No orders yet. Process an order to see performance.</div>
          : <BarChart data={byCat} color={C.blue} />}
      </Card>
      {orders.length>0 && (
        <Card>
          <SL>Recent Orders</SL>
          {orders.slice(0,8).map((o,i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'11px 0', borderBottom:`1px solid ${C.border}` }}>
              <div>
                <div style={{ fontSize:14, fontWeight:600, color:C.dark }}>{o.product} × {o.qty}</div>
                <div style={{ fontSize:12, color:C.mid }}>{o.customerName} · {o.area} · {o.by}</div>
              </div>
              <div style={{ display:'flex', gap:6 }}>
                <Bdg v="green">PKR {o.totalSell.toLocaleString()}</Bdg>
                <Bdg v={o.orderProfit>=0?'teal':'red'}>+{o.orderProfit.toLocaleString()}</Bdg>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  )
}
