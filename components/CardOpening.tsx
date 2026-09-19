"use client";

import { useState, useEffect } from "react";

type Props = {
  templateSlug: string;
  templateImg: string;
  partner1?: string;
  partner2?: string;
  datum?: string;
  locatie?: string;
  onComplete?: () => void;
};

const STYLES: Record<string, { bg: string; accent: string; type: string }> = {
  "bloom":                { bg: "#fdf0f4", accent: "#d4839a", type: "bow" },
  "idillio":              { bg: "#fdf8ec", accent: "#c8a832", type: "bow" },
  "volta-celeste":        { bg: "#eef2f8", accent: "#8fa8c8", type: "trifold" },
  "villa-aurora":         { bg: "#fdf3e8", accent: "#d4a056", type: "curtain" },
  "villa-cortina":        { bg: "#f5eef8", accent: "#9b7ab5", type: "curtain" },
  "tuscany-chic":         { bg: "#f8f0e8", accent: "#c87840", type: "curtain" },
  "het-zwanenmeer":       { bg: "#eef4f9", accent: "#6a9fc0", type: "wave" },
  "riviera-70":           { bg: "#fff8ec", accent: "#e8a040", type: "wave" },
  "strawberry-matcha":    { bg: "#eef6ee", accent: "#7aad6a", type: "wave" },
  "zomertuin":            { bg: "#eef4ec", accent: "#7aad6a", type: "floral" },
  "betoverd-bos":         { bg: "#edf4ee", accent: "#5a8c5a", type: "floral" },
  "italiaanse-aquarel":   { bg: "#eef6f8", accent: "#5aaac0", type: "floral" },
  "de-geheime-tuin":      { bg: "#eef6ee", accent: "#7aad6a", type: "floral" },
  "romantisch-botanisch": { bg: "#eef4ec", accent: "#7aad6a", type: "floral" },
  "minimale-couture":     { bg: "#f8f8f6", accent: "#333333", type: "fold" },
  "oro-antico":           { bg: "#faf4e8", accent: "#c8a832", type: "fold" },
  "gouden-uur":           { bg: "#fdf6e8", accent: "#d4a028", type: "fold" },
  "tratto-d-inchiostro":  { bg: "#f8f6f2", accent: "#4a4a3a", type: "fold" },
  "toile-de-jouy":        { bg: "#eef4f8", accent: "#5a7ab5", type: "fold" },
};

