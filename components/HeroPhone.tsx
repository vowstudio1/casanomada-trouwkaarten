"use client";

import { useState, useRef, useEffect } from "react";

const BLOOM_IMG = "https://sponsalia.app/_next/image?url=%2Fassets%2Fmarketing%2Ftemplates%2Fbloom-en-vetrina-96e6b193.jpg&w=1200&q=75";
const MUSIC_URL = "https://cdn.pixabay.com/audio/2023/11/10/audio_d4d18e7aa3.mp3";

type Phase = "closed" | "opening" | "open";

export default function HeroPhone() {
  const [phase, setPhase] = useState<Phase>("closed");
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Audio alleen aanmaken na user interaction (iOS/browser beleid)
  const ensureAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(MUSIC_URL);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.35;
    }
  };

  useEffect(() => {
    return () => { audioRef.current?.pause(); };
  }, []);

  const handleOpen = () => {
    if (phase !== "closed") return;
    setPhase("opening");
    ensureAudio();
    setTimeout(() => {
      setPhase("open");
      audioRef.current?.play().catch(() => {});
      setMusicPlaying(true);
      // Auto-scroll na korte vertraging
      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: 350, behavior: "smooth" });
      }, 500);
    }, 900);
  };

  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    ensureAudio();
    if (!audioRef.current) return;
    if (musicPlaying) {
      audioRef.current.pause();
      setMusicPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setMusicPlaying(true);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Telefoon — vaste breedte, nooit overflow */}
      <div
        className="relative cursor-pointer select-none"
        style={{ width: "min(200px, 42vw)" }}
        onClick={handleOpen}
        role="button"
        aria-label="Tik om de demo te starten"
      >
        {/* Buitenste frame */}
        <div
          className="rounded-[2rem] shadow-2xl"
          style={{
            background: "#16161D",
            padding: "5px",
            boxShadow: "0 24px 48px rgba(0,0,0,0.35)",
          }}
        >
          {/* Notch */}
          <div
            className="absolute z-10 rounded-full"
            style={{
              top: 7,
              left: "50%",
              transform: "translateX(-50%)",
              width: 64,
              height: 18,
              background: "#16161D",
            }}
          />

          {/* Scherm */}
          <div
            className="rounded-[1.7rem] overflow-hidden relative"
            style={{ aspectRatio: "9/19.5", background: "#f9f3ef" }}
          >

            {/* ── FASE GESLOTEN: envelop ── */}
            {phase === "closed" && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{ background: "#f9f3ef" }}
              >
                {/* Envelop */}
                <div style={{ position: "relative", width: "75%", aspectRatio: "5/3.5" }}>
                  {/* Body */}
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "#fff8f5",
                    borderRadius: 6,
                    border: "1px solid #e2cfc7",
                    boxShadow: "0 4px 16px rgba(139,38,53,0.10)",
                  }} />
                  {/* Flap links-omhoog */}
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0,
                    height: "52%", overflow: "hidden", borderRadius: "6px 6px 0 0",
                  }}>
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(135deg, #edddd5 50%, transparent 50%)",
                    }} />
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(225deg, #edddd5 50%, transparent 50%)",
                    }} />
                  </div>
                  {/* Flap links-omlaag */}
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, width: "50%", height: "52%",
                    background: "linear-gradient(315deg, #e5cec5 50%, transparent 50%)",
                    borderBottomLeftRadius: 6,
                  }} />
                  <div style={{
                    position: "absolute", bottom: 0, right: 0, width: "50%", height: "52%",
                    background: "linear-gradient(225deg, #e5cec5 50%, transparent 50%)",
                    borderBottomRightRadius: 6,
                  }} />
                  {/* Lakzegel */}
                  <div style={{
                    position: "absolute",
                    top: "50%", left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 10,
                    width: 28, height: 28,
                    borderRadius: "50%",
                    background: "radial-gradient(circle at 40% 40%, #a03040 0%, #7a1e2c 70%)",
                    border: "1.5px solid #6a1520",
                    boxShadow: "0 2px 8px rgba(139,38,53,0.35)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ color: "#f5ddd8", fontSize: 8, fontFamily: "serif", fontStyle: "italic", letterSpacing: 0.5 }}>CN</span>
                  </div>
                </div>
                {/* Label */}
                <p style={{
                  marginTop: 12,
                  fontSize: 7,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#8B2635",
                  fontFamily: "sans-serif",
                  opacity: 0.7,
                }}>
                  Tik om te openen
                </p>
              </div>
            )}

            {/* ── FASE OPENING: animatie ── */}
            {phase === "opening" && (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: "#f9f3ef", zIndex: 5 }}
              >
                <style>{`
                  @keyframes envFly {
                    0%   { transform: scale(1) rotate(0deg) translateY(0); opacity: 1; }
                    50%  { transform: scale(1.08) rotate(-4deg) translateY(-5%); opacity: 1; }
                    100% { transform: scale(0.2) rotate(12deg) translateY(-120%); opacity: 0; }
                  }
                `}</style>
                <div style={{
                  width: "75%", aspectRatio: "5/3.5",
                  background: "#fff8f5",
                  borderRadius: 6,
                  border: "1px solid #e2cfc7",
                  boxShadow: "0 8px 32px rgba(139,38,53,0.18)",
                  animation: "envFly 0.85s cubic-bezier(.4,0,.2,1) forwards",
                }} />
              </div>
            )}

            {/* ── FASE OPEN: scrollende uitnodiging ── */}
            {phase === "open" && (
              <>
                <div
                  ref={scrollRef}
                  className="absolute inset-0 overflow-y-auto overflow-x-hidden"
                  style={{ zIndex: 3, WebkitOverflowScrolling: "touch" } as React.CSSProperties}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={BLOOM_IMG}
                    alt="Bloom uitnodiging"
                    style={{ width: "100%", display: "block" }}
                  />
                  {/* Nav balk onderaan (zoals de echte uitnodiging) */}
                  <div style={{
                    background: "#f9f3ef",
                    padding: "10px 8px 14px",
                    borderTop: "1px solid #e2cfc7",
                  }}>
                    <div style={{ display: "flex", gap: 3, justifyContent: "center" }}>
                      {["HOME", "DE LOCATIE", "CADEAUS", "BEVESTIGEN"].map((item) => (
                        <span key={item} style={{
                          fontSize: 5.5,
                          letterSpacing: "0.06em",
                          color: "#8B2635",
                          fontFamily: "sans-serif",
                          padding: "2.5px 3.5px",
                          border: "0.5px solid #d4b9b0",
                          borderRadius: 3,
                        }}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Muziek knop */}
                <button
                  onClick={toggleMusic}
                  style={{
                    position: "absolute",
                    bottom: 46,
                    right: 8,
                    zIndex: 20,
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: "rgba(249,243,239,0.95)",
                    border: "1px solid #e2cfc7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                  }}
                  aria-label={musicPlaying ? "Muziek pauzeren" : "Muziek afspelen"}
                >
                  {musicPlaying ? (
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <rect x="1" y="1" width="2" height="6" rx="0.5" fill="#8B2635" />
                      <rect x="5" y="1" width="2" height="6" rx="0.5" fill="#8B2635" />
                    </svg>
                  ) : (
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <polygon points="1.5,0.5 7.5,4 1.5,7.5" fill="#8B2635" />
                    </svg>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Sjabloonnamen */}
      <div className="mt-5 flex flex-wrap justify-center gap-x-2 gap-y-1" style={{ maxWidth: "min(300px, 85vw)" }}>
        {["Bloom", "Volta Celeste", "Zomertuin", "Villa Aurora", "Het Zwanenmeer", "Villa Cortina", "Minimale Couture", "Betoverd Bos"].map((name, i, arr) => (
          <span key={i} className="font-sans text-text-muted/60 hover:text-brand-800 cursor-pointer transition-colors" style={{ fontSize: 11 }}>
            {name}{i < arr.length - 1 ? "," : ""}
          </span>
        ))}
      </div>
      <p className="font-sans text-text-muted/50 mt-1.5" style={{ fontSize: 10 }}>
        {phase === "closed" ? "Tik op de telefoon voor een livepreview" : "Livevoorbeeld · tik op een sjabloon"}
      </p>
    </div>
  );
}
