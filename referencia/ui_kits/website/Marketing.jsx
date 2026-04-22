// Marketing.jsx — partner logos, testimonials, instructor spotlight, outcomes, FAQ

function PartnerStrip() {
  // wordmark-style text logos — no raster, no distortion
  const partners = [
    { n:"Google", w:700, style:{ fontFamily:"Georgia,serif" } },
    { n:"IBM", w:800, style:{ letterSpacing:"-0.04em" } },
    { n:"Microsoft", w:500 },
    { n:"Amazon", w:600, style:{ fontStyle:"italic" } },
    { n:"Nubank", w:800, style:{ letterSpacing:"-0.02em" } },
    { n:"iFood", w:700 },
    { n:"Stone", w:600 },
    { n:"Mercado Livre", w:500, style:{ letterSpacing:"-0.01em" } },
  ];
  return (
    <section style={{ background:"#fff", borderBottom:"1px solid #e0e0e0", padding:"48px 16px" }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <p style={{ fontFamily:"IBM Plex Mono, monospace", fontSize:11, letterSpacing:"0.14em", textTransform:"uppercase", color:"#8d8d8d", textAlign:"center", margin:"0 0 32px" }}>
          Nossos alunos trabalham em empresas como
        </p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(8,1fr)", gap:1, background:"#e0e0e0", border:"1px solid #e0e0e0" }}>
          {partners.map(p => (
            <div key={p.n} style={{ background:"#fff", padding:"28px 16px", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:20, fontWeight:p.w, color:"#8d8d8d", whiteSpace:"nowrap", ...p.style }}>{p.n}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Outcomes() {
  return (
    <section style={{ padding:"96px 16px", background:"#161616", color:"#fff" }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1.2fr", gap:64, marginBottom:64, alignItems:"flex-end" }}>
          <div>
            <span style={{ fontFamily:"IBM Plex Mono, monospace", fontSize:12, letterSpacing:"0.14em", textTransform:"uppercase", color:"#4589ff" }}>Resultados que importam</span>
            <h2 style={{ fontFamily:"'IBM Plex Serif', Georgia, serif", fontWeight:300, fontSize:56, letterSpacing:"-0.02em", lineHeight:1.05, margin:"16px 0 0", color:"#fff" }}>
              O que acontece <span style={{ fontStyle:"italic", color:"#4589ff" }}>depois</span> da formação.
            </h2>
          </div>
          <p style={{ fontSize:18, color:"#c6c6c6", lineHeight:1.55, margin:0 }}>
            Acompanhamos a trajetória dos nossos alunos após a conclusão. Os dados abaixo refletem as turmas formadas entre 2024 e 2026.
          </p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:1, background:"#393939", border:"1px solid #393939" }}>
          {[
            { v:"87%", l:"Conseguem vaga ou promoção em até 6 meses", n:"01" },
            { v:"+42%", l:"Aumento médio de salário após a formação", n:"02" },
            { v:"3.2x", l:"Mais chamadas para entrevistas com portfólio", n:"03" },
            { v:"R$ 11k", l:"Salário mediano em primeiro cargo júnior", n:"04" },
          ].map(s => (
            <div key={s.n} style={{ background:"#161616", padding:"40px 28px", position:"relative" }}>
              <span style={{ position:"absolute", top:20, right:20, fontFamily:"IBM Plex Mono, monospace", fontSize:11, color:"#525252" }}>{s.n}</span>
              <div style={{ fontFamily:"'IBM Plex Serif', Georgia, serif", fontWeight:400, fontSize:56, letterSpacing:"-0.03em", color:"#fff", lineHeight:1 }}>{s.v}</div>
              <div style={{ fontSize:14, color:"#c6c6c6", lineHeight:1.5, marginTop:20, maxWidth:220 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    { q:"Em quatro meses eu saí de análise de dados em planilha para deploy de modelos em produção. A trilha de MLOps foi decisiva.", n:"Juliana Almeida", r:"ML Engineer · Nubank", g:["#f4d3b3","#c89474"] },
    { q:"Os projetos reais foram o que me destacaram em entrevista. Mostrei código, métricas e decisões — não só certificados.", n:"Thiago Nakamura", r:"Data Scientist · iFood", g:["#b3d4ff","#4589ff"] },
    { q:"A mentoria semanal me tirou de travas que eu teria sozinho. Paguei o curso em três meses com o aumento do novo cargo.", n:"Leticia Freitas", r:"AI Engineer · Stone", g:["#b3e4c4","#4a8a60"] },
  ];
  return (
    <section style={{ padding:"96px 16px", background:"#f4f4f4", borderTop:"1px solid #e0e0e0", borderBottom:"1px solid #e0e0e0" }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:56, gap:24, flexWrap:"wrap" }}>
          <div style={{ maxWidth:600 }}>
            <span style={{ fontFamily:"IBM Plex Mono, monospace", fontSize:12, letterSpacing:"0.14em", textTransform:"uppercase", color:"#0f62fe" }}>Histórias reais</span>
            <h2 style={{ fontFamily:"'IBM Plex Serif', Georgia, serif", fontWeight:300, fontSize:48, letterSpacing:"-0.02em", lineHeight:1.1, margin:"16px 0 0", color:"#161616" }}>
              Do <span style={{ fontStyle:"italic" }}>primeiro modelo</span> ao<br/>primeiro cargo na área.
            </h2>
          </div>
          <div style={{ display:"flex", gap:4 }}>
            <button style={navBtn(false)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 6l-6 6 6 6"/></svg></button>
            <button style={navBtn(true)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6l6 6-6 6"/></svg></button>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:1, background:"#e0e0e0", border:"1px solid #e0e0e0" }}>
          {items.map((t,i) => (
            <figure key={i} style={{ background:"#fff", padding:"40px 32px", margin:0, display:"flex", flexDirection:"column" }}>
              <span style={{ fontFamily:"'IBM Plex Serif', Georgia, serif", fontSize:72, lineHeight:0.6, color:"#0f62fe", marginBottom:24 }}>“</span>
              <blockquote style={{ margin:"0 0 32px", fontSize:17, lineHeight:1.5, color:"#161616", flex:1 }}>{t.q}</blockquote>
              <figcaption style={{ display:"flex", alignItems:"center", gap:14, paddingTop:20, borderTop:"1px solid #e0e0e0" }}>
                <div style={{ width:44, height:44, borderRadius:"50%", background:`linear-gradient(135deg,${t.g[0]},${t.g[1]})` }}/>
                <div>
                  <div style={{ fontSize:14, fontWeight:600, color:"#161616" }}>{t.n}</div>
                  <div style={{ fontSize:12, color:"#525252" }}>{t.r}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
function navBtn(){ return { width:40, height:40, background:"#fff", border:"1px solid #c6c6c6", color:"#161616", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }; }

function InstructorSpotlight({ onNav }) {
  const faculty = [
    { name:"Dr. Fernando Marques", title:"Ex-DeepMind · PhD USP", topic:"Foundations & Research", g:["#d4c3a8","#8a6d42"] },
    { name:"Camila Tavares", title:"Staff ML @ IBM Research", topic:"LLMs & Agentes", g:["#f4d3b3","#c89474"] },
    { name:"Dr. Ana Ribeiro", title:"Pesquisadora · UFRJ", topic:"Estatística aplicada", g:["#b3d4ff","#4589ff"] },
    { name:"Lucas Moura", title:"Principal Eng · Nubank", topic:"Deep Learning na prática", g:["#e4b3b3","#b05050"] },
  ];
  return (
    <section style={{ padding:"112px 16px", background:"#fff", borderBottom:"1px solid #e0e0e0" }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1.4fr", gap:80, marginBottom:64, alignItems:"flex-end" }}>
          <div>
            <span style={{ fontFamily:"IBM Plex Mono, monospace", fontSize:12, letterSpacing:"0.14em", textTransform:"uppercase", color:"#0f62fe" }}>Corpo docente</span>
            <h2 style={{ fontFamily:"'IBM Plex Serif', Georgia, serif", fontWeight:300, fontSize:52, letterSpacing:"-0.02em", lineHeight:1.05, margin:"16px 0 24px", color:"#161616" }}>
              Aprenda com quem <span style={{ fontStyle:"italic", color:"#0f62fe" }}>constrói</span> IA.
            </h2>
          </div>
          <p style={{ fontSize:18, color:"#525252", lineHeight:1.6, margin:"0 0 8px", borderLeft:"2px solid #0f62fe", paddingLeft:24, maxWidth:560 }}>
            Não ensinamos IA a partir de resumos. Cada professor trabalha ativamente com pesquisa, produtos ou engenharia de ML em empresas como Google, IBM, Nubank e universidades de referência.
          </p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:1, background:"#e0e0e0", border:"1px solid #e0e0e0" }}>
          {faculty.map((f,i) => (
            <div key={i} style={{ background:"#fff" }}>
              <div style={{ aspectRatio:"4/5", background:`linear-gradient(160deg, ${f.g[0]}, ${f.g[1]})`, position:"relative", overflow:"hidden" }}>
                <svg viewBox="0 0 200 250" width="100%" height="100%" style={{ position:"absolute", inset:0 }}>
                  <ellipse cx="100" cy="95" rx="38" ry="46" fill="rgba(0,0,0,0.25)"/>
                  <path d="M30 250 C30 180 65 145 100 145 C135 145 170 180 170 250 Z" fill="rgba(0,0,0,0.35)"/>
                </svg>
                <span style={{ position:"absolute", top:16, left:16, background:"rgba(255,255,255,0.95)", color:"#0f62fe", fontSize:10, fontWeight:600, letterSpacing:"0.14em", textTransform:"uppercase", padding:"4px 8px", fontFamily:"IBM Plex Mono, monospace" }}>0{i+1}</span>
              </div>
              <div style={{ padding:"20px 20px 24px" }}>
                <div style={{ fontFamily:"IBM Plex Mono, monospace", fontSize:11, color:"#0f62fe", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:8 }}>{f.topic}</div>
                <div style={{ fontSize:17, fontWeight:600, color:"#161616", marginBottom:4 }}>{f.name}</div>
                <div style={{ fontSize:13, color:"#525252" }}>{f.title}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display:"flex", justifyContent:"center", marginTop:40 }}>
          <button onClick={()=>onNav("/professores")} style={{ background:"transparent", border:"1px solid #161616", color:"#161616", padding:"14px 24px", fontSize:14, fontWeight:600, cursor:"pointer", display:"inline-flex", gap:10, alignItems:"center", fontFamily:"inherit" }}>
            Ver todos os 24 professores <Arrow/>
          </button>
        </div>
      </div>
    </section>
  );
}

function Curriculum() {
  const pillars = [
    { n:"01", t:"Fundamentos matemáticos", d:"Álgebra linear, cálculo e estatística — aplicados, sem jargão acadêmico.", items:["Vetores e matrizes","Probabilidade","Estatística inferencial"] },
    { n:"02", t:"Programação em Python", d:"Do básico aos padrões de código usados em times profissionais de ML.", items:["Python moderno","NumPy, Pandas","Testes e tipagem"] },
    { n:"03", t:"Machine Learning clássico", d:"Modelos supervisionados e não-supervisionados com projetos de ponta a ponta.", items:["Regressão e classificação","Ensembles","Clustering e dimensionalidade"] },
    { n:"04", t:"Deep Learning moderno", d:"Redes neurais, visão computacional, NLP e arquiteturas Transformer.", items:["PyTorch","Transformers","Fine-tuning"] },
    { n:"05", t:"IA Generativa em produção", d:"Agentes, RAG, orquestração e padrões emergentes de aplicação.", items:["LLMs e embeddings","RAG e agentes","Guardrails"] },
    { n:"06", t:"MLOps e produção", d:"Deploy, monitoramento e operação de sistemas de ML em escala.", items:["CI/CD para ML","Monitoramento","Observabilidade"] },
  ];
  return (
    <section style={{ padding:"112px 16px", background:"#f4f4f4", borderBottom:"1px solid #e0e0e0" }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <div style={{ maxWidth:720, marginBottom:64 }}>
          <span style={{ fontFamily:"IBM Plex Mono, monospace", fontSize:12, letterSpacing:"0.14em", textTransform:"uppercase", color:"#0f62fe" }}>Currículo</span>
          <h2 style={{ fontFamily:"'IBM Plex Serif', Georgia, serif", fontWeight:300, fontSize:52, letterSpacing:"-0.02em", lineHeight:1.05, margin:"16px 0 20px", color:"#161616" }}>
            Seis pilares. <span style={{ fontStyle:"italic", color:"#0f62fe" }}>Uma</span> carreira.
          </h2>
          <p style={{ fontSize:18, color:"#525252", lineHeight:1.55, margin:0 }}>
            Nosso currículo foi desenhado com engenheiros de IA de empresas como Google, IBM e Nubank. É o mesmo caminho que eles usariam para contratar alguém hoje.
          </p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:1, background:"#e0e0e0", border:"1px solid #e0e0e0" }}>
          {pillars.map(p => (
            <div key={p.n} style={{ background:"#fff", padding:"40px 32px" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
                <span style={{ fontFamily:"'IBM Plex Serif', Georgia, serif", fontWeight:300, fontSize:44, color:"#0f62fe", letterSpacing:"-0.02em" }}>{p.n}</span>
                <span style={{ width:32, height:1, background:"#0f62fe" }}/>
              </div>
              <h3 style={{ fontSize:20, fontWeight:700, color:"#161616", letterSpacing:"-0.01em", margin:"0 0 12px" }}>{p.t}</h3>
              <p style={{ fontSize:14, color:"#525252", lineHeight:1.55, margin:"0 0 20px" }}>{p.d}</p>
              <ul style={{ listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:8, borderTop:"1px solid #e0e0e0", paddingTop:20 }}>
                {p.items.map(it => (
                  <li key={it} style={{ display:"flex", alignItems:"center", gap:10, fontSize:13, color:"#393939" }}>
                    <span style={{ width:6, height:6, background:"#0f62fe" }}/> {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = React.useState(0);
  const faqs = [
    { q:"Preciso de conhecimento prévio em programação ou matemática?", a:"Não. Começamos do zero: há uma trilha introdutória de Python e outra de matemática aplicada. Quem já tem base avança rapidamente pelos módulos iniciais e foca nos avançados." },
    { q:"Como funciona o acesso aos cursos e materiais?", a:"Você tem acesso imediato após o cadastro. Cursos grátis ficam disponíveis permanentemente; planos premium incluem acesso vitalício a todos os cursos da biblioteca." },
    { q:"Os certificados são reconhecidos pelo mercado?", a:"Sim. Cada certificado indica o curso, carga horária e projetos concluídos. Nossas parcerias com IBM e grandes empresas brasileiras dão credibilidade à formação." },
    { q:"Posso pagar parcelado?", a:"Sim. Os planos premium podem ser pagos em até 12x no cartão ou com desconto à vista via Pix. Também oferecemos planos mensais sem fidelidade." },
    { q:"Como funciona a mentoria?", a:"Alunos premium participam de sessões semanais em grupos pequenos com professores da plataforma, além de tirar dúvidas no fórum com SLA de 24h em dias úteis." },
    { q:"E se eu não gostar?", a:"Garantia incondicional de 7 dias. Se o conteúdo não for para você, devolvemos 100% do valor pago, sem perguntas." },
  ];
  return (
    <section style={{ padding:"112px 16px", background:"#fff", borderBottom:"1px solid #e0e0e0" }}>
      <div style={{ maxWidth:1040, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1.4fr", gap:80, alignItems:"flex-start" }}>
        <div>
          <span style={{ fontFamily:"IBM Plex Mono, monospace", fontSize:12, letterSpacing:"0.14em", textTransform:"uppercase", color:"#0f62fe" }}>Perguntas frequentes</span>
          <h2 style={{ fontFamily:"'IBM Plex Serif', Georgia, serif", fontWeight:300, fontSize:44, letterSpacing:"-0.02em", lineHeight:1.05, margin:"16px 0 24px", color:"#161616" }}>
            Antes de<br/><span style={{ fontStyle:"italic", color:"#0f62fe" }}>começar</span>.
          </h2>
          <p style={{ fontSize:15, color:"#525252", lineHeight:1.6, margin:"0 0 16px" }}>
            Ainda tem dúvidas? Nosso time responde em até 24h.
          </p>
          <a style={{ fontSize:14, fontWeight:600, color:"#0f62fe", display:"inline-flex", alignItems:"center", gap:6, cursor:"pointer" }}>Falar com um consultor <Arrow size={14}/></a>
        </div>
        <div style={{ borderTop:"1px solid #161616" }}>
          {faqs.map((f,i) => (
            <div key={i} style={{ borderBottom:"1px solid #e0e0e0" }}>
              <button onClick={()=>setOpen(open===i?-1:i)} style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"24px 0", background:"transparent", border:"none", fontFamily:"inherit", textAlign:"left", cursor:"pointer", color:"#161616" }}>
                <span style={{ fontSize:18, fontWeight:600, letterSpacing:"-0.01em", paddingRight:16 }}>{f.q}</span>
                <span style={{ width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, border:"1px solid "+(open===i?"#0f62fe":"#c6c6c6"), color: open===i?"#0f62fe":"#161616", background: open===i?"#edf5ff":"transparent", transition:"all .2s" }}>{open===i ? "−" : "+"}</span>
              </button>
              {open===i && <div style={{ paddingBottom:28, fontSize:15, color:"#525252", lineHeight:1.6, maxWidth:640 }}>{f.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Manifesto() {
  return (
    <section style={{ padding:"112px 16px", background:"#edf5ff", borderBottom:"1px solid #e0e0e0" }}>
      <div style={{ maxWidth:1040, margin:"0 auto" }}>
        <span style={{ fontFamily:"IBM Plex Mono, monospace", fontSize:12, letterSpacing:"0.14em", textTransform:"uppercase", color:"#0f62fe" }}>Manifesto</span>
        <p style={{ fontFamily:"'IBM Plex Serif', Georgia, serif", fontWeight:300, fontSize:44, letterSpacing:"-0.02em", lineHeight:1.25, margin:"24px 0 0", color:"#161616" }}>
          Acreditamos que o Brasil pode formar a próxima geração de profissionais de IA <span style={{ fontStyle:"italic", color:"#0f62fe" }}>sem copiar</span> o que vem de fora — construindo conhecimento próprio, em português, com a profundidade técnica que o mercado exige e a acessibilidade que nosso contexto pede.
        </p>
        <div style={{ marginTop:40, fontSize:13, color:"#525252", fontFamily:"IBM Plex Mono, monospace", letterSpacing:"0.1em", textTransform:"uppercase" }}>— Equipe CFIA</div>
      </div>
    </section>
  );
}

Object.assign(window, { PartnerStrip, Outcomes, Testimonials, InstructorSpotlight, Curriculum, FAQ, Manifesto });
