// Courses.jsx — course card + catalog + detail page
const COURSES = [
  { slug:"fundamentos-ml", title:"Fundamentos de Machine Learning com Python", instructor:"Ana Ribeiro", category:"Machine Learning", level:"Iniciante", price:0, rating:4.9, students:1284, thumb:"#0f62fe" },
  { slug:"deep-learning", title:"Deep Learning: redes neurais do zero", instructor:"Lucas Moura", category:"Deep Learning", level:"Intermediário", price:299, rating:4.8, students:847, thumb:"#002d9c" },
  { slug:"llm-producao", title:"Construindo agentes com LLMs em produção", instructor:"Camila Tavares", category:"IA Generativa", level:"Avançado", price:499, rating:4.9, students:487, thumb:"#393939" },
  { slug:"estatistica", title:"Estatística aplicada para Ciência de Dados", instructor:"Rafael Souza", category:"Data Science", level:"Iniciante", price:0, rating:4.7, students:2104, thumb:"#4589ff" },
  { slug:"mlops", title:"MLOps: deploy, monitoramento e CI/CD", instructor:"Bianca Costa", category:"MLOps", level:"Avançado", price:399, rating:4.8, students:312, thumb:"#161616" },
  { slug:"nlp-python", title:"NLP moderno com Python e Transformers", instructor:"Diego Lemos", category:"NLP", level:"Intermediário", price:349, rating:4.9, students:621, thumb:"#0043ce" },
];

function CourseCard({ c, onNav }) {
  const [h, setH] = React.useState(false);
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
         onClick={()=>onNav("/cursos/"+c.slug)}
         style={{ background: h ? "#f4f4f4" : "#fff", borderBottom: h ? "2px solid #0f62fe" : "2px solid transparent", cursor:"pointer", transition:"all .2s", display:"flex", flexDirection:"column" }}>
      <div style={{ aspectRatio:"16/9", background: `linear-gradient(135deg, ${c.thumb} 0%, #001d6c 100%)`, position:"relative", display:"flex", alignItems:"center", justifyContent:"center", color:"#a6c8ff", fontFamily:"IBM Plex Mono, monospace", fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase" }}>
        {c.category}
        <span style={{ position:"absolute", top:10, left:10, fontSize:11, fontWeight:600, padding:"4px 8px", background: c.price===0 ? "#24a148" : "#161616", color:"#fff", display:"inline-flex", alignItems:"center", gap:4 }}>
          {c.price===0 ? "Grátis" : <><Lock size={11}/> Premium</>}
        </span>
        {h && <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.1)", display:"flex", alignItems:"flex-end", justifyContent:"flex-end", padding:16 }}>
          <div style={{ width:32, height:32, background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", color:"#0f62fe" }}><Arrow /></div>
        </div>}
      </div>
      <div style={{ padding:16, display:"flex", flexDirection:"column", flex:1 }}>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, fontWeight:500, textTransform:"uppercase", letterSpacing:"0.08em", color:"#525252", marginBottom:8 }}>
          <span>{c.category}</span><span>{c.level}</span>
        </div>
        <h3 style={{ fontSize:15, fontWeight:600, lineHeight:1.35, color:"#161616", margin:"0 0 4px", flex:1 }}>{c.title}</h3>
        <p style={{ fontSize:13, color:"#525252", margin:"0 0 12px" }}>{c.instructor}</p>
        <div style={{ display:"flex", alignItems:"center", gap:4, marginBottom:12, fontSize:13 }}>
          <span style={{ display:"inline-flex", gap:1 }}>{[1,2,3,4,5].map(i => <Star key={i} filled={i <= Math.round(c.rating)} />)}</span>
          <b style={{ color:"#161616" }}>{c.rating.toString().replace(".",",")}</b>
          <span style={{ color:"#8d8d8d", fontSize:12 }}>({c.students.toLocaleString("pt-BR")})</span>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:12, borderTop:"1px solid #e0e0e0" }}>
          <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:13, color:"#525252" }}><Users size={14}/>{c.students.toLocaleString("pt-BR")}</span>
          <span style={{ fontSize:15, fontWeight:600, color:"#161616" }}>{c.price===0 ? "Acesso livre" : `R$ ${c.price}`}</span>
        </div>
      </div>
    </div>
  );
}

