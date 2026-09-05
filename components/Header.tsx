"use client";

import { useState } from "react";
import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

const navLinks = [
  { href: "#hoe-het-werkt", label: "Hoe het werkt" },
  { href: "#voordelen", label: "Voordelen" },
  { href: "#prijzen", label: "Prijzen" },
  { href: "#faq", label: "FAQ" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 sticky-cta border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="tracking-[0.25em] text-sm sm:text-base font-medium text-brand-800 uppercase">
            {SITE_NAME}
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-sm text-dark/70 hover:text-dark transition-colors">
                {link.label}
              </a>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-dark/70 hover:text-dark transition-colors tracking-wider uppercase">
              Inloggen
            </Link>
            <Link href="/templates" className="bg-brand-800 text-white text-sm px-6 py-2.5 rounded-full hover:bg-brand-700 transition-colors tracking-wider uppercase">
              Maak je uitnodiging
            </Link>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-dark" aria-label="Menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {mobileOpen ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <nav className="px-4 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="text-dark/70 py-2">{link.label}</a>
            ))}
            <hr className="border-gray-100" />
            <Link href="/dashboard" className="text-dark/70 py-2" onClick={() => setMobileOpen(false)}>Inloggen</Link>
            <Link href="/templates" className="bg-brand-800 text-white text-center py-3 rounded-full" onClick={() => setMobileOpen(false)}>Maak je uitnodiging</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
