import Link from "next/link";
import {
  Heart,
  Users,
  Sparkles,
  Globe,
  Camera,
  LayoutGrid,
  CheckCircle2,
  Star,
  ArrowRight,
  MessageSquare,
  Table2,
  Mail,
  Smartphone,
} from "lucide-react";
import FAQAccordion from "@/components/FAQAccordion";

/* ── helpers ── */
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs tracking-[0.2em] uppercase text-brand-600 mb-3 font-sans font-medium">
    {children}
  </p>
);

const templates = [
  { name: "Romantisch Rood",   bg: "bg-rose-50",    accent: "bg-brand-800"  },
  { name: "Modern Wit",        bg: "bg-gray-50",    accent: "bg-gray-800"   },
  { name: "Botanisch Groen",   bg: "bg-emerald-50", accent: "bg-emerald-800"},
  { name: "Gouden Glans",      bg: "bg-amber-50",   accent: "bg-amber-700"  },
  { name: "Lavendel Droom",    bg: "bg-purple-50",  accent: "bg-purple-800" },
  { name: "Zeeblauw",          bg: "bg-sky-50",     accent: "bg-sky-800"    },
  { name: "Dusty Rose",        bg: "bg-pink-50",    accent: "bg-pink-800"   },
  { name: "Terracotta",        bg: "bg-orange-50",  accent: "bg-orange-800" },
  { name: "Salie Groen",       bg: "bg-green-50",   accent: "bg-green-700"  },
  { name: "Ivoor & Goud",      bg: "bg-yellow-50",  accent: "bg-yellow-700" },
  { name: "Midnight Blue",     bg: "bg-blue-50",    accent: "bg-blue-900"   },
  { name: "Blush & Nude",      bg: "bg-rose-50",    accent: "bg-rose-700"   },
  { name: "Olijfgroen",        bg: "bg-lime-50",    accent: "bg-lime-800"   },
  { name: "Warm Taupe",        bg: "bg-stone-50",   accent: "bg-stone-700"  },
  { name: "Koraalrood",        bg: "bg-red-50",     accent: "bg-red-700"    },
  { name: "Indigo Nacht",      bg: "bg-indigo-50",  accent: "bg-indigo-800" },
  { name: "Champagne",         bg: "bg-amber-50",   accent: "bg-amber-600"  },
  { name: "Klassiek Zwart",    bg: "bg-zinc-100",   accent: "bg-zinc-900"   },
];

const steps = [
  { n: "01", title: "Kies een sjabloon",      desc: "Blader door 18+ prachtige ontwerpen en kies degene die bij jullie past." },
  { n: "02", title: "Personaliseer met AI",   desc: "Onze AI schrijft jullie unieke verhaal en past teksten aan op jullie stijl." },
  { n: "03", title: "Deel met gasten",        desc: "Verstuur via WhatsApp, e-mail of een persoonlijke link. Direct bereikbaar." },
  { n: "04", title: "Beheer RSVP's",          desc: "Volg aanmeldingen real-time, stuur herinneringen en exporteer gastenlijsten." },
];

const plans = [
  {
    name:     "Starter",
    price:    "89",
    desc:     "Perfect voor intieme bruiloften",
    features: [
      "1 digitale uitnodiging",
      "Tot 50 gasten",
      "RSVP-systeem",
      "WhatsApp & e-mail delen",
      "3 maanden online",
    ],
    cta:      "Beginnen",
    highlight: false,
  },
  {
    name:     "Premium",
    price:    "149",
    desc:     "Onze populairste keuze",
    features: [
      "3 digitale uitnodigingen",
      "Onbeperkte gasten",
      "AI-tekstpersonalisatie",
      "Gastenboek & foto-upload",
      "Meertalige versie",
      "12 maanden online",
    ],
    cta:      "Meest gekozen",
    highlight: true,
  },
  {
    name:     "Luxe",
    price:    "249",
    desc:     "De volledige ervaring",
    features: [
      "Onbeperkte uitnodigingen",
      "Onbeperkte gasten",
      "AI-tafelindeling",
      "Live dag-website",
      "Fotogalerij voor gasten",
      "Persoonlijke URL",
      "Eeuwige bewaring",
    ],
    cta:      "Alles inbegrepen",
    highlight: false,
  },
];

