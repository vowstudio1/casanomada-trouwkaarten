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

  useEffect(() => {
    return () => { audioRef.current?.pause(); };
  }, []);

  const handleOpen = () => {
    if (phase !== "closed") return;
    setPhase("opening");
    if (!audioRef.current) {
      audioRef.current = new Audio(MUSIC_URL);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.35;
    }
    setTimeout(() => {
      setPhase("open");
      audioRef.current?.play().catch(() => {});
      setMusicPlaying(true);
      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: 420, behavior: "smooth" });
      }, 600);
    }, 1000);
  };

  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>

      {/* ── Telefoon ── */}
      {/* Zelfde grote telefoon als Sponsalia: licht frame, groot scherm */}
      <div
        onClick={handleOpen}
        style={{
          position: "relative",
          width: "clamp(240px, 38vw, 380px)",
          cursor: phase === "closed" ? "pointer" : "default",
          userSelect: "none",
        }}
      >
        {/* Telefoon behuizing — licht grijs zoals Sponsalia */}
        <div style={{
          borderRadius: "clamp(28px, 5vw, 44px)",
          background: "linear-gradient(145deg, #d8d3ce 0%, #c8c3be 40%, #b8b3ae 100%)",
          padding: "clamp(6px, 1.2vw, 10px)",
          boxShadow: "0 2px 0 #a09890, 0 32px 64px rgba(0,0,0,0.22), 0 8px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.3)",
        }}>
          {/* Notch / Dynamic Island */}
          <div style={{
            position: "absolute",
            top: "clamp(8px, 1.5vw, 14px)",
            left: "50%",
            transform: "translateX(-50%)",
            width: "clamp(80px, 15vw, 120px)",
            height: "clamp(20px, 3.5vw, 30px)",
            background: "#1a1a1a",
            borderRadius: 999,
            zIndex: 10,
          }} />

          {/* Zijknoppen links */}
          <div style={{ position: "absolute", left: -3, top: "20%", width: 3, height: "8%", background: "#b0aaa4", borderRadius: "3px 0 0 3px" }} />
          <div style={{ position: "absolute", left: -3, top: "30%", width: 3, height: "12%", background: "#b0aaa4", borderRadius: "3px 0 0 3px" }} />
          <div style={{ position: "absolute", left: -3, top: "44%", width: 3, height: "12%", background: "#b0aaa4", borderRadius: "3px 0 0 3px" }} />
          {/* Zijknop rechts */}
          <div style={{ position: "absolute", right: -3, top: "28%", width: 3, height: "18%", background: "#b0aaa4", borderRadius: "0 3px 3px 0" }} />

          {/* Scherm */}
          <div style={{
            borderRadius: "clamp(22px, 4vw, 36px)",
            overflow: "hidden",
            position: "relative",
            aspectRatio: "9/19.5",
            background: "#f9f3ef",
          }}>

            {/* ── GESLOTEN: envelop ── */}
            {phase === "closed" && (
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                background: "#f5ede8",
              }}>
                {/* Envelop */}
                <div style={{ position: "relative", width: "72%", aspectRatio: "5/3.5" }}>
                  {/* Schaduw achter envelop */}
                  <div style={{
                    position: "absolute", inset: 0,
                    borderRadius: 8,
                    boxShadow: "0 8px 32px rgba(139,38,53,0.12), 0 2px 8px rgba(0,0,0,0.08)",
                  }} />
                  {/* Envelop body */}
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "#fff8f5",
                    borderRadius: 8,
                    border: "1px solid #e0cbc3",
                  }} />
                  {/* Flap boven-links */}
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0,
                    height: "52%", overflow: "hidden",
                    borderRadius: "8px 8px 0 0",
                  }}>
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #edddd5 50%, transparent 50%)" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(225deg, #edddd5 50%, transparent 50%)" }} />
                  </div>
                  {/* Flap onder */}
                  <div style={{ position: "absolute", bottom: 0, left: 0, width: "50%", height: "52%", background: "linear-gradient(315deg, #e5cec5 50%, transparent 50%)", borderBottomLeftRadius: 8 }} />
                  <div style={{ position: "absolute", bottom: 0, right: 0, width: "50%", height: "52%", background: "linear-gradient(225deg, #e5cec5 50%, transparent 50%)", borderBottomRightRadius: 8 }} />
                  {/* Lakzegel */}
                  <div style={{
                    position: "absolute",
                    top: "50%", left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 10,
                    width: "clamp(28px, 5vw, 42px)",
                    height: "clamp(28px, 5vw, 42px)",
                    borderRadius: "50%",
                    background: "radial-gradient(circle at 38% 38%, #b03545 0%, #8B2635 50%, #701e2a 100%)",
                    border: "1.5px solid #701e2a",
                    boxShadow: "0 3px 10px rgba(139,38,53,0.4), inset 0 1px 0 rgba(255,200,180,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{
                      color: "#f5ddd8",
                      fontSize: "clamp(8px, 1.5vw, 12px)",
                      fontFamily: "Georgia, serif",
                      fontStyle: "italic",
                      letterSpacing: 0.5,
                    }}>CN</span>
                  </div>
                </div>

                {/* "Tik om te openen" tekst */}
                <p style={{
                  marginTop: "clamp(10px, 2vw, 18px)",
                  fontSize: "clamp(7px, 1.2vw, 10px)",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#8B2635",
                  fontFamily: "sans-serif",
                  opacity: 0.75,
                }}>
                  Tik om te openen
                </p>
              </div>
            )}

            {/* ── OPENING: animatie ── */}
            {phase === "opening" && (
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "#f5ede8",
                zIndex: 5,
              }}>
                <style>{`
                  @keyframes envFlyUp {
                    0%   { transform: scale(1) rotate(0deg) translateY(0); opacity: 1; }
                    40%  { transform: scale(1.1) rotate(-5deg) translateY(-4%); opacity: 1; }
                    100% { transform: scale(0.15) rotate(15deg) translateY(-140%); opacity: 0; }
                  }
                  @keyframes bgFade {
                    0%   { background: #f5ede8; }
                    100% { background: #f9f3ef; }
                  }
                `}</style>
                <div style={{
                  position: "absolute", inset: 0,
                  animation: "bgFade 1s ease forwards",
                }} />
                <div style={{
                  position: "relative",
                  width: "72%", aspectRatio: "5/3.5",
                  background: "#fff8f5",
                  borderRadius: 8,
                  border: "1px solid #e0cbc3",
                  boxShadow: "0 8px 32px rgba(139,38,53,0.18)",
                  animation: "envFlyUp 0.95s cubic-bezier(.4,0,.2,1) forwards",
                  zIndex: 6,
                }} />
              </div>
            )}

            {/* ── OPEN: scrollende uitnodiging ── */}
            {phase === "open" && (
              <>
                <div
                  ref={scrollRef}
                  style={{
                    position: "absolute", inset: 0,
                    overflowY: "auto", overflowX: "hidden",
                    zIndex: 3,
                    WebkitOverflowScrolling: "touch",
                  } as React.CSSProperties}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={BLOOM_IMG}
                    alt="Bloom uitnodiging"
                    style={{ width: "100%", display: "block" }}
                  />
                  {/* Nav bar onderaan zoals echte uitnodiging */}
                  <div style={{
                    background: "#f9f3ef",
                    padding: "10px 8px 16px",
                    borderTop: "1px solid #e0cbc3",
                  }}>
                    <div style={{ display: "flex", gap: 3, justifyContent: "center" }}>
                      {["HOME", "DE LOCATIE", "CADEAUS", "BEVESTIGEN"].map((item) => (
                        <span key={item} style={{
                          fontSize: "clamp(5px, 0.9vw, 7px)",
                          letterSpacing: "0.06em",
                          color: "#8B2635",
                          fontFamily: "sans-serif",
                          padding: "2.5px 4px",
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
                    bottom: "clamp(42px, 8vw, 60px)",
                    right: "clamp(8px, 1.5vw, 12px)",
                    zIndex: 20,
                    width: "clamp(24px, 4vw, 32px)",
                    height: "clamp(24px, 4vw, 32px)",
                    borderRadius: "50%",
                    background: "rgba(249,243,239,0.95)",
                    border: "1px solid #e0cbc3",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                    padding: 0,
                  }}
                  aria-label={musicPlaying ? "Muziek pauzeren" : "Muziek afspelen"}
                >
                  {musicPlaying ? (
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                      <rect x="1" y="1" width="2.5" height="7" rx="0.5" fill="#8B2635" />
                      <rect x="5.5" y="1" width="2.5" height="7" rx="0.5" fill="#8B2635" />
                    </svg>
                  ) : (
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                      <polygon points="1.5,0.5 8,4.5 1.5,8.5" fill="#8B2635" />
                    </svg>
                  )}
                </button>
              </>
            )}

          </div>{/* einde scherm */}
        </div>{/* einde frame */}
      </div>{/* einde telefoon wrapper */}

      {/* Sjabloonnamen */}
      <div style={{
        marginTop: 20,
        display: "flex", flexWrap: "wrap",
        justifyContent: "center",
        gap: "2px 10px",
        maxWidth: "min(420px, 90vw)",
      }}>
        {["Bloom", "Volta Celeste", "Zomertuin", "Villa Aurora", "Het Zwanenmeer", "Villa Cortina", "Minimale Couture", "Betoverd Bos", "Riviera 70", "Italiaanse Aquarel", "Oro Antico", "Tuscany Chic", "Gouden Uur", "De Geheime Tuin", "Tratto d'Inchiostro", "Idillio", "Romantisch Botanisch", "Strawberry Matcha", "Toile de Jouy"].map((name, i, arr) => (
          <span key={i} style={{ fontSize: 11, color: "rgba(100,80,72,0.55)", fontFamily: "sans-serif", cursor: "pointer" }}
            className="hover:text-brand-800 transition-colors">
            {name}{i < arr.length - 1 ? "," : ""}
          </span>
        ))}
      </div>
      <p style={{ fontSize: 10, color: "rgba(100,80,72,0.45)", fontFamily: "sans-serif", marginTop: 6 }}>
        Livevoorbeeld &middot; tik op een sjabloon
      </p>
    </div>
  );
}
