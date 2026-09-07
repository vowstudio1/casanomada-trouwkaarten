import Link from "next/link";
import { Heart, ArrowLeft, Star, Check } from "lucide-react";

export const metadata = {
  title: "Sjablonen | Casa Nomada Digital",
  description:
    "Ontdek 18 prachtige sjablonen voor digitale trouwuitnodigingen. Van romantisch botanisch tot minimale couture — vind jouw stijl bij Casa Nomada.",
};

const templates = [
  {
    name: "Volta Celeste",
    slug: "volta-celeste",
    img: "volta-celeste-en-vetrina-63b82e9f",
    desc: "Geschilderde lucht en wit rankwerk, stoffen strik.",
  },
  {
    name: "Strawberry Matcha",
    slug: "strawberry-matcha",
    img: "strawberry-matcha-en-vetrina-a6eb8665",
    desc: "Fris en speels, matcha en aardbei.",
  },
  {
    name: "Tratto d'Inchiostro",
    slug: "tratto-inchiostro",
    img: "tratto-inchiostro-en-vetrina-48f6d0e0",
    desc: "Penlijnen op papier, een enkele inkt.",
  },
  {
    name: "Toile de Jouy",
    slug: "toile-bleu",
    img: "toile-bleu-en-vetrina-a0fc5d6a",
    desc: "Toile in vier tinten op creme papier.",
  },
  {
    name: "Idillio",
    slug: "idillio",
    img: "idillio-en-vetrina-4806113a",
    desc: "Gouden strik en zwanen, alles licht.",
  },
  {
    name: "Villa Cortina",
    slug: "villa-cortina",
    img: "villa-cortina-en-vetrina-553a7717",
    desc: "Het gordijn opent de zaal, kant en kristal.",
  },
  {
    name: "Romantisch Botanisch",
    slug: "botanico-romantico",
    img: "botanico-romantico-en-vetrina-5a476f93",
    desc: "Bladeren en bloemen, delicaat.",
  },
  {
    name: "Tuscany Chic",
    slug: "tuscany-chic",
    img: "tuscany-chic-en-vetrina-6c591e8d",
    desc: "Warm en verfijnd, en plein air.",
  },
  {
    name: "De Geheime Tuin",
    slug: "giardino-segreto",
    img: "giardino-segreto-en-vetrina-25ee18b2",
    desc: "Rozenboog en Italiaanse tuin.",
  },
  {
    name: "Betoverd Bos",
    slug: "incanto-nel-bosco",
    img: "incanto-nel-bosco-en-vetrina-6c056d35",
    desc: "Geschilderd bos en wilde rozen.",
  },
  {
    name: "Zomertuin",
    slug: "giardino-destate",
    img: "giardino-destate-en-vetrina-16e90ec0",
    desc: "Groene tuin en roze kant.",
  },
  {
    name: "Het Zwanenmeer",
    slug: "lago-dei-cigni",
    img: "lago-dei-cigni-en-vetrina-4b04abc9",
    desc: "Romantisch en luchtig, zachte tinten.",
  },
  {
    name: "Riviera 70",
    slug: "riviera-70",
    img: "riviera-70-en-vetrina-5a764ed8",
    desc: "Zonnig en vintage, jaren 70-sfeer.",
  },
  {
    name: "Gouden Uur",
    slug: "tipografico-moderno",
    img: "tipografico-moderno-en-vetrina-2c921489",
    desc: "Warm avondlicht, romantisch en intiem.",
  },
  {
    name: "Italiaanse Aquarel",
    slug: "acquerello-italia",
    img: "acquerello-italia-en-vetrina-3869b8cc",
    desc: "Majolica en kust in aquarel.",
  },
  {
    name: "Minimale Couture",
    slug: "couture-minimale",
    img: "couture-minimale-en-vetrina-4240eaa9",
    desc: "Essentieel, ruimte en adem.",
  },
  {
    name: "Oro Antico",
    slug: "oro-antico",
    img: "oro-antico-en-vetrina-22d36ceb",
    desc: "Beige en oud goud, bloemrijk en elegant.",
  },
  {
    name: "Villa Aurora",
    slug: "villa-aurora",
    img: "villa-aurora-en-vetrina-50b36ee0",
    desc: "Terras bij zonsondergang, tijdloze luxe.",
  },
];

