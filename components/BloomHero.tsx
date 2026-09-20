"use client";

/**
 * BloomHero — reconstructie van de originele Sponsalia Bloom hero
 *
 * Originele DOM structuur:
 *   <header class="hero bl-hero" id="top">
 *     <div class="bl-panel">
 *       <span class="bl-panel__ink"></span>   ← rozen inkt laag
 *       <span class="bl-panel__leaf"></span>  ← bladeren laag
 *       <div class="bl-panel__text">
 *         <span class="eyebrow" data-reveal="true"></span>
 *         <h1 class="hero__names" data-reveal="true" style="--reveal-delay: 0.45s;">
 *         <p class="hero__kicker" data-reveal="true" style="--reveal-delay: 0.90s;">
 *         <div class="hero__meta"></div>
 *       </div>
 *     </div>
 *   </header>
 *
 * Assets (692×1500 portret — zelfde verhouding als hero_ink/leaf):
 *   bl-cartoncino-body.webp  → ivoor papier achtergrond
 *   bl-cartoncino-line.webp  → papier-lijntextuur
 *   bl-hero-pieno-ink.webp   → rozen inkt (.bl-panel__ink)
 *   bl-hero-pieno-leaf.webp  → bladeren (.bl-panel__leaf)
 *   bl-wave.svg              → decoratieve golvende lijn
 *   bl-fiocco-lungo-ink.webp → lange strik overgang onderaan
 *
 * Reveal-animaties (data-reveal):
 *   eyebrow:    delay 0s
 *   names:      delay 0.45s
 *   kicker:     delay 0.90s
 *   meta:       delay 1.20s
 */

import { useEffect, useState } from "react";

const B = {
  body:        "/assets/templates/bloom/bl-cartoncino-body.webp",
  line:        "/assets/templates/bloom/bl-cartoncino-line.webp",
  hero_ink:    "/assets/templates/bloom/bl-hero-pieno-ink.webp",
  hero_leaf:   "/assets/templates/bloom/bl-hero-pieno-leaf.webp",
  wave:        "/assets/templates/bloom/bl-wave.svg",
  lungo:       "/assets/templates/bloom/bl-fiocco-lungo-ink.webp",
};

// Kleurfilter voor inkt-laag
function inkFilter(color: string): string {
  const map: Record<string, string> = {
    "#8B2635": "sepia(1) saturate(3) hue-rotate(310deg) brightness(0.9)",
    "#1a2e4a": "sepia(1) saturate(2) hue-rotate(190deg) brightness(0.7)",
    "#5a7a5a": "sepia(1) saturate(2) hue-rotate(80deg)  brightness(0.8)",
    "#b5924d": "sepia(1) saturate(2) hue-rotate(20deg)  brightness(1.0)",
    "#b07070": "sepia(1) saturate(2) hue-rotate(330deg) brightness(1.0)",
    "#4a5568": "sepia(1) saturate(1) hue-rotate(200deg) brightness(0.7)",
    "#c4713d": "sepia(1) saturate(2) hue-rotate(5deg)   brightness(0.95)",
    "#2d5016": "sepia(1) saturate(2) hue-rotate(70deg)  brightness(0.7)",
  };
  return map[color] ?? "sepia(1) saturate(3) hue-rotate(310deg) brightness(0.9)";
}

type Props = {
  namen:      string;  // "Emma & Lucas"
  datum:      string;  // "zaterdag 14 juni 2025"
  locatie?:   string;  // "Landgoed De Hooge Vuursche"
  stad?:      string;  // "Baarn"
  color?:     string;
  // Trigger reveals direct (true) of na mount (false = default)
  immediate?: boolean;
};

