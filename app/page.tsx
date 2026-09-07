import Link from "next/link";
import {
  Heart,
  Check,
  ArrowRight,
  Minus as MinusIcon,
  LayoutGrid,
  Plus,
  Mail,
  Star,
} from "lucide-react";
import FAQAccordion from "@/components/FAQAccordion";

/* ── helpers ── */
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[12px] tracking-[1.68px] uppercase text-brand-800 mb-5 font-sans font-semibold">
    {children}
  </p>
);

const templates = [
  { name: "Volta Celeste", img: "https://sponsalia.app/_next/image?url=%2Fassets%2Fmarketing%2Ftemplates%2Fvolta-celeste-en-vetrina-63b82e9f.jpg&w=1200&q=75", desc: "Geschilderde lucht en wit rankwerk, stoffen strik." },
  { name: "Strawberry Matcha", img: "https://sponsalia.app/_next/image?url=%2Fassets%2Fmarketing%2Ftemplates%2Fstrawberry-matcha-en-vetrina-a6eb8665.jpg&w=1200&q=75", desc: "Fris en speels, matcha en aardbei." },
  { name: "Tratto d'Inchiostro", img: "https://sponsalia.app/_next/image?url=%2Fassets%2Fmarketing%2Ftemplates%2Ftratto-inchiostro-en-vetrina-48f6d0e0.jpg&w=1200&q=75", desc: "Penlijnen op papier, een enkele inkt." },
  { name: "Toile de Jouy", img: "https://sponsalia.app/_next/image?url=%2Fassets%2Fmarketing%2Ftemplates%2Ftoile-bleu-en-vetrina-a0fc5d6a.jpg&w=1200&q=75", desc: "Toile in vier tinten op creme papier." },
  { name: "Idillio", img: "https://sponsalia.app/_next/image?url=%2Fassets%2Fmarketing%2Ftemplates%2Fidillio-en-vetrina-4806113a.jpg&w=1200&q=75", desc: "Gouden strik en zwanen, alles licht." },
  { name: "Villa Cortina", img: "https://sponsalia.app/_next/image?url=%2Fassets%2Fmarketing%2Ftemplates%2Fvilla-cortina-en-vetrina-553a7717.jpg&w=1200&q=75", desc: "Het gordijn opent de zaal, kant en kristal." },
  { name: "Romantisch Botanisch", img: "https://sponsalia.app/_next/image?url=%2Fassets%2Fmarketing%2Ftemplates%2Fbotanico-romantico-en-vetrina-5a476f93.jpg&w=1200&q=75", desc: "Bladeren en bloemen, delicaat." },
  { name: "Tuscany Chic", img: "https://sponsalia.app/_next/image?url=%2Fassets%2Fmarketing%2Ftemplates%2Ftuscany-chic-en-vetrina-6c591e8d.jpg&w=1200&q=75", desc: "Warm en verfijnd, en plein air." },
  { name: "De Geheime Tuin", img: "https://sponsalia.app/_next/image?url=%2Fassets%2Fmarketing%2Ftemplates%2Fgiardino-segreto-en-vetrina-25ee18b2.jpg&w=1200&q=75", desc: "Rozenboog en Italiaanse tuin." },
  { name: "Betoverd Bos", img: "https://sponsalia.app/_next/image?url=%2Fassets%2Fmarketing%2Ftemplates%2Fincanto-nel-bosco-en-vetrina-6c056d35.jpg&w=1200&q=75", desc: "Geschilderd bos en wilde rozen." },
  { name: "Zomertuin", img: "https://sponsalia.app/_next/image?url=%2Fassets%2Fmarketing%2Ftemplates%2Fgiardino-destate-en-vetrina-16e90ec0.jpg&w=1200&q=75", desc: "Groene tuin en roze kant." },
  { name: "Het Zwanenmeer", img: "https://sponsalia.app/_next/image?url=%2Fassets%2Fmarketing%2Ftemplates%2Flago-dei-cigni-en-vetrina-4b04abc9.jpg&w=1200&q=75", desc: "Romantisch en luchtig, zachte tinten." },
  { name: "Riviera 70", img: "https://sponsalia.app/_next/image?url=%2Fassets%2Fmarketing%2Ftemplates%2Friviera-70-en-vetrina-5a764ed8.jpg&w=1200&q=75", desc: "Zonnig en vintage, jaren 70-sfeer." },
  { name: "Gouden Uur", img: "https://sponsalia.app/_next/image?url=%2Fassets%2Fmarketing%2Ftemplates%2Ftipografico-moderno-en-vetrina-2c921489.jpg&w=1200&q=75", desc: "Warm avondlicht, romantisch en intiem." },
  { name: "Italiaanse Aquarel", img: "https://sponsalia.app/_next/image?url=%2Fassets%2Fmarketing%2Ftemplates%2Facquerello-italia-en-vetrina-3869b8cc.jpg&w=1200&q=75", desc: "Majolica en kust in aquarel." },
  { name: "Minimale Couture", img: "https://sponsalia.app/_next/image?url=%2Fassets%2Fmarketing%2Ftemplates%2Fcouture-minimale-en-vetrina-4240eaa9.jpg&w=1200&q=75", desc: "Essentieel, ruimte en adem." },
  { name: "Oro Antico", img: "https://sponsalia.app/_next/image?url=%2Fassets%2Fmarketing%2Ftemplates%2Foro-antico-en-vetrina-22d36ceb.jpg&w=1200&q=75", desc: "Beige en oud goud, bloemrijk en elegant." },
  { name: "Villa Aurora", img: "https://sponsalia.app/_next/image?url=%2Fassets%2Fmarketing%2Ftemplates%2Fvilla-aurora-en-vetrina-50b36ee0.jpg&w=1200&q=75", desc: "Terras bij zonsondergang, tijdloze luxe." },
];

