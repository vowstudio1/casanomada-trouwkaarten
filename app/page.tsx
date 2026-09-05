import Link from "next/link";
import { ArrowRight, Globe, Leaf, Clock, Mail, Bot, BookOpen } from "lucide-react";
export default function HomePage() {
  const features = [
    { icon: Globe, title: "Elke gast in zijn eigen taal", desc: "Elke uitnodiging past zich automatisch aan de taal van wie hem opent aan." },
    { icon: Leaf, title: "100% digitaal en milieuvriendelijk", desc: "Geen papier, geen drukwerk, geen verzending." },
    { icon: Clock, title: "Klaar in enkele minuten", desc: "Kies een sjabloon, vul jullie gegevens in, publiceer met één klik." },
    { icon: Mail, title: "Envelop met lakzegel", desc: "Elke uitnodiging komt in een envelop met lakzegel die met één aanraking opent." },
    { icon: Bot, title: "Tafels geregeld met AI", desc: "Typ of praat en de assistent plaatst alle gasten in 2 minuten." },
    { icon: BookOpen, title: "Gastenboek voor altijd", desc: "Exporteer berichten naar een elegant PDF-boekje." }
  ];
  const steps = [
    { num: "01", title: "Kies je stijl", desc: "Begin met het zorgvuldig vormgegeven sjabloon dat het best bij jullie past." },
    { num: "02", title: "Personaliseer", desc: "Voeg namen, datum, programma en details toe, plus jullie eigen foto en lied." },
    { num: "03", title: "Deel", desc: "Publiceer met één klik en deel de persoonlijke link via WhatsApp, Instagram of e-mail." },
    { num: "04", title: "Alle antwoorden in één lijst", desc: "Aanwezigheid, intoleranties en menukeuzes werken zichzelf bij in je dashboard." }
  ];
  return (
    <main className="min-h-screen bg-cream-50">
      <nav className="flex justify-between items-center px-6 py-6 max-w-7xl mx-auto">
        <span className="font-serif text-2xl md:text-3xl text-charcoal-900 tracking-tight">Casanomada Trouwkaarten</span>
        <div className="flex gap-4 md:gap-6 items-center">
          <Link href="/templates" className="text-charcoal-800 hover:text-champagne-300 transition text-sm md:text-base">Sjablonen</Link>
          <Link href="/pricing" className="text-charcoal-800 hover:text-champagne-300 transition text-sm md:text-base">Prijzen</Link>
          <Link href="/dashboard" className="px-5 py-2 border border-charcoal-900 rounded-full hover:bg-charcoal-900 hover:text-white transition text-sm">Inloggen</Link>
        </div>
      </nav>
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <p className="text-champagne-300 font-medium tracking-wide uppercase text-sm">{"♡"} Emotie vanaf het eerste moment</p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-charcoal-900 leading-[1.1]">Jullie mooiste uitnodiging,<br /><span className="italic text-champagne-300">jullie eenvoudigste reacties.</span></h1>
          <p className="text-lg text-charcoal-800 leading-relaxed max-w-lg">Digitale trouwkaarten met jullie foto&apos;s, kleuren en muziek. Een persoonlijke link voor elke gast, meertalige ondersteuning en een AI-agent die de tafelindeling voor je regelt.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/dashboard" className="px-8 py-4 bg-charcoal-900 text-cream-50 rounded-full font-medium hover:bg-champagne-300 hover:text-charcoal-900 transition-all flex items-center justify-center gap-2">Maak jullie uitnodiging — gratis <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/templates" className="px-8 py-4 border border-charcoal-900 text-charcoal-900 rounded-full font-medium hover:bg-cream-100 transition-all text-center">Bekijk de sjablonen</Link>
          </div>
          <p className="text-sm text-charcoal-800 opacity-70">Gratis voorbeeld · Veilige betaling · {"€"}89 om te publiceren</p>
        </div>
        <div className="relative animate-float">
          <div className="absolute inset-0 bg-champagne-200 rounded-full blur-3xl opacity-30"></div>
          <div className="relative bg-white p-3 rounded-[2rem] shadow-2xl border border-cream-200 max-w-sm mx-auto transform rotate-2 hover:rotate-0 transition-transform duration-500">
            <div className="bg-cream-50 rounded-[1.5rem] p-8 text-center space-y-4 border border-cream-100">
              <p className="text-xs uppercase tracking-[0.2em] text-charcoal-800">Laura &amp; Marco</p>
              <h2 className="font-serif text-5xl text-charcoal-900">19 · 06 · 2027</h2>
              <p className="font-serif text-xl text-champagne-300 italic">Lake Como · Italy</p>
              <div className="pt-6"><button className="px-8 py-3 bg-charcoal-900 text-white rounded-full text-sm shadow-lg">Open de uitnodiging</button></div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-4xl text-charcoal-900 mb-16 text-center">Uitnodigingen die een andere indruk maken</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (<div key={i} className="p-6 rounded-2xl bg-cream-50 border border-cream-200 hover:shadow-lg transition"><f.icon className="w-8 h-8 text-champagne-300 mb-4" /><h3 className="font-serif text-xl text-charcoal-900 mb-2">{f.title}</h3><p className="text-charcoal-800 text-sm leading-relaxed">{f.desc}</p></div>))}
          </div>
        </div>
      </section>
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="font-serif text-4xl text-charcoal-900 text-center mb-16">Van sjabloon naar RSVP, in een paar stappen</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, i) => (<div key={i} className="relative"><span className="font-serif text-6xl text-champagne-300 opacity-30 absolute -top-6 -left-2">{step.num}</span><div className="relative pt-8"><h3 className="font-serif text-xl text-charcoal-900 mb-3">{step.title}</h3><p className="text-charcoal-800 text-sm leading-relaxed">{step.desc}</p></div></div>))}
        </div>
      </section>
      <section className="bg-charcoal-900 text-cream-50 py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-champagne-300 font-medium tracking-wide uppercase text-sm">Nieuw · AI-tafelindeling</span>
            <h2 className="font-serif text-4xl md:text-5xl mt-4 mb-6">Organiseer de tafels met AI.<br/>In 2 minuten, niet 2000 klikken.</h2>
            <p className="text-cream-200 mb-8 leading-relaxed">Typ of praat en de assistent plaatst elke gast met oog voor families, kanten, allergie{"ë"}n, kinderen en wie uit elkaar moet blijven.</p>
            <Link href="/dashboard" className="inline-block px-8 py-3 bg-champagne-300 text-charcoal-900 rounded-full font-medium hover:bg-champagne-200 transition">Probeer de AI planner</Link>
          </div>
          <div className="bg-cream-50 rounded-2xl p-8 text-charcoal-900 shadow-2xl">
            <div className="flex items-center gap-3 mb-4 border-b border-cream-200 pb-4"><Bot className="w-5 h-5 text-champagne-300" /><span className="font-medium text-sm">AI Assistent</span></div>
            <div className="space-y-4">
              <div className="bg-charcoal-900 text-cream-50 p-4 rounded-2xl rounded-tl-none text-sm max-w-[85%]">&ldquo;Zet de ouders bij elkaar, kinderen aan een aparte tafel.&rdquo;</div>
              <div className="bg-cream-200 text-charcoal-900 p-4 rounded-2xl rounded-tr-none text-sm max-w-[85%] ml-auto">Begrepen! Tafel 1 voor de ouders, Tafel 2 voor de kinderen.</div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 px-6 text-center max-w-4xl mx-auto">
        <h2 className="font-serif text-4xl md:text-5xl text-charcoal-900 mb-6">Klaar om jullie uitnodiging te maken?</h2>
        <p className="text-lg text-charcoal-800 mb-8">Probeer het gratis. Jullie betalen pas wanneer jullie overtuigd zijn.</p>
        <Link href="/dashboard" className="inline-flex items-center gap-2 px-10 py-4 bg-charcoal-900 text-cream-50 rounded-full font-medium hover:bg-champagne-300 hover:text-charcoal-900 transition-all text-lg">Maak jullie uitnodiging — gratis <ArrowRight className="w-5 h-5" /></Link>
        <p className="mt-4 text-sm text-charcoal-800 opacity-70">{"€"}89 Eenmalige betaling, geen abonnement</p>
      </section>
    </main>
  );
}