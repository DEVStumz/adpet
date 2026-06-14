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

  .sales-section-line {
    width: 3rem; height: 2px; background: var(--green);
    margin-bottom: 1.25rem; transform-origin: left;
    animation: lineGrow 0.6s ease forwards;
  }

  /* Card */
  .s-card {
    background: white; border: 1px solid var(--border);
    overflow: hidden; position: relative;
    transition: all 0.38s cubic-bezier(0.34,1.4,0.64,1);
  }
  .s-card::after {
    content: ''; position: absolute;
    bottom: 0; left: 0; right: 0; height: 3px;
    background: var(--green);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.38s ease;
  }
  .s-card:hover { transform: translateY(-6px); box-shadow: 0 24px 64px rgba(26,92,56,0.12), 0 6px 20px rgba(0,0,0,0.06); border-color: transparent; }
  .s-card:hover::after { transform: scaleX(1); }
  .s-card .s-img { width: 100%; height: 230px; object-fit: cover; transition: transform 0.55s ease; display: block; }
  .s-card:hover .s-img { transform: scale(1.05); }
  .s-card:hover .s-tag { border-color: var(--green-pale) !important; background: var(--green-pale) !important; color: var(--green) !important; }

  /* Tag */
  .s-tag {
    display: inline-block; font-family: 'DM Sans', sans-serif; font-size: 0.6rem;
    letter-spacing: 0.1em; text-transform: uppercase; padding: 0.25rem 0.65rem;
    border: 1px solid var(--border); color: var(--text-muted);
    margin: 0.2rem 0.2rem 0 0; transition: all 0.22s;
  }

  /* Filter */
  .s-filter {
    font-family: 'DM Sans', sans-serif; font-size: 0.7rem;
    letter-spacing: 0.1em; text-transform: uppercase; padding: 0.45rem 1.1rem;
    border: 1px solid var(--border); background: white; color: var(--text-muted);
    cursor: pointer; transition: all 0.22s; white-space: nowrap;
  }
  .s-filter.on  { background: var(--green); color: white; border-color: var(--green); }
  .s-filter:hover:not(.on) { border-color: var(--green); color: var(--green); background: var(--green-pale); }

  /* Buttons */
  .s-btn-green {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: var(--green); color: white; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.75rem; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase; padding: 0.75rem 1.75rem;
    transition: background 0.25s, transform 0.2s; text-decoration: none;
  }
  .s-btn-green:hover { background: var(--green-light); transform: translateY(-1px); }
  .s-btn-outline {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: transparent; color: var(--charcoal);
    border: 1px solid var(--charcoal); cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.75rem; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase; padding: 0.75rem 1.75rem;
    transition: all 0.25s; text-decoration: none;
  }
  .s-btn-outline:hover { background: var(--charcoal); color: white; transform: translateY(-1px); }
  .s-btn-ghost {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: transparent; color: white; border: 1px solid rgba(255,255,255,0.5);
    cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.75rem;
    font-weight: 400; letter-spacing: 0.1em; text-transform: uppercase;
    padding: 0.75rem 1.75rem; transition: all 0.25s; text-decoration: none;
  }
  .s-btn-ghost:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.9); }

  /* Phone icon button */
  .s-phone-btn {
    display: flex; align-items: center; justify-content: center;
    width: 46px; height: 46px; flex-shrink: 0;
    background: var(--green-pale); border: 1px solid var(--green-pale);
    color: var(--green); text-decoration: none; transition: all 0.22s;
  }
  .s-phone-btn:hover { background: var(--green); color: white; }

  /* Stat */
  .s-stat {
    text-align: center; padding: 2rem 1rem;
    border-right: 1px solid rgba(255,255,255,0.15); transition: background 0.3s;
  }
  .s-stat:last-child { border-right: none; }
  .s-stat:hover { background: rgba(255,255,255,0.06); }

  /* Form */
  .s-field {
    width: 100%; background: transparent; border: none;
    border-bottom: 1px solid var(--border); padding: 0.75rem 0;
    font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
    color: var(--charcoal); outline: none; transition: border-color 0.2s;
  }
  .s-field:focus { border-bottom-color: var(--green); }
  .s-field::placeholder { color: var(--text-muted); font-size: 0.82rem; letter-spacing: 0.05em; }

  /* Modal */
  .s-modal-overlay {
    position: fixed; inset: 0; background: rgba(10,20,14,0.65); z-index: 1000;
    display: flex; align-items: flex-end; justify-content: center;
    backdrop-filter: blur(4px); animation: fadeUp 0.2s ease;
  }
  .s-modal-sheet {
    background: var(--off-white); width: 100%; max-width: 600px;
    border-top: 3px solid var(--green); max-height: 92vh; overflow-y: auto;
    animation: fadeUp 0.32s ease forwards;
  }

  @media (max-width: 640px) {
    .s-stat { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.15); }
    .s-stat:last-child { border-bottom: none; }
    .s-stats-row { grid-template-columns: repeat(2,1fr) !important; }
    .s-grid     { grid-template-columns: 1fr !important; }
    .s-header-grid { grid-template-columns: 1fr !important; }
  }
  @media (max-width: 768px) {
    .s-header-grid { grid-template-columns: 1fr !important; }
  }
