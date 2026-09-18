"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Music, Palette } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { templates } from "@/lib/templates";

const MUSIC_OPTIONS = [
  "Amber Glow", "Warm Embrace", "Romantic Piano", "Most Beautiful Day",
  "Promise of Love", "Wedding Joy", "Garden Waltz", "Dolce Vita",
  "Golden Hour", "Tender Rose", "Sky Waltz", "Geen",
];

const COLOR_OPTIONS = [
  { name: "Origineel", value: "#F5EDE8" },
  { name: "Bordeaux", value: "#8B2635" },
  { name: "Nachtblauw", value: "#1E3A5F" },
  { name: "Saliegroen", value: "#7A9E8E" },
  { name: "Lavendel", value: "#9B89B4" },
  { name: "Champagne", value: "#D4AF8A" },
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [partner1, setPartner1] = useState("");
  const [partner2, setPartner2] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [location, setLocation] = useState("");
  const [selectedColor, setSelectedColor] = useState("Origineel");
  const [selectedMusic, setSelectedMusic] = useState("Amber Glow");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  function nextStep() {
    setError("");
    if (step === 1 && !selectedTemplate) {
      setError("Kies een sjabloon om door te gaan.");
      return;
    }
    if (step === 2 && (!partner1.trim() || !partner2.trim() || !weddingDate)) {
      setError("Vul de namen en de trouwdatum in.");
      return;
    }
    setStep((s) => Math.min(s + 1, totalSteps));
  }

  function prevStep() {
    setError("");
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Wachtwoord moet minimaal 6 tekens bevatten.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Wachtwoorden komen niet overeen.");
      return;
    }

    setLoading(true);

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          partner1: partner1.trim(),
          partner2: partner2.trim(),
          wedding_date: weddingDate,
          location: location.trim(),
          template: selectedTemplate,
          color: selectedColor,
          music: selectedMusic,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    try {
      await fetch("/api/notify-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${partner1.trim()} & ${partner2.trim()}`,
          email,
          template: selectedTemplate,
        }),
      });
    } catch {
      // Notification failure is non-blocking
    }

    setLoading(false);
    setSuccess(true);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.75rem 0.875rem",
    border: "1px solid #D1D5DB",
    borderRadius: "0.625rem",
    fontSize: "0.9375rem",
    backgroundColor: "#FFFFFF",
    color: "#16161D",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "system-ui, sans-serif",
  };

  if (success) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f9f5f1" }}>
        <Nav />
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 1.5rem" }}>
          <div style={{ maxWidth: "28rem", textAlign: "center", backgroundColor: "#FFFFFF", borderRadius: "1.25rem", border: "1px solid #E8E6E3", padding: "3rem 2rem", boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}>
            <div style={{ width: "4rem", height: "4rem", borderRadius: "50%", backgroundColor: "#F9EDEE", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
              <Check size={24} style={{ color: "#8B2635" }} />
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.75rem", fontWeight: 600, color: "#16161D", marginBottom: "0.75rem" }}>
              Account aangemaakt!
            </h2>
            <p style={{ color: "#6B6B76", fontSize: "0.9375rem", lineHeight: 1.65, marginBottom: "2rem", fontFamily: "system-ui, sans-serif" }}>
              Controleer je e-mail om je account te bevestigen. Daarna kun je direct inloggen en je uitnodiging afmaken.
            </p>
            <Link
              href="/login"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 2rem", backgroundColor: "#8B2635", color: "#FFFFFF", borderRadius: "9999px", textDecoration: "none", fontSize: "0.875rem", fontWeight: 600, fontFamily: "system-ui, sans-serif" }}
            >
              Naar inloggen <ArrowRight size={15} />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f9f5f1" }}>
      <Nav />

      <main style={{ flex: 1, padding: "2.5rem 1.5rem 4rem" }}>
        <div style={{ maxWidth: "52rem", margin: "0 auto" }}>

          {/* Step indicator */}
          <div style={{ marginBottom: "2.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <p style={{ fontSize: "0.8125rem", color: "#6B6B76", fontFamily: "system-ui, sans-serif" }}>
                Stap {step} van {totalSteps}
              </p>
              <p style={{ fontSize: "0.8125rem", color: "#8B2635", fontWeight: 500, fontFamily: "system-ui, sans-serif" }}>
                {step === 1 && "Kies een sjabloon"}
                {step === 2 && "Jullie gegevens"}
                {step === 3 && "Stijl & muziek"}
                {step === 4 && "Account aanmaken"}
              </p>
            </div>
            <div style={{ height: "4px", backgroundColor: "#E8E6E3", borderRadius: "9999px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, backgroundColor: "#8B2635", borderRadius: "9999px", transition: "width 0.35s ease" }} />
            </div>
          </div>

          {error && (
            <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "0.625rem", padding: "0.75rem 1rem", marginBottom: "1.5rem", color: "#991B1B", fontSize: "0.875rem", fontFamily: "system-ui, sans-serif" }}>
              {error}
            </div>
          )}

          {/* ── STAP 1: Kies sjabloon ── */}
          {step === 1 && (
            <div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 600, color: "#16161D", marginBottom: "0.5rem" }}>
                Kies je sjabloon
              </h1>
              <p style={{ color: "#6B6B76", fontSize: "0.9375rem", fontFamily: "system-ui, sans-serif", marginBottom: "2rem", lineHeight: 1.6 }}>
                Je kunt alles later nog aanpassen. Kies het ontwerp dat het best bij jullie past.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(220px, 100%), 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
                {templates.map((tpl) => (
                  <button
                    key={tpl.slug}
                    type="button"
                    onClick={() => setSelectedTemplate(tpl.slug)}
                    style={{
                      padding: 0,
                      border: selectedTemplate === tpl.slug ? "2.5px solid #8B2635" : "2px solid #E8E6E3",
                      borderRadius: "0.875rem",
                      overflow: "hidden",
                      cursor: "pointer",
                      background: "none",
                      textAlign: "left",
                      transition: "border-color 0.15s, box-shadow 0.15s",
                      boxShadow: selectedTemplate === tpl.slug ? "0 0 0 3px rgba(139,38,53,0.15)" : "none",
                    }}
                  >
                    <div style={{ aspectRatio: "4/3", overflow: "hidden", backgroundColor: "#F5EDE8" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={tpl.img} alt={tpl.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} loading="lazy" />
                    </div>
                    <div style={{ padding: "0.75rem 0.875rem", backgroundColor: selectedTemplate === tpl.slug ? "#FDF6F7" : "#FFFFFF" }}>
                      <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#16161D", fontFamily: "'Cormorant Garamond', Georgia, serif", marginBottom: "0.125rem" }}>
                        {tpl.name}
                      </p>
                      <p style={{ fontSize: "0.6875rem", color: "#6B6B76", fontFamily: "system-ui, sans-serif", lineHeight: 1.4 }}>
                        {tpl.tagline}
                      </p>
                      {selectedTemplate === tpl.slug && (
                        <div style={{ marginTop: "0.5rem", display: "flex", alignItems: "center", gap: "0.25rem", color: "#8B2635" }}>
                          <Check size={12} />
                          <span style={{ fontSize: "0.6875rem", fontWeight: 600, fontFamily: "system-ui, sans-serif" }}>Geselecteerd</span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button onClick={nextStep} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.8125rem 2rem", backgroundColor: "#8B2635", color: "#FFFFFF", border: "none", borderRadius: "9999px", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", fontFamily: "system-ui, sans-serif" }}>
                  Volgende <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* ── STAP 2: Gegevens ── */}
          {step === 2 && (
            <div style={{ maxWidth: "36rem" }}>
              <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 600, color: "#16161D", marginBottom: "0.5rem" }}>
                Jullie gegevens
              </h1>
              <p style={{ color: "#6B6B76", fontSize: "0.9375rem", fontFamily: "system-ui, sans-serif", marginBottom: "2rem" }}>
                Alles wat je invult, verschijnt direct in je uitnodiging.
              </p>

              <div style={{ backgroundColor: "#FFFFFF", borderRadius: "1rem", border: "1px solid #E8E6E3", padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "#16161D", marginBottom: "0.375rem", fontFamily: "system-ui, sans-serif" }}>
                      Naam partner 1
                    </label>
                    <input type="text" required value={partner1} onChange={(e) => setPartner1(e.target.value)} placeholder="Sophie" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "#16161D", marginBottom: "0.375rem", fontFamily: "system-ui, sans-serif" }}>
                      Naam partner 2
                    </label>
                    <input type="text" required value={partner2} onChange={(e) => setPartner2(e.target.value)} placeholder="Thomas" style={inputStyle} />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "#16161D", marginBottom: "0.375rem", fontFamily: "system-ui, sans-serif" }}>
                    Trouwdatum
                  </label>
                  <input type="date" required value={weddingDate} onChange={(e) => setWeddingDate(e.target.value)} style={inputStyle} />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "#16161D", marginBottom: "0.375rem", fontFamily: "system-ui, sans-serif" }}>
                    Locatie <span style={{ color: "#9CA3AF", fontWeight: 400 }}>(optioneel)</span>
                  </label>
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Kasteel Hoensbroek, Limburg" style={inputStyle} />
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1.75rem" }}>
                <button onClick={prevStep} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.8125rem 1.5rem", backgroundColor: "transparent", color: "#6B6B76", border: "1px solid #E8E6E3", borderRadius: "9999px", fontSize: "0.875rem", cursor: "pointer", fontFamily: "system-ui, sans-serif" }}>
                  <ArrowLeft size={15} /> Terug
                </button>
                <button onClick={nextStep} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.8125rem 2rem", backgroundColor: "#8B2635", color: "#FFFFFF", border: "none", borderRadius: "9999px", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", fontFamily: "system-ui, sans-serif" }}>
                  Volgende <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* ── STAP 3: Kleur & muziek ── */}
          {step === 3 && (
            <div style={{ maxWidth: "36rem" }}>
              <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 600, color: "#16161D", marginBottom: "0.5rem" }}>
                Stijl & muziek
              </h1>
              <p style={{ color: "#6B6B76", fontSize: "0.9375rem", fontFamily: "system-ui, sans-serif", marginBottom: "2rem" }}>
                Kies het kleurpalet en de achtergrondmuziek voor jullie uitnodiging.
              </p>

              {/* Kleuren */}
              <div style={{ backgroundColor: "#FFFFFF", borderRadius: "1rem", border: "1px solid #E8E6E3", padding: "1.75rem", marginBottom: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
                  <Palette size={18} style={{ color: "#8B2635" }} />
                  <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#16161D", fontFamily: "system-ui, sans-serif" }}>Kleurpalet</h2>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c.name)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.5rem 0.875rem",
                        border: selectedColor === c.name ? "2px solid #8B2635" : "2px solid #E8E6E3",
                        borderRadius: "9999px",
                        cursor: "pointer",
                        backgroundColor: selectedColor === c.name ? "#FDF6F7" : "#FFFFFF",
                        transition: "all 0.15s",
                        fontFamily: "system-ui, sans-serif",
                      }}
                    >
                      <span style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: c.value, border: "1px solid rgba(0,0,0,0.1)", display: "inline-block", flexShrink: 0 }} />
                      <span style={{ fontSize: "0.8125rem", color: selectedColor === c.name ? "#8B2635" : "#16161D", fontWeight: selectedColor === c.name ? 600 : 400 }}>
                        {c.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Muziek */}
              <div style={{ backgroundColor: "#FFFFFF", borderRadius: "1rem", border: "1px solid #E8E6E3", padding: "1.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
                  <Music size={18} style={{ color: "#8B2635" }} />
                  <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#16161D", fontFamily: "system-ui, sans-serif" }}>Achtergrondmuziek</h2>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem" }}>
                  {MUSIC_OPTIONS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSelectedMusic(m)}
                      style={{
                        padding: "0.5rem 0.875rem",
                        border: selectedMusic === m ? "2px solid #8B2635" : "2px solid #E8E6E3",
                        borderRadius: "9999px",
                        cursor: "pointer",
                        backgroundColor: selectedMusic === m ? "#FDF6F7" : "#FFFFFF",
                        fontSize: "0.8125rem",
                        color: selectedMusic === m ? "#8B2635" : "#16161D",
                        fontWeight: selectedMusic === m ? 600 : 400,
                        transition: "all 0.15s",
                        fontFamily: "system-ui, sans-serif",
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1.75rem" }}>
                <button onClick={prevStep} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.8125rem 1.5rem", backgroundColor: "transparent", color: "#6B6B76", border: "1px solid #E8E6E3", borderRadius: "9999px", fontSize: "0.875rem", cursor: "pointer", fontFamily: "system-ui, sans-serif" }}>
                  <ArrowLeft size={15} /> Terug
                </button>
                <button onClick={nextStep} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.8125rem 2rem", backgroundColor: "#8B2635", color: "#FFFFFF", border: "none", borderRadius: "9999px", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", fontFamily: "system-ui, sans-serif" }}>
                  Volgende <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* ── STAP 4: Account ── */}
          {step === 4 && (
            <div style={{ maxWidth: "36rem" }}>
              <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 600, color: "#16161D", marginBottom: "0.5rem" }}>
                Maak je account aan
              </h1>
              <p style={{ color: "#6B6B76", fontSize: "0.9375rem", fontFamily: "system-ui, sans-serif", marginBottom: "2rem" }}>
                Je uitnodiging wordt opgeslagen in je account. Je kunt hem later altijd aanpassen.
              </p>

              {/* Summary */}
              <div style={{ backgroundColor: "#FDF6F7", border: "1px solid #F0D0D4", borderRadius: "0.875rem", padding: "1.125rem 1.25rem", marginBottom: "1.5rem" }}>
                <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#8B2635", fontFamily: "system-ui, sans-serif", marginBottom: "0.5rem" }}>Samenvatting</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem 1.5rem" }}>
                  {[
                    { label: "Sjabloon", value: templates.find(t => t.slug === selectedTemplate)?.name || selectedTemplate },
                    { label: "Partners", value: partner1 && partner2 ? `${partner1} & ${partner2}` : "—" },
                    { label: "Datum", value: weddingDate || "—" },
                    { label: "Kleur", value: selectedColor },
                    { label: "Muziek", value: selectedMusic },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <span style={{ fontSize: "0.75rem", color: "#9B6977", fontFamily: "system-ui, sans-serif" }}>{label}: </span>
                      <span style={{ fontSize: "0.75rem", color: "#16161D", fontWeight: 500, fontFamily: "system-ui, sans-serif" }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} style={{ backgroundColor: "#FFFFFF", borderRadius: "1rem", border: "1px solid #E8E6E3", padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.125rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "#16161D", marginBottom: "0.375rem", fontFamily: "system-ui, sans-serif" }}>E-mailadres</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jouw@email.nl" autoComplete="email" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "#16161D", marginBottom: "0.375rem", fontFamily: "system-ui, sans-serif" }}>Wachtwoord</label>
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimaal 6 tekens" autoComplete="new-password" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "#16161D", marginBottom: "0.375rem", fontFamily: "system-ui, sans-serif" }}>Wachtwoord bevestigen</label>
                  <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Herhaal je wachtwoord" autoComplete="new-password" style={inputStyle} />
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "0.5rem" }}>
                  <button type="button" onClick={prevStep} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.8125rem 1.5rem", backgroundColor: "transparent", color: "#6B6B76", border: "1px solid #E8E6E3", borderRadius: "9999px", fontSize: "0.875rem", cursor: "pointer", fontFamily: "system-ui, sans-serif" }}>
                    <ArrowLeft size={15} /> Terug
                  </button>
                  <button type="submit" disabled={loading} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.8125rem 2rem", backgroundColor: loading ? "#B08086" : "#8B2635", color: "#FFFFFF", border: "none", borderRadius: "9999px", fontSize: "0.875rem", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", fontFamily: "system-ui, sans-serif" }}>
                    {loading ? "Account aanmaken…" : "Account aanmaken"} {!loading && <ArrowRight size={15} />}
                  </button>
                </div>
              </form>

              <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.875rem", color: "#6B6B76", fontFamily: "system-ui, sans-serif" }}>
                Al een account?{" "}
                <Link href="/login" style={{ color: "#8B2635", textDecoration: "underline", fontWeight: 500 }}>Inloggen</Link>
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
