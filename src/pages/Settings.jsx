import { C, T } from '../utils/constants.js'
import { Card, SL, Bdg, Btn } from '../components/UI.jsx'

export default function Settings({ user, lang, setLang, onLogout, t }) {
  return (
    <div>
      <div style={{ fontSize:22, fontWeight:900, color:C.dark, marginBottom:18 }}>{t.settings}</div>
      <Card>
        <SL>{t.language}</SL>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
          {[['en','🇬🇧 English'],['ur','🇵🇰 اردو'],['ar','🇸🇦 العربية']].map(([code,label]) => (
            <button key={code} onClick={() => setLang(code)}
              style={{ padding:12, borderRadius:10, border:`2px solid ${lang===code?C.blue:C.border}`, background:lang===code?C.blueLight:'#fff', color:lang===code?C.blue:C.mid, fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s' }}>
              {label}
            </button>
          ))}
        </div>
      </Card>
      <Card>
        <SL>Account</SL>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
          <div style={{ width:44, height:44, borderRadius:'50%', background:`linear-gradient(135deg,${C.blue},${C.teal})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:900, color:'#fff' }}>{user.name[0]}</div>
          <div>
            <div style={{ fontSize:16, fontWeight:800, color:C.dark }}>{user.name}</div>
            <div style={{ fontSize:13, color:C.mid }}>{user.email}</div>
          </div>
          <Bdg v={user.role==='superAdmin'?'amber':user.role==='admin'?'teal':'blue'}>
            {user.role==='superAdmin'?`⭐ ${t.superAdmin}`:user.role==='admin'?`🛡️ ${t.admin}`:`👤 ${t.user}`}
          </Bdg>
        </div>
      </Card>
      <Btn v="red" onClick={onLogout}>🚪 {t.logout}</Btn>
    </div>
  )
}
