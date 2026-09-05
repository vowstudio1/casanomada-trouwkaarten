"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
    <header className="fixed top-0 left-0 right-0 z-50 sticky-cta border-b border-brand-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="tracking-[0.25em] text-sm sm:text-base font-semibold text-brand-950 uppercase">
            {SITE_NAME}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-brand-800 hover:text-brand-950 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-brand-800 hover:text-brand-950 transition-colors">
              INLOGGEN
            </Link>
            <Link
              href="/templates"
              className="bg-brand-950 text-white text-sm px-5 py-2.5 rounded-full hover:bg-brand-800 transition-colors"
            >
              MAAK JE UITNODIGING
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-brand-800"
            aria-label="Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {mobileOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-brand-100 bg-cream"
          >
            <nav className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-brand-800 py-2"
                >
                  {link.label}
                </a>
              ))}
              <hr className="border-brand-100" />
              <Link href="/dashboard" className="text-brand-800 py-2" onClick={() => setMobileOpen(false)}>
                Inloggen
              </Link>
              <Link
                href="/templates"
                className="bg-brand-950 text-white text-center py-3 rounded-full"
                onClick={() => setMobileOpen(false)}
              >
                Maak je uitnodiging
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
