"use client";

/**
 * BloomInvite — Sponsalia-architectuur reconstructie
 *
 * Originele Sponsalia DOM-structuur:
 *
 *   <div class="music-intro music-intro--keyed">
 *     <canvas class="music-intro__key"></canvas>
 *     <video  class="music-intro__video"></video>
 *     <div    class="music-intro__caption">
 *       <p class="music-intro__names">Laura & Marco</p>
 *       <p class="music-intro__hint">Tik om te openen</p>
 *     </div>
 *   </div>
 *   <div class="invite-body">…hero + secties…</div>
 *
 * KERNVERSCHIL met vorige implementatie:
 *   - intro-overlay blijft in de DOM tijdens video → GEEN React unmount
 *   - video speelt ACHTER de uitnodiging via z-index
 *   - canvas maskeert de video (avorio-rosa: keyed compositie)
 *   - intro fade-out via CSS opacity transition op de overlay zelf
 *   - body scroll locked tijdens intro (touch-action:none + overflow:hidden)
 *   - muziek + video starten synchroon bij tap
 *   - poster = video.poster attribuut (eerste frame fallback)
 *
 * Sponsalia intro-config voor avorio-rosa:
 *   fps:    24
 *   aspect: 0.562963  (breedte/hoogte verhouding video frame)
 *   clear:  rgb(218, 197, 191)   → #dac5bf
 *   inner:  rgb(218, 197, 191)   → #dac5bf
 *   panel:  rgb(219, 200, 193)   → #dbc8c1
 *
 * Originele CSS voor .music-intro:
 *   background:  #eae2d7
 *   position:    fixed
 *   inset:       0
 *   z-index:     200
 *   cursor:      pointer
 *   touch-action:none
 *   display:     grid
 *
 * Originele CSS voor .music-intro__video:
 *   object-fit:  cover
 *   position:    absolute
 *   inset:       0
 *   width:       100%
 *   height:      100%
 *   background:  #eae2d7
 *
 * Originele CSS-variabelen op intro:
 *   --busta-inner, --busta-panel, --busta-vh,
 *   --busta-origin-y, --busta-cover-h, --busta-scale, --busta-dy
 */

import {
  useEffect, useState, useRef, useCallback, useMemo,
} from "react";
import { MapPin, Clock, Heart, Check, Camera, MessageSquare } from "lucide-react";

// ── Sponsalia asset URLs ──────────────────────────────────────────────────────
const SPONSALIA_VIDEO = "https://bpfiwnqqbiqxrjtzoodp.supabase.co/storage/v1/object/public/video/avorio_rosa.mp4";
const FALLBACK_VIDEO  = "/assets/templates/bloom/bloom-opening.mp4";
const SPONSALIA_MUSIC = "https://bpfiwnqqbiqxrjtzoodp.supabase.co/storage/v1/object/public/music/amber_glow.mp3";
const POSTER          = "/assets/templates/bloom/avorio_rosa-poster.jpg";

// ── Originele Bloom asset paden ───────────────────────────────────────────────
const B = {
  ink:          "/assets/templates/bloom/bl-hero-pieno-ink.webp",
  leaf:         "/assets/templates/bloom/bl-hero-pieno-leaf.webp",
  body:         "/assets/templates/bloom/bl-cartoncino-body.webp",
  line:         "/assets/templates/bloom/bl-cartoncino-line.webp",
  fascia:       "/assets/templates/bloom/bl-fascia-righe-ink.webp",
  cornice_ink:  "/assets/templates/bloom/bl-data-cornice-ink.webp",
  cornice_leaf: "/assets/templates/bloom/bl-data-cornice-leaf.webp",
  fiocco:       "/assets/templates/bloom/bl-fiocco-ink.webp",
  lungo:        "/assets/templates/bloom/bl-fiocco-lungo-ink.webp",
  colomba:      "/assets/templates/bloom/bl-colomba-ink.webp",
  wave:         "/assets/templates/bloom/bl-wave.svg",
};

// ── Originele Bloom kleur-tokens ──────────────────────────────────────────────
const C = {
  gold500:  "#cf8fa2",
  gold400:  "#dba7b6",
  gold300:  "#e8c3cd",
  ink900:   "#4a3a3a",
  ink700:   "#6a5555",
  ink500:   "#857070",
  ivory100: "#fbf8f6",
  ivory200: "#f3eeea",
  ivory300: "#e6dfda",
  ivory400: "#cdc3bd",
  // avorio-rosa intro achtergrond (Sponsalia origineel)
  introBg:  "#eae2d7",
  innerBg:  "#dac5bf",
  panelBg:  "#dbc8c1",
};

