"use client";

/**
 * BloomInvite — volledige Bloom uitnodiging op basis van originele Sponsalia assets
 *
 * Eén gedeelde component voor /invite/[slug] en /templates/bloom demo.
 *
 * Opening flow:
 *  1. Idle: poster + "Tik om te openen"
 *  2. Tap: muziek + video starten
 *  3. Video (avorio_rosa.mp4) speelt 1× af
 *  4. Fade → Bloom hero (bl-panel__ink + bl-panel__leaf + bl-panel__text)
 *  5. Scrollbare uitnodiging
 *
 * Originele Sponsalia assets:
 *  video:  https://bpfiwnqqbiqxrjtzoodp.supabase.co/storage/v1/object/public/video/avorio_rosa.mp4
 *  muziek: https://bpfiwnqqbiqxrjtzoodp.supabase.co/storage/v1/object/public/music/amber_glow.mp3
 *  poster: /assets/templates/bloom/avorio_rosa-poster.jpg
 *  ink:    /assets/templates/bloom/bl-hero-pieno-ink.webp
 *  leaf:   /assets/templates/bloom/bl-hero-pieno-leaf.webp
 *  + alle andere bl-* assets
 *
 * Kleuren (originele Bloom tokens):
 *  --c-gold-500: #cf8fa2
 *  --c-ink-900:  #4a3a3a
 *  --c-ivory-100:#fbf8f6
 *
 * Typografie:
 *  namen:        Pinyon Script
 *  eyebrow/meta: Cormorant Garamond
 */

import { useEffect, useState, useRef, useCallback } from "react";
import { MapPin, Clock, Heart, Check, Camera, MessageSquare } from "lucide-react";

// ── Asset paden ───────────────────────────────────────────────────────────────
const SPONSALIA_VIDEO  = "https://bpfiwnqqbiqxrjtzoodp.supabase.co/storage/v1/object/public/video/avorio_rosa.mp4";
const FALLBACK_VIDEO   = "/assets/templates/bloom/bloom-opening.mp4";
const SPONSALIA_MUSIC  = "https://bpfiwnqqbiqxrjtzoodp.supabase.co/storage/v1/object/public/music/amber_glow.mp3";
const POSTER           = "/assets/templates/bloom/avorio_rosa-poster.jpg";

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
};