const templateNames = [
  "Volta Celeste", "Strawberry Matcha", "Midnight Garden", "Tuscan Gold",
  "Lavender Fields", "Ocean Breeze", "Dusty Rose", "Terracotta Sun",
];

const steps = [
  { n: "01", title: "Kies je stijl", desc: "Begin met het zorgvuldig vormgegeven sjabloon dat het best bij jullie past. Elk sjabloon is geoptimaliseerd voor de smartphone." },
  { n: "02", title: "Personaliseer", desc: "Voeg namen, datum, programma en details toe, plus jullie eigen foto en lied. Een gratis livevoorbeeld voordat je betaalt." },
  { n: "03", title: "Deel", desc: "Publiceer met een klik en deel de persoonlijke link van elke gast via WhatsApp, Instagram of waar je maar wilt." },
  { n: "04", title: "Alle antwoorden op een plek", desc: "Aanwezigheid, dieetwensen en menukeuzes werken zichzelf bij in je dashboard terwijl je gasten antwoorden." },
];

const plans = [
  {
    name: "Collectie",
    price: "89",
    desc: "eenmalige betaling",
    features: [
      "Kleuren, lettertypes en jullie foto: alles aanpasbaar",
      "Een persoonlijke link per groep",
      "Alle beschikbare sjablonen",
      "Gecentraliseerde RSVP's in realtime",
      "Elke gast in zijn eigen taal",
      "Afgewerkte uitnodiging voor de betaling",
      "Muziek: onze selectie of jullie eigen nummer",
    ],
    cta: "Maak je uitnodiging — gratis",
    highlight: true,
  },
  {
    name: "Destination Wedding",
    price: "149",
    desc: "eenmalige betaling",
    features: [
      "Alles uit de Collectie",
      "Onbeperkt dagen: welkomstdiner, bruiloft, brunch",
      "Per dag andere gasten",
      "'Waar te slapen': hotels met foto's en boekingslink",
    ],
    cta: "Maak je uitnodiging — gratis",
    highlight: false,
  },
  {
    name: "Op maat",
    price: "249",
    desc: "eenmalige betaling",
    features: [
      "Alles uit de Collectie",
      "Een ontwerp speciaal voor jullie gemaakt",
      "Vier correctierondes, klaar in 7 werkdagen",
      "Meteen publiceren terwijl we ontwerpen",
      "Persoonlijke begeleiding van briefing tot oplevering",
    ],
    cta: "Maak je uitnodiging — gratis",
    highlight: false,
  },
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

const voordelenLarge = [
  {
    n: "01",
    iconType: "heart" as const,
    title: "Een uitnodiging die alleen van jullie is",
    desc: "Verfijnde typografie, smaakvolle kleurenpaletten, jullie eigen foto en jullie eigen lied: elk detail zegt “dit is onze dag”, geen standaardsjabloon. Een uitnodiging met karakter die jullie met trots delen.",
    dark: true,
  },
  {
    n: "02",
    iconType: "mail" as const,
    title: "Een uitnodiging op maat voor elke gast",
    desc: "Elke groep krijgt een eigen uitnodiging, met de namen er al in en een persoonlijke link. Stuur ze een voor een, of deel een open link en laat gasten zich zelf aanmelden. Hoe dan ook voelt iedereen zich deel van jullie dag.",
    dark: false,
  },
  {
    n: "03",
    iconType: "check" as const,
    title: "Alle antwoorden in een lijst",
    desc: "Aanwezigheid, intoleranties, menukeuzes en kinderen werken zichzelf bij terwijl je gasten antwoorden. Geen bevestigingen meer verspreid over berichten en telefoontjes: alles staat in een lijst, altijd actueel en klaar voor de cateraar.",
    dark: false,
  },
];

const voordelenSmall = [
  { iconType: "check" as const, title: "Elke gast in zijn eigen taal", desc: "Elke uitnodiging past zich automatisch aan de taal van wie hem opent." },
  { iconType: "heart" as const, title: "100% digitaal en milieuvriendelijk", desc: "Geen papier, geen drukwerk, geen verzending." },
  { iconType: "arrow" as const, title: "Klaar in enkele minuten", desc: "Kies een sjabloon, vul jullie gegevens in, publiceer met een klik." },
  { iconType: "mail" as const, title: "Envelop met lakzegel die opent bij aanraking", desc: "Elke uitnodiging komt in een envelop met lakzegel die met een aanraking opent." },
  { iconType: "star" as const, title: "Tafels geregeld met AI", desc: "Typ of praat en de assistent plaatst alle gasten in 2 minuten." },
];

const gastenboekQuotes = [
  {
    quote: "Ik kijk naar jullie vandaag en zie het licht in jullie ogen. Het leven vliegt voorbij, mijn lievelingen: houd elkaars hand vast, ook als je elkaar niet begrijpt. Ik zal er altijd voor jullie zijn. Ik houd meer van jullie dan woorden kunnen zeggen.",
    from: "Oma Elena",
  },
  {
    quote: "We hebben je leren lopen door je handje vast te houden, en vandaag leg je die hand in de zijne. Je zult altijd ons kleine meisje blijven. We zijn zo trots op jullie beiden. Veel geluk met alle avonturen.",
    from: "Mama & Papa",
  },
  {
    quote: "We hebben genoeg wilde avonden gehad samen, maar jullie liefde zien groeien is het mooiste van alles. We wensen jullie een leven vol lachen, reizen en dat prachtige warrige geluk. We houden van jullie!",
    from: "Lisa & Mark",
  },
];

const tafelFeatures = [
  {
    title: "Jij praat, hij plaatst",
    desc: "Dicteer een opdracht of typ hem: “plaats iedereen, het bruidspaar in het midden, families apart”. Klaar.",
  },
  {
    title: "Hij snapt de echte voorwaarden",
    desc: "Familie die uit elkaar moet, exen, kinderen samen: zeg het gewoon in woorden, hij regelt het.",
  },
  {
    title: "Tafelnamen met een thema",
    desc: "Italiaanse steden, films, reizen: de AI stelt themanamen voor die bij jullie stijl passen.",
  },
  {
    title: "Jij beslist altijd",
    desc: "De AI stelt voor, jij beslist: versleep met de hand, exporteer de dieet-PDF voor de keuken.",
  },
];

function SmallIcon({ iconType, className }: { iconType: string; className?: string }) {
  switch (iconType) {
    case "heart":
      return <Heart size={18} className={className} />;
    case "check":
      return <Check size={18} className={className} />;
    case "arrow":
      return <ArrowRight size={18} className={className} />;
    case "mail":
      return <Mail size={18} className={className} />;
    case "star":
      return <Star size={18} className={className} />;
    default:
      return <Check size={18} className={className} />;
  }
}

function LargeIcon({ iconType, size, className }: { iconType: string; size: number; className?: string }) {
  switch (iconType) {
    case "heart":
      return <Heart size={size} className={className} />;
    case "mail":
      return <Mail size={size} className={className} />;
    case "check":
      return <Check size={size} className={className} />;
    default:
      return <Check size={size} className={className} />;
  }
}

export default function HomePage() {
  return (
    <>
      {/* ── HEADER ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-sans text-[16px] font-semibold tracking-[0.2em] uppercase text-[#16161D]">
            Casa Nomada
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: "Sjablonen", href: "#sjablonen" },
              { label: "Hoe het werkt", href: "#werkwijze" },
              { label: "Voordelen", href: "#voordelen" },
              { label: "Prijzen", href: "#prijzen" },
              { label: "FAQ", href: "#faq" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[13px] text-text-muted hover:text-[#16161D] transition-colors font-sans"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/dashboard" className="text-[13px] text-text-muted hover:text-[#16161D] transition-colors font-sans">
              Inloggen
            </Link>
            <Link
              href="/templates"
              className="text-[13px] bg-brand-800 text-white px-5 py-2.5 rounded-full hover:bg-brand-700 transition-colors font-sans tracking-[0.1em] uppercase"
            >
              Maak je uitnodiging
            </Link>
          </div>
          <button className="md:hidden p-2 text-[#16161D]" aria-label="Menu">
            <LayoutGrid size={20} />
          </button>
        </div>
      </header>

      <main className="pt-16">

        {/* ══════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════ */}
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-6 py-28">
            <div className="grid lg:grid-cols-[55%_45%] gap-12 lg:gap-16 items-center">

              {/* ── LEFT: copy ── */}
              <div className="animate-fade-up">
                {/* pill badge */}
                <div className="inline-flex items-center gap-2 bg-cream border border-gray-200 rounded-full px-4 py-1.5 mb-8">
                  <Heart size={12} className="text-brand-800" />
                  <span className="text-[11px] tracking-[0.2em] uppercase text-brand-800 font-sans font-medium">
                    Emotie vanaf het eerste moment
                  </span>
                </div>

                {/* H1 */}
                <h1 className="font-serif text-[2.75rem] md:text-[3.6rem] lg:text-[4.8rem] font-semibold leading-[1.07] tracking-[-0.02em] text-[#16161D] max-w-[660px] mb-6">
                  Jullie mooiste uitnodiging,{" "}
                  <span className="text-brand-800">jullie eenvoudigste reacties.</span>
                </h1>

                {/* H2 */}
                <h2 className="font-serif text-[1.45rem] font-medium text-[#16161D]/70 mb-6">
                  Digitale trouwkaarten &mdash; elegant, persoonlijk, moeiteloos
                </h2>

                {/* feature pills */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {[
                    "Jullie foto's en kleuren",
                    "Persoonlijke link per gast",
                    "Meertalig",
                    "RSVP-dashboard",
                    "AI-tafelindeling",
                  ].map((f) => (
                    <span
                      key={f}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white text-[13px] font-sans text-text-muted"
                    >
                      <Check size={13} className="text-brand-700" />
                      {f}
                    </span>
                  ))}
                </div>

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <Link
                    href="/templates"
                    className="inline-flex items-center justify-center gap-2 bg-brand-800 text-white rounded-full px-7 py-3.5 text-[15px] font-sans font-medium hover:bg-brand-700 transition-colors"
                  >
                    Maak jullie uitnodiging &mdash; gratis
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="#sjablonen"
                    className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-[#16161D] rounded-full px-7 py-3.5 text-[15px] font-sans font-medium hover:border-brand-800 hover:text-brand-800 transition-colors"
                  >
                    Bekijk de sjablonen
                  </Link>
                </div>

                {/* trust line */}
                <p className="text-[13.6px] text-[#16161D]/[0.66] font-sans mb-2">
                  Gratis voorbeeld &middot; Veilige betaling &middot; &euro;89 om te publiceren
                </p>
                <p className="text-[13px] text-[#16161D]/60 font-sans">
                  Heb je al een account?{" "}
                  <Link href="/dashboard" className="text-brand-700 underline underline-offset-2 hover:text-brand-800 transition-colors">
                    Inloggen
                  </Link>
                </p>
              </div>

              {/* ── RIGHT: iPhone mockup with real image ── */}
              <div className="animate-fade-up animate-fade-up-delay-1 flex flex-col items-center">
                <div className="relative w-[200px] md:w-[220px] lg:w-[240px]">
                  {/* iPhone frame — narrow 9:19.5 ratio */}
                  <div className="rounded-[2.2rem] bg-[#16161D] p-[5px] shadow-2xl shadow-black/25">
                    {/* dynamic island / notch */}
                    <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[80px] h-[22px] bg-[#16161D] rounded-full z-10" />
                    {/* screen */}
                    <div className="rounded-[1.9rem] overflow-hidden" style={{ aspectRatio: "9/19.5" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://sponsalia.app/assets/marketing/templates/volta-celeste-en-vetrina-63b82e9f.jpg"
                        alt="Volta Celeste uitnodiging voorbeeld"
                        className="w-full h-full object-cover object-top"
                        width={240}
                        height={520}
                        style={{ backgroundColor: "#e8e4df" }}
                      />
                    </div>
                  </div>
                </div>

                {/* template name strip below phone */}
                <div className="mt-6 flex flex-wrap justify-center gap-x-3 gap-y-1 max-w-[320px]">
                  {templateNames.map((name, i) => (
                    <span
                      key={i}
                      className="font-sans text-[12px] text-text-muted/60 hover:text-brand-800 cursor-pointer transition-colors"
                    >
                      {name}{i < templateNames.length - 1 ? "," : ""}
                    </span>
                  ))}
                </div>
                <p className="font-sans text-[11px] text-text-muted/50 mt-2">
                  Livevoorbeeld &middot; tik op een sjabloon
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            TEMPLATES GRID
        ══════════════════════════════════════════════════ */}
        <section id="sjablonen" className="bg-white py-[120px]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <SectionLabel>De sjablonen</SectionLabel>
              <h2 className="font-serif text-[2.8rem] md:text-[2.8rem] font-semibold text-[#16161D] mb-4">
                Kies je stijl
              </h2>
              <p className="font-sans text-text-muted max-w-lg mx-auto leading-relaxed">
                Zorgvuldig vormgegeven sjablonen, geoptimaliseerd voor de smartphone.
                Tik op een sjabloon om het livevoorbeeld te openen.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {templates.map((t, i) => (
                <div key={i} className="card-hover group cursor-pointer">
                  <div className="rounded-2xl bg-cream overflow-hidden border border-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={t.img}
                      alt={t.name}
                      className="w-full h-auto object-cover"
                      loading={i < 6 ? "eager" : "lazy"}
                    />
                  </div>
                  <div className="mt-3 px-1 text-center">
                    <h3 className="font-serif text-base text-[#16161D] group-hover:text-brand-800 transition-colors">
                      {t.name}
                    </h3>
                    <p className="font-sans text-xs text-text-muted mt-0.5">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* "show all" link */}
            <div className="text-center mt-10">
              <Link
                href="/templates"
                className="inline-flex items-center gap-2 font-sans text-[14px] text-brand-800 hover:text-brand-700 transition-colors"
              >
                Bekijk alle {templates.length} sjablonen
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            HOE HET WERKT
        ══════════════════════════════════════════════════ */}
        <section id="werkwijze" className="bg-cream py-[120px]">
          <div className="max-w-2xl mx-auto px-6">
            <div className="text-center mb-16">
              <SectionLabel>Hoe het werkt</SectionLabel>
              <h2 className="font-serif text-[2.8rem] md:text-[2.8rem] font-semibold text-[#16161D]">
                Van sjabloon naar RSVP, in een paar stappen
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative">
              {/* connecting line */}
              <div className="hidden md:block absolute top-[2.5rem] left-[calc(12.5%+1.5rem)] right-[calc(12.5%+1.5rem)] h-px bg-gray-200" />
              {steps.map((s, i) => (
                <div key={i} className="text-center md:text-left">
                  <div className="flex justify-center md:justify-start mb-6">
                    <div className="w-[3.5rem] h-[3.5rem] rounded-full bg-brand-800 flex items-center justify-center relative z-10">
                      <span className="font-serif text-lg text-white">{s.n}</span>
                    </div>
                  </div>
                  <h3 className="font-serif text-[1.15rem] font-semibold text-[#16161D] mb-2">{s.title}</h3>
                  <p className="font-sans text-[14px] text-text-muted leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            VOORDELEN
        ══════════════════════════════════════════════════ */}
        <section id="voordelen" className="bg-cream py-[120px]">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <SectionLabel>Voordelen</SectionLabel>
              <h2 className="font-serif text-[2.8rem] font-semibold text-[#16161D]">
                Uitnodigingen die een andere indruk maken
              </h2>
            </div>

            {/* 3 large feature cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {voordelenLarge.map((item, i) => (
                <div
                  key={i}
                  className={
                    "rounded-2xl p-8 flex flex-col " +
                    (item.dark ? "bg-brand-800" : "bg-white border border-gray-200")
                  }
                >
                  <div className="flex items-start justify-between mb-6">
                    <div
                      className={
                        "w-12 h-12 rounded-full flex items-center justify-center " +
                        (item.dark ? "bg-white/15" : "bg-cream")
                      }
                    >
                      <LargeIcon
                        iconType={item.iconType}
                        size={20}
                        className={item.dark ? "text-white" : "text-brand-800"}
                      />
                    </div>
                    <span
                      className={
                        "font-serif text-[2.5rem] leading-none " +
                        (item.dark ? "text-white/20" : "text-gray-200")
                      }
                    >
                      {item.n}
                    </span>
                  </div>
                  <h3
                    className={
                      "font-serif text-[1.25rem] font-semibold mb-3 " +
                      (item.dark ? "text-white" : "text-[#16161D]")
                    }
                  >
                    {item.title}
                  </h3>
                  <p
                    className={
                      "font-sans text-[14px] leading-relaxed " +
                      (item.dark ? "text-white/75" : "text-text-muted")
                    }
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* smaller feature cards with icons */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {voordelenSmall.map((f, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-cream shrink-0 flex items-center justify-center">
                    <SmallIcon iconType={f.iconType} className="text-brand-800" />
                  </div>
                  <div>
                    <h4 className="font-serif text-[15px] font-semibold text-[#16161D] mb-1">{f.title}</h4>
                    <p className="font-sans text-xs text-text-muted leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            PRICING
        ══════════════════════════════════════════════════ */}
        <section id="prijzen" className="bg-white py-[120px]">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <SectionLabel>Prijzen</SectionLabel>
              <h2 className="font-serif text-[2.8rem] font-semibold text-[#16161D] mb-4">
                Drie pakketten, een betaling
              </h2>
              <p className="font-sans text-text-muted max-w-lg mx-auto leading-relaxed">
                Maak jullie uitnodiging en bekijk hem helemaal af, gratis.
                Je betaalt &euro;89 om hem te publiceren.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {plans.map((p, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white border border-gray-200 p-8 flex flex-col relative"
                >
                  {p.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 text-[10px] font-sans tracking-[0.15em] uppercase bg-brand-800 text-white rounded-full px-4 py-1.5 shadow-sm">
                      <Star size={10} /> Aanbevolen
                    </span>
                  )}
                  <p className="font-serif text-xl text-[#16161D] mb-4 text-center">
                    {p.name}
                  </p>
                  <div className="text-center mb-1">
                    <span className="font-serif text-[3.5rem] text-[#16161D] leading-none">
                      &euro;{p.price}
                    </span>
                  </div>
                  <p className="font-sans text-[11px] tracking-[0.15em] uppercase text-text-muted text-center mb-8">
                    {p.desc}
                  </p>

                  <div className="border-t border-gray-100 mb-8" />

                  <ul className="space-y-3 mb-8 flex-1">
                    {p.features.map((f, fi) => (
                      <li
                        key={fi}
                        className="flex items-start gap-2.5 font-sans text-sm text-text-muted leading-snug"
                      >
                        <Check size={16} className="mt-0.5 shrink-0 text-brand-700" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/templates"
                    className="block text-center rounded-full py-3.5 font-sans text-sm font-medium bg-brand-800 text-white hover:bg-brand-700 transition-colors"
                  >
                    {p.cta}
                  </Link>
                </div>
              ))}
            </div>

            {/* trust badges */}
            <div className="flex flex-wrap justify-center gap-6 mb-16">
              <span className="font-sans text-xs text-text-muted flex items-center gap-1.5">
                <Check size={13} className="text-brand-700" />
                Een betaling, nooit een abonnement
              </span>
              <span className="font-sans text-xs text-text-muted flex items-center gap-1.5">
                <Check size={13} className="text-brand-700" />
                Een prijs, geen verlengingen
              </span>
            </div>

            {/* comparison table */}
            <div className="overflow-x-auto">
              <p className="font-sans text-xs text-text-muted italic mb-4 text-center">
                Wat elk pakket bevat
              </p>
              <table className="comparison-table w-full text-left">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="font-sans text-xs text-text-muted font-normal">Wat elk pakket bevat</th>
                    <th className="font-serif text-sm text-[#16161D]">
                      Collectie
                      <br />
                      <span className="font-sans text-xs text-text-muted font-normal">&euro;89</span>
                    </th>
                    <th className="font-serif text-sm text-[#16161D]">
                      Destination
                      <br />
                      <span className="font-sans text-xs text-text-muted font-normal">&euro;149</span>
                    </th>
                    <th className="font-serif text-sm text-[#16161D]">
                      Op maat
                      <br />
                      <span className="font-sans text-xs text-text-muted font-normal">&euro;249</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr key={i}>
                      <td className="font-sans text-sm text-text-muted">{row.feature}</td>
                      <td>
                        {row.c ? (
                          <Check size={16} className="text-brand-700 mx-auto" />
                        ) : (
                          <MinusIcon size={16} className="text-gray-300 mx-auto" />
                        )}
                      </td>
                      <td>
                        {row.d ? (
                          <Check size={16} className="text-brand-700 mx-auto" />
                        ) : (
                          <MinusIcon size={16} className="text-gray-300 mx-auto" />
                        )}
                      </td>
                      <td>
                        {row.m ? (
                          <Check size={16} className="text-brand-700 mx-auto" />
                        ) : (
                          <MinusIcon size={16} className="text-gray-300 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            GASTENBOEK
        ══════════════════════════════════════════════════ */}
        <section className="bg-white py-[120px]">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-6">
              <SectionLabel>Een herinnering voor altijd</SectionLabel>
            </div>
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="font-serif text-[2.8rem] text-[#16161D] mb-5 leading-tight font-semibold">
                  De woorden van je dierbaren, voor altijd bewaard
                </h2>
                <p className="font-sans text-text-muted leading-relaxed mb-8">
                  Bij elke bevestiging kunnen de mensen die van je houden een bericht achterlaten.
                  Alle gedachten komen op een plek samen &mdash; geen berichten meer die verloren gaan.
                  Exporteer ze naar een elegant PDF-boekje om voor altijd te koesteren.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Elke gast laat zijn bericht achter bij de RSVP",
                    "Alle gedachten verzameld in je dashboard",
                    "Exporteren naar een PDF om voor altijd te bewaren",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 font-sans text-sm text-text-muted">
                      <Check size={15} className="text-brand-700 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/templates"
                  className="inline-flex items-center gap-2 bg-brand-800 text-white rounded-full px-7 py-3.5 font-sans text-[15px] hover:bg-brand-700 transition-colors"
                >
                  Maak je uitnodiging en begin ze te verzamelen
                  <ArrowRight size={15} />
                </Link>
              </div>

              {/* PDF-style gastenboek mockup */}
              <div className="bg-cream rounded-2xl border border-gray-100 shadow-sm p-8 md:p-10">
                <div className="text-center mb-8">
                  <h3 className="font-serif text-2xl text-brand-800 italic mb-1">Gedachten voor het bruidspaar</h3>
                  <p className="font-sans text-xs text-text-muted">Anna &amp; Thomas</p>
                  <p className="font-sans text-[10px] tracking-[0.1em] uppercase text-text-muted/60 mt-1">14 september 2026</p>
                  <div className="w-12 border-t border-brand-800/20 mx-auto mt-4" />
                </div>
                <div className="space-y-6">
                  {gastenboekQuotes.map((w, i) => (
                    <div key={i} className="bg-white rounded-xl p-5 border border-gray-100">
                      <p className="font-serif text-sm text-[#16161D]/80 italic leading-relaxed mb-3">
                        &ldquo;{w.quote}&rdquo;
                      </p>
                      <p className="font-sans text-xs text-text-muted text-right">
                        &mdash; van {w.from}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-center font-sans text-[10px] tracking-[0.15em] uppercase text-text-muted/40 mt-6">CASA NOMADA</p>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            AI TAFELINDELING
        ══════════════════════════════════════════════════ */}
        <section className="bg-cream py-[120px]">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-6">
              <SectionLabel>AI-tafelindeling</SectionLabel>
            </div>
            <div className="grid md:grid-cols-2 gap-16 items-start">
              <div>
                <h2 className="font-serif text-[2.8rem] text-[#16161D] mb-5 leading-tight font-semibold">
                  Organiseer de tafels met AI. In 2 minuten.
                </h2>
                <p className="font-sans text-text-muted leading-relaxed mb-10">
                  Typ of praat en de assistent plaatst elke gast met oog voor families,
                  allergieen, kinderen en wie uit elkaar moet blijven. Jij houdt altijd de controle.
                </p>

                <div className="space-y-8">
                  {tafelFeatures.map((f, i) => (
                    <div key={i}>
                      <h4 className="font-serif text-lg text-[#16161D] mb-1.5">{f.title}</h4>
                      <p className="font-sans text-sm text-text-muted leading-relaxed">{f.desc}</p>
                    </div>
                  ))}
                </div>

                <p className="font-sans text-[11px] text-text-muted/60 mt-8 italic">
                  Gastgegevens blijven veilig: er worden geen persoonsgegevens gebruikt om modellen te trainen.
                </p>

                <Link
                  href="/templates"
                  className="mt-8 inline-flex items-center gap-2 bg-brand-800 text-white rounded-full px-7 py-3.5 font-sans text-[15px] hover:bg-brand-700 transition-colors"
                >
                  Probeer de AI-assistent
                  <ArrowRight size={15} />
                </Link>
              </div>

              {/* floor plan mockup */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8">
                  {/* table layout visualization */}
                  <div className="relative w-full aspect-square max-w-[400px] mx-auto">
                    {/* Bruidspaar tafel (center top) */}
                    <div className="absolute top-[5%] left-1/2 -translate-x-1/2 flex flex-col items-center">
                      <p className="font-sans text-[10px] text-text-muted mb-1">Tafel Bruidspaar</p>
                      <div className="w-14 h-14 rounded-full bg-brand-800/10 border-2 border-brand-800 flex items-center justify-center">
                        <Heart size={16} className="text-brand-800" />
                      </div>
                    </div>
                    {/* Tafel 1 */}
                    <div className="absolute top-[35%] left-[15%] flex flex-col items-center">
                      <p className="font-sans text-[9px] text-text-muted mb-1">Tafel 1</p>
                      <div className="w-14 h-14 rounded-full bg-purple-100 border border-purple-300 flex items-center justify-center">
                        <span className="font-sans text-xs text-purple-700">6/6</span>
                      </div>
                    </div>
                    {/* Tafel 2 */}
                    <div className="absolute top-[35%] right-[15%] flex flex-col items-center">
                      <p className="font-sans text-[9px] text-text-muted mb-1">Tafel 2</p>
                      <div className="w-14 h-14 rounded-full bg-purple-100 border border-purple-300 flex items-center justify-center">
                        <span className="font-sans text-xs text-purple-700">6/6</span>
                      </div>
                    </div>
                    {/* Tafel 3 */}
                    <div className="absolute top-[62%] left-[8%] flex flex-col items-center">
                      <p className="font-sans text-[9px] text-text-muted mb-1">Tafel 3</p>
                      <div className="w-14 h-14 rounded-full bg-purple-100 border border-purple-300 flex items-center justify-center">
                        <span className="font-sans text-xs text-purple-700">5/6</span>
                      </div>
                    </div>
                    {/* Tafel 4 */}
                    <div className="absolute top-[62%] right-[8%] flex flex-col items-center">
                      <p className="font-sans text-[9px] text-text-muted mb-1">Tafel 4</p>
                      <div className="w-14 h-14 rounded-full bg-purple-100 border border-purple-300 flex items-center justify-center">
                        <span className="font-sans text-xs text-purple-700">6/6</span>
                      </div>
                    </div>
                    {/* Kindertafel */}
                    <div className="absolute top-[55%] left-1/2 -translate-x-1/2 flex flex-col items-center">
                      <p className="font-sans text-[9px] text-text-muted mb-1">Kindertafel</p>
                      <div className="w-12 h-12 rounded-lg bg-pink-50 border border-pink-200 flex items-center justify-center">
                        <span className="font-sans text-[10px] text-pink-600">3/3</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* result + input bar */}
                <div className="border-t border-gray-100 px-6 py-4 bg-cream">
                  <p className="font-sans text-[11px] text-brand-700 mb-2">
                    &#10024; Klaar: gasten verdeeld over 6 tafels. Bruidspaar en kinderen aan hun eigen tafels.
                  </p>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-white rounded-full px-4 py-2.5 text-xs font-sans text-text-muted/50">
                      Plaats iedereen, het bruidspaar in het midden, families apart
                    </div>
                    <div className="w-9 h-9 rounded-full bg-brand-800 flex items-center justify-center shrink-0">
                      <ArrowRight size={14} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            FAQ
        ══════════════════════════════════════════════════ */}
        <section id="faq" className="bg-white py-[120px]">
          <div className="max-w-2xl mx-auto px-6">
            <div className="text-center mb-14">
              <SectionLabel>Voordat je begint</SectionLabel>
              <h2 className="font-serif text-[2.8rem] font-semibold text-[#16161D]">
                Veelgestelde vragen
              </h2>
            </div>
            <FAQAccordion />
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            FINAL CTA
        ══════════════════════════════════════════════════ */}
        <section className="bg-brand-800 py-[120px]">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="font-serif text-[2.8rem] font-semibold text-white mb-5 leading-tight italic">
              Klaar om jullie uitnodiging te maken?
            </h2>
            <p className="font-sans text-white/70 text-lg mb-10 leading-relaxed">
              Probeer het gratis. Jullie betalen pas wanneer jullie overtuigd zijn.
            </p>
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 bg-white text-brand-800 rounded-full px-10 py-4 font-sans text-[15px] font-medium hover:bg-cream transition-colors"
            >
              Maak jullie uitnodiging &mdash; gratis
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════════════ */}
        <footer className="bg-[#16161D] py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-10 mb-12">
              <div className="md:col-span-2">
                <p className="font-sans text-[16px] font-semibold tracking-[0.2em] uppercase text-white mb-3">
                  Casa Nomada
                </p>
                <p className="font-sans text-sm text-white/50 leading-relaxed max-w-sm mb-5">
                  Digitale trouwkaarten, elegant en gepersonaliseerd. Gratis voorbeeld, publiceren met een klik.
                </p>
                <Link
                  href="/templates"
                  className="inline-flex items-center gap-1.5 font-sans text-sm text-white/70 hover:text-white transition-colors"
                >
                  Maak je trouwkaart &rarr;
                </Link>
              </div>
              <div>
                <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/30 mb-4">
                  Product
                </p>
                <ul className="space-y-2.5">
                  {[
                    { label: "Sjablonen", href: "#sjablonen" },
                    { label: "Hoe het werkt", href: "#werkwijze" },
                    { label: "Voordelen", href: "#voordelen" },
                    { label: "Prijzen", href: "#prijzen" },
                    { label: "FAQ", href: "#faq" },
                  ].map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="font-sans text-sm text-white/50 hover:text-white transition-colors">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/30 mb-4">
                  Juridisch
                </p>
                <ul className="space-y-2.5">
                  {["Servicevoorwaarden", "Privacybeleid", "Cookiebeleid", "Contact"].map((l) => (
                    <li key={l}>
                      <Link href="#" className="font-sans text-sm text-white/50 hover:text-white transition-colors">
                        {l}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-3">
              <p className="font-sans text-xs text-white/30">
                &copy; 2025 Casa Nomada Digital. Alle rechten voorbehouden.
              </p>
              <p className="font-sans text-xs text-white/30">
                Veilig betalen &middot; De afgewerkte uitnodiging voor de betaling
              </p>
            </div>
          </div>
        </footer>
      </main>

      {/* ══════════════════════════════════════════════════
          STICKY BOTTOM BAR
      ══════════════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-gray-100 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-serif text-2xl text-[#16161D]">&euro;89</span>
            <span className="font-sans text-[13px] text-text-muted hidden sm:inline">
              Eenmalige betaling, geen abonnement
            </span>
          </div>
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 bg-brand-800 text-white rounded-full px-6 py-2.5 font-sans text-[13px] font-medium hover:bg-brand-700 transition-colors tracking-[0.05em] uppercase"
          >
            Maak je uitnodiging
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </>
  );
}
