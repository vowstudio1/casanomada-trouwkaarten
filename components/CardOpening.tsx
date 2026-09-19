"use client";

import { useState, useEffect, useRef } from "react";

type Props = {
  templateSlug: string;
  templateImg: string;
  partner1?: string;
  partner2?: string;
  datum?: string;
  locatie?: string;
  onComplete?: () => void;
  autoPlay?: boolean;
};

// Elke sjabloon heeft een eigen opening-animatie stijl
const OPENING_STYLES: Record<string, { type: string; color: string; accent: string }> = {
  "bloom":               { type: "bow",      color: "#f9e8ee", accent: "#d4839a" },
  "volta-celeste":       { type: "trifold",  color: "#eef2f8", accent: "#8fa8c8" },
  "zomertuin":           { type: "floral",   color: "#eef4ec", accent: "#7aad6a" },
  "villa-aurora":        { type: "curtain",  color: "#fdf3e8", accent: "#d4a056" },
  "het-zwanenmeer":      { type: "wave",     color: "#eef4f9", accent: "#6a9fc0" },
  "villa-cortina":       { type: "curtain",  color: "#f5eef8", accent: "#9b7ab5" },
  "minimale-couture":    { type: "fold",     color: "#f8f8f6", accent: "#333333" },
  "betoverd-bos":        { type: "floral",   color: "#edf4ee", accent: "#5a8c5a" },
  "riviera-70":          { type: "wave",     color: "#fff8ec", accent: "#e8a040" },
  "italiaanse-aquarel":  { type: "floral",   color: "#eef6f8", accent: "#5aaac0" },
  "oro-antico":          { type: "fold",     color: "#faf4e8", accent: "#c8a832" },
  "tuscany-chic":        { type: "curtain",  color: "#f8f0e8", accent: "#c87840" },
  "gouden-uur":          { type: "fold",     color: "#fdf6e8", accent: "#d4a028" },
  "de-geheime-tuin":     { type: "floral",   color: "#eef6ee", accent: "#7aad6a" },
  "tratto-d-inchiostro": { type: "fold",     color: "#f8f6f2", accent: "#4a4a3a" },
  "idillio":             { type: "bow",      color: "#fdf8ec", accent: "#c8a832" },
  "romantisch-botanisch":{ type: "floral",   color: "#eef4ec", accent: "#7aad6a" },
  "strawberry-matcha":   { type: "wave",     color: "#eef6ee", accent: "#7aad6a" },
  "toile-de-jouy":       { type: "fold",     color: "#eef4f8", accent: "#5a7ab5" },
};

