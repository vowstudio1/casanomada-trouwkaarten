"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { templates } from "@/lib/templates";

const STAPPEN = ["Namen", "Datum & Locatie", "Sjabloon", "Stijl", "Account"];

export default function RegisterPage() {
  const router = useRouter();

  // Stap
  const [stap, setStap] = useState(0);

  // Gegevens
  const [partner1, setPartner1] = useState("");
  const [partner2, setPartner2] = useState("");
  const [datum, setDatum] = useState("");
  const [tijd, setTijd] = useState("");
  const [locatie, setLocatie] = useState("");
  const [stad, setStad] = useState("");

  // Sjabloon
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Stijl
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedMusic, setSelectedMusic] = useState(0);

  // Account
  const [email, setEmail] = useState("");
  const [wachtwoord, setWachtwoord] = useState("");
  const [accepteer, setAccepteer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentTemplate = templates[selectedTemplate];

  const scroll = (dir: "left" | "right") => {
    if (!carouselRef.current) return;
    const w = carouselRef.current.offsetWidth;
    carouselRef.current.scrollBy({ left: dir === "right" ? w * 0.6 : -w * 0.6, behavior: "smooth" });
  };

  const handleAccount = async () => {
    if (!accepteer) { setError("Accepteer de voorwaarden om door te gaan"); return; }
    setLoading(true);
    setError("");
    try {
      const { data, error: authErr } = await supabase.auth.signUp({ email, password: wachtwoord });
      if (authErr) throw authErr;
      if (data.user) {
        // Sla uitnodiging op
        const { data: inv } = await supabase.from("invitations").insert({
          user_id: data.user.id,
          template_slug: currentTemplate.slug,
          partner1_name: partner1,
          partner2_name: partner2,
          wedding_date: datum,
          wedding_time: tijd,
          location_name: locatie,
          location_city: stad,
          color_index: selectedColor,
          music_index: selectedMusic,
          published: false,
        }).select().single();
        if (inv) router.push(`/editor/${currentTemplate.slug}?id=${inv.id}`);
        else router.push(`/editor/${currentTemplate.slug}`);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Er ging iets mis");
    } finally {
      setLoading(false);
    }
  };

  const kanVerder = () => {
    if (stap === 0) return partner1.length > 0 && partner2.length > 0;
    if (stap === 1) return datum.length > 0;
    if (stap === 2) return true;
    if (stap === 3) return true;
    if (stap === 4) return email.length > 0 && wachtwoord.length >= 6;
    return true;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f9f5f1", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <header style={{ background: "white", borderBottom: "1px solid #ece8e4", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <Link href="/" style={{ fontFamily: "sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: "0.18em", color: "#8B2635", textDecoration: "none" }}>CASA NOMADA</Link>
        <Link href="/login" style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b6560", textDecoration: "none" }}>Heb je al een account? <span style={{ color: "#8B2635", fontWeight: 500 }}>Inloggen</span></Link>
      </header>

      {/* Progress bar */}
      <div style={{ background: "white", borderBottom: "1px solid #ece8e4", padding: "0 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", paddingTop: 16, paddingBottom: 16 }}>
          {/* Stap label */}
          <p style={{ fontFamily: "sans-serif", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "#8B2635", marginBottom: 10 }}>
            STAP {stap + 1} VAN {STAPPEN.length}: {STAPPEN[stap].toUpperCase()}
          </p>
          {/* Progress bar */}
          <div style={{ display: "flex", gap: 4 }}>
            {STAPPEN.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 3, borderRadius: 999, background: i <= stap ? "#8B2635" : "#e0dbd7", transition: "background 0.3s" }} />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, maxWidth: 680, margin: "0 auto", width: "100%", padding: "40px 24px 120px" }}>

        {/* ── STAP 0: Namen ── */}
        {stap === 0 && (
          <div>
            <h1 style={{ fontFamily: "serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", color: "#16161D", marginBottom: 8, lineHeight: 1.1 }}>Laten we jullie uitnodiging instellen</h1>
            <p style={{ fontFamily: "sans-serif", fontSize: 15, color: "#6b6560", marginBottom: 36 }}>Een paar stappen en jullie zijn klaar. Later kun je alles nog aanpassen.</p>
            <h2 style={{ fontFamily: "serif", fontSize: 22, color: "#16161D", marginBottom: 20 }}>Jullie namen</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", marginBottom: 6 }}>Partner 1</label>
                <input value={partner1} onChange={e => setPartner1(e.target.value)} placeholder="Sophie" autoFocus
                  style={{ width: "100%", border: "1.5px solid #e0dbd7", borderRadius: 12, padding: "14px 16px", fontFamily: "sans-serif", fontSize: 15, color: "#16161D", outline: "none", boxSizing: "border-box" as const, background: "white" }} />
              </div>
              <div>
                <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", marginBottom: 6 }}>Partner 2</label>
                <input value={partner2} onChange={e => setPartner2(e.target.value)} placeholder="Thomas"
                  style={{ width: "100%", border: "1.5px solid #e0dbd7", borderRadius: 12, padding: "14px 16px", fontFamily: "sans-serif", fontSize: 15, color: "#16161D", outline: "none", boxSizing: "border-box" as const, background: "white" }} />
              </div>
            </div>
          </div>
        )}

        {/* ── STAP 1: Datum & Locatie ── */}
        {stap === 1 && (
          <div>
            <h2 style={{ fontFamily: "serif", fontSize: "clamp(1.8rem,4vw,2.4rem)", color: "#16161D", marginBottom: 8 }}>Datum en locatie</h2>
            <p style={{ fontFamily: "sans-serif", fontSize: 15, color: "#6b6560", marginBottom: 36 }}>Wanneer en waar vieren jullie de grote dag?</p>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", marginBottom: 6 }}>Datum *</label>
                  <input type="date" value={datum} onChange={e => setDatum(e.target.value)}
                    style={{ width: "100%", border: "1.5px solid #e0dbd7", borderRadius: 12, padding: "14px 16px", fontFamily: "sans-serif", fontSize: 15, color: "#16161D", outline: "none", boxSizing: "border-box" as const, background: "white" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", marginBottom: 6 }}>Tijdstip</label>
                  <input type="time" value={tijd} onChange={e => setTijd(e.target.value)}
                    style={{ width: "100%", border: "1.5px solid #e0dbd7", borderRadius: 12, padding: "14px 16px", fontFamily: "sans-serif", fontSize: 15, color: "#16161D", outline: "none", boxSizing: "border-box" as const, background: "white" }} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", marginBottom: 6 }}>Naam van de locatie</label>
                <input value={locatie} onChange={e => setLocatie(e.target.value)} placeholder="Landgoed De Hooge Vuursche"
                  style={{ width: "100%", border: "1.5px solid #e0dbd7", borderRadius: 12, padding: "14px 16px", fontFamily: "sans-serif", fontSize: 15, color: "#16161D", outline: "none", boxSizing: "border-box" as const, background: "white" }} />
              </div>
              <div>
                <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", marginBottom: 6 }}>Stad / Land</label>
                <input value={stad} onChange={e => setStad(e.target.value)} placeholder="Amsterdam, Nederland"
                  style={{ width: "100%", border: "1.5px solid #e0dbd7", borderRadius: 12, padding: "14px 16px", fontFamily: "sans-serif", fontSize: 15, color: "#16161D", outline: "none", boxSizing: "border-box" as const, background: "white" }} />
              </div>
            </div>
          </div>
        )}

        {/* ── STAP 2: Sjabloon ── */}
        {stap === 2 && (
          <div>
            <h2 style={{ fontFamily: "serif", fontSize: "clamp(1.8rem,4vw,2.4rem)", color: "#16161D", marginBottom: 8 }}>Sjabloon</h2>
            <p style={{ fontFamily: "sans-serif", fontSize: 15, color: "#6b6560", marginBottom: 8 }}>Je kunt het op elk moment wijzigen in de instellingen.</p>

            {/* Groot geselecteerd sjabloon preview */}
            <div style={{ position: "relative", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
                <button onClick={() => setSelectedTemplate(t => Math.max(0, t - 1))} style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #e0dbd7", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <ChevronLeft size={16} style={{ color: "#5a5550" }} />
                </button>
                <span style={{ fontFamily: "serif", fontSize: 18, color: "#16161D" }}>{currentTemplate.name}</span>
                <button onClick={() => setSelectedTemplate(t => Math.min(templates.length - 1, t + 1))} style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #e0dbd7", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <ChevronRight size={16} style={{ color: "#5a5550" }} />
                </button>
              </div>

              {/* Carousel */}
              <div style={{ position: "relative" }}>
                <button onClick={() => scroll("left")} style={{ position: "absolute", left: -16, top: "50%", transform: "translateY(-50%)", zIndex: 10, width: 36, height: 36, borderRadius: "50%", border: "1px solid #e0dbd7", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                  <ChevronLeft size={14} />
                </button>
                <div ref={carouselRef} style={{ display: "flex", gap: 10, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 4, scrollSnapType: "x mandatory" }}>
                  <style>{`.carousel::-webkit-scrollbar{display:none}`}</style>
                  {templates.map((t, i) => (
                    <div key={i} onClick={() => setSelectedTemplate(i)}
                      style={{ flexShrink: 0, width: 120, scrollSnapAlign: "center", cursor: "pointer" }}>
                      <div style={{ border: `2px solid ${selectedTemplate === i ? "#8B2635" : "transparent"}`, borderRadius: 12, overflow: "hidden", transition: "border 0.15s", position: "relative" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={t.img} alt={t.name} style={{ width: "100%", display: "block", aspectRatio: "9/16", objectFit: "cover" }} />
                        {selectedTemplate === i && (
                          <div style={{ position: "absolute", top: 6, right: 6, width: 20, height: 20, borderRadius: "50%", background: "#8B2635", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Check size={11} style={{ color: "white" }} />
                          </div>
                        )}
                      </div>
                      <p style={{ fontFamily: "sans-serif", fontSize: 11, color: selectedTemplate === i ? "#8B2635" : "#9a8e88", textAlign: "center" as const, marginTop: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{t.name}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => scroll("right")} style={{ position: "absolute", right: -16, top: "50%", transform: "translateY(-50%)", zIndex: 10, width: 36, height: 36, borderRadius: "50%", border: "1px solid #e0dbd7", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Live preview link */}
            <Link href={`/templates/${currentTemplate.slug}`} target="_blank"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "sans-serif", fontSize: 13, color: "#8B2635", textDecoration: "none", marginTop: 8 }}>
              In een tabblad openen ↗
            </Link>
          </div>
        )}

        {/* ── STAP 3: Stijl ── */}
        {stap === 3 && (
          <div>
            <h2 style={{ fontFamily: "serif", fontSize: "clamp(1.8rem,4vw,2.4rem)", color: "#16161D", marginBottom: 8 }}>Stijl kiezen</h2>
            <p style={{ fontFamily: "sans-serif", fontSize: 15, color: "#6b6560", marginBottom: 36 }}>Verandert alleen de kleuren, niet het ontwerp. Je kunt ze altijd nog aanpassen.</p>

            {/* Kleuren als visuele swatches */}
            <h3 style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 600, color: "#16161D", marginBottom: 14 }}>Kleuren</h3>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const, marginBottom: 36 }}>
              {currentTemplate.colors.map((color, i) => (
                <button key={i} onClick={() => setSelectedColor(i)}
                  style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 8, padding: "12px 16px", borderRadius: 14, border: `2px solid ${selectedColor === i ? "#8B2635" : "#e0dbd7"}`, background: "white", cursor: "pointer", minWidth: 80, transition: "all 0.15s" }}>
                  {/* Kleur swatch */}
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, #8B2635 50%, ${i === 1 ? "#d4af37" : i === 2 ? "#6b8e6b" : i === 3 ? "#4a6fa5" : "#c8a882"} 50%)`, border: "2px solid #e0dbd7" }} />
                  <span style={{ fontFamily: "sans-serif", fontSize: 12, color: selectedColor === i ? "#8B2635" : "#6b6560", fontWeight: selectedColor === i ? 600 : 400 }}>{color.label}</span>
                  {selectedColor === i && <Check size={12} style={{ color: "#8B2635" }} />}
                </button>
              ))}
            </div>

            {/* Muziek */}
            <h3 style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 600, color: "#16161D", marginBottom: 14 }}>Muziek</h3>
            <div style={{ border: "1.5px solid #e0dbd7", borderRadius: 14, overflow: "hidden", background: "white" }}>
              {currentTemplate.music.map((m, i) => (
                <div key={i} onClick={() => setSelectedMusic(i)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: i < currentTemplate.music.length - 1 ? "1px solid #ece8e4" : "none", cursor: "pointer", background: selectedMusic === i ? "#fdf6f4" : "white" }}>
                  <span style={{ fontFamily: "sans-serif", fontSize: 14, color: selectedMusic === i ? "#8B2635" : "#5a5550" }}>{m}</span>
                  {selectedMusic === i && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#8B2635" }} />}
                </div>
              ))}
            </div>

            <div style={{ background: "#f0f4ff", borderRadius: 12, padding: "12px 16px", marginTop: 20, display: "flex", alignItems: "flex-start", gap: 10 }}>
              <span style={{ fontSize: 16 }}>ℹ️</span>
              <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#4a5568", margin: 0 }}>Lettertypes en al het andere pas je later aan, in de uitnodigingseditor.</p>
            </div>
          </div>
        )}

        {/* ── STAP 4: Account ── */}
        {stap === 4 && (
          <div>
            <h2 style={{ fontFamily: "serif", fontSize: "clamp(1.8rem,4vw,2.4rem)", color: "#16161D", marginBottom: 8 }}>Maak je account aan</h2>
            <p style={{ fontFamily: "sans-serif", fontSize: 15, color: "#6b6560", marginBottom: 8 }}>om door te gaan naar casanomada-trouwkaarten.netlify.app</p>

            {/* Samenvatting */}
            <div style={{ background: "#fdf6f4", border: "1px solid #f0e0db", borderRadius: 14, padding: "16px 20px", marginBottom: 28 }}>
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "6px 16px" }}>
                {[
                  { label: "Namen", value: `${partner1} & ${partner2}` },
                  { label: "Datum", value: datum ? new Date(datum).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" }) : "—" },
                  { label: "Locatie", value: locatie || stad || "—" },
                  { label: "Sjabloon", value: currentTemplate.name },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: "flex", gap: 6 }}>
                    <span style={{ fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88" }}>{label}:</span>
                    <span style={{ fontFamily: "sans-serif", fontSize: 12, color: "#16161D", fontWeight: 500 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column" as const, gap: 12, marginBottom: 20 }}>
              <div>
                <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", marginBottom: 6 }}>E-mailadres</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jouw@email.com"
                  style={{ width: "100%", border: "1.5px solid #e0dbd7", borderRadius: 12, padding: "14px 16px", fontFamily: "sans-serif", fontSize: 15, color: "#16161D", outline: "none", boxSizing: "border-box" as const, background: "white" }} />
              </div>
              <div>
                <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", marginBottom: 6 }}>Wachtwoord (min. 6 tekens)</label>
                <input type="password" value={wachtwoord} onChange={e => setWachtwoord(e.target.value)} placeholder="••••••••"
                  style={{ width: "100%", border: "1.5px solid #e0dbd7", borderRadius: 12, padding: "14px 16px", fontFamily: "sans-serif", fontSize: 15, color: "#16161D", outline: "none", boxSizing: "border-box" as const, background: "white" }} />
              </div>
            </div>

            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginBottom: 20 }}>
              <input type="checkbox" checked={accepteer} onChange={e => setAccepteer(e.target.checked)}
                style={{ marginTop: 3, width: 16, height: 16, accentColor: "#8B2635", flexShrink: 0 }} />
              <span style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b6560", lineHeight: 1.5 }}>
                Ik accepteer de <Link href="/voorwaarden" style={{ color: "#8B2635" }}>Algemene Voorwaarden</Link> en het <Link href="/privacy" style={{ color: "#8B2635" }}>Privacybeleid</Link>
              </span>
            </label>

            {error && <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#dc2626", marginBottom: 12 }}>{error}</p>}

            <button onClick={handleAccount} disabled={loading || !kanVerder() || !accepteer}
              style={{ width: "100%", background: "#8B2635", color: "white", border: "none", borderRadius: 999, padding: "16px", fontFamily: "sans-serif", fontSize: 15, fontWeight: 600, cursor: loading || !kanVerder() || !accepteer ? "not-allowed" : "pointer", opacity: loading || !kanVerder() || !accepteer ? 0.6 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {loading ? "Bezig..." : <>Maak een gratis account om jullie uitnodiging te bewaren <ArrowRight size={16} /></>}
            </button>
          </div>
        )}
      </div>

      {/* Navigatie balk onderaan */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(8px)", borderTop: "1px solid #ece8e4", padding: "14px 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => stap > 0 && setStap(s => s - 1)}
            style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "sans-serif", fontSize: 14, color: stap === 0 ? "#c0b8b4" : "#5a5550", background: "none", border: "none", cursor: stap === 0 ? "default" : "pointer" }} disabled={stap === 0}>
            <ArrowLeft size={16} /> Terug
          </button>
          {stap < 4 ? (
            <button onClick={() => kanVerder() && setStap(s => s + 1)} disabled={!kanVerder()}
              style={{ display: "flex", alignItems: "center", gap: 8, background: kanVerder() ? "#8B2635" : "#e0dbd7", color: "white", border: "none", borderRadius: 999, padding: "12px 28px", fontFamily: "sans-serif", fontSize: 14, fontWeight: 500, cursor: kanVerder() ? "pointer" : "not-allowed", transition: "background 0.2s" }}>
              Doorgaan <ArrowRight size={15} />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
