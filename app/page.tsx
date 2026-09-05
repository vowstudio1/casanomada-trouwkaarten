import Link from "next/link";
import {
  Heart, Check, ArrowRight, Minus as MinusIcon, LayoutGrid, Plus,
} from "lucide-react";
import FAQAccordion from "@/components/FAQAccordion";

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[11px] tracking-[0.25em] uppercase text-brand-600 mb-4 font-sans font-medium">{children}</p>
);

const templates = [
  { name: "Romantisch Rood", bg: "bg-rose-50", accent: "bg-brand-800", desc: "Klassiek en warm, tijdloze romantiek." },
  { name: "Modern Wit", bg: "bg-gray-50", accent: "bg-gray-800", desc: "Strak en minimaal, ruimte en adem." },
  { name: "Botanisch Groen", bg: "bg-emerald-50", accent: "bg-emerald-800", desc: "Bladeren en bloemen, delicaat." },
  { name: "Gouden Glans", bg: "bg-amber-50", accent: "bg-amber-700", desc: "Warm avondlicht, romantisch en intiem." },
  { name: "Lavendel Droom", bg: "bg-purple-50", accent: "bg-purple-800", desc: "Zacht en dromerig, paarse tinten." },
  { name: "Zeeblauw", bg: "bg-sky-50", accent: "bg-sky-800", desc: "Fris en kust, zomerse sfeer." },
  { name: "Dusty Rose", bg: "bg-pink-50", accent: "bg-pink-800", desc: "Poederroze, subtiel en verfijnd." },
  { name: "Terracotta", bg: "bg-orange-50", accent: "bg-orange-800", desc: "Aards en warm, mediterrane tonen." },
  { name: "Salie Groen", bg: "bg-green-50", accent: "bg-green-700", desc: "Natuurlijk groen, rustgevend." },
  { name: "Ivoor & Goud", bg: "bg-yellow-50", accent: "bg-yellow-700", desc: "Luxueus en feestelijk, gouden accenten." },
  { name: "Midnight Blue", bg: "bg-blue-50", accent: "bg-blue-900", desc: "Diep en elegant, avondsfeer." },
  { name: "Blush & Nude", bg: "bg-rose-50", accent: "bg-rose-700", desc: "Zacht en verfijnd, neutrale tinten." },
  { name: "Olijfgroen", bg: "bg-lime-50", accent: "bg-lime-800", desc: "Toscaans en rustiek, en plein air." },
  { name: "Warm Taupe", bg: "bg-stone-50", accent: "bg-stone-700", desc: "Beige en oud goud, bloemrijk." },
  { name: "Koraalrood", bg: "bg-red-50", accent: "bg-red-700", desc: "Zonnig en levendig, zomerfeest." },
  { name: "Indigo Nacht", bg: "bg-indigo-50", accent: "bg-indigo-800", desc: "Mysterieus en romantisch, nachtblauw." },
  { name: "Champagne", bg: "bg-amber-50", accent: "bg-amber-600", desc: "Sprankelend en feestelijk, gouden bubbels." },
  { name: "Klassiek Zwart", bg: "bg-zinc-100", accent: "bg-zinc-900", desc: "Tijdloos en sophisticated, zwart-wit." },
];

const steps = [
  { n: "01", title: "Kies je stijl", desc: "Begin met het zorgvuldig vormgegeven sjabloon dat het best bij jullie past." },
  { n: "02", title: "Personaliseer", desc: "Voeg namen, datum, programma en details toe, plus jullie eigen foto en lied. Een gratis livevoorbeeld voordat je betaalt." },
  { n: "03", title: "Deel", desc: "Publiceer met één klik en deel de persoonlijke link van elke gast via WhatsApp, Instagram of waar je maar wilt." },
  { n: "04", title: "Alle antwoorden op één plek", desc: "Aanwezigheid, dieetwensen en menukeuzes werken zichzelf bij in je dashboard terwijl je gasten antwoorden." },
];

