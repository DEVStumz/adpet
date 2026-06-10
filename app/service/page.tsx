"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

// ─── Animations & design tokens (same as landing page) ───────────────────────
const PAGE_STYLES = `
  @keyframes floatOrb0 {
    0%,100% { transform: translate(-50%,-50%) translateY(0px) scale(1); }
    33%     { transform: translate(-50%,-50%) translateY(-28px) scale(1.04); }
    66%     { transform: translate(-50%,-50%) translateY(14px) scale(0.97); }
  }
  @keyframes floatOrb1 {
    0%,100% { transform: translate(-50%,-50%) translateY(0px) translateX(0px); }
    40%     { transform: translate(-50%,-50%) translateY(-18px) translateX(16px); }
    70%     { transform: translate(-50%,-50%) translateY(20px) translateX(-10px); }
  }
  @keyframes floatOrb2 {
    0%,100% { transform: translate(-50%,-50%) rotate(0deg) scale(1); }
    50%     { transform: translate(-50%,-50%) rotate(8deg) scale(1.06); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes lineGrow {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-33.33%); }
  }
  @keyframes pulseRing {
    0%   { box-shadow: 0 0 0 0    rgba(26,92,56,0.4); }
    70%  { box-shadow: 0 0 0 12px rgba(26,92,56,0); }
    100% { box-shadow: 0 0 0 0    rgba(26,92,56,0); }
  }

  .sv-line {
    width: 3rem; height: 2px; background: var(--green);
    margin-bottom: 1.25rem; transform-origin: left;
    animation: lineGrow 0.6s ease forwards;
  }

  /* Service card */
  .sv-card {
    background: white; border: 1px solid var(--border);
    overflow: hidden; transition: box-shadow 0.3s, border-color 0.3s;
  }
  .sv-card.sv-open { box-shadow: 0 12px 48px rgba(26,92,56,0.1); border-color: var(--green-pale); }

  /* Process step */
  .sv-step { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px; }

  /* Buttons */
  .sv-btn-green {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: var(--green); color: white; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.75rem; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase;
    padding: 0.75rem 1.75rem; transition: background 0.25s, transform 0.2s; text-decoration: none;
  }
  .sv-btn-green:hover { background: var(--green-light); transform: translateY(-1px); }
  .sv-btn-ghost {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: transparent; color: white; border: 1px solid rgba(255,255,255,0.5); cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.75rem; font-weight: 400;
    letter-spacing: 0.1em; text-transform: uppercase;
    padding: 0.75rem 1.75rem; transition: all 0.25s; text-decoration: none;
  }
  .sv-btn-ghost:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.9); }
  .sv-btn-outline {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: transparent; color: var(--charcoal); border: 1px solid var(--charcoal); cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.75rem; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase;
    padding: 0.75rem 1.75rem; transition: all 0.25s; text-decoration: none;
  }
  .sv-btn-outline:hover { background: var(--charcoal); color: white; transform: translateY(-1px); }

  /* Stat */
  .sv-stat {
    text-align: center; padding: 2rem 1rem;
    border-right: 1px solid rgba(255,255,255,0.15); transition: background 0.3s;
  }
  .sv-stat:last-child { border-right: none; }
  .sv-stat:hover { background: rgba(255,255,255,0.06); }

  /* Form */
  .sv-field {
    width: 100%; background: transparent; border: none;
    border-bottom: 1px solid var(--border); padding: 0.75rem 0;
    font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
    color: var(--charcoal); outline: none; transition: border-color 0.2s;
  }
  .sv-field:focus { border-bottom-color: var(--green); }
  .sv-field::placeholder { color: var(--text-muted); font-size: 0.82rem; letter-spacing: 0.05em; }

  @media (max-width: 640px) {
    .sv-stat { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.15); }
    .sv-stat:last-child { border-bottom: none; }
    .sv-stats-row  { grid-template-columns: repeat(2,1fr) !important; }
    .sv-two-col    { grid-template-columns: 1fr !important; }
    .sv-acc-grid   { grid-template-columns: 1fr !important; }
    .sv-contact-grid { grid-template-columns: 1fr !important; }
  }
  @media (max-width: 768px) {
    .sv-two-col    { grid-template-columns: 1fr !important; }
    .sv-contact-grid { grid-template-columns: 1fr !important; }
  }
`;

