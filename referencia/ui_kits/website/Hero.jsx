// Hero.jsx — editorial hero: dark slab left, bright panel right, Harvard-style serif display
function Hero({ onNav }) {
  return (
    <section style={{ background: "#161616", color: "#fff", position: "relative", overflow: "hidden", borderBottom: "1px solid #161616" }}>
      {/* subtle grid pattern */}
      <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize:"64px 64px", pointerEvents:"none" }}/>
      <div style={{ maxWidth:1440, margin:"0 auto", display:"grid", gridTemplateColumns:"1.15fr 1fr", position:"relative" }}>
        {/* LEFT: editorial slab */}
        <div style={{ padding:"88px 64px 96px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, fontSize:12, letterSpacing:"0.14em", textTransform:"uppercase", color:"#c6c6c6", fontFamily:"IBM Plex Mono, monospace", marginBottom:40 }}>
            <span>CFIA</span>
            <span style={{ width:24, height:1, background:"#525252" }}/>
            <span>Centro de Formação em IA</span>
            <span style={{ width:24, height:1, background:"#525252" }}/>
            <span>Est. 2024</span>
          </div>
          <h1 style={{ fontFamily:"'IBM Plex Serif', Georgia, serif", fontWeight:300, fontSize:88, letterSpacing:"-0.03em", lineHeight:0.98, margin:"0 0 28px", color:"#fff" }}>
            Uma nova<br/>
            geração de<br/>
            <span style={{ fontStyle:"italic", fontWeight:400, color:"#4589ff" }}>profissionais</span><br/>
            de IA começa aqui.
          </h1>
          <p style={{ fontSize:19, color:"#c6c6c6", lineHeight:1.55, maxWidth:520, margin:"0 0 40px" }}>
            Trilhas estruturadas, projetos reais e mentoria de quem constrói IA no mercado. Do primeiro modelo ao deploy em produção.
          </p>
          <div style={{ display:"flex", gap:12, marginBottom:48, flexWrap:"wrap" }}>
            <button onClick={()=>onNav("/cadastro")} style={{ background:"#fff", color:"#161616", border:"none", fontWeight:600, fontSize:15, padding:"16px 28px", cursor:"pointer", display:"inline-flex", alignItems:"center", gap:12, fontFamily:"inherit" }}>
              Começar gratuitamente <Arrow size={18}/>
            </button>
            <button onClick={()=>onNav("/cursos")} style={{ background:"transparent", color:"#fff", border:"1px solid #525252", fontWeight:600, fontSize:15, padding:"16px 28px", cursor:"pointer", fontFamily:"inherit", display:"inline-flex", alignItems:"center", gap:10 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M10 8l6 4-6 4z" fill="currentColor"/></svg>
              Assistir apresentação · 2 min
            </button>
          </div>
          {/* Mini stat strip */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", borderTop:"1px solid #393939", paddingTop:28, maxWidth:560 }}>
            {[["12.400+","Alunos ativos"],["97%","Taxa de conclusão"],["4,9","Avaliação média"]].map(([v,l], i) => (
              <div key={l} style={{ paddingLeft: i?20:0, borderLeft: i?"1px solid #393939":"none" }}>
                <div style={{ fontFamily:"'IBM Plex Serif', Georgia, serif", fontWeight:400, fontSize:30, color:"#fff", letterSpacing:"-0.02em" }}>{v}</div>
                <div style={{ fontSize:12, color:"#8d8d8d", textTransform:"uppercase", letterSpacing:"0.08em", fontFamily:"IBM Plex Mono, monospace", marginTop:4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        {/* RIGHT: visual — editorial photo slot + floating course preview card + neural-network svg */}
        <div style={{ position:"relative", minHeight:700 }}>
          <div style={{ position:"absolute", inset:"40px 40px 40px 0", background:"linear-gradient(165deg, #0f62fe 0%, #002d9c 50%, #001141 100%)", overflow:"hidden" }}>
            {/* neural network */}
            <svg viewBox="0 0 500 700" width="100%" height="100%" style={{ position:"absolute", inset:0, opacity:0.35 }}>
              {Array.from({length:5}).map((_,col) => Array.from({length:7}).map((_,row) => (
                <circle key={col+"-"+row} cx={60+col*95} cy={60+row*95} r="3" fill="#a6c8ff"/>
              )))}
              {Array.from({length:5-1}).map((_,col) => Array.from({length:7}).flatMap((_,r1) => Array.from({length:7}).map((_,r2) => (
                <line key={col+"-"+r1+"-"+r2} x1={60+col*95} y1={60+r1*95} x2={60+(col+1)*95} y2={60+r2*95} stroke="#a6c8ff" strokeWidth="0.4" opacity={((r1*r2+col)%5===0)?0.6:0.1}/>
              ))))}
            </svg>
            {/* ticker */}
            <div style={{ position:"absolute", bottom:32, left:32, right:32, fontFamily:"IBM Plex Mono, monospace", fontSize:11, color:"rgba(255,255,255,0.7)", letterSpacing:"0.12em" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8, textTransform:"uppercase" }}>
                <span>LATEST · PROJECT_RUN_OUTPUT.TXT</span>
                <span style={{ color:"#24a148" }}>● TRAINING</span>
              </div>
              <div style={{ padding:16, background:"rgba(0,0,0,0.35)", border:"1px solid rgba(255,255,255,0.1)", lineHeight:1.6 }}>
                <div>epoch 12/30 · loss 0.142 · val_acc 0.913</div>
                <div>epoch 13/30 · loss 0.128 · val_acc 0.924</div>
                <div>epoch 14/30 · loss 0.117 · val_acc <span style={{ color:"#f1c21b" }}>0.937</span></div>
              </div>
            </div>
          </div>
          {/* Floating course preview */}
          <div style={{ position:"absolute", top:80, right:32, width:320, background:"#fff", color:"#161616", padding:20, boxShadow:"0 24px 48px rgba(0,0,0,0.4)" }}>
            <div style={{ fontSize:11, fontFamily:"IBM Plex Mono, monospace", letterSpacing:"0.12em", textTransform:"uppercase", color:"#0f62fe", marginBottom:10 }}>CURSO EM DESTAQUE</div>
            <div style={{ fontSize:17, fontWeight:600, lineHeight:1.3, marginBottom:12 }}>Construindo agentes com LLMs em produção</div>
            <div style={{ display:"flex", alignItems:"center", gap:10, fontSize:13, color:"#525252", marginBottom:16 }}>
              <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#f4d3b3,#c89474)" }}/>
              Camila Tavares · IBM
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:12, borderTop:"1px solid #e0e0e0" }}>
              <div style={{ fontSize:12, color:"#525252" }}>8 semanas · Avançado</div>
              <div style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:12 }}><Star/><b>4,9</b><span style={{ color:"#8d8d8d" }}>(487)</span></div>
            </div>
          </div>
          {/* Floating metric tile */}
          <div style={{ position:"absolute", bottom:180, right:-24, width:180, background:"#fff", color:"#161616", padding:20, boxShadow:"0 16px 32px rgba(0,0,0,0.2)" }}>
            <div style={{ fontSize:11, fontFamily:"IBM Plex Mono, monospace", letterSpacing:"0.12em", textTransform:"uppercase", color:"#525252", marginBottom:8 }}>Conclusão</div>
            <div style={{ fontFamily:"'IBM Plex Serif', Georgia, serif", fontSize:42, fontWeight:400, letterSpacing:"-0.02em" }}>97<span style={{ color:"#0f62fe" }}>%</span></div>
            <div style={{ display:"flex", gap:2, marginTop:10 }}>
              {Array.from({length:20}).map((_,i)=> <div key={i} style={{ flex:1, height:20, background: i<19?"#0f62fe":"#e0e0e0" }}/>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
window.Hero = Hero;
