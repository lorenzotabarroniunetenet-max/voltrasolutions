// v3.17 — 2026-05-22
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'

const STATUS = {
  ACTIVE:   { color: '#B4FF39', rgb: '180,255,57', icon: '⚔️', label: 'Missione in corso', title: 'Al fronte', pulse: true },
  PASSED:   { color: '#E8C84A', rgb: '232,200,74', icon: '🏅', label: 'Missione compiuta', title: 'Obiettivo raggiunto', pulse: false },
  FAILED:   { color: '#ff4757', rgb: '255,71,87',  icon: '🪖', label: 'Missione conclusa', title: 'Caduto in servizio', pulse: false },
  PAID_OUT: { color: '#E8C84A', rgb: '232,200,74', icon: '💰', label: 'Missione liquidata', title: 'Bottino riscosso', pulse: false },
}

export default function AppMobile() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.myAccounts().then(async accs => {
      if (accs.length > 0) {
        try { setStats(await api.accountStats(accs[0].id)) } catch {}
      }
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const account = stats?.account
  const program  = stats?.program
  const canPayout = stats?.payoutInfo?.eligible && account?.status === 'ACTIVE'
  const sc = STATUS[account?.status] || STATUS.ACTIVE
  const bal = account ? Number(account.startBalance) : 0

  return (
    <div style={{ minHeight:'100vh', background:'#030303', display:'flex', flexDirection:'column',
      paddingTop:'env(safe-area-inset-top,0px)', paddingBottom:'env(safe-area-inset-bottom,24px)', position:'relative', overflow:'hidden' }}>

      {/* scanlines */}
      <div style={{ position:'fixed', inset:0, backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.04) 3px,rgba(0,0,0,0.04) 4px)', pointerEvents:'none', zIndex:0 }}/>

      {/* HEADER */}
      <div style={{ padding:'15px 18px 10px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'relative', zIndex:1 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <svg width="20" height="20" viewBox="0 0 100 100"><polygon points="58,0 20,55 46,55 34,100 80,40 52,40 68,0" fill="#B4FF39"/></svg>
          <span style={{ fontFamily:'Bricolage Grotesque,sans-serif', fontWeight:800, fontSize:16, color:'#B4FF39', letterSpacing:'-.01em' }}>VOLTRA</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:10, color:'rgba(255,255,255,.2)', fontFamily:'JetBrains Mono,monospace' }}>{user?.matricola}</span>
          <Link to="/personale" style={{ width:30, height:30, borderRadius:'50%', background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', display:'flex', alignItems:'center', justifyContent:'center', textDecoration:'none', fontSize:13 }}>👤</Link>
        </div>
      </div>

      <div style={{ flex:1, padding:'0 14px', display:'flex', flexDirection:'column', gap:10, position:'relative', zIndex:1, overflowY:'auto' }}>

        {loading ? (
          <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:11, color:'rgba(255,255,255,.2)', letterSpacing:'.1em' }}>CARICAMENTO...</div>
          </div>
        ) : !account ? (
          /* ── EMPTY ── */
          <>
            <div style={{ borderRadius:18, padding:'20px 16px', background:`linear-gradient(145deg,rgba(54,162,235,.07),rgba(0,0,0,0))`, border:'1px solid rgba(54,162,235,.18)', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:-30, right:-20, width:100, height:100, borderRadius:'50%', background:'radial-gradient(circle,rgba(54,162,235,.12) 0%,transparent 70%)', pointerEvents:'none' }}/>
              <div style={{ fontSize:9, color:'#36a2eb', textTransform:'uppercase', letterSpacing:'.14em', fontWeight:700, marginBottom:8 }}>🎖 Nessuna missione</div>
              <div style={{ fontFamily:'Bricolage Grotesque,sans-serif', fontSize:24, fontWeight:800, letterSpacing:'-.02em', lineHeight:1, marginBottom:10 }}>Pronto al servizio</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,.3)', fontFamily:'JetBrains Mono,monospace', padding:'7px 10px', background:'rgba(0,0,0,.4)', borderRadius:8 }}>Scegli il tuo grado per iniziare il servizio.</div>
            </div>
            <Link to="/buy" style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'15px', background:'#B4FF39', color:'#000', textDecoration:'none', fontFamily:'Bricolage Grotesque,sans-serif', fontWeight:800, fontSize:14, textTransform:'uppercase', letterSpacing:'.04em', borderRadius:14, position:'relative', overflow:'hidden' }}>
              Nuova Missione ⚡
            </Link>
          </>
        ) : (
          <>
            {/* ── HERO CARD ── */}
            <div style={{ borderRadius:18, padding:'18px 16px', background:`linear-gradient(145deg,rgba(${sc.rgb},.09) 0%,rgba(${sc.rgb},.03) 40%,rgba(0,0,0,0) 100%)`, border:`1px solid rgba(${sc.rgb},.22)`, position:'relative', overflow:'hidden' }}>
              {/* noise */}
              <div style={{ position:'absolute', inset:0, opacity:.5, pointerEvents:'none', backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")` }}/>
              {/* glow orb */}
              <div style={{ position:'absolute', top:-30, right:-20, width:110, height:110, borderRadius:'50%', background:`radial-gradient(circle,rgba(${sc.rgb},.14) 0%,transparent 70%)`, pointerEvents:'none' }}/>

              {/* badge */}
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:sc.color, display:'inline-block', animation: sc.pulse?'glowpulse 2s ease-in-out infinite':'' }}/>
                <span style={{ fontSize:9, color:sc.color, textTransform:'uppercase', letterSpacing:'.14em', fontWeight:700 }}>{sc.label}</span>
                {sc.pulse && <span style={{ fontSize:8, color:`rgba(${sc.rgb},.45)`, letterSpacing:'.1em' }}>· LIVE</span>}
              </div>

              <div style={{ fontFamily:'Bricolage Grotesque,sans-serif', fontSize:28, fontWeight:800, letterSpacing:'-.02em', lineHeight:1, marginBottom:14, color:sc.pulse?'#fff':sc.color }}>{sc.title}</div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:9 }}>
                <div style={{ background:'rgba(0,0,0,.4)', border:'1px solid rgba(255,255,255,.05)', borderRadius:10, padding:'9px 11px' }}>
                  <div style={{ fontSize:8, color:'rgba(255,255,255,.3)', textTransform:'uppercase', letterSpacing:'.09em', marginBottom:3 }}>Grado</div>
                  <div style={{ fontSize:14, fontWeight:700 }}>{program?.name || '—'}</div>
                </div>
                <div style={{ background:'rgba(0,0,0,.4)', border:'1px solid rgba(255,255,255,.05)', borderRadius:10, padding:'9px 11px' }}>
                  <div style={{ fontSize:8, color:'rgba(255,255,255,.3)', textTransform:'uppercase', letterSpacing:'.09em', marginBottom:3 }}>Dotazione</div>
                  <div style={{ fontSize:14, fontWeight:700 }}>${bal.toLocaleString()}</div>
                </div>
              </div>

              <div style={{ background:'rgba(0,0,0,.4)', border:'1px solid rgba(255,255,255,.04)', borderRadius:8, padding:'7px 10px', fontSize:8, color:'rgba(255,255,255,.25)', fontFamily:'JetBrains Mono,monospace', display:'flex', justifyContent:'space-between' }}>
                <span>VOLTRA LIQUIDITY GRAB POOL</span>
                <span style={{ color:'#B4FF39' }}>AUTO ⚡</span>
              </div>
            </div>

            {/* ── RIMBORSO (solo se sbloccato) ── */}
            {canPayout && (
              <Link to="/payout" style={{ display:'flex', alignItems:'center', gap:10, padding:'13px 14px', background:'rgba(180,255,57,.05)', border:'1px solid rgba(180,255,57,.22)', borderRadius:14, textDecoration:'none', color:'inherit', position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(180,255,57,.5),transparent)' }}/>
                <span style={{ fontSize:22, flexShrink:0 }}>💰</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700 }}>Rimborso sbloccato</div>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,.3)', marginTop:2 }}>Il Comando ha autorizzato il rimborso</div>
                </div>
                <span style={{ color:'#B4FF39', fontSize:16 }}>→</span>
              </Link>
            )}

            {/* ── AZIONI ── */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              <Link to="/buy" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:7, padding:'15px 10px', background:'rgba(180,255,57,.07)', border:'1px solid rgba(180,255,57,.2)', borderRadius:14, textDecoration:'none', color:'inherit' }}>
                <span style={{ fontSize:22 }}>🎖</span>
                <span style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'.07em', color:'#B4FF39', textAlign:'center' }}>Nuova Missione</span>
              </Link>
              <a href="https://t.me/voltra_comandoBot" target="_blank" rel="noreferrer" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:7, padding:'15px 10px', background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.07)', borderRadius:14, textDecoration:'none', color:'inherit' }}>
                <span style={{ fontSize:22 }}>✈️</span>
                <span style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'.07em', color:'rgba(255,255,255,.6)', textAlign:'center' }}>Apri Telegram</span>
              </a>
            </div>
          </>
        )}

        {/* ── LINKS ── */}
        <div style={{ background:'rgba(255,255,255,.02)', border:'1px solid rgba(255,255,255,.05)', borderRadius:14, overflow:'hidden' }}>
          {[
            { to:'/giochi',       icon:'🎮', label:'Zona Tattica', sub:'Mini giochi operativi', lime:true },
            { to:'/fascicolo',    icon:'📋', label:'Fascicolo', sub:'Dati personali e missioni' },
            { to:'/linea-diretta',icon:'📨', label:'Supporto', sub:'Linea Diretta HQ' },
            { to:'/briefing',     icon:'📜', label:'Briefing', sub:'Ordini del Giorno' },
            { to:'/onorificenze', icon:'🏅', label:'Onorificenze', sub:'Decorazioni e distintivi' },
          ].map((item, i, arr) => (
            <Link key={item.to} to={item.to} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', borderBottom: i<arr.length-1?'1px solid rgba(255,255,255,.04)':'none', textDecoration:'none', color:'inherit', background: item.lime?'rgba(180,255,57,.03)':'' }}>
              <div style={{ width:32, height:32, borderRadius:9, background: item.lime?'rgba(180,255,57,.08)':'rgba(255,255,255,.04)', border:`1px solid ${item.lime?'rgba(180,255,57,.2)':'rgba(255,255,255,.06)'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, flexShrink:0 }}>{item.icon}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:600, color: item.lime?'rgba(180,255,57,.9)':'rgba(255,255,255,.8)' }}>{item.label}</div>
                <div style={{ fontSize:10, color:'rgba(255,255,255,.25)', marginTop:1 }}>{item.sub}</div>
              </div>
              <span style={{ color: item.lime?'rgba(180,255,57,.35)':'rgba(255,255,255,.15)', fontSize:14 }}>›</span>
            </Link>
          ))}
        </div>

        <Link to="/dashboard" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'10px', border:'1px solid rgba(255,255,255,.05)', borderRadius:10, textDecoration:'none', color:'rgba(255,255,255,.2)', fontSize:11 }}>
          🖥 Apri il sito completo
        </Link>

      </div>

      <style>{`
        @keyframes glowpulse { 0%,100%{box-shadow:0 0 0 0 rgba(180,255,57,.7)} 50%{box-shadow:0 0 0 5px rgba(180,255,57,0)} }
      `}</style>
    </div>
  )
}
