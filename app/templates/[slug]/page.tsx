"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, ArrowRight, Check, Music } from "lucide-react";
import { getTemplate, templates } from "@/lib/templates";

export default function TemplateDetailPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const template = getTemplate(slug);

  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedMusic, setSelectedMusic] = useState(0);
  const [demoPhase, setDemoPhase] = useState<"closed" | "opening" | "open">("closed");
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const MUSIC_URL = "https://cdn.pixabay.com/audio/2023/11/10/audio_d4d18e7aa3.mp3";

  useEffect(() => {
    setDemoPhase("closed");
    setMusicPlaying(false);
    audioRef.current?.pause();
  }, [slug]);

  useEffect(() => {
    return () => { audioRef.current?.pause(); };
  }, []);

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-serif text-2xl text-[#16161D] mb-4">Sjabloon niet gevonden</p>
          <Link href="/templates" className="text-brand-800 underline font-sans">← Terug naar sjablonen</Link>
        </div>
      </div>
    );
  }

  const handleDemoOpen = () => {
    if (demoPhase !== "closed") return;
    setDemoPhase("opening");
    if (!audioRef.current) {
      audioRef.current = new Audio(MUSIC_URL);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.35;
    }
    setTimeout(() => {
      setDemoPhase("open");
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

  // Vind vorige/volgende sjabloon
  const currentIdx = templates.findIndex((t) => t.slug === slug);
  const prevTemplate = currentIdx > 0 ? templates[currentIdx - 1] : null;
  const nextTemplate = currentIdx < templates.length - 1 ? templates[currentIdx + 1] : null;

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-sans text-[16px] font-semibold tracking-[0.2em] uppercase text-[#16161D]">Casa Nomada</Link>
          <div className="flex items-center gap-4">
            <Link href="/templates" className="text-[13px] text-text-muted hover:text-[#16161D] transition-colors font-sans flex items-center gap-1.5">
              <ArrowLeft size={14} /> Alle sjablonen
            </Link>
            <Link href={`/editor/${slug}`} className="text-[13px] bg-brand-800 text-white px-5 py-2.5 rounded-full hover:bg-brand-700 transition-colors font-sans tracking-[0.1em] uppercase">
              Maak je uitnodiging
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-16 items-start">

            {/* Links: info */}
            <div>
              {/* Broodkruimel */}
              <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-text-muted mb-3">
                <Link href="/templates" className="hover:text-brand-800 transition-colors">Sjablonen</Link>
                {" · "}{template.name}
              </p>

              {/* Tagline */}
              <p className="font-sans text-[12px] tracking-[0.15em] uppercase text-brand-800 mb-2 font-semibold">
                {template.tagline}
              </p>

              {/* Naam */}
              <h1 className="font-serif text-[3.5rem] text-[#16161D] mb-6 leading-tight">{template.name}</h1>

              {/* Beschrijving */}
              <p className="font-sans text-text-muted leading-relaxed mb-8 text-[15px]">{template.description}</p>

              {/* Features */}
              <ul className="space-y-3 mb-10">
                {template.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 font-sans text-sm text-text-muted">
                    <Check size={15} className="text-brand-700 shrink-0 mt-0.5" />{f}
                  </li>
                ))}
              </ul>

              {/* CTA knoppen */}
              <div className="flex flex-col sm:flex-row gap-3 mb-12">
                <Link href={`/editor/${slug}`} className="inline-flex items-center justify-center gap-2 bg-brand-800 text-white rounded-full px-7 py-3.5 font-sans text-[15px] font-medium hover:bg-brand-700 transition-colors">
                  Maak je trouwkaart<ArrowRight size={16} />
                </Link>
                <button
                  onClick={handleDemoOpen}
                  className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-[#16161D] rounded-full px-7 py-3.5 font-sans text-[15px] font-medium hover:border-brand-800 hover:text-brand-800 transition-colors"
                >
                  Bekijk de live demo
                </button>
              </div>

              {/* Omslag keuze */}
              <div className="mb-8">
                <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-text-muted mb-3">Omslag</p>
                <div className="flex gap-2 flex-wrap">
                  {[0, 1, 2, 3].map((i) => i < 4 && (
                    <button
                      key={i}
                      onClick={() => { setSelectedColor(i); setDemoPhase("closed"); }}
                      className={`rounded-xl overflow-hidden border-2 transition-all ${selectedColor === i ? "border-brand-800 scale-105" : "border-gray-200 hover:border-gray-300"}`}
                      style={{ width: 64, height: 80 }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={template.img} alt={`Variant ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Kleurenkeuze */}
              <div className="mb-8">
                <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-text-muted mb-3">Kleuren</p>
                <div className="flex gap-2 flex-wrap">
                  {template.colors.map((color, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(i)}
                      className={`px-4 py-2 rounded-full border font-sans text-sm transition-all ${selectedColor === i ? "border-brand-800 bg-brand-800 text-white" : "border-gray-200 text-text-muted hover:border-brand-800 hover:text-brand-800"}`}
                    >
                      {color.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Muziekkeuze */}
              <div className="mb-10">
                <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-text-muted mb-3">Muziek</p>
                <div className="flex items-center gap-2">
                  <Music size={14} className="text-text-muted" />
                  <select
                    value={selectedMusic}
                    onChange={(e) => setSelectedMusic(Number(e.target.value))}
                    className="font-sans text-sm text-[#16161D] border border-gray-200 rounded-full px-4 py-2 bg-white focus:outline-none focus:border-brand-800"
                  >
                    {template.music.map((m, i) => (
                      <option key={i} value={i}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Rechts: telefoon preview */}
            <div className="flex flex-col items-center sticky top-24">
              {/* Telefoon */}
              <div
                onClick={handleDemoOpen}
                style={{
                  position: "relative",
                  width: "clamp(240px, 35vw, 340px)",
                  cursor: demoPhase === "closed" ? "pointer" : "default",
                  userSelect: "none",
                }}
              >
                {/* Frame */}
                <div style={{
                  borderRadius: "clamp(28px, 5vw, 44px)",
                  background: "linear-gradient(145deg, #d8d3ce 0%, #c8c3be 40%, #b8b3ae 100%)",
                  padding: "clamp(6px, 1.2vw, 10px)",
                  boxShadow: "0 2px 0 #a09890, 0 32px 64px rgba(0,0,0,0.2), 0 8px 24px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.3)",
                }}>
                  {/* Notch */}
                  <div style={{
                    position: "absolute", top: "clamp(8px,1.5vw,14px)", left: "50%",
                    transform: "translateX(-50%)",
                    width: "clamp(80px,15vw,110px)", height: "clamp(20px,3.5vw,28px)",
                    background: "#1a1a1a", borderRadius: 999, zIndex: 10,
                  }} />
                  {/* Knoppen */}
                  <div style={{ position: "absolute", left: -3, top: "20%", width: 3, height: "7%", background: "#b0aaa4", borderRadius: "3px 0 0 3px" }} />
                  <div style={{ position: "absolute", left: -3, top: "29%", width: 3, height: "11%", background: "#b0aaa4", borderRadius: "3px 0 0 3px" }} />
                  <div style={{ position: "absolute", left: -3, top: "42%", width: 3, height: "11%", background: "#b0aaa4", borderRadius: "3px 0 0 3px" }} />
                  <div style={{ position: "absolute", right: -3, top: "28%", width: 3, height: "16%", background: "#b0aaa4", borderRadius: "0 3px 3px 0" }} />

                  {/* Scherm */}
                  <div style={{
                    borderRadius: "clamp(22px,4vw,36px)",
                    overflow: "hidden", position: "relative",
                    aspectRatio: "9/19.5", background: "#f9f3ef",
                  }}>

                    {/* GESLOTEN */}
                    {demoPhase === "closed" && (
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f5ede8" }}>
                        <div style={{ position: "relative", width: "72%", aspectRatio: "5/3.5" }}>
                          <div style={{ position: "absolute", inset: 0, borderRadius: 8, background: "#fff8f5", border: "1px solid #e0cbc3", boxShadow: "0 8px 32px rgba(139,38,53,0.12)" }} />
                          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "52%", overflow: "hidden", borderRadius: "8px 8px 0 0" }}>
                            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #edddd5 50%, transparent 50%)" }} />
                            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(225deg, #edddd5 50%, transparent 50%)" }} />
                          </div>
                          <div style={{ position: "absolute", bottom: 0, left: 0, width: "50%", height: "52%", background: "linear-gradient(315deg, #e5cec5 50%, transparent 50%)", borderBottomLeftRadius: 8 }} />
                          <div style={{ position: "absolute", bottom: 0, right: 0, width: "50%", height: "52%", background: "linear-gradient(225deg, #e5cec5 50%, transparent 50%)", borderBottomRightRadius: 8 }} />
                          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 10, width: 32, height: 32, borderRadius: "50%", background: "radial-gradient(circle at 38% 38%, #b03545 0%, #8B2635 50%, #701e2a 100%)", border: "1.5px solid #701e2a", boxShadow: "0 3px 10px rgba(139,38,53,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ color: "#f5ddd8", fontSize: 9, fontFamily: "serif", fontStyle: "italic" }}>CN</span>
                          </div>
                        </div>
                        <p style={{ marginTop: 14, fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#8B2635", fontFamily: "sans-serif", opacity: 0.75 }}>Tik om te openen</p>
                      </div>
                    )}

                    {/* OPENING */}
                    {demoPhase === "opening" && (
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#f5ede8", zIndex: 5 }}>
                        <style>{`@keyframes envFlyUp2{0%{transform:scale(1) rotate(0deg) translateY(0);opacity:1}40%{transform:scale(1.1) rotate(-5deg) translateY(-4%);opacity:1}100%{transform:scale(0.15) rotate(15deg) translateY(-140%);opacity:0}}`}</style>
                        <div style={{ width: "72%", aspectRatio: "5/3.5", background: "#fff8f5", borderRadius: 8, border: "1px solid #e0cbc3", boxShadow: "0 8px 32px rgba(139,38,53,0.18)", animation: "envFlyUp2 0.95s cubic-bezier(.4,0,.2,1) forwards" }} />
                      </div>
                    )}

                    {/* OPEN */}
                    {demoPhase === "open" && (
                      <>
                        <div ref={scrollRef} style={{ position: "absolute", inset: 0, overflowY: "auto", overflowX: "hidden", zIndex: 3, WebkitOverflowScrolling: "touch" } as React.CSSProperties}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={template.img} alt={template.name} style={{ width: "100%", display: "block" }} />
                          <div style={{ background: "#f9f3ef", padding: "10px 8px 16px", borderTop: "1px solid #e0cbc3" }}>
                            <div style={{ display: "flex", gap: 3, justifyContent: "center" }}>
                              {["HOME", "DE LOCATIE", "CADEAUS", "BEVESTIGEN"].map((item) => (
                                <span key={item} style={{ fontSize: 6, letterSpacing: "0.06em", color: "#8B2635", fontFamily: "sans-serif", padding: "2.5px 4px", border: "0.5px solid #d4b9b0", borderRadius: 3 }}>{item}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <button onClick={toggleMusic} style={{ position: "absolute", bottom: 48, right: 10, zIndex: 20, width: 26, height: 26, borderRadius: "50%", background: "rgba(249,243,239,0.95)", border: "1px solid #e0cbc3", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.12)", padding: 0 }} aria-label={musicPlaying ? "Pauzeren" : "Afspelen"}>
                          {musicPlaying ? (
                            <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><rect x="1" y="1" width="2" height="6" rx="0.5" fill="#8B2635" /><rect x="5" y="1" width="2" height="6" rx="0.5" fill="#8B2635" /></svg>
                          ) : (
                            <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><polygon points="1.5,0.5 7.5,4 1.5,7.5" fill="#8B2635" /></svg>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <p className="font-sans text-[11px] text-text-muted/50 mt-4 text-center">
                {demoPhase === "closed" ? "Tik op de telefoon voor een livepreview" : "Livepreview van " + template.name}
              </p>
            </div>
          </div>

          {/* Vorige / Volgende navigatie */}
          <div className="border-t border-gray-100 mt-16 pt-8 flex items-center justify-between">
            {prevTemplate ? (
              <Link href={`/templates/${prevTemplate.slug}`} className="flex items-center gap-2 font-sans text-sm text-text-muted hover:text-brand-800 transition-colors">
                <ArrowLeft size={14} />
                <span>{prevTemplate.name}</span>
              </Link>
            ) : <div />}
            <Link href="/templates" className="font-sans text-sm text-text-muted hover:text-brand-800 transition-colors">
              Alle sjablonen
            </Link>
            {nextTemplate ? (
              <Link href={`/templates/${nextTemplate.slug}`} className="flex items-center gap-2 font-sans text-sm text-text-muted hover:text-brand-800 transition-colors">
                <span>{nextTemplate.name}</span>
                <ArrowRight size={14} />
              </Link>
            ) : <div />}
          </div>
        </div>
      </main>
    </>
  );
}