const voordelen = [
  { Icon: Sparkles,   title: "AI-personalisatie",    desc: "Onze AI schrijft unieke teksten afgestemd op jullie liefdesverhaal en stijl." },
  { Icon: Users,      title: "RSVP-beheer",          desc: "Gasten melden zich eenvoudig aan. U ziet alles real-time in uw dashboard." },
  { Icon: Globe,      title: "Meertalig",            desc: "Gasten kiezen hun eigen taal: NL, EN, FR, DE, ES en meer." },
  { Icon: Camera,     title: "Fotogalerij",          desc: "Deel herinneringen via een prachtige online fotogalerij voor al uw gasten." },
  { Icon: MessageSquare, title: "Gastenboek",        desc: "Laat gasten wensen achterlaten in een digitaal gastenboek dat u bewaart." },
  { Icon: Table2,     title: "AI-tafelindeling",     desc: "Intelligente tafelindeling op basis van relaties en voorkeuren van gasten." },
  { Icon: Smartphone, title: "Mobiel geoptimaliseerd", desc: "Uitnodigingen die er prachtig uitzien op elk apparaat en schermgrootte." },
  { Icon: Mail,       title: "WhatsApp & e-mail",    desc: "Deel uw uitnodiging direct via WhatsApp of e-mail met persoonlijke link." },
];

