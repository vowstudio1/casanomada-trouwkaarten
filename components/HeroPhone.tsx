"use client";

import { useState, useRef, useEffect } from "react";

const BLOOM_IMG = "https://sponsalia.app/_next/image?url=%2Fassets%2Fmarketing%2Ftemplates%2Fbloom-en-vetrina-96e6b193.jpg&w=1200&q=75";
const MUSIC_URL = "https://cdn.pixabay.com/audio/2023/11/10/audio_d4d18e7aa3.mp3";

export default function HeroPhone() {
  const [phase, setPhase] = useState<"closed" | "opening" | "open">("closed");
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(MUSIC_URL);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;
    return () => { audioRef.current?.pause(); };
  }, []);

  const handleClick = () => {
    if (phase !== "closed") return;
    setPhase("opening");
    setTimeout(() => {
      setPhase("open");
      audioRef.current?.play().catch(() => {});
      setMusicPlaying(true);
      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: 380, behavior: "smooth" });
      }, 600);
    }, 900);
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
    <div className="flex flex-col items-center">
      <div
        className="relative w-[200px] md:w-[220px] lg:w-[240px] cursor-pointer select-none"
        onClick={handleClick}
      >
        <div className="rounded-[2.2rem] bg-[#16161D] p-[5px] shadow-2xl shadow-black/25">
          <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[80px] h-[22px] bg-[#16161D] rounded-full z-10" />
          <div
            className="rounded-[1.9rem] overflow-hidden relative bg-[#f5ede8]"
            style={{ aspectRatio: "9/19.5" }}
          >
            {/* GESLOTEN: envelop */}
            {phase === "closed" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#f9f3ef]">
                <div className="relative w-[80%]" style={{ aspectRatio: "4/3" }}>
                  {/* Envelop body */}
                  <div className="absolute inset-0 rounded-lg shadow-md" style={{ background: "#fff8f4", border: "1px solid #e8d5c8" }} />
                  {/* Flap links */}
                  <div className="absolute inset-0 overflow-hidden rounded-lg">
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(135deg, #edddd4 50%, transparent 50%)" }} />
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(225deg, #edddd4 50%, transparent 50%)" }} />
                    <div style={{ position: "absolute", bottom: 0, left: 0, width: "50%", height: "50%", background: "linear-gradient(315deg, #e8d5c8 50%, transparent 50%)" }} />
                    <div style={{ position: "absolute", bottom: 0, right: 0, width: "50%", height: "50%", background: "linear-gradient(225deg, #e8d5c8 50%, transparent 50%)" }} />
                  </div>
                  {/* Lakzegel */}
                  <div className="absolute z-10 flex items-center justify-center rounded-full shadow"
                    style={{ width: 32, height: 32, top: "calc(50% - 16px)", left: "50%", transform: "translateX(-50%)", background: "radial-gradient(circle, #8B2635 60%, #6B1D2A 100%)", border: "1.5px solid #6B1D2A" }}>
                    <span style={{ color: "#f5e6dc", fontSize: 9, fontFamily: "serif", fontStyle: "italic" }}>CN</span>
                  </div>
                </div>
                <p style={{ marginTop: 14, fontSize: 8, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8B2635", fontFamily: "sans-serif", opacity: 0.75 }}>
                  Tik om te openen
                </p>
              </div>
            )}

            {/* OPENING: animatie */}
            {phase === "opening" && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#f9f3ef]" style={{ zIndex: 5 }}>
                <style>{`
                  @keyframes envOpen {
                    0%   { transform: scale(1) rotate(0deg); opacity: 1; }
                    45%  { transform: scale(1.06) rotate(-3deg); opacity: 1; }
                    100% { transform: scale(0.25) rotate(10deg) translateY(-80px); opacity: 0; }
                  }
                `}</style>
                <div style={{
                  width: "80%", aspectRatio: "4/3", background: "#fff8f4",
                  borderRadius: 8, border: "1px solid #e8d5c8",
                  animation: "envOpen 0.9s ease forwards",
                  boxShadow: "0 8px 32px rgba(139,38,53,0.18)",
                }} />
              </div>
            )}

            {/* OPEN: scrollende uitnodiging */}
            {phase === "open" && (
              <>
                <div ref={scrollRef} className="absolute inset-0 overflow-y-auto" style={{ zIndex: 3 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={BLOOM_IMG} alt="Bloom uitnodiging" className="w-full block" />
                  {/* Navigatie balk onderaan */}
                  <div style={{ background: "#f9f3ef", padding: "12px 10px 16px", borderTop: "1px solid #e8d5c8" }}>
                    <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                      {["HOME", "DE LOCATIE", "CADEAUS", "BEVESTIGEN"].map((item) => (
                        <span key={item} style={{ fontSize: 6, letterSpacing: "0.08em", color: "#8B2635", fontFamily: "sans-serif", padding: "3px 4px", border: "0.5px solid #e8d5c8", borderRadius: 3 }}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Muziek knop */}
                <button
                  onClick={toggleMusic}
                  className="absolute z-20 rounded-full flex items-center justify-center shadow"
                  style={{ bottom: 52, right: 10, width: 26, height: 26, background: "rgba(249,243,239,0.95)", border: "1px solid #e8d5c8" }}
                  aria-label={musicPlaying ? "Muziek pauzeren" : "Muziek afspelen"}
                >
                  {musicPlaying ? (
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                      <rect x="1" y="1" width="2.5" height="7" rx="0.5" fill="#8B2635" />
                      <rect x="5.5" y="1" width="2.5" height="7" rx="0.5" fill="#8B2635" />
                    </svg>
                  ) : (
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                      <polygon points="1.5,0.5 8.5,4.5 1.5,8.5" fill="#8B2635" />
                    </svg>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Sjabloonnamen */}
      <div className="mt-6 flex flex-wrap justify-center gap-x-3 gap-y-1 max-w-[320px]">
        {["Bloom", "Volta Celeste", "Zomertuin", "Villa Aurora", "Het Zwanenmeer", "Villa Cortina", "Minimale Couture", "Betoverd Bos"].map((name, i, arr) => (
          <span key={i} className="font-sans text-[12px] text-text-muted/60 hover:text-brand-800 cursor-pointer transition-colors">
            {name}{i < arr.length - 1 ? "," : ""}
          </span>
        ))}
      </div>
      <p className="font-sans text-[11px] text-text-muted/50 mt-2">
        {phase === "closed" ? "Tik op de telefoon voor een livepreview" : "Livevoorbeeld · tik op een sjabloon"}
      </p>
    </div>
  );
}
