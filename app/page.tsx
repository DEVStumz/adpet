"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface Sector {
  id: string;
  icon: ReactNode;
  label: string;
  headline: string;
  description: string;
  tags: string[];
  img: string;
}

interface Stat {
  value: string;
  sublabel?: string;
  label: string;
}

interface ContactItem {
  icon: string;
  label: string;
  value: string;
}

interface FormState {
  name: string;
  email: string;
  sector: string;
  message: string;
}

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const NAV_LINKS = ["Home", "Sectors", "About", "Contact"] as const;

const SECTORS: Sector[] = [
  {
    id: "realestate",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="6" y="20" width="36" height="22" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M2 22L24 6L46 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <rect x="18" y="30" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <line x1="24" y1="30" x2="24" y2="42" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    label: "Real Estate & Property",
    headline: "Premium Property Development",
    description:
      "Luxury residential estates, commercial developments, and property sales. We deliver exceptional real estate solutions tailored to discerning clients across Nigeria.",
    tags: ["Luxury Homes", "Commercial Spaces", "Land Sales", "Property Mgmt"],
    img: "/images/development.png",
  },
  {
    id: "materials",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="4" y="28" width="40" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
        <rect x="10" y="18" width="28" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="16" y="10" width="16" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <line x1="24" y1="6" x2="24" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    label: "Building Materials",
    headline: "High-Grade Construction Supply",
    description:
      "Production and wholesale distribution of premium, certified building materials. Supplying the industry with quality inputs that define structural excellence.",
    tags: ["Cement & Steel", "Roofing Systems", "Finishing Materials", "Bulk Supply"],
    img: "/images/property.jpg",
  },
  {
    id: "automobile",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="4" y="18" width="40" height="18" rx="4" stroke="currentColor" strokeWidth="2" />
        <path d="M10 18L15 8H33L38 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="14" cy="36" r="5" stroke="currentColor" strokeWidth="2" />
        <circle cx="34" cy="36" r="5" stroke="currentColor" strokeWidth="2" />
        <line x1="4" y1="28" x2="44" y2="28" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    label: "Automobile Division",
    headline: "Premium Automotive Excellence",
    description:
      "Authorised dealership, automotive care centre, and genuine spare parts distribution. A one-stop automotive destination for fleet and personal vehicle needs.",
    tags: ["Car Dealership", "Auto Care", "Spare Parts", "Fleet Solutions"],
    img: "/images/carstand.jpg",
  },
  {
    id: "contracts",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="8" y="6" width="32" height="38" rx="2" stroke="currentColor" strokeWidth="2" />
        <line x1="16" y1="16" x2="32" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="16" y1="22" x2="32" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="16" y1="28" x2="26" y2="28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="34" cy="36" r="6" fill="#1a5c38" stroke="currentColor" strokeWidth="1.5" />
        <path d="M31 36L33 38L37 34" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: "General Contracts",
    headline: "Global Trade & Procurement",
    description:
      "Comprehensive general contracting, merchandise trading, and large-scale corporate procurement. Bridging supply chains with strategic precision and reliability.",
    tags: ["Global Trading", "General Goods", "Corporate Procurement", "Logistics"],
    img: "/images/deal.jpg",
  },
];

// FIX 1: Single SOCIAL_LINKS constant — object array with real icons and URLs
const SOCIAL_LINKS = [
  {
    id: "Li",
    label: "LinkedIn",
    url: "https://www.linkedin.com/company/adpet-investment",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    id: "X",
    label: "X (Twitter)",
    url: "https://x.com/adpetinvestments",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.26 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    ),
  },
  {
    id: "IG",
    label: "Instagram",
    url: "https://www.instagram.com/adpet_investment_company_ltd?igsh=YXUyZmxzcmR0aTc3&utm_source=qr",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
] as const;

const STATS: Stat[] = [
  { value: "4+", label: "Business Sectors" },
  { value: "RC", sublabel: "7202166", label: "CAC Registered" },
  { value: "100%", label: "Nigerian Owned" },
  { value: "₦B+", label: "Assets Under Mgmt" },
];

const CONTACT_ITEMS: ContactItem[] = [
  { icon: "📍", label: "Office Address", value: "Nigeria (Head Office)\nIbadan, Oyo State." },
  { icon: "✉️", label: "Email", value: "adpetinvestmentcompanyltd@gmail.com" },
  { icon: "📞", label: "Phone", value: "+2349138802127, +2349064593957" },
];

const ABOUT_FACTS = [
  { label: "Legal Name", value: "ADPET Investment Company Nigeria Limited" },
  { label: "Registration", value: "RC: 7202166 (CAC Nigeria)" },
  { label: "Headquarters", value: "Nigeria" },
  { label: "Operations", value: "Multi-sector, Nationwide" },
];

const ABOUT_IMAGES = [
  "/images/car.jpg",
  "/images/construction.jpg",
  "/images/repair.jpg",
];

const MARQUEE_ITEMS = [
  "Real Estate & Property Development",
  "Building Materials",
  "Automobile Division",
  "General Contracts & Merchandise",
  "ADPET Investment Company",
  "RC: 7202166",
];

