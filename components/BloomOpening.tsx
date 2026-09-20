"use client";

/**
 * BloomOpening — gelaagde interactieve Bloom uitnodiging
 *
 * Fases:
 *  idle    → gesloten envelop met lange strik + korte knoop + duif
 *  ribbon  → strik trilt en schuift omhoog (lint + knoop apart)
 *  flap    → envelop flap klapt open (CSS perspective)
 *  lift    → kaart komt omhoog uit envelop
 *  reveal  → rozen-lagen faden in op kaart
 *  done    → onComplete() → uitnodiging
 *
 * Assets gebruikt als losse lagen (niet als platte poster):
 *  avorio_rosa-poster.jpg   → envelop body/achtergrond
 *  bl-fiocco-lungo-ink.webp → lang verticaal lint
 *  bl-fiocco-ink.webp       → korte strikknoop
 *  bl-colomba-ink.webp      → duif rechtsboven
 *  bl-cartoncino-body.webp  → kaart ivoor achtergrond
 *  bl-cartoncino-line.webp  → kaart lijntextuur overlay
 *  bl-hero-pieno-leaf.webp  → rozen bladeren (groen, altijd)
 *  bl-hero-pieno-ink.webp   → rozen inkt (kleur volgt primary_color)
 *  bl-wave.svg              → decoratieve lijn onder namen
 */

import { useState, useEffect, useRef } from "react";

const A = {
  poster:       "/assets/templates/bloom/avorio_rosa-poster.jpg",
  lungo:        "/assets/templates/bloom/bl-fiocco-lungo-ink.webp",
  fiocco:       "/assets/templates/bloom/bl-fiocco-ink.webp",
  colomba:      "/assets/templates/bloom/bl-colomba-ink.webp",
  body:         "/assets/templates/bloom/bl-cartoncino-body.webp",
  line:         "/assets/templates/bloom/bl-cartoncino-line.webp",
  hero_leaf:    "/assets/templates/bloom/bl-hero-pieno-leaf.webp",
  hero_ink:     "/assets/templates/bloom/bl-hero-pieno-ink.webp",
  fascia:       "/assets/templates/bloom/bl-fascia-righe-ink.webp",
  cornice_leaf: "/assets/templates/bloom/bl-data-cornice-leaf.webp",
  cornice_ink:  "/assets/templates/bloom/bl-data-cornice-ink.webp",
  wave:         "/assets/templates/bloom/bl-wave.svg",
};

type Phase = "idle" | "ribbon" | "flap" | "lift" | "reveal" | "done";

export type BloomOpeningProps = {
  namen:      string;
  datumLang:  string;
  color?:     string;
  onComplete: () => void;
};

