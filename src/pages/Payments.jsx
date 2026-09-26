import { useState } from 'react'
import { C, WEEKS } from '../utils/constants.js'
import { Card, SL, Stat, Bdg, Btn, FInput, FSelect, StatusMsg, Modal, LineGraph, DonutChart } from '../components/UI.jsx'

export default function Payments({ user, payments, setPayments, expenses, setExpenses, salaries, setSalaries, t }) {
  const [tab,        setTab]        = useState('revenue')
  const [form,       setForm]       = useState({ amount:'', method:'cod', note:'', week:'Week 1' })
  const [expForm,    setExpForm]    = useState({ amount:'', category:'', note:'', week:'Week 1' })
  const [salForm,    setSalForm]    = useState({ employee:'', amount:'', week:'Week 1', note:'' })
  const [status,     setStatus]     = useState(null)
  const [editId,     setEditId]     = useState(null)
  const [editVal,    setEditVal]    = useState('')
  const [moveModal,  setMoveModal]  = useState(null)
  const [confirmDel, setConfirmDel] = useState(null)
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}))
  const isUser = user.role==='user'

  const revenue    = payments.filter(p => !p.movedTo)
  const total      = revenue.reduce((s,p)=>s+parseInt(p.amount||0),0)
  const byCod      = revenue.filter(p=>p.method==='cod').reduce((s,p)=>s+parseInt(p.amount||0),0)
  const byEasy     = revenue.filter(p=>p.method==='easypaisa').reduce((s,p)=>s+parseInt(p.amount||0),0)
  const byJazz     = revenue.filter(p=>p.method==='jazzcash').reduce((s,p)=>s+parseInt(p.amount||0),0)
  const totalExp   = expenses.reduce((s,e)=>s+parseInt(e.amount||0),0)
  const totalSal   = salaries.reduce((s,s2)=>s+parseInt(s2.amount||0),0)
  const weeklyData = WEEKS.map(w=>({ label:w.replace('Week ','W'), value:revenue.filter(p=>p.week===w).reduce((s,p)=>s+parseInt(p.amount||0),0) }))
  const inSlices   = [{label:'COD',value:byCod,color:C.blue},{label:'Easypaisa',value:byEasy,color:C.green},{label:'JazzCash',value:byJazz,color:C.teal}]
  const outSlices  = [{label:t.expenses,value:totalExp,color:C.red},{label:t.salaries,value:totalSal,color:C.purple}]

  const save    = () => { if (!form.amount){setStatus({type:'error',msg:'Amount required.'});return} setPayments(p=>[...p,{id:Date.now(),...form,at:new Date().toLocaleString()}]); setStatus({type:'success',msg:'Payment recorded!'}); setForm({amount:'',method:'cod',note:'',week:'Week 1'}); setTimeout(()=>setStatus(null),2500) }
  const saveExp = () => { if (!expForm.amount||!expForm.category){setStatus({type:'error',msg:'Amount and category required.'});return} setExpenses(e=>[...e,{id:Date.now(),...expForm,at:new Date().toLocaleString()}]); setStatus({type:'success',msg:'Expense recorded!'}); setExpForm({amount:'',category:'',note:'',week:'Week 1'}); setTimeout(()=>setStatus(null),2500) }
  const saveSal = () => { if (!salForm.employee||!salForm.amount){setStatus({type:'error',msg:'Employee and amount required.'});return} setSalaries(s=>[...s,{id:Date.now(),...salForm,at:new Date().toLocaleString()}]); setStatus({type:'success',msg:'Salary recorded!'}); setSalForm({employee:'',amount:'',week:'Week 1',note:''}); setTimeout(()=>setStatus(null),2500) }
  const doEdit  = id => { setPayments(p=>p.map(x=>x.id===id?{...x,amount:editVal}:x)); setEditId(null); setEditVal('') }
  const doDelete = id => { setPayments(p=>p.filter(x=>x.id!==id)); setConfirmDel(null) }
  const doMove = (id, dest) => {
    const p = payments.find(x=>x.id===id)
    if (dest==='expense') setExpenses(e=>[...e,{id:Date.now(),amount:p.amount,category:'Moved from Payment',note:p.note||'',week:p.week,at:new Date().toLocaleString()}])
    if (dest==='salary')  setSalaries(s=>[...s,{id:Date.now(),employee:'Moved',amount:p.amount,week:p.week,note:p.note||'',at:new Date().toLocaleString()}])
    setPayments(prev=>prev.filter(x=>x.id!==id)); setMoveModal(null)
  }
  const mc = m => m==='cod'?'blue':m==='easypaisa'?'green':'teal'
  const tabS = active => ({ padding:'9px 18px', borderRadius:20, border:`1.5px solid ${active?C.blue:C.border}`, background:active?C.blue:'#fff', color:active?'#fff':C.mid, fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s' })

  return (
    <div>
      {confirmDel && <Modal title="Delete this payment?"><div style={{ fontSize:14, color:C.mid, marginBottom:16 }}>Cannot be undone.</div><div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}><Btn v="outline" onClick={()=>setConfirmDel(null)}>Cancel</Btn><Btn v="red" onClick={()=>doDelete(confirmDel)}>Delete</Btn></div></Modal>}
      {moveModal && <Modal title="Move Payment To"><div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:12 }}>{[['expense',`📋 ${t.expenses}`,C.red],['salary',`👤 ${t.salaries}`,C.purple]].map(([dest,label,color])=><button key={dest} onClick={()=>doMove(moveModal,dest)} style={{ padding:'11px 16px', borderRadius:10, border:`1.5px solid ${color}22`, background:color+'11', color, fontWeight:700, fontSize:14, cursor:'pointer', textAlign:'left', fontFamily:'inherit' }}>{label}</button>)}</div><Btn v="outline" onClick={()=>setMoveModal(null)}>Cancel</Btn></Modal>}

      <div style={{ fontSize:22, fontWeight:900, color:C.dark, marginBottom:18 }}>{t.payments}</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:16 }}>
        <Stat label={t.revenue}   value={`PKR ${total.toLocaleString()}`}    color={C.green}  icon="💵" />
        <Stat label={t.expenses}  value={`PKR ${totalExp.toLocaleString()}`} color={C.red}    icon="📋" />
        <Stat label={t.salaries}  value={`PKR ${totalSal.toLocaleString()}`} color={C.purple} icon="👤" />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
        <Card style={{ marginBottom:0 }}><SL color={C.green}>Money In</SL><DonutChart slices={inSlices} /></Card>
        <Card style={{ marginBottom:0 }}><SL color={C.red}>Money Out</SL><DonutChart slices={outSlices} /></Card>
      </div>
      <Card><SL color={C.green}>{t.weeklyRevenue}</SL><LineGraph data={weeklyData} color={C.green} /></Card>

      <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
        {[['revenue',`💵 ${t.revenue}`],['expense',`📋 ${t.expenses}`],['salary',`👤 ${t.salaries}`]].map(([id,label])=><button key={id} onClick={()=>setTab(id)} style={tabS(tab===id)}>{label}</button>)}
      </div>

      {tab==='revenue' && <Card><SL>Add Revenue</SL><div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}><FInput label="Amount (PKR) *" type="number" value={form.amount} onChange={set('amount')} placeholder="e.g. 15000" /><FSelect label="Method *" value={form.method} onChange={set('method')}><option value="cod">💵 {t.cod}</option><option value="easypaisa">📱 {t.easypaisa}</option><option value="jazzcash">📲 {t.jazzcash}</option></FSelect><FSelect label="Week" value={form.week} onChange={set('week')}>{WEEKS.map(w=><option key={w}>{w}</option>)}</FSelect><FInput label="Note" value={form.note} onChange={set('note')} placeholder="optional" /></div><Btn v="green" onClick={save}>Record Revenue</Btn><StatusMsg s={status} /></Card>}
      {tab==='expense' && <Card><SL color={C.red}>Add Expense</SL><div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}><FInput label="Amount (PKR) *" type="number" value={expForm.amount} onChange={e=>setExpForm(f=>({...f,amount:e.target.value}))} placeholder="e.g. 5000" /><FSelect label="Category *" value={expForm.category} onChange={e=>setExpForm(f=>({...f,category:e.target.value}))}><option value="">Select...</option><option>Rent</option><option>Electricity</option><option>Internet</option><option>Supplier Fee</option><option>Packaging</option><option>Transport</option><option>Other</option></FSelect><FSelect label="Week" value={expForm.week} onChange={e=>setExpForm(f=>({...f,week:e.target.value}))}>{WEEKS.map(w=><option key={w}>{w}</option>)}</FSelect><FInput label="Note" value={expForm.note} onChange={e=>setExpForm(f=>({...f,note:e.target.value}))} placeholder="optional" /></div><Btn v="red" onClick={saveExp}>Add Expense</Btn><StatusMsg s={status} /></Card>}
      {tab==='salary' && (isUser
        ? <Card><div style={{ textAlign:'center', padding:'32px 20px' }}><div style={{ fontSize:32, marginBottom:12 }}>🔒</div><div style={{ fontSize:16, fontWeight:800, color:C.dark, marginBottom:8 }}>Access Restricted</div><div style={{ fontSize:14, color:C.mid, lineHeight:1.6 }}>You don't have permission to view salary records. Contact your Admin.</div></div></Card>
        : <Card><SL color={C.purple}>Add Salary</SL><div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}><FSelect label="Employee *" value={salForm.employee} onChange={e=>setSalForm(f=>({...f,employee:e.target.value}))}><option value="">Select...</option><option>Saif</option><option>Haroon</option><option>Bilal</option><option>Other</option></FSelect><FInput label="Amount (PKR) *" type="number" value={salForm.amount} onChange={e=>setSalForm(f=>({...f,amount:e.target.value}))} placeholder="e.g. 15000" /><FSelect label="Week" value={salForm.week} onChange={e=>setSalForm(f=>({...f,week:e.target.value}))}>{WEEKS.map(w=><option key={w}>{w}</option>)}</FSelect><FInput label="Note" value={salForm.note} onChange={e=>setSalForm(f=>({...f,note:e.target.value}))} placeholder="optional" /></div><Btn v="purple" onClick={saveSal}>Add Salary</Btn><StatusMsg s={status} /></Card>
      )}

      {revenue.length>0 && <Card><SL>Revenue History</SL>{revenue.slice().reverse().map((p,i)=><div key={i} style={{ padding:'12px 0', borderBottom:`1px solid ${C.border}` }}>{editId===p.id?<div style={{ display:'flex', gap:8, alignItems:'center' }}><input type="number" value={editVal} onChange={e=>setEditVal(e.target.value)} style={{ flex:1, border:`2px solid ${C.blue}`, borderRadius:8, padding:'8px 12px', fontSize:14, outline:'none', fontFamily:'inherit' }} /><Btn v="blue" small onClick={()=>doEdit(p.id)} style={{ width:'auto', padding:'8px 14px' }}>Save</Btn><Btn v="outline" small onClick={()=>setEditId(null)} style={{ width:'auto', padding:'8px 14px' }}>Cancel</Btn></div>:<div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}><div><div style={{ fontSize:15, fontWeight:700, color:C.dark }}>PKR {parseInt(p.amount).toLocaleString()}</div><div style={{ fontSize:12, color:C.mid }}>{p.method?.toUpperCase()} · {p.week} · {p.at}</div>{p.note&&<div style={{ fontSize:12, color:C.light }}>{p.note}</div>}</div><div style={{ display:'flex', gap:6, flexWrap:'wrap' }}><Bdg v={mc(p.method)}>{p.method}</Bdg><button onClick={()=>{setEditId(p.id);setEditVal(p.amount)}} style={{ fontSize:12, color:C.teal, background:C.tealLight, border:`1px solid ${C.tealBorder}`, borderRadius:7, padding:'4px 9px', cursor:'pointer', fontWeight:700 }}>✏️</button><button onClick={()=>setMoveModal(p.id)} style={{ fontSize:12, color:C.purple, background:C.purpleLight, border:`1px solid ${C.purpleBorder}`, borderRadius:7, padding:'4px 9px', cursor:'pointer', fontWeight:700 }}>🔀</button><button onClick={()=>setConfirmDel(p.id)} style={{ fontSize:12, color:C.red, background:C.redLight, border:`1px solid ${C.redBorder}`, borderRadius:7, padding:'4px 9px', cursor:'pointer', fontWeight:700 }}>🗑</button></div></div>}</div>)}</Card>}
      {expenses.length>0 && <Card><SL color={C.red}>Expense History — PKR {totalExp.toLocaleString()}</SL>{expenses.slice().reverse().map((e,i)=><div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:`1px solid ${C.border}` }}><div><div style={{ fontSize:14, fontWeight:600, color:C.dark }}>{e.category}</div><div style={{ fontSize:12, color:C.mid }}>{e.week} · {e.at}</div></div><Bdg v="red">PKR {parseInt(e.amount).toLocaleString()}</Bdg></div>)}</Card>}
      {!isUser && salaries.length>0 && <Card><SL color={C.purple}>Salary History — PKR {totalSal.toLocaleString()}</SL>{salaries.slice().reverse().map((s,i)=><div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:`1px solid ${C.border}` }}><div><div style={{ fontSize:14, fontWeight:600, color:C.dark }}>{s.employee}</div><div style={{ fontSize:12, color:C.mid }}>{s.week} · {s.at}</div></div><Bdg v="purple">PKR {parseInt(s.amount).toLocaleString()}</Bdg></div>)}</Card>}
    </div>
  )
}