export default function CardOpening({ templateSlug, templateImg, partner1, partner2, datum, locatie, onComplete, autoPlay = false }: Props) {
  const [phase, setPhase] = useState<"idle" | "animating" | "open">("idle");
  const style = OPENING_STYLES[templateSlug] || { type: "fold", color: "#f9f5f1", accent: "#8B2635" };
  const namen = partner1 && partner2 ? `${partner1} & ${partner2}` : "Laura & Marco";
  const datumStr = datum ? new Date(datum).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" }) : "19 · 06 · 2027";
  const locatieStr = locatie || "Lake Como · Italy";

  useEffect(() => {
    if (autoPlay) {
      const t = setTimeout(() => startAnimation(), 800);
      return () => clearTimeout(t);
    }
  }, [autoPlay]);

  const startAnimation = () => {
    if (phase !== "idle") return;
    setPhase("animating");
    setTimeout(() => {
      setPhase("open");
      onComplete?.();
    }, 1400);
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", cursor: phase === "idle" ? "pointer" : "default" }} onClick={startAnimation}>
      <style>{`
        /* BOW — strik gaat los */
        @keyframes bowLoose { 0%{transform:scale(1) rotate(0deg)} 30%{transform:scale(1.1) rotate(-8deg)} 60%{transform:scale(0.9) rotate(5deg) translateY(-10%)} 100%{transform:scale(0) translateY(-120%) rotate(20deg);opacity:0} }
        @keyframes ribbonLeft { 0%{transform:scaleX(1)} 100%{transform:scaleX(0) translateX(-50%);opacity:0} }
        @keyframes ribbonRight { 0%{transform:scaleX(1)} 100%{transform:scaleX(0) translateX(50%);opacity:0} }
        @keyframes cardOpen { 0%{transform:perspective(600px) rotateX(0deg)} 40%{transform:perspective(600px) rotateX(-15deg)} 100%{transform:perspective(600px) rotateX(0deg)} }

        /* TRIFOLD — kaart vouwt open in drieën */
        @keyframes foldLeft { 0%{transform:perspective(400px) rotateY(0deg)} 100%{transform:perspective(400px) rotateY(-180deg);opacity:0} }
        @keyframes foldRight { 0%{transform:perspective(400px) rotateY(0deg)} 100%{transform:perspective(400px) rotateY(180deg);opacity:0} }

        /* CURTAIN — gordijnen schuiven open */
        @keyframes curtainLeft { 0%{transform:translateX(0)} 100%{transform:translateX(-100%)} }
        @keyframes curtainRight { 0%{transform:translateX(0)} 100%{transform:translateX(100%)} }

        /* WAVE — golf effect */
        @keyframes waveOut { 0%{transform:scale(1);opacity:1} 50%{transform:scale(1.05)} 100%{transform:scale(2);opacity:0} }

        /* FLORAL — bloemen openen */
        @keyframes petalSpin { 0%{transform:scale(1) rotate(0deg);opacity:1} 100%{transform:scale(0) rotate(180deg);opacity:0} }

        /* FOLD — gevouwen kaart opent */
        @keyframes foldOpen { 0%{transform:scaleY(0.1);opacity:0.5} 100%{transform:scaleY(1);opacity:1} }

        /* Content verschijnt */
        @keyframes contentAppear { 0%{opacity:0;transform:translateY(12px)} 100%{opacity:1;transform:translateY(0)} }

        .cn-bow-animating .cn-bow { animation: bowLoose 0.8s cubic-bezier(.4,0,.2,1) forwards; }
        .cn-bow-animating .cn-ribbon-h { animation: ribbonLeft 0.6s 0.3s ease forwards; }
        .cn-bow-animating .cn-ribbon-v { animation: ribbonRight 0.6s 0.3s ease forwards; }

        .cn-trifold-animating .cn-fold-l { animation: foldLeft 0.7s ease forwards; transform-origin: left center; }
        .cn-trifold-animating .cn-fold-r { animation: foldRight 0.7s 0.1s ease forwards; transform-origin: right center; }

        .cn-curtain-animating .cn-curtain-l { animation: curtainLeft 0.8s cubic-bezier(.4,0,.2,1) forwards; }
        .cn-curtain-animating .cn-curtain-r { animation: curtainRight 0.8s cubic-bezier(.4,0,.2,1) forwards; }

        .cn-wave-animating .cn-wave { animation: waveOut 0.8s ease forwards; }

        .cn-floral-animating .cn-petal { animation: petalSpin 0.6s ease forwards; }
        .cn-floral-animating .cn-petal:nth-child(2) { animation-delay: 0.08s; }
        .cn-floral-animating .cn-petal:nth-child(3) { animation-delay: 0.16s; }
        .cn-floral-animating .cn-petal:nth-child(4) { animation-delay: 0.24s; }

        .cn-fold-animating .cn-fold-cover { animation: foldLeft 0.9s ease forwards; transform-origin: left center; }

        .cn-content-appear { animation: contentAppear 0.6s 0.2s ease both; }
      `}</style>

      {/* ── OPEN: uitnodiging zichtbaar ── */}
      {phase === "open" && (
        <div className="cn-content-appear" style={{ width: "100%", height: "100%", overflow: "hidden auto" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={templateImg} alt="Uitnodiging" style={{ width: "100%", display: "block" }} />
        </div>
      )}

      {/* ── BOW animatie (Bloom, Idillio) ── */}
      {style.type === "bow" && phase !== "open" && (
        <div className={`cn-bow-wrapper${phase === "animating" ? " cn-bow-animating" : ""}`}
          style={{ position: "absolute", inset: 0, background: style.color, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          {/* Lint verticaal */}
          <div className="cn-ribbon-v" style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: 2, background: style.accent, transform: "translateX(-50%)", opacity: 0.6 }} />
          {/* Lint horizontaal */}
          <div className="cn-ribbon-h" style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 2, background: style.accent, transform: "translateY(-50%)", opacity: 0.6 }} />
          {/* Strik */}
          <div className="cn-bow" style={{ position: "relative", zIndex: 5, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            {/* Strik lussen */}
            <div style={{ display: "flex", gap: 4 }}>
              {[0, 1].map(i => (
                <div key={i} style={{ width: 28, height: 18, background: style.accent, borderRadius: "50% 50% 0 0", transform: i === 0 ? "rotate(-20deg)" : "rotate(20deg)", opacity: 0.85 }} />
              ))}
            </div>
            {/* Knoop */}
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: style.accent }} />
            {/* Uiteinden */}
            <div style={{ display: "flex", gap: 8 }}>
              {[0, 1].map(i => (
                <div key={i} style={{ width: 8, height: 14, background: style.accent, borderRadius: "0 0 4px 4px", transform: i === 0 ? "rotate(-10deg)" : "rotate(10deg)", opacity: 0.7 }} />
              ))}
            </div>
          </div>
          {/* Namen op de kaart */}
          <div style={{ position: "absolute", bottom: "30%", textAlign: "center" as const }}>
            <p style={{ fontFamily: "serif", fontSize: "clamp(11px, 2vw, 14px)", color: "#9a8e88", fontStyle: "italic", margin: 0 }}>{namen}</p>
          </div>
          {phase === "idle" && (
            <p style={{ position: "absolute", bottom: "12%", fontFamily: "sans-serif", fontSize: "clamp(7px,1.2vw,9px)", letterSpacing: "0.22em", textTransform: "uppercase" as const, color: style.accent, opacity: 0.7 }}>Tik om te openen</p>
          )}
        </div>
      )}

      {/* ── TRIFOLD animatie (Volta Celeste) ── */}
      {style.type === "trifold" && phase !== "open" && (
        <div className={`cn-trifold-wrapper${phase === "animating" ? " cn-trifold-animating" : ""}`}
          style={{ position: "absolute", inset: 0, background: style.color, display: "flex" }}>
          {/* Linker flap */}
          <div className="cn-fold-l" style={{ flex: 1, background: `linear-gradient(180deg, ${style.color} 0%, ${style.accent}20 100%)`, borderRight: `1px solid ${style.accent}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 2, height: "60%", background: style.accent, opacity: 0.3 }} />
          </div>
          {/* Midden */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", gap: 8 }}>
            <p style={{ fontFamily: "serif", fontSize: "clamp(10px, 1.8vw, 13px)", color: "#5a5550", fontStyle: "italic", textAlign: "center" as const, padding: "0 4px" }}>{namen}</p>
            <p style={{ fontFamily: "sans-serif", fontSize: "clamp(7px, 1.1vw, 9px)", color: style.accent, letterSpacing: "0.1em" }}>{datumStr}</p>
            {phase === "idle" && <p style={{ fontFamily: "sans-serif", fontSize: "clamp(6px,1vw,8px)", letterSpacing: "0.2em", textTransform: "uppercase" as const, color: style.accent, opacity: 0.6, marginTop: 8 }}>Tik om te openen</p>}
          </div>
          {/* Rechter flap */}
          <div className="cn-fold-r" style={{ flex: 1, background: `linear-gradient(180deg, ${style.color} 0%, ${style.accent}20 100%)`, borderLeft: `1px solid ${style.accent}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 2, height: "60%", background: style.accent, opacity: 0.3 }} />
          </div>
        </div>
      )}

      {/* ── CURTAIN animatie (Villa Aurora, Villa Cortina, Tuscany) ── */}
      {style.type === "curtain" && phase !== "open" && (
        <div className={`cn-curtain-wrapper${phase === "animating" ? " cn-curtain-animating" : ""}`}
          style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {/* Achtergrond (content glimp) */}
          <div style={{ position: "absolute", inset: 0, background: "#f9f3ef", display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center" }}>
            <p style={{ fontFamily: "serif", fontSize: "clamp(12px, 2.2vw, 16px)", color: "#5a5550", fontStyle: "italic" }}>{namen}</p>
          </div>
          {/* Gordijn links */}
          <div className="cn-curtain-l" style={{ position: "absolute", top: 0, left: 0, width: "50%", height: "100%", background: `linear-gradient(to right, ${style.color}, ${style.accent}15)`, borderRight: `1px solid ${style.accent}20` }} />
          {/* Gordijn rechts */}
          <div className="cn-curtain-r" style={{ position: "absolute", top: 0, right: 0, width: "50%", height: "100%", background: `linear-gradient(to left, ${style.color}, ${style.accent}15)`, borderLeft: `1px solid ${style.accent}20` }} />
          {phase === "idle" && (
            <p style={{ position: "absolute", bottom: "12%", left: 0, right: 0, textAlign: "center" as const, fontFamily: "sans-serif", fontSize: "clamp(6px,1vw,8px)", letterSpacing: "0.22em", textTransform: "uppercase" as const, color: style.accent, opacity: 0.75, zIndex: 5 }}>Tik om te openen</p>
          )}
        </div>
      )}

      {/* ── WAVE animatie (Het Zwanenmeer, Riviera 70, Strawberry) ── */}
      {style.type === "wave" && phase !== "open" && (
        <div className={`cn-wave-wrapper${phase === "animating" ? " cn-wave-animating" : ""}`}
          style={{ position: "absolute", inset: 0, background: style.color, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          {/* Cirkel golf */}
          <div className="cn-wave" style={{ position: "absolute", width: "60%", aspectRatio: "1", borderRadius: "50%", border: `2px solid ${style.accent}`, opacity: 0.3 }} />
          <div className="cn-wave" style={{ position: "absolute", width: "40%", aspectRatio: "1", borderRadius: "50%", border: `2px solid ${style.accent}`, opacity: 0.5, animationDelay: "0.1s" }} />
          <p style={{ fontFamily: "serif", fontSize: "clamp(11px, 2vw, 14px)", color: "#5a5550", fontStyle: "italic", position: "relative", zIndex: 2 }}>{namen}</p>
          <p style={{ fontFamily: "sans-serif", fontSize: "clamp(7px,1.1vw,9px)", color: style.accent, letterSpacing: "0.12em", position: "relative", zIndex: 2 }}>{locatieStr}</p>
          {phase === "idle" && <p style={{ position: "absolute", bottom: "12%", fontFamily: "sans-serif", fontSize: "clamp(6px,1vw,8px)", letterSpacing: "0.22em", textTransform: "uppercase" as const, color: style.accent, opacity: 0.7 }}>Tik om te openen</p>}
        </div>
      )}

      {/* ── FLORAL animatie (Zomertuin, Betoverd Bos, etc.) ── */}
      {style.type === "floral" && phase !== "open" && (
        <div className={`cn-floral-wrapper${phase === "animating" ? " cn-floral-animating" : ""}`}
          style={{ position: "absolute", inset: 0, background: style.color, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center" }}>
          {/* Bloem */}
          <div style={{ position: "relative", width: 60, height: 60, marginBottom: 12 }}>
            {[0, 90, 180, 270].map((rot, i) => (
              <div key={i} className="cn-petal" style={{ position: "absolute", top: "50%", left: "50%", width: 20, height: 28, background: style.accent, borderRadius: "50% 50% 0 50%", transformOrigin: "bottom center", transform: `translateX(-50%) rotate(${rot}deg) translateY(-100%)`, opacity: 0.75 }} />
            ))}
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 14, height: 14, borderRadius: "50%", background: style.accent }} />
          </div>
          <p style={{ fontFamily: "serif", fontSize: "clamp(11px, 2vw, 14px)", color: "#5a5550", fontStyle: "italic" }}>{namen}</p>
          {phase === "idle" && <p style={{ position: "absolute", bottom: "12%", fontFamily: "sans-serif", fontSize: "clamp(6px,1vw,8px)", letterSpacing: "0.22em", textTransform: "uppercase" as const, color: style.accent, opacity: 0.7 }}>Tik om te openen</p>}
        </div>
      )}

      {/* ── FOLD animatie (Minimale Couture, Oro Antico, etc.) ── */}
      {style.type === "fold" && phase !== "open" && (
        <div className={`cn-fold-wrapper${phase === "animating" ? " cn-fold-animating" : ""}`}
          style={{ position: "absolute", inset: 0, background: style.color, overflow: "hidden" }}>
          {/* Cover */}
          <div className="cn-fold-cover" style={{ position: "absolute", inset: 0, background: style.color, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", gap: 10, borderLeft: `3px solid ${style.accent}20` }}>
            <div style={{ width: "60%", height: 1, background: style.accent, opacity: 0.3 }} />
            <p style={{ fontFamily: "serif", fontSize: "clamp(11px, 2vw, 14px)", color: "#5a5550", fontStyle: "italic", textAlign: "center" as const }}>{namen}</p>
            <p style={{ fontFamily: "sans-serif", fontSize: "clamp(7px,1.1vw,9px)", color: style.accent, letterSpacing: "0.15em" }}>{datumStr}</p>
            <div style={{ width: "60%", height: 1, background: style.accent, opacity: 0.3 }} />
          </div>
          {phase === "idle" && <p style={{ position: "absolute", bottom: "12%", left: 0, right: 0, textAlign: "center" as const, fontFamily: "sans-serif", fontSize: "clamp(6px,1vw,8px)", letterSpacing: "0.22em", textTransform: "uppercase" as const, color: style.accent, opacity: 0.7 }}>Tik om te openen</p>}
        </div>
      )}
    </div>
  );
}
