// Navbar.jsx — Gray-100 sticky nav. Active link = 3px white underline.
function Navbar({ route, onNav, user }) {
  const links = [
    { href: "/cursos", label: "Cursos" },
    { href: "/professores", label: "Professores" },
    { href: "/sobre", label: "Sobre" },
  ];
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 40, background: "#161616" }}>
      <div style={{ maxWidth: 1584, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", height: 48, gap: 16 }}>
        <a onClick={() => onNav("/")} style={{ cursor: "pointer", color: "#fff", fontWeight: 600, fontSize: 18, letterSpacing: 0 }}>CFIA</a>
        <nav style={{ display: "flex", height: "100%", marginLeft: 12 }}>
          {links.map((l) => {
            const active = route.startsWith(l.href);
            return (
              <a key={l.href} onClick={() => onNav(l.href)} style={{ cursor:"pointer", position:"relative", padding:"0 16px", height:"100%", display:"flex", alignItems:"center", fontSize:13, color: active ? "#fff" : "#c6c6c6", fontWeight: active ? 600 : 400, letterSpacing:"0.16px" }}>
                {l.label}
                {active && <span style={{ position:"absolute", left:0, bottom:0, width:"100%", height:3, background:"#fff" }} />}
              </a>
            );
          })}
        </nav>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, height: "100%" }}>
          <button aria-label="Buscar" onClick={()=>onNav("/cursos")} style={{ background:"transparent", border:"none", color:"#fff", width:48, height:48, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>
          </button>
          {user ? (
            <>
              <button onClick={()=>onNav("/assinar")} style={{ background:"#0f62fe", color:"#fff", fontWeight:600, fontSize:12, padding:"0 16px", height:32, border:"none", cursor:"pointer" }}>Assinar</button>
              <div onClick={()=>onNav("/dashboard")} style={{ cursor:"pointer", width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#0f62fe,#002d9c)", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, marginLeft:6 }}>{user.initials}</div>
            </>
          ) : (
            <>
              <button onClick={()=>onNav("/entrar")} style={{ background:"transparent", border:"none", color:"#fff", fontSize:13, padding:"0 16px", height:48, cursor:"pointer" }}>Entrar</button>
              <button onClick={()=>onNav("/cadastro")} style={{ background:"#0f62fe", color:"#fff", fontWeight:600, fontSize:12, padding:"0 16px", height:48, border:"none", cursor:"pointer" }}>Começar grátis</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

window.Navbar = Navbar;