export default function BloomOpening({
  namen,
  datumLang,
  color = "#8B2635",
  onComplete,
}: BloomOpeningProps) {
  const [phase,         setPhase]         = useState<Phase>("idle");
  const [reducedMotion, setReducedMotion] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const after = (ms: number, fn: () => void) => {
    const t = setTimeout(fn, reducedMotion ? 0 : ms);
    timers.current.push(t);
  };

  const handleTap = () => {
    if (phase !== "idle") return;
    if (reducedMotion) { onComplete(); return; }

    setPhase("ribbon");
    after(650,  () => setPhase("flap"));
    after(1250, () => setPhase("lift"));
    after(2000, () => setPhase("reveal"));
    after(2900, () => { setPhase("done"); after(500, onComplete); });
  };

  // ── kleurfilter voor inkt-assets ─────────────────────────────────────────
  // Bladeren blijven altijd groen — alleen inkt-lagen krijgen kleur
  const inkFilter = (() => {
    // bordeaux/rood = 300-310 hue-rotate
    // andere kleuren: benaderen via hue-rotate
    const hueMap: Record<string, string> = {
      "#8B2635": "sepia(1) saturate(3) hue-rotate(310deg) brightness(0.9)",
      "#1a2e4a": "sepia(1) saturate(2) hue-rotate(190deg) brightness(0.7)",
      "#5a7a5a": "sepia(1) saturate(2) hue-rotate(80deg)  brightness(0.8)",
      "#b5924d": "sepia(1) saturate(2) hue-rotate(20deg)  brightness(1.0)",
      "#b07070": "sepia(1) saturate(2) hue-rotate(330deg) brightness(1.0)",
      "#4a5568": "sepia(1) saturate(1) hue-rotate(200deg) brightness(0.7)",
      "#c4713d": "sepia(1) saturate(2) hue-rotate(5deg)   brightness(0.95)",
      "#2d5016": "sepia(1) saturate(2) hue-rotate(70deg)  brightness(0.7)",
    };
    return hueMap[color] ?? "sepia(1) saturate(3) hue-rotate(310deg) brightness(0.9)";
  })();

  // ── transition helpers ────────────────────────────────────────────────────
  const t = (prop: string, dur: string, ease = "ease", delay = "0s") =>
    `${prop} ${dur} ${ease} ${delay}`;

  // ── is envelop open genoeg om kaart te tonen? ────────────────────────────
  const envelopOpen  = phase === "flap" || phase === "lift" || phase === "reveal" || phase === "done";
  const kaartZichtbaar = phase === "lift" || phase === "reveal" || phase === "done";
  const rozenZichtbaar = phase === "reveal" || phase === "done";

  return (
    <div
      onClick={handleTap}
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 20px 48px",
        background: "linear-gradient(175deg, #fdf6f4 0%, #f5e8e0 55%, #edddd5 100%)",
        cursor: phase === "idle" ? "pointer" : "default",
        userSelect: "none",
        WebkitUserSelect: "none",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @keyframes bloomFadeUp   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bloomPulse    { 0%,100%{opacity:0.4} 50%{opacity:0.9} }
        @keyframes colombaFloat  { 0%,100%{transform:translateY(0) rotate(-4deg)} 50%{transform:translateY(-7px) rotate(4deg)} }
        @keyframes shimmer       { 0%{opacity:0.06} 50%{opacity:0.13} 100%{opacity:0.06} }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration:0.01ms !important; transition-duration:0.01ms !important; }
        }
      `}</style>

      {/* ═══════════════════════════════════════════════════════════════════
          HOOFD-CONTAINER  (breedte mobiel-first)
      ═══════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "relative",
          width: "min(340px, 90vw)",
          // hoogte volgt de envelop-poster verhouding: 608x1080 ≈ 9:16
          aspectRatio: "608 / 1080",
          animation: "bloomFadeUp 0.9s ease both",
        }}
      >

        {/* ── LAAG 1: ENVELOP BODY (poster) ───────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 18,
            overflow: "hidden",
            boxShadow: "0 28px 72px rgba(0,0,0,0.22), 0 6px 20px rgba(0,0,0,0.10)",
          }}
        >
          <img
            src={A.poster}
            alt=""
            style={{
              width: "100%", height: "100%",
              objectFit: "cover",
              display: "block",
              // subtiele dimming tijdens opening
              filter: envelopOpen ? "brightness(0.92)" : "brightness(1)",
              transition: t("filter", "0.5s"),
            }}
          />
        </div>

        {/* ── LAAG 2: ENVELOP FLAP (driehoek die openklapt) ───────────────── */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: "44%",
            // Driehoekige flap via clip-path
            clipPath: "polygon(0 0, 100% 0, 50% 95%)",
            background: "linear-gradient(160deg, #f5ede8 0%, #e8d5c9 60%, #ddc5b5 100%)",
            transformOrigin: "top center",
            transform: envelopOpen ? "perspective(600px) rotateX(-165deg)" : "perspective(600px) rotateX(0deg)",
            transition: t("transform", "0.65s", "cubic-bezier(0.4,0,0.2,1)"),
            zIndex: 4,
            // Subtiele naad
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            borderRadius: "18px 18px 0 0",
          }}
        />

        {/* ── LAAG 3: KAART (komt uit envelop omhoog) ─────────────────────── */}
        <div
          style={{
            position: "absolute",
            bottom: "5%",
            left: "7%",
            right: "7%",
            // kaart hoogte groeit terwijl hij omhoog komt
            height: kaartZichtbaar ? (rozenZichtbaar ? "88%" : "65%") : "28%",
            borderRadius: "10px 10px 8px 8px",
            overflow: "hidden",
            transform: kaartZichtbaar ? "translateY(0%)" : "translateY(42%)",
            opacity: envelopOpen ? 1 : 0,
            transition: [
              t("height",    "0.75s", "cubic-bezier(0.34,1.1,0.64,1)"),
              t("transform", "0.75s", "cubic-bezier(0.34,1.1,0.64,1)"),
              t("opacity",   "0.3s"),
            ].join(", "),
            zIndex: 3,
            boxShadow: "0 -6px 28px rgba(0,0,0,0.14)",
          }}
        >
          {/* Kaart ivoor achtergrond */}
          <img
            src={A.body}
            alt=""
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover",
            }}
          />
          {/* Kaart lijntextuur */}
          <img
            src={A.line}
            alt=""
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover",
              opacity: 0.08,
              mixBlendMode: "multiply",
            }}
          />

          {/* Rozen bladeren (altijd groen) */}
          <img
            src={A.hero_leaf}
            alt=""
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover",
              objectPosition: "top center",
              opacity: rozenZichtbaar ? 1 : 0,
              transition: t("opacity", "0.9s", "ease", "0.15s"),
            }}
          />

          {/* Rozen inkt (volgt kleur) */}
          <img
            src={A.hero_ink}
            alt=""
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover",
              objectPosition: "top center",
              filter: inkFilter,
              opacity: rozenZichtbaar ? 0.88 : 0,
              transition: t("opacity", "1s", "ease", "0.3s"),
            }}
          />

          {/* Namen + datum op kaart */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 20px",
              // Zichtbaar zodra rozen verschijnen
              opacity: rozenZichtbaar ? 1 : 0,
              transition: t("opacity", "0.7s", "ease", "0.5s"),
            }}
          >
            <p style={{
              fontFamily: "sans-serif",
              fontSize: 8,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: color,
              marginBottom: 6,
              opacity: 0.85,
            }}>
              Met liefde uitgenodigd
            </p>
            <p style={{
              fontFamily: "serif",
              fontSize: "clamp(16px, 4.5vw, 24px)",
              color: "#16161D",
              textAlign: "center",
              lineHeight: 1.2,
              margin: 0,
            }}>
              {namen}
            </p>
            <img
              src={A.wave}
              alt=""
              style={{
                width: "55%",
                margin: "8px auto 6px",
                display: "block",
                opacity: 0.35,
              }}
            />
            {datumLang && (
              <p style={{
                fontFamily: "sans-serif",
                fontSize: 9,
                color: "#5a5550",
                textAlign: "center",
                letterSpacing: "0.06em",
              }}>
                {datumLang}
              </p>
            )}
          </div>
        </div>

        {/* ── LAAG 4: LANG LINT (fiocco-lungo) — verticaal over envelop ───── */}
        <div
          style={{
            position: "absolute",
            // Langs de verticale as van de envelop
            top: "18%",
            bottom: "12%",
            left: "50%",
            transform: (() => {
              // idle: gewoon verticaal
              if (phase === "idle") return "translateX(-50%) scaleY(1) rotate(0deg)";
              // ribbon: strik trilt en gaat schuin
              if (phase === "ribbon") return "translateX(-60%) scaleY(1.05) rotate(-6deg)";
              // daarna: weg
              return "translateX(-50%) scaleY(0.3) translateY(-80%) rotate(-15deg)";
            })(),
            opacity: phase === "idle" ? 1 : phase === "ribbon" ? 0.6 : 0,
            transition: phase === "idle"
              ? "none"
              : [
                  t("transform", "0.6s", "cubic-bezier(0.34,1.56,0.64,1)"),
                  t("opacity",   "0.5s"),
                ].join(", "),
            zIndex: 8,
            width: "10%",
            pointerEvents: "none",
          }}
        >
          <img
            src={A.lungo}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              filter: inkFilter,
              display: "block",
            }}
          />
        </div>

        {/* ── LAAG 5: KORTE STRIK-KNOOP — over het lint, midden ────────────── */}
        <div
          style={{
            position: "absolute",
            // Iets boven het midden van de envelop
            top: "36%",
            left: "50%",
            width: "38%",
            transform: (() => {
              if (phase === "idle")   return "translateX(-50%) rotate(0deg) scale(1)";
              if (phase === "ribbon") return "translateX(-55%) rotate(-10deg) scale(1.12) translateY(-6px)";
              return                         "translateX(-50%) rotate(-18deg) scale(0.4) translateY(-90px)";
            })(),
            opacity: phase === "idle" ? 1 : phase === "ribbon" ? 0.5 : 0,
            transition: phase === "idle"
              ? "none"
              : [
                  t("transform", "0.6s", "cubic-bezier(0.34,1.56,0.64,1)"),
                  t("opacity",   "0.5s"),
                ].join(", "),
            zIndex: 9,
            pointerEvents: "none",
          }}
        >
          <img
            src={A.fiocco}
            alt="strik"
            style={{ width: "100%", display: "block", filter: inkFilter }}
          />
        </div>

        {/* ── LAAG 6: DUIF — rechtsboven, zweeft subtiel ───────────────────── */}
        <div
          style={{
            position: "absolute",
            top: "8%",
            right: "9%",
            width: "16%",
            animation: "colombaFloat 3.5s ease-in-out infinite",
            opacity: phase === "idle" ? 0.28 : 0,
            transition: t("opacity", "0.4s"),
            zIndex: 7,
            pointerEvents: "none",
          }}
        >
          <img
            src={A.colomba}
            alt=""
            style={{ width: "100%", display: "block", filter: inkFilter }}
          />
        </div>

        {/* ── NAMEN op envelop (zichtbaar vóór opening) ───────────────────── */}
        <div
          style={{
            position: "absolute",
            bottom: "16%",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            width: "75%",
            zIndex: 6,
            opacity: envelopOpen ? 0 : 1,
            transition: t("opacity", "0.3s"),
            pointerEvents: "none",
          }}
        >
          <p style={{
            fontFamily: "serif",
            fontSize: "clamp(14px, 3.8vw, 20px)",
            color: color,
            lineHeight: 1.2,
            margin: 0,
            textShadow: "0 1px 6px rgba(255,255,255,0.7)",
          }}>
            {namen}
          </p>
          {datumLang && (
            <p style={{
              fontFamily: "sans-serif",
              fontSize: 10,
              color: "#6b6560",
              marginTop: 4,
              letterSpacing: "0.04em",
            }}>
              {datumLang}
            </p>
          )}
        </div>

      </div>{/* einde hoofd-container */}

      {/* ── "TIK OM TE OPENEN" ───────────────────────────────────────────── */}
      <p
        style={{
          fontFamily: "sans-serif",
          fontSize: 10,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: color,
          marginTop: 24,
          opacity: phase === "idle" ? 1 : 0,
          transition: t("opacity", "0.3s"),
          animation: "bloomPulse 2.4s ease-in-out infinite",
          pointerEvents: "none",
        }}
      >
        Tik om te openen
      </p>
    </div>
  );
}
