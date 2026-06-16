// component/Navbar.tsx — REPLACE your existing one

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ── Routes match YOUR actual folder names: app/sale/ and app/service/ ──
const NAV_LINKS = [
  { label: "Home",     href: "/"         },
  { label: "Sectors",  href: "/#sectors" },
  { label: "Sales",    href: "/sale"     },
  { label: "Services", href: "/service"  },
  { label: "About",    href: "/#about"   },
  { label: "Contact",  href: "/#contact" },
] as const;

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

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
  *, *::before, *::after { box-sizing: border-box; }

  /* ── Nav link: color is ONLY green on hover, never permanently green ── */
  .nav-link {
    position: relative;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    background: none; border: none; cursor: pointer;
    text-decoration: none; padding: 0;
    transition: color 0.22s ease;
  }
  /* Default colour depends on whether navbar is scrolled */
  .nav-link.light { color: rgba(255,255,255,0.75); }
  .nav-link.dark  { color: var(--text-muted); }

  /* Underline bar — hidden by default, slides in on hover */
  .nav-link::after {
    content: '';
    position: absolute; bottom: -3px; left: 0; right: 100%;
    height: 1.5px; background: var(--green);
    transition: right 0.28s ease;
  }

  /* HOVER ONLY — green text + underline slides in */
  .nav-link:hover { color: var(--green) !important; }
  .nav-link:hover::after { right: 0; }

  /* Active page — underline stays, text is green */
  .nav-link.active-link { color: var(--green) !important; }
  .nav-link.active-link::after { right: 0; }

  /* ── CTA buttons ── */
  .btn-nav-primary {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: var(--green); color: white !important;
    font-family: 'DM Sans', sans-serif; font-size: 0.75rem;
    font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
    padding: 0.7rem 1.5rem; border: none; cursor: pointer;
    transition: background 0.25s, transform 0.2s; text-decoration: none;
  }
  .btn-nav-primary:hover { background: var(--green-light); transform: translateY(-1px); }

  .btn-nav-ghost {
    display: inline-flex; align-items: center;
    background: transparent; color: white !important;
    font-family: 'DM Sans', sans-serif; font-size: 0.75rem;
    font-weight: 400; letter-spacing: 0.1em; text-transform: uppercase;
    padding: 0.7rem 1.5rem; border: 1px solid rgba(255,255,255,0.5);
    cursor: pointer; transition: all 0.25s; text-decoration: none;
  }
  .btn-nav-ghost:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.9); }

  /* ── Mobile drawer link ── */
  .mobile-nav-link {
    font-family: 'DM Sans', sans-serif; font-size: 0.8rem;
    text-transform: uppercase; letter-spacing: 0.12em;
    text-decoration: none; padding: 13px 0;
    border-bottom: 1px solid var(--border);
    transition: color 0.2s;
    display: block;
  }
  .mobile-nav-link:hover { color: var(--green) !important; }

  /* ── Responsive visibility ── */
  @media (min-width: 768px) { .hamburger-btn { display: none !important; } }
  @media (max-width: 767px) { .desktop-links { display: none !important; } }
`;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close mobile drawer whenever route changes
  useEffect(() => setMenuOpen(false), [pathname]);

  // Highlight the active page link (ignores hash portion)
  const isActive = (href: string) => {
    const page = href.split("#")[0];
    if (page === "/") return pathname === "/";
    return pathname.startsWith(page);
  };

  return (
    <>
      <style>{STYLES}</style>

      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          transition: "all 0.3s",
          background:     scrolled ? "rgba(248,246,241,0.96)" : "transparent",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          borderBottom:   scrolled ? "1px solid var(--border)" : "none",
          padding:        scrolled ? "0.75rem 0" : "1.25rem 0",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* ── Logo ── */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <div style={{ width: 40, height: 40, background: "var(--green)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, borderRadius: 2 }}>
              <img
                src="/images/adpetlogo.jpeg"
                alt="ADPET logo"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            </div>
            <div style={{ lineHeight: 1 }}>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.05rem", fontWeight: 600, letterSpacing: "0.06em",
                color: scrolled ? "var(--charcoal)" : "white",
              }}>
                ADPET
              </div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.18em", marginTop: 2,
                color: scrolled ? "var(--text-muted)" : "rgba(255,255,255,0.55)",
              }}>
                Investment Co.
              </div>
            </div>
          </Link>

          {/* ── Desktop nav links ── */}
          <div
            className="desktop-links"
            style={{ display: "flex", alignItems: "center", gap: 32 }}
          >
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className={`nav-link ${scrolled ? "dark" : "light"} ${isActive(href) ? "active" : ""}`}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/#contact"
              className={scrolled ? "btn-nav-primary" : "btn-nav-ghost"}
              style={{marginLeft: 150}}
            >
              Enquire Now
            </Link>
          </div>

          {/* ── CTA + hamburger ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            

            {/* Hamburger — visible only on mobile via CSS */}
            <button
              className="hamburger-btn"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "8px 4px",
                /* shown via media query override in STYLES */
              }}
            >
              <div style={{ width: 22, display: "flex", flexDirection: "column", gap: 5 }}>
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    style={{
                      display: "block",
                      height: "1.5px",
                      borderRadius: 2,
                      background: scrolled ? "var(--charcoal)" : "white",
                      transition: "all 0.3s",
                      transform:
                        i === 0 && menuOpen ? "rotate(45deg) translate(4px, 4.5px)"
                        : i === 2 && menuOpen ? "rotate(-45deg) translate(4px, -4.5px)"
                        : "none",
                      opacity: i === 1 && menuOpen ? 0 : 1,
                    }}
                  />
                ))}
              </div>
            </button>
          </div>
        </div>

        {/* ── Mobile drawer ── */}
        {menuOpen && (
          <div
            style={{
              background: "rgba(248,246,241,0.98)",
              borderTop: "1px solid var(--border)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                maxWidth: 1280, margin: "0 auto",
                padding: "0.5rem 1.25rem 1.25rem",
                display: "flex", flexDirection: "column",
              }}
            >
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="mobile-nav-link"
                  onClick={() => setMenuOpen(false)}
                  style={{ color: isActive(href) ? "var(--green)" : "var(--charcoal)" }}
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/#contact"
                className="btn-nav-primary"
                style={{ marginTop: 14, justifyContent: "center", textAlign: "center" }}
                onClick={() => setMenuOpen(false)}
              >
                Enquire Now
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}