// ── Kleurfilter voor ink assets ───────────────────────────────────────────────
function inkFilter(color: string): string {
  const map: Record<string, string> = {
    "#8B2635": "sepia(1) saturate(3) hue-rotate(310deg) brightness(0.9)",
    "#cf8fa2": "sepia(1) saturate(2) hue-rotate(330deg) brightness(1.05)",
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

// ── Types ─────────────────────────────────────────────────────────────────────
type Phase = "idle" | "playing" | "invite";

type WeddingEvent = {
  id: string; name: string;
  start_time: string; end_time: string;
  venue: string; city: string;
  description: string; is_main: boolean;
};

export type BloomInviteProps = {
  // Data
  namen:           string;
  datumLang:       string;
  weddingTime?:    string;
  venue?:          string;
  stad?:           string;
  address?:        string;
  welcomeMessage?: string;
  events?:         WeddingEvent[];
  // Weergave
  color?:          string;
  showRsvp?:       boolean;
  showPhotos?:     boolean;
  showMessages?:   boolean;
  showCountdown?:  boolean;
  // Demo modus: sla opening over
  demoMode?:       boolean;
  // Callbacks voor RSVP/bericht (optioneel voor demo)
  onRsvp?:         (attending: boolean, name: string, diet: string) => Promise<void>;
  onMessage?:      (text: string, authorName: string) => Promise<void>;
  onPhotoUpload?:  (file: File) => Promise<void>;
};

// ── Hoofd component ───────────────────────────────────────────────────────────
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
  showRsvp = true,
  showPhotos = true,
  showMessages = true,
  showCountdown = true,
  demoMode = false,
  onRsvp,
  onMessage,
  onPhotoUpload,
}: BloomInviteProps) {

  const [phase,         setPhase]         = useState<Phase>(demoMode ? "invite" : "idle");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [videoReady,    setVideoReady]    = useState(false);
  const [heroRevealed,  setHeroRevealed]  = useState(demoMode);
  const [musicOn,       setMusicOn]       = useState(false);
  const [activeSection, setActiveSection] = useState("top");
  const [rsvpName,      setRsvpName]      = useState("");
  const [rsvpDiet,      setRsvpDiet]      = useState("");
  const [rsvpChoice,    setRsvpChoice]    = useState<"yes" | "no" | null>(null);
  const [rsvpDone,      setRsvpDone]      = useState(false);
  const [msgText,       setMsgText]       = useState("");
  const [msgSent,       setMsgSent]       = useState(false);
  const [countdown,     setCountdown]     = useState({ days: 0, hours: 0, min: 0, sec: 0 });

  const videoRef  = useRef<HTMLVideoElement | null>(null);
  const audioRef  = useRef<HTMLAudioElement | null>(null);
  const countRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const sectRefs  = useRef<Record<string, HTMLElement | null>>({});

  const ifilter = inkFilter(color);

  // ── Setup ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
  }, []);

  // Preload video
  useEffect(() => {
    if (demoMode) return;
    const v = document.createElement("video");
    v.src = SPONSALIA_VIDEO;
    v.preload = "auto";
    v.muted = true;
    v.playsInline = true;
    v.oncanplaythrough = () => setVideoReady(true);
    v.onerror = () => {
      // Fallback naar lokale video
      const v2 = document.createElement("video");
      v2.src = FALLBACK_VIDEO;
      v2.preload = "auto";
      v2.muted = true;
      v2.oncanplaythrough = () => setVideoReady(true);
      v2.load();
    };
    v.load();
  }, [demoMode]);

  // Countdown
  useEffect(() => {
    if (!datumLang) return;
    // Probeer datum te parsen uit datumLang (nl formaat)
    const tick = () => {
      // Gebruik window.__weddingDate als die beschikbaar is, anders skip
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
  }, [datumLang]);

  // Intersection Observer voor bottom nav
  useEffect(() => {
    if (phase !== "invite") return;
    const sections = ["top", "countdown", "program", "rsvp", "photos", "messages"];
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
      },
      { threshold: 0.4 }
    );
    sections.forEach(id => {
      const el = sectRefs.current[id];
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [phase]);

  // ── Tap handler ──────────────────────────────────────────────────────────
  const handleTap = () => {
    if (phase !== "idle") return;
    if (reducedMotion) { transitionToInvite(); return; }

    setPhase("playing");

    // Muziek
    if (!audioRef.current) {
      audioRef.current = new Audio(SPONSALIA_MUSIC);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.45;
    }
    audioRef.current.play().catch(() => {});
    setMusicOn(true);

    // Video — één animatieframe wachten zodat het element gerenderd is
    requestAnimationFrame(() => {
      const v = videoRef.current;
      if (!v) { transitionToInvite(); return; }
      // Probeer Sponsalia video, fallback naar lokale
      v.src = SPONSALIA_VIDEO;
      v.play().catch(() => {
        v.src = FALLBACK_VIDEO;
        v.play().catch(() => transitionToInvite());
      });
    });
  };

  // ── Overgang naar uitnodiging ─────────────────────────────────────────────
  const transitionToInvite = useCallback(() => {
    setPhase("invite");
    // Hero reveal start na korte delay (breath)
    setTimeout(() => setHeroRevealed(true), 120);
  }, []);

  const handleVideoEnd = useCallback(() => {
    transitionToInvite();
  }, [transitionToInvite]);

  // ── Muziek toggle ────────────────────────────────────────────────────────
  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) {
      audioRef.current = new Audio(SPONSALIA_MUSIC);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.45;
    }
    if (musicOn) { audioRef.current.pause(); setMusicOn(false); }
    else         { audioRef.current.play().catch(() => {}); setMusicOn(true); }
  };

  // ── RSVP ─────────────────────────────────────────────────────────────────
  const submitRSVP = async () => {
    if (!rsvpName || rsvpChoice === null) return;
    await onRsvp?.(rsvpChoice === "yes", rsvpName, rsvpDiet);
    setRsvpDone(true);
  };

  // ── Bericht ──────────────────────────────────────────────────────────────
  const submitMessage = async () => {
    if (!msgText.trim()) return;
    await onMessage?.(msgText, rsvpName || "Gast");
    setMsgSent(true); setMsgText("");
  };

  // ── Scroll naar sectie ───────────────────────────────────────────────────
  const scrollTo = (id: string) => {
    sectRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ── Reveal helper (gestaggerd, identiek aan origineel data-reveal) ────────
  const reveal = (delay: number): React.CSSProperties => ({
    opacity:   heroRevealed ? 1 : 0,
    transform: heroRevealed ? "translateY(0)" : "translateY(12px)",
    transition: heroRevealed
      ? `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s`
      : "none",
  });

  // ── Input stijl ──────────────────────────────────────────────────────────
  const inp: React.CSSProperties = {
    border: `1.5px solid ${C.ivory400}`,
    borderRadius: 10, padding: "10px 14px",
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 15, width: "100%", boxSizing: "border-box",
    outline: "none", background: "rgba(251,248,246,0.85)",
    color: C.ink900,
  };

  // ══════════════════════════════════════════════════════════════════════════
  //  RENDER: IDLE  (gesloten envelop)
  // ══════════════════════════════════════════════════════════════════════════
  if (phase === "idle") {
    return (
      <div
        onClick={handleTap}
        style={{
          minHeight: "100svh",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: `linear-gradient(175deg, ${C.ivory100} 0%, ${C.ivory200} 55%, ${C.ivory300} 100%)`,
          cursor: "pointer",
          padding: "24px 20px 48px",
          userSelect: "none", WebkitUserSelect: "none",
        }}
      >
        <style>{`
          @keyframes bFadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
          @keyframes bPulse  { 0%,100%{opacity:0.45} 50%{opacity:0.95} }
          @keyframes bFloat  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
          @import url('https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');
          @media(prefers-reduced-motion:reduce){*{animation-duration:0.01ms!important;transition-duration:0.01ms!important}}
        `}</style>

        {/* Poster — de echte avorio_rosa compositie */}
        <div style={{
          position: "relative",
          width: "min(320px, 88vw)",
          aspectRatio: "608 / 1080",
          animation: "bFadeUp 0.85s ease both",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 32px 80px rgba(74,58,58,0.25), 0 8px 24px rgba(74,58,58,0.12)",
          }}>
            <img
              src={POSTER}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>

          {/* Namen overlay onderaan poster */}
          <div style={{
            position: "absolute",
            bottom: "16%", left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center", width: "78%",
            zIndex: 5, pointerEvents: "none",
          }}>
            <p style={{
              fontFamily: "'Pinyon Script', cursive",
              fontSize: "clamp(20px, 5vw, 28px)",
              color: C.ink900,
              lineHeight: 1.1, margin: 0,
              textShadow: "0 1px 6px rgba(251,248,246,0.7)",
            }}>
              {namen}
            </p>
            {datumLang && (
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 11, color: C.ink700,
                marginTop: 5, letterSpacing: "0.06em",
              }}>
                {datumLang}
              </p>
            )}
          </div>
        </div>

        {/* "Tik om te openen" */}
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 11, letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: C.ink700, marginTop: 24,
          animation: "bPulse 2.4s ease-in-out infinite",
          pointerEvents: "none",
        }}>
          {videoReady ? "Tik om te openen" : "Laden…"}
        </p>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  RENDER: PLAYING  (video fullscreen)
  // ══════════════════════════════════════════════════════════════════════════
  if (phase === "playing") {
    return (
      <div style={{
        position: "fixed", inset: 0,
        background: C.ivory200,        // zelfde als idle achtergrond → geen flash
        zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}>
        <video
          ref={videoRef}
          muted
          playsInline
          poster={POSTER}
          onEnded={handleVideoEnd}
          onError={handleVideoEnd}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
            objectPosition: "center center",
            display: "block",
          }}
        />
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  RENDER: INVITE  (volledige Bloom uitnodiging)
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div style={{ background: C.ivory200, minHeight: "100svh", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap');
        @keyframes bFadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .bfu  { animation: bFadeUp 0.7s ease both; }
        .bfu1 { animation-delay:0.05s } .bfu2 { animation-delay:0.12s }
        .bfu3 { animation-delay:0.20s } .bfu4 { animation-delay:0.28s }
        .bfu5 { animation-delay:0.36s } .bfu6 { animation-delay:0.44s }
        @keyframes barDance { 0%,100%{height:6px} 50%{height:14px} }
        @media(prefers-reduced-motion:reduce){
          .bfu,.bl-reveal{animation:none!important;transition:none!important;opacity:1!important;transform:none!important}
        }
      `}</style>

      {/* ── Music toggle (fixed, cirkel, 3 bars) ────────────────────────── */}
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
          flexShrink: 0,
        }}
      >
        {/* 3 animerende bars */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 14 }}>
          {[0, 0.15, 0.3].map((delay, i) => (
            <div
              key={i}
              style={{
                width: 3, borderRadius: 2,
                background: C.gold500,
                height: musicOn ? 14 : 6,
                animation: musicOn
                  ? `barDance 0.7s ease-in-out ${delay}s infinite`
                  : `barDance 1.8s ease-in-out ${delay * 2}s infinite`,
                opacity: musicOn ? 1 : 0.5,
                transition: "height 0.3s",
              }}
            />
          ))}
        </div>
      </button>

      <div style={{ maxWidth: 520, margin: "0 auto", paddingBottom: 80 }}>

        {/* ════════════════════════════════════════════════════════════════
            HERO  —  header.hero.bl-hero
            originele inset: 26% 22% 32%
        ════════════════════════════════════════════════════════════════ */}
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
          {/* div.bl-panel */}
          <div style={{ position: "absolute", inset: 0 }}>

            {/* Laag 0: cartoncino body */}
            <img src={B.body} alt="" aria-hidden
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />

            {/* Laag 0b: cartoncino line textuur */}
            <img src={B.line} alt="" aria-hidden
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.07, mixBlendMode: "multiply" }} />

            {/* span.bl-panel__ink — rozen, kleur via filter */}
            <span aria-hidden style={{
              position: "absolute", inset: 0,
              backgroundImage: `url(${B.ink})`,
              backgroundSize: "cover", backgroundPosition: "center top",
              filter: ifilter, opacity: 0.88,
            }} />

            {/* span.bl-panel__leaf — bladeren, altijd groen */}
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
              {/* span.eyebrow — delay 0s */}
              <span className="bl-reveal" style={{
                ...reveal(0),
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(7px, 1.8vw, 9px)",
                letterSpacing: "0.28em", textTransform: "uppercase",
                color: C.ink700, display: "block", textAlign: "center",
              }}>
                Met liefde uitgenodigd
              </span>

              {/* h1.hero__names — Pinyon Script, delay 0.45s */}
              <h1 className="bl-reveal" style={{
                ...reveal(0.45),
                fontFamily: "'Pinyon Script', cursive",
                fontSize: "clamp(24px, 7vw, 42px)",
                fontWeight: 400, color: C.ink900,
                textAlign: "center", lineHeight: 1.05,
                margin: 0, letterSpacing: "0.01em",
              }}>
                {namen}
              </h1>

              {/* Wave */}
              <span className="bl-reveal" style={{ ...reveal(0.65), textAlign: "center" }}>
                <img src={B.wave} alt="" aria-hidden
                  style={{ width: "clamp(70px, 40%, 110px)", opacity: 0.30 }} />
              </span>

              {/* p.hero__kicker — delay 0.90s */}
              <p className="bl-reveal" style={{
                ...reveal(0.90),
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(10px, 2.4vw, 13px)",
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: C.ink500, margin: 0, textAlign: "center",
              }}>
                Wij gaan trouwen
              </p>

              {/* div.hero__meta — datum + locatie, delay 1.20s */}
              <div className="bl-reveal" style={{
                ...reveal(1.20),
                display: "flex", flexDirection: "column",
                alignItems: "center", gap: 3,
                marginTop: 2,
              }}>
                {datumLang && (
                  <p style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(9px, 2.2vw, 12px)",
                    color: C.ink700, margin: 0, textAlign: "center",
                    letterSpacing: "0.06em",
                  }}>
                    {datumLang}
                  </p>
                )}
                {(venue || stad) && (
                  <p style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(9px, 2vw, 11px)",
                    color: C.ink500, margin: 0, textAlign: "center",
                    letterSpacing: "0.04em",
                  }}>
                    {venue}{stad ? `, ${stad}` : ""}
                  </p>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Lange strik overgang hero → content */}
        <div className="bl-reveal" style={{
          ...reveal(1.40),
          display: "flex", justifyContent: "center",
          marginTop: -22, position: "relative", zIndex: 10,
        }}>
          <img src={B.lungo} alt="" aria-hidden
            style={{ height: "clamp(52px, 10vw, 76px)", width: "auto", filter: ifilter, opacity: 0.82 }} />
        </div>

        {/* ════ COUNTDOWN ══════════════════════════════════════════════════ */}
        {showCountdown && countdown.days > 0 && (
          <div
            id="countdown"
            ref={el => { sectRefs.current["countdown"] = el; }}
            className="bfu bfu1"
            style={{ margin: "20px 16px 16px", position: "relative", borderRadius: 20, overflow: "hidden" }}
          >
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

        {/* ════ DATUM & LOCATIE ════════════════════════════════════════════ */}
        <div className="bfu bfu2" style={{ margin: "0 16px 16px", background: C.ivory100, borderRadius: 20, padding: "28px 22px", boxShadow: "0 6px 28px rgba(74,58,58,0.07)", position: "relative", overflow: "hidden" }}>
          <img src={B.line} alt="" aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.07, pointerEvents: "none" }} />
          <img src={B.cornice_leaf} alt="" aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", opacity: 0.12, pointerEvents: "none" }} />
          <img src={B.cornice_ink}  alt="" aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", opacity: 0.09, filter: ifilter, pointerEvents: "none" }} />
          <div style={{ position: "relative", textAlign: "center" }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: C.ink500, marginBottom: 8 }}>Datum</p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 21, color: C.ink900, fontWeight: 400, margin: "0 0 4px" }}>{datumLang}</p>
            {weddingTime && <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, color: C.ink700, margin: 0 }}>Aanvang {weddingTime} uur</p>}
            <div style={{ margin: "14px 0" }}>
              <img src={B.wave} alt="" aria-hidden style={{ width: "55%", opacity: 0.22 }} />
            </div>
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

        {/* ════ WELKOMSTBERICHT ════════════════════════════════════════════ */}
        {welcomeMessage && (
          <div className="bfu bfu2" style={{ margin: "0 16px 16px", background: C.ivory100, borderRadius: 20, padding: "24px 22px", boxShadow: "0 4px 20px rgba(74,58,58,0.06)", position: "relative", overflow: "hidden" }}>
            <img src={B.line} alt="" aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.06, pointerEvents: "none" }} />
            <div style={{ position: "relative", textAlign: "center" }}>
              <img src={B.fiocco} alt="" aria-hidden style={{ width: 34, opacity: 0.28, filter: ifilter, marginBottom: 12 }} />
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontStyle: "italic", color: C.ink700, lineHeight: 1.8, margin: 0 }}>"{welcomeMessage}"</p>
              <div style={{ marginTop: 12 }}>
                <img src={B.wave} alt="" aria-hidden style={{ width: "42%", opacity: 0.20 }} />
              </div>
            </div>
          </div>
        )}

        {/* ════ PROGRAMMA ══════════════════════════════════════════════════ */}
        {events.length > 0 && (
          <div
            id="program"
            ref={el => { sectRefs.current["program"] = el; }}
            className="bfu bfu3"
            style={{ margin: "0 16px 16px" }}
          >
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: C.ink500, marginBottom: 12, paddingLeft: 2 }}>Programma</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {events.map(ev => (
                <div key={ev.id} style={{ background: C.ivory100, borderRadius: 16, padding: "16px 18px", boxShadow: "0 2px 12px rgba(74,58,58,0.06)", position: "relative", overflow: "hidden", borderLeft: ev.is_main ? `3px solid ${C.gold500}` : `3px solid transparent` }}>
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

        {/* ════ RSVP ═══════════════════════════════════════════════════════ */}
        {showRsvp && (
          <div
            id="rsvp"
            ref={el => { sectRefs.current["rsvp"] = el; }}
            className="bfu bfu4"
            style={{ margin: "0 16px 16px", position: "relative", borderRadius: 20, overflow: "hidden" }}
          >
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

        {/* Duif decoratie */}
        <div style={{ display: "flex", justifyContent: "center", margin: "16px 0 12px" }}>
          <img src={B.colomba} alt="" aria-hidden style={{ width: 40, opacity: 0.20, filter: ifilter }} />
        </div>

        {/* ════ FOTO ═══════════════════════════════════════════════════════ */}
        {showPhotos && (
          <div
            id="photos"
            ref={el => { sectRefs.current["photos"] = el; }}
            className="bfu bfu5"
            style={{ margin: "0 16px 16px", background: C.ivory100, borderRadius: 20, padding: "24px 22px", boxShadow: "0 4px 20px rgba(74,58,58,0.06)", textAlign: "center", position: "relative", overflow: "hidden" }}
          >
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

        {/* ════ GASTENBOEK ══════════════════════════════════════════════════ */}
        {showMessages && (
          <div
            id="messages"
            ref={el => { sectRefs.current["messages"] = el; }}
            className="bfu bfu6"
            style={{ margin: "0 16px 16px", background: C.ivory100, borderRadius: 20, padding: "24px 22px", boxShadow: "0 4px 20px rgba(74,58,58,0.06)", position: "relative", overflow: "hidden" }}
          >
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
                  <textarea rows={3} value={msgText} onChange={e => setMsgText(e.target.value)} placeholder="Schrijf een persoonlijk bericht voor het bruidspaar..."
                    style={{ ...inp, resize: "vertical", marginBottom: 10, minHeight: 80 }} />
                  <button onClick={submitMessage} disabled={!msgText.trim()} style={{ background: msgText.trim() ? C.gold500 : C.ivory400, color: "white", border: "none", borderRadius: 999, padding: "11px 20px", fontFamily: "'Cormorant Garamond', serif", fontSize: 15, cursor: msgText.trim() ? "pointer" : "default", width: "100%", transition: "background 0.2s" }}>
                    Bericht sturen
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* ════ FOOTER ══════════════════════════════════════════════════════ */}
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

      {/* ════ BOTTOM NAV — fixed, safe-area, animated underline ═════════════ */}
      <nav style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200,
        background: `${C.ivory100}f5`,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderTop: `1px solid ${C.ivory400}`,
        boxShadow: "0 -2px 20px rgba(74,58,58,0.08)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}>
        <div style={{
          display: "flex", justifyContent: "space-around", alignItems: "center",
          height: 52, maxWidth: 520, margin: "0 auto",
        }}>
          {[
            { id: "top",      label: "Home"     },
            { id: "program",  label: "Programma" },
            { id: "rsvp",     label: "RSVP"     },
            { id: "photos",   label: "Foto's"   },
            { id: "messages", label: "Berichten" },
          ].map(({ id, label }) => {
            const active = activeSection === id;
            return (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                style={{
                  background: "none", border: "none",
                  cursor: "pointer", padding: "6px 8px",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", gap: 3,
                  position: "relative",
                }}
              >
                <span style={{
                  fontFamily: "sans-serif",
                  fontSize: 10, letterSpacing: "0.06em",
                  color: active ? C.gold500 : C.ink500,
                  transition: "color 0.2s",
                }}>
                  {label}
                </span>
                {/* animated underline */}
                <span style={{
                  position: "absolute", bottom: 2,
                  left: "50%", transform: "translateX(-50%)",
                  width: active ? "80%" : "0%",
                  height: 1.5, borderRadius: 999,
                  background: C.gold500,
                  transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
                }} />
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
