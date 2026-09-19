"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Music, Heart, MapPin, Clock, Camera, MessageSquare, ChevronDown } from "lucide-react";

type Wedding = {
  id: string; partner1_first: string; partner2_first: string;
  partner1_last: string; partner2_last: string;
  wedding_date: string; wedding_time: string; venue: string; city: string;
  address: string; welcome_message: string; template_slug: string;
  show_rsvp: boolean; show_photos: boolean; show_messages: boolean; show_countdown: boolean;
  primary_color: string; slug: string;
};
type Event = { id: string; name: string; event_date: string; start_time: string; end_time: string; venue: string; city: string; description: string; is_main: boolean; };
type Guest = { id: string; first_name: string; last_name: string; token: string; };

const BLOOM = {
  body: "/assets/templates/bloom/bl-cartoncino-body.webp",
  line: "/assets/templates/bloom/bl-cartoncino-line.webp",
  cornice_ink: "/assets/templates/bloom/bl-data-cornice-ink.webp",
  cornice_leaf: "/assets/templates/bloom/bl-data-cornice-leaf.webp",
  fascia: "/assets/templates/bloom/bl-fascia-righe-ink.webp",
  fiocco: "/assets/templates/bloom/bl-fiocco-ink.webp",
  fiocco_lungo: "/assets/templates/bloom/bl-fiocco-lungo-ink.webp",
  colomba: "/assets/templates/bloom/bl-colomba-ink.webp",
  hero_ink: "/assets/templates/bloom/bl-hero-pieno-ink.webp",
  hero_leaf: "/assets/templates/bloom/bl-hero-pieno-leaf.webp",
  wave: "/assets/templates/bloom/bl-wave.svg",
  poster: "/assets/templates/bloom/avorio_rosa-poster.jpg",
};

