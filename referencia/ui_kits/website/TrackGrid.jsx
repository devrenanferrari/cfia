// TrackGrid.jsx — editorial tracks with larger cards, tag rows, salary data
function TrackGrid({ onNav }) {
  const tracks = [
    { title:"Engenheiro de IA", desc:"Construa e coloque modelos em produção", dur:"6–8 meses", salary:"R$ 14–22k", stack:["Python","PyTorch","Docker","FastAPI"], n:"01",
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="5" width="14" height="14"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4"/></svg> },
    { title:"Cientista de Dados", desc:"Transforme dados em decisões inteligentes", dur:"4–6 meses", salary:"R$ 10–18k", stack:["Python","SQL","Stats","BI"], n:"02",
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M7 14l4-4 4 4 5-5"/></svg> },
    { title:"Engenheiro de ML", desc:"Treine, otimize e escale modelos", dur:"6–8 meses", salary:"R$ 16–26k", stack:["MLOps","Kubernetes","Airflow","AWS"], n:"03",
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3a3 3 0 0 0-3 3v1.5a3 3 0 0 0-3 3V12a3 3 0 0 0-3 3v3a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-3a3 3 0 0 0-3-3v-1.5a3 3 0 0 0-3-3V6a3 3 0 0 0-3-3z"/></svg> },
    { title:"IA Generativa", desc:"Crie aplicações modernas com IA", dur:"4–5 meses", salary:"R$ 12–20k", stack:["LLMs","RAG","LangChain","Vector DB"], n:"04",
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3l2 6 6 1-4.5 4 1 6-5-3-5 3 1-6L3 10l6-1z"/></svg> },
  ];
  return (
    <section style={{ padding:"112px 16px", background:"#fff", borderBottom:"1px solid #e0e0e0" }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, marginBottom:64, alignItems:"flex-end" }}>
          <div>
            <span style={{ fontFamily:"IBM Plex Mono, monospace", fontSize:12, letterSpacing:"0.14em", textTransform:"uppercase", color:"#0f62fe" }}>Trilhas de carreira</span>
            <h2 style={{ fontFamily:"'IBM Plex Serif', Georgia, serif", fontWeight:300, fontSize:52, letterSpacing:"-0.02em", lineHeight:1.05, margin:"16px 0 0", color:"#161616" }}>
              Escolha sua<br/><span style={{ fontStyle:"italic", color:"#0f62fe" }}>carreira</span> em IA.
            </h2>
          </div>
          <p style={{ fontSize:18, color:"#525252", lineHeight:1.6, margin:0, maxWidth:480, paddingBottom:12 }}>
            Quatro caminhos estruturados, cada um com o currículo, projetos e mentoria necessários para chegar preparado ao mercado.
          </p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:1, background:"#e0e0e0", border:"1px solid #e0e0e0" }}>
          {tracks.map(t => <TrackTile key={t.n} t={t} onNav={onNav}/>)}
        </div>
      </div>
    </section>
  );
}
function TrackTile({ t, onNav }) {
  const [h, setH] = React.useState(false);
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
         onClick={()=>onNav("/cursos")}
         style={{ background: h ? "#f4f4f4" : "#fff", padding:40, display:"flex", gap:32, cursor:"pointer", transition:"background .2s", position:"relative" }}>
      <div style={{ flexShrink:0 }}>
        <div style={{ width:64, height:64, background:"#edf5ff", display:"flex", alignItems:"center", justifyContent:"center", color:"#0f62fe", marginBottom:16 }}>{t.icon}</div>
        <div style={{ fontFamily:"'IBM Plex Serif', Georgia, serif", fontWeight:300, fontSize:36, color:"#0f62fe", letterSpacing:"-0.02em" }}>{t.n}</div>
      </div>
      <div style={{ flex:1 }}>
        <h3 style={{ fontSize:24, fontWeight:700, color:"#161616", letterSpacing:"-0.01em", margin:"0 0 10px" }}>{t.title}</h3>
        <p style={{ fontSize:15, color:"#525252", lineHeight:1.55, margin:"0 0 24px", maxWidth:440 }}>{t.desc}</p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:24 }}>
          {t.stack.map(s => (
            <span key={s} style={{ fontFamily:"IBM Plex Mono, monospace", fontSize:11, padding:"4px 10px", background:"#fff", border:"1px solid #e0e0e0", color:"#525252" }}>{s}</span>
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, paddingTop:20, borderTop:"1px solid #e0e0e0" }}>
          <div>
            <div style={{ fontSize:11, fontFamily:"IBM Plex Mono, monospace", textTransform:"uppercase", letterSpacing:"0.1em", color:"#8d8d8d", marginBottom:4 }}>Duração</div>
            <div style={{ fontSize:15, color:"#161616", fontWeight:600 }}>{t.dur}</div>
          </div>
          <div>
            <div style={{ fontSize:11, fontFamily:"IBM Plex Mono, monospace", textTransform:"uppercase", letterSpacing:"0.1em", color:"#8d8d8d", marginBottom:4 }}>Salário médio</div>
            <div style={{ fontSize:15, color:"#161616", fontWeight:600 }}>{t.salary}</div>
          </div>
        </div>
      </div>
      <div style={{ position:"absolute", top:40, right:40, width:40, height:40, border:"1px solid "+(h?"#0f62fe":"#c6c6c6"), background: h?"#0f62fe":"transparent", color: h?"#fff":"#161616", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s" }}>
        <Arrow size={16}/>
      </div>
    </div>
  );
}
window.TrackGrid = TrackGrid;
