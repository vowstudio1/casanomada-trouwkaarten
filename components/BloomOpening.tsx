"use client";

/**
 * BloomOpening — officiële Bloom opening via MP4
 *
 * Flow:
 *  idle    → gesloten envelop (avorio_rosa-poster.jpg + strik + duif)
 *            gebruiker tikt/klikt
 *  playing → MP4 bloom-opening.mp4 speelt exact 1x af (4.584s, 1216×1080)
 *            video loopt naadloos vanuit de gesloten compositie
 *  done    → fade naar uitnodiging (geen witte/zwarte flits)
 *
 * prefers-reduced-motion: video overgeslagen, direct onComplete()
 * Audio: geen — muziek is een apart systeem
 */

import { useState, useEffect, useRef, useCallback } from "react";

const ASSETS = {
  poster:  "/assets/templates/bloom/avorio_rosa-poster.jpg",
  video:   "/assets/templates/bloom/bloom-opening.mp4",
  fiocco:  "/assets/templates/bloom/bl-fiocco-ink.webp",
  lungo:   "/assets/templates/bloom/bl-fiocco-lungo-ink.webp",
  colomba: "/assets/templates/bloom/bl-colomba-ink.webp",
};

// Video aspect ratio: 1216/1080 = 1.126 (iets breder dan vierkant)
const VIDEO_RATIO = 1216 / 1080;

type Phase = "idle" | "playing" | "done";

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
  const [videoReady,    setVideoReady]    = useState(false);
  const [fadeOut,       setFadeOut]       = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Detecteer prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
  }, []);

  // Preload video zodra component mount
  useEffect(() => {
    const v = document.createElement("video");
    v.src = ASSETS.video;
    v.preload = "auto";
    v.muted = true;
    v.playsInline = true;
    v.oncanplaythrough = () => setVideoReady(true);
    v.load();
  }, []);

  // Video-einde handler
  const handleVideoEnd = useCallback(() => {
    // Start fade-out (150ms) dan onComplete
    setFadeOut(true);
    setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 180);
  }, [onComplete]);

  // Tap/klik handler
  const handleTap = () => {
    if (phase !== "idle") return;

    // prefers-reduced-motion: sla video over
    if (reducedMotion) {
      onComplete();
      return;
    }

    setPhase("playing");

    // Wacht één frame zodat video-element gerenderd is
    requestAnimationFrame(() => {
      const v = videoRef.current;
      if (!v) { onComplete(); return; }
      v.currentTime = 0;
      v.play().catch(() => {
        // Autoplay geblokkeerd: ga direct door
        onComplete();
      });
    });
  };

  // Kleurfilter voor strik/lint (bordeaux default)
  const inkFilter = (() => {
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
  })();

  return (
    <div
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(175deg, #fdf6f4 0%, #f5e8e0 55%, #edddd5 100%)",
        padding: "24px 20px 48px",
        userSelect: "none",
        WebkitUserSelect: "none",
        // Fade-out naar de achtergrondkleur van de uitnodiging
        opacity: fadeOut ? 0 : 1,
        transition: fadeOut ? "opacity 0.18s ease" : "none",
      }}
    >
      <style>{`
        @keyframes bloomFadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bloomPulse   { 0%,100%{opacity:0.4} 50%{opacity:0.9} }
        @keyframes colombaFloat { 0%,100%{transform:translateY(0) rotate(-4deg)} 50%{transform:translateY(-7px) rotate(4deg)} }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration:0.01ms !important; transition-duration:0.01ms !important; }
        }
      `}</style>

      {/* ═══ IDLE — gesloten envelop compositie ═══════════════════════════ */}
      {phase === "idle" && (
        <>
          <div
            onClick={handleTap}
            style={{
              position: "relative",
              width: "min(320px, 86vw)",
              aspectRatio: "608 / 1080",
              cursor: "pointer",
              animation: "bloomFadeUp 0.85s ease both",
            }}
          >
            {/* Envelop body */}
            <div style={{
              position: "absolute", inset: 0,
              borderRadius: 18,
              overflow: "hidden",
              boxShadow: "0 28px 72px rgba(0,0,0,0.22), 0 6px 20px rgba(0,0,0,0.10)",
            }}>
              <img
                src={ASSETS.poster}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>

            {/* Lang lint — verticaal over envelop */}
            <div style={{
              position: "absolute",
              top: "18%", bottom: "12%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "9%",
              zIndex: 8,
              pointerEvents: "none",
            }}>
              <img
                src={ASSETS.lungo}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "contain", filter: inkFilter, display: "block" }}
              />
            </div>

            {/* Korte strikknoop — over lint */}
            <div style={{
              position: "absolute",
              top: "34%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "36%",
              zIndex: 9,
              pointerEvents: "none",
            }}>
              <img
                src={ASSETS.fiocco}
                alt="strik"
                style={{ width: "100%", display: "block", filter: inkFilter }}
              />
            </div>

            {/* Duif rechtsboven */}
            <div style={{
              position: "absolute",
              top: "7%", right: "9%",
              width: "15%",
              zIndex: 7,
              animation: "colombaFloat 3.5s ease-in-out infinite",
              pointerEvents: "none",
            }}>
              <img
                src={ASSETS.colomba}
                alt=""
                style={{ width: "100%", display: "block", filter: inkFilter, opacity: 0.28 }}
              />
            </div>

            {/* Namen + datum */}
            <div style={{
              position: "absolute",
              bottom: "17%",
              left: "50%",
              transform: "translateX(-50%)",
              textAlign: "center",
              width: "74%",
              zIndex: 6,
              pointerEvents: "none",
            }}>
              <p style={{
                fontFamily: "serif",
                fontSize: "clamp(14px, 3.8vw, 20px)",
                color,
                lineHeight: 1.2,
                margin: 0,
                textShadow: "0 1px 6px rgba(255,255,255,0.7)",
              }}>
                {namen}
              </p>
              {datumLang && (
                <p style={{ fontFamily: "sans-serif", fontSize: 10, color: "#6b6560", marginTop: 5, letterSpacing: "0.04em" }}>
                  {datumLang}
                </p>
              )}
            </div>
          </div>

          {/* "Tik om te openen" */}
          <p style={{
            fontFamily: "sans-serif", fontSize: 10,
            letterSpacing: "0.22em", textTransform: "uppercase",
            color, marginTop: 24,
            animation: "bloomPulse 2.4s ease-in-out infinite",
            pointerEvents: "none",
          }}>
            {videoReady ? "Tik om te openen" : "Laden…"}
          </p>
        </>
      )}

      {/* ═══ PLAYING — MP4 video ═══════════════════════════════════════════ */}
      {phase === "playing" && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "#f5ede8",          // zelfde als uitnodigingsachtergrond
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
        }}>
          <video
            ref={videoRef}
            src={ASSETS.video}
            muted
            playsInline
            onEnded={handleVideoEnd}
            onError={handleVideoEnd}       // bij fout: ga gewoon door
            style={{
              // Vul het scherm, behoud compositie
              width: "100%",
              height: "100%",
              objectFit: "cover",
              // Video is 1216×1080 (iets breder dan vierkant).
              // Op smal mobiel (staand): cover zodat het beeld vult.
              // Op breed desktop: idem. Compositie blijft intact.
              objectPosition: "center center",
              display: "block",
            }}
          />
        </div>
      )}

      {/* phase === "done": leeg — onComplete() heeft de parent al geswitched */}
    </div>
  );
}
