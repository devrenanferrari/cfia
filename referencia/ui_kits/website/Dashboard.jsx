// Dashboard.jsx — learner dashboard, upgraded with calendar, streak chart, recommendations
function Dashboard({ onNav }) {
  const inProgress = [
    { slug:"fundamentos-ml", title:"Fundamentos de Machine Learning com Python", module:"Módulo 3 · Árvores e ensembles", lesson:"Aula 14 · Random Forest", pct:62, thumb:"#0f62fe", dueIn:"hoje" },
    { slug:"deep-learning", title:"Deep Learning: redes neurais do zero", module:"Módulo 1 · Introdução", lesson:"Aula 3 · Perceptron", pct:18, thumb:"#002d9c", dueIn:"em 3 dias" },
  ];
  const journey = [
    { label:"Fundamentos de IA", done:true },
    { label:"Python e Dados", done:true },
    { label:"Machine Learning", done:false, current:true, pct:62 },
    { label:"Deep Learning", done:false },
    { label:"Deploy e Produção", done:false },
  ];
  // 12 weeks of activity
  const activity = [5,3,7,8,4,0,6,9,7,10,5,8,12,6,3,7,11,9,4,8,13,7,5,9,8,11,6,10,12,14,9,7,11,8,5,9];

  return (
    <section style={{ padding:"48px 16px 96px", background:"#f4f4f4", minHeight:"calc(100vh - 48px)" }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        {/* Header band */}
        <div style={{ background:"#161616", color:"#fff", padding:"40px 40px", marginBottom:24, display:"grid", gridTemplateColumns:"1.2fr 1fr", gap:48, alignItems:"center" }}>
          <div>
            <p style={{ fontFamily:"IBM Plex Mono, monospace", fontSize:12, letterSpacing:"0.14em", textTransform:"uppercase", color:"#4589ff", margin:"0 0 12px" }}>Sexta-feira · 18 abril 2026</p>
            <h1 style={{ fontFamily:"'IBM Plex Serif', Georgia, serif", fontWeight:300, fontSize:42, letterSpacing:"-0.02em", margin:"0 0 12px" }}>
              Bem-vindo de volta, <span style={{ fontStyle:"italic", color:"#4589ff" }}>Renan</span>.
            </h1>
            <p style={{ fontSize:16, color:"#c6c6c6", margin:0 }}>Você está a 2 aulas de concluir o módulo 3 de Machine Learning.</p>
          </div>
          <div style={{ display:"flex", gap:24, justifyContent:"flex-end" }}>
            {[["12","dias em sequência"],["47h","estudadas"],["#142","no ranking"]].map(([v,l]) => (
              <div key={l} style={{ textAlign:"right" }}>
                <div style={{ fontFamily:"'IBM Plex Serif', Georgia, serif", fontWeight:400, fontSize:40, letterSpacing:"-0.02em" }}>{v}</div>
                <div style={{ fontSize:11, color:"#8d8d8d", fontFamily:"IBM Plex Mono, monospace", textTransform:"uppercase", letterSpacing:"0.08em", marginTop:4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 360px", gap:24, alignItems:"flex-start" }}>
          {/* LEFT column */}
          <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
            {/* Continue where you left off */}
            <div style={{ background:"#fff", border:"1px solid #e0e0e0" }}>
              <div style={{ padding:"20px 24px", borderBottom:"1px solid #e0e0e0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <h2 style={{ fontSize:18, fontWeight:600, margin:0, color:"#161616" }}>Continue onde parou</h2>
                <a style={{ fontSize:13, color:"#0f62fe", cursor:"pointer", fontWeight:600 }}>Ver todos os cursos</a>
              </div>
              {inProgress.map((c,i) => (
                <div key={c.slug} onClick={()=>onNav("/cursos/"+c.slug)} style={{ display:"grid", gridTemplateColumns:"160px 1fr auto", gap:24, padding:24, cursor:"pointer", borderBottom: i<inProgress.length-1?"1px solid #e0e0e0":"none", alignItems:"center" }}>
                  <div style={{ aspectRatio:"16/9", background:`linear-gradient(135deg, ${c.thumb}, #001d6c)`, position:"relative" }}>
                    <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff" }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize:11, fontFamily:"IBM Plex Mono, monospace", textTransform:"uppercase", letterSpacing:"0.1em", color:"#0f62fe", marginBottom:6 }}>Próxima · {c.dueIn}</div>
                    <div style={{ fontSize:17, fontWeight:600, color:"#161616", letterSpacing:"-0.01em", margin:"0 0 6px" }}>{c.title}</div>
                    <div style={{ fontSize:13, color:"#525252", margin:"0 0 14px" }}>{c.module} · {c.lesson}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{ flex:1, height:3, background:"#e0e0e0" }}>
                        <div style={{ height:"100%", width:c.pct+"%", background:"#0f62fe" }}/>
                      </div>
                      <span style={{ fontSize:12, fontFamily:"IBM Plex Mono, monospace", color:"#525252" }}>{c.pct}%</span>
                    </div>
                  </div>
                  <PrimaryBtn>Continuar <Arrow size={14}/></PrimaryBtn>
                </div>
              ))}
            </div>

            {/* Activity chart */}
            <div style={{ background:"#fff", border:"1px solid #e0e0e0", padding:24 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
                <div>
                  <h2 style={{ fontSize:18, fontWeight:600, margin:"0 0 4px", color:"#161616" }}>Sua atividade</h2>
                  <p style={{ fontSize:13, color:"#525252", margin:0 }}>Minutos estudados por dia · últimas 12 semanas</p>
                </div>
                <div style={{ display:"flex", gap:4 }}>
                  {["Semana","Mês","12 sem"].map((l,i) => (
                    <button key={l} style={{ padding:"6px 12px", fontSize:12, fontFamily:"inherit", border:"1px solid #e0e0e0", background: i===2?"#161616":"#fff", color: i===2?"#fff":"#525252", cursor:"pointer", fontWeight:500 }}>{l}</button>
                  ))}
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:140, paddingBottom:20, borderBottom:"1px solid #e0e0e0" }}>
                {activity.map((v,i) => (
                  <div key={i} style={{ flex:1, height: (v/14*100)+"%", background: i===activity.length-1?"#0f62fe":"#a6c8ff", minHeight:4, position:"relative" }}>
                    {i===activity.length-1 && <span style={{ position:"absolute", top:-22, left:"50%", transform:"translateX(-50%)", fontSize:11, fontFamily:"IBM Plex Mono, monospace", color:"#0f62fe", fontWeight:600, whiteSpace:"nowrap" }}>{v}0min</span>}
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#8d8d8d", fontFamily:"IBM Plex Mono, monospace", letterSpacing:"0.06em", marginTop:10 }}>
                <span>JAN 27</span><span>FEB 10</span><span>FEB 24</span><span>MAR 10</span><span>MAR 24</span><span>HOJE</span>
              </div>
            </div>

            {/* Recommended next */}
            <div style={{ background:"#fff", border:"1px solid #e0e0e0" }}>
              <div style={{ padding:"20px 24px", borderBottom:"1px solid #e0e0e0" }}>
                <h2 style={{ fontSize:18, fontWeight:600, margin:"0 0 4px", color:"#161616" }}>Recomendados pra você</h2>
                <p style={{ fontSize:13, color:"#525252", margin:0 }}>Com base nos seus cursos atuais</p>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:1, background:"#e0e0e0" }}>
                {COURSES.slice(2,5).map(c => <CourseCard key={c.slug} c={c} onNav={onNav}/>)}
              </div>
            </div>
          </div>

          {/* RIGHT column */}
          <aside style={{ display:"flex", flexDirection:"column", gap:24 }}>
            {/* Journey */}
            <div style={{ background:"#fff", border:"1px solid #e0e0e0" }}>
              <div style={{ padding:"20px 24px", borderBottom:"1px solid #e0e0e0" }}>
                <span style={{ fontFamily:"IBM Plex Mono, monospace", fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", color:"#0f62fe" }}>Trilha</span>
                <h2 style={{ fontSize:18, fontWeight:600, margin:"4px 0 0", color:"#161616" }}>Engenheiro de IA</h2>
              </div>
              {journey.map((s, i) => (
                <div key={s.label} style={{ display:"flex", gap:14, padding:"16px 24px", borderBottom: i<journey.length-1?"1px solid #e0e0e0":"none", alignItems:"center", background: s.current?"#edf5ff":"#fff" }}>
                  <div style={{ width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, fontFamily:"IBM Plex Mono, monospace", background: s.done?"#0f62fe":s.current?"#161616":"#e0e0e0", color:(s.done||s.current)?"#fff":"#8d8d8d", flexShrink:0 }}>
                    {s.done?"✓":String(i+1).padStart(2,"0")}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:600, color: s.done?"#0043ce":s.current?"#161616":"#525252" }}>{s.label}</div>
                    {s.current && <div style={{ fontSize:11, fontFamily:"IBM Plex Mono, monospace", color:"#0f62fe", marginTop:2 }}>EM ANDAMENTO · {s.pct}%</div>}
                  </div>
                </div>
              ))}
            </div>

            {/* Streak */}
            <div style={{ background:"#161616", color:"#fff", padding:24 }}>
              <span style={{ fontFamily:"IBM Plex Mono, monospace", fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", color:"#4589ff" }}>Sequência</span>
              <div style={{ fontFamily:"'IBM Plex Serif', Georgia, serif", fontWeight:300, fontSize:56, letterSpacing:"-0.02em", lineHeight:1, margin:"12px 0 4px" }}>12<span style={{ fontSize:20, color:"#c6c6c6", marginLeft:8, fontStyle:"italic" }}>dias</span></div>
              <p style={{ fontSize:13, color:"#c6c6c6", margin:"0 0 20px" }}>Seu recorde é de 34 dias. Continue assim.</p>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4 }}>
                {["S","T","Q","Q","S","S","D"].map((d,i)=> <div key={d+i} style={{ fontSize:10, color:"#8d8d8d", textAlign:"center", fontFamily:"IBM Plex Mono, monospace" }}>{d}</div>)}
                {Array.from({length:28}).map((_,i) => (
                  <div key={i} style={{ aspectRatio:"1", background: i>=16 ? (i===27?"#0f62fe":"#4589ff") : (i<5?"#393939":"#0043ce"), opacity: i>=16 ? 1 : (i<5?0.4:0.8) }}/>
                ))}
              </div>
            </div>

            {/* Upcoming */}
            <div style={{ background:"#fff", border:"1px solid #e0e0e0" }}>
              <div style={{ padding:"20px 24px", borderBottom:"1px solid #e0e0e0" }}>
                <h2 style={{ fontSize:18, fontWeight:600, margin:0, color:"#161616" }}>Próximos eventos</h2>
              </div>
              {[
                { d:"22", m:"ABR", t:"Mentoria · LLMs em produção", sub:"19:00 · com Camila Tavares" },
                { d:"25", m:"ABR", t:"Entrega do projeto 3", sub:"Random Forest em Kaggle" },
                { d:"02", m:"MAI", t:"Workshop · Deploy com FastAPI", sub:"20:00 · ao vivo" },
              ].map((e,i) => (
                <div key={i} style={{ display:"flex", gap:16, padding:"16px 24px", borderBottom: i<2?"1px solid #e0e0e0":"none", alignItems:"center" }}>
                  <div style={{ width:48, height:48, border:"1px solid #0f62fe", color:"#0f62fe", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <div style={{ fontSize:16, fontWeight:700, lineHeight:1 }}>{e.d}</div>
                    <div style={{ fontSize:9, fontFamily:"IBM Plex Mono, monospace", letterSpacing:"0.08em", marginTop:2 }}>{e.m}</div>
                  </div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:"#161616", margin:"0 0 2px" }}>{e.t}</div>
                    <div style={{ fontSize:12, color:"#525252" }}>{e.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

// Stubs kept for compatibility (unused now on home)
function SocialProof(){ return null; }
function StatsBar(){ return null; }
function HowItWorks(){ return null; }

Object.assign(window, { Dashboard, SocialProof, StatsBar, HowItWorks });
