"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getTemplate } from "@/lib/templates";
import { Check, Music, X, ChevronDown } from "lucide-react";

const MUSIC_URL = "https://cdn.pixabay.com/audio/2023/11/10/audio_d4d18e7aa3.mp3";

type Guest = { id: string; name: string; invitation_id: string; language: string; opened_at: string | null };
type Invitation = {
  id: string; template_slug: string; partner1_name: string; partner2_name: string;
  wedding_date: string; wedding_time: string; location_name: string; location_city: string;
  message: string; dresscode: string; color_index: number; music_index: number; published: boolean;
};

export default function GastPagina() {
  const { token } = useParams() as { token: string };
  const [guest, setGuest] = useState<Guest | null>(null);
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<"closed" | "open">("closed");
  const [showRsvp, setShowRsvp] = useState(false);
  const [rsvpSent, setRsvpSent] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [naam, setNaam] = useState("");
  const [attending, setAttending] = useState<"yes" | "no" | null>(null);
  const [diet, setDiet] = useState("");
  const [bericht, setBericht] = useState("");
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    async function load() {
      // Zoek gast op token
      const { data: g } = await supabase
        .from("guests").select("*").eq("token", token).single();
      if (!g) { setLoading(false); return; }
      setGuest(g);
      setNaam(g.name);

      // Markeer als geopend
      if (!g.opened_at) {
        await supabase.from("guests").update({ opened_at: new Date().toISOString() }).eq("id", g.id);
      }

      // Haal uitnodiging op
      const { data: inv } = await supabase
        .from("invitations").select("*").eq("id", g.invitation_id).single();
      setInvitation(inv);

      // Check of al bevestigd
      const { data: rsvp } = await supabase
        .from("rsvp").select("id").eq("guest_id", g.id).single();
      if (rsvp) setRsvpSent(true);

      setLoading(false);
    }
    load();
    return () => audioRef.current?.pause();
  }, [token]);

  const openInvitation = () => {
    setPhase("open");
    if (!audioRef.current) {
      audioRef.current = new Audio(MUSIC_URL);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.35;
    }
    audioRef.current.play().catch(() => {});
    setMusicPlaying(true);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (musicPlaying) { audioRef.current.pause(); setMusicPlaying(false); }
    else { audioRef.current.play().catch(() => {}); setMusicPlaying(true); }
  };

  const sendRsvp = async () => {
    if (!guest || !attending) return;
    setRsvpLoading(true);
    await supabase.from("rsvp").insert({
      invitation_id: guest.invitation_id,
      guest_id: guest.id,
      name: naam,
      attending: attending === "yes",
      diet,
      message: bericht,
    });
    setRsvpSent(true);
    setShowRsvp(false);
    setRsvpLoading(false);
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#f5ede8", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width: 36, height: 36, border: "2px solid #8B2635", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );

  if (!invitation || !guest || !invitation.published) return (
    <div style={{ minHeight: "100vh", background: "#f5ede8", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
      <p style={{ fontFamily: "serif", fontSize: 22, color: "#16161D" }}>Uitnodiging niet gevonden</p>
      <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#6b6560" }}>Controleer de link of vraag het bruidspaar om een nieuwe link.</p>
    </div>
  );

  const template = getTemplate(invitation.template_slug);
  const namen = `${invitation.partner1_name} & ${invitation.partner2_name}`;
  const datum = invitation.wedding_date
    ? new Date(invitation.wedding_date).toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <div style={{ minHeight: "100vh", background: "#f5ede8" }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:0.5}50%{opacity:1}}
        .fade-up{animation:fadeUp 0.6s ease both}
        .pulse{animation:pulse 2s ease-in-out infinite}
      `}</style>

      {/* Muziek knop */}
      {phase === "open" && (
        <button onClick={toggleMusic} style={{ position: "fixed", top: 16, right: 16, zIndex: 100, width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.95)", border: "1px solid #e0cbc3", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 12px rgba(0,0,0,0.1)" }}>
          <Music size={16} style={{ color: musicPlaying ? "#8B2635" : "#9a8e88" }} />
        </button>
      )}

      {/* ── GESLOTEN: grote envelop ── */}
      {phase === "closed" && (
        <div onClick={openInvitation} className="fade-up" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 24 }}>
          {/* Envelop */}
          <div style={{ position: "relative", width: "min(320px, 85vw)", aspectRatio: "5/3.5", marginBottom: 32 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 12, background: "#fff8f5", border: "1px solid #e0cbc3", boxShadow: "0 20px 60px rgba(139,38,53,0.15), 0 4px 16px rgba(0,0,0,0.08)" }} />
            {/* Flap boven */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "52%", overflow: "hidden", borderRadius: "12px 12px 0 0" }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #edddd5 50%, transparent 50%)" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(225deg, #edddd5 50%, transparent 50%)" }} />
            </div>
            {/* Flapjes onder */}
            <div style={{ position: "absolute", bottom: 0, left: 0, width: "50%", height: "52%", background: "linear-gradient(315deg, #e5cec5 50%, transparent 50%)", borderBottomLeftRadius: 12 }} />
            <div style={{ position: "absolute", bottom: 0, right: 0, width: "50%", height: "52%", background: "linear-gradient(225deg, #e5cec5 50%, transparent 50%)", borderBottomRightRadius: 12 }} />
            {/* CN lakzegel */}
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 10, width: 52, height: 52, borderRadius: "50%", background: "radial-gradient(circle at 38% 38%, #b03545, #8B2635 50%, #701e2a)", border: "2px solid #701e2a", boxShadow: "0 4px 16px rgba(139,38,53,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#f5ddd8", fontSize: 14, fontFamily: "serif", fontStyle: "italic" }}>CN</span>
            </div>
          </div>
          {/* Namen */}
          <p style={{ fontFamily: "serif", fontSize: "clamp(18px, 4vw, 24px)", color: "#16161D", marginBottom: 6 }}>{namen}</p>
          <p style={{ fontFamily: "sans-serif", fontSize: "clamp(10px, 2vw, 13px)", color: "#6b6560", marginBottom: 24 }}>nodigen {guest.name} uit</p>
          <p className="pulse" style={{ fontFamily: "sans-serif", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#8B2635", opacity: 0.75 }}>Tik om te openen</p>
        </div>
      )}

      {/* ── OPEN: uitnodiging ── */}
      {phase === "open" && (
        <div className="fade-up" style={{ maxWidth: 480, margin: "0 auto", padding: "16px 16px 80px" }}>
          {/* Uitnodigingskaart */}
          <div style={{ background: "white", borderRadius: 24, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }}>
            {/* Template afbeelding */}
            {template && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={template.img} alt={template.name} style={{ width: "100%", display: "block" }} />
            )}
            {/* Content */}
            <div style={{ padding: "32px 28px 28px" }}>
              <p style={{ fontFamily: "sans-serif", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#8B2635", textAlign: "center" as const, marginBottom: 8 }}>
                Met liefde uitgenodigd
              </p>
              <h1 style={{ fontFamily: "serif", fontSize: "clamp(2rem, 6vw, 2.8rem)", color: "#16161D", textAlign: "center" as const, lineHeight: 1.1, marginBottom: 20 }}>{namen}</h1>
              <div style={{ height: 1, background: "#ece8e4", marginBottom: 20 }} />
              {datum && (
                <div style={{ textAlign: "center" as const, marginBottom: 16 }}>
                  <p style={{ fontFamily: "sans-serif", fontSize: 15, color: "#16161D", fontWeight: 500 }}>{datum}</p>
                  {invitation.wedding_time && <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b6560", marginTop: 4 }}>Aanvang {invitation.wedding_time} uur</p>}
                </div>
              )}
              {(invitation.location_name || invitation.location_city) && (
                <div style={{ textAlign: "center" as const, marginBottom: 20 }}>
                  {invitation.location_name && <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#16161D", fontWeight: 500 }}>{invitation.location_name}</p>}
                  {invitation.location_city && <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b6560", marginTop: 2 }}>{invitation.location_city}</p>}
                </div>
              )}
              {invitation.message && (
                <div style={{ background: "#fdf6f4", borderRadius: 12, padding: "16px 20px", margin: "16px 0" }}>
                  <p style={{ fontFamily: "serif", fontSize: 16, fontStyle: "italic", color: "#5a5550", lineHeight: 1.7, textAlign: "center" as const }}>"{invitation.message}"</p>
                </div>
              )}
              {invitation.dresscode && invitation.dresscode !== "Geen voorkeur" && (
                <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#8B2635", textAlign: "center" as const, marginBottom: 8 }}>Dresscode: {invitation.dresscode}</p>
              )}
              <div style={{ height: 1, background: "#ece8e4", margin: "20px 0" }} />
              {/* RSVP knop */}
              {rsvpSent ? (
                <div style={{ textAlign: "center" as const, padding: "12px 0" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                    <Check size={20} style={{ color: "#16a34a" }} />
                  </div>
                  <p style={{ fontFamily: "serif", fontSize: 17, color: "#16161D" }}>Bedankt, {guest.name}!</p>
                  <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b6560", marginTop: 4 }}>Je reactie is ontvangen.</p>
                </div>
              ) : (
                <button onClick={() => setShowRsvp(true)} style={{ width: "100%", background: "#8B2635", color: "white", border: "none", borderRadius: 999, padding: "16px", fontFamily: "sans-serif", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
                  Bevestigen
                </button>
              )}
            </div>
            {/* Nav balk */}
            <div style={{ background: "#f9f3ef", borderTop: "1px solid #e0cbc3", padding: "10px" }}>
              <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                {["HOME", "DE LOCATIE", "CADEAUS", "BEVESTIGEN"].map(item => (
                  <span key={item} style={{ fontSize: 7, letterSpacing: "0.06em", color: "#8B2635", fontFamily: "sans-serif", padding: "3px 5px", border: "0.5px solid #d4b9b0", borderRadius: 3 }}>{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── RSVP MODAL ── */}
      {showRsvp && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={() => setShowRsvp(false)}>
          <div className="fade-up" style={{ background: "white", borderRadius: "24px 24px 0 0", padding: "28px 24px 48px", width: "100%", maxWidth: 480 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontFamily: "serif", fontSize: 22, color: "#16161D" }}>Bevestig je aanwezigheid</h3>
              <button onClick={() => setShowRsvp(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} style={{ color: "#9a8e88" }} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
              <div>
                <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", marginBottom: 6 }}>Jouw naam</label>
                <input value={naam} onChange={e => setNaam(e.target.value)} style={{ width: "100%", border: "1.5px solid #e0dbd7", borderRadius: 10, padding: "12px 14px", fontFamily: "sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box" as const }} />
              </div>
              <div>
                <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", marginBottom: 8 }}>Kom je?</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {([["yes", "✓  Ik kom!"], ["no", "✗  Ik kan helaas niet"]] as const).map(([val, label]) => (
                    <button key={val} onClick={() => setAttending(val)} style={{ padding: "13px", borderRadius: 12, border: `1.5px solid ${attending === val ? "#8B2635" : "#e0dbd7"}`, background: attending === val ? "#8B2635" : "white", color: attending === val ? "white" : "#5a5550", fontFamily: "sans-serif", fontSize: 13, cursor: "pointer", fontWeight: attending === val ? 600 : 400 }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              {attending === "yes" && (
                <div>
                  <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", marginBottom: 6 }}>Dieetwensen of allergieën</label>
                  <input value={diet} onChange={e => setDiet(e.target.value)} placeholder="Bijv. vegetarisch, glutenvrij..." style={{ width: "100%", border: "1.5px solid #e0dbd7", borderRadius: 10, padding: "12px 14px", fontFamily: "sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box" as const }} />
                </div>
              )}
              <div>
                <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", marginBottom: 6 }}>Bericht (optioneel)</label>
                <textarea value={bericht} onChange={e => setBericht(e.target.value)} rows={2} placeholder="Schrijf iets liefs..." style={{ width: "100%", border: "1.5px solid #e0dbd7", borderRadius: 10, padding: "12px 14px", fontFamily: "sans-serif", fontSize: 14, outline: "none", resize: "none", boxSizing: "border-box" as const }} />
              </div>
              <button onClick={sendRsvp} disabled={!naam || !attending || rsvpLoading} style={{ background: "#8B2635", color: "white", border: "none", borderRadius: 999, padding: "15px", fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, cursor: !naam || !attending ? "not-allowed" : "pointer", opacity: !naam || !attending ? 0.5 : 1 }}>
                {rsvpLoading ? "Versturen..." : "Bevestig mijn aanwezigheid"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
