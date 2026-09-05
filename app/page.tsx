"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { TEMPLATES, PRICING_PLANS, FAQ_ITEMS, SITE_NAME } from "@/lib/constants";
import FAQAccordion from "@/components/FAQAccordion";
import TemplateCard from "@/components/TemplateCard";
import PricingCard from "@/components/PricingCard";
import StickyCtaBar from "@/components/StickyCtaBar";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const steps = [
  { num: "01", title: "Kies je stijl", desc: "Begin met het zorgvuldig vormgegeven sjabloon dat het best bij jullie past." },
  { num: "02", title: "Personaliseer", desc: "Voeg namen, datum, programma en details toe, plus jullie eigen foto en lied. Gratis livevoorbeeld." },
  { num: "03", title: "Deel", desc: "Publiceer met één klik en deel de persoonlijke link via WhatsApp, Instagram of e-mail." },
  { num: "04", title: "Alle antwoorden in één lijst", desc: "Aanwezigheid, intoleranties en menukeuzes werken zichzelf bij in je dashboard." },
];

const features = [
  { icon: "🌍", title: "Elke gast in zijn eigen taal", desc: "Automatische vertaling in 15 talen." },
  { icon: "🌿", title: "100% digitaal en milieuvriendelijk", desc: "Geen papier, geen drukwerk, geen verzending." },
  { icon: "⚡", title: "Klaar in enkele minuten", desc: "Kies, vul in, publiceer." },
  { icon: "✉️", title: "Envelop met lakzegel", desc: "Opent bij aanraking — een moment van verwachting." },
  { icon: "🤖", title: "Tafels geregeld met AI", desc: "De assistent plaatst alle gasten in 2 minuten." },
  { icon: "📖", title: "Gastenboek voor altijd", desc: "Exporteer berichten naar een elegant PDF-boekje." },
];

