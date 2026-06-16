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
    img: "/images/supply.jpg",
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
    img: "images/autocare.jpeg",
  },
  {
    id: "spareparts",
    icon: <svg viewBox="0 0 48 48" fill="none" style={{ width: 36, height: 36 }}>
      {/* Gear / cog wheel icon — fits automobile spare parts perfectly */}
      <circle cx="24" cy="24" r="6" stroke="currentColor" strokeWidth="2"/>
      <path d="M24 4v4M24 40v4M4 24h4M40 24h4M8.69 8.69l2.83 2.83M36.48 36.48l2.83 2.83M8.69 39.31l2.83-2.83M36.48 11.52l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth="2"/>
    </svg>,
    label: "Automobile Spare Parts",
    tagline: "Genuine parts, every time",
    headline: "Automobile Spare Parts Supply",
    desc: "We supply certified, genuine OEM and aftermarket spare parts for a wide range of vehicle makes and models. From engine components and brake systems to body parts and electrical units — reliable parts delivered fast across Nigeria.",
    bullets: [
      "Genuine OEM & quality aftermarket parts",
      "Engine, transmission & brake components",
      "Electrical units, sensors & accessories",
      "Bulk supply for workshops & fleet managers",
    ],
    cta: "Request Parts",
    ctaLink: "/#contact",
    img: "/images/sparepart.jpeg", 
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
          <img src="data:image/jpeg;base64,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" alt="" style={{ width: "100%", height: "115%", objectFit: "cover", objectPosition: "center 30%", transform: `translateY(${scroll}px)`, display: "block" }} />
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
            <Link href="/sale" className="sv-btn-ghost">Browse Listings →</Link>
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