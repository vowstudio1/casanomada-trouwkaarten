"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getTemplate } from "@/lib/templates";
import { Check, Music, X } from "lucide-react";

const MUSIC_URL = "https://cdn.pixabay.com/audio/2023/11/10/audio_d4d18e7aa3.mp3";

type Invitation = {
  id: string;
  template_slug: string;
  partner1_name: string;
  partner2_name: string;
  wedding_date: string;
  wedding_time: string;
  location_name: string;
  location_city: string;
  message: string;
  dresscode: string;
  color_index: number;
  music_index: number;
  published: boolean;
};

type RsvpData = {
  name: string;
  attending: "yes" | "no" | null;
  diet: string;
  message: string;
};

export default function InvitationPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<"closed" | "opening" | "open">("closed");
  const [showRsvp, setShowRsvp] = useState(false);
  const [rsvp, setRsvp] = useState<RsvpData>({ name: "", attending: null, diet: "", message: "" });
  const [rsvpSent, setRsvpSent] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("invitations").select("*").eq("id", id).single();
      setInvitation(data);
      setLoading(false);
    }
    load();
    return () => { audioRef.current?.pause(); };
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#f5ede8", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 40, height: 40, border: "2px solid #8B2635", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!invitation || !invitation.published) return (
    <div style={{ minHeight: "100vh", background: "#f5ede8", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <p style={{ fontFamily: "serif", fontSize: 24, color: "#16161D" }}>Uitnodiging niet gevonden</p>
      <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#6b6560" }}>Deze uitnodiging bestaat niet of is nog niet gepubliceerd.</p>
    </div>
  );

  const template = getTemplate(invitation.template_slug);
  const namen = `${invitation.partner1_name} & ${invitation.partner2_name}`;
  const datum = invitation.wedding_date ? new Date(invitation.wedding_date).toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "";

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
    }, 1000);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (musicPlaying) { audioRef.current.pause(); setMusicPlaying(false); }
    else { audioRef.current.play().catch(() => {}); setMusicPlaying(true); }
  };

  const handleRsvp = async () => {
    if (!rsvp.name || !rsvp.attending) return;
    await supabase.from("rsvp").insert({
      invitation_id: id,
      name: rsvp.name,
      attending: rsvp.attending === "yes",
      diet: rsvp.diet,
      message: rsvp.message,
    });
    setRsvpSent(true);
    setShowRsvp(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5ede8", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <style>{`
        @keyframes envFlyInv{0%{transform:scale(1) rotate(0deg) translateY(0);opacity:1}40%{transform:scale(1.08) rotate(-4deg) translateY(-4%);opacity:1}100%{transform:scale(0.1) rotate(12deg) translateY(-160%);opacity:0}}
        @keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#d4b9b0;border-radius:10px}
      `}</style>

      {/* ── GESLOTEN: grote envelop ── */}
      {phase === "closed" && (
        <div onClick={handleOpen} style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", userSelect: "none", animation: "fadeInUp 0.8s ease forwards" }}>
          {/* Envelop */}
          <div style={{ position: "relative", width: "min(340px, 88vw)", aspectRatio: "5/3.5", marginBottom: 32 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 12, background: "#fff8f5", border: "1px solid #e0cbc3", boxShadow: "0 16px 48px rgba(139,38,53,0.14), 0 4px 12px rgba(0,0,0,0.08)" }} />
            {/* Flap boven */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "52%", overflow: "hidden", borderRadius: "12px 12px 0 0" }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #edddd5 50%, transparent 50%)" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(225deg, #edddd5 50%, transparent 50%)" }} />
            </div>
            <div style={{ position: "absolute", bottom: 0, left: 0, width: "50%", height: "52%", background: "linear-gradient(315deg, #e5cec5 50%, transparent 50%)", borderBottomLeftRadius: 12 }} />
            <div style={{ position: "absolute", bottom: 0, right: 0, width: "50%", height: "52%", background: "linear-gradient(225deg, #e5cec5 50%, transparent 50%)", borderBottomRightRadius: 12 }} />
            {/* Lakzegel */}
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 10, width: 56, height: 56, borderRadius: "50%", background: "radial-gradient(circle at 38% 38%, #b03545, #8B2635 50%, #701e2a)", border: "2px solid #701e2a", boxShadow: "0 4px 16px rgba(139,38,53,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#f5ddd8", fontSize: 16, fontFamily: "serif", fontStyle: "italic" }}>CN</span>
            </div>
          </div>
          <p style={{ fontFamily: "serif", fontSize: 20, color: "#16161D", marginBottom: 8 }}>{namen}</p>
          <p style={{ fontFamily: "sans-serif", fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", color: "#8B2635", opacity: 0.8 }}>Tik om te openen</p>
        </div>
      )}

      {/* ── OPENING: animatie ── */}
      {phase === "opening" && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "min(340px, 88vw)", aspectRatio: "5/3.5", background: "#fff8f5", borderRadius: 12, border: "1px solid #e0cbc3", boxShadow: "0 16px 48px rgba(139,38,53,0.14)", animation: "envFlyInv 0.95s cubic-bezier(.4,0,.2,1) forwards" }} />
        </div>
      )}

      {/* ── OPEN: uitnodiging ── */}
      {phase === "open" && (
        <div style={{ width: "100%", maxWidth: 480, animation: "fadeInUp 0.6s ease forwards" }}>
          {/* Muziek knop */}
          <div style={{ position: "fixed", top: 20, right: 20, zIndex: 50 }}>
            <button onClick={toggleMusic} style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(249,243,239,0.95)", border: "1px solid #e0cbc3", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 12px rgba(0,0,0,0.1)", padding: 0 }}>
              <Music size={16} style={{ color: musicPlaying ? "#8B2635" : "#9a8e88" }} />
            </button>
          </div>

          {/* Uitnodiging kaart */}
          <div ref={scrollRef} style={{ background: "white", margin: "16px", borderRadius: 24, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.14)" }}>
            {/* Header met template afbeelding */}
            {template && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={template.img} alt={template.name} style={{ width: "100%", display: "block" }} />
            )}

            {/* Content */}
            <div style={{ padding: "32px 28px" }}>
              <p style={{ fontFamily: "sans-serif", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B2635", marginBottom: 8, textAlign: "center" }}>Met liefde uitgenodigd</p>
              <h1 style={{ fontFamily: "serif", fontSize: "clamp(2rem, 6vw, 2.8rem)", color: "#16161D", textAlign: "center", marginBottom: 20, lineHeight: 1.1 }}>{namen}</h1>

              <div style={{ height: 1, background: "#ece8e4", margin: "0 0 20px" }} />

              {datum && (
                <div style={{ textAlign: "center", marginBottom: 16 }}>
                  <p style={{ fontFamily: "sans-serif", fontSize: 15, color: "#16161D", fontWeight: 500 }}>{datum}</p>
                  {invitation.wedding_time && <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b6560", marginTop: 4 }}>Aanvang {invitation.wedding_time} uur</p>}
                </div>
              )}

              {(invitation.location_name || invitation.location_city) && (
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                  {invitation.location_name && <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#16161D", fontWeight: 500 }}>{invitation.location_name}</p>}
                  {invitation.location_city && <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b6560", marginTop: 2 }}>{invitation.location_city}</p>}
                </div>
              )}

              {invitation.message && (
                <div style={{ background: "#fdf6f4", borderRadius: 12, padding: "16px 20px", margin: "20px 0" }}>
                  <p style={{ fontFamily: "serif", fontSize: 16, fontStyle: "italic", color: "#5a5550", lineHeight: 1.7, textAlign: "center" }}>"{invitation.message}"</p>
                </div>
              )}

              {invitation.dresscode && invitation.dresscode !== "Geen voorkeur" && (
                <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#8B2635", textAlign: "center", marginBottom: 20 }}>Dresscode: {invitation.dresscode}</p>
              )}

              <div style={{ height: 1, background: "#ece8e4", margin: "0 0 24px" }} />

              {/* RSVP / Bevestigen */}
              {rsvpSent ? (
                <div style={{ textAlign: "center", padding: "16px" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                    <Check size={22} style={{ color: "#16a34a" }} />
                  </div>
                  <p style={{ fontFamily: "serif", fontSize: 18, color: "#16161D", marginBottom: 4 }}>Bedankt!</p>
                  <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b6560" }}>Jullie reactie is ontvangen.</p>
                </div>
              ) : (
                <button onClick={() => setShowRsvp(true)}
                  style={{ width: "100%", background: "#8B2635", color: "white", border: "none", borderRadius: 999, padding: "16px", fontFamily: "sans-serif", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
                  Bevestigen
                </button>
              )}
            </div>

            {/* Footer nav */}
            <div style={{ background: "#f9f3ef", borderTop: "1px solid #e0cbc3", padding: "12px 16px" }}>
              <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                {["HOME", "DE LOCATIE", "CADEAUS", "BEVESTIGEN"].map((item) => (
                  <span key={item} style={{ fontSize: 8, letterSpacing: "0.06em", color: "#8B2635", fontFamily: "sans-serif", padding: "3px 6px", border: "0.5px solid #d4b9b0", borderRadius: 4 }}>{item}</span>
                ))}
              </div>
            </div>
          </div>

          <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "rgba(90,80,72,0.5)", textAlign: "center", marginTop: 16 }}>
            Casa Nomada · Digitale trouwkaarten
          </p>
        </div>
      )}

      {/* ── RSVP Modal ── */}
      {showRsvp && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={() => setShowRsvp(false)}>
          <div style={{ background: "white", borderRadius: "24px 24px 0 0", padding: "32px 24px 48px", width: "100%", maxWidth: 480, animation: "fadeInUp 0.3s ease" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontFamily: "serif", fontSize: 22, color: "#16161D" }}>Bevestigen</h3>
              <button onClick={() => setShowRsvp(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} style={{ color: "#9a8e88" }} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <input placeholder="Jouw naam" value={rsvp.name} onChange={e => setRsvp({ ...rsvp, name: e.target.value })}
                style={{ border: "1.5px solid #e0dbd7", borderRadius: 10, padding: "12px 14px", fontFamily: "sans-serif", fontSize: 14, color: "#16161D", outline: "none" }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {([["yes", "✓  Ik kom!"], ["no", "✗  Ik kan niet"]] as const).map(([val, label]) => (
                  <button key={val} onClick={() => setRsvp({ ...rsvp, attending: val })}
                    style={{ padding: "12px", borderRadius: 12, border: `1.5px solid ${rsvp.attending === val ? "#8B2635" : "#e0dbd7"}`, background: rsvp.attending === val ? "#8B2635" : "white", color: rsvp.attending === val ? "white" : "#5a5550", fontFamily: "sans-serif", fontSize: 14, cursor: "pointer", fontWeight: rsvp.attending === val ? 600 : 400 }}>
                    {label}
                  </button>
                ))}
              </div>
              {rsvp.attending === "yes" && (
                <input placeholder="Dieetwensen (optioneel)" value={rsvp.diet} onChange={e => setRsvp({ ...rsvp, diet: e.target.value })}
                  style={{ border: "1.5px solid #e0dbd7", borderRadius: 10, padding: "12px 14px", fontFamily: "sans-serif", fontSize: 14, color: "#16161D", outline: "none" }} />
              )}
              <textarea placeholder="Bericht (optioneel)" value={rsvp.message} onChange={e => setRsvp({ ...rsvp, message: e.target.value })} rows={2}
                style={{ border: "1.5px solid #e0dbd7", borderRadius: 10, padding: "12px 14px", fontFamily: "sans-serif", fontSize: 14, color: "#16161D", outline: "none", resize: "none" }} />
              <button onClick={handleRsvp} disabled={!rsvp.name || !rsvp.attending}
                style={{ background: "#8B2635", color: "white", border: "none", borderRadius: 999, padding: "14px", fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, cursor: !rsvp.name || !rsvp.attending ? "not-allowed" : "pointer", opacity: !rsvp.name || !rsvp.attending ? 0.5 : 1 }}>
                Bevestigen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