function inkFilter(color: string): string {
  const map: Record<string, string> = {
    "#8B2635": "sepia(1) saturate(3) hue-rotate(310deg) brightness(0.9)",
    "#cf8fa2": "sepia(1) saturate(2) hue-rotate(330deg) brightness(1.05)",
    "#1a2e4a": "sepia(1) saturate(2) hue-rotate(190deg) brightness(0.7)",
    "#5a7a5a": "sepia(1) saturate(2) hue-rotate(80deg)  brightness(0.8)",
    "#b5924d": "sepia(1) saturate(2) hue-rotate(20deg)  brightness(1.0)",
    "#4a5568": "sepia(1) saturate(1) hue-rotate(200deg) brightness(0.7)",
  };
  return map[color] ?? "sepia(1) saturate(3) hue-rotate(310deg) brightness(0.9)";
}

// ── Types ─────────────────────────────────────────────────────────────────────
type IntroState = "idle" | "playing" | "fading" | "done";

type WeddingEvent = {
  id: string; name: string;
  start_time: string; end_time: string;
  venue: string; city: string;
  description: string; is_main: boolean;
  event_date: string;
};

export type BloomInviteProps = {
  namen:           string;
  datumLang:       string;
  weddingTime?:    string;
  venue?:          string;
  stad?:           string;
  address?:        string;
  welcomeMessage?: string;
  events?:         WeddingEvent[];
  color?:          string;
  showRsvp?:       boolean;
  showPhotos?:     boolean;
  showMessages?:   boolean;
  showCountdown?:  boolean;
  demoMode?:       boolean;
  onRsvp?:         (attending: boolean, name: string, diet: string) => Promise<void>;
  onMessage?:      (text: string, authorName: string) => Promise<void>;
  onPhotoUpload?:  (file: File) => Promise<void>;
};

