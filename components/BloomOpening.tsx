"use client";

import { useState, useEffect, useRef } from "react";

const BLOOM = {
  body: "/assets/templates/bloom/bl-cartoncino-body.webp",
  cornice_ink: "/assets/templates/bloom/bl-data-cornice-ink.webp",
  cornice_leaf: "/assets/templates/bloom/bl-data-cornice-leaf.webp",
  fascia: "/assets/templates/bloom/bl-fascia-righe-ink.webp",
  fiocco: "/assets/templates/bloom/bl-fiocco-ink.webp",
  fiocco_lungo: "/assets/templates/bloom/bl-fiocco-lungo-ink.webp",
  colomba: "/assets/templates/bloom/bl-colomba-ink.webp",
  hero_ink: "/assets/templates/bloom/bl-hero-pieno-ink.webp",
  hero_leaf: "/assets/templates/bloom/bl-hero-pieno-leaf.webp",
  wave: "/assets/templates/bloom/bl-wave.svg",
  poster: "/assets/templates/bloom/avorio_rosa-poster.jpg",
  line: "/assets/templates/bloom/bl-cartoncino-line.webp",
};

type Phase =
  | "idle"        // gesloten envelop
  | "ribbon"      // strik lost los
  | "lift"        // kaart tilt omhoog
  | "reveal"      // kaart schuift uit envelop
  | "done";       // volledig open

type Props = {
  namen: string;
  datumLang: string;
  color?: string;
  onComplete: () => void;
};

