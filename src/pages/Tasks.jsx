import { useState } from 'react'
import { C, USERS } from '../utils/constants.js'
import { Card, SL, Bdg, Btn, FInput, FTextarea, FSelect, Modal } from '../components/UI.jsx'

export default function Tasks({ user, tasks, setTasks, setActivityLog, t }) {
  const [form,        setForm]        = useState({ title:'', desc:'', assignedTo:'Saif', due:'' })
  const [noteId,      setNoteId]      = useState(null)
  const [noteText,    setNoteText]    = useState('')
  const [doneModal,   setDoneModal]   = useState(null)
  const [doneNote,    setDoneNote]    = useState('')
  const [rejectModal, setRejectModal] = useState(null)
  const [rejectNote,  setRejectNote]  = useState('')
  const isAdmin = user.role==='admin'||user.role==='superAdmin'
  const sf = k => e => setForm(f=>({...f,[k]:e.target.value}))

  const addTask = () => {
    if (!form.title) return
    const entry = { id:Date.now(), ...form, status:'pending', notes:[], createdBy:user.name, createdAt:new Date().toLocaleDateString() }
    setTasks(p => [...p, entry])
    setActivityLog(a => [{id:Date.now(), who:user.name, what:`Created task "${form.title}" → ${form.assignedTo}`, when:new Date().toLocaleString(), type:'task_create'}, ...a])
    setForm({ title:'', desc:'', assignedTo:'Saif', due:'' })
  }

  const markDone = id => {
    if (!doneNote.trim()) return
    setTasks(p => p.map(tk => tk.id===id ? {...tk, status:'done', doneNote, doneBy:user.name, doneAt:new Date().toLocaleString()} : tk))
    setActivityLog(a => [{id:Date.now(), who:user.name, what:'Marked task as done', note:doneNote, when:new Date().toLocaleString(), type:'task_done'}, ...a])
    setDoneModal(null); setDoneNote('')
  }

  const rejectTask = id => {
    if (!rejectNote.trim()) return
    setTasks(p => p.map(tk => tk.id===id ? {...tk, status:'rejected', rejectNote, rejectedBy:user.name, rejectedAt:new Date().toLocaleString()} : tk))
    setActivityLog(a => [{id:Date.now(), who:user.name, what:`Rejected task`, note:rejectNote, when:new Date().toLocaleString(), type:'task_reject'}, ...a])
    setRejectModal(null); setRejectNote('')
  }

  const addNote = id => {
    if (!noteText.trim()) return
    setTasks(p => p.map(tk => tk.id===id ? {...tk, notes:[...(tk.notes||[]), {text:noteText, by:user.name, at:new Date().toLocaleTimeString()}]} : tk))
    setNoteText(''); setNoteId(null)
  }

  return (
    <div>
      {doneModal && (
        <Modal title={t.markDone}>
          <div style={{ fontSize:14, color:C.mid, marginBottom:12 }}>What did you complete? (required)</div>
          <FTextarea value={doneNote} onChange={e=>setDoneNote(e.target.value)} placeholder="Describe what was done..." style={{ minHeight:80 }} />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <Btn v="outline" onClick={()=>{setDoneModal(null);setDoneNote('')}}>Cancel</Btn>
            <Btn v="green" disabled={!doneNote.trim()} onClick={()=>markDone(doneModal)}>✓ {t.markDone}</Btn>
          </div>
        </Modal>
      )}
      {rejectModal && (
        <Modal title="Reject Task">
          <div style={{ fontSize:14, color:C.mid, marginBottom:12 }}>Why are you rejecting? (required)</div>
          <FTextarea value={rejectNote} onChange={e=>setRejectNote(e.target.value)} placeholder="e.g. Unclear instructions..." style={{ minHeight:80 }} />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <Btn v="outline" onClick={()=>{setRejectModal(null);setRejectNote('')}}>Cancel</Btn>
            <Btn v="red" disabled={!rejectNote.trim()} onClick={()=>rejectTask(rejectModal)}>{t.reject}</Btn>
          </div>
        </Modal>
      )}

      <div style={{ fontSize:22, fontWeight:900, color:C.dark, marginBottom:18 }}>{t.tasks}</div>
      <Card>
        <SL>{t.createTask}</SL>
        <FInput label={`${t.taskTitle} *`} value={form.title} onChange={sf('title')} placeholder="e.g. Add 5 charger products to catalog" />
        <FTextarea label="Description" value={form.desc} onChange={sf('desc')} style={{ minHeight:70 }} placeholder="Describe what needs to be done..." />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <FSelect label={t.assignTo} value={form.assignedTo} onChange={sf('assignedTo')}>
            {USERS.map(u => <option key={u.id} value={u.name}>{u.name} ({u.role})</option>)}
          </FSelect>
          <FInput label={t.dueDate} type="date" value={form.due} onChange={sf('due')} />
        </div>
        <Btn v="blue" onClick={addTask}>{t.createTask}</Btn>
      </Card>

      {tasks.length===0 && <div style={{ textAlign:'center', color:C.light, padding:40 }}>{t.noData}</div>}

      {tasks.map(tk => {
        const borderCol = tk.status==='done'?C.greenBorder:tk.status==='rejected'?C.redBorder:C.border
        return (
          <div key={tk.id} style={{ background:'#fff', border:`1.5px solid ${borderCol}`, borderRadius:12, padding:'15px 18px', marginBottom:10 }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:15, fontWeight:700, color:C.dark, textDecoration:tk.status==='done'?'line-through':'none', opacity:tk.status==='done'?0.5:1 }}>{tk.title}</div>
                {tk.desc && <div style={{ fontSize:13, color:C.mid, marginTop:3, lineHeight:1.5 }}>{tk.desc}</div>}
                <div style={{ fontSize:12, color:C.light, marginTop:4 }}>By {tk.createdBy} → {tk.assignedTo}{tk.due&&` · Due ${tk.due}`} · {tk.createdAt}</div>
                {tk.doneNote && <div style={{ background:C.greenLight, border:`1px solid ${C.greenBorder}`, borderRadius:8, padding:'7px 10px', marginTop:8, fontSize:13, color:C.green }}>✓ <strong>{tk.doneBy}</strong>: {tk.doneNote} <span style={{ color:C.light }}>· {tk.doneAt}</span></div>}
                {tk.rejectNote && <div style={{ background:C.redLight, border:`1px solid ${C.redBorder}`, borderRadius:8, padding:'7px 10px', marginTop:8, fontSize:13, color:C.red }}>✗ <strong>{tk.rejectedBy}</strong>: {tk.rejectNote}</div>}
                {(tk.notes||[]).map((n,i) => <div key={i} style={{ background:C.blueLight, borderRadius:8, padding:'6px 10px', marginTop:6, fontSize:12, color:C.blue }}>💬 <strong>{n.by}:</strong> {n.text} <span style={{ color:C.light }}>· {n.at}</span></div>)}
                {noteId===tk.id && (
                  <div style={{ marginTop:8 }}>
                    <input value={noteText} onChange={e=>setNoteText(e.target.value)} placeholder="Add a note..."
                      style={{ width:'100%', border:`1.5px solid ${C.border}`, borderRadius:8, padding:'8px 12px', fontSize:13, outline:'none', boxSizing:'border-box', fontFamily:'inherit' }} />
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:6 }}>
                      <Btn v="blue" small onClick={() => addNote(tk.id)}>Save Note</Btn>
                      <Btn v="outline" small onClick={() => setNoteId(null)}>Cancel</Btn>
                    </div>
                  </div>
                )}
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:6, alignItems:'flex-end', flexShrink:0 }}>
                <Bdg v={tk.status==='done'?'green':tk.status==='rejected'?'red':'blue'}>{tk.status==='done'?`✓ ${t.done}`:tk.status==='rejected'?`✗ Rejected`:t.pending}</Bdg>
                {tk.status==='pending' && <button onClick={() => setDoneModal(tk.id)} style={{ fontSize:12, color:C.green, background:C.greenLight, border:`1px solid ${C.greenBorder}`, borderRadius:7, padding:'4px 10px', cursor:'pointer', fontWeight:700 }}>✓ {t.markDone}</button>}
                {tk.status==='pending' && <button onClick={() => setRejectModal(tk.id)} style={{ fontSize:12, color:C.red, background:C.redLight, border:`1px solid ${C.redBorder}`, borderRadius:7, padding:'4px 10px', cursor:'pointer', fontWeight:700 }}>✗ {t.reject}</button>}
                <button onClick={() => { setNoteId(tk.id===noteId?null:tk.id); setNoteText('') }} style={{ fontSize:12, color:C.teal, background:C.tealLight, border:`1px solid ${C.tealBorder}`, borderRadius:7, padding:'4px 10px', cursor:'pointer', fontWeight:700 }}>💬 {t.note}</button>
                {isAdmin && <button onClick={() => setTasks(p => p.filter(x => x.id!==tk.id))} style={{ fontSize:12, color:C.red, background:C.redLight, border:`1px solid ${C.redBorder}`, borderRadius:7, padding:'4px 10px', cursor:'pointer', fontWeight:700 }}>🗑</button>}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