export default function CardOpening({ templateSlug, templateImg, partner1 = "Laura", partner2 = "Marco", datum, locatie, onComplete }: Props) {
  const [phase, setPhase] = useState<"idle" | "animating" | "open">("idle");
  const s = STYLES[templateSlug] || { bg: "#f9f5f1", accent: "#8B2635", type: "fold" };
  const namen = `${partner1} & ${partner2}`;
  const datumStr = datum ? new Date(datum).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" }) : "19 · 06 · 2027";

  const start = () => {
    if (phase !== "idle") return;
    setPhase("animating");
    setTimeout(() => { setPhase("open"); onComplete?.(); }, 1200);
  };

  const css = `
    @keyframes cn-bow-knot { 0%{transform:scale(1)}40%{transform:scale(1.15) rotate(-6deg)}100%{transform:scale(0) rotate(20deg) translateY(-80px);opacity:0} }
    @keyframes cn-bow-loop-l { 0%{transform:scale(1) rotate(-20deg)}100%{transform:scale(0) rotate(-60deg) translate(-40px,-20px);opacity:0} }
    @keyframes cn-bow-loop-r { 0%{transform:scale(1) rotate(20deg)}100%{transform:scale(0) rotate(60deg) translate(40px,-20px);opacity:0} }
    @keyframes cn-bow-tail-l { 0%{transform:rotate(-10deg)}100%{transform:rotate(-30deg) translate(-20px,20px);opacity:0} }
    @keyframes cn-bow-tail-r { 0%{transform:rotate(10deg)}100%{transform:rotate(30deg) translate(20px,20px);opacity:0} }
    @keyframes cn-ribbon-v { 0%{scaleY:1;opacity:1}100%{transform:scaleY(0);opacity:0} }
    @keyframes cn-ribbon-h { 0%{opacity:1}100%{transform:scaleX(0);opacity:0} }
    @keyframes cn-fold-l { 0%{transform:perspective(500px) rotateY(0deg);opacity:1} 100%{transform:perspective(500px) rotateY(-160deg);opacity:0} }
    @keyframes cn-fold-r { 0%{transform:perspective(500px) rotateY(0deg);opacity:1} 100%{transform:perspective(500px) rotateY(160deg);opacity:0} }
    @keyframes cn-curtain-l { to{transform:translateX(-100%)} }
    @keyframes cn-curtain-r { to{transform:translateX(100%)} }
    @keyframes cn-wave { 0%{transform:scale(0.8);opacity:0.8}100%{transform:scale(3);opacity:0} }
    @keyframes cn-petal-1 { to{transform:rotate(-140deg) translate(0,-30px) scale(0);opacity:0} }
    @keyframes cn-petal-2 { to{transform:rotate(-50deg) translate(0,-30px) scale(0);opacity:0} }
    @keyframes cn-petal-3 { to{transform:rotate(50deg) translate(0,-30px) scale(0);opacity:0} }
    @keyframes cn-petal-4 { to{transform:rotate(140deg) translate(0,-30px) scale(0);opacity:0} }
    @keyframes cn-fold-page { 0%{transform:perspective(500px) rotateY(0deg);opacity:1}100%{transform:perspective(500px) rotateY(-170deg);opacity:0} }
    @keyframes cn-appear { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} }
    @keyframes cn-pulse { 0%,100%{opacity:0.5}50%{opacity:1} }

    .cn-animating .cn-bow-knot   { animation: cn-bow-knot   0.5s 0s   cubic-bezier(.4,0,.2,1) forwards }
    .cn-animating .cn-bow-loop-l { animation: cn-bow-loop-l 0.4s 0.05s cubic-bezier(.4,0,.2,1) forwards }
    .cn-animating .cn-bow-loop-r { animation: cn-bow-loop-r 0.4s 0.1s  cubic-bezier(.4,0,.2,1) forwards }
    .cn-animating .cn-bow-tail-l { animation: cn-bow-tail-l 0.4s 0.1s  ease forwards }
    .cn-animating .cn-bow-tail-r { animation: cn-bow-tail-r 0.4s 0.12s ease forwards }
    .cn-animating .cn-ribbon-v   { animation: cn-ribbon-v   0.5s 0.3s  ease forwards }
    .cn-animating .cn-ribbon-h   { animation: cn-ribbon-h   0.5s 0.3s  ease forwards }

    .cn-animating .cn-fold-l { animation: cn-fold-l 0.6s 0s   cubic-bezier(.4,0,.2,1) forwards; transform-origin: left center }
    .cn-animating .cn-fold-r { animation: cn-fold-r 0.6s 0.1s cubic-bezier(.4,0,.2,1) forwards; transform-origin: right center }

    .cn-animating .cn-curtain-l { animation: cn-curtain-l 0.7s cubic-bezier(.4,0,.2,1) forwards }
    .cn-animating .cn-curtain-r { animation: cn-curtain-r 0.7s cubic-bezier(.4,0,.2,1) forwards }

    .cn-animating .cn-wave-1 { animation: cn-wave 0.7s 0s    ease forwards }
    .cn-animating .cn-wave-2 { animation: cn-wave 0.7s 0.15s ease forwards }

    .cn-animating .cn-petal-1 { animation: cn-petal-1 0.5s 0s    cubic-bezier(.4,0,.2,1) forwards }
    .cn-animating .cn-petal-2 { animation: cn-petal-2 0.5s 0.07s cubic-bezier(.4,0,.2,1) forwards }
    .cn-animating .cn-petal-3 { animation: cn-petal-3 0.5s 0.14s cubic-bezier(.4,0,.2,1) forwards }
    .cn-animating .cn-petal-4 { animation: cn-petal-4 0.5s 0.21s cubic-bezier(.4,0,.2,1) forwards }

    .cn-animating .cn-fold-page { animation: cn-fold-page 0.7s cubic-bezier(.4,0,.2,1) forwards; transform-origin: left center }

    .cn-appear { animation: cn-appear 0.5s ease both }
    .cn-pulse  { animation: cn-pulse 2s ease-in-out infinite }
  `;

  if (phase === "open") return (
    <div className="cn-appear" style={{ position: "absolute", inset: 0, overflowY: "auto" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={templateImg} alt="uitnodiging" style={{ width: "100%", display: "block" }} />
    </div>
  );

  return (
    <div className={phase === "animating" ? "cn-animating" : ""}
      onClick={start}
      style={{ position: "absolute", inset: 0, background: s.bg, cursor: "pointer", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <style>{css}</style>

      {/* ── BOW (Bloom, Idillio) ── */}
      {s.type === "bow" && (<>
        {/* Verticaal lint */}
        <div className="cn-ribbon-v" style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, background: s.accent, opacity: 0.35, transform: "translateX(-50%)" }} />
        {/* Horizontaal lint */}
        <div className="cn-ribbon-h" style={{ position: "absolute", top: "42%", left: 0, right: 0, height: 2, background: s.accent, opacity: 0.35 }} />
        {/* Strik groep */}
        <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Lussen */}
          <div style={{ display: "flex", gap: 3, marginBottom: 1 }}>
            <div className="cn-bow-loop-l" style={{ width: 22, height: 16, background: s.accent, borderRadius: "50% 50% 30% 30%", transform: "rotate(-20deg)", opacity: 0.9, transformOrigin: "bottom right" }} />
            <div className="cn-bow-loop-r" style={{ width: 22, height: 16, background: s.accent, borderRadius: "50% 50% 30% 30%", transform: "rotate(20deg)", opacity: 0.9, transformOrigin: "bottom left" }} />
          </div>
          {/* Knoop */}
          <div className="cn-bow-knot" style={{ width: 10, height: 10, borderRadius: "50%", background: s.accent, zIndex: 2 }} />
          {/* Staarten */}
          <div style={{ display: "flex", gap: 6 }}>
            <div className="cn-bow-tail-l" style={{ width: 7, height: 16, background: s.accent, borderRadius: "0 0 4px 4px", transform: "rotate(-10deg)", opacity: 0.8, transformOrigin: "top center" }} />
            <div className="cn-bow-tail-r" style={{ width: 7, height: 16, background: s.accent, borderRadius: "0 0 4px 4px", transform: "rotate(10deg)", opacity: 0.8, transformOrigin: "top center" }} />
          </div>
        </div>
        {/* Namen op de kaart */}
        <p style={{ marginTop: 20, fontFamily: "serif", fontSize: "clamp(10px,1.8vw,13px)", color: "#5a5550", fontStyle: "italic", textAlign: "center" }}>{namen}</p>
      </>)}

      {/* ── TRIFOLD (Volta Celeste) ── */}
      {s.type === "trifold" && (
        <div style={{ position: "absolute", inset: 0, display: "flex" }}>
          <div className="cn-fold-l" style={{ flex: 1, background: `linear-gradient(to right, ${s.bg}, ${s.accent}18)`, borderRight: `1px solid ${s.accent}25` }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: "0 12px" }}>
            <div style={{ width: "80%", height: 1, background: s.accent, opacity: 0.25 }} />
            <p style={{ fontFamily: "serif", fontSize: "clamp(10px,1.8vw,13px)", color: "#5a5550", fontStyle: "italic", textAlign: "center" }}>{namen}</p>
            <p style={{ fontFamily: "sans-serif", fontSize: "clamp(7px,1.1vw,9px)", color: s.accent, letterSpacing: "0.1em", textAlign: "center" }}>{datumStr}</p>
            <div style={{ width: "80%", height: 1, background: s.accent, opacity: 0.25 }} />
          </div>
          <div className="cn-fold-r" style={{ flex: 1, background: `linear-gradient(to left, ${s.bg}, ${s.accent}18)`, borderLeft: `1px solid ${s.accent}25` }} />
        </div>
      )}

      {/* ── CURTAIN (Villa Aurora, Villa Cortina, Tuscany) ── */}
      {s.type === "curtain" && (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {/* Achtergrond */}
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <p style={{ fontFamily: "serif", fontSize: "clamp(11px,2vw,15px)", color: "#5a5550", fontStyle: "italic" }}>{namen}</p>
            <p style={{ fontFamily: "sans-serif", fontSize: "clamp(7px,1.1vw,9px)", color: s.accent, letterSpacing: "0.12em" }}>{locatie || "Jullie locatie"}</p>
          </div>
          {/* Gordijnen */}
          <div className="cn-curtain-l" style={{ position: "absolute", inset: "0 50% 0 0", background: `linear-gradient(to right, ${s.bg} 70%, ${s.accent}10)` }} />
          <div className="cn-curtain-r" style={{ position: "absolute", inset: "0 0 0 50%", background: `linear-gradient(to left, ${s.bg} 70%, ${s.accent}10)` }} />
          {/* Gordijnrand boven */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 8, background: s.accent, opacity: 0.2 }} />
        </div>
      )}

      {/* ── WAVE (Zwanenmeer, Riviera, Strawberry) ── */}
      {s.type === "wave" && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          <div className="cn-wave-1" style={{ position: "absolute", width: "55%", aspectRatio: "1", borderRadius: "50%", border: `2px solid ${s.accent}`, opacity: 0.4 }} />
          <div className="cn-wave-2" style={{ position: "absolute", width: "35%", aspectRatio: "1", borderRadius: "50%", border: `2px solid ${s.accent}`, opacity: 0.6 }} />
          <p style={{ fontFamily: "serif", fontSize: "clamp(11px,2vw,14px)", color: "#5a5550", fontStyle: "italic", position: "relative", zIndex: 2, textAlign: "center" }}>{namen}</p>
          <p style={{ fontFamily: "sans-serif", fontSize: "clamp(7px,1.1vw,9px)", color: s.accent, letterSpacing: "0.12em", position: "relative", zIndex: 2, marginTop: 6 }}>{locatie || datumStr}</p>
        </div>
      )}

      {/* ── FLORAL (Zomertuin, Betoverd Bos, etc.) ── */}
      {s.type === "floral" && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          {/* SVG bloem */}
          <svg width="56" height="56" viewBox="0 0 56 56" style={{ marginBottom: 12, overflow: "visible" }}>
            {/* 4 blaadjes */}
            <ellipse className="cn-petal-1" cx="28" cy="28" rx="7" ry="13" fill={s.accent} opacity="0.8" style={{ transformOrigin: "28px 28px", transform: "rotate(-90deg) translate(0,-14px)" }} />
            <ellipse className="cn-petal-2" cx="28" cy="28" rx="7" ry="13" fill={s.accent} opacity="0.8" style={{ transformOrigin: "28px 28px", transform: "rotate(0deg) translate(0,-14px)" }} />
            <ellipse className="cn-petal-3" cx="28" cy="28" rx="7" ry="13" fill={s.accent} opacity="0.8" style={{ transformOrigin: "28px 28px", transform: "rotate(90deg) translate(0,-14px)" }} />
            <ellipse className="cn-petal-4" cx="28" cy="28" rx="7" ry="13" fill={s.accent} opacity="0.8" style={{ transformOrigin: "28px 28px", transform: "rotate(180deg) translate(0,-14px)" }} />
            {/* Hart */}
            <circle cx="28" cy="28" r="7" fill={s.accent} />
          </svg>
          <p style={{ fontFamily: "serif", fontSize: "clamp(11px,2vw,14px)", color: "#5a5550", fontStyle: "italic", textAlign: "center" }}>{namen}</p>
        </div>
      )}

      {/* ── FOLD (Minimale, Oro, Gouden Uur, etc.) ── */}
      {s.type === "fold" && (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {/* Achtergrond */}
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <div style={{ width: "55%", height: 1, background: s.accent, opacity: 0.25 }} />
            <p style={{ fontFamily: "serif", fontSize: "clamp(11px,2vw,14px)", color: "#5a5550", fontStyle: "italic", textAlign: "center" }}>{namen}</p>
            <p style={{ fontFamily: "sans-serif", fontSize: "clamp(7px,1.1vw,9px)", color: s.accent, letterSpacing: "0.15em", textAlign: "center" }}>{datumStr}</p>
            <div style={{ width: "55%", height: 1, background: s.accent, opacity: 0.25 }} />
          </div>
          {/* Cover die openvouwt */}
          <div className="cn-fold-page" style={{ position: "absolute", inset: 0, background: s.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, borderRight: `2px solid ${s.accent}20` }}>
            <div style={{ width: "55%", height: 1, background: s.accent, opacity: 0.3 }} />
            <p style={{ fontFamily: "serif", fontSize: "clamp(11px,2vw,14px)", color: "#5a5550", fontStyle: "italic", textAlign: "center", padding: "0 16px" }}>{namen}</p>
            <p style={{ fontFamily: "sans-serif", fontSize: "clamp(7px,1.1vw,9px)", color: s.accent, letterSpacing: "0.15em" }}>{datumStr}</p>
            <div style={{ width: "55%", height: 1, background: s.accent, opacity: 0.3 }} />
          </div>
        </div>
      )}

      {/* "Tik" label */}
      {phase === "idle" && (
        <p className="cn-pulse" style={{ position: "absolute", bottom: "10%", fontFamily: "sans-serif", fontSize: "clamp(6px,1vw,8px)", letterSpacing: "0.22em", textTransform: "uppercase" as const, color: s.accent, opacity: 0.7 }}>
          Tik om te openen
        </p>
      )}
    </div>
  );
}