export default function BloomHero({
  namen,
  datum,
  locatie,
  stad,
  color = "#8B2635",
  immediate = false,
}: Props) {
  const [revealed, setRevealed] = useState(immediate);

  // Start reveals na eerste render (simuleert data-reveal gedrag)
  useEffect(() => {
    if (immediate) return;
    // Kleine timeout zodat de hero eerst inpaints, dan tekst reveal start
    const t = setTimeout(() => setRevealed(true), 80);
    return () => clearTimeout(t);
  }, [immediate]);

  const ifilter = inkFilter(color);

  // Helper: reveal-stijl per element
  const reveal = (delay: number): React.CSSProperties => ({
    opacity:   revealed ? 1 : 0,
    transform: revealed ? "translateY(0)" : "translateY(14px)",
    transition: revealed
      ? `opacity 0.65s ease ${delay}s, transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s`
      : "none",
  });

  return (
    <>
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .bl-reveal { transition: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      {/* ── header.hero.bl-hero ──────────────────────────────────────────── */}
      <header
        id="top"
        style={{
          position: "relative",
          width: "100%",
          // Originele Bloom: asset verhouding 692×1500 (portret)
          // Op mobiel: volledige breedte, hoogte volgt verhouding
          // Op desktop: max 520px breed (container)
          aspectRatio: "692 / 1500",
          overflow: "hidden",
          // Ivoor papier achtergrond als fallback
          background: "#f5ede8",
        }}
      >

        {/* div.bl-panel — bevat alle lagen */}
        <div style={{ position: "absolute", inset: 0 }}>

          {/* Laag 0: cartoncino body (ivoor papier) */}
          <img
            src={B.body}
            alt=""
            aria-hidden="true"
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />

          {/* Laag 0b: cartoncino line (papier textuur) */}
          <img
            src={B.line}
            alt=""
            aria-hidden="true"
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover",
              opacity: 0.07,
              mixBlendMode: "multiply",
              display: "block",
            }}
          />

          {/* span.bl-panel__ink — rozen inkt, kleur via filter */}
          <span
            aria-hidden="true"
            style={{
              position: "absolute", inset: 0,
              backgroundImage: `url(${B.hero_ink})`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
              filter: ifilter,
              opacity: 0.88,
              display: "block",
            }}
          />

          {/* span.bl-panel__leaf — bladeren, altijd groen */}
          <span
            aria-hidden="true"
            style={{
              position: "absolute", inset: 0,
              backgroundImage: `url(${B.hero_leaf})`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
              display: "block",
            }}
          />

          {/* div.bl-panel__text — tekst-overlay in cartouche */}
          <div
            style={{
              position: "absolute", inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 clamp(32px, 12%, 64px)",
              // Cartouche-zone zit ruwweg in het midden verticaal
              // Kleine offset naar boven (rozen zijn bovenaan dichter)
              paddingTop: "8%",
            }}
          >
            {/* span.eyebrow — delay 0s */}
            <span
              className="bl-reveal"
              style={{
                ...reveal(0),
                fontFamily: "sans-serif",
                fontSize: "clamp(7px, 1.8vw, 9px)",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "#9a8e88",
                marginBottom: "clamp(10px, 2.5%, 16px)",
                display: "block",
                textAlign: "center",
              }}
            >
              Met liefde uitgenodigd
            </span>

            {/* h1.hero__names — delay 0.45s */}
            <h1
              className="bl-reveal"
              style={{
                ...reveal(0.45),
                fontFamily: "'Cormorant Garamond', 'EB Garamond', Georgia, serif",
                fontSize: "clamp(22px, 6vw, 38px)",
                fontWeight: 400,
                color: "#16161D",
                textAlign: "center",
                lineHeight: 1.12,
                margin: 0,
                letterSpacing: "0.01em",
              }}
            >
              {namen}
            </h1>

            {/* Wave decoratie */}
            <div
              className="bl-reveal"
              style={{
                ...reveal(0.65),
                margin: "clamp(8px, 2%, 14px) 0",
                textAlign: "center",
              }}
            >
              <img
                src={B.wave}
                alt=""
                aria-hidden="true"
                style={{ width: "clamp(80px, 45%, 130px)", opacity: 0.32, display: "inline-block" }}
              />
            </div>

            {/* p.hero__kicker — delay 0.90s */}
            <p
              className="bl-reveal"
              style={{
                ...reveal(0.90),
                fontFamily: "sans-serif",
                fontSize: "clamp(9px, 2.2vw, 12px)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#6b6560",
                margin: 0,
                textAlign: "center",
              }}
            >
              Wij gaan trouwen
            </p>

            {/* div.hero__meta — datum + locatie, delay 1.20s */}
            <div
              className="bl-reveal"
              style={{
                ...reveal(1.20),
                marginTop: "clamp(10px, 2.5%, 18px)",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "clamp(3px, 1%, 5px)",
              }}
            >
              {datum && (
                <p style={{
                  fontFamily: "sans-serif",
                  fontSize: "clamp(9px, 2.2vw, 11px)",
                  color: "#5a5550",
                  margin: 0,
                  letterSpacing: "0.06em",
                }}>
                  {datum}
                </p>
              )}
              {locatie && (
                <p style={{
                  fontFamily: "sans-serif",
                  fontSize: "clamp(9px, 2vw, 11px)",
                  color: "#9a8e88",
                  margin: 0,
                  letterSpacing: "0.04em",
                }}>
                  {locatie}{stad ? `, ${stad}` : ""}
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Lange strik als overgang hero → sectie-inhoud */}
      <div
        className="bl-reveal"
        style={{
          ...reveal(1.40),
          display: "flex",
          justifyContent: "center",
          marginTop: -20,
          position: "relative",
          zIndex: 10,
        }}
      >
        <img
          src={B.lungo}
          alt=""
          aria-hidden="true"
          style={{
            height: "clamp(56px, 10vw, 80px)",
            width: "auto",
            filter: ifilter,
            opacity: 0.82,
            display: "block",
          }}
        />
      </div>
    </>
  );
}
