"use client";
import Link from "next/link";
import { useState } from "react";
import { templates } from "@/lib/templates";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const FALLBACK: Record<string, string> = {
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

const OPENING_LABELS: Record<string, string> = {
  bow: "🎀 Strik-opening",
  trifold: "📄 Trifold",
  curtain: "🎭 Gordijn",
  wave: "🌊 Golf",
  floral: "🌸 Bloem",
  fold: "✉️ Vouw",
};

export default function TemplatesPage() {
  const [filter, setFilter] = useState<string>("alle");
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const openingStyles = ["alle", ...Array.from(new Set(templates.map(t => t.openingStyle)))];

  const filtered = filter === "alle" ? templates : templates.filter(t => t.openingStyle === filter);

  return (
    <>
      <Nav />
      <div style={{ background: "#faf6f3", minHeight: "100vh", paddingTop: 60 }}>
        {/* Header */}
        <div style={{ textAlign: "center", padding: "60px 24px 40px" }}>
          <p style={{ fontFamily: "sans-serif", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B2635", marginBottom: 10 }}>Sjablonen</p>
          <h1 style={{ fontFamily: "serif", fontSize: "clamp(2rem,4vw,3rem)", color: "#16161D", marginBottom: 12 }}>19 handgemaakte ontwerpen</h1>
          <p style={{ fontFamily: "sans-serif", fontSize: 15, color: "#9a8e88", maxWidth: 500, margin: "0 auto" }}>Elk sjabloon heeft een eigen openingsanimatie, kleurpalet en sfeer. Klik op een sjabloon om de live demo te zien.</p>
        </div>

        {/* Filter op opening stijl */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", padding: "0 24px 32px" }}>
          {openingStyles.map(style => (
            <button key={style} onClick={() => setFilter(style)} style={{ padding: "8px 16px", borderRadius: 999, border: "none", background: filter === style ? "#8B2635" : "white", color: filter === style ? "white" : "#5a5550", fontFamily: "sans-serif", fontSize: 12, cursor: "pointer", border: filter === style ? "none" : "1px solid #e0dbd7" }}>
              {style === "alle" ? "Alle stijlen" : OPENING_LABELS[style] || style}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 80px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
          {filtered.map(t => (
            <Link key={t.slug} href={`/templates/${t.slug}`} style={{ textDecoration: "none", display: "block" }}>
              <div style={{ borderRadius: 18, overflow: "hidden", border: "1.5px solid #ece8e4", background: "white", transition: "transform 0.2s, box-shadow 0.2s", cursor: "pointer" }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 40px rgba(139,38,53,0.12)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "none"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}>
                <div style={{ aspectRatio: "3/4", position: "relative", background: "#f5ede8" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgErrors[t.slug] ? `https://sponsalia.app/assets/marketing/templates/${FALLBACK[t.slug]}` : `/assets/templates/${t.slug}.jpg`}
                    alt={t.name}
                    onError={() => setImgErrors(prev => ({ ...prev, [t.slug]: true }))}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(255,255,255,0.92)", borderRadius: 999, padding: "4px 10px" }}>
                    <span style={{ fontFamily: "sans-serif", fontSize: 10, color: "#5a5550" }}>{OPENING_LABELS[t.openingStyle]}</span>
                  </div>
                </div>
                <div style={{ padding: "14px 16px 16px" }}>
                  <p style={{ fontFamily: "serif", fontSize: 18, color: "#16161D", marginBottom: 3 }}>{t.name}</p>
                  <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "#9a8e88", lineHeight: 1.45, marginBottom: 10 }}>{t.tagline}</p>
                  <span style={{ fontFamily: "sans-serif", fontSize: 12, color: "#8B2635", fontWeight: 600 }}>Bekijken →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