// ─── Floating background orbs (same as landing) ──────────────────────────────
const ORB_C   = [{ z:320,x:"10%",y:"15%",d:"0s",t:"14s"},{z:180,x:"75%",y:"8%",d:"2s",t:"11s"},{z:240,x:"85%",y:"60%",d:"4s",t:"16s"},{z:140,x:"20%",y:"75%",d:"1s",t:"9s"},{z:200,x:"50%",y:"40%",d:"3s",t:"13s"}];
const RING_C  = [{ z:260,x:"90%",y:"20%",d:"0s",t:"20s"},{z:180,x:"5%",y:"55%",d:"6s",t:"18s"},{z:120,x:"60%",y:"90%",d:"3s",t:"15s"}];
const SHAPE_C = [{ type:"d",z:18,x:"15%",y:"25%",d:"0s",t:"12s"},{type:"c",z:14,x:"82%",y:"18%",d:"2s",t:"15s"},{type:"d",z:10,x:"70%",y:"72%",d:"4s",t:"10s"},{type:"c",z:16,x:"28%",y:"82%",d:"1s",t:"13s"}];

function Bg({ dark = false }: { dark?: boolean }) {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      {ORB_C.map((o,i) => { const op = dark ? 0.07+(i%3)*0.01 : 0.08+(i%3)*0.02; return <div key={i} style={{ position:"absolute",left:o.x,top:o.y,width:o.z,height:o.z,borderRadius:"50%",background:dark?`radial-gradient(circle,rgba(42,122,77,${op*2}) 0%,transparent 70%)`:`radial-gradient(circle,rgba(26,92,56,${op}) 0%,transparent 70%)`,animation:`floatOrb${i%3} ${o.t} ${o.d} ease-in-out infinite`,transform:"translate(-50%,-50%)",filter:"blur(1px)"}}/> })}
      {RING_C.map((r,i) => <div key={`r${i}`} style={{ position:"absolute",left:r.x,top:r.y,width:r.z,height:r.z,borderRadius:"50%",border:`1px solid ${dark?"rgba(42,122,77,0.15)":"rgba(26,92,56,0.1)"}`,animation:`floatOrb${(i+1)%3} ${r.t} ${r.d} ease-in-out infinite`,transform:"translate(-50%,-50%)"}}/>)}
      {SHAPE_C.map((s,i) => { const col=dark?"rgba(110,201,145,0.3)":"rgba(26,92,56,0.2)"; return <div key={`s${i}`} style={{ position:"absolute",left:s.x,top:s.y,animation:`floatOrb${i%3} ${s.t} ${s.d} ease-in-out infinite`,transform:"translate(-50%,-50%)"}}>{s.type==="d"?<div style={{width:s.z,height:s.z,border:`1.5px solid ${col}`,transform:"rotate(45deg)"}}/>:<svg width={s.z*2} height={s.z*2} viewBox="0 0 20 20" fill="none"><line x1="10" y1="2" x2="10" y2="18" stroke={col} strokeWidth="1.5"/><line x1="2" y1="10" x2="18" y2="10" stroke={col} strokeWidth="1.5"/></svg>}</div> })}
    </div>
  );
}