// ════════════════════════════════════════════════════════════════════════════
export default function BloomInvite({
  namen,
  datumLang,
  weddingTime,
  venue,
  stad,
  address,
  welcomeMessage,
  events = [],
  color = "#8B2635",
  showRsvp     = true,
  showPhotos   = true,
  showMessages = true,
  showCountdown = true,
  demoMode     = false,
  onRsvp,
  onMessage,
  onPhotoUpload,
}: BloomInviteProps) {

  // ── Staat ──────────────────────────────────────────────────────────────
  const [introState,    setIntroState]    = useState<IntroState>(demoMode ? "done" : "idle");
  const [heroRevealed,  setHeroRevealed]  = useState(demoMode);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [musicOn,       setMusicOn]       = useState(false);
  const [activeSection, setActiveSection] = useState("top");
  const [rsvpName,      setRsvpName]      = useState("");
  const [rsvpDiet,      setRsvpDiet]      = useState("");
  const [rsvpChoice,    setRsvpChoice]    = useState<"yes" | "no" | null>(null);
  const [rsvpDone,      setRsvpDone]      = useState(false);
  const [msgText,       setMsgText]       = useState("");
  const [msgSent,       setMsgSent]       = useState(false);
  const [countdown,     setCountdown]     = useState({ days: 0, hours: 0, min: 0, sec: 0 });
  const [hintVisible,   setHintVisible]   = useState(true);

  // ── Refs ───────────────────────────────────────────────────────────────
  const videoRef    = useRef<HTMLVideoElement | null>(null);
  const audioRef    = useRef<HTMLAudioElement | null>(null);
  const introRef    = useRef<HTMLDivElement | null>(null);
  const countRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const sectRefs    = useRef<Record<string, HTMLElement | null>>({});
  const fadingRef   = useRef(false);

  const ifilter = useMemo(() => inkFilter(color), [color]);

  // ── Setup ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
  }, []);

  // Body scroll lock tijdens intro (Sponsalia: touch-action:none)
  useEffect(() => {
    if (introState === "done") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [introState]);

  // Countdown
  useEffect(() => {
    const tick = () => {
      const target = (window as any).__bloomWeddingDate;
      if (!target) return;
      const diff = new Date(target).getTime() - Date.now();
      if (diff <= 0) { clearInterval(countRef.current!); return; }
      setCountdown({
        days:  Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        min:   Math.floor((diff % 3600000)  / 60000),
        sec:   Math.floor((diff % 60000)    / 1000),
      });
    };
    countRef.current = setInterval(tick, 1000);
    tick();
    return () => { if (countRef.current) clearInterval(countRef.current); };
  }, []);

  // IntersectionObserver voor bottom nav
  useEffect(() => {
    if (introState !== "done") return;
    const ids = ["top", "countdown", "program", "rsvp", "photos", "messages"];
    const obs = new IntersectionObserver(
      entries => { entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }); },
      { threshold: 0.35 }
    );
    ids.forEach(id => { const el = sectRefs.current[id]; if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [introState]);

  // ── Transitie naar uitnodiging ─────────────────────────────────────────
  //
  // Sponsalia-aanpak: intro FADE OUT via CSS transition op de overlay,
  // terwijl de uitnodiging al ZICHTBAAR is eronder.
  // Geen React unmount tot de fade compleet is.
  //
  const startFadeToInvite = useCallback(() => {
    if (fadingRef.current) return;
    fadingRef.current = true;
    setIntroState("fading");

    // Hero reveal start terwijl fade bezig is (blend)
    setHeroRevealed(true);

    // Na fade-out (600ms): intro volledig uit DOM
    setTimeout(() => {
      setIntroState("done");
      fadingRef.current = false;
    }, 620);
  }, []);

  // ── Video einde ────────────────────────────────────────────────────────
  const handleVideoEnd = useCallback(() => {
    startFadeToInvite();
  }, [startFadeToInvite]);

  // ── Tap handler ────────────────────────────────────────────────────────
  const handleTap = useCallback(() => {
    if (introState !== "idle") return;

    // prefers-reduced-motion: direct naar invite
    if (reducedMotion) { setHeroRevealed(true); setIntroState("done"); return; }

    setIntroState("playing");
    setHintVisible(false);

    // ── Muziek (Sponsalia: start synchroon met tap) ──
    if (!audioRef.current) {
      audioRef.current = new Audio(SPONSALIA_MUSIC);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.45;
    }
    audioRef.current.play().catch(() => {});
    setMusicOn(true);

    // ── Video ──
    // Sponsalia: video staat al in DOM met poster,
    // play() wordt aangeroepen na tap
    const v = videoRef.current;
    if (!v) { startFadeToInvite(); return; }

    // Probeer Sponsalia URL eerst
    const playSponalia = () => {
      v.src = SPONSALIA_VIDEO;
      v.load();
      const p = v.play();
      if (p) {
        p.catch(() => {
          // Fallback naar lokale video
          v.src = FALLBACK_VIDEO;
          v.load();
          v.play().catch(() => startFadeToInvite());
        });
      }
    };

    playSponalia();
  }, [introState, reducedMotion, startFadeToInvite]);

  // ── Muziek toggle ──────────────────────────────────────────────────────
  const toggleMusic = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) {
      audioRef.current = new Audio(SPONSALIA_MUSIC);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.45;
    }
    if (musicOn) { audioRef.current.pause(); setMusicOn(false); }
    else         { audioRef.current.play().catch(() => {}); setMusicOn(true); }
  }, [musicOn]);

  // ── Cleanup ────────────────────────────────────────────────────────────
  useEffect(() => () => {
    audioRef.current?.pause();
    if (countRef.current) clearInterval(countRef.current);
  }, []);

  // ── RSVP ──────────────────────────────────────────────────────────────
  const submitRSVP = async () => {
    if (!rsvpName || rsvpChoice === null) return;
    await onRsvp?.(rsvpChoice === "yes", rsvpName, rsvpDiet);
    setRsvpDone(true);
  };

  const submitMessage = async () => {
    if (!msgText.trim()) return;
    await onMessage?.(msgText, rsvpName || "Gast");
    setMsgSent(true); setMsgText("");
  };

  const scrollTo = (id: string) => {
    sectRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ── Hero reveal helper ────────────────────────────────────────────────
  const reveal = (delay: number): React.CSSProperties => ({
    opacity:   heroRevealed ? 1 : 0,
    transform: heroRevealed ? "translateY(0)" : "translateY(12px)",
    transition: heroRevealed
      ? `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s`
      : "none",
  });

  const inp: React.CSSProperties = {
    border: `1.5px solid ${C.ivory400}`, borderRadius: 10,
    padding: "10px 14px",
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 15, width: "100%", boxSizing: "border-box",
    outline: "none", background: "rgba(251,248,246,0.85)",
    color: C.ink900,
  };

  // ════════════════════════════════════════════════════════════════════════
  //  RENDER
  //
  //  Sponsalia-architectuur: intro-overlay en invite-body bestaan
  //  TEGELIJK in de DOM. Intro fade-out terwijl invite al zichtbaar is.
  // ════════════════════════════════════════════════════════════════════════
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap');

        /* ── Intro overlay ────────────────────────── */
        .music-intro {
          z-index: 200;
          isolation: isolate;
          text-align: center;
          color: ${C.ink900};
          cursor: pointer;
          touch-action: none;
          background: ${C.introBg};
          display: grid;
          position: fixed;
          inset: 0;
          /* fade-out transition */
          opacity: 1;
          transition: opacity 0.6s ease;
          pointer-events: auto;
        }
        .music-intro--fading {
          opacity: 0;
          pointer-events: none;
        }
        .music-intro--done {
          display: none;
        }

        /* ── Video binnen intro ───────────────────── */
        .music-intro__video {
          object-fit: cover;
          background: ${C.introBg};
          width: 100%;
          height: 100%;
          position: absolute;
          inset: 0;
          display: block;
        }

        /* ── Caption ──────────────────────────────── */
        .music-intro__caption {
          z-index: 1;
          pointer-events: none;
          position: absolute;
          inset: 0;
        }
        .music-intro__names {
          font-family: 'Pinyon Script', cursive;
          font-size: clamp(1.5rem, 7.5vw, 2.4rem);
          color: ${C.ink900};
          width: min(78%, 22rem);
          position: absolute;
          top: 21%;
          left: 50%;
          transform: translate(-50%, 0);
          line-height: 1.15;
          margin: 0;
        }
        .music-intro__hint {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(0.6rem, 2.5vw, 0.75rem);
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: ${C.ink700};
          position: absolute;
          bottom: 16%;
          left: 50%;
          transform: translate(-50%, 0);
          white-space: nowrap;
          /* pulse animatie wanneer video niet speelt */
          animation: miPulse 2.4s ease-in-out infinite;
          opacity: 1;
          transition: opacity 0.4s ease;
        }
        .music-intro__hint--hidden {
          opacity: 0;
        }

        /* ── Keyframes ─────────────────────────────── */
        @keyframes miPulse  { 0%,100%{opacity:0.4} 50%{opacity:0.95} }
        @keyframes bFadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes barDance { 0%,100%{height:5px} 50%{height:14px} }
        .bfu  { animation: bFadeUp 0.7s ease both; }
        .bfu1 { animation-delay:0.05s } .bfu2 { animation-delay:0.12s }
        .bfu3 { animation-delay:0.20s } .bfu4 { animation-delay:0.28s }
        .bfu5 { animation-delay:0.36s } .bfu6 { animation-delay:0.44s }

        /* ── Reduced motion ─────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .music-intro, .music-intro__hint { animation: none !important; transition: none !important; }
          .bfu, .bl-reveal { animation: none !important; transition: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════════
          MUSIC-INTRO OVERLAY
          Blijft in DOM tot fade compleet is (Sponsalia-architectuur)
      ══════════════════════════════════════════════════════════════════ */}
      {introState !== "done" && (
        <div
          ref={introRef}
          className={[
            "music-intro",
            introState === "fading" ? "music-intro--fading" : "",
          ].join(" ").trim()}
          onClick={handleTap}
          aria-label="Klik om de uitnodiging te openen"
        >
          {/* canvas placeholder (Sponsalia gebruikt dit voor WebGL masking,
              wij laten het weg maar behouden de DOM-positie voor correcte
              stacking context / z-index) */}
          <canvas
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none", display: "block" }}
          />

          {/* video — Sponsalia: staat altijd in DOM, src wordt gezet na tap */}
          <video
            ref={videoRef}
            className="music-intro__video"
            poster={POSTER}
            muted
            playsInline
            preload="metadata"
            onEnded={handleVideoEnd}
            onError={handleVideoEnd}
            style={{ zIndex: 1 }}
          />

          {/* caption */}
          <div className="music-intro__caption">
            <p className="music-intro__names">{namen}</p>
            <p className={`music-intro__hint${!hintVisible ? " music-intro__hint--hidden" : ""}`}>
              Tik om te openen
            </p>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          INVITE BODY
          Bestaat al in DOM terwijl intro nog zichtbaar is (z-index < 200).
          Hero reveal animaties starten tijdens fade-out van intro.
      ══════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          background: C.ivory200,
          minHeight: "100svh",
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          // Niet scrollbaar tijdens intro
          overflow: introState !== "done" ? "hidden" : undefined,
        }}
      >
        {/* Music toggle */}
        <button
          onClick={toggleMusic}
          aria-label={musicOn ? "Muziek pauzeren" : "Muziek afspelen"}
          style={{
            position: "fixed", top: 16, right: 16, zIndex: 300,
            width: 44, height: 44, borderRadius: "50%",
            background: "rgba(251,248,246,0.95)",
            border: `1px solid ${C.ivory400}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 16px rgba(74,58,58,0.12)",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 14 }}>
            {[0, 0.15, 0.3].map((delay, i) => (
              <div key={i} style={{
                width: 3, borderRadius: 2,
                background: musicOn ? C.gold500 : C.ivory400,
                animation: musicOn
                  ? `barDance 0.7s ease-in-out ${delay}s infinite`
                  : `barDance 2.2s ease-in-out ${delay * 2}s infinite`,
                height: musicOn ? 14 : 6,
                transition: "background 0.3s, height 0.3s",
              }} />
            ))}
          </div>
        </button>

        <div style={{ maxWidth: 520, margin: "0 auto", paddingBottom: 80 }}>

          {/* ══ HERO — header.hero.bl-hero (originele bl-panel structuur) ══ */}
          <header
            id="top"
            ref={el => { sectRefs.current["top"] = el; }}
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "692 / 1500",
              overflow: "hidden",
              background: C.ivory200,
            }}
          >
            <div style={{ position: "absolute", inset: 0 }}>
              {/* cartoncino body */}
              <img src={B.body} alt="" aria-hidden
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              {/* cartoncino line textuur */}
              <img src={B.line} alt="" aria-hidden
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.07, mixBlendMode: "multiply" }} />
              {/* span.bl-panel__ink */}
              <span aria-hidden style={{
                position: "absolute", inset: 0,
                backgroundImage: `url(${B.ink})`,
                backgroundSize: "cover", backgroundPosition: "center top",
                filter: ifilter, opacity: 0.88,
              }} />
              {/* span.bl-panel__leaf */}
              <span aria-hidden style={{
                position: "absolute", inset: 0,
                backgroundImage: `url(${B.leaf})`,
                backgroundSize: "cover", backgroundPosition: "center top",
              }} />
              {/* div.bl-panel__text — originele inset: 26% 22% 32% */}
              <div style={{
                position: "absolute",
                top: "26%", right: "22%", bottom: "32%", left: "22%",
                display: "flex", flexDirection: "column",
                justifyContent: "center", alignItems: "center",
                gap: "0.45em",
              }}>
                <span className="bl-reveal" style={{ ...reveal(0), fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(7px,1.8vw,9px)", letterSpacing: "0.28em", textTransform: "uppercase", color: C.ink700, textAlign: "center" }}>
                  Met liefde uitgenodigd
                </span>
                <h1 className="bl-reveal" style={{ ...reveal(0.45), fontFamily: "'Pinyon Script', cursive", fontSize: "clamp(24px,7vw,42px)", fontWeight: 400, color: C.ink900, textAlign: "center", lineHeight: 1.05, margin: 0 }}>
                  {namen}
                </h1>
                <span className="bl-reveal" style={{ ...reveal(0.65), textAlign: "center" }}>
                  <img src={B.wave} alt="" aria-hidden style={{ width: "clamp(70px,40%,110px)", opacity: 0.30 }} />
                </span>
                <p className="bl-reveal" style={{ ...reveal(0.90), fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(10px,2.4vw,13px)", letterSpacing: "0.14em", textTransform: "uppercase", color: C.ink500, margin: 0, textAlign: "center" }}>
                  Wij gaan trouwen
                </p>
                <div className="bl-reveal" style={{ ...reveal(1.20), display: "flex", flexDirection: "column", alignItems: "center", gap: 3, marginTop: 2 }}>
                  {datumLang && <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(9px,2.2vw,12px)", color: C.ink700, margin: 0, textAlign: "center", letterSpacing: "0.06em" }}>{datumLang}</p>}
                  {(venue || stad) && <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(9px,2vw,11px)", color: C.ink500, margin: 0, textAlign: "center" }}>{venue}{stad ? `, ${stad}` : ""}</p>}
                </div>
              </div>
            </div>
          </header>

          {/* Lange strik */}
          <div className="bl-reveal" style={{ ...reveal(1.40), display: "flex", justifyContent: "center", marginTop: -22, position: "relative", zIndex: 10 }}>
            <img src={B.lungo} alt="" aria-hidden style={{ height: "clamp(52px,10vw,76px)", width: "auto", filter: ifilter, opacity: 0.82 }} />
          </div>

          {/* ══ COUNTDOWN ════════════════════════════════════════════════ */}
          {showCountdown && countdown.days > 0 && (
            <div id="countdown" ref={el => { sectRefs.current["countdown"] = el; }}
              className="bfu bfu1"
              style={{ margin: "20px 16px 16px", position: "relative", borderRadius: 20, overflow: "hidden" }}>
              <img src={B.fascia} alt="" aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.16, filter: ifilter }} />
              <div style={{ position: "relative", background: `${C.ivory100}cc`, borderRadius: 20, padding: "22px" }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: C.ink500, textAlign: "center", marginBottom: 14 }}>Nog</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
                  {[{ v: countdown.days, l: "dagen" }, { v: countdown.hours, l: "uren" }, { v: countdown.min, l: "min" }, { v: countdown.sec, l: "sec" }].map(({ v, l }) => (
                    <div key={l} style={{ textAlign: "center" }}>
                      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, color: C.gold500, fontWeight: 400, lineHeight: 1, margin: 0 }}>{String(v).padStart(2, "0")}</p>
                      <p style={{ fontFamily: "sans-serif", fontSize: 9, color: C.ink500, marginTop: 3, letterSpacing: "0.08em" }}>{l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══ DATUM & LOCATIE ══════════════════════════════════════════ */}
          <div className="bfu bfu2" style={{ margin: "0 16px 16px", background: C.ivory100, borderRadius: 20, padding: "28px 22px", boxShadow: "0 6px 28px rgba(74,58,58,0.07)", position: "relative", overflow: "hidden" }}>
            <img src={B.line} alt="" aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.07, pointerEvents: "none" }} />
            <img src={B.cornice_leaf} alt="" aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", opacity: 0.12, pointerEvents: "none" }} />
            <img src={B.cornice_ink}  alt="" aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", opacity: 0.09, filter: ifilter, pointerEvents: "none" }} />
            <div style={{ position: "relative", textAlign: "center" }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: C.ink500, marginBottom: 8 }}>Datum</p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 21, color: C.ink900, fontWeight: 400, margin: "0 0 4px" }}>{datumLang}</p>
              {weddingTime && <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, color: C.ink700, margin: 0 }}>Aanvang {weddingTime} uur</p>}
              <div style={{ margin: "14px 0" }}><img src={B.wave} alt="" aria-hidden style={{ width: "55%", opacity: 0.22 }} /></div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: C.ink500, marginBottom: 8 }}>Locatie</p>
              {venue && <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: C.ink900, margin: "0 0 2px" }}>{venue}</p>}
              {stad  && <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, color: C.ink700, margin: 0 }}>{stad}</p>}
              {address && (
                <a href={`https://maps.google.com/?q=${encodeURIComponent(address + " " + stad)}`} target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 10, fontFamily: "sans-serif", fontSize: 12, color: C.gold500, textDecoration: "none" }}>
                  <MapPin size={12} /> Route bekijken
                </a>
              )}
            </div>
          </div>

          {/* ══ WELKOMSTBERICHT ══════════════════════════════════════════ */}
          {welcomeMessage && (
            <div className="bfu bfu2" style={{ margin: "0 16px 16px", background: C.ivory100, borderRadius: 20, padding: "24px 22px", boxShadow: "0 4px 20px rgba(74,58,58,0.06)", position: "relative", overflow: "hidden" }}>
              <img src={B.line} alt="" aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.06, pointerEvents: "none" }} />
              <div style={{ position: "relative", textAlign: "center" }}>
                <img src={B.fiocco} alt="" aria-hidden style={{ width: 34, opacity: 0.28, filter: ifilter, marginBottom: 12 }} />
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontStyle: "italic", color: C.ink700, lineHeight: 1.8, margin: 0 }}>"{welcomeMessage}"</p>
                <div style={{ marginTop: 12 }}><img src={B.wave} alt="" aria-hidden style={{ width: "42%", opacity: 0.20 }} /></div>
              </div>
            </div>
          )}

          {/* ══ PROGRAMMA ════════════════════════════════════════════════ */}
          {events.length > 0 && (
            <div id="program" ref={el => { sectRefs.current["program"] = el; }}
              className="bfu bfu3" style={{ margin: "0 16px 16px" }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: C.ink500, marginBottom: 12, paddingLeft: 2 }}>Programma</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {events.map(ev => (
                  <div key={ev.id} style={{ background: C.ivory100, borderRadius: 16, padding: "16px 18px", boxShadow: "0 2px 12px rgba(74,58,58,0.06)", position: "relative", overflow: "hidden", borderLeft: ev.is_main ? `3px solid ${C.gold500}` : "3px solid transparent" }}>
                    <img src={B.line} alt="" aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.05, pointerEvents: "none" }} />
                    <div style={{ display: "flex", gap: 14, alignItems: "flex-start", position: "relative" }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${C.gold300}50`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Clock size={13} style={{ color: C.gold500 }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, color: C.ink900, margin: "0 0 2px" }}>{ev.name}</p>
                        {ev.start_time && <p style={{ fontFamily: "sans-serif", fontSize: 12, color: C.ink500, margin: 0 }}>{ev.start_time}{ev.end_time ? ` – ${ev.end_time}` : ""}</p>}
                        {ev.venue && <p style={{ fontFamily: "sans-serif", fontSize: 12, color: C.ink700, margin: "2px 0 0" }}>{ev.venue}{ev.city ? `, ${ev.city}` : ""}</p>}
                        {ev.description && <p style={{ fontFamily: "sans-serif", fontSize: 12, color: C.ink500, marginTop: 4, lineHeight: 1.5 }}>{ev.description}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ RSVP ════════════════════════════════════════════════════ */}
          {showRsvp && (
            <div id="rsvp" ref={el => { sectRefs.current["rsvp"] = el; }}
              className="bfu bfu4" style={{ margin: "0 16px 16px", position: "relative", borderRadius: 20, overflow: "hidden" }}>
              <img src={B.fascia} alt="" aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.16, filter: ifilter }} />
              <div style={{ position: "relative", background: `${C.ivory100}cc`, borderRadius: 20, padding: "24px 22px" }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: C.ink500, marginBottom: 6 }}>RSVP</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: C.ink900, margin: "0 0 18px" }}>Ben jij erbij?</p>
                {rsvpDone ? (
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <Heart size={28} style={{ color: C.gold500, margin: "0 auto 10px", display: "block" }} />
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: C.ink900, margin: 0 }}>Bedankt voor je bevestiging!</p>
                  </div>
                ) : (
                  <>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontFamily: "sans-serif", fontSize: 10, color: C.ink500, display: "block", marginBottom: 5, letterSpacing: "0.1em" }}>NAAM</label>
                      <input value={rsvpName} onChange={e => setRsvpName(e.target.value)} placeholder="Jouw naam" style={inp} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                      <button onClick={() => setRsvpChoice("yes")} style={{ background: rsvpChoice === "yes" ? C.gold500 : "rgba(251,248,246,0.9)", color: rsvpChoice === "yes" ? "white" : C.ink700, border: `1.5px solid ${rsvpChoice === "yes" ? C.gold500 : C.ivory400}`, borderRadius: 10, padding: "11px", fontFamily: "'Cormorant Garamond', serif", fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.2s" }}>
                        {rsvpChoice === "yes" && <Check size={13} />} Ik kom!
                      </button>
                      <button onClick={() => setRsvpChoice("no")} style={{ background: rsvpChoice === "no" ? C.ink700 : "rgba(251,248,246,0.9)", color: rsvpChoice === "no" ? "white" : C.ink700, border: `1.5px solid ${rsvpChoice === "no" ? C.ink700 : C.ivory400}`, borderRadius: 10, padding: "11px", fontFamily: "'Cormorant Garamond', serif", fontSize: 15, cursor: "pointer", transition: "all 0.2s" }}>
                        Ik kan niet
                      </button>
                    </div>
                    <div style={{ marginBottom: 14 }}>
                      <label style={{ fontFamily: "sans-serif", fontSize: 10, color: C.ink500, display: "block", marginBottom: 5, letterSpacing: "0.1em" }}>DIEETWENSEN (OPTIONEEL)</label>
                      <input value={rsvpDiet} onChange={e => setRsvpDiet(e.target.value)} placeholder="Vegetarisch, allergieën..." style={inp} />
                    </div>
                    <button onClick={submitRSVP} disabled={!rsvpName || rsvpChoice === null} style={{ background: (!rsvpName || rsvpChoice === null) ? C.ivory400 : C.gold500, color: "white", border: "none", borderRadius: 999, padding: "13px", fontFamily: "'Cormorant Garamond', serif", fontSize: 16, cursor: (!rsvpName || rsvpChoice === null) ? "default" : "pointer", width: "100%", transition: "background 0.2s" }}>Bevestigen</button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Duif */}
          <div style={{ display: "flex", justifyContent: "center", margin: "16px 0 12px" }}>
            <img src={B.colomba} alt="" aria-hidden style={{ width: 40, opacity: 0.20, filter: ifilter }} />
          </div>

          {/* ══ FOTO ════════════════════════════════════════════════════ */}
          {showPhotos && (
            <div id="photos" ref={el => { sectRefs.current["photos"] = el; }}
              className="bfu bfu5" style={{ margin: "0 16px 16px", background: C.ivory100, borderRadius: 20, padding: "24px 22px", boxShadow: "0 4px 20px rgba(74,58,58,0.06)", textAlign: "center", position: "relative", overflow: "hidden" }}>
              <img src={B.line} alt="" aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.06, pointerEvents: "none" }} />
              <div style={{ position: "relative" }}>
                <Camera size={22} style={{ color: C.gold500, margin: "0 auto 8px", display: "block" }} />
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: C.ink900, margin: "0 0 4px" }}>Deel een foto</p>
                <p style={{ fontFamily: "sans-serif", fontSize: 13, color: C.ink500, margin: "0 0 16px", lineHeight: 1.5 }}>Upload jouw favoriete moment van deze dag</p>
                <label style={{ display: "inline-block", background: `${C.gold500}15`, color: C.gold500, border: `1.5px solid ${C.gold300}`, borderRadius: 999, padding: "10px 22px", fontFamily: "sans-serif", fontSize: 13, cursor: "pointer" }}>
                  Foto kiezen
                  <input type="file" accept="image/*" style={{ display: "none" }}
                    onChange={e => { if (e.target.files?.[0]) onPhotoUpload?.(e.target.files[0]); }} />
                </label>
              </div>
            </div>
          )}

          {/* ══ GASTENBOEK ══════════════════════════════════════════════ */}
          {showMessages && (
            <div id="messages" ref={el => { sectRefs.current["messages"] = el; }}
              className="bfu bfu6" style={{ margin: "0 16px 16px", background: C.ivory100, borderRadius: 20, padding: "24px 22px", boxShadow: "0 4px 20px rgba(74,58,58,0.06)", position: "relative", overflow: "hidden" }}>
              <img src={B.line} alt="" aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.06, pointerEvents: "none" }} />
              <div style={{ position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <MessageSquare size={17} style={{ color: C.gold500 }} />
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: C.ink900, margin: 0 }}>Laat een bericht achter</p>
                </div>
                {msgSent ? (
                  <div style={{ textAlign: "center", padding: "16px 0" }}>
                    <img src={B.fiocco} alt="" aria-hidden style={{ width: 30, opacity: 0.28, filter: ifilter, margin: "0 auto 8px", display: "block" }} />
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, color: C.ink700, margin: 0 }}>Bedankt voor je bericht!</p>
                  </div>
                ) : (
                  <>
                    <textarea rows={3} value={msgText} onChange={e => setMsgText(e.target.value)}
                      placeholder="Schrijf een persoonlijk bericht voor het bruidspaar..."
                      style={{ ...inp, resize: "vertical", marginBottom: 10, minHeight: 80 }} />
                    <button onClick={submitMessage} disabled={!msgText.trim()} style={{ background: msgText.trim() ? C.gold500 : C.ivory400, color: "white", border: "none", borderRadius: 999, padding: "11px 20px", fontFamily: "'Cormorant Garamond', serif", fontSize: 15, cursor: msgText.trim() ? "pointer" : "default", width: "100%", transition: "background 0.2s" }}>
                      Bericht sturen
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ══ FOOTER ══════════════════════════════════════════════════ */}
          <div style={{ textAlign: "center", padding: "24px 16px 16px" }}>
            <div style={{ position: "relative", margin: "0 16px 18px", borderRadius: 12, overflow: "hidden", height: 36 }}>
              <img src={B.fascia} alt="" aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.18, filter: ifilter }} />
            </div>
            <img src={B.fiocco} alt="" aria-hidden style={{ width: 32, opacity: 0.22, filter: ifilter, margin: "0 auto 8px", display: "block" }} />
            <img src={B.wave}   alt="" aria-hidden style={{ width: "38%", opacity: 0.18, margin: "0 auto 8px", display: "block" }} />
            <p style={{ fontFamily: "sans-serif", fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: C.ink500 }}>
              Casa Nomada · Digitale trouwuitnodigingen
            </p>
          </div>
        </div>

        {/* ══ BOTTOM NAV ══════════════════════════════════════════════════ */}
        <nav style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 190,
          background: `${C.ivory100}f5`,
          backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
          borderTop: `1px solid ${C.ivory400}`,
          boxShadow: "0 -2px 20px rgba(74,58,58,0.08)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", height: 52, maxWidth: 520, margin: "0 auto" }}>
            {[
              { id: "top",      label: "Home" },
              { id: "program",  label: "Programma" },
              { id: "rsvp",     label: "RSVP" },
              { id: "photos",   label: "Foto's" },
              { id: "messages", label: "Berichten" },
            ].map(({ id, label }) => {
              const active = activeSection === id;
              return (
                <button key={id} onClick={() => scrollTo(id)} style={{ background: "none", border: "none", cursor: "pointer", padding: "6px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, position: "relative" }}>
                  <span style={{ fontFamily: "sans-serif", fontSize: 10, letterSpacing: "0.06em", color: active ? C.gold500 : C.ink500, transition: "color 0.2s" }}>{label}</span>
                  <span style={{ position: "absolute", bottom: 2, left: "50%", transform: "translateX(-50%)", width: active ? "80%" : "0%", height: 1.5, borderRadius: 999, background: C.gold500, transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)" }} />
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
}