const plans = [
  { name: "Collectie", price: "89", desc: "eenmalige betaling", features: ["Kleuren, lettertypes en jullie foto: alles aanpasbaar", "Een persoonlijke link per groep", "Alle beschikbare sjablonen", "Gecentraliseerde RSVP\u2019s in realtime", "Elke gast in zijn eigen taal", "Afgewerkte uitnodiging v\u00f3\u00f3r de betaling", "Muziek: onze selectie of jullie eigen nummer"], cta: "Maak je uitnodiging \u2014 gratis", highlight: true },
  { name: "Destination Wedding", price: "149", desc: "eenmalige betaling", features: ["Alles uit de Collectie", "Onbeperkt dagen: welkomstdiner, bruiloft, brunch", "Per dag andere gasten", "\u2018Waar te slapen\u2019: hotels met foto\u2019s en boekingslink"], cta: "Maak je uitnodiging \u2014 gratis", highlight: false },
  { name: "Op maat", price: "249", desc: "eenmalige betaling", features: ["Alles uit de Collectie", "Een ontwerp speciaal voor jullie gemaakt", "Vier correctierondes, klaar in 7 werkdagen", "Meteen publiceren terwijl we ontwerpen", "Persoonlijke begeleiding van briefing tot oplevering"], cta: "Maak je uitnodiging \u2014 gratis", highlight: false },
];