// ─── Marquee ─────────────────────────────────────────────────────────────────
const MARQUEE = ["Property Development","Automobile Services","Building Materials","General Contracts","Property Management","ADPET Investment","RC: 7202166"];
function Marquee() {
  const items = Array(3).fill(MARQUEE).flat();
  return (
    <div style={{ padding:"1rem 0",overflow:"hidden",background:"var(--charcoal)",borderTop:"1px solid rgba(255,255,255,0.08)"}}>
      <div style={{ display:"flex",gap:48,whiteSpace:"nowrap",fontFamily:"'DM Sans',sans-serif",fontSize:"0.68rem",textTransform:"uppercase",letterSpacing:"0.14em",color:"rgba(255,255,255,0.3)",animation:"marquee 28s linear infinite"}}>
        {items.map((t,i) => <span key={i} style={{flexShrink:0}}>{t}&nbsp;&nbsp;·</span>)}
      </div>
    </div>
  );
}

// ─── Services data ────────────────────────────────────────────────────────────
const SERVICES = [
  {
    id: "realestate",
    icon: <svg viewBox="0 0 48 48" fill="none" style={{ width: 36, height: 36 }}><rect x="6" y="20" width="36" height="22" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M2 22L24 6L46 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><rect x="18" y="30" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/><line x1="24" y1="30" x2="24" y2="42" stroke="currentColor" strokeWidth="1.5"/></svg>,
    label: "Real Estate & Property",
    tagline: "From land to landmark",
    headline: "Premium Property Development & Sales",
    desc: "End-to-end real estate development from land acquisition and architectural design to construction and key handover. We deliver residential, commercial, and mixed-use properties that exceed expectation.",
    bullets: ["Luxury residential estates & duplexes", "Commercial plazas & office complexes", "Land subdivision & estate planning", "Off-plan investment opportunities"],
    cta: "Browse Properties",
    ctaLink: "/sales?cat=House",
    img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  },
  {
    id: "automobile",
    icon: <svg viewBox="0 0 48 48" fill="none" style={{ width: 36, height: 36 }}><rect x="4" y="18" width="40" height="18" rx="4" stroke="currentColor" strokeWidth="2"/><path d="M10 18L15 8H33L38 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="14" cy="36" r="5" stroke="currentColor" strokeWidth="2"/><circle cx="34" cy="36" r="5" stroke="currentColor" strokeWidth="2"/><line x1="4" y1="28" x2="44" y2="28" stroke="currentColor" strokeWidth="1.5"/></svg>,
    label: "Automobile Division",
    tagline: "Drive excellence, every mile",
    headline: "Premium Automotive Sales & Care",
    desc: "Your complete automotive destination. We deal in brand-new and foreign-used premium vehicles, supply genuine spare parts, and operate a state-of-the-art auto care centre for fleet and personal needs.",
    bullets: ["New & certified pre-owned vehicles", "Full vehicle servicing & diagnostics", "Genuine OEM spare parts supply", "Fleet procurement & management"],
    cta: "Browse Cars",
    ctaLink: "/sales?cat=Car",
    img: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
  },
  {
    id: "materials",
    icon: <svg viewBox="0 0 48 48" fill="none" style={{ width: 36, height: 36 }}><rect x="4" y="28" width="40" height="14" rx="2" stroke="currentColor" strokeWidth="2"/><rect x="10" y="18" width="28" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="16" y="10" width="16" height="10" rx="1" stroke="currentColor" strokeWidth="1.5"/><line x1="24" y1="6" x2="24" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    label: "Building Materials",
    tagline: "The foundation of every great structure",
    headline: "High-Grade Construction Supply",
    desc: "We produce and distribute certified, high-grade building materials nationwide. From cement and structural steel to premium roofing and finishing materials quality inputs for quality outcomes.",
    bullets: ["Cement, rebar & structural steel", "Premium roofing systems", "Tiles, paints & finishing materials", "Bulk & wholesale distribution"],
    cta: "Request a Quote",
    ctaLink: "/#contact",
    img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
  },
  {
    id: "contracts",
    icon: <svg viewBox="0 0 48 48" fill="none" style={{ width: 36, height: 36 }}><rect x="8" y="6" width="32" height="38" rx="2" stroke="currentColor" strokeWidth="2"/><line x1="16" y1="16" x2="32" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="16" y1="22" x2="32" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="16" y1="28" x2="26" y2="28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="34" cy="36" r="6" fill="#1a5c38" stroke="currentColor" strokeWidth="1.5"/><path d="M31 36L33 38L37 34" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    label: "General Contracts",
    tagline: "Bridging supply chains with precision",
    headline: "Global Trade & Corporate Procurement",
    desc: "Large-scale corporate procurement, international merchandise trading, and general contracting. We connect clients to reliable supply chains with commercial agility and institutional reliability.",
    bullets: ["Corporate & government procurement", "International merchandise trading", "Supply chain management", "Import/export facilitation"],
    cta: "Start a Contract",
    ctaLink: "/#contact",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  },
  {
    id: "management",
    icon: <svg viewBox="0 0 48 48" fill="none" style={{ width: 36, height: 36 }}><circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2"/><path d="M24 14v10l6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M8 24h4M36 24h4M24 8v4M24 36v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    label: "Property Management",
    tagline: "Your assets, expertly managed",
    headline: "Professional Property Management",
    desc: "Let ADPET handle the complexity of property ownership. We manage residential and commercial portfolios, handle tenancy agreements, coordinate maintenance, and maximise your rental yield.",
    bullets: ["Tenant sourcing & screening", "Rent collection & documentation", "Routine maintenance coordination", "Annual yield & performance reporting"],
    cta: "Enquire Now",
    ctaLink: "/#contact",
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
  },
  {
    id: "consulting",
    icon: <svg viewBox="0 0 48 48" fill="none" style={{ width: 36, height: 36 }}><path d="M8 40L18 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="30" cy="20" r="12" stroke="currentColor" strokeWidth="2"/><path d="M26 20h8M30 16v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    label: "Consulting & Valuation",
    tagline: "Insight-driven investment decisions",
    headline: "Real Estate Consulting & Valuation",
    desc: "Independent property valuation, market feasibility studies, and investment advisory for private and corporate clients. We give you the data and insight to make confident investment decisions.",
    bullets: ["Certified property valuation", "Investment feasibility studies", "Title verification & due diligence", "Portfolio strategy advisory"],
    cta: "Book a Consultant",
    ctaLink: "/#contact",
    img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  },
];