function getImageUrl(img: string) {
  return "https://sponsalia.app/assets/marketing/templates/" + img + ".jpg";
}

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* ── Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAF8]/90 backdrop-blur-md border-b border-[#59262F]/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-[#59262F] transition-opacity hover:opacity-70"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium tracking-wide">Terug</span>
          </Link>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <h1
              className="text-xl tracking-[0.25em] text-[#59262F]"
              style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
            >
              CASA NOMADA
            </h1>
          </Link>

          <Link
            href="/pricing"
            className="rounded-full bg-[#59262F] px-5 py-2 text-sm font-medium text-white transition-all hover:bg-[#3d1a21]"
          >
            Begin nu
          </Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="pt-32 pb-16 text-center px-6">
        <div className="mx-auto max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#59262F]/10 px-4 py-1.5 text-sm font-medium text-[#59262F] mb-6">
            <Star className="h-3.5 w-3.5 fill-[#59262F] text-[#59262F]" />
            Vanaf €89
          </span>

          <h2
            className="text-4xl leading-tight text-[#16161D] sm:text-5xl md:text-6xl"
            style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            Alle sjablonen
          </h2>

          <p className="mt-4 text-lg text-[#16161D]/60 max-w-lg mx-auto leading-relaxed">
            Kies een ontwerp dat bij jullie past. Elk sjabloon is volledig
            aanpasbaar met jullie eigen kleuren, foto&apos;s en tekst.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#59262F]/15 bg-white px-4 py-2 text-sm text-[#59262F]/70">
            <Heart className="h-3.5 w-3.5 text-[#59262F]" />
            {templates.length} ontwerpen beschikbaar
          </div>
        </div>
      </section>

      {/* ── Template Grid ── */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((tpl) => (
            <Link
              key={tpl.slug}
              href={"/templates/" + tpl.slug}
              className="group cursor-pointer"
            >
              <div className="overflow-hidden rounded-2xl border border-[#59262F]/8 bg-[#FAFAF8] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-[#59262F]/8">
                <div className="aspect-[3/4] overflow-hidden bg-[#FAFAF8] p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getImageUrl(tpl.img)}
                    alt={tpl.name + " sjabloon voorbeeld"}
                    className="h-full w-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
                <div className="px-4 pb-5 pt-2 text-center">
                  <h3
                    className="text-xl text-[#16161D]"
                    style={{
                      fontFamily: "Cormorant Garamond, Georgia, serif",
                    }}
                  >
                    {tpl.name}
                  </h3>
                  <p className="mt-1 text-sm text-[#16161D]/50 leading-relaxed">
                    {tpl.desc}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="border-t border-[#59262F]/10 bg-white py-20 text-center px-6">
        <div className="mx-auto max-w-lg">
          <Heart className="mx-auto mb-4 h-8 w-8 text-[#59262F]/30" />
          <h3
            className="text-3xl text-[#16161D] sm:text-4xl"
            style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            Klaar om te beginnen?
          </h3>
          <p className="mt-3 text-[#16161D]/60 leading-relaxed">
            Kies een sjabloon, personaliseer het in minuten en verstuur jullie
            digitale trouwuitnodiging.
          </p>
          <Link
            href="/pricing"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#59262F] px-8 py-3.5 text-base font-medium text-white transition-all hover:bg-[#3d1a21] hover:shadow-lg hover:shadow-[#59262F]/20"
          >
            Begin met dit sjabloon
          </Link>

          {/* Trust line */}
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-[#16161D]/50">
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-[#59262F]/60" />
              Gratis voorbeeld
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-[#59262F]/60" />
              Veilige betaling
            </span>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#59262F]/10 bg-[#FAFAF8] py-12 text-center px-6">
        <div className="mx-auto max-w-7xl">
          <p
            className="text-lg tracking-[0.2em] text-[#59262F]/60"
            style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            CASA NOMADA
          </p>
          <p className="mt-3 text-sm text-[#16161D]/40">
            Digitale trouwuitnodigingen, met liefde gemaakt.
          </p>
          <div className="mt-4 flex items-center justify-center gap-6 text-xs text-[#16161D]/30">
            <Link href="/privacy" className="hover:text-[#59262F] transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[#59262F] transition-colors">
              Voorwaarden
            </Link>
            <Link href="/contact" className="hover:text-[#59262F] transition-colors">
              Contact
            </Link>
          </div>
          <p className="mt-6 text-xs text-[#16161D]/25">
            &copy; 2026 Casa Nomada Digital. Alle rechten voorbehouden.
          </p>
        </div>
      </footer>
    </div>
  );
}