export default function InvitePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const token = searchParams.get("t");

  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [guest, setGuest] = useState<Guest | null>(null);
  const [phase, setPhase] = useState<"closed" | "opening" | "open">("closed");
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<"idle" | "yes" | "no" | "done">("idle");
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpDiet, setRsvpDiet] = useState("");
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });
  const [color, setColor] = useState("#8B2635");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    async function load() {
      const { data: w } = await supabase.from("weddings").select("*").eq("slug", slug).single();
      if (!w) return;
      setWedding(w);
      setColor(w.primary_color || "#8B2635");
      if (w.wedding_date) {
        const diff = new Date(w.wedding_date).getTime() - Date.now();
        if (diff > 0) setCountdown({ days: Math.floor(diff / 86400000), hours: Math.floor((diff % 86400000) / 3600000), minutes: Math.floor((diff % 3600000) / 60000) });
      }
      const { data: evs } = await supabase.from("events").select("*").eq("wedding_id", w.id).order("sort_order");
      setEvents(evs || []);
      if (token) {
        const { data: g } = await supabase.from("guests").select("*").eq("token", token).single();
        if (g) { setGuest(g); setRsvpName(`${g.first_name} ${g.last_name}`); await supabase.from("guests").update({ opened_at: new Date().toISOString(), status: "opened" }).eq("id", g.id); }
      }
    }
    load();
  }, [slug, token]);

  const open = () => {
    setPhase("opening");
    setTimeout(() => setPhase("open"), 1200);
  };

  const submitRSVP = async (attending: boolean) => {
    if (!wedding || !rsvpName) return;
    await supabase.from("rsvps").insert({ wedding_id: wedding.id, guest_id: guest?.id || null, name: rsvpName, attending, diet: rsvpDiet, adults: 1 });
    if (guest) await supabase.from("guests").update({ status: attending ? "confirmed" : "declined" }).eq("id", guest.id);
    setRsvpStatus("done");
  };

  if (!wedding) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f9f0eb" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width: 32, height: 32, border: `2px solid ${color}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );

  const namen = `${wedding.partner1_first} & ${wedding.partner2_first}`;
  const datumLang = wedding.wedding_date ? new Date(wedding.wedding_date).toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "";

  return (
    <div style={{ minHeight: "100vh", background: "#f9f0eb", fontFamily: "serif" }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes ribbonDrop{from{opacity:0;transform:translateY(-30px) scaleY(0.8)}to{opacity:1;transform:translateY(0) scaleY(1)}}
        @keyframes envelopeOpen{from{transform:scaleY(1)}to{transform:scaleY(0) translateY(-20px)}}
        .fade-up{animation:fadeUp 0.8s ease both}
        .fade-in{animation:fadeIn 0.6s ease both}
        .pulse{animation:pulse 2s ease-in-out infinite}
        @keyframes pulse{0%,100%{opacity:0.5}50%{opacity:1}}
      `}</style>

      {/* Muziek knop */}
      <button onClick={() => setMusicPlaying(!musicPlaying)} style={{ position: "fixed", top: 16, right: 16, zIndex: 200, width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.95)", border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 12px rgba(0,0,0,0.1)" }}>
        <Music size={15} style={{ color: musicPlaying ? color : "#9a8e88" }} />
      </button>

      {/* FASE 1: GESLOTEN ENVELOP */}
      {phase === "closed" && (
        <div onClick={open} style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 24 }}>
          <div className="fade-up" style={{ position: "relative", width: "min(320px, 85vw)" }}>
            {/* Envelop poster */}
            <img src={BLOOM.poster} alt="Uitnodiging" style={{ width: "100%", borderRadius: 16, boxShadow: "0 24px 64px rgba(0,0,0,0.18)", display: "block" }} />
            {/* Strik overlay */}
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -60%)", width: "70%", animation: "ribbonDrop 1s ease both 0.3s", opacity: 0 }}>
              <img src={BLOOM.fiocco} alt="" style={{ width: "100%", filter: `hue-rotate(0deg)` }} />
            </div>
            {/* Namen */}
            <div style={{ position: "absolute", bottom: "18%", left: "50%", transform: "translateX(-50%)", textAlign: "center", width: "80%" }}>
              <p style={{ fontFamily: "serif", fontSize: "clamp(16px,4vw,22px)", color: color, lineHeight: 1.2 }}>{namen}</p>
              {datumLang && <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "#6b6560", marginTop: 4 }}>{datumLang}</p>}
            </div>
          </div>
          <p className="pulse" style={{ fontFamily: "sans-serif", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: color, marginTop: 28, opacity: 0.75 }}>Tik om te openen</p>
        </div>
      )}

      {/* FASE 2: OPENING ANIMATIE */}
      {phase === "opening" && (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "relative", width: "min(320px, 85vw)", animation: "envelopeOpen 1s ease forwards" }}>
            <img src={BLOOM.poster} alt="" style={{ width: "100%", borderRadius: 16 }} />
          </div>
        </div>
      )}

      {/* FASE 3: OPEN UITNODIGING */}
      {phase === "open" && (
        <div style={{ maxWidth: 520, margin: "0 auto", padding: "0 0 80px" }}>

          {/* HERO — cartouche met rozen */}
          <div className="fade-in" style={{ position: "relative", width: "100%", aspectRatio: "3/4", overflow: "hidden" }}>
            <img src={BLOOM.body} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <img src={BLOOM.hero_leaf} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <img src={BLOOM.hero_ink} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: `sepia(1) saturate(3) hue-rotate(${color === "#8B2635" ? "300deg" : "200deg"})` }} />
            {/* Namen in cartouche */}
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 60px" }}>
              <p style={{ fontFamily: "sans-serif", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: color, marginBottom: 8, opacity: 0.8 }}>Met liefde uitgenodigd</p>
              <p style={{ fontFamily: "serif", fontSize: "clamp(22px,5vw,32px)", color: "#16161D", textAlign: "center", lineHeight: 1.15 }}>{namen}</p>
              <img src={BLOOM.wave} alt="" style={{ width: 120, margin: "10px auto", opacity: 0.4 }} />
              {datumLang && <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#5a5550", textAlign: "center" }}>{datumLang}</p>}
            </div>
          </div>

          {/* STRIK overgang */}
          <div className="fade-up" style={{ display: "flex", justifyContent: "center", marginTop: -20, position: "relative", zIndex: 10 }}>
            <img src={BLOOM.fiocco_lungo} alt="" style={{ width: 80, filter: `sepia(1) saturate(2) hue-rotate(${color === "#8B2635" ? "300deg" : "200deg"})` }} />
          </div>

          {/* DATUM & LOCATIE KAART */}
          <div className="fade-up" style={{ margin: "0 16px", background: "white", borderRadius: 20, padding: "28px 24px", boxShadow: "0 8px 32px rgba(0,0,0,0.08)", position: "relative", overflow: "hidden" }}>
            <img src={BLOOM.line} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.06, pointerEvents: "none" }} />
            {/* Datum cornice */}
            <div style={{ position: "relative", textAlign: "center", marginBottom: 20 }}>
              <img src={BLOOM.cornice_leaf} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", opacity: 0.15, pointerEvents: "none" }} />
              <img src={BLOOM.cornice_ink} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", opacity: 0.12, filter: `sepia(1) saturate(3) hue-rotate(300deg)`, pointerEvents: "none" }} />
              <p style={{ fontFamily: "sans-serif", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9a8e88", marginBottom: 6, position: "relative" }}>Datum</p>
              <p style={{ fontFamily: "serif", fontSize: 20, color: "#16161D", fontWeight: 500, position: "relative" }}>{datumLang}</p>
              {wedding.wedding_time && <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b6560", marginTop: 2, position: "relative" }}>Aanvang {wedding.wedding_time} uur</p>}
            </div>
            <div style={{ height: 1, background: `${color}20`, margin: "16px 0" }} />
            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "sans-serif", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9a8e88", marginBottom: 6 }}>Locatie</p>
              {wedding.venue && <p style={{ fontFamily: "serif", fontSize: 18, color: "#16161D" }}>{wedding.venue}</p>}
              {wedding.city && <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b6560" }}>{wedding.city}</p>}
              {wedding.address && (
                <a href={`https://maps.google.com/?q=${encodeURIComponent(wedding.address + " " + wedding.city)}`} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 8, fontFamily: "sans-serif", fontSize: 12, color, textDecoration: "none" }}>
                  <MapPin size={12} /> Route bekijken
                </a>
              )}
            </div>
          </div>

          {/* COUNTDOWN */}
          {wedding.show_countdown && countdown.days > 0 && (
            <div className="fade-up" style={{ margin: "16px 16px 0", position: "relative" }}>
              <img src={BLOOM.fascia} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", borderRadius: 16, opacity: 0.12, filter: `sepia(1) saturate(3) hue-rotate(300deg)` }} />
              <div style={{ background: `${color}10`, borderRadius: 16, padding: "20px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, position: "relative" }}>
                {[{ v: countdown.days, l: "dagen" }, { v: countdown.hours, l: "uren" }, { v: countdown.minutes, l: "minuten" }].map(({ v, l }) => (
                  <div key={l} style={{ textAlign: "center" }}>
                    <p style={{ fontFamily: "serif", fontSize: 32, color, fontWeight: 600, lineHeight: 1 }}>{v}</p>
                    <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "#9a8e88", marginTop: 2 }}>{l}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PERSOONLIJK BERICHT */}
          {wedding.welcome_message && (
            <div className="fade-up" style={{ margin: "16px 16px 0", background: "white", borderRadius: 20, padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", textAlign: "center", position: "relative", overflow: "hidden" }}>
              <img src={BLOOM.line} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.05, pointerEvents: "none" }} />
              <p style={{ fontFamily: "serif", fontSize: 16, fontStyle: "italic", color: "#5a5550", lineHeight: 1.75, position: "relative" }}>"{wedding.welcome_message}"</p>
            </div>
          )}

          {/* PROGRAMMA */}
          {events.length > 0 && (
            <div className="fade-up" style={{ margin: "16px 16px 0" }}>
              <p style={{ fontFamily: "sans-serif", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9a8e88", marginBottom: 12, paddingLeft: 4 }}>Programma</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {events.map(ev => (
                  <div key={ev.id} style={{ background: "white", borderRadius: 14, padding: "16px 18px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Clock size={14} style={{ color }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: "serif", fontSize: 16, color: "#16161D", marginBottom: 2 }}>{ev.name}</p>
                      {ev.start_time && <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88" }}>{ev.start_time}{ev.end_time ? ` – ${ev.end_time}` : ""}</p>}
                      {ev.venue && <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#6b6560" }}>{ev.venue}{ev.city ? `, ${ev.city}` : ""}</p>}
                      {ev.description && <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", marginTop: 4, lineHeight: 1.5 }}>{ev.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RSVP */}
          {wedding.show_rsvp && (
            <div className="fade-up" style={{ margin: "16px 16px 0", background: "white", borderRadius: 20, padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", position: "relative", overflow: "hidden" }}>
              <img src={BLOOM.fascia} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.06, borderRadius: 20, pointerEvents: "none" }} />
              <div style={{ position: "relative" }}>
                <p style={{ fontFamily: "sans-serif", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9a8e88", marginBottom: 4 }}>RSVP</p>
                <p style={{ fontFamily: "serif", fontSize: 20, color: "#16161D", marginBottom: 16 }}>Ben jij erbij?</p>
                {rsvpStatus === "done" ? (
                  <div style={{ textAlign: "center", padding: "16px 0" }}>
                    <Heart size={28} style={{ color, margin: "0 auto 8px" }} />
                    <p style={{ fontFamily: "serif", fontSize: 18, color: "#16161D" }}>Bedankt voor je bevestiging!</p>
                  </div>
                ) : (
                  <>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontFamily: "sans-serif", fontSize: 11, color: "#9a8e88", display: "block", marginBottom: 5 }}>Naam</label>
                      <input value={rsvpName} onChange={e => setRsvpName(e.target.value)} placeholder="Jouw naam" style={{ border: "1.5px solid #e0dbd7", borderRadius: 10, padding: "10px 14px", fontFamily: "sans-serif", fontSize: 14, width: "100%", boxSizing: "border-box", outline: "none" }} />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ fontFamily: "sans-serif", fontSize: 11, color: "#9a8e88", display: "block", marginBottom: 5 }}>Dieetwensen (optioneel)</label>
                      <input value={rsvpDiet} onChange={e => setRsvpDiet(e.target.value)} placeholder="Vegetarisch, allergieën..." style={{ border: "1.5px solid #e0dbd7", borderRadius: 10, padding: "10px 14px", fontFamily: "sans-serif", fontSize: 14, width: "100%", boxSizing: "border-box", outline: "none" }} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <button onClick={() => submitRSVP(true)} style={{ background: color, color: "white", border: "none", borderRadius: 999, padding: "13px", fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>✓ Ik kom!</button>
                      <button onClick={() => submitRSVP(false)} style={{ background: "white", color: "#5a5550", border: "1.5px solid #e0dbd7", borderRadius: 999, padding: "13px", fontFamily: "sans-serif", fontSize: 14, cursor: "pointer" }}>Ik kan helaas niet</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* DUIF decoratie */}
          <div style={{ display: "flex", justifyContent: "center", margin: "24px 0 8px" }}>
            <img src={BLOOM.colomba} alt="" style={{ width: 48, opacity: 0.3, filter: `sepia(1) saturate(3) hue-rotate(300deg)` }} />
          </div>

          {/* FOTO UPLOAD */}
          {wedding.show_photos && (
            <div className="fade-up" style={{ margin: "0 16px" }}>
              <div style={{ background: "white", borderRadius: 20, padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", textAlign: "center" }}>
                <Camera size={24} style={{ color, margin: "0 auto 8px" }} />
                <p style={{ fontFamily: "serif", fontSize: 18, color: "#16161D", marginBottom: 4 }}>Deel een foto</p>
                <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#9a8e88", marginBottom: 16 }}>Upload jouw favoriete moment van deze dag</p>
                <label style={{ display: "inline-block", background: `${color}15`, color, border: `1.5px solid ${color}40`, borderRadius: 999, padding: "10px 20px", fontFamily: "sans-serif", fontSize: 13, cursor: "pointer" }}>
                  Foto kiezen
                  <input type="file" accept="image/*" style={{ display: "none" }} />
                </label>
              </div>
            </div>
          )}

          {/* GASTENBOEK */}
          {wedding.show_messages && (
            <div className="fade-up" style={{ margin: "16px 16px 0" }}>
              <div style={{ background: "white", borderRadius: 20, padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <MessageSquare size={18} style={{ color }} />
                  <p style={{ fontFamily: "serif", fontSize: 18, color: "#16161D" }}>Laat een bericht achter</p>
                </div>
                <textarea rows={3} placeholder="Schrijf een persoonlijk bericht voor het bruidspaar..." style={{ border: "1.5px solid #e0dbd7", borderRadius: 12, padding: "12px 14px", fontFamily: "sans-serif", fontSize: 13, width: "100%", boxSizing: "border-box", outline: "none", resize: "vertical", marginBottom: 10 }} />
                <button style={{ background: color, color: "white", border: "none", borderRadius: 999, padding: "11px 20px", fontFamily: "sans-serif", fontSize: 13, cursor: "pointer", width: "100%" }}>
                  Bericht sturen
                </button>
              </div>
            </div>
          )}

          {/* FOOTER */}
          <div style={{ textAlign: "center", padding: "32px 16px 0" }}>
            <img src={BLOOM.fiocco} alt="" style={{ width: 40, opacity: 0.3, margin: "0 auto 12px", display: "block" }} />
            <p style={{ fontFamily: "sans-serif", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c0b8b4" }}>Casa Nomada · Digitale trouwuitnodigingen</p>
          </div>
        </div>
      )}
    </div>
  );
}
