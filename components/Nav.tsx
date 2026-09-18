"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Sjablonen", href: "/templates" },
  { label: "Hoe het werkt", href: "/#werkwijze" },
  { label: "Voordelen", href: "/#voordelen" },
  { label: "Prijzen", href: "/#prijzen" },
  { label: "FAQ", href: "/#faq" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid #E8E6E3",
      }}
    >
      <div
        style={{
          maxWidth: "80rem",
          margin: "0 auto",
          padding: "0 1.5rem",
          height: "4rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "1.0625rem",
            fontWeight: 600,
            letterSpacing: "0.2em",
            color: "#16161D",
            textDecoration: "none",
          }}
        >
          CASA NOMADA
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex" style={{ alignItems: "center", gap: "2rem" }}>
          {navLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              style={{
                fontSize: "0.8125rem",
                color: "#6B6B76",
                textDecoration: "none",
                fontFamily: "system-ui, sans-serif",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#16161D")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6B6B76")}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex" style={{ alignItems: "center", gap: "1rem" }}>
          <Link
            href="/login"
            style={{
              fontSize: "0.8125rem",
              color: "#6B6B76",
              textDecoration: "none",
              fontFamily: "system-ui, sans-serif",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#16161D")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6B6B76")}
          >
            Inloggen
          </Link>
          <Link
            href="/register"
            style={{
              fontSize: "0.75rem",
              backgroundColor: "#8B2635",
              color: "#FFFFFF",
              padding: "0.625rem 1.25rem",
              borderRadius: "9999px",
              textDecoration: "none",
              fontFamily: "system-ui, sans-serif",
              letterSpacing: "0.1em",
              fontWeight: 600,
              textTransform: "uppercase",
              transition: "background-color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#701e2a")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#8B2635")}
          >
            Maak je uitnodiging
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden"
          style={{
            padding: "0.5rem",
            color: "#16161D",
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderBottom: "1px solid #E8E6E3",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          }}
        >
          <nav style={{ padding: "0.25rem 1.5rem" }}>
            {navLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                style={{
                  display: "block",
                  padding: "0.875rem 0",
                  fontSize: "0.9375rem",
                  color: "#16161D",
                  textDecoration: "none",
                  borderBottom: "1px solid #F3F1EF",
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div style={{ padding: "1rem 1.5rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              style={{
                padding: "0.75rem 1rem",
                fontSize: "0.9375rem",
                color: "#8B2635",
                textDecoration: "none",
                border: "1px solid #E0CCC9",
                borderRadius: "0.5rem",
                textAlign: "center",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Inloggen
            </Link>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              style={{
                padding: "0.75rem 1rem",
                fontSize: "0.875rem",
                backgroundColor: "#8B2635",
                color: "#FFFFFF",
                textDecoration: "none",
                borderRadius: "9999px",
                textAlign: "center",
                fontFamily: "system-ui, sans-serif",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Maak je uitnodiging
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
