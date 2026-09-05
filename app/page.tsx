import Link from "next/link";
import { TEMPLATES, PRICING_PLANS, FAQ_ITEMS } from "@/lib/constants";
import FAQAccordion from "@/components/FAQAccordion";
import StickyCtaBar from "@/components/StickyCtaBar";

export default function Home() {
  return (
    <main>
      {/* ─── HERO ─── */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <p className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-brand-600 border border-brand-200 rounded-full px-4 py-1.5 mb-6">
              ♡ Emotie vanaf het eerste moment
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl leading-[1.1] font-serif text-dark">
              Jullie mooiste uitnodiging,{" "}
              <span className="italic text-brand-700">jullie eenvoudigste reacties.</span>
            </h1>
            <p className="mt-6 text-lg text-dark/60 font-serif">Digitale trouwkaarten</p>
            <ul className="mt-6 flex flex-wrap gap-3">
              {[
                "Jullie foto's, jullie kleuren, jullie muziek",
                "Een persoonlijke link voor elke gast",
                "Elke gast leest in de eigen taal",
                "Reacties komen binnen in jullie dashboard",
                "Deel de tafels in met hulp van onze AI-agent",
                "Geavanceerd beheer voor destination weddings",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-dark/80 bg-cream border border-gray-200 rounded-full px-4 py-2">
                  <svg className="w-4 h-4 text-brand-700 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/templates" className="bg-brand-800 text-white px-8 py-3.5 rounded-full text-sm font-medium hover:bg-brand-700 transition-colors">
                Maak jullie uitnodiging — gratis
              </Link>
              <a href="#sjablonen" className="border border-gray-300 text-dark/70 px-8 py-3.5 rounded-full text-sm font-medium hover:bg-cream transition-colors">
                Bekijk de sjablonen
              </a>
            </div>
            <p className="mt-4 text-xs text-dark/40">Gratis voorbeeld · Veilige betaling · €89 om te publiceren</p>
            <p className="mt-2 text-xs text-dark/40">Heb je al een account? <Link href="/dashboard" className="text-dark/60 underline">Inloggen</Link></p>
          </div>
          <div className="hidden lg:flex justify-center animate-fade-in-delay">
            <div className="relative w-[280px] h-[560px] bg-gradient-to-b from-cream to-white rounded-[3rem] border-[6px] border-dark/80 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-dark/80 rounded-b-2xl" />
              <div className="flex items-center justify-center h-full px-6 text-center">
                <div>
                  <p className="font-serif text-2xl text-brand-800 mb-2">Laura</p>
                  <p className="font-serif text-dark/30 italic">&amp;</p>
                  <p className="font-serif text-2xl text-brand-800 mt-2">Marco</p>
                  <p className="mt-4 text-xs tracking-wider text-dark/30">19 · 06 · 2027</p>
                  <p className="mt-1 text-xs text-dark/30">Lake Como · Italy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SJABLONEN ─── */}
      <section id="sjablonen" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.2em] uppercase text-dark/40 mb-4">De sjablonen</p>
            <h2 className="text-3xl sm:text-4xl font-serif text-dark">Kies je stijl</h2>
            <p className="mt-4 max-w-2xl mx-auto text-dark/50">Zorgvuldig vormgegeven sjablonen, geoptimaliseerd voor de smartphone. Tik op een sjabloon om de live preview te openen.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEMPLATES.map((t) => (
              <div key={t.id} className="group cursor-pointer">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden relative border border-gray-200 transition-all hover:shadow-xl hover:border-gray-300" style={{ backgroundColor: t.color + "15" }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[160px] h-[320px] bg-white rounded-[1.8rem] border-[3px] border-dark/70 shadow-lg overflow-hidden relative">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-4 bg-dark/70 rounded-b-xl" />
                      <div className="flex items-center justify-center h-full px-3" style={{ background: `linear-gradient(135deg, ${t.color}10, ${t.color}25)` }}>
                        <div className="text-center">
                          <p className="font-serif text-base font-medium" style={{ color: t.color }}>Laura</p>
                          <p className="font-serif text-xs text-dark/30 italic my-0.5">&amp;</p>
                          <p className="font-serif text-base font-medium" style={{ color: t.color }}>Marco</p>
                          <div className="mt-3 w-10 h-px mx-auto" style={{ backgroundColor: t.color }} />
                          <p className="mt-2 text-[9px] tracking-wider text-dark/30">19 · 06 · 2027</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 opacity-[0.07]" style={{ background: `radial-gradient(circle at 30% 70%, ${t.color}, transparent 60%)` }} />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="font-serif text-lg text-dark group-hover:text-brand-800 transition-colors">{t.name}</h3>
                  <p className="text-sm text-dark/40 mt-1">{t.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOE HET WERKT ─── */}
      <section id="hoe-het-werkt" className="py-20 sm:py-28 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.2em] uppercase text-dark/40 mb-4">Hoe het werkt</p>
            <h2 className="text-3xl sm:text-4xl font-serif text-dark">Van sjabloon naar RSVP, in een paar stappen</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: "01", title: "Kies je stijl", desc: "Begin met het zorgvuldig vormgegeven sjabloon dat het best bij jullie past." },
              { num: "02", title: "Personaliseer", desc: "Voeg namen, datum, programma en details toe, plus jullie eigen foto en lied. Gratis livevoorbeeld." },
              { num: "03", title: "Deel", desc: "Publiceer met één klik en deel de persoonlijke link via WhatsApp, Instagram of e-mail." },
              { num: "04", title: "Alle antwoorden in één lijst", desc: "Aanwezigheid, intoleranties en menukeuzes werken zichzelf bij in je dashboard." },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <span className="inline-block text-4xl font-serif text-dark/15 mb-4">{step.num}</span>
                <h3 className="text-lg font-serif text-dark mb-2">{step.title}</h3>
                <p className="text-sm text-dark/50 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VOORDELEN ─── */}
      <section id="voordelen" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif text-dark">Uitnodigingen die een andere indruk maken</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: "🌍", title: "Elke gast in zijn eigen taal", desc: "Elke uitnodiging past zich automatisch aan de taal van wie hem opent aan." },
              { icon: "🌿", title: "100% digitaal en milieuvriendelijk", desc: "Geen papier, geen drukwerk, geen verzending." },
              { icon: "⚡", title: "Klaar in enkele minuten", desc: "Kies een sjabloon, vul jullie gegevens in, publiceer met één klik." },
              { icon: "✉️", title: "Envelop met lakzegel", desc: "Elke uitnodiging komt in een envelop met lakzegel die met één aanraking opent." },
              { icon: "🤖", title: "Tafels geregeld met AI", desc: "Typ of praat en de assistent plaatst alle gasten in 2 minuten." },
              { icon: "📖", title: "Gastenboek voor altijd", desc: "Exporteer berichten naar een elegant PDF-boekje." },
            ].map((f) => (
              <div key={f.title} className="bg-cream rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
                <span className="text-3xl mb-4 block">{f.icon}</span>
                <h3 className="text-lg font-serif text-dark mb-2">{f.title}</h3>
                <p className="text-sm text-dark/50 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── GASTENBOEK ─── */}
      <section className="py-20 sm:py-28 bg-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs tracking-[0.2em] uppercase text-dark/40 mb-4">Een herinnering voor altijd</p>
          <h2 className="text-3xl sm:text-4xl font-serif text-dark">De woorden van je dierbaren, voor altijd bewaard</h2>
          <p className="mt-6 text-dark/50 leading-relaxed">Bij elke bevestiging kunnen de mensen die van je houden een bericht achterlaten. Ze komen allemaal op één plek samen. Exporteer ze naar een elegant PDF-boekje.</p>
          <ul className="mt-8 space-y-3 text-left max-w-md mx-auto">
            {["Elke gast laat zijn bericht achter bij de RSVP", "Alle gedachten verzameld in je dashboard", "Exporteren naar een PDF om voor altijd te bewaren"].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-dark/60">
                <svg className="w-5 h-5 text-brand-700 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Link href="/templates" className="inline-block bg-brand-800 text-white px-8 py-3.5 rounded-full text-sm font-medium hover:bg-brand-700 transition-colors">
              Maak je uitnodiging en begin ze te verzamelen →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── AI TAFELINDELING ─── */}
      <section className="py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs tracking-[0.2em] uppercase text-dark/40 mb-4">Nieuw · AI-tafelindeling</p>
            <h2 className="text-3xl sm:text-4xl font-serif text-dark">Organiseer de tafels met AI. In 2 minuten, niet 2000 klikken.</h2>
            <p className="mt-6 text-dark/50 max-w-2xl mx-auto leading-relaxed">Typ of praat en de assistent plaatst elke gast met oog voor families, kanten, allergieën, kinderen en wie uit elkaar moet blijven.</p>
          </div>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { title: "Jij praat, hij plaatst", desc: "Dicteer een opdracht of typ hem: de AI regelt het." },
              { title: "Hij snapt de echte voorwaarden", desc: "Familie, exen, kinderen, gasten bij de uitgang: zeg het gewoon." },
              { title: "Tafelnamen met een thema", desc: "Italiaanse steden, films, reizen: passende themanamen." },
              { title: "Jij beslist altijd", desc: "De AI stelt voor, jij beslist. Versleep, exporteer, bevestig." },
            ].map((item) => (
              <div key={item.title} className="bg-cream rounded-2xl p-6 border border-gray-100">
                <h3 className="font-serif text-dark mb-2">{item.title}</h3>
                <p className="text-sm text-dark/50">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-dark/30">Gastgegevens blijven veilig: er worden geen persoonsgegevens gebruikt om modellen te trainen.</p>
        </div>
      </section>

      {/* ─── PRIJZEN ─── */}
      <section id="prijzen" className="py-20 sm:py-28 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.2em] uppercase text-dark/40 mb-4">Prijzen</p>
            <h2 className="text-3xl sm:text-4xl font-serif text-dark">Drie pakketten, één betaling</h2>
            <p className="mt-4 text-dark/50 max-w-xl mx-auto">Maak jullie uitnodiging en bekijk hem helemaal af, gratis. Je betaalt €89 om hem te publiceren.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PRICING_PLANS.map((plan) => (
              <div key={plan.id} className={`relative rounded-2xl p-8 border transition-shadow hover:shadow-lg ${plan.recommended ? "border-brand-800 bg-brand-800 text-white" : "border-gray-200 bg-white"}`}>
                {plan.recommended && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-[10px] tracking-wider uppercase px-4 py-1 rounded-full">Aanbevolen</span>
                )}
                <h3 className={`font-serif text-xl ${plan.recommended ? "text-white" : "text-dark"}`}>{plan.name}</h3>
                <div className="mt-4">
                  <span className={`text-4xl font-serif ${plan.recommended ? "text-white" : "text-dark"}`}>€{plan.price}</span>
                </div>
                <p className={`text-xs mt-1 tracking-wider ${plan.recommended ? "text-white/50" : "text-dark/40"}`}>EENMALIGE BETALING</p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <svg className={`w-4 h-4 shrink-0 mt-0.5 ${plan.recommended ? "text-white/50" : "text-brand-700"}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className={plan.recommended ? "text-white/80" : "text-dark/60"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/templates" className={`mt-8 block text-center py-3 rounded-full text-sm font-medium transition-colors ${plan.recommended ? "bg-white text-brand-800 hover:bg-gray-50" : "bg-brand-800 text-white hover:bg-brand-700"}`}>
                  Maak je uitnodiging — gratis
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-dark/40">Eén betaling, nooit een abonnement</p>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.2em] uppercase text-dark/40 mb-4">Voordat je begint</p>
            <h2 className="text-3xl sm:text-4xl font-serif text-dark">Veelgestelde vragen</h2>
          </div>
          <FAQAccordion items={FAQ_ITEMS} />
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-20 sm:py-28 bg-brand-800 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-serif text-white">Klaar om jullie uitnodiging te maken?</h2>
          <p className="mt-4 text-white/50">Probeer het gratis. Jullie betalen pas wanneer jullie overtuigd zijn.</p>
          <Link href="/templates" className="mt-8 inline-block bg-white text-brand-800 px-10 py-4 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
            Maak jullie uitnodiging — gratis
          </Link>
        </div>
      </section>

      <StickyCtaBar />
    </main>
  );
}