export default function BloomOpening({ namen, datumLang, color = "#8B2635", onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [reducedMotion, setReducedMotion] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const schedule = (fn: () => void, ms: number) => {
    timerRef.current = setTimeout(fn, reducedMotion ? 0 : ms);
  };

  const handleTap = () => {
    if (phase !== "idle") return;

    if (reducedMotion) {
      onComplete();
      return;
    }

    setPhase("ribbon");
    schedule(() => setPhase("lift"), 700);
    schedule(() => setPhase("reveal"), 1400);
    schedule(() => { setPhase("done"); schedule(onComplete, 600); }, 2200);
  };

  // Strik animatie waarden per fase
  const ribbonStyle = (): React.CSSProperties => {
    if (phase === "idle") return {
      transform: "translateY(0) rotate(0deg) scale(1)",
      opacity: 1,
      transition: "none",
    };
    if (phase === "ribbon") return {
      transform: "translateY(-18px) rotate(-8deg) scale(1.08)",
      opacity: 0.7,
      transition: "transform 0.6s cubic-bezier(0.34,1.56,0.64,1), opacity 0.5s ease",
    };
    return {
      transform: "translateY(-60px) rotate(-15deg) scale(0.6)",
      opacity: 0,
      transition: "transform 0.5s ease-in, opacity 0.4s ease",
    };
  };

  // Kaart animatie waarden per fase
  const cardStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: "absolute",
      bottom: 0,
      left: "8%",
      right: "8%",
      background: "white",
      borderRadius: "12px 12px 0 0",
      overflow: "hidden",
      transformOrigin: "bottom center",
      boxShadow: "0 -4px 24px rgba(0,0,0,0.12)",
    };
    if (phase === "idle") return {
      ...base,
      height: "30%",
      transform: "translateY(60%)",
      opacity: 0,
      transition: "none",
    };
    if (phase === "ribbon") return {
      ...base,
      height: "30%",
      transform: "translateY(55%)",
      opacity: 0.4,
      transition: "transform 0.5s ease, opacity 0.4s ease",
    };
    if (phase === "lift") return {
      ...base,
      height: "55%",
      transform: "translateY(20%)",
      opacity: 1,
      transition: "transform 0.7s cubic-bezier(0.34,1.2,0.64,1), height 0.7s ease, opacity 0.3s ease",
    };
    if (phase === "reveal") return {
      ...base,
      height: "80%",
      transform: "translateY(0%)",
      opacity: 1,
      transition: "transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94), height 0.7s ease",
    };
    // done
    return {
      ...base,
      height: "90%",
      transform: "translateY(0%)",
      opacity: 1,
      transition: "height 0.4s ease",
    };
  };

  // Envelop flap animatie
  const flapStyle = (): React.CSSProperties => ({
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    background: `linear-gradient(160deg, #f5ede8 0%, #edddd5 100%)`,
    transformOrigin: "top center",
    transform: phase === "lift" || phase === "reveal" || phase === "done"
      ? "rotateX(-160deg)"
      : "rotateX(0deg)",
    transition: "transform 0.6s ease",
    zIndex: 3,
    borderBottom: "1px solid #e0cbc3",
    // Driehoek effect
    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
  });

  return (
    <div
      onClick={handleTap}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: phase === "idle" ? "pointer" : "default",
        padding: "24px 24px 40px",
        background: "linear-gradient(180deg, #f9f0eb 0%, #f5e8e0 100%)",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      <style>{`
        @keyframes bloomFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bloomPulse {
          0%, 100% { opacity: 0.45; }
          50%       { opacity: 0.85; }
        }
        @keyframes colombaFloat {
          0%, 100% { transform: translateY(0px) rotate(-3deg); }
          50%       { transform: translateY(-6px) rotate(3deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      {/* Container: envelop + kaart */}
      <div
        style={{
          position: "relative",
          width: "min(340px, 88vw)",
          aspectRatio: "3/4",
          animation: phase === "idle" ? "bloomFadeUp 0.9s ease both" : "none",
        }}
      >
        {/* ENVELOP ACHTERGROND */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 32px 80px rgba(0,0,0,0.20), 0 8px 24px rgba(0,0,0,0.10)",
          }}
        >
          {/* Envelop body: de poster */}
          <img
            src={BLOOM.poster}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />

          {/* Flap die openklapt */}
          <div style={{ perspective: 600, position: "absolute", inset: 0 }}>
            <div style={flapStyle()} />
          </div>
        </div>

        {/* STRIK — zweeft bovenop de envelop */}
        <div
          style={{
            position: "absolute",
            top: "24%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "55%",
            zIndex: 10,
            ...ribbonStyle(),
            // override transform van ribbonStyle zodat translateX(-50%) behouden blijft
            transform: `translateX(-50%) ${
              phase === "idle" ? "translateY(0) rotate(0deg) scale(1)"
              : phase === "ribbon" ? "translateY(-18px) rotate(-8deg) scale(1.08)"
              : "translateY(-60px) rotate(-15deg) scale(0.6)"
            }`,
          }}
        >
          <img
            src={BLOOM.fiocco}
            alt="strik"
            style={{
              width: "100%",
              display: "block",
              filter: `sepia(1) saturate(2.5) hue-rotate(320deg) brightness(1.05)`,
              transition: "opacity 0.4s ease",
              opacity: phase === "idle" ? 1 : phase === "ribbon" ? 0.7 : 0,
            }}
          />
        </div>

        {/* NAMEN op envelop */}
        {(phase === "idle" || phase === "ribbon") && (
          <div
            style={{
              position: "absolute",
              bottom: "20%",
              left: "50%",
              transform: "translateX(-50%)",
              textAlign: "center",
              width: "80%",
              zIndex: 8,
              transition: "opacity 0.3s ease",
              opacity: phase === "ribbon" ? 0.4 : 1,
            }}
          >
            <p style={{
              fontFamily: "serif",
              fontSize: "clamp(16px, 4vw, 22px)",
              color: color,
              lineHeight: 1.2,
              margin: 0,
              textShadow: "0 1px 4px rgba(255,255,255,0.6)",
            }}>
              {namen}
            </p>
            {datumLang && (
              <p style={{
                fontFamily: "sans-serif",
                fontSize: 11,
                color: "#6b6560",
                marginTop: 5,
                letterSpacing: "0.04em",
              }}>
                {datumLang}
              </p>
            )}
          </div>
        )}

        {/* KAART die uit envelop komt */}
        <div style={cardStyle()}>
          {/* Kaart inhoud: hero layers */}
          <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
            {/* Aquarel body */}
            <img src={BLOOM.body} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            {/* Bladeren laag */}
            <img
              src={BLOOM.hero_leaf}
              alt=""
              style={{
                position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
                opacity: phase === "reveal" || phase === "done" ? 1 : 0,
                transition: "opacity 0.8s ease 0.2s",
              }}
            />
            {/* Inkt/rozen laag */}
            <img
              src={BLOOM.hero_ink}
              alt=""
              style={{
                position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
                filter: `sepia(1) saturate(3) hue-rotate(310deg)`,
                opacity: phase === "reveal" || phase === "done" ? 0.85 : 0,
                transition: "opacity 0.9s ease 0.4s",
              }}
            />
            {/* Namen in kaart */}
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              padding: "0 32px",
              opacity: phase === "reveal" || phase === "done" ? 1 : 0,
              transition: "opacity 0.6s ease 0.6s",
            }}>
              <p style={{ fontFamily: "sans-serif", fontSize: 8, letterSpacing: "0.28em", textTransform: "uppercase", color: color, marginBottom: 8, opacity: 0.85 }}>
                Met liefde uitgenodigd
              </p>
              <p style={{ fontFamily: "serif", fontSize: "clamp(18px, 4.5vw, 26px)", color: "#16161D", textAlign: "center", lineHeight: 1.2, margin: 0 }}>
                {namen}
              </p>
              <img src={BLOOM.wave} alt="" style={{ width: 90, margin: "8px auto 6px", opacity: 0.35, display: "block" }} />
              {datumLang && (
                <p style={{ fontFamily: "sans-serif", fontSize: 10, color: "#5a5550", textAlign: "center", letterSpacing: "0.06em" }}>
                  {datumLang}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Duif: zweeft subtiel boven de envelop */}
        {phase === "idle" && (
          <img
            src={BLOOM.colomba}
            alt=""
            style={{
              position: "absolute",
              top: -28,
              right: "12%",
              width: 36,
              opacity: 0.22,
              filter: `sepia(1) saturate(2) hue-rotate(310deg)`,
              animation: "colombaFloat 3s ease-in-out infinite",
            }}
          />
        )}
      </div>

      {/* "Tik om te openen" label */}
      {phase === "idle" && (
        <p
          style={{
            fontFamily: "sans-serif",
            fontSize: 10,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: color,
            marginTop: 28,
            animation: "bloomPulse 2.2s ease-in-out infinite",
          }}
        >
          Tik om te openen
        </p>
      )}
    </div>
  );
}