export default function Home() {
  return (
    <main className="bg-gradient-warm">
      {/* ─── HERO ─── */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.p variants={fadeUp} className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-brand-600 border border-brand-200 rounded-full px-4 py-1.5 mb-6">
              ♡ Emotie vanaf het eerste moment
            </motion.p>
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl leading-[1.1] font-serif text-brand-950">
              Jullie mooiste uitnodiging,{" "}
              <span className="italic text-brand-700">jullie eenvoudigste reacties.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 text-lg text-brand-700 font-serif">
              Digitale trouwkaarten
            </motion.p>
            <motion.ul variants={fadeUp} className="mt-6 flex flex-wrap gap-3">
              {[
                "Jullie foto's, jullie kleuren, jullie muziek",
                "Een persoonlijke link voor elke gast",
                "Elke gast leest in de eigen taal",
                "Reacties komen binnen in jullie dashboard",
                "Deel de tafels in met hulp van onze AI-agent",
                "Geavanceerd beheer voor destination weddings",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-brand-800 bg-white/60 border border-brand-100 rounded-full px-4 py-2">
                  <svg className="w-4 h-4 text-brand-600 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {item}
                </li>
              ))}
            </motion.ul>
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/templates"
                className="bg-brand-950 text-white px-8 py-3.5 rounded-full text-sm font-medium hover:bg-brand-800 transition-colors"
              >
                Maak jullie uitnodiging — gratis
              </Link>
              <a
                href="#sjablonen"
                className="border border-brand-300 text-brand-800 px-8 py-3.5 rounded-full text-sm font-medium hover:bg-brand-50 transition-colors"
              >
                Bekijk de sjablonen
              </a>
            </motion.div>
            <motion.p variants={fadeUp} className="mt-4 text-xs text-brand-500">
              Gratis voorbeeld · Veilige betaling · €89 om te publiceren
            </motion.p>
          </motion.div>

          {/* Phone mockup placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative w-[280px] h-[560px] bg-gradient-to-b from-brand-100 to-brand-50 rounded-[3rem] border-[6px] border-brand-900 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-brand-900 rounded-b-2xl" />
              <div className="flex items-center justify-center h-full text-brand-400 text-sm px-6 text-center">
                <div>
                  <p className="font-serif text-2xl text-brand-700 mb-2">Laura</p>
                  <p className="font-serif text-brand-500 italic">&amp;</p>
                  <p className="font-serif text-2xl text-brand-700 mt-2">Marco</p>
                  <p className="mt-4 text-xs tracking-wider text-brand-400">19 · 06 · 2027</p>
                  <p className="mt-1 text-xs text-brand-400">Lake Como · Italy</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── SJABLONEN ─── */}
      <section id="sjablonen" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <p className="text-xs tracking-[0.2em] uppercase text-brand-500 mb-4">De sjablonen</p>
            <h2 className="text-3xl sm:text-4xl font-serif text-brand-950">Kies je stijl</h2>
            <p className="mt-4 max-w-2xl mx-auto text-brand-600">
              Zorgvuldig vormgegeven sjablonen, geoptimaliseerd voor de smartphone.
            </p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {TEMPLATES.map((t) => (
              <TemplateCard key={t.id} template={t} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── HOE HET WERKT ─── */}
      <section id="hoe-het-werkt" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <p className="text-xs tracking-[0.2em] uppercase text-brand-500 mb-4">Hoe het werkt</p>
            <h2 className="text-3xl sm:text-4xl font-serif text-brand-950">
              Van sjabloon naar RSVP, in een paar stappen
            </h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {steps.map((step) => (
              <motion.div key={step.num} variants={fadeUp} className="text-center">
                <span className="inline-block text-4xl font-serif text-brand-200 mb-4">{step.num}</span>
                <h3 className="text-lg font-serif text-brand-950 mb-2">{step.title}</h3>
                <p className="text-sm text-brand-600 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── VOORDELEN ─── */}
      <section id="voordelen" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif text-brand-950">
              Uitnodigingen die een andere indruk maken
            </h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((f) => (
              <motion.div key={f.title} variants={fadeUp} className="bg-white rounded-2xl p-8 border border-brand-100 hover:shadow-lg transition-shadow">
                <span className="text-3xl mb-4 block">{f.icon}</span>
                <h3 className="text-lg font-serif text-brand-950 mb-2">{f.title}</h3>
                <p className="text-sm text-brand-600 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── GASTENBOEK ─── */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="max-w-3xl mx-auto text-center">
            <motion.p variants={fadeUp} className="text-xs tracking-[0.2em] uppercase text-brand-500 mb-4">
              Een herinnering voor altijd
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-serif text-brand-950 text-balance">
              De woorden van je dierbaren, voor altijd bewaard
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-6 text-brand-600 leading-relaxed">
              Bij elke bevestiging kunnen de mensen die van je houden een bericht achterlaten.
              Ze komen allemaal op één plek samen — geen berichten meer die verloren gaan tussen chats en kaartjes.
              Exporteer ze naar een elegant PDF-boekje.
            </motion.p>
            <motion.ul variants={fadeUp} className="mt-8 space-y-3 text-left max-w-md mx-auto">
              {[
                "Elke gast laat zijn bericht achter bij de RSVP",
                "Alle gedachten verzameld in je dashboard",
                "Exporteren naar een PDF om voor altijd te bewaren",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-brand-700">
                  <svg className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {item}
                </li>
              ))}
            </motion.ul>
            <motion.div variants={fadeUp} className="mt-8">
              <Link
                href="/templates"
                className="inline-block bg-brand-950 text-white px-8 py-3.5 rounded-full text-sm font-medium hover:bg-brand-800 transition-colors"
              >
                Maak je uitnodiging en begin ze te verzamelen →
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── AI TAFELINDELING ─── */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="max-w-4xl mx-auto">
            <motion.p variants={fadeUp} className="text-xs tracking-[0.2em] uppercase text-brand-500 mb-4 text-center">
              Nieuw · AI-tafelindeling
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-serif text-brand-950 text-center text-balance">
              Organiseer de tafels met AI. In 2 minuten, niet 2000 klikken.
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-6 text-brand-600 text-center max-w-2xl mx-auto leading-relaxed">
              Typ of praat en de assistent plaatst elke gast met oog voor families, kanten, allergieën, kinderen en wie uit elkaar moet blijven.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: "Jij praat, hij plaatst", desc: "Dicteer een opdracht of typ hem: de AI regelt het." },
                { title: "Hij snapt de echte voorwaarden", desc: "Familie, exen, kinderen, gasten bij de uitgang: zeg het gewoon." },
                { title: "Tafelnamen met een thema", desc: "Italiaanse steden, films, reizen: passende themanamen." },
                { title: "Jij beslist altijd", desc: "De AI stelt voor, jij beslist. Versleep, exporteer, bevestig." },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-2xl p-6 border border-brand-100">
                  <h3 className="font-serif text-brand-950 mb-2">{item.title}</h3>
                  <p className="text-sm text-brand-600">{item.desc}</p>
                </div>
              ))}
            </motion.div>
            <motion.p variants={fadeUp} className="mt-6 text-center text-xs text-brand-400">
              Gastgegevens blijven veilig: er worden geen persoonsgegevens gebruikt om modellen te trainen.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ─── PRIJZEN ─── */}
      <section id="prijzen" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <p className="text-xs tracking-[0.2em] uppercase text-brand-500 mb-4">Prijzen</p>
            <h2 className="text-3xl sm:text-4xl font-serif text-brand-950">
              Drie pakketten, één betaling
            </h2>
            <p className="mt-4 text-brand-600 max-w-xl mx-auto">
              Maak jullie uitnodiging en bekijk hem helemaal af, gratis. Je betaalt om te publiceren.
            </p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {PRICING_PLANS.map((plan) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </motion.div>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mt-8 text-center text-sm text-brand-500">
            Eén betaling, nooit een abonnement
          </motion.p>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <p className="text-xs tracking-[0.2em] uppercase text-brand-500 mb-4">Voordat je begint</p>
            <h2 className="text-3xl sm:text-4xl font-serif text-brand-950">Veelgestelde vragen</h2>
          </motion.div>
          <FAQAccordion items={FAQ_ITEMS} />
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-20 sm:py-28 bg-brand-950 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-serif text-white text-balance">
            Klaar om jullie uitnodiging te maken?
          </h2>
          <p className="mt-4 text-brand-300">
            Probeer het gratis. Jullie betalen pas wanneer jullie overtuigd zijn.
          </p>
          <Link
            href="/templates"
            className="mt-8 inline-block bg-white text-brand-950 px-10 py-4 rounded-full text-sm font-medium hover:bg-brand-50 transition-colors"
          >
            Maak jullie uitnodiging — gratis
          </Link>
        </div>
      </section>

      {/* Sticky bottom CTA bar */}
      <StickyCtaBar />
    </main>
  );
}