const LEGAL_LINKS = ["Privacy Policy", "Terms of Service", "Cookie Policy"] as const;

// ─────────────────────────────────────────────
// GLOBAL STYLES
// ─────────────────────────────────────────────

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .font-display { font-family: 'Cormorant Garamond', Georgia, serif; }
  .font-body    { font-family: 'DM Sans', sans-serif; }

  :root {
    --green:       #1a5c38;
    --green-light: #2a7a4d;
    --green-pale:  #e8f2ec;
    --charcoal:    #1a1a1a;
    --off-white:   #f8f6f1;
    --warm-grey:   #f0ede6;
    --border:      #e2ddd6;
    --text-muted:  #6b6560;
  }

  html { scroll-behavior: smooth; }

  @keyframes floatOrb0 {
    0%,100% { transform: translate(-50%,-50%) translateY(0px)   scale(1);    }
    33%     { transform: translate(-50%,-50%) translateY(-28px) scale(1.04); }
    66%     { transform: translate(-50%,-50%) translateY(14px)  scale(0.97); }
  }
  @keyframes floatOrb1 {
    0%,100% { transform: translate(-50%,-50%) translateY(0px)  translateX(0px);   }
    40%     { transform: translate(-50%,-50%) translateY(-18px) translateX(16px); }
    70%     { transform: translate(-50%,-50%) translateY(20px)  translateX(-10px);}
  }
  @keyframes floatOrb2 {
    0%,100% { transform: translate(-50%,-50%) rotate(0deg)  scale(1);    }
    50%     { transform: translate(-50%,-50%) rotate(8deg)  scale(1.06); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes lineGrow {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }
  @keyframes marquee {
    from { transform: translateX(0);       }
    to   { transform: translateX(-33.33%); }
  }
  @keyframes pulseRing {
    0%   { transform: scale(0.95); box-shadow: 0 0 0 0    rgba(26,92,56,0.4); }
    70%  { transform: scale(1);    box-shadow: 0 0 0 12px rgba(26,92,56,0);   }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0    rgba(26,92,56,0);   }
  }

  .animate-fade-up    { animation: fadeUp 0.8s ease          forwards; }
  .animate-fade-up-d1 { animation: fadeUp 0.8s ease 0.15s    both; }
  .animate-fade-up-d2 { animation: fadeUp 0.8s ease 0.30s    both; }
  .animate-fade-up-d3 { animation: fadeUp 0.8s ease 0.45s    both; }
  .animate-fade-in    { animation: fadeIn 1.2s ease 0.30s     both; }
  .animate-pulse-ring { animation: pulseRing 2s ease infinite; }

  .section-line {
    width: 3rem; height: 2px;
    background: var(--green);
    margin-bottom: 1.25rem;
    transform-origin: left;
    animation: lineGrow 0.6s ease forwards;
  }
  .divider { width: 100%; height: 1px; background: var(--border); }

  .nav-link {
    position: relative;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: white;
    transition: color 0.2s;
  }
  .nav-link.scrolled { color: var(--charcoal); }
  .nav-link::after {
    content: '';
    position: absolute; bottom: -2px; left: 0; right: 100%;
    height: 1px; background: var(--green);
    transition: right 0.3s ease;
  }
  .nav-link:hover::after { right: 0; }
  .nav-link:hover { color: var(--green) !important; }

  .btn-primary {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: var(--green); color: white;
    font-family: 'DM Sans', sans-serif; font-size: 0.75rem;
    font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
    padding: 0.75rem 1.75rem; border: none; cursor: pointer;
    transition: background 0.25s, transform 0.2s, box-shadow 0.25s;
    position: relative; overflow: hidden;
  }
  .btn-primary::before {
    content: ''; position: absolute;
    top: 0; left: -100%; width: 100%; height: 100%;
    background: rgba(255,255,255,0.08); transition: left 0.3s;
  }
  .btn-primary:hover::before { left: 0; }
  .btn-primary:hover {
    background: var(--green-light);
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(26,92,56,0.35);
  }
  .btn-ghost {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: transparent; color: white;
    font-family: 'DM Sans', sans-serif; font-size: 0.75rem;
    font-weight: 400; letter-spacing: 0.1em; text-transform: uppercase;
    padding: 0.75rem 1.75rem;
    border: 1px solid rgba(255,255,255,0.5); cursor: pointer;
    transition: all 0.25s;
  }
  .btn-ghost:hover {
    background: rgba(255,255,255,0.12);
    border-color: rgba(255,255,255,0.9);
    transform: translateY(-1px);
  }
  .btn-outline {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: transparent; color: var(--charcoal);
    font-family: 'DM Sans', sans-serif; font-size: 0.75rem;
    font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
    padding: 0.75rem 1.75rem;
    border: 1px solid var(--charcoal); cursor: pointer;
    transition: all 0.25s;
  }
  .btn-outline:hover { background: var(--charcoal); color: white; transform: translateY(-1px); }

  .sector-card {
    background: white; border: 1px solid var(--border);
    overflow: hidden; position: relative;
    transition: all 0.38s cubic-bezier(0.34,1.4,0.64,1);
    cursor: default;
  }
  .sector-card::after {
    content: ''; position: absolute;
    bottom: 0; left: 0; right: 0; height: 3px;
    background: var(--green);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.38s ease;
  }
  .sector-card:hover {
    transform: translateY(-7px);
    box-shadow: 0 24px 64px rgba(26,92,56,0.13), 0 6px 20px rgba(0,0,0,0.07);
    border-color: transparent;
  }
  .sector-card:hover::after { transform: scaleX(1); }
  .sector-card .card-img {
    width: 100%; height: 180px; object-fit: cover;
    transition: transform 0.55s ease; display: block;
  }
  .sector-card:hover .card-img { transform: scale(1.05); }
  .sector-card .icon-wrap { color: var(--green); transition: transform 0.3s; }
  .sector-card:hover .icon-wrap { transform: scale(1.12); }

  .tag-pill {
    display: inline-block;
    font-family: 'DM Sans', sans-serif; font-size: 0.62rem;
    letter-spacing: 0.1em; text-transform: uppercase;
    padding: 0.28rem 0.7rem;
    border: 1px solid var(--border);
    color: var(--text-muted);
    margin: 0.2rem 0.2rem 0 0;
    transition: all 0.22s;
  }
  .sector-card:hover .tag-pill {
    border-color: var(--green-pale);
    background: var(--green-pale);
    color: var(--green);
  }

  .stat-item {
    text-align: center; padding: 2rem 1rem;
    border-right: 1px solid rgba(255,255,255,0.15);
    transition: background 0.3s;
  }
  .stat-item:last-child { border-right: none; }
  .stat-item:hover { background: rgba(255,255,255,0.06); }

  .form-field {
    width: 100%; background: transparent; border: none;
    border-bottom: 1px solid var(--border);
    padding: 0.75rem 0;
    font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
    color: var(--charcoal); outline: none;
    transition: border-color 0.2s;
  }
  .form-field:focus  { border-bottom-color: var(--green); }
  .form-field::placeholder { color: var(--text-muted); font-size: 0.82rem; letter-spacing: 0.05em; }

  @media (max-width: 640px) {
    .stat-item { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.15); }
    .stat-item:last-child { border-bottom: none; }
  }
