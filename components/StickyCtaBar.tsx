"use client";

import Link from "next/link";

export default function StickyCtaBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sticky-cta border-t border-gray-200 py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden sm:block">
          <span className="text-lg font-serif text-dark">€89</span>
          <span className="text-xs text-dark/40 ml-2">Eenmalige betaling, geen abonnement</span>
        </div>
        <Link href="/templates" className="bg-brand-800 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-brand-700 transition-colors w-full sm:w-auto text-center">
          Maak jullie uitnodiging — gratis
        </Link>
      </div>
    </div>
  );
}
