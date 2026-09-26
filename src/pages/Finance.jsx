import { useState } from 'react'
import { C, WEEKS } from '../utils/constants.js'
import { Card, SL, Stat, Btn, FInput, FSelect, FTextarea, LineGraph, Bdg, Modal } from '../components/UI.jsx'

export default function Finance({ user, products, orders, payments, ads, expenses, salaries, activityLog, t }) {
  const [section,     setSection]     = useState('overview')
  const [loans,       setLoans]       = useState([])
  const [credits,     setCredits]     = useState([])
  const [investments, setInvestments] = useState([])
  const [issues,      setIssues]      = useState([])
  const [form,        setForm]        = useState({})
  const [delModal,    setDelModal]    = useState(null)
  const [delReason,   setDelReason]   = useState('')
  const [delLog,      setDelLog]      = useState([])
  const sf = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  // ── CORRECT FORMULA — per order as source of truth ───────
  const totalRev          = orders.reduce((s,o) => s + o.totalSell,      0)
  const totalWS           = orders.reduce((s,o) => s + o.totalWholesale, 0)
  const totalDel          = orders.reduce((s,o) => s + o.totalDelivery,  0)
  const totalFlyer        = orders.reduce((s,o) => s + o.totalFlyer,     0)
  const totalOrderProfit  = orders.reduce((s,o) => s + o.orderProfit,    0)
  const totalLoss         = products.reduce((s,p) => s + parseInt(p.loss||0) + parseInt(p.returnAmt||0), 0)
  const totalAdSpend      = ads.reduce((s,a) => s + parseInt(a.spend||0), 0)
  const totalExp          = expenses.reduce((s,e) => s + parseInt(e.amount||0), 0)
  const totalSal          = salaries.reduce((s,s2) => s + parseInt(s2.amount||0), 0)
  const netProfit         = totalOrderProfit - totalLoss - totalAdSpend - totalExp - totalSal
  const totalLoaned       = loans.reduce((s,l) => s + parseInt(l.amount||0), 0)
  const totalLent         = credits.reduce((s,c) => s + parseInt(c.amount||0), 0)
  const totalInvested     = investments.reduce((s,i) => s + parseInt(i.amount||0), 0)

  const weeklyProfit = WEEKS.map(w => {
    const profit = orders.filter(o => o.week===w).reduce((s,o) => s+o.orderProfit, 0)
    const adS    = ads.filter(a => a.week===w).reduce((s,a) => s+parseInt(a.spend||0), 0)
    const exp    = expenses.filter(e => e.week===w).reduce((s,e) => s+parseInt(e.amount||0), 0)
    const sal    = salaries.filter(s => s.week===w).reduce((s,s2) => s+parseInt(s2.amount||0), 0)
    return { label:w.replace('Week ','W'), value: profit-adS-exp-sal }
  })

  const doDelete = (list, setList, idx) => {
    setDelLog(l => [...l, { who:user.name, what:`Deleted entry in ${section}`, why:delReason, when:new Date().toLocaleString() }])
    setList(l => l.filter((_,i) => i !== idx))
    setDelModal(null); setDelReason('')
  }

  const secs = [
    { id:'overview',   l:'📊 Overview'     },
    { id:'loan',       l:'💰 Loan'         },
    { id:'credit',     l:'🤝 Credit'       },
    { id:'investment', l:'📈 Investment'   },
    { id:'issues',     l:'⚠️ Issues'       },
    { id:'audit',      l:'🔍 Audit Log'    },
  ]

  const DelConfirm = ({ list, setList, idx }) => <>
    {delModal?.idx === idx && delModal?.section === section && (
      <Modal title="Delete — Reason Required">
        <div style={{ fontSize:14, color:C.mid, marginBottom:12 }}>As Super Admin, you must explain why you are deleting this entry. This is saved to the audit log.</div>
        <FTextarea value={delReason} onChange={e => setDelReason(e.target.value)} placeholder="e.g. Duplicate entry, wrong amount entered..." style={{ minHeight:80 }} />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          <Btn v="outline" onClick={() => { setDelModal(null); setDelReason('') }}>Cancel</Btn>
          <Btn v="red" disabled={!delReason.trim()} onClick={() => doDelete(list, setList, idx)}>Confirm Delete</Btn>
        </div>
      </Modal>
    )}
    <button onClick={() => setDelModal({ idx, section })}
      style={{ fontSize:12, color:C.red, background:C.redLight, border:`1px solid ${C.redBorder}`, borderRadius:7, padding:'4px 10px', cursor:'pointer', fontWeight:700 }}>
      🗑 Delete
    </button>
  </>

  return (
    <div>
      <div style={{ fontSize:22, fontWeight:900, color:C.dark, marginBottom:4 }}>{t.finance}</div>
      <div style={{ fontSize:13, color:C.light, marginBottom:18 }}>Super Admin — full financial view</div>

      {/* Section tabs */}
      <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:18 }}>
        {secs.map(s => (
          <button key={s.id} onClick={() => setSection(s.id)}
            style={{ padding:'8px 14px', borderRadius:20, border:`1.5px solid ${section===s.id?C.blue:C.border}`, background:section===s.id?C.blueLight:'#fff', color:section===s.id?C.blue:C.mid, fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s' }}>
            {s.l}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {section === 'overview' && <>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
          <Stat label={`Revenue (${orders.length} orders)`} value={`PKR ${totalRev.toLocaleString()}`}           color={C.green}                      icon="💵" />
          <Stat label="Order Gross Profit"                   value={`PKR ${totalOrderProfit.toLocaleString()}`}   color={totalOrderProfit>=0?C.teal:C.red} icon="📦" />
          <Stat label={t.loss}                               value={`PKR ${totalLoss.toLocaleString()}`}          color={C.red}                        icon="↩️" />
          <Stat label={t.adSpend}                            value={`PKR ${totalAdSpend.toLocaleString()}`}       color={C.purple}                     icon="📣" />
          <Stat label={t.expenses}                           value={`PKR ${totalExp.toLocaleString()}`}           color={C.red}                        icon="📋" />
          <Stat label={t.salaries}                           value={`PKR ${totalSal.toLocaleString()}`}           color={C.purple}                     icon="👤" />
          <Stat label={t.netProfit}                          value={`PKR ${netProfit.toLocaleString()}`}          color={netProfit>=0?C.teal:C.red}    icon="📊" />
          <Stat label="Invested"                             value={`PKR ${totalInvested.toLocaleString()}`}      color={C.amber}                      icon="🏦" />
        </div>

        {/* Net Profit Ledger */}
        <Card>
          <SL color={C.green}>Net Profit Ledger — Per Order Model</SL>
          <div style={{ background:C.page, borderRadius:10, padding:16, fontFamily:'monospace', fontSize:13, lineHeight:2.2 }}>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <span style={{ color:C.mid }}>Revenue ({orders.length} orders)</span>
              <span style={{ color:C.green, fontWeight:700 }}>PKR {totalRev.toLocaleString()}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <span style={{ color:C.mid }}>− Wholesale cost</span>
              <span style={{ color:C.red }}>PKR {totalWS.toLocaleString()}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <span style={{ color:C.mid }}>− Delivery charges</span>
              <span style={{ color:C.red }}>PKR {totalDel.toLocaleString()}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <span style={{ color:C.mid }}>− Flyer costs</span>
              <span style={{ color:C.red }}>PKR {totalFlyer.toLocaleString()}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', borderTop:`2px solid ${C.border}`, paddingTop:4 }}>
              <span style={{ color:C.teal, fontWeight:700 }}>= Order Gross Profit</span>
              <span style={{ color:C.teal, fontWeight:700 }}>PKR {totalOrderProfit.toLocaleString()}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <span style={{ color:C.mid }}>− Loss / Returns</span>
              <span style={{ color:C.red }}>PKR {totalLoss.toLocaleString()}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <span style={{ color:C.mid }}>− Ad Spend</span>
              <span style={{ color:C.red }}>PKR {totalAdSpend.toLocaleString()}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <span style={{ color:C.mid }}>− Expenses</span>
              <span style={{ color:C.red }}>PKR {totalExp.toLocaleString()}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <span style={{ color:C.mid }}>− Salaries</span>
              <span style={{ color:C.red }}>PKR {totalSal.toLocaleString()}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', borderTop:`3px solid ${C.border}`, paddingTop:6, marginTop:4 }}>
              <span style={{ fontSize:15, fontWeight:900, color:C.dark }}>= NET PROFIT</span>
              <span style={{ fontSize:16, fontWeight:900, color:netProfit>=0?C.green:C.red }}>PKR {netProfit.toLocaleString()}</span>
            </div>
          </div>
        </Card>

        <Card>
          <SL color={C.green}>Weekly Net Profit Trend</SL>
          <LineGraph data={weeklyProfit} color={netProfit>=0?C.green:C.red} />
        </Card>
      </>}

      {/* ── LOAN ── */}
      {section === 'loan' && <>
        <Card>
          <SL color={C.red}>Borrowed Money (Loan)</SL>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <FInput label="Borrowed From *"  value={form.from||''}    onChange={sf('from')}    placeholder="e.g. Brother, Bank"  />
            <FInput label="Amount (PKR) *"   type="number" value={form.amount||''} onChange={sf('amount')} placeholder="e.g. 50000" />
            <FInput label="Purpose"          value={form.purpose||''} onChange={sf('purpose')} placeholder="e.g. Buy stock"       />
            <FInput label="Due Date"         type="date"   value={form.dueDate||''} onChange={sf('dueDate')}  />
          </div>
          <Btn v="red" onClick={() => { if (!form.from||!form.amount) return; setLoans(l=>[...l,{id:Date.now(),...form,at:new Date().toLocaleDateString()}]); setForm({}) }}>Save Loan</Btn>
        </Card>
        <Stat label="Total Borrowed" value={`PKR ${totalLoaned.toLocaleString()}`} color={C.red} icon="💰" />
        <div style={{ marginTop:12 }}>
          {loans.map((l,i) => (
            <div key={i} style={{ background:'#fff', border:`1.5px solid ${C.redBorder}`, borderRadius:12, padding:'14px 18px', marginBottom:10 }}>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <div><div style={{ fontSize:15, fontWeight:700 }}>{l.from}</div><div style={{ fontSize:13, color:C.mid }}>{l.purpose} · Due: {l.dueDate||'—'}</div></div>
                <div style={{ display:'flex', flexDirection:'column', gap:6, alignItems:'flex-end' }}>
                  <Bdg v="red">PKR {parseInt(l.amount).toLocaleString()}</Bdg>
                  <DelConfirm list={loans} setList={setLoans} idx={i} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </>}

      {/* ── CREDIT ── */}
      {section === 'credit' && <>
        <Card>
          <SL color={C.teal}>Money Lent Out (Credit)</SL>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <FInput label="Lent To *"        value={form.to||''}         onChange={sf('to')}         placeholder="e.g. Customer, Friend" />
            <FInput label="Amount (PKR) *"   type="number" value={form.amount||''} onChange={sf('amount')} placeholder="e.g. 10000" />
            <FInput label="Reason"           value={form.reason||''}     onChange={sf('reason')}     placeholder="e.g. Credit sale"      />
            <FInput label="Expected Return"  type="date"   value={form.returnDate||''} onChange={sf('returnDate')} />
          </div>
          <Btn v="teal" onClick={() => { if (!form.to||!form.amount) return; setCredits(c=>[...c,{id:Date.now(),...form,at:new Date().toLocaleDateString()}]); setForm({}) }}>Save Credit</Btn>
        </Card>
        <Stat label="Total Lent Out" value={`PKR ${totalLent.toLocaleString()}`} color={C.teal} icon="🤝" />
        <div style={{ marginTop:12 }}>
          {credits.map((c,i) => (
            <div key={i} style={{ background:'#fff', border:`1.5px solid ${C.tealBorder}`, borderRadius:12, padding:'14px 18px', marginBottom:10 }}>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <div><div style={{ fontSize:15, fontWeight:700 }}>{c.to}</div><div style={{ fontSize:13, color:C.mid }}>{c.reason} · Return: {c.returnDate||'—'}</div></div>
                <div style={{ display:'flex', flexDirection:'column', gap:6, alignItems:'flex-end' }}>
                  <Bdg v="teal">PKR {parseInt(c.amount).toLocaleString()}</Bdg>
                  <DelConfirm list={credits} setList={setCredits} idx={i} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </>}

      {/* ── INVESTMENT ── */}
      {section === 'investment' && <>
        <Card>
          <SL color={C.amber}>Investment Tracker</SL>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <FInput label="Invested In *"   value={form.in||''}     onChange={sf('in')}     placeholder="e.g. Stock, Equipment" />
            <FInput label="Amount (PKR) *"  type="number" value={form.amount||''} onChange={sf('amount')} placeholder="e.g. 100000" />
            <FInput label="Source"          value={form.source||''} onChange={sf('source')} placeholder="e.g. Savings, Loan"     />
            <FInput label="Date"            type="date"   value={form.date||''}   onChange={sf('date')}   />
          </div>
          <Btn v="amber" onClick={() => { if (!form.in||!form.amount) return; setInvestments(v=>[...v,{id:Date.now(),...form,at:new Date().toLocaleDateString()}]); setForm({}) }}>Save Investment</Btn>
        </Card>
        <Stat label="Total Invested" value={`PKR ${totalInvested.toLocaleString()}`} color={C.amber} icon="🏦" />
        <div style={{ marginTop:12 }}>
          {investments.map((inv,i) => (
            <div key={i} style={{ background:'#fff', border:`1.5px solid ${C.amberBorder}`, borderRadius:12, padding:'14px 18px', marginBottom:10 }}>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <div><div style={{ fontSize:15, fontWeight:700 }}>{inv.in}</div><div style={{ fontSize:13, color:C.mid }}>{inv.source} · {inv.date}</div></div>
                <div style={{ display:'flex', flexDirection:'column', gap:6, alignItems:'flex-end' }}>
                  <Bdg v="amber">PKR {parseInt(inv.amount).toLocaleString()}</Bdg>
                  <DelConfirm list={investments} setList={setInvestments} idx={i} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </>}

      {/* ── ISSUES ── */}
      {section === 'issues' && <>
        <Card>
          <SL color={C.red}>Issues Tracker</SL>
          <FInput label="Issue Title *" value={form.title||''} onChange={sf('title')} placeholder="e.g. Supplier overcharged" />
          <FTextarea label="Description" value={form.desc||''} onChange={sf('desc')} style={{ minHeight:80 }} />
          <FSelect label="Severity" value={form.severity||'medium'} onChange={sf('severity')}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </FSelect>
          <Btn v="red" onClick={() => { if (!form.title) return; setIssues(v=>[...v,{id:Date.now(),...form,at:new Date().toLocaleDateString(),status:'open'}]); setForm({}) }}>Add Issue</Btn>
        </Card>
        {issues.map((iss,i) => (
          <div key={i} style={{ background:'#fff', border:`1.5px solid ${iss.severity==='high'?C.redBorder:iss.severity==='medium'?C.amberBorder:C.border}`, borderRadius:12, padding:'14px 18px', marginBottom:10 }}>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <div>
                <div style={{ fontSize:15, fontWeight:700, color:C.dark }}>{iss.title}</div>
                <div style={{ fontSize:13, color:C.mid, marginTop:3 }}>{iss.desc}</div>
                <div style={{ fontSize:11, color:C.light, marginTop:6 }}>{iss.at}</div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:6, alignItems:'flex-end' }}>
                <Bdg v={iss.severity==='high'?'red':iss.severity==='medium'?'amber':'blue'}>{iss.severity}</Bdg>
                <DelConfirm list={issues} setList={setIssues} idx={i} />
              </div>
            </div>
          </div>
        ))}
      </>}

      {/* ── AUDIT LOG ── */}
      {section === 'audit' && <>
        <div style={{ fontSize:15, fontWeight:700, color:C.dark, marginBottom:14 }}>Complete Audit Log</div>
        {[...delLog, ...activityLog].length === 0 && <div style={{ textAlign:'center', color:C.light, padding:40 }}>No activity recorded yet.</div>}
        {[...delLog, ...activityLog].slice(0,60).map((a,i) => (
          <div key={i} style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:12, padding:'13px 16px', marginBottom:8 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
              <Bdg v={a.type==='task_reject'?'red':a.type==='task_done'?'green':a.type==='order'?'teal':'blue'}>{a.who}</Bdg>
              <span style={{ fontSize:11, color:C.light }}>{a.when}</span>
            </div>
            <div style={{ fontSize:13, color:C.dark, fontWeight:600 }}>{a.what}</div>
            {a.note && <div style={{ fontSize:12, color:C.mid, marginTop:4 }}>Note: {a.note}</div>}
            {a.why  && <div style={{ fontSize:12, color:C.red, marginTop:4, fontWeight:600 }}>Delete reason: {a.why}</div>}
          </div>
        ))}
      </>}
    </div>
  )
}
