import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Prijzen | Casa Nomada Digital",
  description: "Eerlijke, transparante prijzen voor uw digitale trouwuitnodiging.",
};

const plans = [
  {
    name:     "Starter",
    price:    "89",
    period:   "eenmalig",
    desc:     "Perfect voor intieme bruiloften tot 50 gasten.",
    features: [
      "1 digitale uitnodiging",
      "Tot 50 gasten",
      "RSVP-systeem",
      "WhatsApp & e-mail delen",
      "Mobiel geoptimaliseerd",
      "3 maanden online",
      "E-mail support",
    ],
    notIncluded: ["AI-personalisatie", "Gastenboek", "Tafelindeling", "Meertalig"],
    cta:      "Aan de slag",
    highlight: false,
  },
  {
    name:     "Premium",
    price:    "149",
    period:   "eenmalig",
    desc:     "Onze meest gekozen optie voor een complete ervaring.",
    features: [
      "3 digitale uitnodigingen",
      "Onbeperkte gasten",
      "AI-tekstpersonalisatie",
      "Gastenboek met foto's",
      "WhatsApp & e-mail delen",
      "Meertalige versie (6 talen)",
      "12 maanden online",
      "Prioriteit support",
    ],
    notIncluded: ["AI-tafelindeling", "Live dag-website"],
    cta:      "Meest gekozen",
    highlight: true,
  },
  {
    name:     "Luxe",
    price:    "249",
    period:   "eenmalig",
    desc:     "De volledige ervaring voor de perfecte bruiloft.",
    features: [
      "Onbeperkte uitnodigingen",
      "Onbeperkte gasten",
      "AI-tafelindeling",
      "Live dag-website",
      "Fotogalerij voor gasten",
      "Persoonlijke URL",
      "Meertalig (10+ talen)",
      "Eeuwige bewaring",
      "Telefonische support",
    ],
    notIncluded: [],
    cta:      "Alles inbegrepen",
    highlight: false,
  },
];

export default function PricingPage() {
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
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.2em] uppercase text-brand-600 mb-3 font-sans font-medium">
              Prijzen
            </p>
            <h1 className="font-serif text-5xl md:text-6xl text-[#16161D] mb-4">
              Eerlijk &amp; transparant
            </h1>
            <p className="font-sans text-text-muted max-w-xl mx-auto text-lg">
              Eenmalige betaling. Geen verborgen kosten. 14 dagen geld-terug-garantie.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {plans.map((p, i) => (
              <div
                key={i}
                className={`rounded-2xl p-8 flex flex-col ${
                  p.highlight
                    ? "bg-brand-800 text-white shadow-2xl shadow-brand-800/25 ring-2 ring-brand-800"
                    : "bg-white border border-gray-100"
                }`}
              >
                {p.highlight && (
                  <span className="inline-block text-[10px] font-sans tracking-[0.15em] uppercase bg-white/20 text-white rounded-full px-3 py-1 mb-4 self-start">
                    Aanbevolen
                  </span>
                )}
                <p className={`font-sans text-sm font-medium mb-1 ${p.highlight ? "text-white/80" : "text-text-muted"}`}>
                  {p.name}
                </p>
                <p className={`font-serif text-5xl mb-0.5 ${p.highlight ? "text-white" : "text-[#16161D]"}`}>
                  &euro;{p.price}
                </p>
                <p className={`font-sans text-xs mb-3 ${p.highlight ? "text-white/50" : "text-text-muted"}`}>
                  {p.period}
                </p>
                <p className={`font-sans text-sm mb-6 ${p.highlight ? "text-white/70" : "text-text-muted"}`}>
                  {p.desc}
                </p>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {p.features.map((f, fi) => (
                    <li key={fi} className={`flex items-start gap-2 font-sans text-sm ${p.highlight ? "text-white/90" : "text-text-muted"}`}>
                      <CheckCircle2 size={15} className={`mt-0.5 shrink-0 ${p.highlight ? "text-white/70" : "text-brand-700"}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/dashboard"
                  className={`block text-center rounded-full py-3.5 font-sans text-sm font-medium transition-colors ${
                    p.highlight
                      ? "bg-white text-brand-800 hover:bg-cream"
                      : "bg-brand-800 text-white hover:bg-brand-700"
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* guarantee */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center max-w-xl mx-auto">
            <p className="font-serif text-2xl text-[#16161D] mb-2">14 dagen garantie</p>
            <p className="font-sans text-text-muted text-sm leading-relaxed">
              Niet tevreden? Wij retourneren het volledige bedrag zonder vragen
              binnen 14 dagen na uw aankoop.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