export default function HomePage() {
  return (
    <>
      {/* ── HEADER ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-sans text-sm tracking-[0.25em] uppercase font-medium text-[#16161D]">
            CASA NOMADA DIGITAL
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/templates" className="text-sm text-text-muted hover:text-[#16161D] transition-colors font-sans">
              Sjablonen
            </Link>
            <Link href="/pricing" className="text-sm text-text-muted hover:text-[#16161D] transition-colors font-sans">
              Prijzen
            </Link>
            <Link href="/dashboard" className="text-sm bg-brand-800 text-white px-5 py-2 rounded-full hover:bg-brand-700 transition-colors font-sans">
              Inloggen
            </Link>
          </nav>
          {/* mobile menu button placeholder */}
          <button className="md:hidden p-2 text-[#16161D]">
            <LayoutGrid size={20} />
          </button>
        </div>
      </header>

      <main className="pt-16">

        {/* ══════════════════════════════════════════
            SECTION 1 — HERO
        ══════════════════════════════════════════ */}
        <section className="bg-white min-h-[90vh] flex items-center">
          <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">

            {/* left copy */}
            <div className="animate-fade-up">
              <SectionLabel>Digitale trouwkaarten</SectionLabel>

              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[#16161D] leading-[1.05] mb-4">
                Jullie verhaal,{" "}
                <em className="not-italic italic text-brand-700">
                  prachtig verteld
                </em>
              </h1>

              <p className="font-sans text-text-muted text-lg leading-relaxed mb-8 max-w-md">
                Maak in minuten een verbluffende digitale trouwuitnodiging met
                AI-personalisatie. Deel via WhatsApp, beheer RSVP&apos;s en
                creëer een onvergetelijke ervaring voor uw gasten.
              </p>

              {/* feature badges */}
              <div className="flex flex-wrap gap-2 mb-8">
                {["AI-personalisatie", "RSVP-beheer", "Gastenboek", "Tafelindeling"].map((f) => (
                  <span
                    key={f}
                    className="inline-flex items-center gap-1.5 text-xs font-sans bg-cream border border-gray-100 rounded-full px-3 py-1.5 text-text-muted"
                  >
                    <CheckCircle2 size={12} className="text-brand-700" />
                    {f}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/templates"
                  className="inline-flex items-center gap-2 bg-brand-800 text-white rounded-full px-8 py-3.5 font-sans text-sm font-medium hover:bg-brand-700 transition-colors"
                >
                  Uitnodiging maken
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="#voorbeelden"
                  className="inline-flex items-center gap-2 border border-gray-200 text-[#16161D] rounded-full px-8 py-3.5 font-sans text-sm font-medium hover:border-brand-800 hover:text-brand-800 transition-colors"
                >
                  Voorbeelden bekijken
                </Link>
              </div>

              {/* social proof */}
              <div className="mt-10 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {["bg-rose-200","bg-pink-200","bg-purple-200","bg-amber-200","bg-sky-200"].map((c, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-white ${c}`} />
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5 mb-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs font-sans text-text-muted">
                    <strong className="text-[#16161D]">2.400+</strong> koppels gingen u voor
                  </p>
                </div>
              </div>
            </div>

            {/* right — invitation card mockup */}
            <div className="animate-fade-up animate-fade-up-delay-2 flex justify-center">
              <div className="phone-card w-64 md:w-72 bg-cream">
                {/* card header bar */}
                <div className="bg-brand-800 px-6 py-4">
                  <p className="font-sans text-xs tracking-[0.2em] uppercase text-white/70">Digitale uitnodiging</p>
                  <p className="font-serif text-xl text-white mt-1">Sophie &amp; Thomas</p>
                </div>
                {/* card body */}
                <div className="p-6 text-center">
                  <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-brand-600 mb-2">Wij trouwen op</p>
                  <p className="font-serif text-3xl text-[#16161D] mb-1">14 juni 2025</p>
                  <p className="font-sans text-xs text-text-muted mb-6">Kasteel Hoensbroek, Limburg</p>

                  {/* floral divider */}
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex-1 h-px bg-brand-800/20" />
                    <Heart size={14} className="text-brand-700" />
                    <div className="flex-1 h-px bg-brand-800/20" />
                  </div>

                  <p className="font-sans text-xs text-text-muted leading-relaxed mb-6">
                    Wij nodigen u van harte uit om deze bijzondere dag met ons te vieren.
                  </p>

                  <div className="bg-brand-800 text-white rounded-full py-2.5 text-xs font-sans tracking-wide">
                    RSVP bevestigen
                  </div>
                </div>
                {/* card footer */}
                <div className="border-t border-gray-100 px-6 py-3 flex justify-between text-[10px] font-sans text-text-muted">
                  <span>Dresscode: Smart casual</span>
                  <span>18:00 uur</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 2 — TEMPLATE GALLERY
        ══════════════════════════════════════════ */}
        <section id="voorbeelden" className="bg-cream py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <SectionLabel>Sjablonen</SectionLabel>
              <h2 className="font-serif text-4xl md:text-5xl text-[#16161D] mb-4">
                18 prachtige ontwerpen
              </h2>
              <p className="font-sans text-text-muted max-w-xl mx-auto">
                Elk sjabloon is zorgvuldig ontworpen door onze designers en
                volledig aanpasbaar aan uw wensen en stijl.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {templates.map((t, i) => (
                <div key={i} className={`card-hover rounded-2xl ${t.bg} p-4 border border-white/80`}>
                  {/* mini card mockup */}
                  <div className="rounded-xl overflow-hidden mb-3 bg-white shadow-sm">
                    <div className={`${t.accent} h-8 flex items-center px-3`}>
                      <span className="text-white/80 text-[9px] font-sans tracking-widest uppercase">Uitnodiging</span>
                    </div>
                    <div className="p-3 text-center">
                      <p className="font-serif text-base text-[#16161D]">A &amp; B</p>
                      <p className="font-sans text-[9px] text-text-muted">14 juni 2025</p>
                      <div className={`${t.accent} rounded-full py-1 px-3 text-[8px] text-white font-sans mt-2 inline-block`}>
                        RSVP
                      </div>
                    </div>
                  </div>
                  <p className="font-sans text-xs font-medium text-[#16161D] text-center">{t.name}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/templates"
                className="inline-flex items-center gap-2 border border-brand-800 text-brand-800 rounded-full px-8 py-3 font-sans text-sm hover:bg-brand-800 hover:text-white transition-colors"
              >
                Alle sjablonen bekijken
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 3 — HOE HET WERKT
        ══════════════════════════════════════════ */}
        <section className="bg-white py-24">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <SectionLabel>Werkwijze</SectionLabel>
              <h2 className="font-serif text-4xl md:text-5xl text-[#16161D] mb-4">
                In 4 stappen klaar
              </h2>
              <p className="font-sans text-text-muted max-w-xl mx-auto">
                Van sjabloon tot verzonden uitnodiging in minder dan 15 minuten.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border-2 border-brand-800/20 mb-5">
                    <span className="font-serif text-xl text-brand-800">{s.n}</span>
                  </div>
                  <h3 className="font-serif text-xl text-[#16161D] mb-2">{s.title}</h3>
                  <p className="font-sans text-sm text-text-muted leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 4 — PRICING
        ══════════════════════════════════════════ */}
        <section className="bg-cream py-24">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <SectionLabel>Prijzen</SectionLabel>
              <h2 className="font-serif text-4xl md:text-5xl text-[#16161D] mb-4">
                Eerlijk &amp; transparant
              </h2>
              <p className="font-sans text-text-muted max-w-xl mx-auto">
                Geen verborgen kosten. Eenmalige betaling. 14 dagen geld-terug-garantie.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((p, i) => (
                <div
                  key={i}
                  className={`rounded-2xl p-8 ${
                    p.highlight
                      ? "bg-brand-800 text-white shadow-xl shadow-brand-800/20"
                      : "bg-white border border-gray-100"
                  }`}
                >
                  {p.highlight && (
                    <span className="inline-block text-[10px] font-sans tracking-[0.15em] uppercase bg-white/20 text-white rounded-full px-3 py-1 mb-4">
                      Aanbevolen
                    </span>
                  )}
                  <p className={`font-sans text-sm font-medium mb-1 ${p.highlight ? "text-white/80" : "text-text-muted"}`}>
                    {p.name}
                  </p>
                  <p className={`font-serif text-5xl mb-1 ${p.highlight ? "text-white" : "text-[#16161D]"}`}>
                    &euro;{p.price}
                  </p>
                  <p className={`font-sans text-xs mb-6 ${p.highlight ? "text-white/60" : "text-text-muted"}`}>
                    {p.desc}
                  </p>

                  <ul className="space-y-2.5 mb-8">
                    {p.features.map((f, fi) => (
                      <li key={fi} className={`flex items-start gap-2 font-sans text-sm ${p.highlight ? "text-white/90" : "text-text-muted"}`}>
                        <CheckCircle2 size={15} className={`mt-0.5 shrink-0 ${p.highlight ? "text-white/70" : "text-brand-700"}`} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/pricing"
                    className={`block text-center rounded-full py-3 font-sans text-sm font-medium transition-colors ${
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
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 5 — VOORDELEN / FEATURES
        ══════════════════════════════════════════ */}
        <section className="bg-white py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <SectionLabel>Voordelen</SectionLabel>
              <h2 className="font-serif text-4xl md:text-5xl text-[#16161D] mb-4">
                Alles wat u nodig heeft
              </h2>
              <p className="font-sans text-text-muted max-w-xl mx-auto">
                Casa Nomada biedt een complete oplossing voor uw digitale
                trouwuitnodiging van begin tot einde.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {voordelen.map(({ Icon, title, desc }, i) => (
                <div key={i} className="card-hover bg-cream rounded-2xl p-6 border border-gray-50">
                  <div className="w-10 h-10 rounded-full bg-brand-800/10 flex items-center justify-center mb-4">
                    <Icon size={18} className="text-brand-800" />
                  </div>
                  <h3 className="font-serif text-lg text-[#16161D] mb-2">{title}</h3>
                  <p className="font-sans text-sm text-text-muted leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 6 — GASTENBOEK
        ══════════════════════════════════════════ */}
        <section className="bg-cream py-24">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <SectionLabel>Gastenboek</SectionLabel>
                <h2 className="font-serif text-4xl md:text-5xl text-[#16161D] mb-4 leading-tight">
                  Wensen bewaren{" "}
                  <em className="not-italic italic text-brand-700">voor altijd</em>
                </h2>
                <p className="font-sans text-text-muted leading-relaxed mb-6">
                  Gasten laten hun wensen achter in uw digitale gastenboek.
                  Met foto&apos;s, video&apos;s of gewoon een persoonlijk bericht.
                  U bewaart ze eeuwig als herinnering aan uw mooiste dag.
                </p>
                <ul className="space-y-3 mb-8">
                  {["Tekst, foto en video wensen", "Downloaden als PDF-fotoboek", "Delen op sociale media", "Altijd toegankelijk"].map((f) => (
                    <li key={f} className="flex items-center gap-2 font-sans text-sm text-text-muted">
                      <CheckCircle2 size={15} className="text-brand-700 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/templates"
                  className="inline-flex items-center gap-2 bg-brand-800 text-white rounded-full px-7 py-3 font-sans text-sm hover:bg-brand-700 transition-colors"
                >
                  Nu beginnen <ArrowRight size={16} />
                </Link>
              </div>

              {/* gastenboek card mockup */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-brand-800 px-6 py-4 flex items-center justify-between">
                  <span className="font-sans text-xs tracking-[0.15em] uppercase text-white/80">Gastenboek</span>
                  <Heart size={14} className="text-white/60" />
                </div>
                <div className="p-5 space-y-4">
                  {[
                    { name: "Mama & Papa",  msg: "Wat een prachtig koppel! Wij wensen jullie een leven vol liefde en geluk. ❤️", t: "2 min geleden" },
                    { name: "Lisa & Mark",  msg: "Gefeliciteerd! We zijn zo blij voor jullie. Op naar een geweldige dag!", t: "5 min geleden" },
                    { name: "Oma Riet",     msg: "Lieve kinderen, mooier had het niet kunnen zijn. Veel geluk samen!", t: "12 min geleden" },
                  ].map((w, i) => (
                    <div key={i} className="flex gap-3">
                      <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-sans ${["bg-brand-800","bg-purple-600","bg-amber-600"][i]}`}>
                        {w.name[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between mb-1">
                          <p className="font-sans text-xs font-medium text-[#16161D]">{w.name}</p>
                          <p className="font-sans text-[10px] text-text-muted">{w.t}</p>
                        </div>
                        <p className="font-sans text-xs text-text-muted leading-relaxed">{w.msg}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 p-4">
                  <div className="flex gap-2">
                    <div className="flex-1 bg-cream rounded-full px-4 py-2 text-xs font-sans text-text-muted">
                      Schrijf een wens...
                    </div>
                    <button className="bg-brand-800 text-white rounded-full w-8 h-8 flex items-center justify-center">
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 7 — AI TAFELINDELING
        ══════════════════════════════════════════ */}
        <section className="bg-white py-24">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              {/* chat mockup */}
              <div className="order-2 md:order-1 bg-cream rounded-2xl border border-gray-100 overflow-hidden">
                <div className="bg-[#16161D] px-5 py-3 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  <span className="font-sans text-xs text-white/50 ml-2">AI Tafelindeling</span>
                </div>
                <div className="p-5 space-y-3">
                  {[
                    { role: "ai",   msg: "Hoi! Ik ben jullie AI-assistent voor de tafelindeling. Hoeveel gasten verwachten jullie?" },
                    { role: "user", msg: "We hebben 80 gasten: 20 familie bruid, 20 familie bruidegom en 40 vrienden." },
                    { role: "ai",   msg: "Perfect! Zijn er gasten die liever niet samen aan tafel zitten, of juist wel bij elkaar?" },
                    { role: "user", msg: "Mijn ouders en zijn ouders kennen elkaar nog niet goed." },
                    { role: "ai",   msg: "Begrepen! Ik maak een indeling waarbij beide families rustig kennis kunnen maken. Even geduld..." },
                  ].map((m, i) => (
                    <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 font-sans text-xs leading-relaxed ${
                        m.role === "ai"
                          ? "bg-white border border-gray-100 text-text-muted"
                          : "bg-brand-800 text-white"
                      }`}>
                        {m.msg}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-1 md:order-2">
                <SectionLabel>AI Tafelindeling</SectionLabel>
                <h2 className="font-serif text-4xl md:text-5xl text-[#16161D] mb-4 leading-tight">
                  Slimme indeling,{" "}
                  <em className="not-italic italic text-brand-700">blije gasten</em>
                </h2>
                <p className="font-sans text-text-muted leading-relaxed mb-6">
                  Onze AI analyseert relaties, voorkeuren en dieetwensen om de
                  perfecte tafelindeling te creëren. Bespaar uren stress en
                  geniet van een gezellige bruiloft.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Relaties en voorkeuren analyseren",
                    "Automatische groepering families",
                    "Dieetwensen verwerken",
                    "Exporteren als PDF of Excel",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 font-sans text-sm text-text-muted">
                      <CheckCircle2 size={15} className="text-brand-700 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 bg-brand-800 text-white rounded-full px-7 py-3 font-sans text-sm hover:bg-brand-700 transition-colors"
                >
                  Bekijk Luxe pakket <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 8 — FAQ
        ══════════════════════════════════════════ */}
        <section className="bg-cream py-24">
          <div className="max-w-2xl mx-auto px-6">
            <div className="text-center mb-12">
              <SectionLabel>FAQ</SectionLabel>
              <h2 className="font-serif text-4xl md:text-5xl text-[#16161D] mb-4">
                Veelgestelde vragen
              </h2>
              <p className="font-sans text-text-muted">
                Staat uw vraag er niet bij?{" "}
                <a href="mailto:hallo@casanomada.nl" className="text-brand-700 underline hover:text-brand-800">
                  Neem contact op
                </a>
              </p>
            </div>
            <FAQAccordion />
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 9 — FINAL CTA (burgundy bg)
        ══════════════════════════════════════════ */}
        <section className="bg-brand-800 py-24">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <SectionLabel>
              <span className="text-white/60">Begin vandaag</span>
            </SectionLabel>
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-4 leading-tight">
              Maak jullie dag{" "}
              <em className="not-italic italic text-white/80">onvergetelijk</em>
            </h2>
            <p className="font-sans text-white/70 text-lg mb-10 leading-relaxed">
              Sluit u aan bij 2.400+ koppels die Casa Nomada verkozen voor hun
              digitale trouwuitnodiging. Start vandaag en wees klaar in 15 minuten.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/templates"
                className="inline-flex items-center gap-2 bg-white text-brand-800 rounded-full px-8 py-3.5 font-sans text-sm font-medium hover:bg-cream transition-colors"
              >
                Uitnodiging maken
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 border border-white/30 text-white rounded-full px-8 py-3.5 font-sans text-sm font-medium hover:border-white/60 transition-colors"
              >
                Prijzen bekijken
              </Link>
            </div>
            <p className="mt-8 font-sans text-xs text-white/50">
              14 dagen geld-terug-garantie &bull; Geen abonnement &bull; Eenmalige betaling
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════ */}
        <footer className="bg-[#16161D] py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-10 mb-12">
              <div className="md:col-span-2">
                <p className="font-sans text-sm tracking-[0.25em] uppercase text-white mb-3">
                  CASA NOMADA DIGITAL
                </p>
                <p className="font-sans text-sm text-white/50 leading-relaxed max-w-sm">
                  Prachtige digitale trouwuitnodigingen met AI-personalisatie,
                  RSVP-beheer en gastenboek. Gemaakt voor modern verliefde koppels.
                </p>
              </div>
              <div>
                <p className="font-sans text-xs tracking-[0.15em] uppercase text-white/40 mb-4">Product</p>
                <ul className="space-y-2">
                  {["Sjablonen", "Prijzen", "AI Functies", "Gastenboek"].map((l) => (
                    <li key={l}>
                      <Link href="#" className="font-sans text-sm text-white/60 hover:text-white transition-colors">
                        {l}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-sans text-xs tracking-[0.15em] uppercase text-white/40 mb-4">Bedrijf</p>
                <ul className="space-y-2">
                  {["Over ons", "Blog", "Privacy", "Voorwaarden"].map((l) => (
                    <li key={l}>
                      <Link href="#" className="font-sans text-sm text-white/60 hover:text-white transition-colors">
                        {l}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="font-sans text-xs text-white/40">
                &copy; 2025 Casa Nomada Digital. Alle rechten voorbehouden.
              </p>
              <p className="font-sans text-xs text-white/40">
                Gemaakt met{" "}
                <Heart size={10} className="inline text-brand-600" />
                {" "}in Nederland
              </p>
            </div>
          </div>
        </footer>

      </main>

      {/* ══════════════════════════════════════════
          STICKY BOTTOM CTA BAR
      ══════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-100 px-4 py-3 flex gap-3">
        <Link
          href="/templates"
          className="flex-1 text-center bg-brand-800 text-white rounded-full py-3 font-sans text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          Uitnodiging maken
        </Link>
        <Link
          href="/pricing"
          className="flex-1 text-center border border-brand-800 text-brand-800 rounded-full py-3 font-sans text-sm font-medium hover:bg-cream transition-colors"
        >
          Prijzen
        </Link>
      </div>
    </>
  );
}