`;

// ─── Floating background orbs (same as landing) ──────────────────────────────
const ORB_C  = [
  { z: 320, x: "10%", y: "15%", d: "0s",  t: "14s" },
  { z: 180, x: "75%", y: "8%",  d: "2s",  t: "11s" },
  { z: 240, x: "85%", y: "60%", d: "4s",  t: "16s" },
  { z: 140, x: "20%", y: "75%", d: "1s",  t: "9s"  },
  { z: 200, x: "50%", y: "40%", d: "3s",  t: "13s" },
];
const RING_C = [
  { z: 260, x: "90%", y: "20%", d: "0s", t: "20s" },
  { z: 180, x: "5%",  y: "55%", d: "6s", t: "18s" },
  { z: 120, x: "60%", y: "90%", d: "3s", t: "15s" },
];
const SHAPE_C = [
  { type: "d", z: 18, x: "15%", y: "25%", d: "0s", t: "12s" },
  { type: "c", z: 14, x: "82%", y: "18%", d: "2s", t: "15s" },
  { type: "d", z: 10, x: "70%", y: "72%", d: "4s", t: "10s" },
  { type: "c", z: 16, x: "28%", y: "82%", d: "1s", t: "13s" },
];

function Bg({ dark = false }: { dark?: boolean }) {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      {ORB_C.map((o, i) => {
        const op = dark ? 0.07 + (i % 3) * 0.01 : 0.08 + (i % 3) * 0.02;
        return <div key={i} style={{ position: "absolute", left: o.x, top: o.y, width: o.z, height: o.z, borderRadius: "50%", background: dark ? `radial-gradient(circle,rgba(42,122,77,${op*2}) 0%,transparent 70%)` : `radial-gradient(circle,rgba(26,92,56,${op}) 0%,transparent 70%)`, animation: `floatOrb${i%3} ${o.t} ${o.d} ease-in-out infinite`, transform: "translate(-50%,-50%)", filter: "blur(1px)" }} />;
      })}
      {RING_C.map((r, i) => (
        <div key={`r${i}`} style={{ position: "absolute", left: r.x, top: r.y, width: r.z, height: r.z, borderRadius: "50%", border: `1px solid ${dark?"rgba(42,122,77,0.15)":"rgba(26,92,56,0.1)"}`, animation: `floatOrb${(i+1)%3} ${r.t} ${r.d} ease-in-out infinite`, transform: "translate(-50%,-50%)" }} />
      ))}
      {SHAPE_C.map((s, i) => {
        const col = dark ? "rgba(110,201,145,0.3)" : "rgba(26,92,56,0.2)";
        return (
          <div key={`s${i}`} style={{ position: "absolute", left: s.x, top: s.y, animation: `floatOrb${i%3} ${s.t} ${s.d} ease-in-out infinite`, transform: "translate(-50%,-50%)" }}>
            {s.type === "d"
              ? <div style={{ width: s.z, height: s.z, border: `1.5px solid ${col}`, transform: "rotate(45deg)" }} />
              : <svg width={s.z*2} height={s.z*2} viewBox="0 0 20 20" fill="none"><line x1="10" y1="2" x2="10" y2="18" stroke={col} strokeWidth="1.5"/><line x1="2" y1="10" x2="18" y2="10" stroke={col} strokeWidth="1.5"/></svg>
            }
          </div>
        );
      })}
    </div>
  );
}

// ─── Marquee ─────────────────────────────────────────────────────────────────
const MARQUEE = ["Prime Land","Luxury Houses","Premium Cars","Commercial Property","ADPET Sales","RC: 7202166"];
function Marquee() {
  const items = Array(3).fill(MARQUEE).flat();
  return (
    <div style={{ padding: "1rem 0", overflow: "hidden", background: "var(--charcoal)", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div style={{ display: "flex", gap: 48, whiteSpace: "nowrap", fontFamily: "'DM Sans',sans-serif", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(255,255,255,0.3)", animation: "marquee 24s linear infinite" }}>
        {items.map((t, i) => <span key={i} style={{ flexShrink: 0 }}>{t}&nbsp;&nbsp;·</span>)}
      </div>
    </div>
  );
}

// ─── Phone icon SVG ───────────────────────────────────────────────────────────
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" style={{ width: 18, height: 18 }}>
    <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.36 11.36 0 0 0 3.56.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── Listings data ────────────────────────────────────────────────────────────
const LISTINGS = [
  { id:1,  cat:"Land",       badge:"HOT",        badgeBg:"#c0392b", title:"Iseyin Hills and Resort –  Ibadan Express Way",  loc:"Iseyin, Oyo State",    price:"₦5,000,000",     detail:"450 sqm | Residential #5m | Commercial #7m",      desc:"Strategically located commercial land with C-of-O title. Ideal for hotel, Sport Complex, Amuzement Park, Event Center or mixed-use development.",               tags:["C-of-O","Commercial","Residential"],         img:"images/land 1.jpeg", phone:"+2349138802127" },
  { id:2,  cat:"Land",       badge:"NEW",        badgeBg:"#1a5c38", title:"1 Plot Residential Estate Land",  loc:"Moniya, Ibadan, Oyo State",      price:"₦7,000,000",     detail:"450 sqm",        desc:" 5 Blocks height fenced with full government approvals. Developed area with Road, drainage and electricity already in place, 5 minutes drive to Moniya Train Station.",                      tags:["Approved","Residential","Gated"],             img:"images/land 2.jpeg", phone:"+2349138802127" },
  { id:3,  cat:"Land",       badge:"SALE",       badgeBg:"#7d6608", title:"Agricultural Land – Ibarapa Zone",           loc:"Ibarapa, Oyo State",              price:"₦6,500,000",      detail:"5 acres",        desc:"Fertile farmland with year-round water access. Perfect for large-scale cultivation or agri-investment.",                   tags:["Farmland","Water Access","Survey Done"],      img:"https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80", phone:"+2349064593957" },
  //{ id:4,  cat:"House",      badge:"LUXURY",     badgeBg:"#7d6608", title:"5-Bedroom Detached Duplex – Bodija",         loc:"Bodija Estate, Ibadan",           price:"₦320,000,000",    detail:"450 sqm built",  desc:"Contemporary luxury duplex with BQ, smart home wiring, dual water treatment, and full solar backup.",                      tags:["Smart Home","Solar","BQ Inclusive"],          img:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80", phone:"+2349138802127" },
  //{ id:5,  cat:"House",      badge:"SALE",       badgeBg:"#1a5c38", title:"3-Bedroom Terrace – Moniya GRA",             loc:"Moniya GRA, Ibadan",              price:"₦58,000,000",     detail:"180 sqm",        desc:"Modern terrace with fitted kitchen, POP ceilings, 24/7 CCTV and estate access control.",                                  tags:["Fitted Kitchen","POP","Security Estate"],     img:"https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80", phone:"+2349064593957" },
  //{ id:6,  cat:"House",      badge:"NEW",        badgeBg:"#1a5c38", title:"4-Bedroom Semi-Detached – Oluyole",          loc:"Oluyole Estate, Ibadan",          price:"₦95,000,000",     detail:"260 sqm",        desc:"Newly built semi-detached with Jacuzzi, tiled compound, 2 covered parking slots and backup generator.",                   tags:["New Build","Generator","Jacuzzi"],            img:"https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80", phone:"+2349138802127" },
  { id:7,  cat:"Car",        badge:"TOKUNBO",    badgeBg:"#1a4a7a", title:"2010 Toyota Muscle SE",                     loc:"ADPET Auto Centre, Ibadan",       price:"₦13,200,000",     detail:"15,000 km",      desc:"Foreign used, accident-free. Full wool sit, non-sunroof, non-reverse camera, 3-row seating. Duty fully paid.",                     tags:["Duty Paid","Accident-Free","Full Option"],    img:"images/Car 1.jpeg", phone:"+2349138802127" },
  { id:8,  cat:"Car",        badge:"TOKUNBO",        badgeBg:"#1a5c38", title:"2012 Mercedes-Benz ML 350",                 loc:"ADPET Auto Centre, Ibadan",       price:"₦27,500,000",    detail:"10,000 km",           desc:"Foreign used, non-registered. AMG line trim, panoramic roof, Burmester sound, 4MATIC AWD.",                                tags:["Foreign Used","Non-Registered","Keyless"],          img:"images/Car 2.jpeg", phone:"+2349064593957" },
  { id:9,  cat:"Car",        badge:"TOKUNBO",    badgeBg:"#1a4a7a", title:"2011 Lexus RX 350",                     loc:"ADPET Auto Centre, Ibadan",       price:"₦22,800,000",     detail:"12,000 km",      desc:"Clean foreign used. 5-seater, leather interior, panoramic roof, wireless CarPlay. Excellent condition.",             tags:["Keyless","Leather","Wireles CarPlay"],         img:"images/Car 3.jpeg", phone:"+2349138802127" },
  { id:10,  cat:"Car",        badge:"Used",    badgeBg:"#1a5c38", title:"2011 Toyota Venza",                     loc:"ADPET Auto Centre, Ibadan",       price:"₦13,500,000",     detail:"18,000 km",      desc:"Clean Nigerian used. 5-seater, Clear interior, wireless CarPlay. Excellent condition.",             tags:["5-Seater","V-6","Keyless", "Registered"],         img:"images/Car 4.jpeg", phone:"+2349138802127" },
  { id:11,  cat:"Car",        badge:"TOKUNBO",    badgeBg:"#1a4a7a", title:"2013 Camry Spider XLE",                     loc:"ADPET Auto Centre, Ibadan",       price:"₦16,800,000",     detail:"8,000 km",      desc:"Clean foreign used. Full option, leather interior, panoramic roof, wireless CarPlay. Excellent condition.",             tags:["Keyless","Leather","full Option"],         img:"images/Car 5.jpeg", phone:"+2349138802127" },
  { id:12,  cat:"Car",        badge:"Used",    badgeBg:"#1a5c38", title:"2010 Toyota Camry",                     loc:"ADPET Auto Centre, Ibadan",       price:"₦8,300,000",     detail:"20,000 km",      desc:"Clean Nigerian used. Clear interior, wireless CarPlay. Excellent condition.",             tags:["5-Seater","wireless carplay", "Registered"],         img:"images/Car 6.jpeg", phone:"+2349138802127" },
  //{ id:13, cat:"Commercial", badge:"INVESTMENT", badgeBg:"#5b3a82", title:"10-Unit Warehouse Complex – Ojoo",           loc:"Ojoo Industrial Area, Ibadan",    price:"₦750,000,000",    detail:"3,500 sqm",      desc:"Fully tenanted industrial warehouse generating 18% annual yield. Verified tenancy agreements available.",                  tags:["Tenanted","18% ROI","Industrial"],            img:"https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80", phone:"+2349138802127" },
  //{ id:14, cat:"Commercial", badge:"OFF-PLAN",   badgeBg:"#5b3a82", title:"Mixed-Use Plaza – Challenge Ibadan",         loc:"Challenge Roundabout, Ibadan",    price:"From ₦45,000,000",detail:"Shops & Offices", desc:"Off-plan investment in Ibadan's busiest commercial corridor. Pre-completion pricing. Q4 2026 delivery.",                  tags:["Off-Plan","High Traffic","Q4 2026"],          img:"https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80", phone:"+2349064593957" },
  //{ id:15, cat:"Commercial", badge:"HOT",        badgeBg:"#c0392b", title:"Shopping Complex – Agodi Gate",              loc:"Agodi Gate, Ibadan",              price:"₦280,000,000",    detail:"12 units",       desc:"Fully completed 12-unit shopping complex in a high-footfall commercial zone. Partial tenancy secured.",                   tags:["High Footfall","Partly Tenanted","C-of-O"],   img:"https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80", phone:"+2349138802127" },
];
const CATS = ["All","Land","House","Car","Commercial"];

// ─── Listing Card ─────────────────────────────────────────────────────────────
function Card({ item, onEnquire }: { item: typeof LISTINGS[0]; onEnquire: (i: typeof LISTINGS[0]) => void }) {
  return (
    <div className="s-card">
      <div style={{ position: "relative", overflow: "hidden" }}>
        <img src={item.img} alt={item.title} className="s-img" />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(10,20,14,0.45) 0%,transparent 55%)" }} />
        <span style={{ position: "absolute", top: 14, left: 14, background: item.badgeBg, color: "white", fontFamily: "'DM Sans',sans-serif", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", padding: "3px 8px" }}>{item.badge}</span>
        <span style={{ position: "absolute", top: 14, right: 14, background: "rgba(26,92,56,0.88)", color: "white", fontFamily: "'DM Sans',sans-serif", fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.12em", padding: "3px 8px" }}>{item.cat}</span>
        <div style={{ position: "absolute", bottom: 14, left: 16 }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.3rem", fontWeight: 600, color: "white", lineHeight: 1.1 }}>{item.price}</div>
        </div>
      </div>
      <div style={{ padding: "1.25rem 1.5rem 1.5rem" }}>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.67rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: 6 }}>📍 {item.loc}</p>
        <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.2rem", fontWeight: 600, color: "var(--charcoal)", lineHeight: 1.25, marginBottom: 8 }}>{item.title}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "'DM Sans',sans-serif", fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: 10 }}>
          <svg viewBox="0 0 16 16" fill="none" style={{ width: 12, height: 12, color: "var(--green)" }}><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/><path d="M8 5v3l2 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          {item.detail}
        </div>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.6, fontWeight: 300, marginBottom: 14 }}>{item.desc}</p>
        <div style={{ marginBottom: 18 }}>{item.tags.map((t) => <span key={t} className="s-tag">{t}</span>)}</div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="s-btn-green" style={{ flex: 1, justifyContent: "center", fontSize: "0.72rem" }} onClick={() => onEnquire(item)}>
            Enquire Now
            <svg viewBox="0 0 16 16" fill="none" style={{ width: 12, height: 12 }}><path d="M3 8H13M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          {/* href="tel:..." opens the phone's native dialer when tapped on mobile */}
          <a href={`tel:${item.phone}`} className="s-phone-btn" title={`Call ${item.phone}`}>
            <PhoneIcon />
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Enquiry Modal ────────────────────────────────────────────────────────────
function Modal({ item, onClose }: { item: typeof LISTINGS[0] | null; onClose: () => void }) {
  const [form, setForm] = useState({ name:"", phone:"", email:"", message:"" });
  const [sent, setSent] = useState(false);

  useEffect(() => { if (item) { setSent(false); setForm({ name:"", phone:"", email:"", message:"" }); } }, [item]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  if (!item) return null;

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", marginBottom: 8 }}>{children}</label>
  );

  return (
    <div className="s-modal-overlay" onClick={onClose}>
      <div className="s-modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: "20px 2rem 0", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: 40, height: 3, background: "var(--border)", borderRadius: 2, marginBottom: 24 }} />
        </div>
        <div style={{ padding: "0 2rem 3rem" }}>
          {sent ? (
            <div style={{ textAlign: "center", padding: "2.5rem 0" }}>
              <div style={{ width: 56, height: 56, background: "var(--green-pale)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", animation: "pulseRing 2s ease infinite" }}>
                <svg viewBox="0 0 24 24" fill="none" style={{ width: 28, height: 28, color: "var(--green)" }}><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.7rem", fontWeight: 600, color: "var(--charcoal)", marginBottom: 10 }}>Enquiry Sent!</h3>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: 24, lineHeight: 1.6 }}>Our team will reach out within 24 hours.</p>
              <button className="s-btn-green" onClick={onClose}>Close</button>
            </div>
          ) : (
            <>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--green)", marginBottom: 4 }}>Enquire About</p>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.3rem", fontWeight: 600, color: "var(--charcoal)", marginBottom: 4 }}>{item.title}</h3>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.5rem", fontWeight: 600, color: "var(--green)", marginBottom: "1.75rem" }}>{item.price}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                {([
                  { label:"Full Name",     key:"name",    type:"text",  ph:"e.g. Emeka Okafor"  },
                  { label:"Phone Number",  key:"phone",   type:"tel",   ph:"+234 000 000 0000"   },
                  { label:"Email Address", key:"email",   type:"email", ph:"you@email.com"       },
                ] as const).map((f) => (
                  <div key={f.key}><Label>{f.label}</Label>
                    <input type={f.type} placeholder={f.ph} className="s-field" value={(form as any)[f.key]} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))} />
                  </div>
                ))}
                <div><Label>Message (optional)</Label>
                  <textarea rows={3} placeholder="Any specific requirements..." className="s-field" style={{ resize: "none" }} value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} />
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="s-btn-green" style={{ flex: 1, justifyContent: "center" }} onClick={() => setSent(true)}>
                    Submit Enquiry
                    <svg viewBox="0 0 16 16" fill="none" style={{ width: 12, height: 12 }}><path d="M3 8H13M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  {/* Also triggers phone dialer */}
                  <a href={`tel:${item.phone}`} className="s-btn-outline" style={{ flexShrink: 0 }}><PhoneIcon /> Call</a>
                </div>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.72rem", color: "var(--text-muted)", textAlign: "center" }}>
                  Or call directly: <a href={`tel:${item.phone}`} style={{ color: "var(--green)", textDecoration: "none", fontWeight: 500 }}>{item.phone}</a>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SalesPage() {
  const [cat,    setCat]    = useState("All");
  const [modal,  setModal]  = useState<typeof LISTINGS[0] | null>(null);
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const fn = () => setScroll(window.scrollY * 0.3);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const filtered = cat === "All" ? LISTINGS : LISTINGS.filter((l) => l.cat === cat);

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
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(110,201,145,0.9)" }}>Premium Listings · Ibadan, Nigeria</span>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(2.4rem,6vw,4.5rem)", fontWeight: 600, lineHeight: 1.05, color: "white", marginBottom: 16, animation: "fadeUp 0.8s ease both" }}>
            Properties &<br /><em style={{ color: "#6ec991", fontStyle: "italic" }}>Vehicles For Sale.</em>
          </h1>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "1rem", color: "rgba(255,255,255,0.72)", fontWeight: 300, maxWidth: 500, lineHeight: 1.7, marginBottom: 32 }}>
            Curated land, houses, automobiles and commercial property across Nigeria's fastest-growing markets every listing backed by ADPET's quality guarantee.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="#listings" className="s-btn-green">Browse Listings ↓</a>
            <Link href="/services" className="s-btn-ghost">Our Services →</Link>
          </div>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────────────────────── */}
      <section style={{ background: "var(--green)", position: "relative", overflow: "hidden" }}>
        <Bg dark />
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.25rem", position: "relative", zIndex: 1 }}>
          <div className="s-stats-row" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
            {[
              { v: `${LISTINGS.length}`, l: "Active Listings" },
              { v: "4",          l: "Categories"       },
              { v: "RC 7202166", l: "CAC Registered"   },
              { v: "24h",        l: "Response Time"    },
            ].map((s) => (
              <div key={s.l} className="s-stat">
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 300, color: "white", marginBottom: 4 }}>{s.v}</div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(255,255,255,0.6)" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Marquee />

      {/* ── LISTINGS ───────────────────────────────────────────────────────── */}
      <section id="listings" style={{ background: "var(--warm-grey)", padding: "5rem 0 6rem", position: "relative", overflow: "hidden" }}>
        <Bg />
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.25rem", position: "relative", zIndex: 1 }}>

          {/* Section header */}
          <div className="s-header-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "3rem", alignItems: "end" }}>
            <div>
              <div className="sales-section-line" />
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--green)", marginBottom: 10 }}>Available Now</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 600, color: "var(--charcoal)", lineHeight: 1.1 }}>
                Browse Our<br /><em style={{ color: "var(--green)", fontStyle: "italic" }}>Listings</em>
              </h2>
            </div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.75, fontWeight: 300, alignSelf: "end" }}>
              Every listing is verified, transparently priced and supported by ADPET's expert team from first enquiry through to completion.
            </p>
          </div>

          {/* Category filters */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "2.5rem", alignItems: "center" }}>
            {CATS.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`s-filter ${cat === c ? "on" : ""}`}>{c}</button>
            ))}
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.72rem", color: "var(--text-muted)", marginLeft: 8 }}>
              {filtered.length} listing{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Cards grid */}
          <div className="s-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "1.5rem" }}>
            {filtered.map((item) => <Card key={item.id} item={item} onEnquire={setModal} />)}
          </div>

          {/* Can't find what you need CTA */}
          <div style={{ marginTop: "4rem", background: "var(--green)", padding: "3rem 2.5rem", position: "relative", overflow: "hidden" }}>
            <Bg dark />
            <div style={{ position: "relative", zIndex: 1 }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.16em", color: "rgba(110,201,145,0.9)", marginBottom: 12 }}>Can't find what you need?</p>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 600, color: "white", lineHeight: 1.2, marginBottom: 14 }}>
                We Have Off-Market<br /><em style={{ fontStyle: "italic" }}>Stock Available.</em>
              </h3>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem", color: "rgba(255,255,255,0.72)", fontWeight: 300, lineHeight: 1.7, maxWidth: 520, marginBottom: 24 }}>
                Tell us your requirements size, location, budget and we'll source the right property or vehicle for you.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a href="mailto:adpetinvestmentcompanyltd@gmail.com" className="s-btn-ghost">Send Custom Request →</a>
                <a href="tel:+2349138802127" className="s-btn-green" style={{ background: "white", color: "var(--green)" }}>
                  <PhoneIcon /> Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Also explore services */}
      <section style={{ background: "var(--off-white)", padding: "3rem 0", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--green)", marginBottom: 6 }}>Explore More</p>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.5rem", fontWeight: 600, color: "var(--charcoal)" }}>Looking for a specific service?</p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Link href="/service" className="s-btn-green">View Our Services →</Link>
            <Link href="/#contact" className="s-btn-outline">Contact Us</Link>
          </div>
        </div>
      </section>

      <Modal item={modal} onClose={() => setModal(null)} />
    </>
  );
}