`;

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────

type OrbVariant = "light" | "dark";

const ORB_CONFIGS = [
  { size: 320, x: "10%", y: "15%", delay: "0s",  dur: "14s" },
  { size: 180, x: "75%", y: "8%",  delay: "2s",  dur: "11s" },
  { size: 240, x: "85%", y: "60%", delay: "4s",  dur: "16s" },
  { size: 140, x: "20%", y: "75%", delay: "1s",  dur: "9s"  },
  { size: 200, x: "50%", y: "40%", delay: "3s",  dur: "13s" },
  { size: 100, x: "35%", y: "88%", delay: "5s",  dur: "10s" },
];

const RING_CONFIGS = [
  { size: 260, x: "90%", y: "20%", delay: "0s", dur: "20s" },
  { size: 180, x: "5%",  y: "55%", delay: "6s", dur: "18s" },
  { size: 120, x: "60%", y: "90%", delay: "3s", dur: "15s" },
];

function FloatingOrbs({ variant = "light" }: { variant?: OrbVariant }) {
  const isDark = variant === "dark";
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {ORB_CONFIGS.map((o, i) => {
        const opacity = isDark ? 0.05 + (i % 3) * 0.01 : 0.08 + (i % 3) * 0.02;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: o.x, top: o.y,
              width: o.size, height: o.size,
              borderRadius: "50%",
              background: isDark
                ? `radial-gradient(circle, rgba(42,122,77,${opacity * 2}) 0%, transparent 70%)`
                : `radial-gradient(circle, rgba(26,92,56,${opacity}) 0%, transparent 70%)`,
              animation: `floatOrb${i % 3} ${o.dur} ${o.delay} ease-in-out infinite`,
              transform: "translate(-50%, -50%)",
              filter: "blur(1px)",
            }}
          />
        );
      })}
      {RING_CONFIGS.map((r, i) => (
        <div
          key={`ring-${i}`}
          style={{
            position: "absolute",
            left: r.x, top: r.y,
            width: r.size, height: r.size,
            borderRadius: "50%",
            border: `1px solid ${isDark ? "rgba(42,122,77,0.15)" : "rgba(26,92,56,0.1)"}`,
            animation: `floatOrb${(i + 1) % 3} ${r.dur} ${r.delay} ease-in-out infinite`,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  );
}

const SHAPE_CONFIGS = [
  { type: "diamond", size: 18, x: "15%", y: "25%", delay: "0s", dur: "12s" },
  { type: "cross",   size: 14, x: "82%", y: "18%", delay: "2s", dur: "15s" },
  { type: "diamond", size: 10, x: "70%", y: "72%", delay: "4s", dur: "10s" },
  { type: "cross",   size: 16, x: "28%", y: "82%", delay: "1s", dur: "13s" },
  { type: "diamond", size: 12, x: "92%", y: "50%", delay: "3s", dur: "11s" },
  { type: "cross",   size: 8,  x: "45%", y: "15%", delay: "5s", dur: "14s" },
];

function FloatingShapes({ variant = "light" }: { variant?: OrbVariant }) {
  const color = variant === "dark" ? "rgba(110,201,145,0.3)" : "rgba(26,92,56,0.2)";
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {SHAPE_CONFIGS.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: s.x, top: s.y,
            animation: `floatOrb${i % 3} ${s.dur} ${s.delay} ease-in-out infinite`,
            transform: "translate(-50%, -50%)",
          }}
        >
          {s.type === "diamond" ? (
            <div style={{ width: s.size, height: s.size, border: `1.5px solid ${color}`, transform: "rotate(45deg)" }} />
          ) : (
            <svg width={s.size * 2} height={s.size * 2} viewBox="0 0 20 20" fill="none">
              <line x1="10" y1="2" x2="10" y2="18" stroke={color} strokeWidth="1.5" />
              <line x1="2"  y1="10" x2="18" y2="10" stroke={color} strokeWidth="1.5" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────

interface NavbarProps {
  scrolled: boolean;
  menuOpen: boolean;
  onMenuToggle: () => void;
  onScrollTo: (id: string) => void;
}

function Navbar({ scrolled, menuOpen, onMenuToggle, onScrollTo }: NavbarProps) {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background:     scrolled ? "rgba(248,246,241,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom:   scrolled ? "1px solid var(--border)" : "none",
        padding:        scrolled ? "0.75rem 0" : "1.25rem 0",
      }}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-10 flex items-center justify-between">

        {/* Logo */}
        <button onClick={() => onScrollTo("home")} className="flex items-center gap-3 group">
          <div
            className="w-10 h-10 rounded-sm overflow-hidden flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
            style={{ background: "var(--green)" }}
          >
            {/* FIX 3: leading slash on image src */}
            <img
              src="/images/adpetlogo.jpeg"
              alt="ADPET logo"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                (e.currentTarget.nextElementSibling as HTMLElement | null)?.removeAttribute("hidden");
              }}
            />
            <span
              hidden
              className="text-white text-xs font-bold"
              style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em" }}
            >
              AD
            </span>
          </div>
          <div className="hidden sm:flex flex-col justify-center leading-none">
            <span
              className="font-display text-[1.05rem] font-600 leading-tight tracking-wide"
              style={{ color: scrolled ? "var(--charcoal)" : "white" }}
            >
              ADPET
            </span>
            <span
              className="font-body text-[0.58rem] uppercase tracking-[0.18em] mt-0.5"
              style={{ color: scrolled ? "var(--text-muted)" : "rgba(255,255,255,0.55)" }}
            >
              Investment Co.
            </span>
          </div>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              onClick={() => onScrollTo(link.toLowerCase())}
              className={`nav-link ${scrolled ? "scrolled" : ""}`}
            >
              {link}
            </button>
          ))}
        </div>

        {/* CTA + hamburger */}
        <div className="flex items-center gap-3">
          <button
            className={`hidden sm:inline-flex ${scrolled ? "btn-primary" : "btn-ghost"}`}
            style={{ borderRadius: 0 }}
            onClick={() => onScrollTo("contact")}
          >
            Enquire Now
          </button>
          <button className="md:hidden p-2" onClick={onMenuToggle} aria-label="Toggle menu">
            <div className="w-5 flex flex-col gap-1.5">
              {([0, 1, 2] as const).map((i) => (
                <span
                  key={i}
                  className="block h-px transition-all duration-300"
                  style={{
                    background: scrolled ? "var(--charcoal)" : "white",
                    transform:
                      i === 0 && menuOpen ? "rotate(45deg) translate(4px,4px)"
                      : i === 2 && menuOpen ? "rotate(-45deg) translate(4px,-4px)"
                      : "none",
                    opacity: i === 1 && menuOpen ? 0 : 1,
                  }}
                />
              ))}
            </div>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden border-t" style={{ background: "rgba(248,246,241,0.98)", borderColor: "var(--border)" }}>
          <div className="max-w-7xl mx-auto px-5 py-4 flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => onScrollTo(link.toLowerCase())}
                className="font-body text-xs uppercase tracking-widest text-left py-2"
                style={{ color: "var(--charcoal)" }}
              >
                {link}
              </button>
            ))}
            <button
              className="btn-primary w-full justify-center mt-2"
              onClick={() => onScrollTo("contact")}
            >
              Enquire Now
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────

interface HeroProps {
  parallax: number;
  onScrollTo: (id: string) => void;
}

const HERO_ORBS = [
  { w: 500, h: 500, x: "80%", y: "20%", delay: "0s",   dur: "18s", color: "rgba(26,92,56,0.18)" },
  { w: 300, h: 300, x: "15%", y: "70%", delay: "3s",   dur: "14s", color: "rgba(26,92,56,0.12)" },
  { w: 200, h: 200, x: "60%", y: "80%", delay: "6s",   dur: "11s", color: "rgba(42,122,77,0.1)"  },
  { w: 150, h: 150, x: "30%", y: "10%", delay: "1.5s", dur: "13s", color: "rgba(26,92,56,0.09)" },
];

const HERO_RINGS = [
  { s: 340, x: "88%", y: "50%", d: "22s", dl: "0s" },
  { s: 200, x: "12%", y: "30%", d: "17s", dl: "4s" },
  { s: 140, x: "55%", y: "15%", d: "12s", dl: "8s" },
];

function HeroSection({ parallax, onScrollTo }: HeroProps) {
  return (
    <section id="home" className="relative min-h-screen flex flex-col overflow-hidden">
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1800&q=85"
          alt="Lagos skyline and modern architecture"
          style={{
            width: "100%", height: "115%",
            objectFit: "cover", objectPosition: "center 30%",
            transform: `translateY(${parallax}px)`,
            display: "block",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(10,32,20,0.82) 0%, rgba(10,32,20,0.6) 50%, rgba(10,32,20,0.35) 100%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 220, background: "linear-gradient(to bottom, transparent, rgba(248,246,241,1))" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(26,92,56,0.25) 0%, transparent 60%)" }} />
      </div>

      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {HERO_ORBS.map((o, i) => (
          <div key={i} style={{
            position: "absolute", left: o.x, top: o.y,
            width: o.w, height: o.h, borderRadius: "50%",
            background: `radial-gradient(circle, ${o.color} 0%, transparent 70%)`,
            animation: `floatOrb${i % 3} ${o.dur} ${o.delay} ease-in-out infinite`,
            transform: "translate(-50%,-50%)",
            filter: "blur(2px)",
          }} />
        ))}
        {HERO_RINGS.map((r, i) => (
          <div key={`hr${i}`} style={{
            position: "absolute", left: r.x, top: r.y,
            width: r.s, height: r.s, borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.08)",
            animation: `floatOrb${i % 3} ${r.d} ${r.dl} ease-in-out infinite`,
            transform: "translate(-50%,-50%)",
          }} />
        ))}
      </div>

      <div
        className="relative max-w-7xl mx-auto px-5 md:px-10 w-full flex-1 flex flex-col justify-center pt-32 pb-28 md:pt-40 md:pb-36"
        style={{ zIndex: 2 }}
      >
        <div className="max-w-3xl">
          <div className="animate-fade-up flex items-center gap-3 mb-8">
            <div className="w-8 h-px" style={{ background: "rgba(110,201,145,0.8)" }} />
            <span className="font-body text-xs uppercase tracking-widest" style={{ color: "rgba(110,201,145,0.9)" }}>
              CAC Registered · RC: 7202166
            </span>
          </div>

          <h1
            className="font-display animate-fade-up-d1 mb-6 text-white leading-[1.05]"
            style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)", fontWeight: 600, letterSpacing: "-0.01em" }}
          >
            Diversified
            <br />
            <em style={{ color: "#6ec991", fontStyle: "italic" }}>Investments.</em>
            <br />
            Uncompromising
            <br />
            Excellence.
          </h1>

          <p
            className="font-body animate-fade-up-d2 mb-10 leading-relaxed max-w-xl"
            style={{ fontSize: "1rem", color: "rgba(255,255,255,0.72)", fontWeight: 300 }}
          >
            Nigeria's premier multi-disciplinary investment company spanning Real Estate,
            Building Materials, Automobile, and General Contracts. Quality delivered across
            every sector we serve.
          </p>

          <div className="animate-fade-up-d3 flex flex-col sm:flex-row gap-3">
            <button className="btn-primary" onClick={() => onScrollTo("sectors")}>
              Explore Our Portfolio
              <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                <path d="M3 8H13M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className="btn-ghost" onClick={() => onScrollTo("contact")}>
              Contact an Expert
            </button>
          </div>

          <div className="mt-16 flex items-center gap-4 animate-fade-up-d3">
            <button
              onClick={() => onScrollTo("sectors")}
              className="flex items-center gap-3 opacity-50 hover:opacity-80 transition-opacity"
            >
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                animation: "pulseRing 2.5s ease infinite",
              }}>
                <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
                  <path d="M8 3v10M4 9l4 4 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="font-body text-xs uppercase tracking-widest text-white">Scroll Down</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// STATS BAND
// ─────────────────────────────────────────────

function StatsBand() {
  return (
    <section style={{ background: "var(--green)", position: "relative", overflow: "hidden" }}>
      <FloatingOrbs variant="dark" />
      <FloatingShapes variant="dark" />
      <div className="max-w-7xl mx-auto px-5 md:px-10 relative" style={{ zIndex: 1 }}>
        <div className="grid grid-cols-2 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="stat-item">
              <div className="font-display font-300 mb-1 text-white" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}>
                {s.value}
                {s.sublabel && <span className="font-body text-sm ml-1 opacity-80">{s.sublabel}</span>}
              </div>
              <div className="font-body text-xs uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.6)" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// SECTORS
// ─────────────────────────────────────────────

function SectorsSection() {
  return (
    <section id="sectors" className="py-24 md:py-32 relative overflow-hidden" style={{ background: "var(--warm-grey)" }}>
      <FloatingOrbs variant="light" />
      <FloatingShapes variant="light" />

      <div className="max-w-7xl mx-auto px-5 md:px-10 relative" style={{ zIndex: 1 }}>
        <div className="mb-14 md:mb-20">
          <div className="section-line" />
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="font-body text-xs uppercase tracking-widest mb-3" style={{ color: "var(--green)" }}>
                Our Business Arms
              </p>
              <h2 className="font-display leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 600, color: "var(--charcoal)" }}>
                Core Business
                <br />
                <em style={{ color: "var(--green)", fontStyle: "italic" }}>Sectors</em>
              </h2>
            </div>
            <p className="font-body max-w-xs md:max-w-sm leading-relaxed" style={{ color: "var(--text-muted)", fontSize: "0.9rem", fontWeight: 300 }}>
              Across four strategic sectors, ADPET delivers excellence with a unified commitment
              to quality, integrity, and measurable impact.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SECTORS.map((sector) => (
            <div key={sector.id} className="sector-card rounded-sm">
              <div className="overflow-hidden" style={{ height: 180 }}>
                <img src={sector.img} alt={sector.label} className="card-img" />
              </div>
              <div className="p-6">
                <div className="icon-wrap mb-3">{sector.icon}</div>
                <div className="font-body text-xs uppercase tracking-widest mb-2" style={{ color: "var(--green)" }}>
                  {sector.label}
                </div>
                <h3 className="font-display font-600 mb-3 leading-tight" style={{ fontSize: "1.2rem", color: "var(--charcoal)" }}>
                  {sector.headline}
                </h3>
                <p className="font-body mb-4 leading-relaxed" style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 300 }}>
                  {sector.description}
                </p>
                <div>
                  {sector.tags.map((tag) => (
                    <span key={tag} className="tag-pill">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// MARQUEE BAND
// ─────────────────────────────────────────────

function MarqueeBand() {
  const items = Array(3).fill(MARQUEE_ITEMS).flat();
  return (
    <div className="py-5 overflow-hidden relative" style={{ background: "var(--charcoal)", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div
        className="flex gap-12 whitespace-nowrap font-body text-xs uppercase tracking-widest"
        style={{ color: "rgba(255,255,255,0.3)", animation: "marquee 28s linear infinite" }}
      >
        {items.map((text, i) => (
          <span key={i} className="shrink-0">{text}&nbsp;&nbsp;·</span>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ABOUT
// ─────────────────────────────────────────────

function AboutSection() {
  return (
    <section id="about" className="py-24 md:py-32 relative overflow-hidden" style={{ background: "var(--off-white)" }}>
      <FloatingOrbs variant="light" />
      <FloatingShapes variant="light" />

      <div
        className="absolute font-display select-none pointer-events-none"
        style={{
          fontSize: "clamp(8rem, 18vw, 20rem)", fontWeight: 700,
          color: "rgba(26,92,56,0.03)", right: "-2%", top: "50%",
          transform: "translateY(-50%)", lineHeight: 1, zIndex: 0,
          letterSpacing: "-0.04em",
        }}
      >
        ADPET
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-10 relative" style={{ zIndex: 1 }}>
        <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-start">
          <div className="md:col-span-5">
            <div className="section-line" />
            <p className="font-body text-xs uppercase tracking-widest mb-4" style={{ color: "var(--green)" }}>
              Corporate Profile
            </p>
            <h2 className="font-display leading-tight mb-8" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 600, color: "var(--charcoal)" }}>
              Premier<br />Multi-Disciplinary<br />
              <em style={{ color: "var(--green)", fontStyle: "italic" }}>Investment.</em>
            </h2>

            <div className="relative rounded-sm overflow-hidden" style={{ height: 320 }}>
              <img
                src="/images/ceo.jpg"
                alt="ADPET corporate office"
                style={{ width: "100%", height: "160%", objectFit: "cover", display: "block" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,32,20,0.6) 0%, transparent 60%)" }} />
              <div style={{ position: "absolute", bottom: "1.25rem", left: "1.25rem" }}>
                <div className="font-body text-xs uppercase tracking-widest mb-1" style={{ color: "rgba(110,201,145,0.9)" }}>
                  Est. Nigeria
                </div>
                <div className="font-display text-2xl text-white italic">ADPET Group</div>
              </div>
            </div>

            <div className="mt-6 p-5 rounded-sm" style={{ background: "var(--green-pale)", borderLeft: "3px solid var(--green)" }}>
              <div className="font-display text-sm italic mb-1" style={{ color: "var(--green)" }}>
                "Quality. Reliability. Excellence."
              </div>
              <div className="font-body text-xs" style={{ color: "var(--text-muted)", letterSpacing: "0.05em" }}>
                — ADPET Investment Company
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
            <p className="font-body leading-loose mb-6" style={{ fontSize: "1.05rem", color: "var(--charcoal)", fontWeight: 300 }}>
              ADPET Investment Company Nigeria Limited is a premier, multi-disciplinary
              investment and trading company duly registered with the Corporate Affairs Commission of
              Nigeria. We are strategically positioned to deliver world-class products and services
              across our four core business sectors.
            </p>
            <p className="font-body leading-loose mb-6" style={{ fontSize: "0.95rem", color: "var(--text-muted)", fontWeight: 300 }}>
              Our founding principle is simple: every sector we enter, we serve with uncompromising
              quality. From luxury property development to high-grade building materials, premium
              automobile services to large-scale corporate procurement ADPET brings institutional
              rigour, commercial agility, and an unwavering commitment to client satisfaction.
            </p>
            <p className="font-body leading-loose" style={{ fontSize: "0.95rem", color: "var(--text-muted)", fontWeight: 300 }}>
              Wholly Nigerian owned and operated, we are proud contributors to Nigeria's economic
              growth building infrastructure, enabling trade, and creating lasting value for our
              clients, partners, and communities.
            </p>

            <div className="divider my-8" />

            <div className="grid sm:grid-cols-2 gap-5">
              {ABOUT_FACTS.map((item) => (
                <div key={item.label}>
                  <div className="font-body text-xs uppercase tracking-widest mb-1" style={{ color: "var(--green)" }}>
                    {item.label}
                  </div>
                  <div className="font-body text-sm" style={{ color: "var(--charcoal)", fontWeight: 400 }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {ABOUT_IMAGES.map((src, i) => (
                <div key={i} className="overflow-hidden rounded-sm" style={{ height: 100 }}>
                  <img
                    src={src}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s ease" }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// CONTACT
// ─────────────────────────────────────────────

interface ContactSectionProps {
  formState: FormState;
  submitted: boolean;
  onFormChange: (updates: Partial<FormState>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

function ContactSection({ formState, submitted, onFormChange, onSubmit }: ContactSectionProps) {
  return (
    <section id="contact" className="py-24 md:py-32 relative overflow-hidden" style={{ background: "var(--warm-grey)" }}>
      <FloatingOrbs variant="light" />
      <FloatingShapes variant="light" />

      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=70"
          alt=""
          style={{
            width: "50%", height: "100%", objectFit: "cover",
            objectPosition: "center", display: "block", opacity: 0.08,
            position: "absolute", right: 0, top: 0,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-10 relative" style={{ zIndex: 1 }}>
        <div className="grid md:grid-cols-12 gap-14 md:gap-20">
          <div className="md:col-span-5">
            <div className="section-line" />
            <p className="font-body text-xs uppercase tracking-widest mb-4" style={{ color: "var(--green)" }}>
              Get In Touch
            </p>
            <h2 className="font-display leading-tight mb-6" style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 600, color: "var(--charcoal)" }}>
              Start a<br />Conversation<br />
              <em style={{ color: "var(--green)", fontStyle: "italic" }}>With Us.</em>
            </h2>
            <p className="font-body leading-relaxed mb-10" style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: 300 }}>
              Whether you're exploring investment opportunities, seeking construction materials,
              or looking for automotive solutions our team is ready to assist you.
            </p>

            <div className="flex flex-col gap-6 mb-10">
              {CONTACT_ITEMS.map((c) => (
                <div key={c.label} className="flex gap-4">
                  <div className="w-9 h-9 rounded-sm flex items-center justify-center shrink-0 text-sm" style={{ background: "var(--green-pale)" }}>
                    {c.icon}
                  </div>
                  <div>
                    <div className="font-body text-xs uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>
                      {c.label}
                    </div>
                    <div className="font-body text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--charcoal)" }}>
                      {c.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-sm overflow-hidden" style={{ height: 200 }}>
              <img
                src="/images/coperate profile.jpg"
                alt="ADPET team"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="rounded-sm p-8 md:p-12" style={{ background: "white", border: "1px solid var(--border)", boxShadow: "0 4px 40px rgba(0,0,0,0.06)" }}>
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
                    style={{ background: "var(--green-pale)", animation: "pulseRing 2s ease infinite" }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" style={{ color: "var(--green)" }}>
                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="font-display text-2xl font-600 mb-3" style={{ color: "var(--charcoal)" }}>
                    Enquiry Received
                  </h3>
                  <p className="font-body text-sm" style={{ color: "var(--text-muted)" }}>
                    Thank you for reaching out. A member of our team will contact you within 1–2 business days.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="font-display text-xl font-600 mb-8" style={{ color: "var(--charcoal)" }}>
                    Send an Enquiry
                  </h3>
                  <form onSubmit={onSubmit} className="flex flex-col gap-7">
                    <div className="grid sm:grid-cols-2 gap-7">
                      <div>
                        <label className="font-body text-xs uppercase tracking-widest block mb-3" style={{ color: "var(--text-muted)" }}>
                          Full Name
                        </label>
                        <input
                          type="text" required className="form-field" placeholder="Your full name"
                          value={formState.name}
                          onChange={(e) => onFormChange({ name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="font-body text-xs uppercase tracking-widest block mb-3" style={{ color: "var(--text-muted)" }}>
                          Email Address
                        </label>
                        <input
                          type="email" required className="form-field" placeholder="your@email.com"
                          value={formState.email}
                          onChange={(e) => onFormChange({ email: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-body text-xs uppercase tracking-widest block mb-3" style={{ color: "var(--text-muted)" }}>
                        Area of Interest
                      </label>
                      <select
                        className="form-field" style={{ cursor: "pointer" }}
                        value={formState.sector}
                        onChange={(e) => onFormChange({ sector: e.target.value })}
                      >
                        <option value="">Select a sector</option>
                        <option>Real Estate &amp; Property Development</option>
                        <option>Building Materials</option>
                        <option>Automobile Division</option>
                        <option>General Contracts &amp; Merchandise</option>
                        <option>General Enquiry</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-body text-xs uppercase tracking-widest block mb-3" style={{ color: "var(--text-muted)" }}>
                        Message
                      </label>
                      <textarea
                        required rows={4} className="form-field resize-none"
                        placeholder="Tell us about your enquiry..."
                        value={formState.message}
                        onChange={(e) => onFormChange({ message: e.target.value })}
                      />
                    </div>
                    <button type="submit" className="btn-primary w-full justify-center py-4 text-sm">
                      Submit Enquiry
                      <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                        <path d="M3 8H13M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────

interface FooterProps {
  onScrollTo: (id: string) => void;
}

function Footer({ onScrollTo }: FooterProps) {
  return (
    <footer style={{ background: "var(--charcoal)", color: "rgba(255,255,255,0.7)", position: "relative", overflow: "hidden" }}>
      <FloatingOrbs variant="dark" />

      <div style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.04 }}>
        <img
          src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=60"
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-10 py-16 relative" style={{ zIndex: 1 }}>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 mb-14">

          {/* Brand column */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-sm overflow-hidden flex items-center justify-center shrink-0"
                style={{ background: "var(--green)" }}
              >
                {/* FIX 3: leading slash on image src */}
                <img
                  src="/images/adpetlogo.jpeg"
                  alt="ADPET logo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    (e.currentTarget.nextElementSibling as HTMLElement | null)?.removeAttribute("hidden");
                  }}
                />
                <span
                  hidden
                  className="text-white text-xs font-bold"
                  style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em" }}
                >
                  AD
                </span>
              </div>
              <div className="flex flex-col justify-center leading-none">
                <span className="font-display text-white text-[1.05rem] font-500 leading-tight tracking-wide">
                  ADPET
                </span>
                <span className="font-body text-[0.58rem] uppercase tracking-[0.18em] mt-0.5 opacity-50">
                  Investment Co.
                </span>
              </div>
            </div>

            <p className="font-body text-xs leading-relaxed mb-5 opacity-60">
              Premier multi-disciplinary investment company delivering excellence across Nigeria's key economic sectors.
            </p>

            {/* FIX 2: Correct <a> opening tag, no duplicate SOCIAL_LINKS */}
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-sm border flex items-center justify-center cursor-pointer transition-all"
                  style={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--green)";
                    e.currentTarget.style.color = "#6ec991";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigate */}
          <div>
            <div className="font-body text-xs uppercase tracking-widest mb-5 text-white">Navigate</div>
            <div className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <button
                  key={link}
                  onClick={() => onScrollTo(link.toLowerCase())}
                  className="font-body text-sm text-left opacity-60 hover:opacity-100 transition-opacity"
                >
                  {link}
                </button>
              ))}
            </div>
          </div>

          {/* Sectors */}
          <div>
            <div className="font-body text-xs uppercase tracking-widest mb-5 text-white">Sectors</div>
            <div className="flex flex-col gap-3">
              {SECTORS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onScrollTo("sectors")}
                  className="font-body text-sm text-left opacity-60 hover:opacity-100 transition-opacity"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <div className="font-body text-xs uppercase tracking-widest mb-5 text-white">Legal</div>
            <div className="flex flex-col gap-3">
              {LEGAL_LINKS.map((l) => (
                <a
                  key={l}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="font-body text-sm opacity-60 hover:opacity-100 transition-opacity"
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          className="pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
        >
          <div className="font-body text-xs opacity-40">
            © {new Date().getFullYear()} ADPET Investment Company Nigeria Limited. All rights reserved.
          </div>
          <div className="font-body text-xs opacity-40">RC: 7202166 · Registered in Nigeria</div>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────
// ROOT PAGE
// ─────────────────────────────────────────────

export default function ADPETLanding() {
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [scrolled,  setScrolled]  = useState(false);
  const [parallax,  setParallax]  = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [formState, setFormState] = useState<FormState>({ name: "", email: "", sector: "", message: "" });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      setParallax(window.scrollY * 0.35);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  }, []);

  const handleFormChange = useCallback((updates: Partial<FormState>) => {
    setFormState((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  }, []);

  return (
    <div className="font-sans bg-[#f8f6f1] text-[#1a1a1a] min-h-screen overflow-x-hidden">
      <style>{GLOBAL_STYLES}</style>

      <Navbar
        scrolled={scrolled}
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((v) => !v)}
        onScrollTo={scrollTo}
      />

      <HeroSection parallax={parallax} onScrollTo={scrollTo} />
      <StatsBand />
      <SectorsSection />
      <MarqueeBand />
      <AboutSection />

      <ContactSection
        formState={formState}
        submitted={submitted}
        onFormChange={handleFormChange}
        onSubmit={handleSubmit}
      />

      <Footer onScrollTo={scrollTo} />
    </div>
  );
}