function FeaturedCourses({ onNav }) {
  return (
    <section style={{ padding:"96px 16px", background:"#fff", borderBottom:"1px solid #e0e0e0" }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:48, gap:24 }}>
          <div>
            <Eyebrow>Cursos em destaque</Eyebrow>
            <h2 style={{ fontSize:36, fontWeight:700, letterSpacing:"-0.02em", color:"#161616", margin:0 }}>Comece pelos mais populares</h2>
          </div>
          <a onClick={()=>onNav("/cursos")} style={{ display:"inline-flex", alignItems:"center", gap:8, fontSize:14, fontWeight:600, color:"#0f62fe", cursor:"pointer", whiteSpace:"nowrap" }}>Ver todos os cursos <Arrow/></a>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:1, background:"#e0e0e0", border:"1px solid #e0e0e0" }}>
          {COURSES.slice(0,3).map(c => <CourseCard key={c.slug} c={c} onNav={onNav}/>)}
        </div>
      </div>
    </section>
  );
}

function CoursesCatalog({ onNav }) {
  const [level, setLevel] = React.useState("all");
  const [price, setPrice] = React.useState("all");
  const filtered = COURSES.filter(c => (level==="all"||c.level.toLowerCase().startsWith(level)) && (price==="all" || (price==="free" ? c.price===0 : c.price>0)));
  return (
    <section style={{ padding:"56px 16px", background:"#fff", minHeight:"calc(100vh - 48px)" }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <div style={{ marginBottom:40 }}>
          <Eyebrow>Catálogo</Eyebrow>
          <h1 style={{ fontSize:40, fontWeight:700, letterSpacing:"-0.02em", color:"#161616", margin:"0 0 12px" }}>Todos os cursos</h1>
          <p style={{ fontSize:16, color:"#525252", margin:0 }}>{filtered.length} cursos disponíveis · atualizado toda semana</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"240px 1fr", gap:32 }}>
          <aside>
            <FilterBlock title="Nível">
              {[["all","Todos"],["ini","Iniciante"],["int","Intermediário"],["ava","Avançado"]].map(([k,l]) => (
                <FilterRow key={k} checked={level===k} onClick={()=>setLevel(k)} label={l}/>
              ))}
            </FilterBlock>
            <FilterBlock title="Preço">
              {[["all","Todos"],["free","Grátis"],["paid","Premium"]].map(([k,l]) => (
                <FilterRow key={k} checked={price===k} onClick={()=>setPrice(k)} label={l}/>
              ))}
            </FilterBlock>
            <FilterBlock title="Categoria">
              {["Machine Learning","Deep Learning","IA Generativa","Data Science","NLP","MLOps"].map(l => (
                <FilterRow key={l} checked={false} onClick={()=>{}} label={l}/>
              ))}
            </FilterBlock>
          </aside>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:1, background:"#e0e0e0", border:"1px solid #e0e0e0", alignSelf:"flex-start" }}>
            {filtered.map(c => <CourseCard key={c.slug} c={c} onNav={onNav}/>)}
          </div>
        </div>
      </div>
    </section>
  );
}
function FilterBlock({ title, children }) {
  return (
    <div style={{ borderTop:"1px solid #e0e0e0", padding:"16px 0" }}>
      <h4 style={{ fontSize:12, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em", color:"#525252", margin:"0 0 12px" }}>{title}</h4>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>{children}</div>
    </div>
  );
}
function FilterRow({ checked, onClick, label }) {
  return (
    <label onClick={onClick} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:14, color:"#161616" }}>
      <span style={{ width:16, height:16, border:"1px solid #8d8d8d", background: checked ? "#0f62fe" : "#fff", borderColor: checked ? "#0f62fe" : "#8d8d8d", display:"inline-flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:10 }}>{checked && "✓"}</span>
      {label}
    </label>
  );
}

function CourseDetail({ slug, onNav }) {
  const c = COURSES.find(x => x.slug===slug) || COURSES[0];
  const [open, setOpen] = React.useState(0);
  const modules = [
    { title:"Introdução e setup do ambiente", lessons:["Apresentação","Instalando Python e Jupyter","Primeiro notebook"]},
    { title:"Fundamentos de aprendizado supervisionado", lessons:["Regressão linear","Regressão logística","Avaliação de modelos"]},
    { title:"Árvores e ensembles", lessons:["Decision Trees","Random Forest","Gradient Boosting"]},
    { title:"Projeto final: pipeline completo", lessons:["Definindo o problema","Treinamento","Entrega e avaliação"]},
  ];
  return (
    <>
      <section style={{ background:"#161616", color:"#fff", padding:"56px 16px" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:48, alignItems:"flex-start" }}>
          <div>
            <a onClick={()=>onNav("/cursos")} style={{ fontSize:12, color:"#c6c6c6", textTransform:"uppercase", letterSpacing:"0.08em", cursor:"pointer", fontFamily:"IBM Plex Mono, monospace" }}>← CATÁLOGO · {c.category.toUpperCase()}</a>
            <h1 style={{ fontSize:44, fontWeight:700, letterSpacing:"-0.02em", lineHeight:1.1, margin:"24px 0 16px" }}>{c.title}</h1>
            <p style={{ fontSize:18, color:"#c6c6c6", margin:"0 0 24px", lineHeight:1.55 }}>Do zero à produção. Projetos reais em cada módulo e um portfólio para mostrar a empregadores.</p>
            <div style={{ display:"flex", gap:24, flexWrap:"wrap", fontSize:14, color:"#c6c6c6" }}>
              <span style={{ display:"inline-flex", alignItems:"center", gap:6 }}><Star/> <b style={{ color:"#fff" }}>{c.rating.toString().replace(".",",")}</b> ({c.students.toLocaleString("pt-BR")} alunos)</span>
              <span style={{ display:"inline-flex", alignItems:"center", gap:6 }}><Users size={16}/> {c.students.toLocaleString("pt-BR")} matriculados</span>
              <span style={{ display:"inline-flex", alignItems:"center", gap:6 }}><Clock/> 42 horas de conteúdo</span>
              <span>Criado por <b style={{ color:"#fff" }}>{c.instructor}</b></span>
            </div>
          </div>
          <div style={{ background:"#fff", color:"#161616", padding:24, display:"flex", flexDirection:"column", gap:16 }}>
            <div style={{ aspectRatio:"16/9", background:`linear-gradient(135deg, ${c.thumb}, #001d6c)`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff" }}>
              <div style={{ width:56, height:56, borderRadius:"50%", background:"rgba(255,255,255,0.9)", display:"flex", alignItems:"center", justifyContent:"center", color: c.thumb }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
            <div style={{ fontSize:32, fontWeight:700 }}>{c.price===0 ? "Acesso livre" : `R$ ${c.price}`}</div>
            <PrimaryBtn size="lg" full onClick={()=>onNav("/dashboard")}>{c.price===0 ? "Começar agora" : "Matricular-se"} <Arrow size={20}/></PrimaryBtn>
            <SecondaryBtn full>Adicionar à lista</SecondaryBtn>
            <ul style={{ listStyle:"none", padding:0, margin:"8px 0 0", display:"flex", flexDirection:"column", gap:10, fontSize:14, color:"#525252" }}>
              <li style={{ display:"flex", alignItems:"center", gap:10 }}><Check size={18}/> 42h de vídeo sob demanda</li>
              <li style={{ display:"flex", alignItems:"center", gap:10 }}><Check size={18}/> 12 projetos práticos</li>
              <li style={{ display:"flex", alignItems:"center", gap:10 }}><Check size={18}/> Certificado de conclusão</li>
              <li style={{ display:"flex", alignItems:"center", gap:10 }}><Check size={18}/> Acesso vitalício</li>
            </ul>
          </div>
        </div>
      </section>
      <section style={{ padding:"72px 16px", background:"#fff" }}>
        <div style={{ maxWidth:880, margin:"0 auto" }}>
          <h2 style={{ fontSize:28, fontWeight:700, letterSpacing:"-0.02em", color:"#161616", margin:"0 0 24px" }}>Conteúdo do curso</h2>
          <div style={{ border:"1px solid #e0e0e0" }}>
            {modules.map((m, i) => (
              <div key={i} style={{ borderTop: i>0 ? "1px solid #e0e0e0" : "none" }}>
                <button onClick={()=>setOpen(open===i?-1:i)} style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"18px 20px", background: open===i ? "#f4f4f4" : "#fff", border:"none", fontFamily:"inherit", fontSize:15, fontWeight:600, color:"#161616", cursor:"pointer", textAlign:"left" }}>
                  <span>Módulo {i+1} · {m.title}</span>
                  <span style={{ fontSize:13, color:"#525252", fontWeight:400 }}>{m.lessons.length} aulas · {open===i ? "▾" : "▸"}</span>
                </button>
                {open===i && (
                  <ul style={{ listStyle:"none", padding:"0 20px 18px", margin:0, display:"flex", flexDirection:"column", gap:8 }}>
                    {m.lessons.map((l, j) => (
                      <li key={j} style={{ display:"flex", alignItems:"center", gap:10, fontSize:14, color:"#525252", padding:"6px 0" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#0f62fe"><path d="M8 5v14l11-7z"/></svg>
                        {l}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

Object.assign(window, { CourseCard, FeaturedCourses, CoursesCatalog, CourseDetail, COURSES });
