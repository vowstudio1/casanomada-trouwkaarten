"use client";

import Link from "next/link";

export default function StickyCtaBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sticky-cta border-t border-brand-100 py-3 px-4 sm:px-6 flex items-center justify-between max-w-7xl mx-auto">
      <div className="hidden sm:block">
        <span className="text-lg font-serif text-brand-950">€89</span>
        <span className="text-xs text-brand-500 ml-2">Eenmalige betaling, geen abonnement</span>
      </div>
      <Link
        href="/templates"
        className="bg-brand-950 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-brand-800 transition-colors w-full sm:w-auto text-center"
      >
        Maak jullie uitnodiging — gratis
      </Link>
    </div>
  );
}
