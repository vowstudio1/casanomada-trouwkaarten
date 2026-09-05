import Link from "next/link";
import { ArrowLeft, ArrowRight, Heart } from "lucide-react";

const templates = [
  { name: "Romantisch Rood",   bg: "bg-rose-50",    accent: "bg-brand-800",   tag: "Bestseller" },
  { name: "Modern Wit",        bg: "bg-gray-50",    accent: "bg-gray-800",    tag: null },
  { name: "Botanisch Groen",   bg: "bg-emerald-50", accent: "bg-emerald-800", tag: "Nieuw" },
  { name: "Gouden Glans",      bg: "bg-amber-50",   accent: "bg-amber-700",   tag: null },
  { name: "Lavendel Droom",    bg: "bg-purple-50",  accent: "bg-purple-800",  tag: null },
  { name: "Zeeblauw",          bg: "bg-sky-50",     accent: "bg-sky-800",     tag: null },
  { name: "Dusty Rose",        bg: "bg-pink-50",    accent: "bg-pink-800",    tag: "Populair" },
  { name: "Terracotta",        bg: "bg-orange-50",  accent: "bg-orange-800",  tag: null },
  { name: "Salie Groen",       bg: "bg-green-50",   accent: "bg-green-700",   tag: null },
  { name: "Ivoor & Goud",      bg: "bg-yellow-50",  accent: "bg-yellow-700",  tag: null },
  { name: "Midnight Blue",     bg: "bg-blue-50",    accent: "bg-blue-900",    tag: null },
  { name: "Blush & Nude",      bg: "bg-rose-50",    accent: "bg-rose-700",    tag: null },
  { name: "Olijfgroen",        bg: "bg-lime-50",    accent: "bg-lime-800",    tag: "Nieuw" },
  { name: "Warm Taupe",        bg: "bg-stone-50",   accent: "bg-stone-700",   tag: null },
  { name: "Koraalrood",        bg: "bg-red-50",     accent: "bg-red-700",     tag: null },
  { name: "Indigo Nacht",      bg: "bg-indigo-50",  accent: "bg-indigo-800",  tag: null },
  { name: "Champagne",         bg: "bg-amber-50",   accent: "bg-amber-600",   tag: null },
  { name: "Klassiek Zwart",    bg: "bg-zinc-100",   accent: "bg-zinc-900",    tag: null },
];

export const metadata = {
  title: "Sjablonen | Casa Nomada Digital",
  description: "Blader door 18 prachtige digitale trouwuitnodiging sjablonen.",
};

export default function TemplatesPage() {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-sans text-sm tracking-[0.25em] uppercase font-medium text-[#16161D]">
            CASA NOMADA DIGITAL
          </Link>
          <Link href="/" className="flex items-center gap-2 text-sm text-text-muted hover:text-[#16161D] font-sans">
            <ArrowLeft size={16} /> Terug
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-24 bg-cream min-h-screen">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.2em] uppercase text-brand-600 mb-3 font-sans font-medium">
              Ontwerpen
            </p>
            <h1 className="font-serif text-5xl md:text-6xl text-[#16161D] mb-4">
              Alle sjablonen
            </h1>
            <p className="font-sans text-text-muted max-w-xl mx-auto">
              18 professioneel ontworpen sjablonen, elk volledig aanpasbaar aan uw stijl en wensen.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {templates.map((t, i) => (
              <div key={i} className={`card-hover rounded-2xl ${t.bg} p-5 border border-white/80 relative`}>
                {t.tag && (
                  <span className="absolute top-4 right-4 text-[10px] font-sans bg-brand-800 text-white rounded-full px-2.5 py-0.5">
                    {t.tag}
                  </span>
                )}
                <div className="rounded-xl overflow-hidden mb-4 bg-white shadow-sm">
                  <div className={`${t.accent} h-10 flex items-center justify-between px-4`}>
                    <span className="text-white/80 text-[9px] font-sans tracking-widest uppercase">Uitnodiging</span>
                    <Heart size={10} className="text-white/60" />
                  </div>
                  <div className="p-4 text-center">
                    <p className="font-serif text-xl text-[#16161D] mb-0.5">Sophie &amp; Thomas</p>
                    <p className="font-sans text-[10px] text-text-muted mb-3">14 juni 2025 &bull; Kasteel Hoensbroek</p>
                    <div className={`${t.accent} rounded-full py-1.5 px-4 text-[9px] text-white font-sans inline-block tracking-wide`}>
                      RSVP BEVESTIGEN
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-sans text-sm font-medium text-[#16161D]">{t.name}</p>
                  <button className="text-brand-800 hover:text-brand-600 transition-colors">
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 bg-brand-800 text-white rounded-full px-8 py-3.5 font-sans text-sm font-medium hover:bg-brand-700 transition-colors"
            >
              Kies een pakket <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
