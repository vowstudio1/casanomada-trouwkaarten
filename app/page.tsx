"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { templates } from "@/lib/templates";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import HeroPhone from "@/components/HeroPhone";

export default function HomePage() {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const handleImgError = (slug: string) => {
    setImgErrors(prev => ({ ...prev, [slug]: true }));
  };

  const getImgSrc = (slug: string, originalFile: string) => {
    if (imgErrors[slug]) {
      // Fallback naar Sponsalia als lokaal niet beschikbaar
      return `https://sponsalia.app/assets/marketing/templates/${originalFile}`;
    }
    return `/assets/templates/${slug}.jpg`;
  };

  // Map slug naar originele Sponsalia bestandsnaam voor fallback
  const FALLBACK_FILES: Record<string, string> = {
    "bloom": "bloom-en-vetrina-96e6b193.jpg",
    "volta-celeste": "volta-celeste-en-vetrina-63b82e9f.jpg",
    "zomertuin": "giardino-destate-en-vetrina-e4c79ec8.jpg",
    "villa-aurora": "villa-aurora-en-vetrina-50b36ee0.jpg",
    "het-zwanenmeer": "lago-dei-cigni-en-vetrina-6e0256ed.jpg",
    "villa-cortina": "villa-cortina-en-vetrina-553a7717.jpg",
    "minimale-couture": "couture-minimale-en-vetrina-93e7c6cd.jpg",
    "betoverd-bos": "incanto-nel-bosco-en-vetrina-6c056d35.jpg",
    "riviera-70": "riviera-70-en-vetrina-253c0193.jpg",
    "italiaanse-aquarel": "acquerello-italia-en-vetrina-3869b8cc.jpg",
    "oro-antico": "oro-antico-en-vetrina-22d36ceb.jpg",
    "tuscany-chic": "tuscany-chic-en-vetrina-3646f639.jpg",
    "gouden-uur": "tipografico-moderno-en-vetrina-2c921489.jpg",
    "de-geheime-tuin": "giardino-segreto-en-vetrina-c0e0298d.jpg",
    "tratto-d-inchiostro": "tratto-inchiostro-en-vetrina-48f6d0e0.jpg",
    "idillio": "idillio-en-vetrina-4806113a.jpg",
    "romantisch-botanisch": "botanico-romantico-en-vetrina-5a476f93.jpg",
    "strawberry-matcha": "strawberry-matcha-en-vetrina-4c490953.jpg",
    "toile-de-jouy": "toile-bleu-en-vetrina-a0fc5d6a.jpg",
  };

  return (
    <>
      <Nav />

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", background: "linear-gradient(160deg, #fdf6f4 0%, #f5ede8 60%, #edddd5 100%)", padding: "80px 24px 60px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 420px", gap: 60, alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: "sans-serif", fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: "#8B2635", marginBottom: 16 }}>Digitale trouwuitnodigingen</p>
            <h1 style={{ fontFamily: "serif", fontSize: "clamp(2.4rem, 5vw, 3.8rem)", color: "#16161D", lineHeight: 1.1, marginBottom: 20 }}>
              Een uitnodiging die <em style={{ fontStyle: "italic", color: "#8B2635" }}>aanvoelt</em> als een moment
            </h1>
            <p style={{ fontFamily: "sans-serif", fontSize: 17, color: "#5a5550", lineHeight: 1.75, marginBottom: 32, maxWidth: 480 }}>
              Geen PDF-bijlage. Geen WhatsApp-bericht. Een digitale uitnodiging die opengaat, verwondert en bijblijft — voor elk stel, elk verhaal.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Link href="/register" style={{ background: "#8B2635", color: "white", borderRadius: 999, padding: "14px 28px", fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, textDecoration: "none", letterSpacing: "0.02em" }}>
                Gratis beginnen
              </Link>
              <Link href="/templates" style={{ background: "white", color: "#16161D", borderRadius: 999, padding: "14px 28px", fontFamily: "sans-serif", fontSize: 14, border: "1.5px solid #e0cbc3", textDecoration: "none" }}>
                Bekijk sjablonen
              </Link>
            </div>
            <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", marginTop: 16 }}>✓ Eenmalig €89 &nbsp;·&nbsp; ✓ Levenslang online &nbsp;·&nbsp; ✓ Geen abonnement</p>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <HeroPhone />
          </div>
        </div>
      </section>

      {/* HOE HET WERKT */}
      <section style={{ padding: "80px 24px", background: "white" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ fontFamily: "sans-serif", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B2635", textAlign: "center", marginBottom: 10 }}>Hoe het werkt</p>
          <h2 style={{ fontFamily: "serif", fontSize: "clamp(1.8rem,3vw,2.6rem)", color: "#16161D", textAlign: "center", marginBottom: 48 }}>Van idee tot uitnodiging in een middag</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32 }}>
            {[
              { n: "01", title: "Kies je sjabloon", desc: "19 handgemaakte ontwerpen. Van aquarel tot minimalistisch — ieder met een eigen opening." },
              { n: "02", title: "Vul je gegevens in", desc: "Namen, datum, locatie en een persoonlijk bericht. Onze editor begeleidt je stap voor stap." },
              { n: "03", title: "Nodig gasten uit", desc: "Elk koppel krijgt een unieke link. Of stuur één link naar iedereen — jij kiest." },
              { n: "04", title: "Volg het in real time", desc: "Zie wie heeft geopend, wie bevestigt en wie foto's upload. Alles in je dashboard." },
            ].map(({ n, title, desc }) => (
              <div key={n}>
                <p style={{ fontFamily: "serif", fontSize: 32, color: "#f0ddd7", fontWeight: 700, marginBottom: 8 }}>{n}</p>
                <p style={{ fontFamily: "sans-serif", fontSize: 15, fontWeight: 600, color: "#16161D", marginBottom: 6 }}>{title}</p>
                <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#9a8e88", lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEMPLATES GRID */}
      <section style={{ padding: "80px 24px", background: "#faf6f3" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontFamily: "sans-serif", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B2635", textAlign: "center", marginBottom: 10 }}>Sjablonen</p>
          <h2 style={{ fontFamily: "serif", fontSize: "clamp(1.8rem,3vw,2.6rem)", color: "#16161D", textAlign: "center", marginBottom: 8 }}>19 ontwerpen, elk met eigen karakter</h2>
          <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#9a8e88", textAlign: "center", marginBottom: 40 }}>Van een aquarelroos tot fluwelen gordijnen — elk sjabloon heeft zijn eigen openingsanimatie.</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
            {templates.slice(0, 9).map(t => (
              <Link key={t.slug} href={`/templates/${t.slug}`} style={{ textDecoration: "none", display: "block" }}
                onMouseEnter={() => setHoveredTemplate(t.slug)}
                onMouseLeave={() => setHoveredTemplate(null)}>
                <div style={{ borderRadius: 16, overflow: "hidden", border: "1.5px solid", borderColor: hoveredTemplate === t.slug ? "#8B2635" : "#ece8e4", background: "white", transition: "border-color 0.2s, transform 0.2s", transform: hoveredTemplate === t.slug ? "translateY(-3px)" : "none", boxShadow: hoveredTemplate === t.slug ? "0 12px 32px rgba(139,38,53,0.12)" : "none" }}>
                  <div style={{ aspectRatio: "3/4", position: "relative", background: "#f5ede8" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgErrors[t.slug] ? `https://sponsalia.app/assets/marketing/templates/${FALLBACK_FILES[t.slug]}` : `/assets/templates/${t.slug}.jpg`}
                      alt={t.name}
                      onError={() => handleImgError(t.slug)}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  </div>
                  <div style={{ padding: "12px 14px" }}>
                    <p style={{ fontFamily: "serif", fontSize: 16, color: "#16161D", marginBottom: 2 }}>{t.name}</p>
                    <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "#9a8e88", lineHeight: 1.4 }}>{t.tagline}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Link href="/templates" style={{ display: "inline-block", background: "white", color: "#8B2635", border: "1.5px solid #8B2635", borderRadius: 999, padding: "12px 28px", fontFamily: "sans-serif", fontSize: 14, textDecoration: "none" }}>
              Alle 19 sjablonen bekijken →
            </Link>
          </div>
        </div>
      </section>

      {/* PRIJS */}
      <section style={{ padding: "80px 24px", background: "white" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontFamily: "sans-serif", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B2635", marginBottom: 10 }}>Prijs</p>
          <h2 style={{ fontFamily: "serif", fontSize: "clamp(1.8rem,3vw,2.6rem)", color: "#16161D", marginBottom: 8 }}>Eén prijs. Alles inbegrepen.</h2>
          <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#9a8e88", marginBottom: 40 }}>Geen abonnement. Geen verborgen kosten. Je betaalt één keer en de uitnodiging blijft voor altijd online.</p>
          <div style={{ background: "#fdf6f4", borderRadius: 24, border: "1px solid #f0ddd7", padding: "36px 32px" }}>
            <p style={{ fontFamily: "serif", fontSize: 56, color: "#8B2635", marginBottom: 4 }}>€89</p>
            <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#9a8e88", marginBottom: 24 }}>Eenmalig, inclusief BTW</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, textAlign: "left", marginBottom: 28 }}>
              {["Levenslang online uitnodiging", "Onbeperkt gasten uitnodigen", "RSVP-bevestigingen", "Fotoalbum voor gasten", "Gastenboek", "Programma & locatieinfo", "QR codes", "Persoonlijke ondersteuning"].map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: "#8B2635", fontSize: 14 }}>✓</span>
                  <span style={{ fontFamily: "sans-serif", fontSize: 13, color: "#5a5550" }}>{f}</span>
                </div>
              ))}
            </div>
            <Link href="/register" style={{ display: "block", background: "#8B2635", color: "white", borderRadius: 999, padding: "14px", fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, textDecoration: "none", textAlign: "center" }}>
              Gratis beginnen
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