const comparisonRows = [
  { feature: "Alle sjablonen, kleuren en lettertypes", c: true, d: true, m: true },
  { feature: "Elke gast in zijn eigen taal", c: true, d: true, m: true },
  { feature: "Antwoorden van gasten in realtime", c: true, d: true, m: true },
  { feature: "AI-tekstpersonalisatie", c: true, d: true, m: true },
  { feature: "Gastenboek met wensen", c: true, d: true, m: true },
  { feature: "Onbeperkt dagen en momenten", c: false, d: true, m: true },
  { feature: "Hotels met foto en boekingslink", c: false, d: true, m: true },
  { feature: "AI-tafelindeling", c: false, d: true, m: true },
  { feature: "Een ontwerp speciaal voor jullie", c: false, d: false, m: true },
];
export default function HomePage() {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-serif text-lg tracking-[0.08em] text-[#16161D]">Casa Nomada</Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#sjablonen" className="text-[13px] text-text-muted hover:text-[#16161D] transition-colors font-sans">Sjablonen</Link>
            <Link href="#werkwijze" className="text-[13px] text-text-muted hover:text-[#16161D] transition-colors font-sans">Hoe het werkt</Link>
            <Link href="#prijzen" className="text-[13px] text-text-muted hover:text-[#16161D] transition-colors font-sans">Prijzen</Link>
            <Link href="#faq" className="text-[13px] text-text-muted hover:text-[#16161D] transition-colors font-sans">FAQ</Link>
          </nav>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/dashboard" className="text-[13px] text-text-muted hover:text-[#16161D] transition-colors font-sans">Inloggen</Link>
            <Link href="/templates" className="text-[13px] bg-brand-800 text-white px-5 py-2 rounded-full hover:bg-brand-700 transition-colors font-sans">Maak je uitnodiging</Link>
          </div>
          <button className="md:hidden p-2 text-[#16161D]"><LayoutGrid size={20} /></button>
        </div>
      </header>
      <main className="pt-16">
        <section className="bg-white">
          <div className="max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
            <div className="animate-fade-up">
              <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-brand-600 mb-6">Emotie vanaf het eerste moment</p>
              <h1 className="font-serif text-[2.75rem] md:text-6xl lg:text-[4.25rem] text-[#16161D] leading-[1.08] mb-5">Jullie mooiste uitnodiging, jullie eenvoudigste reacties.</h1>
              <h2 className="font-serif text-xl md:text-2xl text-text-muted font-light mb-10">Digitale trouwkaarten</h2>
            </div>
            <div className="animate-fade-up animate-fade-up-delay-1">
              <ul className="inline-flex flex-col items-start gap-2.5 mb-10 text-left">
                {["Jullie foto\u2019s, jullie kleuren, jullie muziek", "Een persoonlijke link voor elke gast", "Elke gast leest in de eigen taal", "Reacties komen binnen in jullie dashboard", "Tafelindeling met hulp van onze AI"].map((f) => (<li key={f} className="flex items-center gap-2.5 font-sans text-sm text-text-muted"><Check size={15} className="text-brand-700 shrink-0" />{f}</li>))}
              </ul>
              <div className="flex flex-col sm:flex-row justify-center gap-3 mb-6">
                <Link href="/templates" className="inline-flex items-center justify-center gap-2 bg-brand-800 text-white rounded-full px-8 py-3.5 font-sans text-sm font-medium hover:bg-brand-700 transition-colors">Maak jullie uitnodiging &mdash; gratis<ArrowRight size={15} /></Link>
                <Link href="#sjablonen" className="inline-flex items-center justify-center gap-2 border border-gray-200 text-[#16161D] rounded-full px-8 py-3.5 font-sans text-sm font-medium hover:border-brand-800 hover:text-brand-800 transition-colors">Bekijk de sjablonen</Link>
              </div>
              <p className="font-sans text-xs text-text-muted">Gratis voorbeeld &middot; Veilige betaling &middot; &euro;89 om te publiceren</p>
              <p className="font-sans text-xs text-text-muted mt-2">Heb je al een account? <Link href="/dashboard" className="text-brand-700 underline hover:text-brand-800">Inloggen</Link></p>
            </div>
          </div>
        </section>

        <section className="bg-cream border-y border-gray-100 py-5">
          <div className="max-w-6xl mx-auto px-6">
            <div className="template-strip">
              {templates.map((t, i) => (<span key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-100 text-xs font-sans text-text-muted hover:border-brand-800 hover:text-brand-800 cursor-pointer transition-colors"><span className={`w-2.5 h-2.5 rounded-full ${t.accent}`} />{t.name}</span>))}
            </div>
            <p className="text-center font-sans text-[10px] text-text-muted/60 mt-3">Livevoorbeeld &middot; tik op een sjabloon</p>
          </div>
        </section>

        <section id="sjablonen" className="bg-white py-28">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <SectionLabel>De sjablonen</SectionLabel>
              <h2 className="font-serif text-4xl md:text-5xl text-[#16161D] mb-4">Kies je stijl</h2>
              <p className="font-sans text-text-muted max-w-lg mx-auto leading-relaxed">Zorgvuldig vormgegeven sjablonen, geoptimaliseerd voor de smartphone. Tik op een sjabloon om het livevoorbeeld te openen.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {templates.map((t, i) => (<div key={i} className="card-hover group"><div className={`rounded-2xl ${t.bg} p-5 border border-white/80`}><div className="rounded-xl overflow-hidden bg-white shadow-sm"><div className={`${t.accent} h-20 flex items-end px-4 pb-3`}><span className="text-white/90 text-[10px] font-sans tracking-[0.15em] uppercase">Uitnodiging</span></div><div className="p-4 text-center"><p className="font-serif text-lg text-[#16161D] mb-0.5">A &amp; B</p><p className="font-sans text-[10px] text-text-muted mb-3">14 juni 2025</p><div className={`${t.accent} rounded-full py-1.5 px-4 text-[9px] text-white font-sans inline-block tracking-wide`}>RSVP</div></div></div></div><div className="mt-3 px-1"><h3 className="font-serif text-base text-[#16161D] group-hover:text-brand-800 transition-colors">{t.name}</h3><p className="font-sans text-xs text-text-muted mt-0.5">{t.desc}</p></div></div>))}
            </div>
          </div>
        </section>

        <section className="bg-brand-800 py-6">
          <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <p className="font-serif text-2xl md:text-3xl text-white">&euro;89</p>
            <p className="font-sans text-sm text-white/70">Eenmalige betaling, geen abonnement</p>
            <Link href="/templates" className="inline-flex items-center gap-2 bg-white text-brand-800 rounded-full px-6 py-2.5 font-sans text-sm font-medium hover:bg-cream transition-colors sm:ml-4">Maak jullie uitnodiging &mdash; gratis<ArrowRight size={14} /></Link>
          </div>
        </section>

        <section id="werkwijze" className="bg-cream py-28">
          <div className="max-w-2xl mx-auto px-6">
            <div className="text-center mb-16"><SectionLabel>Hoe het werkt</SectionLabel><h2 className="font-serif text-4xl md:text-5xl text-[#16161D]">Van sjabloon naar RSVP, in een paar stappen</h2></div>
            <div className="space-y-12">
              {steps.map((s, i) => (<div key={i} className="flex gap-6"><div className="shrink-0 w-14 text-right"><span className="font-serif text-3xl text-brand-800/30">{s.n}</span></div><div className="pb-2"><h3 className="font-serif text-xl text-[#16161D] mb-2">{s.title}</h3><p className="font-sans text-sm text-text-muted leading-relaxed">{s.desc}</p></div></div>))}
            </div>
          </div>
        </section>
        <section id="prijzen" className="bg-white py-28">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16"><SectionLabel>Prijzen</SectionLabel><h2 className="font-serif text-4xl md:text-5xl text-[#16161D] mb-4">Drie pakketten, &eacute;&eacute;n betaling</h2><p className="font-sans text-text-muted max-w-lg mx-auto leading-relaxed">Maak jullie uitnodiging en bekijk hem helemaal af, gratis. Je betaalt &euro;89 om hem te publiceren.</p></div>
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {plans.map((p, i) => (<div key={i} className={`rounded-2xl p-8 flex flex-col ${p.highlight ? "bg-brand-800 text-white shadow-xl shadow-brand-800/15 ring-2 ring-brand-800 relative" : "bg-cream border border-gray-100"}`}>{p.highlight && (<span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-sans tracking-[0.15em] uppercase bg-white text-brand-800 rounded-full px-4 py-1 shadow-sm">Aanbevolen</span>)}<p className={`font-serif text-xl mb-1 ${p.highlight ? "text-white" : "text-[#16161D]"}`}>{p.name}</p><div className="flex items-baseline gap-1 mb-1"><span className={`font-serif text-5xl ${p.highlight ? "text-white" : "text-[#16161D]"}`}>&euro;{p.price}</span></div><p className={`font-sans text-xs mb-8 ${p.highlight ? "text-white/60" : "text-text-muted"}`}>{p.desc}</p><ul className="space-y-2.5 mb-8 flex-1">{p.features.map((f, fi) => (<li key={fi} className={`flex items-start gap-2 font-sans text-sm leading-snug ${p.highlight ? "text-white/90" : "text-text-muted"}`}><Check size={14} className={`mt-0.5 shrink-0 ${p.highlight ? "text-white/70" : "text-brand-700"}`} />{f}</li>))}</ul><Link href="/templates" className={`block text-center rounded-full py-3 font-sans text-sm font-medium transition-colors ${p.highlight ? "bg-white text-brand-800 hover:bg-cream" : "bg-brand-800 text-white hover:bg-brand-700"}`}>{p.cta}</Link></div>))}
            </div>
            <div className="flex flex-wrap justify-center gap-6 mb-16"><span className="font-sans text-xs text-text-muted flex items-center gap-1.5"><Check size={13} className="text-brand-700" />E&eacute;n betaling, nooit een abonnement</span><span className="font-sans text-xs text-text-muted flex items-center gap-1.5"><Check size={13} className="text-brand-700" />E&eacute;n prijs, geen verlengingen</span></div>
            <div className="overflow-x-auto"><p className="font-sans text-xs text-text-muted italic mb-4 text-center">Wat elk pakket bevat</p><table className="comparison-table w-full text-left"><thead><tr className="border-b-2 border-gray-200"><th className="font-sans text-xs text-text-muted font-normal">Wat elk pakket bevat</th><th className="font-serif text-sm text-[#16161D]">Collectie<br/><span className="font-sans text-xs text-text-muted font-normal">&euro;89</span></th><th className="font-serif text-sm text-[#16161D]">Destination<br/><span className="font-sans text-xs text-text-muted font-normal">&euro;149</span></th><th className="font-serif text-sm text-[#16161D]">Op maat<br/><span className="font-sans text-xs text-text-muted font-normal">&euro;249</span></th></tr></thead><tbody>{comparisonRows.map((row, i) => (<tr key={i}><td className="font-sans text-sm text-text-muted">{row.feature}</td><td>{row.c ? <Check size={16} className="text-brand-700 mx-auto" /> : <MinusIcon size={16} className="text-gray-300 mx-auto" />}</td><td>{row.d ? <Check size={16} className="text-brand-700 mx-auto" /> : <MinusIcon size={16} className="text-gray-300 mx-auto" />}</td><td>{row.m ? <Check size={16} className="text-brand-700 mx-auto" /> : <MinusIcon size={16} className="text-gray-300 mx-auto" />}</td></tr>))}</tbody></table></div>
          </div>
        </section>

        <section className="bg-cream py-28">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16"><SectionLabel>Voordelen</SectionLabel><h2 className="font-serif text-4xl md:text-5xl text-[#16161D]">Uitnodigingen die een andere indruk maken</h2></div>
            <div className="space-y-16 mb-20">
              {[{n:"01",title:"Een uitnodiging die alleen van jullie is",desc:"Verfijnde typografie, smaakvolle kleurenpaletten, jullie eigen foto en jullie eigen lied: elk detail zegt \u201edit is onze dag\u201d. Een uitnodiging met karakter die jullie met trots delen."},{n:"02",title:"Een uitnodiging op maat voor elke gast",desc:"Elke groep krijgt een eigen uitnodiging, met de namen er al in en een persoonlijke link. Stuur ze \u00e9\u00e9n voor \u00e9\u00e9n, of deel \u00e9\u00e9n open link. Hoe dan ook voelt iedereen zich deel van jullie dag."},{n:"03",title:"Alle antwoorden in \u00e9\u00e9n lijst",desc:"Aanwezigheid, dieetwensen, menukeuzes en kinderen werken zichzelf bij terwijl je gasten antwoorden. Geen bevestigingen meer verspreid over berichten en telefoontjes."}].map((item, i) => (<div key={i} className="flex gap-6 md:gap-10"><span className="font-serif text-4xl text-brand-800/20 shrink-0 w-12 text-right">{item.n}</span><div><h3 className="font-serif text-2xl text-[#16161D] mb-3">{item.title}</h3><p className="font-sans text-text-muted leading-relaxed">{item.desc}</p></div></div>))}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[{title:"Elke gast in zijn eigen taal",desc:"Elke uitnodiging past zich automatisch aan de taal van wie hem opent."},{title:"100% digitaal en milieuvriendelijk",desc:"Geen papier, geen drukwerk, geen verzending."},{title:"Klaar in enkele minuten",desc:"Kies een sjabloon, vul jullie gegevens in, publiceer met \u00e9\u00e9n klik."},{title:"Envelop met lakzegel",desc:"Elke uitnodiging opent met een envelop en lakzegel \u2014 een moment van verwachting."}].map((f, i) => (<div key={i} className="bg-white rounded-2xl p-6 border border-gray-50"><h4 className="font-serif text-base text-[#16161D] mb-2">{f.title}</h4><p className="font-sans text-xs text-text-muted leading-relaxed">{f.desc}</p></div>))}
            </div>
          </div>
        </section>
        <section className="bg-white py-28">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-6"><SectionLabel>Een herinnering voor altijd</SectionLabel></div>
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="font-serif text-4xl md:text-[2.75rem] text-[#16161D] mb-5 leading-tight">De woorden van je dierbaren, voor altijd bewaard</h2>
                <p className="font-sans text-text-muted leading-relaxed mb-8">Bij elke bevestiging kunnen de mensen die van je houden een bericht achterlaten. Alle gedachten komen op &eacute;&eacute;n plek samen &mdash; geen berichten meer die verloren gaan. Exporteer ze naar een elegant PDF-boekje om voor altijd te koesteren.</p>
                <ul className="space-y-3 mb-8">{["Elke gast laat zijn bericht achter bij de RSVP","Alle gedachten verzameld in je dashboard","Exporteren naar een PDF om voor altijd te bewaren"].map((f) => (<li key={f} className="flex items-center gap-2.5 font-sans text-sm text-text-muted"><Check size={15} className="text-brand-700 shrink-0" />{f}</li>))}</ul>
                <Link href="/templates" className="inline-flex items-center gap-2 bg-brand-800 text-white rounded-full px-7 py-3 font-sans text-sm hover:bg-brand-700 transition-colors">Maak je uitnodiging en begin ze te verzamelen<ArrowRight size={15} /></Link>
              </div>
              <div className="bg-cream rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-brand-800 px-6 py-4 flex items-center justify-between"><span className="font-sans text-[10px] tracking-[0.15em] uppercase text-white/80">Gastenboek</span><Heart size={14} className="text-white/50" /></div>
                <div className="p-5 space-y-4">{[{name:"Mama & Papa",msg:"Wat een prachtig koppel! Wij wensen jullie een leven vol liefde en geluk.",t:"2 min geleden",color:"bg-brand-800"},{name:"Lisa & Mark",msg:"Gefeliciteerd! We zijn zo blij voor jullie. Op naar een geweldige dag!",t:"5 min geleden",color:"bg-purple-600"},{name:"Oma Riet",msg:"Lieve kinderen, mooier had het niet kunnen zijn. Veel geluk samen!",t:"12 min geleden",color:"bg-amber-600"}].map((w, i) => (<div key={i} className="flex gap-3"><div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white text-[10px] font-sans ${w.color}`}>{w.name[0]}</div><div className="flex-1"><div className="flex items-baseline justify-between mb-1"><p className="font-sans text-xs font-medium text-[#16161D]">{w.name}</p><p className="font-sans text-[10px] text-text-muted">{w.t}</p></div><p className="font-sans text-xs text-text-muted leading-relaxed">{w.msg}</p></div></div>))}</div>
                <div className="border-t border-gray-100 p-4"><div className="bg-white rounded-full px-4 py-2.5 text-xs font-sans text-text-muted/50">Schrijf een wens...</div></div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-cream py-28">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-6"><SectionLabel>AI-tafelindeling</SectionLabel></div>
            <div className="grid md:grid-cols-2 gap-16 items-start">
              <div>
                <h2 className="font-serif text-4xl md:text-[2.75rem] text-[#16161D] mb-5 leading-tight">Organiseer de tafels met AI. In 2 minuten.</h2>
                <p className="font-sans text-text-muted leading-relaxed mb-10">Typ of praat en de assistent plaatst elke gast met oog voor families, allergie&euml;n, kinderen en wie uit elkaar moet blijven. Jij houdt altijd de controle.</p>
                <div className="space-y-8">{[{title:"Jij praat, hij plaatst",desc:"Dicteer een opdracht of typ hem: \u201eplaats iedereen, het bruidspaar in het midden, families apart\u201d. Klaar."},{title:"Hij snapt de echte voorwaarden",desc:"Familie die uit elkaar moet, exen, kinderen samen: zeg het gewoon in woorden, hij regelt het."},{title:"Tafelnamen met een thema",desc:"Italiaanse steden, films, reizen: de AI stelt themanamen voor die bij jullie stijl passen."},{title:"Jij beslist altijd",desc:"De AI stelt voor, jij beslist: versleep met de hand, exporteer de dieet-PDF voor de keuken."}].map((f, i) => (<div key={i}><h4 className="font-serif text-lg text-[#16161D] mb-1.5">{f.title}</h4><p className="font-sans text-sm text-text-muted leading-relaxed">{f.desc}</p></div>))}</div>
                <p className="font-sans text-[11px] text-text-muted/60 mt-8 italic">Gastgegevens blijven veilig: er worden geen persoonsgegevens gebruikt om modellen te trainen.</p>
                <Link href="/templates" className="mt-8 inline-flex items-center gap-2 bg-brand-800 text-white rounded-full px-7 py-3 font-sans text-sm hover:bg-brand-700 transition-colors">Probeer de AI-assistent<ArrowRight size={15} /></Link>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-[#16161D] px-5 py-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-400" /><div className="w-2 h-2 rounded-full bg-yellow-400" /><div className="w-2 h-2 rounded-full bg-green-400" /><span className="font-sans text-[11px] text-white/40 ml-2">AI Tafelindeling</span></div>
                <div className="p-5 space-y-3">{[{role:"ai",msg:"Hoi! Ik ben jullie AI-assistent voor de tafelindeling. Hoeveel gasten verwachten jullie?"},{role:"user",msg:"We hebben 80 gasten: 20 familie bruid, 20 familie bruidegom en 40 vrienden."},{role:"ai",msg:"Perfect! Zijn er gasten die liever niet samen aan tafel zitten, of juist wel bij elkaar?"},{role:"user",msg:"Mijn ouders en zijn ouders kennen elkaar nog niet goed."},{role:"ai",msg:"Begrepen! Ik maak een indeling waarbij beide families rustig kennis kunnen maken. Even geduld..."}].map((m, i) => (<div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[80%] rounded-2xl px-4 py-2.5 font-sans text-xs leading-relaxed ${m.role === "ai" ? "bg-cream border border-gray-100 text-text-muted" : "bg-brand-800 text-white"}`}>{m.msg}</div></div>))}</div>
                <div className="border-t border-gray-100 px-5 py-3 bg-cream"><p className="font-sans text-[10px] text-brand-700 mb-1">&#10024; Klaar: gasten verdeeld over 6 tafels.</p><div className="bg-white rounded-full px-4 py-2 text-xs font-sans text-text-muted/50">Plaats iedereen, het bruidspaar in het midden, families apart</div></div>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="bg-white py-28"><div className="max-w-2xl mx-auto px-6"><div className="text-center mb-14"><SectionLabel>Voordat je begint</SectionLabel><h2 className="font-serif text-4xl md:text-5xl text-[#16161D]">Veelgestelde vragen</h2></div><FAQAccordion /></div></section>

        <section className="bg-cream py-28"><div className="max-w-2xl mx-auto px-6 text-center"><h2 className="font-serif text-4xl md:text-5xl text-[#16161D] mb-5 leading-tight">Klaar om jullie uitnodiging te maken?</h2><p className="font-sans text-text-muted text-lg mb-10 leading-relaxed">Probeer het gratis. Jullie betalen pas wanneer jullie overtuigd zijn.</p><Link href="/templates" className="inline-flex items-center gap-2 bg-brand-800 text-white rounded-full px-10 py-4 font-sans text-sm font-medium hover:bg-brand-700 transition-colors">Maak jullie uitnodiging &mdash; gratis<ArrowRight size={15} /></Link></div></section>

        <footer className="bg-[#16161D] py-16"><div className="max-w-6xl mx-auto px-6"><div className="grid md:grid-cols-4 gap-10 mb-12"><div className="md:col-span-2"><p className="font-serif text-lg text-white mb-3">Casa Nomada</p><p className="font-sans text-sm text-white/50 leading-relaxed max-w-sm mb-5">Digitale trouwkaarten, elegant en gepersonaliseerd. Gratis voorbeeld, publiceren met &eacute;&eacute;n klik.</p><Link href="/templates" className="inline-flex items-center gap-1.5 font-sans text-sm text-white/70 hover:text-white transition-colors">Maak je trouwkaart &rarr;</Link></div><div><p className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/30 mb-4">Product</p><ul className="space-y-2.5">{[{label:"Hoe het werkt",href:"#werkwijze"},{label:"Voordelen",href:"#voordelen"},{label:"Prijzen",href:"#prijzen"},{label:"FAQ",href:"#faq"},{label:"Sjablonen",href:"#sjablonen"}].map((l) => (<li key={l.label}><Link href={l.href} className="font-sans text-sm text-white/50 hover:text-white transition-colors">{l.label}</Link></li>))}</ul></div><div><p className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/30 mb-4">Juridisch</p><ul className="space-y-2.5">{["Servicevoorwaarden","Privacybeleid","Cookiebeleid","Contact"].map((l) => (<li key={l}><Link href="#" className="font-sans text-sm text-white/50 hover:text-white transition-colors">{l}</Link></li>))}</ul></div></div><div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-3"><p className="font-sans text-xs text-white/30">&copy; 2025 Casa Nomada Digital. Alle rechten voorbehouden.</p><p className="font-sans text-xs text-white/30">Veilig betalen &middot; De afgewerkte uitnodiging v&oacute;&oacute;r de betaling</p></div></div></footer>
      </main>
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-100 px-4 py-3 flex gap-3"><Link href="/templates" className="flex-1 text-center bg-brand-800 text-white rounded-full py-3 font-sans text-sm font-medium hover:bg-brand-700 transition-colors">Uitnodiging maken</Link><Link href="#prijzen" className="flex-1 text-center border border-brand-800 text-brand-800 rounded-full py-3 font-sans text-sm font-medium hover:bg-cream transition-colors">Prijzen</Link></div>
    </>
  );
}