"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Music, Palette, Eye, Send, ChevronRight } from "lucide-react";
import { getTemplate } from "@/lib/templates";
import { supabase } from "@/lib/supabase";

const TIKKIE_URL = "https://tikkie.me/pay/ch43q8tuu0jco3beatpf";
const MUSIC_URL = "https://cdn.pixabay.com/audio/2023/11/10/audio_d4d18e7aa3.mp3";

const STAPPEN = ["Gegevens", "Stijl", "Voorbeeld", "Publiceer"];

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const template = getTemplate(slug);

  // Stap
  const [stap, setStap] = useState(0);

  // Formulier data
  const [partner1, setPartner1] = useState("");
  const [partner2, setPartner2] = useState("");
  const [datum, setDatum] = useState("");
  const [tijd, setTijd] = useState("");
  const [locatie, setLocatie] = useState("");
  const [stad, setStad] = useState("");
  const [bericht, setBericht] = useState("");
  const [dresscode, setDresscode] = useState("Geen voorkeur");
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedMusic, setSelectedMusic] = useState(0);

  // Auth
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [email, setEmail] = useState("");
  const [wachtwoord, setWachtwoord] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // Opslaan
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [invitationId, setInvitationId] = useState<string | null>(null);
  const [gepubliceerd, setGepubliceerd] = useState(false);

  // Muziek preview
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUser({ id: data.user.id, email: data.user.email ?? "" });
    });
    return () => { audioRef.current?.pause(); };
  }, []);

  if (!template) return <div className="min-h-screen flex items-center justify-center"><p>Sjabloon niet gevonden</p></div>;

  const namen = partner1 && partner2 ? `${partner1} & ${partner2}` : partner1 || partner2 || "Jullie namen";
  const datumFormatted = datum ? new Date(datum).toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "";

  const toggleMusic = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(MUSIC_URL);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.4;
    }
    if (musicPlaying) { audioRef.current.pause(); setMusicPlaying(false); }
    else { audioRef.current.play().catch(() => {}); setMusicPlaying(true); }
  };

  const handleAuth = async () => {
    setAuthLoading(true);
    setAuthError("");
    try {
      if (authMode === "register") {
        const { data, error } = await supabase.auth.signUp({ email, password: wachtwoord });
        if (error) throw error;
        if (data.user) setUser({ id: data.user.id, email: data.user.email ?? "" });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: wachtwoord });
        if (error) throw error;
        if (data.user) setUser({ id: data.user.id, email: data.user.email ?? "" });
      }
    } catch (e: unknown) {
      setAuthError(e instanceof Error ? e.message : "Er ging iets mis");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleOpslaan = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { data, error } = await supabase.from("invitations").insert({
        user_id: user.id,
        template_slug: slug,
        partner1_name: partner1,
        partner2_name: partner2,
        wedding_date: datum,
        wedding_time: tijd,
        location_name: locatie,
        location_city: stad,
        message: bericht,
        dresscode,
        color_index: selectedColor,
        music_index: selectedMusic,
        published: false,
      }).select().single();
      if (error) throw error;
      setInvitationId(data.id);
      setSaved(true);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handlePubliceer = async () => {
    if (!invitationId) return;
    await supabase.from("invitations").update({ published: true }).eq("id", invitationId);
    setGepubliceerd(true);
  };

  // ── STAP 0: Gegevens ──
  const StapGegevens = () => (
    <div style={{ maxWidth: 520, margin: "0 auto" }}>
      <h2 style={{ fontFamily: "serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "#16161D", marginBottom: 8 }}>Jullie gegevens</h2>
      <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#6b6560", marginBottom: 32 }}>Vul de gegevens in voor jullie uitnodiging.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Namen */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#9a8e88", marginBottom: 6 }}>Partner 1</label>
            <input value={partner1} onChange={e => setPartner1(e.target.value)} placeholder="Sophie" style={{ width: "100%", border: "1.5px solid #e0dbd7", borderRadius: 10, padding: "12px 14px", fontFamily: "sans-serif", fontSize: 14, color: "#16161D", outline: "none", boxSizing: "border-box" as const }} />
          </div>
          <div>
            <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#9a8e88", marginBottom: 6 }}>Partner 2</label>
            <input value={partner2} onChange={e => setPartner2(e.target.value)} placeholder="Thomas" style={{ width: "100%", border: "1.5px solid #e0dbd7", borderRadius: 10, padding: "12px 14px", fontFamily: "sans-serif", fontSize: 14, color: "#16161D", outline: "none", boxSizing: "border-box" as const }} />
          </div>
        </div>
        {/* Datum & Tijd */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
          <div>
            <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#9a8e88", marginBottom: 6 }}>Datum</label>
            <input type="date" value={datum} onChange={e => setDatum(e.target.value)} style={{ width: "100%", border: "1.5px solid #e0dbd7", borderRadius: 10, padding: "12px 14px", fontFamily: "sans-serif", fontSize: 14, color: "#16161D", outline: "none", boxSizing: "border-box" as const }} />
          </div>
          <div>
            <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#9a8e88", marginBottom: 6 }}>Tijdstip</label>
            <input type="time" value={tijd} onChange={e => setTijd(e.target.value)} style={{ width: "100%", border: "1.5px solid #e0dbd7", borderRadius: 10, padding: "12px 14px", fontFamily: "sans-serif", fontSize: 14, color: "#16161D", outline: "none", boxSizing: "border-box" as const }} />
          </div>
        </div>
        {/* Locatie */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
          <div>
            <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#9a8e88", marginBottom: 6 }}>Locatie</label>
            <input value={locatie} onChange={e => setLocatie(e.target.value)} placeholder="Landgoed De Hooge Vuursche" style={{ width: "100%", border: "1.5px solid #e0dbd7", borderRadius: 10, padding: "12px 14px", fontFamily: "sans-serif", fontSize: 14, color: "#16161D", outline: "none", boxSizing: "border-box" as const }} />
          </div>
          <div>
            <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#9a8e88", marginBottom: 6 }}>Stad</label>
            <input value={stad} onChange={e => setStad(e.target.value)} placeholder="Amsterdam" style={{ width: "100%", border: "1.5px solid #e0dbd7", borderRadius: 10, padding: "12px 14px", fontFamily: "sans-serif", fontSize: 14, color: "#16161D", outline: "none", boxSizing: "border-box" as const }} />
          </div>
        </div>
        {/* Bericht */}
        <div>
          <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#9a8e88", marginBottom: 6 }}>Persoonlijk bericht <span style={{ color: "#c0b8b4" }}>(optioneel)</span></label>
          <textarea value={bericht} onChange={e => setBericht(e.target.value.slice(0, 200))} placeholder="Wij vieren onze liefde en hopen jullie erbij te mogen verwelkomen..." rows={3} style={{ width: "100%", border: "1.5px solid #e0dbd7", borderRadius: 10, padding: "12px 14px", fontFamily: "sans-serif", fontSize: 14, color: "#16161D", outline: "none", resize: "none", boxSizing: "border-box" as const }} />
          <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "#c0b8b4", textAlign: "right" as const, marginTop: 4 }}>{bericht.length}/200</p>
        </div>
        {/* Dresscode */}
        <div>
          <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#9a8e88", marginBottom: 6 }}>Dresscode</label>
          <select value={dresscode} onChange={e => setDresscode(e.target.value)} style={{ width: "100%", border: "1.5px solid #e0dbd7", borderRadius: 10, padding: "12px 14px", fontFamily: "sans-serif", fontSize: 14, color: "#16161D", outline: "none", background: "white", boxSizing: "border-box" as const }}>
            {["Geen voorkeur", "Formeel", "Smart casual", "Casual", "Zwart & Wit"].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>
    </div>
  );

  // ── STAP 1: Stijl ──
  const StapStijl = () => (
    <div style={{ maxWidth: 520, margin: "0 auto" }}>
      <h2 style={{ fontFamily: "serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "#16161D", marginBottom: 8 }}>Stijl kiezen</h2>
      <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#6b6560", marginBottom: 32 }}>Kies de kleur en muziek voor jullie uitnodiging.</p>

      {/* Kleuren */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <Palette size={14} style={{ color: "#8B2635" }} />
          <p style={{ fontFamily: "sans-serif", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "#9a8e88" }}>KLEUREN</p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const }}>
          {template.colors.map((color, i) => (
            <button key={i} onClick={() => setSelectedColor(i)}
              style={{ padding: "10px 18px", borderRadius: 999, border: selectedColor === i ? "1.5px solid #8B2635" : "1.5px solid #e0dbd7", background: selectedColor === i ? "#8B2635" : "white", color: selectedColor === i ? "white" : "#5a5550", fontFamily: "sans-serif", fontSize: 13, cursor: "pointer", transition: "all 0.15s" }}>
              {color.label}
            </button>
          ))}
        </div>
      </div>

      {/* Muziek */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <Music size={14} style={{ color: "#8B2635" }} />
          <p style={{ fontFamily: "sans-serif", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "#9a8e88" }}>MUZIEK</p>
        </div>
        <div style={{ border: "1.5px solid #e0dbd7", borderRadius: 12, overflow: "hidden" }}>
          {template.music.map((m, i) => (
            <div key={i} onClick={() => setSelectedMusic(i)}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", background: selectedMusic === i ? "#fdf6f4" : "white", borderBottom: i < template.music.length - 1 ? "1px solid #ece8e4" : "none", cursor: "pointer" }}>
              <span style={{ fontFamily: "sans-serif", fontSize: 14, color: selectedMusic === i ? "#8B2635" : "#5a5550" }}>{m}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {selectedMusic === i && (
                  <button onClick={e => { e.stopPropagation(); toggleMusic(); }}
                    style={{ width: 28, height: 28, borderRadius: "50%", background: "#8B2635", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    {musicPlaying ? <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><rect x="1" y="1" width="2" height="6" rx="0.5" fill="white"/><rect x="5" y="1" width="2" height="6" rx="0.5" fill="white"/></svg>
                      : <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><polygon points="1.5,0.5 7.5,4 1.5,7.5" fill="white"/></svg>}
                  </button>
                )}
                {selectedMusic === i && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#8B2635" }} />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── STAP 2: Voorbeeld ──
  const StapVoorbeeld = () => (
    <div style={{ maxWidth: 440, margin: "0 auto", textAlign: "center" as const }}>
      <h2 style={{ fontFamily: "serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "#16161D", marginBottom: 8 }}>Zo ziet jullie uitnodiging eruit</h2>
      <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#6b6560", marginBottom: 32 }}>Tevreden? Ga verder om te publiceren.</p>

      {/* Uitnodiging preview card */}
      <div style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.12)", marginBottom: 24 }}>
        {/* Header afbeelding */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={template.img} alt={template.name} style={{ width: "100%", display: "block", maxHeight: 280, objectFit: "cover" }} />
        {/* Content */}
        <div style={{ padding: "28px 32px 32px" }}>
          <p style={{ fontFamily: "sans-serif", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#8B2635", marginBottom: 8 }}>Uitnodiging</p>
          <h3 style={{ fontFamily: "serif", fontSize: 32, color: "#16161D", margin: "0 0 12px" }}>{namen}</h3>
          {datum && <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#5a5550", marginBottom: 6 }}>{datumFormatted}{tijd && ` · ${tijd} uur`}</p>}
          {locatie && <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#9a8e88", marginBottom: 6 }}>{locatie}{stad && `, ${stad}`}</p>}
          {bericht && <p style={{ fontFamily: "serif", fontSize: 15, fontStyle: "italic", color: "#5a5550", margin: "16px 0", lineHeight: 1.6 }}>"{bericht}"</p>}
          {dresscode !== "Geen voorkeur" && <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#8B2635", marginTop: 12 }}>Dresscode: {dresscode}</p>}
          <div style={{ borderTop: "1px solid #ece8e4", marginTop: 20, paddingTop: 20 }}>
            <button style={{ width: "100%", background: "#8B2635", color: "white", border: "none", borderRadius: 999, padding: "14px", fontFamily: "sans-serif", fontSize: 14, fontWeight: 500, cursor: "default" }}>
              Bevestigen
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, justifyContent: "center", marginBottom: 8 }}>
        <span style={{ fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", background: "#f5f0ed", borderRadius: 999, padding: "4px 12px" }}>✓ {template.colors[selectedColor]?.label}</span>
        <span style={{ fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", background: "#f5f0ed", borderRadius: 999, padding: "4px 12px" }}>♪ {template.music[selectedMusic]}</span>
        <span style={{ fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", background: "#f5f0ed", borderRadius: 999, padding: "4px 12px" }}>🌐 17 talen</span>
      </div>
    </div>
  );

  // ── STAP 3: Publiceer ──
  const StapPubliceer = () => (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <h2 style={{ fontFamily: "serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "#16161D", marginBottom: 8 }}>Publiceer jullie uitnodiging</h2>
      <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#6b6560", marginBottom: 32 }}>Één stap verwijderd van jullie digitale trouwkaart.</p>

      {gepubliceerd && invitationId ? (
        // ── Succes ──
        <div style={{ textAlign: "center" as const }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Check size={28} style={{ color: "#16a34a" }} />
          </div>
          <h3 style={{ fontFamily: "serif", fontSize: 24, color: "#16161D", marginBottom: 8 }}>Uitnodiging is live!</h3>
          <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#6b6560", marginBottom: 28 }}>Kopieer de link en deel hem met jullie gasten.</p>
          <div style={{ background: "#f5f0ed", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, gap: 10 }}>
            <span style={{ fontFamily: "sans-serif", fontSize: 13, color: "#5a5550", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
              {typeof window !== "undefined" ? window.location.origin : ""}/invitation/{invitationId}
            </span>
            <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/invitation/${invitationId}`); }}
              style={{ background: "#8B2635", color: "white", border: "none", borderRadius: 8, padding: "8px 14px", fontFamily: "sans-serif", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" as const }}>
              Kopieer
            </button>
          </div>
          <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#8B2635", color: "white", borderRadius: 999, padding: "14px 28px", fontFamily: "sans-serif", fontSize: 14, textDecoration: "none" }}>
            Ga naar dashboard <ArrowRight size={16} />
          </Link>
        </div>
      ) : !user ? (
        // ── Login/Register ──
        <div>
          <div style={{ background: "#fdf6f4", border: "1px solid #f0e0db", borderRadius: 16, padding: "24px", marginBottom: 24 }}>
            <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b6560", marginBottom: 0 }}>
              ✓ Maak een gratis account om jullie uitnodiging op te slaan en te publiceren.
            </p>
          </div>
          <div style={{ display: "flex", gap: 0, marginBottom: 24, border: "1.5px solid #e0dbd7", borderRadius: 12, overflow: "hidden" }}>
            {(["register", "login"] as const).map((mode) => (
              <button key={mode} onClick={() => setAuthMode(mode)}
                style={{ flex: 1, padding: "12px", fontFamily: "sans-serif", fontSize: 13, border: "none", background: authMode === mode ? "#8B2635" : "white", color: authMode === mode ? "white" : "#5a5550", cursor: "pointer" }}>
                {mode === "register" ? "Nieuw account" : "Inloggen"}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 12, marginBottom: 16 }}>
            <input type="email" placeholder="E-mailadres" value={email} onChange={e => setEmail(e.target.value)}
              style={{ border: "1.5px solid #e0dbd7", borderRadius: 10, padding: "12px 14px", fontFamily: "sans-serif", fontSize: 14, color: "#16161D", outline: "none" }} />
            <input type="password" placeholder="Wachtwoord" value={wachtwoord} onChange={e => setWachtwoord(e.target.value)}
              style={{ border: "1.5px solid #e0dbd7", borderRadius: 10, padding: "12px 14px", fontFamily: "sans-serif", fontSize: 14, color: "#16161D", outline: "none" }} />
          </div>
          {authError && <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#dc2626", marginBottom: 12 }}>{authError}</p>}
          <button onClick={handleAuth} disabled={authLoading}
            style={{ width: "100%", background: "#8B2635", color: "white", border: "none", borderRadius: 999, padding: "14px", fontFamily: "sans-serif", fontSize: 14, fontWeight: 500, cursor: authLoading ? "wait" : "pointer", opacity: authLoading ? 0.7 : 1, marginBottom: 24 }}>
            {authLoading ? "Bezig..." : authMode === "register" ? "Account aanmaken" : "Inloggen"}
          </button>
        </div>
      ) : !saved ? (
        // ── Opslaan ──
        <div>
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 16, padding: "16px 20px", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
            <Check size={16} style={{ color: "#16a34a" }} />
            <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#15803d", margin: 0 }}>Ingelogd als {user.email}</p>
          </div>
          <div style={{ background: "#fdf6f4", border: "1px solid #f0e0db", borderRadius: 16, padding: "24px", marginBottom: 24 }}>
            <h4 style={{ fontFamily: "serif", fontSize: 18, color: "#16161D", marginBottom: 16 }}>Samenvatting</h4>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
              {[
                { label: "Namen", value: namen },
                { label: "Datum", value: datumFormatted || "—" },
                { label: "Locatie", value: locatie ? `${locatie}${stad ? `, ${stad}` : ""}` : "—" },
                { label: "Sjabloon", value: template.name },
                { label: "Kleur", value: template.colors[selectedColor]?.label },
                { label: "Muziek", value: template.music[selectedMusic] },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", fontFamily: "sans-serif", fontSize: 13 }}>
                  <span style={{ color: "#9a8e88" }}>{label}</span>
                  <span style={{ color: "#16161D", fontWeight: 500 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tikkie betaling */}
          <div style={{ border: "1.5px solid #e0dbd7", borderRadius: 16, padding: "20px 24px", marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontFamily: "serif", fontSize: 18, color: "#16161D" }}>Totaal</span>
              <span style={{ fontFamily: "serif", fontSize: 24, color: "#8B2635", fontWeight: 600 }}>€ 89</span>
            </div>
            <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", marginBottom: 16 }}>Eenmalige betaling · Onbeperkt uitnodigingen · Alle features inbegrepen</p>
            <a href={TIKKIE_URL} target="_blank" rel="noopener noreferrer"
              style={{ display: "block", width: "100%", background: "#009DE0", color: "white", border: "none", borderRadius: 12, padding: "14px", fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, textAlign: "center" as const, textDecoration: "none", cursor: "pointer", boxSizing: "border-box" as const }}>
              💳 Betaal via Tikkie — € 89
            </a>
          </div>

          <button onClick={handleOpslaan} disabled={saving}
            style={{ width: "100%", background: "#16161D", color: "white", border: "none", borderRadius: 999, padding: "14px", fontFamily: "sans-serif", fontSize: 14, cursor: saving ? "wait" : "pointer", opacity: saving ? 0.7 : 1 }}>
            {saving ? "Opslaan..." : "Uitnodiging opslaan (na betaling)"}
          </button>
          <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "#c0b8b4", textAlign: "center" as const, marginTop: 10 }}>
            Betaal eerst via Tikkie, dan sla je de uitnodiging op.
          </p>
        </div>
      ) : (
        // ── Publiceren ──
        <div>
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 16, padding: "16px 20px", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
            <Check size={16} style={{ color: "#16a34a" }} />
            <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#15803d", margin: 0 }}>Uitnodiging opgeslagen!</p>
          </div>
          <div style={{ background: "#fdf6f4", border: "1px solid #f0e0db", borderRadius: 16, padding: "24px", marginBottom: 24 }}>
            <Send size={20} style={{ color: "#8B2635", marginBottom: 12 }} />
            <h4 style={{ fontFamily: "serif", fontSize: 18, color: "#16161D", marginBottom: 8 }}>Klaar om te publiceren</h4>
            <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b6560", lineHeight: 1.6 }}>
              Na publicatie krijgen jullie een unieke link die je deelt met je gasten via WhatsApp, Instagram of e-mail. Gasten openen de uitnodiging in hun eigen taal.
            </p>
          </div>
          <button onClick={handlePubliceer}
            style={{ width: "100%", background: "#8B2635", color: "white", border: "none", borderRadius: 999, padding: "16px", fontFamily: "sans-serif", fontSize: 15, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Send size={16} /> Publiceer uitnodiging
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f9f5f1" }}>
      {/* Header */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(8px)", borderBottom: "1px solid #ece8e4" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link href={`/templates/${slug}`} style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "sans-serif", fontSize: 13, color: "#6b6560", textDecoration: "none" }}>
              <ArrowLeft size={14} /> {template.name}
            </Link>
            <div style={{ width: 1, height: 20, background: "#e0dbd7" }} />
            <span style={{ fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, letterSpacing: "0.15em", color: "#16161D" }}>CASA NOMADA</span>
          </div>
          {/* Stap indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {STAPPEN.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: i < stap ? "pointer" : "default" }} onClick={() => i < stap && setStap(i)}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: i <= stap ? "#8B2635" : "#e0dbd7", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                    {i < stap ? <Check size={11} style={{ color: "white" }} /> : <span style={{ fontFamily: "sans-serif", fontSize: 10, color: i === stap ? "white" : "#9a8e88", fontWeight: 600 }}>{i + 1}</span>}
                  </div>
                  <span style={{ fontFamily: "sans-serif", fontSize: 12, color: i === stap ? "#8B2635" : "#9a8e88", display: window?.innerWidth > 600 ? "inline" : "none" }}>{s}</span>
                </div>
                {i < STAPPEN.length - 1 && <ChevronRight size={12} style={{ color: "#c0b8b4" }} />}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main style={{ paddingTop: 64, minHeight: "100vh", display: "flex", flexDirection: "column" as const }}>
        <div style={{ flex: 1, maxWidth: 1100, margin: "0 auto", width: "100%", padding: "48px 24px 120px" }}>
          {stap === 0 && <StapGegevens />}
          {stap === 1 && <StapStijl />}
          {stap === 2 && <StapVoorbeeld />}
          {stap === 3 && <StapPubliceer />}
        </div>

        {/* Navigatie knoppen */}
        {stap < 3 && (
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(8px)", borderTop: "1px solid #ece8e4", padding: "16px 24px" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button onClick={() => setStap(s => Math.max(0, s - 1))} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "sans-serif", fontSize: 14, color: stap === 0 ? "#c0b8b4" : "#5a5550", background: "none", border: "none", cursor: stap === 0 ? "default" : "pointer" }} disabled={stap === 0}>
                <ArrowLeft size={16} /> Vorige
              </button>
              <button onClick={() => setStap(s => Math.min(3, s + 1))}
                style={{ display: "flex", alignItems: "center", gap: 8, background: "#8B2635", color: "white", border: "none", borderRadius: 999, padding: "12px 28px", fontFamily: "sans-serif", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
                {stap === 2 ? <><Send size={15} /> Publiceer</> : <>{STAPPEN[stap + 1]} <ArrowRight size={15} /></>}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
