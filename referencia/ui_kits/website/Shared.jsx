// Shared.jsx — atoms used across screens
function Eyebrow({ children }) {
  return <span style={{ display:"inline-flex", fontSize:14, fontWeight:600, padding:"6px 16px", background:"#edf5ff", color:"#0043ce", border:"1px solid #a6c8ff", letterSpacing:0, marginBottom:20 }}>{children}</span>;
}
function SectionHeader({ eyebrow, title, lead, align="center" }) {
  return (
    <div style={{ textAlign: align, marginBottom: 48, maxWidth: 720, margin: align==="center" ? "0 auto 48px" : "0 0 48px" }}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.02em", color:"#161616", margin: "0 0 16px", lineHeight: 1.15 }}>{title}</h2>
      {lead && <p style={{ fontSize: 18, color: "#525252", lineHeight: 1.55, margin: 0 }}>{lead}</p>}
    </div>
  );
}
function Stat({ value, label, right }) {
  return (
    <div style={{ padding: "40px 24px", textAlign: "center", borderRight: right ? "1px solid #e0e0e0" : "none" }}>
      <div style={{ fontSize: 30, fontWeight: 700, color: "#0f62fe", marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 14, color: "#525252" }}>{label}</div>
    </div>
  );
}
function IconTile({ size=48, children }) {
  return <div style={{ width: size, height: size, background: "#edf5ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#0f62fe", marginBottom: 24 }}>{children}</div>;
}
function Arrow({ size=16 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
}
function Check({ size=20, color="#0f62fe" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/></svg>;
}
function Clock({ size=16 }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/></svg>;}
function Star({ size=12, filled=true }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill={filled?"#f1c21b":"none"} stroke="#f1c21b" strokeWidth="2"><path d="M12 2l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/></svg>;}
function Users({ size=16 }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="7" r="4"/><path d="M17 11a3 3 0 1 0 0-6M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2M17 15a4 4 0 0 1 4 4v2"/></svg>;}
function Lock({ size=12 }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="11" width="14" height="10"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>;}

function PrimaryBtn({ children, onClick, size="md", full }) {
  const p = size==="lg" ? "16px 32px" : size==="sm" ? "6px 12px" : "10px 18px";
  const fs = size==="lg" ? 16 : size==="sm" ? 12 : 14;
  return <button onClick={onClick} style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", gap:8, background:"#0f62fe", color:"#fff", border:"none", fontWeight:600, fontSize:fs, padding:p, cursor:"pointer", width: full?"100%":"auto", fontFamily:"inherit" }}>{children}</button>;
}
function SecondaryBtn({ children, onClick, full }) {
  return <button onClick={onClick} style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", gap:8, background:"#fff", color:"#161616", border:"1px solid #c6c6c6", fontWeight:600, fontSize:14, padding:"10px 18px", cursor:"pointer", width: full?"100%":"auto", fontFamily:"inherit" }}>{children}</button>;
}
function GhostBtn({ children, onClick, full }) {
  return <button onClick={onClick} style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", gap:8, background:"transparent", color:"#0f62fe", border:"1px solid #0f62fe", fontWeight:600, fontSize:13, padding:"10px 14px", cursor:"pointer", width: full?"100%":"auto", fontFamily:"inherit" }}>{children}</button>;
}
function CTABand({ onNav }) {
  return (
    <section style={{ background: "#0f62fe", padding: "96px 16px", textAlign: "center" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h2 style={{ color: "#fff", fontSize: 44, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 20px", lineHeight: 1.1 }}>Seu próximo passo na carreira começa aqui</h2>
        <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 18, margin: "0 0 36px" }}>Comece hoje e construa seu futuro na área de Inteligência Artificial</p>
        <button onClick={() => onNav("/cadastro")} style={{ background: "#fff", color: "#0f62fe", fontSize: 16, fontWeight: 700, padding: "18px 36px", border: "none", cursor: "pointer", display:"inline-flex", alignItems:"center", gap:12 }}>Começar gratuitamente <Arrow size={20}/></button>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginTop: 20 }}>Sem cartão&nbsp;·&nbsp;Acesso imediato&nbsp;·&nbsp;Certificado incluso</p>
      </div>
    </section>
  );
}

Object.assign(window, { Eyebrow, SectionHeader, Stat, IconTile, Arrow, Check, Clock, Star, Users, Lock, PrimaryBtn, SecondaryBtn, GhostBtn, CTABand });
