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

  useEffect(() => () => { audioRef.current?.pause(); }, []);

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
      setTimeout(() => scrollRef.current?.scrollTo({ top: 400, behavior: "smooth" }), 600);
    }, 1000);
  };

  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (musicPlaying) { audioRef.current.pause(); setMusicPlaying(false); }
    else { audioRef.current.play().catch(() => {}); setMusicPlaying(true); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>

      {/* Telefoon — max 300px breed, nooit groter dan 45% viewport */}
      <div
        onClick={handleOpen}
        style={{
          position: "relative",
          width: "min(300px, 45vw)",
          cursor: phase === "closed" ? "pointer" : "default",
          userSelect: "none",
        }}
      >
        {/* Frame — lichtgrijs zoals Sponsalia */}
        <div style={{
          borderRadius: "clamp(30px, 5.5vw, 46px)",
          background: "linear-gradient(155deg, #dedad6 0%, #c8c3be 45%, #b5b0ab 100%)",
          padding: "clamp(6px, 1.2vw, 10px)",
          boxShadow: "0 2px 0 #a8a3a0, 0 30px 60px rgba(0,0,0,0.20), 0 8px 20px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.32)",
        }}>
          {/* Dynamic Island */}
          <div style={{
            position: "absolute",
            top: "clamp(8px, 1.5vw, 13px)",
            left: "50%",
            transform: "translateX(-50%)",
            width: "clamp(80px, 15vw, 110px)",
            height: "clamp(20px, 3.5vw, 28px)",
            background: "#1a1a1a",
            borderRadius: 999,
            zIndex: 10,
          }} />
          {/* Zijknoppen links */}
          <div style={{ position: "absolute", left: -3, top: "19%", width: 3, height: "7%", background: "#b0aaa4", borderRadius: "3px 0 0 3px" }} />
          <div style={{ position: "absolute", left: -3, top: "28%", width: 3, height: "10%", background: "#b0aaa4", borderRadius: "3px 0 0 3px" }} />
          <div style={{ position: "absolute", left: -3, top: "40%", width: 3, height: "10%", background: "#b0aaa4", borderRadius: "3px 0 0 3px" }} />
          {/* Knop rechts */}
          <div style={{ position: "absolute", right: -3, top: "27%", width: 3, height: "16%", background: "#b0aaa4", borderRadius: "0 3px 3px 0" }} />

          {/* Scherm */}
          <div style={{
            borderRadius: "clamp(24px, 4.5vw, 38px)",
            overflow: "hidden",
            position: "relative",
            aspectRatio: "9/19.5",
            background: "#f9f3ef",
          }}>

            {/* GESLOTEN: envelop met CN lakzegel */}
            {phase === "closed" && (
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f5ede8" }}>
                <div style={{ position: "relative", width: "72%", aspectRatio: "5/3.5" }}>
                  <div style={{ position: "absolute", inset: 0, borderRadius: 7, background: "#fff8f5", border: "1px solid #ddd0c8", boxShadow: "0 6px 24px rgba(139,38,53,0.10), 0 2px 6px rgba(0,0,0,0.06)" }} />
                  {/* Flap boven */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "52%", overflow: "hidden", borderRadius: "7px 7px 0 0" }}>
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #edddd5 50%, transparent 50%)" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(225deg, #edddd5 50%, transparent 50%)" }} />
                  </div>
                  {/* Flapjes onder */}
                  <div style={{ position: "absolute", bottom: 0, left: 0, width: "50%", height: "52%", background: "linear-gradient(315deg, #e5cec5 50%, transparent 50%)", borderBottomLeftRadius: 7 }} />
                  <div style={{ position: "absolute", bottom: 0, right: 0, width: "50%", height: "52%", background: "linear-gradient(225deg, #e5cec5 50%, transparent 50%)", borderBottomRightRadius: 7 }} />
                  {/* CN lakzegel */}
                  <div style={{
                    position: "absolute", top: "50%", left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 10,
                    width: "clamp(26px, 5vw, 36px)", height: "clamp(26px, 5vw, 36px)",
                    borderRadius: "50%",
                    background: "radial-gradient(circle at 38% 38%, #b03545 0%, #8B2635 50%, #701e2a 100%)",
                    border: "1.5px solid #701e2a",
                    boxShadow: "0 2px 10px rgba(139,38,53,0.38)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ color: "#f5ddd8", fontSize: "clamp(7px, 1.3vw, 10px)", fontFamily: "serif", fontStyle: "italic" }}>CN</span>
                  </div>
                </div>
                <p style={{ marginTop: "clamp(10px, 2vw, 16px)", fontSize: "clamp(6px, 1.1vw, 9px)", letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#8B2635", fontFamily: "sans-serif", opacity: 0.72 }}>
                  Tik om te openen
                </p>
              </div>
            )}

            {/* OPENING: animatie */}
            {phase === "opening" && (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#f5ede8", zIndex: 5 }}>
                <style>{`@keyframes envFlyHero{0%{transform:scale(1) rotate(0deg) translateY(0);opacity:1}40%{transform:scale(1.1) rotate(-5deg) translateY(-5%);opacity:1}100%{transform:scale(0.12) rotate(15deg) translateY(-150%);opacity:0}}`}</style>
                <div style={{ width: "72%", aspectRatio: "5/3.5", background: "#fff8f5", borderRadius: 7, border: "1px solid #ddd0c8", boxShadow: "0 8px 32px rgba(139,38,53,0.18)", animation: "envFlyHero 0.95s cubic-bezier(.4,0,.2,1) forwards" }} />
              </div>
            )}

            {/* OPEN: uitnodiging scrollt */}
            {phase === "open" && (
              <>
                <div ref={scrollRef} style={{ position: "absolute", inset: 0, overflowY: "auto", overflowX: "hidden", zIndex: 3, WebkitOverflowScrolling: "touch" } as React.CSSProperties}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={BLOOM_IMG} alt="Bloom uitnodiging" style={{ width: "100%", display: "block" }} />
                  <div style={{ background: "#f9f3ef", padding: "10px 8px 16px", borderTop: "1px solid #e0cbc3" }}>
                    <div style={{ display: "flex", gap: 3, justifyContent: "center" }}>
                      {["HOME", "DE LOCATIE", "CADEAUS", "BEVESTIGEN"].map((item) => (
                        <span key={item} style={{ fontSize: "clamp(5px, 0.9vw, 7px)", letterSpacing: "0.06em", color: "#8B2635", fontFamily: "sans-serif", padding: "2.5px 4px", border: "0.5px solid #d4b9b0", borderRadius: 3 }}>{item}</span>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Muziek knop */}
                <button onClick={toggleMusic} style={{ position: "absolute", bottom: "clamp(42px, 8vw, 60px)", right: "clamp(7px, 1.3vw, 11px)", zIndex: 20, width: "clamp(24px, 4vw, 30px)", height: "clamp(24px, 4vw, 30px)", borderRadius: "50%", background: "rgba(249,243,239,0.95)", border: "1px solid #ddd0c8", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 6px rgba(0,0,0,0.10)", padding: 0 }} aria-label={musicPlaying ? "Pauzeren" : "Afspelen"}>
                  {musicPlaying
                    ? <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><rect x="1" y="1" width="2" height="6" rx="0.5" fill="#8B2635"/><rect x="5" y="1" width="2" height="6" rx="0.5" fill="#8B2635"/></svg>
                    : <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><polygon points="1.5,0.5 7.5,4 1.5,7.5" fill="#8B2635"/></svg>}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Sjabloonnamen */}
      <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2px 8px", maxWidth: "min(380px, 90vw)" }}>
        {["Bloom", "Volta Celeste", "Zomertuin", "Villa Aurora", "Het Zwanenmeer", "Villa Cortina", "Minimale Couture", "Betoverd Bos"].map((name, i, arr) => (
          <span key={i} style={{ fontSize: 11, color: "rgba(90,85,80,0.5)", fontFamily: "sans-serif" }}>
            {name}{i < arr.length - 1 ? "," : ""}
          </span>
        ))}
      </div>
      <p style={{ fontSize: 10, color: "rgba(90,85,80,0.4)", fontFamily: "sans-serif", marginTop: 5 }}>
        {phase === "closed" ? "Livevoorbeeld · tik op een sjabloon" : `Livepreview · Bloom`}
      </p>
    </div>
  );
}
