"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronDown, ChevronUp, X } from "lucide-react";
import { getTemplate, templates } from "@/lib/templates";
import CardOpening from "@/components/CardOpening";

const MUSIC_URL = "https://cdn.pixabay.com/audio/2023/11/10/audio_d4d18e7aa3.mp3";

export default function TemplateDetailPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const template = getTemplate(slug);

  const [selectedEnvelop, setSelectedEnvelop] = useState(0);
  const [selectedColor,   setSelectedColor]   = useState(0);
  const [selectedMusic,   setSelectedMusic]   = useState(0);
  const [demoPhase,       setDemoPhase]       = useState<"closed" | "opening" | "open">("closed");
  const [musicPlaying,    setMusicPlaying]    = useState(false);
  const [openFaq,         setOpenFaq]         = useState<number | null>(null);
  // Modal: fullscreen demo overlay (mobiel + expliciete klik op knop)
  const [modalOpen,       setModalOpen]       = useState(false);
  const [modalPhase,      setModalPhase]      = useState<"closed" | "open">("closed");

  const audioRef    = useRef<HTMLAudioElement | null>(null);
  const scrollRef   = useRef<HTMLDivElement | null>(null);
  const phoneRef    = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setDemoPhase("closed");
    setMusicPlaying(false);
    setSelectedEnvelop(0);
    setSelectedColor(0);
    setOpenFaq(null);
    setModalOpen(false);
    setModalPhase("closed");
    audioRef.current?.pause();
    audioRef.current = null;
  }, [slug]);

  useEffect(() => () => { audioRef.current?.pause(); }, []);

  // Sluit modal met Escape
  useEffect(() => {
    if (!modalOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modalOpen]);

  // Voorkom body-scroll terwijl modal open is
  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modalOpen]);

  // ── Demo in de telefoon (desktop sidebar) ──────────────────────────────
  const handleDemoOpen = () => {
    // Op mobiel (<768px) altijd modal openen
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      openModal();
      return;
    }
    // Desktop: scroll naar telefoon én start demo
    if (demoPhase !== "closed") {
      // Als demo al open is, scroll er naartoe
      phoneRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setDemoPhase("opening");
    phoneRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
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

  // ── Fullscreen modal demo ───────────────────────────────────────────────
  const openModal = () => {
    setModalPhase("closed");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalPhase("closed");
  };

  const currentIdx = templates.findIndex((t) => t.slug === slug);
  const prev = currentIdx > 0 ? templates[currentIdx - 1] : null;
  const next = currentIdx < templates.length - 1 ? templates[currentIdx + 1] : null;

  if (!template) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "serif", fontSize: 24, color: "#16161D", marginBottom: 16 }}>Sjabloon niet gevonden</p>
          <Link href="/templates" style={{ fontFamily: "sans-serif", fontSize: 14, color: "#8B2635" }}>← Alle sjablonen</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#f9f5f1", minHeight: "100vh" }}>

      {/* ── FULLSCREEN MODAL DEMO ────────────────────────────────────────── */}
      {modalOpen && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(22,22,22,0.92)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
        >
          {/* Sluitknop */}
          <button
            onClick={closeModal}
            aria-label="Demo sluiten"
            style={{
              position: "absolute", top: 20, right: 20,
              width: 44, height: 44, borderRadius: "50%",
              background: "rgba(255,255,255,0.12)", border: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", zIndex: 10,
            }}
          >
            <X size={20} color="white" />
          </button>

          {/* Telefoon frame */}
          <div style={{
            position: "relative",
            width: "min(360px, 90vw)",
            maxHeight: "90svh",
          }}>
            <div style={{
              borderRadius: 48,
              background: "linear-gradient(160deg, #dedad6 0%, #cac5c0 50%, #b8b3ae 100%)",
              padding: 10,
              boxShadow: "0 2px 0 #a8a39e, 0 40px 80px rgba(0,0,0,0.5)",
            }}>
              {/* Dynamic Island */}
              <div style={{ position: "absolute", top: 18, left: "50%", transform: "translateX(-50%)", width: 110, height: 28, background: "#1a1a1a", borderRadius: 999, zIndex: 10 }} />
              {/* Scherm */}
              <div style={{ borderRadius: 40, overflow: "hidden", position: "relative", aspectRatio: "9/19.5", background: "#f9f3ef" }}>
                {modalPhase === "closed" ? (
                  <CardOpening
                    templateSlug={template.slug}
                    templateImg={template.img}
                    namen="Emma & Lucas"
                    datumLang="zaterdag 14 juni 2025"
                    color="#8B2635"
                    onComplete={() => setModalPhase("open")}
                  />
                ) : (
                  <div style={{ position: "absolute", inset: 0, overflowY: "auto", overflowX: "hidden" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={template.img} alt={template.name} style={{ width: "100%", display: "block" }} />
                    <div style={{ background: "#f9f3ef", padding: "10px 8px 16px", borderTop: "1px solid #e0cbc3" }}>
                      <div style={{ display: "flex", gap: 3, justifyContent: "center" }}>
                        {["HOME", "DE LOCATIE", "CADEAUS", "BEVESTIGEN"].map(item => (
                          <span key={item} style={{ fontSize: 7, letterSpacing: "0.06em", color: "#8B2635", fontFamily: "sans-serif", padding: "2.5px 4px", border: "0.5px solid #d4b9b0", borderRadius: 3 }}>{item}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reset knop */}
            {modalPhase === "open" && (
              <div style={{ textAlign: "center", marginTop: 16 }}>
                <button
                  onClick={() => setModalPhase("closed")}
                  style={{ fontFamily: "sans-serif", fontSize: 12, color: "rgba(255,255,255,0.7)", background: "none", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999, padding: "8px 16px", cursor: "pointer" }}
                >
                  ↺ Opnieuw afspelen
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── HEADER ── */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(8px)", borderBottom: "1px solid #ece8e4" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ fontFamily: "sans-serif", fontSize: 15, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#16161D", textDecoration: "none" }}>Casa Nomada</Link>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link href="/templates" style={{ fontFamily: "sans-serif", fontSize: 13, color: "#7a6e68", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
              <ArrowLeft size={14} /> Alle sjablonen
            </Link>
            <Link href={`/editor/${slug}`} style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 500, background: "#8B2635", color: "white", borderRadius: 999, padding: "10px 20px", textDecoration: "none" }}>
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
                <p style={{ fontFamily: "sans-serif", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B2635", marginBottom: 12, fontWeight: 600 }}>
                  {template.tagline}
                </p>
                <h1 style={{ fontFamily: "serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#16161D", margin: "0 0 24px", lineHeight: 1.1 }}>
                  {template.name}
                </h1>
                <p style={{ fontFamily: "sans-serif", fontSize: 15, color: "#5a5550", lineHeight: 1.75, marginBottom: 28 }}>
                  {template.description}
                </p>
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
                  <button
                    onClick={handleDemoOpen}
                    style={{ fontFamily: "sans-serif", fontSize: 15, fontWeight: 500, background: "white", color: "#16161D", border: "1.5px solid #d4cec9", borderRadius: 999, padding: "14px 28px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}
                  >
                    Bekijk de live demo
                  </button>
                </div>

                {/* ENVELOP */}
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
                    </div>
                  </div>
                )}

                {/* KLEUREN */}
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

                {/* MUZIEK */}
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

              {/* Rechts: sticky telefoon */}
              <div ref={phoneRef} style={{ position: "sticky", top: 80, display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: 40 }}>
                <div
                  onClick={handleDemoOpen}
                  style={{ position: "relative", width: "min(320px, 45vw)", cursor: demoPhase === "closed" ? "pointer" : "default", userSelect: "none" }}
                >
                  <div style={{ borderRadius: "clamp(32px,6vw,52px)", background: "linear-gradient(160deg, #dedad6 0%, #cac5c0 50%, #b8b3ae 100%)", padding: "clamp(7px,1.3vw,11px)", boxShadow: "0 2px 0 #a8a39e, 0 40px 80px rgba(0,0,0,0.22), 0 12px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.35)" }}>
                    <div style={{ position: "absolute", top: "clamp(9px,1.6vw,15px)", left: "50%", transform: "translateX(-50%)", width: "clamp(90px,16vw,130px)", height: "clamp(22px,4vw,32px)", background: "#1a1a1a", borderRadius: 999, zIndex: 10 }} />
                    <div style={{ position: "absolute", left: -4, top: "19%", width: 4, height: "7%", background: "#b0aaa4", borderRadius: "3px 0 0 3px" }} />
                    <div style={{ position: "absolute", left: -4, top: "28%", width: 4, height: "10%", background: "#b0aaa4", borderRadius: "3px 0 0 3px" }} />
                    <div style={{ position: "absolute", left: -4, top: "40%", width: 4, height: "10%", background: "#b0aaa4", borderRadius: "3px 0 0 3px" }} />
                    <div style={{ position: "absolute", right: -4, top: "27%", width: 4, height: "16%", background: "#b0aaa4", borderRadius: "0 3px 3px 0" }} />
                    <div style={{ borderRadius: "clamp(26px,4.5vw,42px)", overflow: "hidden", position: "relative", aspectRatio: "9/19.5", background: "#f9f3ef" }}>

                      {demoPhase !== "open" && (
                        <div style={{ position: "absolute", inset: 0 }}>
                          <CardOpening
                            templateSlug={template.slug}
                            templateImg={template.img}
                            namen="Emma & Lucas"
                            datumLang="zaterdag 14 juni 2025"
                            color="#8B2635"
                            onComplete={() => {
                              setDemoPhase("open");
                              audioRef.current?.play().catch(() => {});
                              setMusicPlaying(true);
                              setTimeout(() => scrollRef.current?.scrollTo({ top: 400, behavior: "smooth" }), 600);
                            }}
                          />
                        </div>
                      )}

                      {demoPhase === "open" && (
                        <>
                          <div ref={scrollRef} style={{ position: "absolute", inset: 0, overflowY: "auto", overflowX: "hidden", zIndex: 3, WebkitOverflowScrolling: "touch" } as React.CSSProperties}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={template.img} alt={template.name} style={{ width: "100%", display: "block" }} />
                            <div style={{ background: "#f9f3ef", padding: "10px 8px 16px", borderTop: "1px solid #e0cbc3" }}>
                              <div style={{ display: "flex", gap: 3, justifyContent: "center" }}>
                                {["HOME", "DE LOCATIE", "CADEAUS", "BEVESTIGEN"].map(item => (
                                  <span key={item} style={{ fontSize: "clamp(5px,0.9vw,7px)", letterSpacing: "0.06em", color: "#8B2635", fontFamily: "sans-serif", padding: "2.5px 4px", border: "0.5px solid #d4b9b0", borderRadius: 3 }}>{item}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <button onClick={toggleMusic} style={{ position: "absolute", bottom: "clamp(44px,8vw,64px)", right: "clamp(8px,1.5vw,14px)", zIndex: 20, width: "clamp(26px,4.5vw,34px)", height: "clamp(26px,4.5vw,34px)", borderRadius: "50%", background: "rgba(249,243,239,0.95)", border: "1px solid #ddd0c8", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", padding: 0 }}>
                            {musicPlaying
                              ? <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><rect x="1" y="1" width="2.5" height="7" rx="0.5" fill="#8B2635"/><rect x="5.5" y="1" width="2.5" height="7" rx="0.5" fill="#8B2635"/></svg>
                              : <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><polygon points="1.5,0.5 8,4.5 1.5,8.5" fill="#8B2635"/></svg>}
                          </button>
                          <button onClick={resetDemo} style={{ position: "absolute", top: "clamp(44px,8vw,64px)", right: "clamp(8px,1.5vw,14px)", zIndex: 20, width: "clamp(26px,4.5vw,34px)", height: "clamp(26px,4.5vw,34px)", borderRadius: "50%", background: "rgba(249,243,239,0.95)", border: "1px solid #ddd0c8", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", padding: 0, fontSize: 10, color: "#8B2635", fontFamily: "sans-serif" }}>↺</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "rgba(100,80,72,0.5)", marginTop: 14, textAlign: "center" }}>
                  {demoPhase === "closed" ? "Tik op de telefoon voor een livepreview" : `Livepreview · ${template.name}`}
                </p>
                {/* Extra knop ONDER telefoon op desktop */}
                {demoPhase === "closed" && (
                  <button
                    onClick={handleDemoOpen}
                    style={{ marginTop: 14, fontFamily: "sans-serif", fontSize: 13, background: "white", color: "#16161D", border: "1.5px solid #d4cec9", borderRadius: 999, padding: "10px 22px", cursor: "pointer" }}
                  >
                    Bekijk de live demo
                  </button>
                )}
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
              {/* Knop onderaan — altijd modal (want gebruiker is gescrolld weg van telefoon) */}
              <button
                onClick={openModal}
                style={{ fontFamily: "sans-serif", fontSize: 15, background: "white", color: "#16161D", border: "1.5px solid #d4cec9", borderRadius: 999, padding: "16px 32px", cursor: "pointer" }}
              >
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
