"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronDown, ChevronUp } from "lucide-react";
import { getTemplate, templates } from "@/lib/templates";
import CardOpening from "@/components/CardOpening";

const MUSIC_URL = "https://cdn.pixabay.com/audio/2023/11/10/audio_d4d18e7aa3.mp3";

export default function TemplateDetailPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const template = getTemplate(slug);

  const [selectedEnvelop, setSelectedEnvelop] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedMusic, setSelectedMusic] = useState(0);
  const [demoPhase, setDemoPhase] = useState<"closed" | "opening" | "open">("closed");
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setDemoPhase("closed");
    setMusicPlaying(false);
    setSelectedEnvelop(0);
    setSelectedColor(0);
    setOpenFaq(null);
    audioRef.current?.pause();
    audioRef.current = null;
  }, [slug]);

  useEffect(() => () => { audioRef.current?.pause(); }, []);

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-serif text-2xl text-[#16161D] mb-4">Sjabloon niet gevonden</p>
          <Link href="/templates" className="text-brand-800 underline font-sans">← Alle sjablonen</Link>
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
      setTimeout(() => scrollRef.current?.scrollTo({ top: 400, behavior: "smooth" }), 600);
    }, 1000);
  };

  const resetDemo = () => {
    audioRef.current?.pause();
    setMusicPlaying(false);
    setDemoPhase("closed");
  };

  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (musicPlaying) { audioRef.current.pause(); setMusicPlaying(false); }
    else { audioRef.current.play().catch(() => {}); setMusicPlaying(true); }
  };

  const currentIdx = templates.findIndex((t) => t.slug === slug);
  const prev = currentIdx > 0 ? templates[currentIdx - 1] : null;
  const next = currentIdx < templates.length - 1 ? templates[currentIdx + 1] : null;

  return (
    <div style={{ background: "#f9f5f1", minHeight: "100vh" }}>

      {/* ── HEADER ── */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(8px)", borderBottom: "1px solid #ece8e4" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ fontFamily: "sans-serif", fontSize: 15, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#16161D", textDecoration: "none" }}>Casa Nomada</Link>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link href="/templates" style={{ fontFamily: "sans-serif", fontSize: 13, color: "#7a6e68", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
              <ArrowLeft size={14} /> Alle sjablonen
            </Link>
            <Link href={`/editor/${slug}`} style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 500, background: "#8B2635", color: "white", borderRadius: 999, padding: "10px 20px", textDecoration: "none", letterSpacing: "0.08em" }}>
              Maak je trouwkaart
            </Link>
          </div>
        </div>
      </header>

      <main style={{ paddingTop: 64 }}>

        {/* ── HERO SECTIE ── */}
        <section style={{ background: "#fff", borderBottom: "1px solid #ece8e4" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px 0" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>

              {/* Links: tekst */}
              <div style={{ paddingBottom: 60 }}>
                {/* Tagline */}
                <p style={{ fontFamily: "sans-serif", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B2635", marginBottom: 12, fontWeight: 600 }}>
                  {template.tagline}
                </p>
                {/* Naam */}
                <h1 style={{ fontFamily: "serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#16161D", margin: "0 0 24px", lineHeight: 1.1 }}>
                  {template.name}
                </h1>
                {/* Beschrijving */}
                <p style={{ fontFamily: "sans-serif", fontSize: 15, color: "#5a5550", lineHeight: 1.75, marginBottom: 28 }}>
                  {template.description}
                </p>
                {/* Features */}
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 36px", display: "flex", flexDirection: "column", gap: 10 }}>
                  {template.features.map((f, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontFamily: "sans-serif", fontSize: 14, color: "#5a5550" }}>
                      <Check size={15} style={{ color: "#8B2635", flexShrink: 0, marginTop: 2 }} />{f}
                    </li>
                  ))}
                </ul>
                {/* CTA knoppen */}
                <div style={{ display: "flex", gap: 12, marginBottom: 48, flexWrap: "wrap" }}>
                  <Link href={`/editor/${slug}`} style={{ fontFamily: "sans-serif", fontSize: 15, fontWeight: 500, background: "#8B2635", color: "white", borderRadius: 999, padding: "14px 28px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
                    Maak je trouwkaart <ArrowRight size={16} />
                  </Link>
                  <button onClick={handleDemoOpen} style={{ fontFamily: "sans-serif", fontSize: 15, fontWeight: 500, background: "white", color: "#16161D", border: "1.5px solid #d4cec9", borderRadius: 999, padding: "14px 28px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
                    Bekijk de live demo
                  </button>
                </div>

                {/* ENVELOP sectie */}
                {template.envelops.length > 1 && (
                  <div style={{ marginBottom: 32 }}>
                    <p style={{ fontFamily: "sans-serif", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9a8e88", marginBottom: 12 }}>ENVELOP</p>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      {template.envelops.map((env, i) => (
                        <button key={i} onClick={() => { setSelectedEnvelop(i); resetDemo(); }}
                          style={{ width: 56, height: 72, borderRadius: 6, overflow: "hidden", border: selectedEnvelop === i ? "2px solid #8B2635" : "2px solid transparent", cursor: "pointer", padding: 0, background: "transparent", transform: selectedEnvelop === i ? "scale(1.06)" : "scale(1)", transition: "all 0.15s" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={env.img} alt={env.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </button>
                      ))}
                      <div style={{ width: 1, height: 40, background: "#e0dbd7", margin: "0 4px" }} />
                    </div>
                  </div>
                )}

                {/* KLEUREN sectie */}
                <div style={{ marginBottom: 32 }}>
                  <p style={{ fontFamily: "sans-serif", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9a8e88", marginBottom: 12 }}>KLEUREN</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {template.colors.map((color, i) => (
                      <button key={i} onClick={() => setSelectedColor(i)}
                        style={{ fontFamily: "sans-serif", fontSize: 13, padding: "8px 16px", borderRadius: 999, border: selectedColor === i ? "1.5px solid #8B2635" : "1.5px solid #d4cec9", background: selectedColor === i ? "#8B2635" : "white", color: selectedColor === i ? "white" : "#5a5550", cursor: "pointer", transition: "all 0.15s" }}>
                        {color.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* MUZIEK sectie */}
                <div style={{ marginBottom: 12 }}>
                  <p style={{ fontFamily: "sans-serif", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9a8e88", marginBottom: 12 }}>MUZIEK</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 0, border: "1.5px solid #d4cec9", borderRadius: 10, overflow: "hidden", maxWidth: 240 }}>
                    {template.music.map((m, i) => (
                      <button key={i} onClick={() => setSelectedMusic(i)}
                        style={{ fontFamily: "sans-serif", fontSize: 13, padding: "10px 16px", textAlign: "left", background: selectedMusic === i ? "#fdf6f4" : "white", color: selectedMusic === i ? "#8B2635" : "#5a5550", border: "none", borderBottom: i < template.music.length - 1 ? "1px solid #ece8e4" : "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        {m}
                        {selectedMusic === i && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#8B2635", display: "inline-block" }} />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rechts: grote sticky telefoon */}
              <div style={{ position: "sticky", top: 80, display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: 40 }}>
                {/* Telefoon */}
                <div onClick={handleDemoOpen}
                  style={{ position: "relative", width: "min(320px, 45vw)", cursor: demoPhase === "closed" ? "pointer" : "default", userSelect: "none" }}>
                  {/* Frame */}
                  <div style={{ borderRadius: "clamp(32px,6vw,52px)", background: "linear-gradient(160deg, #dedad6 0%, #cac5c0 50%, #b8b3ae 100%)", padding: "clamp(7px,1.3vw,11px)", boxShadow: "0 2px 0 #a8a39e, 0 40px 80px rgba(0,0,0,0.22), 0 12px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.35)" }}>
                    {/* Dynamic Island */}
                    <div style={{ position: "absolute", top: "clamp(9px,1.6vw,15px)", left: "50%", transform: "translateX(-50%)", width: "clamp(90px,16vw,130px)", height: "clamp(22px,4vw,32px)", background: "#1a1a1a", borderRadius: 999, zIndex: 10 }} />
                    {/* Zijknoppen */}
                    <div style={{ position: "absolute", left: -4, top: "19%", width: 4, height: "7%", background: "#b0aaa4", borderRadius: "3px 0 0 3px" }} />
                    <div style={{ position: "absolute", left: -4, top: "28%", width: 4, height: "10%", background: "#b0aaa4", borderRadius: "3px 0 0 3px" }} />
                    <div style={{ position: "absolute", left: -4, top: "40%", width: 4, height: "10%", background: "#b0aaa4", borderRadius: "3px 0 0 3px" }} />
                    <div style={{ position: "absolute", right: -4, top: "27%", width: 4, height: "16%", background: "#b0aaa4", borderRadius: "0 3px 3px 0" }} />
                    {/* Scherm */}
                    <div style={{ borderRadius: "clamp(26px,4.5vw,42px)", overflow: "hidden", position: "relative", aspectRatio: "9/19.5", background: "#f9f3ef" }}>

                      {/* CardOpening animatie — vervangt gesloten + opening fase */}
                      {demoPhase !== "open" && (
                        <div style={{ position: "absolute", inset: 0 }}>
                          <CardOpening
                            templateSlug={template.slug}
                            templateImg={template.img}
                            onComplete={() => {
                              setDemoPhase("open");
                              audioRef.current?.play().catch(() => {});
                              setMusicPlaying(true);
                              setTimeout(() => scrollRef.current?.scrollTo({ top: 400, behavior: "smooth" }), 600);
                            }}
                          />
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
                                  <span key={item} style={{ fontSize: "clamp(5px,0.9vw,7px)", letterSpacing: "0.06em", color: "#8B2635", fontFamily: "sans-serif", padding: "2.5px 4px", border: "0.5px solid #d4b9b0", borderRadius: 3 }}>{item}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                          {/* Muziek knop */}
                          <button onClick={toggleMusic} style={{ position: "absolute", bottom: "clamp(44px,8vw,64px)", right: "clamp(8px,1.5vw,14px)", zIndex: 20, width: "clamp(26px,4.5vw,34px)", height: "clamp(26px,4.5vw,34px)", borderRadius: "50%", background: "rgba(249,243,239,0.95)", border: "1px solid #ddd0c8", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", padding: 0 }} aria-label={musicPlaying ? "Pauzeren" : "Afspelen"}>
                            {musicPlaying
                              ? <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><rect x="1" y="1" width="2.5" height="7" rx="0.5" fill="#8B2635"/><rect x="5.5" y="1" width="2.5" height="7" rx="0.5" fill="#8B2635"/></svg>
                              : <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><polygon points="1.5,0.5 8,4.5 1.5,8.5" fill="#8B2635"/></svg>}
                          </button>
                          {/* Reset knop */}
                          <button onClick={resetDemo} style={{ position: "absolute", top: "clamp(44px,8vw,64px)", right: "clamp(8px,1.5vw,14px)", zIndex: 20, width: "clamp(26px,4.5vw,34px)", height: "clamp(26px,4.5vw,34px)", borderRadius: "50%", background: "rgba(249,243,239,0.95)", border: "1px solid #ddd0c8", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", padding: 0, fontSize: 10, color: "#8B2635", fontFamily: "sans-serif" }}>↺</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "rgba(100,80,72,0.5)", marginTop: 14, textAlign: "center" }}>
                  {demoPhase === "closed" ? "Tik op de telefoon voor een livepreview" : `Livepreview · ${template.name}`}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        {template.faq.length > 0 && (
          <section style={{ background: "#fff", borderTop: "1px solid #ece8e4", padding: "60px 24px" }}>
            <div style={{ maxWidth: 720, margin: "0 auto" }}>
              <h2 style={{ fontFamily: "serif", fontSize: "clamp(1.8rem,3vw,2.4rem)", color: "#16161D", marginBottom: 32, textAlign: "center" }}>Veelgestelde vragen</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {template.faq.map((item, i) => (
                  <div key={i} style={{ borderTop: i === 0 ? "1px solid #ece8e4" : "none", borderBottom: "1px solid #ece8e4" }}>
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                      <span style={{ fontFamily: "serif", fontSize: 17, color: "#16161D" }}>{item.q}</span>
                      {openFaq === i ? <ChevronUp size={18} style={{ color: "#8B2635", flexShrink: 0 }} /> : <ChevronDown size={18} style={{ color: "#8B2635", flexShrink: 0 }} />}
                    </button>
                    {openFaq === i && (
                      <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#5a5550", lineHeight: 1.75, paddingBottom: 20, margin: 0 }}>{item.a}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── PRIJS SECTIE ── */}
        <section style={{ background: "#f9f5f1", borderTop: "1px solid #ece8e4", padding: "60px 24px" }}>
          <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontFamily: "serif", fontSize: "clamp(1.8rem,3vw,2.4rem)", color: "#16161D", marginBottom: 8 }}>{template.name}</h2>
            <p style={{ fontFamily: "sans-serif", fontSize: 18, color: "#5a5550", marginBottom: 32 }}>
              € {template.price} <span style={{ fontSize: 13, color: "#9a8e88" }}>eenmalig — onbeperkt uitnodigingen</span>
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Link href={`/editor/${slug}`} style={{ fontFamily: "sans-serif", fontSize: 15, fontWeight: 500, background: "#8B2635", color: "white", borderRadius: 999, padding: "16px 32px", textDecoration: "none", display: "inline-block" }}>
                Maak je trouwkaart
              </Link>
              <button onClick={handleDemoOpen} style={{ fontFamily: "sans-serif", fontSize: 15, background: "white", color: "#16161D", border: "1.5px solid #d4cec9", borderRadius: 999, padding: "16px 32px", cursor: "pointer" }}>
                Bekijk de live demo
              </button>
            </div>
          </div>
        </section>

        {/* ── NAVIGATIE ── */}
        <div style={{ borderTop: "1px solid #ece8e4", background: "#fff" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {prev ? (
              <Link href={`/templates/${prev.slug}`} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "sans-serif", fontSize: 13, color: "#5a5550", textDecoration: "none" }}>
                <ArrowLeft size={14} />{prev.name}
              </Link>
            ) : <div />}
            <Link href="/templates" style={{ fontFamily: "sans-serif", fontSize: 13, color: "#5a5550", textDecoration: "none" }}>Alle sjablonen</Link>
            {next ? (
              <Link href={`/templates/${next.slug}`} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "sans-serif", fontSize: 13, color: "#5a5550", textDecoration: "none" }}>
                {next.name}<ArrowRight size={14} />
              </Link>
            ) : <div />}
          </div>
        </div>

      </main>
    </div>
  );
}
