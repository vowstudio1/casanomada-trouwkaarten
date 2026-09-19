"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { templates } from "@/lib/templates";
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";

const STEPS = ["Jullie namen", "Datum & locatie", "Sjabloon", "Account"];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [partner1, setPartner1] = useState("");
  const [partner2, setPartner2] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [city, setCity] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [accept, setAccept] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const carouselRef = useRef<HTMLDivElement>(null);

  const canProceed = () => {
    if (step === 0) return partner1.trim() && partner2.trim();
    if (step === 1) return !!date;
    if (step === 2) return true;
    if (step === 3) return email && password.length >= 6 && accept;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true); setError("");
    try {
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email, password,
        options: { data: { first_name: firstName, last_name: lastName } }
      });
      if (authErr) throw authErr;
      if (!authData.user) throw new Error("Account aanmaken mislukt");

      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/weddings", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({
          partner1_first: partner1, partner2_first: partner2,
          wedding_date: date, wedding_time: time,
          venue, city, template_slug: templates[selectedTemplate]?.slug,
        }),
      });
      const wedding = await res.json();
      if (wedding.id) router.push("/dashboard");
      else throw new Error("Bruiloft aanmaken mislukt");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Er ging iets mis");
    } finally { setLoading(false); }
  };

  const scroll = (dir: "l" | "r") => {
    carouselRef.current?.scrollBy({ left: dir === "r" ? 300 : -300, behavior: "smooth" });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f9f5f1", display: "flex", flexDirection: "column" }}>
      <header style={{ background: "white", borderBottom: "1px solid #ece8e4", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.2em", color: "#8B2635", textDecoration: "none" }}>CASA NOMADA</Link>
        <Link href="/login" style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b6560", textDecoration: "none" }}>Al een account? <span style={{ color: "#8B2635" }}>Inloggen</span></Link>
      </header>
      <div style={{ background: "white", borderBottom: "1px solid #ece8e4", padding: "16px 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <p style={{ fontFamily: "sans-serif", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8B2635", marginBottom: 8 }}>STAP {step + 1} VAN {STEPS.length}: {STEPS[step].toUpperCase()}</p>
          <div style={{ display: "flex", gap: 4 }}>
            {STEPS.map((_, i) => <div key={i} style={{ flex: 1, height: 3, borderRadius: 999, background: i <= step ? "#8B2635" : "#e0dbd7", transition: "background 0.3s" }} />)}
          </div>
        </div>
      </div>
      <div style={{ flex: 1, maxWidth: 680, margin: "0 auto", width: "100%", padding: "40px 24px 100px" }}>
        {step === 0 && (
          <div>
            <h1 style={{ fontFamily: "serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", color: "#16161D", marginBottom: 8 }}>Laten we jullie bruiloft instellen</h1>
            <p style={{ fontFamily: "sans-serif", fontSize: 15, color: "#6b6560", marginBottom: 32 }}>Alles kun je later nog aanpassen.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[["Partner 1", partner1, setPartner1, "Sophie"], ["Partner 2", partner2, setPartner2, "Thomas"]].map(([label, val, set, ph]) => (
                <div key={label as string}>
                  <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", marginBottom: 6 }}>{label as string}</label>
                  <input value={val as string} onChange={e => (set as (v: string) => void)(e.target.value)} placeholder={ph as string} autoFocus={label === "Partner 1"}
                    style={{ width: "100%", border: "1.5px solid #e0dbd7", borderRadius: 12, padding: "14px 16px", fontFamily: "sans-serif", fontSize: 15, color: "#16161D", outline: "none", boxSizing: "border-box", background: "white" }} />
                </div>
              ))}
            </div>
          </div>
        )}
        {step === 1 && (
          <div>
            <h2 style={{ fontFamily: "serif", fontSize: "clamp(1.8rem,4vw,2.4rem)", color: "#16161D", marginBottom: 8 }}>Datum en locatie</h2>
            <p style={{ fontFamily: "sans-serif", fontSize: 15, color: "#6b6560", marginBottom: 32 }}>Wanneer en waar is de grote dag?</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", marginBottom: 6 }}>Datum *</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: "100%", border: "1.5px solid #e0dbd7", borderRadius: 12, padding: "14px 16px", fontFamily: "sans-serif", fontSize: 15, outline: "none", boxSizing: "border-box", background: "white" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", marginBottom: 6 }}>Tijdstip</label>
                  <input type="time" value={time} onChange={e => setTime(e.target.value)} style={{ width: "100%", border: "1.5px solid #e0dbd7", borderRadius: 12, padding: "14px 16px", fontFamily: "sans-serif", fontSize: 15, outline: "none", boxSizing: "border-box", background: "white" }} />
                </div>
              </div>
              {[["Locatienaam", venue, setVenue, "Landgoed De Hooge Vuursche"], ["Stad / Land", city, setCity, "Amsterdam, Nederland"]].map(([label, val, set, ph]) => (
                <div key={label as string}>
                  <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", marginBottom: 6 }}>{label as string}</label>
                  <input value={val as string} onChange={e => (set as (v: string) => void)(e.target.value)} placeholder={ph as string} style={{ width: "100%", border: "1.5px solid #e0dbd7", borderRadius: 12, padding: "14px 16px", fontFamily: "sans-serif", fontSize: 15, outline: "none", boxSizing: "border-box", background: "white" }} />
                </div>
              ))}
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <h2 style={{ fontFamily: "serif", fontSize: "clamp(1.8rem,4vw,2.4rem)", color: "#16161D", marginBottom: 8 }}>Kies je sjabloon</h2>
            <p style={{ fontFamily: "sans-serif", fontSize: 15, color: "#6b6560", marginBottom: 24 }}>Je kunt dit later altijd wijzigen.</p>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <button onClick={() => scroll("l")} style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid #e0dbd7", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><ChevronLeft size={14} /></button>
              <span style={{ fontFamily: "serif", fontSize: 18, color: "#16161D", flex: 1, textAlign: "center" }}>{templates[selectedTemplate]?.name}</span>
              <button onClick={() => scroll("r")} style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid #e0dbd7", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><ChevronRight size={14} /></button>
            </div>
            <div ref={carouselRef} style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}>
              {templates.map((t, i) => (
                <div key={i} onClick={() => setSelectedTemplate(i)} style={{ flexShrink: 0, width: 110, cursor: "pointer" }}>
                  <div style={{ border: `2px solid ${selectedTemplate === i ? "#8B2635" : "transparent"}`, borderRadius: 10, overflow: "hidden", position: "relative" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.img} alt={t.name} style={{ width: "100%", aspectRatio: "9/16", objectFit: "cover", display: "block" }} />
                    {selectedTemplate === i && <div style={{ position: "absolute", top: 4, right: 4, width: 18, height: 18, borderRadius: "50%", background: "#8B2635", display: "flex", alignItems: "center", justifyContent: "center" }}><Check size={10} style={{ color: "white" }} /></div>}
                  </div>
                  <p style={{ fontFamily: "sans-serif", fontSize: 10, color: selectedTemplate === i ? "#8B2635" : "#9a8e88", textAlign: "center", marginTop: 4 }}>{t.name}</p>
                </div>
              ))}
            </div>
            <Link href={`/templates/${templates[selectedTemplate]?.slug}`} target="_blank" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: "sans-serif", fontSize: 12, color: "#8B2635", textDecoration: "none", marginTop: 12 }}>↗ Bekijk voorbeeld</Link>
          </div>
        )}
        {step === 3 && (
          <div>
            <h2 style={{ fontFamily: "serif", fontSize: "clamp(1.8rem,4vw,2.4rem)", color: "#16161D", marginBottom: 8 }}>Maak je account aan</h2>
            <div style={{ background: "#fdf6f4", border: "1px solid #f0e0db", borderRadius: 12, padding: "14px 18px", marginBottom: 24 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px" }}>
                {[{ l: "Namen", v: `${partner1} & ${partner2}` }, { l: "Datum", v: date ? new Date(date).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" }) : "—" }, { l: "Sjabloon", v: templates[selectedTemplate]?.name }].map(({ l, v }) => (
                  <div key={l} style={{ display: "flex", gap: 6 }}>
                    <span style={{ fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88" }}>{l}:</span>
                    <span style={{ fontFamily: "sans-serif", fontSize: 12, color: "#16161D", fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[["Voornaam", firstName, setFirstName, "Sophie"], ["Achternaam", lastName, setLastName, "De Vries"]].map(([l, v, s, p]) => (
                  <div key={l as string}>
                    <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", marginBottom: 6 }}>{l as string}</label>
                    <input value={v as string} onChange={e => (s as (v: string) => void)(e.target.value)} placeholder={p as string} style={{ width: "100%", border: "1.5px solid #e0dbd7", borderRadius: 10, padding: "12px 14px", fontFamily: "sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                ))}
              </div>
              <div>
                <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", marginBottom: 6 }}>E-mailadres *</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jouw@email.com" style={{ width: "100%", border: "1.5px solid #e0dbd7", borderRadius: 10, padding: "12px 14px", fontFamily: "sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div style={{ position: "relative" }}>
                <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", marginBottom: 6 }}>Wachtwoord * (min. 6 tekens)</label>
                <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ width: "100%", border: "1.5px solid #e0dbd7", borderRadius: 10, padding: "12px 40px 12px 14px", fontFamily: "sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, bottom: 12, background: "none", border: "none", cursor: "pointer", color: "#9a8e88" }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                <input type="checkbox" checked={accept} onChange={e => setAccept(e.target.checked)} style={{ marginTop: 3, accentColor: "#8B2635", flexShrink: 0 }} />
                <span style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b6560", lineHeight: 1.5 }}>
                  Ik accepteer de <Link href="/voorwaarden" style={{ color: "#8B2635" }}>Algemene Voorwaarden</Link> en het <Link href="/privacy" style={{ color: "#8B2635" }}>Privacybeleid</Link>
                </span>
              </label>
            </div>
            {error && <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#dc2626", marginTop: 12, background: "#fef2f2", padding: "10px 14px", borderRadius: 8 }}>{error}</p>}
            <button onClick={handleSubmit} disabled={!canProceed() || loading} style={{ width: "100%", background: "#8B2635", color: "white", border: "none", borderRadius: 999, padding: "16px", fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, cursor: !canProceed() || loading ? "not-allowed" : "pointer", opacity: !canProceed() || loading ? 0.6 : 1, marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {loading ? "Aanmaken..." : <>Account aanmaken & beginnen <ArrowRight size={16} /></>}
            </button>
          </div>
        )}
      </div>
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(8px)", borderTop: "1px solid #ece8e4", padding: "14px 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => step > 0 && setStep(s => s - 1)} disabled={step === 0} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "sans-serif", fontSize: 14, color: step === 0 ? "#c0b8b4" : "#5a5550", background: "none", border: "none", cursor: step === 0 ? "default" : "pointer" }}>
            <ArrowLeft size={16} /> Terug
          </button>
          {step < 3 && (
            <button onClick={() => canProceed() && setStep(s => s + 1)} disabled={!canProceed()} style={{ display: "flex", alignItems: "center", gap: 8, background: canProceed() ? "#8B2635" : "#e0dbd7", color: "white", border: "none", borderRadius: 999, padding: "12px 28px", fontFamily: "sans-serif", fontSize: 14, fontWeight: 500, cursor: canProceed() ? "pointer" : "not-allowed" }}>
              Doorgaan <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
