import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

// ── SHARED ──────────────────────────────────────────────
const SCANLINES = {
  position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
  backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.04) 3px,rgba(0,0,0,0.04) 4px)',
}

// ── GIOCO 1: INTERCETTA ──────────────────────────────────
function GameIntercetta() {
  const [score, setScore] = useState(0)
  const [status, setStatus] = useState('Tap quando il blip è nel centro')
  const [statusColor, setStatusColor] = useState('var(--muted)')
  const [blipPos, setBlipPos] = useState({ top: '30%', left: '70%' })
  const [blipVisible, setBlipVisible] = useState(false)
  const [bars, setBars] = useState([20,30,15,38,22,12,28,20])
  const activeRef = useRef(false)
  const timerRef = useRef(null)

  const positions = [
    {top:'20%',left:'65%'},{top:'70%',left:'30%'},{top:'50%',left:'75%'},
    {top:'30%',left:'25%'},{top:'75%',left:'65%'},{top:'20%',left:'40%'},
  ]

  const spawnBlip = () => {
    setBlipVisible(false)
    setTimeout(() => {
      const pos = positions[Math.floor(Math.random()*positions.length)]
      setBlipPos(pos); setBlipVisible(true)
      activeRef.current = true
      timerRef.current = setTimeout(() => {
        if(activeRef.current) { activeRef.current=false; miss() }
      }, 1400 + Math.random()*600)
    }, 500+Math.random()*500)
  }

  const miss = () => {
    setStatus('MANCATO — ritenta'); setStatusColor('var(--red)')
    setBlipVisible(false)
    setBars(bars.map(()=>Math.random()*20+4))
    setTimeout(spawnBlip, 500)
  }

  const tap = () => {
    if(!activeRef.current) return
    clearTimeout(timerRef.current); activeRef.current = false
    setScore(s => s+1)
    const msgs = ['BERSAGLIO NEUTRALIZZATO','SEGNALE INTERCETTATO','TARGET ELIMINATO']
    setStatus(msgs[Math.floor(Math.random()*3)]); setStatusColor('var(--lime)')
    setBlipVisible(false)
    setBars(bars.map((_,i) => i===3 ? 40 : Math.random()*34+8))
    setTimeout(spawnBlip, 300)
  }

  // Bar animation
  useEffect(() => {
    const iv = setInterval(() => {
      if(activeRef.current) setBars(b => b.map(()=>Math.random()*30+6))
    }, 120)
    spawnBlip()
    return () => { clearInterval(iv); clearTimeout(timerRef.current) }
  }, [])

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:14, padding:'0 20px' }}>
      <div style={{ fontFamily:'Bricolage Grotesque, sans-serif', fontSize:16, fontWeight:800, textAlign:'center', letterSpacing:'-.01em' }}>INTERCETTA IL SEGNALE</div>
      <div style={{ fontSize:11, color:statusColor, fontFamily:'JetBrains Mono, monospace', textAlign:'center', transition:'color .2s', minHeight:18 }}>{status}</div>

      {/* RADAR */}
      <div style={{ position:'relative', width:180, height:180, flexShrink:0 }}>
        {[0,22,44].map(i=>(
          <div key={i} style={{ position:'absolute', inset:i, borderRadius:'50%', border:'1px solid rgba(180,255,57,'.concat((0.15-i*0.002).toFixed(3),')')}} />
        ))}
        <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:'conic-gradient(from 0deg,rgba(180,255,57,0) 0deg,rgba(180,255,57,.25) 30deg,rgba(180,255,57,0) 60deg)', animation:'sweep 2s linear infinite' }}/>
        {/* Crosshair */}
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ position:'absolute', width:'100%', height:1, background:'rgba(180,255,57,.1)' }}/>
          <div style={{ position:'absolute', width:1, height:'100%', background:'rgba(180,255,57,.1)' }}/>
        </div>
        {/* Blip */}
        <div style={{ position:'absolute', width:8, height:8, borderRadius:'50%', background:'var(--lime)', boxShadow:'0 0 8px var(--lime)', top:blipPos.top, left:blipPos.left, transform:'translate(-50%,-50%)', opacity:blipVisible?1:0, transition:'opacity .1s' }}/>
        {/* Center button */}
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <button onClick={tap} style={{ width:50, height:50, borderRadius:'50%', background:'rgba(180,255,57,.1)', border:'2px solid rgba(180,255,57,.4)', color:'var(--lime)', fontSize:10, fontFamily:'JetBrains Mono, monospace', fontWeight:700, cursor:'pointer', letterSpacing:'.06em' }}>TAP</button>
        </div>
      </div>

      {/* Freq bars */}
      <div style={{ display:'flex', gap:4, height:44, alignItems:'flex-end' }}>
        {bars.map((h,i) => (
          <div key={i} style={{ width:14, borderRadius:'3px 3px 0 0', background: i===3?'var(--lime)':'rgba(180,255,57,.3)', height:h, transition:'height .08s linear', boxShadow: i===3&&h>30?'0 0 10px rgba(180,255,57,.5)':'' }}/>
        ))}
      </div>

      <div style={{ textAlign:'center' }}>
        <div style={{ fontFamily:'Bricolage Grotesque, sans-serif', fontSize:32, fontWeight:800, color:'var(--lime)' }}>{score}</div>
        <div style={{ fontSize:9, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.1em' }}>SEGNALI INTERCETTATI</div>
      </div>

      <style>{`@keyframes sweep{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

// ── GIOCO 2: NEUTRALIZZA ──────────────────────────────────
function GameNeutralizza() {
  const [state, setState] = useState('idle') // idle | playing | end
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(20)
  const [targets, setTargets] = useState([])
  const [combo, setCombo] = useState(0)
  const [flashes, setFlashes] = useState([])
  const runningRef = useRef(false)
  const comboRef = useRef(0)
  const scoreRef = useRef(0)
  const idRef = useRef(0)

  const start = () => {
    runningRef.current=true; scoreRef.current=0; comboRef.current=0
    setState('playing'); setScore(0); setTime(20); setTargets([]); setFlashes([])
    const tick = setInterval(()=>{ setTime(t=>{ if(t<=1){clearInterval(tick);end();return 0} return t-1 }) },1000)
    spawnLoop()
  }

  const end = () => { runningRef.current=false; setState('end'); setTargets([]) }

  const spawnLoop = () => {
    if(!runningRef.current) return
    spawnOne()
    const d = Math.max(350, 900 - scoreRef.current*10)
    setTimeout(spawnLoop, d)
  }

  const spawnOne = () => {
    if(!runningRef.current) return
    const id = ++idRef.current
    const x=15+Math.random()*70, y=10+Math.random()*70
    const life = 1200+Math.random()*500
    setTargets(ts=>[...ts,{id,x,y}])
    setTimeout(()=>{ setTargets(ts=>ts.filter(t=>t.id!==id)); comboRef.current=0 },life)
  }

  const hitTarget = (id, x, y) => {
    setTargets(ts=>ts.filter(t=>t.id!==id))
    comboRef.current++; setCombo(comboRef.current)
    const pts = comboRef.current>=3?3:comboRef.current>=2?2:1
    scoreRef.current+=pts; setScore(scoreRef.current)
    const fid=Date.now()
    setFlashes(fs=>[...fs,{id:fid,x,y,pts,combo:comboRef.current>=3}])
    setTimeout(()=>setFlashes(fs=>fs.filter(f=>f.id!==fid)),600)
  }

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', position:'relative' }}>
      <div style={{ padding:'10px 16px 6px', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
        <div>
          <div style={{ fontSize:8, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.1em', fontFamily:'JetBrains Mono, monospace' }}>Tempo</div>
          <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:22, fontWeight:700, color: time<=5?'var(--red)':'var(--lime)' }}>{String(time).padStart(2,'0')}</div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:8, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.1em', fontFamily:'JetBrains Mono, monospace' }}>Score</div>
          <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:18, fontWeight:700 }}>{score}</div>
        </div>
      </div>

      <div style={{ flex:1, position:'relative', backgroundImage:'linear-gradient(rgba(180,255,57,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(180,255,57,.04) 1px,transparent 1px)', backgroundSize:'24px 24px', cursor:'crosshair', minHeight:300 }}>
        {targets.map(t=>(
          <div key={t.id} onClick={()=>hitTarget(t.id,t.x,t.y)} style={{ position:'absolute', left:t.x+'%', top:t.y+'%', transform:'translate(-50%,-50%)', cursor:'pointer', zIndex:5 }}>
            <div style={{ width:36, height:36, borderRadius:'50%', border:'2px solid var(--lime)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 12px rgba(180,255,57,.4)', animation:'tpulse 1s ease-in-out infinite' }}>
              <div style={{ width:12, height:12, borderRadius:'50%', background:'var(--lime)' }}/>
            </div>
          </div>
        ))}
        {flashes.map(f=>(
          <div key={f.id} style={{ position:'absolute', left:f.x+'%', top:f.y+'%', transform:'translate(-50%,-60%)', pointerEvents:'none', fontFamily:'JetBrains Mono, monospace', fontWeight:700, fontSize: f.combo?14:12, color: f.combo?'var(--gold)':'var(--lime)', animation:'hitfloat .6s ease forwards', zIndex:10 }}>
            {f.combo?'COMBO! +'+f.pts:'+'+f.pts}
          </div>
        ))}

        {state==='idle'&&(
          <div style={{ position:'absolute', inset:0, background:'rgba(3,3,3,.92)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:14, zIndex:20 }}>
            <div style={{ fontSize:40 }}>🎯</div>
            <div style={{ fontFamily:'Bricolage Grotesque, sans-serif', fontSize:18, fontWeight:800 }}>NEUTRALIZZA</div>
            <div style={{ fontSize:10, color:'var(--muted)', fontFamily:'JetBrains Mono, monospace', textAlign:'center', maxWidth:200, lineHeight:1.6 }}>Tap i bersagli prima che scompaiano. Combo = più punti.</div>
            <button onClick={start} style={{ padding:'11px 24px', background:'var(--lime)', color:'#000', border:'none', fontFamily:'Manrope, sans-serif', fontWeight:800, fontSize:12, textTransform:'uppercase', letterSpacing:'.06em', cursor:'pointer', borderRadius:8 }}>⚡ INIZIA</button>
          </div>
        )}
        {state==='end'&&(
          <div style={{ position:'absolute', inset:0, background:'rgba(3,3,3,.92)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:14, zIndex:20 }}>
            <div style={{ fontSize:40 }}>🎯</div>
            <div style={{ fontFamily:'Bricolage Grotesque, sans-serif', fontSize:16, fontWeight:800 }}>MISSIONE COMPLETATA</div>
            <div style={{ fontFamily:'Bricolage Grotesque, sans-serif', fontSize:42, fontWeight:800, color:'var(--lime)' }}>{score}</div>
            <div style={{ fontSize:9, color:'var(--muted)', fontFamily:'JetBrains Mono, monospace' }}>OBIETTIVI NEUTRALIZZATI</div>
            <button onClick={start} style={{ padding:'11px 24px', background:'var(--lime)', color:'#000', border:'none', fontFamily:'Manrope, sans-serif', fontWeight:800, fontSize:12, textTransform:'uppercase', letterSpacing:'.06em', cursor:'pointer', borderRadius:8 }}>⚡ NUOVA MISSIONE</button>
          </div>
        )}
      </div>
      <style>{`
        @keyframes tpulse{0%,100%{box-shadow:0 0 6px rgba(180,255,57,.3)}50%{box-shadow:0 0 18px rgba(180,255,57,.7)}}
        @keyframes hitfloat{0%{opacity:1;transform:translate(-50%,-60%)}100%{opacity:0;transform:translate(-50%,-130%)}}
      `}</style>
    </div>
  )
}

// ── GIOCO 3: DECODIFICA ──────────────────────────────────
const DC_CONFIG = [
  { icon:'⚡', label:'ALFA', color:'var(--lime)', bg:'rgba(180,255,57,.07)', border:'rgba(180,255,57,.25)', lit:'rgba(180,255,57,.35)' },
  { icon:'🎯', label:'BRAVO', color:'#36a2eb', bg:'rgba(54,162,235,.07)', border:'rgba(54,162,235,.25)', lit:'rgba(54,162,235,.4)' },
  { icon:'🛡', label:'CHARLIE', color:'var(--gold)', bg:'rgba(232,200,74,.07)', border:'rgba(232,200,74,.25)', lit:'rgba(232,200,74,.35)' },
  { icon:'💥', label:'DELTA', color:'var(--red)', bg:'rgba(255,71,87,.07)', border:'rgba(255,71,87,.25)', lit:'rgba(255,71,87,.35)' },
]

function GameDecodifica() {
  const [phase, setPhase] = useState('idle') // idle | showing | input | win | fail
  const [seq, setSeq] = useState([])
  const [level, setLevel] = useState(1)
  const [userIdx, setUserIdx] = useState(0)
  const [litIdx, setLitIdx] = useState(-1)
  const [msg, setMsg] = useState('Ripeti la sequenza del Comando')
  const [msgColor, setMsgColor] = useState('var(--muted)')
  const seqRef = useRef([])

  const start = () => {
    const first = [Math.floor(Math.random()*4)]
    seqRef.current=first; setSeq(first); setLevel(1); setUserIdx(0)
    showSequence(first)
  }

  const showSequence = (s) => {
    setPhase('showing'); setMsg('OSSERVA LA SEQUENZA...'); setMsgColor('var(--muted)')
    let i=0
    const next=()=>{
      if(i>=s.length){setLitIdx(-1);setTimeout(()=>{setPhase('input');setMsg('INSERISCI IL CODICE');setMsgColor('var(--lime)')},300);return}
      setLitIdx(s[i]); setTimeout(()=>{setLitIdx(-1);setTimeout(()=>{i++;next()},200)},550)
    }
    setTimeout(next,400)
  }

  const tap=(idx)=>{
    if(phase!=='input') return
    setLitIdx(idx); setTimeout(()=>setLitIdx(-1),180)
    if(idx===seqRef.current[userIdx]){
      const newIdx=userIdx+1; setUserIdx(newIdx)
      if(newIdx>=seqRef.current.length){
        setMsg('✓ CODICE CORRETTO'); setMsgColor('var(--lime)')
        setPhase('win')
        const newSeq=[...seqRef.current,Math.floor(Math.random()*4)]
        seqRef.current=newSeq; setSeq(newSeq); setLevel(l=>l+1)
        setTimeout(()=>showSequence(newSeq),900)
      }
    } else {
      setPhase('fail'); setMsg('✗ CODICE ERRATO — LV '+seqRef.current.length); setMsgColor('var(--red)')
      setTimeout(()=>{seqRef.current=[];setSeq([]);setLevel(1);setUserIdx(0);setPhase('idle');setMsg('Ripeti la sequenza del Comando');setMsgColor('var(--muted)')},1500)
    }
  }

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'0 16px', gap:12 }}>
      <div style={{ fontFamily:'Bricolage Grotesque, sans-serif', fontSize:15, fontWeight:800, textAlign:'center' }}>DECODIFICA OPERATIVA</div>
      <div style={{ fontSize:10, color:msgColor, fontFamily:'JetBrains Mono, monospace', textAlign:'center', transition:'color .2s', minHeight:18 }}>{msg}</div>

      {/* Progress dots */}
      <div style={{ display:'flex', gap:5, minHeight:12 }}>
        {seq.map((_,i)=>(
          <div key={i} style={{ width:8, height:8, borderRadius:'50%', transition:'all .2s', background: i<userIdx?'var(--lime)':i===userIdx&&phase==='input'?'rgba(180,255,57,.5)':'rgba(255,255,255,.1)', boxShadow:i<userIdx?'0 0 6px rgba(180,255,57,.5)':'' }}/>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, width:210 }}>
        {DC_CONFIG.map((c,i)=>(
          <div key={i} onClick={()=>tap(i)} style={{ height:78, borderRadius:14, border:`2px solid ${litIdx===i?c.color:c.border}`, background:litIdx===i?c.lit:c.bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:5, cursor:'pointer', transition:'all .1s', boxShadow:litIdx===i?`0 0 18px ${c.bg.replace('.07','.5')}`:'' }}>
            <span style={{ fontSize:22 }}>{c.icon}</span>
            <span style={{ fontSize:8, fontFamily:'JetBrains Mono, monospace', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', color:c.color, opacity:.7 }}>{c.label}</span>
          </div>
        ))}
      </div>

      {/* Level badge */}
      <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:11, color: level>1?'var(--lime)':'var(--muted)' }}>
        {phase==='idle'?'—':('LV '+level+' · '+seq.length+' CODICI')}
      </div>

      {phase==='idle'&&(
        <button onClick={start} style={{ padding:'11px 22px', background:'var(--lime)', color:'#000', border:'none', fontFamily:'Manrope, sans-serif', fontWeight:800, fontSize:11, textTransform:'uppercase', letterSpacing:'.06em', cursor:'pointer', borderRadius:8 }}>▶ RICEVI ORDINE</button>
      )}
    </div>
  )
}

// ── MAIN COMPONENT ──────────────────────────────────────
const GAMES = [
  { id:'intercetta', icon:'📡', label:'Intercetta', component:<GameIntercetta/> },
  { id:'neutralizza', icon:'🎯', label:'Neutralizza', component:<GameNeutralizza/> },
  { id:'decodifica', icon:'🔐', label:'Decodifica', component:<GameDecodifica/> },
]

export default function GiochiPage() {
  const [active, setActive] = useState(0)

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column', paddingTop:'env(safe-area-inset-top,0px)', paddingBottom:'env(safe-area-inset-bottom,24px)', position:'relative' }}>
      <div style={SCANLINES}/>

      {/* Header */}
      <div style={{ padding:'14px 16px 10px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'relative', zIndex:1 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <svg width="18" height="18" viewBox="0 0 100 100"><polygon points="58,0 20,55 46,55 34,100 80,40 52,40 68,0" fill="#B4FF39"/></svg>
          <span style={{ fontFamily:'Bricolage Grotesque, sans-serif', fontWeight:800, fontSize:15, color:'var(--lime)' }}>ZONA TATTICA</span>
        </div>
        <Link to="/app" style={{ fontSize:11, color:'var(--muted)', textDecoration:'none', fontFamily:'JetBrains Mono, monospace' }}>← App</Link>
      </div>

      {/* Game selector */}
      <div style={{ display:'flex', gap:4, padding:'0 16px 12px', position:'relative', zIndex:1 }}>
        {GAMES.map((g,i)=>(
          <button key={g.id} onClick={()=>setActive(i)} style={{
            flex:1, padding:'8px 4px', border:'1px solid', borderColor: active===i?'var(--lime)':'rgba(255,255,255,.08)',
            background: active===i?'rgba(180,255,57,.1)':'rgba(255,255,255,.02)',
            color: active===i?'var(--lime)':'var(--muted)',
            borderRadius:10, cursor:'pointer', fontFamily:'Manrope, sans-serif',
            fontSize:10, fontWeight:700, display:'flex', flexDirection:'column', alignItems:'center', gap:3,
          }}>
            <span style={{ fontSize:16 }}>{g.icon}</span>
            <span style={{ textTransform:'uppercase', letterSpacing:'.04em' }}>{g.label}</span>
          </button>
        ))}
      </div>

      {/* Game area */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', position:'relative', zIndex:1 }}>
        {GAMES[active].component}
      </div>
    </div>
  )
}