// ─── Service Accordion Card ───────────────────────────────────────────────────
function ServiceCard({ svc }: { svc: typeof SERVICES[0] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`sv-card ${open ? "sv-open" : ""}`}>
      {/* Accordion toggle */}
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", background: "none", border: "none", padding: "1.75rem 2rem", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 20 }}
      >
        {/* Icon box */}
        <div style={{ flexShrink: 0, width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", background: open ? "var(--green)" : "var(--green-pale)", transition: "background 0.3s" }}>
          <div style={{ color: open ? "white" : "var(--green)", transition: "color 0.3s" }}>{svc.icon}</div>
        </div>
        {/* Text */}
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--green)", marginBottom: 4 }}>{svc.tagline}</p>
          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.15rem", fontWeight: 600, color: "var(--charcoal)", lineHeight: 1.2 }}>{svc.headline}</h3>
        </div>
        {/* Chevron */}
        <div style={{ flexShrink: 0, width: 32, height: 32, border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--green)", transition: "transform 0.3s", transform: open ? "rotate(180deg)" : "none" }}>
          <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </button>

      {/* Expanded content */}
      {open && (
        <div style={{ borderTop: "1px solid var(--border)" }}>
          {/* Image */}
          <div style={{ height: 200, overflow: "hidden" }}>
            <img src={svc.img} alt={svc.headline} style={{ width: "100%", height: "140%", objectFit: "cover", display: "block", objectPosition: "center 30%" }} />
          </div>
          <div style={{ padding: "1.5rem 2rem 2rem" }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.75, fontWeight: 300, marginBottom: "1.25rem" }}>{svc.desc}</p>
            <ul style={{ listStyle: "none", padding: 0, marginBottom: "1.5rem", display: "flex", flexDirection: "column", gap: 10 }}>
              {svc.bullets.map((b) => (
                <li key={b} style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "'DM Sans',sans-serif", fontSize: "0.83rem", color: "var(--charcoal)" }}>
                  <div style={{ width: 6, height: 6, background: "var(--green)", flexShrink: 0 }} />
                  {b}
                </li>
              ))}
            </ul>
            <Link href={svc.ctaLink} className="sv-btn-green">
              {svc.cta}
              <svg viewBox="0 0 16 16" fill="none" style={{ width: 12, height: 12 }}><path d="M3 8H13M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Contact form ─────────────────────────────────────────────────────────────
function ContactForm() {
  const [form, setForm] = useState({ name:"", email:"", sector:"", message:"" });
  const [sent, setSent] = useState(false);

  const F = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", marginBottom: 10 }}>{label}</label>
      {children}
    </div>
  );

  if (sent) return (
    <div style={{ textAlign: "center", padding: "3rem 0" }}>
      <div style={{ width: 56, height: 56, background: "var(--green-pale)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", animation: "pulseRing 2s ease infinite" }}>
        <svg viewBox="0 0 24 24" fill="none" style={{ width: 28, height: 28, color: "var(--green)" }}><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.7rem", fontWeight: 600, color: "var(--charcoal)", marginBottom: 10 }}>Enquiry Received</h3>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.6 }}>A member of our team will contact you within 1–2 business days.</p>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <F label="Full Name"><input type="text" required className="sv-field" placeholder="Your full name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} /></F>
        <F label="Email Address"><input type="email" required className="sv-field" placeholder="your@email.com" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} /></F>
      </div>
      <F label="Area of Interest">
        <select className="sv-field" style={{ cursor: "pointer" }} value={form.sector} onChange={(e) => setForm((p) => ({ ...p, sector: e.target.value }))}>
          <option value="">Select a service</option>
          <option>Real Estate &amp; Property Development</option>
          <option>Automobile Division</option>
          <option>Building Materials</option>
          <option>General Contracts &amp; Merchandise</option>
          <option>Property Management</option>
          <option>Real Estate Consulting &amp; Valuation</option>
          <option>General Enquiry</option>
        </select>
      </F>
      <F label="Message">
        <textarea required rows={4} className="sv-field" style={{ resize: "none" }} placeholder="Tell us about your enquiry..." value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} />
      </F>
      <button className="sv-btn-green" style={{ justifyContent: "center", padding: "1rem", fontSize: "0.78rem" }} onClick={() => { if (form.name && form.email && form.message) setSent(true); }}>
        Submit Enquiry
        <svg viewBox="0 0 16 16" fill="none" style={{ width: 13, height: 13 }}><path d="M3 8H13M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ServicesPage() {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const fn = () => setScroll(window.scrollY * 0.3);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <style>{PAGE_STYLES}</style>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section style={{ position: "relative", overflow: "hidden", minHeight: 500, display: "flex", alignItems: "flex-end" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <img src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1800&q=85" alt="" style={{ width: "100%", height: "115%", objectFit: "cover", objectPosition: "center 30%", transform: `translateY(${scroll}px)`, display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(10,32,20,0.88) 0%,rgba(10,32,20,0.62) 50%,rgba(10,32,20,0.4) 100%)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 180, background: "linear-gradient(to bottom,transparent,var(--off-white))" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(26,92,56,0.22) 0%,transparent 65%)" }} />
        </div>
        <Bg />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 1280, margin: "0 auto", padding: "9rem 1.25rem 5rem", width: "100%" }}>
          {/* Breadcrumb */}
          
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 32, height: 1, background: "rgba(110,201,145,0.8)" }} />
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(110,201,145,0.9)" }}>Multi-Sector Excellence</span>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(2.4rem,6vw,4.5rem)", fontWeight: 600, lineHeight: 1.05, color: "white", marginBottom: 16, animation: "fadeUp 0.8s ease both" }}>
            What We<br /><em style={{ color: "#6ec991", fontStyle: "italic" }}>Deliver.</em>
          </h1>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "1rem", color: "rgba(255,255,255,0.72)", fontWeight: 300, maxWidth: 500, lineHeight: 1.7, marginBottom: 32 }}>
            Real Estate, Automobile, Building Materials, General Contracts, Property Management and Consulting quality delivered with uncompromising standards across every sector.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="#services" className="sv-btn-green">Explore Services ↓</a>
            <Link href="/sales" className="sv-btn-ghost">Browse Listings →</Link>
          </div>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────────────────────── */}
      <section style={{ background: "var(--green)", position: "relative", overflow: "hidden" }}>
        <Bg dark />
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.25rem", position: "relative", zIndex: 1 }}>
          <div className="sv-stats-row" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
            {[
              { v: "6",          l: "Service Areas"   },
              { v: "4",          l: "Business Sectors" },
              { v: "RC 7202166", l: "CAC Registered"  },
              { v: "100%",       l: "Nigerian Owned"  },
            ].map((s) => (
              <div key={s.l} className="sv-stat">
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 300, color: "white", marginBottom: 4 }}>{s.v}</div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(255,255,255,0.6)" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Marquee />

      {/* ── SERVICES ACCORDION ─────────────────────────────────────────────── */}
      <section id="services" style={{ background: "var(--warm-grey)", padding: "5rem 0 6rem", position: "relative", overflow: "hidden" }}>
        <Bg />
        {/* Watermark */}
        <div style={{ position: "absolute", fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(8rem,18vw,20rem)", fontWeight: 700, color: "rgba(26,92,56,0.03)", right: "-2%", top: "50%", transform: "translateY(-50%)", lineHeight: 1, zIndex: 0, userSelect: "none", pointerEvents: "none", letterSpacing: "-0.04em" }}>ADPET</div>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.25rem", position: "relative", zIndex: 1 }}>
          {/* Header */}
          <div className="sv-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "3.5rem", alignItems: "end" }}>
            <div>
              <div className="sv-line" />
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--green)", marginBottom: 10 }}>Our Services</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 600, color: "var(--charcoal)", lineHeight: 1.1 }}>
                What We<br /><em style={{ color: "var(--green)", fontStyle: "italic" }}>Deliver.</em>
              </h2>
            </div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.75, fontWeight: 300, alignSelf: "end" }}>
              ADPET operates across six service areas with institutional-grade quality in every engagement. Click any service to learn more.
            </p>
          </div>

          {/* How it works */}
          <div style={{ background: "var(--off-white)", border: "1px solid var(--border)", padding: "2rem", marginBottom: "3rem", display: "flex", alignItems: "center", gap: 0, overflowX: "auto" }}>
            {["Consult", "Propose", "Execute", "Support"].map((step, i) => (
              <div key={step} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <div className="sv-step">
                  <div style={{ width: 36, height: 36, border: `2px solid ${i === 0 ? "var(--green)" : "var(--border)"}`, background: i === 0 ? "var(--green)" : "transparent", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif", fontSize: "0.75rem", fontWeight: 600, color: i === 0 ? "white" : "var(--text-muted)" }}>{i + 1}</div>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.1em", color: i === 0 ? "var(--green)" : "var(--text-muted)", fontWeight: i === 0 ? 500 : 400 }}>{step}</span>
                </div>
                {i < 3 && <div style={{ height: 1, background: "var(--border)", flex: 0.4 }} />}
              </div>
            ))}
          </div>

          {/* Accordion grid */}
          <div className="sv-acc-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(420px,1fr))", gap: "1rem", marginBottom: "4rem" }}>
            {SERVICES.map((svc) => <ServiceCard key={svc.id} svc={svc} />)}
          </div>

          {/* Testimonial */}
          <div style={{ background: "var(--green)", padding: "3rem 2.5rem", position: "relative", overflow: "hidden" }}>
            <Bg dark />
            <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 16, maxWidth: 700 }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "4rem", color: "rgba(110,201,145,0.5)", lineHeight: 0.8 }}>"</div>
              <blockquote style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(1.1rem,2.5vw,1.5rem)", fontStyle: "italic", color: "white", lineHeight: 1.55, fontWeight: 400 }}>
                ADPET handled our property acquisition from search to keys. The professionalism was unmatched they knew the market, handled all documentation, and delivered exactly on schedule.
              </blockquote>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.78rem", color: "rgba(110,201,145,0.9)", letterSpacing: "0.1em" }}>CHUKWUEMEKA A. — Property Client, Lagos</div>
                <div style={{ color: "#f5c842", fontSize: "1.1rem", letterSpacing: 3 }}>★★★★★</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT FORM ───────────────────────────────────────────────────── */}
      <section id="contact" style={{ background: "var(--off-white)", padding: "5rem 0 6rem", position: "relative", overflow: "hidden" }}>
        <Bg />
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
          <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=70" alt="" style={{ width: "50%", height: "100%", objectFit: "cover", opacity: 0.06, position: "absolute", right: 0, top: 0 }} />
        </div>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.25rem", position: "relative", zIndex: 1 }}>
          <div className="sv-contact-grid" style={{ display: "grid", gridTemplateColumns: "5fr 7fr", gap: "5rem" }}>

            {/* Left */}
            <div>
              <div className="sv-line" />
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--green)", marginBottom: 16 }}>Get In Touch</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 600, color: "var(--charcoal)", lineHeight: 1.1, marginBottom: 18 }}>
                Start a<br />Conversation<br /><em style={{ color: "var(--green)", fontStyle: "italic" }}>With Us.</em>
              </h2>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.75, fontWeight: 300, marginBottom: "2.5rem" }}>
                Whether exploring investment opportunities, seeking construction materials, or looking for automotive solutions our team is ready to assist.
              </p>
              {[
                { icon: "📍", label: "Office Address",  value: "Nigeria (Head Office)\nIbadan, Oyo State."               },
                { icon: "✉️", label: "Email",            value: "adpetinvestmentcompanyltd@gmail.com"                     },
                { icon: "📞", label: "Phone",            value: "+2349138802127\n+2349064593957"                           },
              ].map((c) => (
                <div key={c.label} style={{ display: "flex", gap: 16, marginBottom: 24 }}>
                  <div style={{ width: 36, height: 36, background: "var(--green-pale)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "0.9rem" }}>{c.icon}</div>
                  <div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", marginBottom: 4 }}>{c.label}</div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem", color: "var(--charcoal)", whiteSpace: "pre-line", lineHeight: 1.5 }}>{c.value}</div>
                  </div>
                </div>
              ))}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <a href="tel:+2349138802127" className="sv-btn-green">
                  <svg viewBox="0 0 24 24" fill="none" style={{ width: 14, height: 14 }}><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.36 11.36 0 0 0 3.56.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Call Us
                </a>
                <a href="https://wa.me/2349138802127" target="_blank" rel="noreferrer" className="sv-btn-outline">WhatsApp</a>
              </div>
            </div>

            {/* Right */}
            <div style={{ background: "white", border: "1px solid var(--border)", padding: "3rem", boxShadow: "0 4px 40px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.5rem", fontWeight: 600, color: "var(--charcoal)", marginBottom: "2rem" }}>Send an Enquiry</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Also see listings */}
      <section style={{ background: "var(--warm-grey)", padding: "3rem 0", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--green)", marginBottom: 6 }}>Ready to Buy?</p>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.5rem", fontWeight: 600, color: "var(--charcoal)" }}>Browse our current property & vehicle listings</p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Link href="/sale" className="sv-btn-green">View Sales Listings →</Link>
            <Link href="/home" className="sv-btn-outline">Back to Home</Link>
          </div>
        </div>
      </section>
    </>
  );
}