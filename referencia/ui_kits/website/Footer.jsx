// Footer.jsx
function Footer({ onNav }) {
  const cols = [
    { title: "Plataforma", items: [["/cursos","Todos os cursos"],["/assinar","Planos e preços"],["/seja-instrutor","Seja instrutor"]] },
    { title: "Conta", items: [["/entrar","Entrar"],["/cadastro","Criar conta"],["/dashboard","Painel do aluno"]] },
    { title: "Legal", items: [["/termos","Termos de uso"],["/privacidade","Privacidade"],["/cookies","Cookies"]] },
  ];
  return (
    <footer style={{ background: "#161616", marginTop: "auto" }}>
      <div style={{ maxWidth: 1584, margin: "0 auto", padding: "64px 16px 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 32, marginBottom: 48 }}>
          <div>
            <div onClick={()=>onNav("/")} style={{ cursor:"pointer", color:"#fff", fontWeight:600, fontSize:22, marginBottom:14, letterSpacing:0 }}>cfia</div>
            <p style={{ color: "#c6c6c6", fontSize: 14, lineHeight: 1.55, maxWidth: 280, margin:"0 0 24px" }}>
              Centro de Formação em Inteligência Artificial. Conhecimento avançado e acessível no Brasil.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                {l:"Site", d:"M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"},
                {l:"LinkedIn", d:"M9 9v12M5 9v12M5 5a2 2 0 1 0 4 0 2 2 0 0 0-4 0M13 9v12M13 14c0-3 2-5 4-5s4 2 4 5v7"},
                {l:"Email", d:"M3 6h18v12H3zM3 6l9 7 9-7"},
                {l:"RSS", d:"M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16M5 19a1 1 0 1 0 2 0 1 1 0 0 0-2 0"},
              ].map((s) => (
                <a key={s.l} href="#" aria-label={s.l} style={{ width:48, height:48, background:"#393939", color:"#c6c6c6", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={s.d}/></svg>
                </a>
              ))}
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h3 style={{ color:"#c6c6c6", fontSize:12, textTransform:"uppercase", letterSpacing:"0.1em", margin:"0 0 20px", fontWeight:600 }}>{c.title}</h3>
              <ul style={{ listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:12 }}>
                {c.items.map(([href,label]) => (
                  <li key={href}><a onClick={()=>onNav(href)} style={{ color:"#c6c6c6", fontSize:14, cursor:"pointer" }}>{label}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", paddingTop: 32, borderTop:"1px solid #393939", color:"#c6c6c6", fontSize:12 }}>
          <span>© 2026 CFIA. Todos os direitos reservados.</span>
          <div style={{ display:"flex", gap:24 }}>
            <a style={{ cursor:"pointer" }}>Central de Ajuda</a>
            <a style={{ cursor:"pointer" }}>Contato</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
window.Footer = Footer;
