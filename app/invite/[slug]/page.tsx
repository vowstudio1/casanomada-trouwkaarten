"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getTemplate } from "@/lib/templates";
import { Check, Music, X, Camera, MessageSquare } from "lucide-react";

const MUSIC_URL = "https://cdn.pixabay.com/audio/2023/11/10/audio_d4d18e7aa3.mp3";

type Wedding = {
  id: string; partner1_first: string; partner1_last: string; partner2_first: string; partner2_last: string;
  wedding_date: string; wedding_time: string; city: string; venue: string; address: string;
  intro_text: string; welcome_message: string; template_slug: string; status: string;
  show_photos: boolean; show_messages: boolean; show_rsvp: boolean; show_countdown: boolean;
};
type Guest = { id: string; first_name: string; token: string };

export default function PublicWedding() {
  const { slug } = useParams() as { slug: string };
  const searchParams = useSearchParams();
  const guestToken = searchParams.get("t");

  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [guest, setGuest] = useState<Guest | null>(null);
  const [events, setEvents] = useState<{ id: string; name: string; event_date: string; start_time: string; venue: string; city: string; description: string }[]>([]);
  const [photos, setPhotos] = useState<{ id: string; url: string; uploader_name: string }[]>([]);
  const [msgs, setMsgs] = useState<{ id: string; author_name: string; content: string; created_at: string }[]>([]);
  const [phase, setPhase] = useState<"closed" | "open">("closed");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"uitnodiging" | "fotos" | "berichten">("uitnodiging");
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [showRsvp, setShowRsvp] = useState(false);
  const [rsvpSent, setRsvpSent] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [rsvpName, setRsvpName] = useState("");
  const [attending, setAttending] = useState<"yes" | "no" | null>(null);
  const [diet, setDiet] = useState("");
  const [rsvpMsg, setRsvpMsg] = useState("");
  const [msgAuthor, setMsgAuthor] = useState("");
  const [msgContent, setMsgContent] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploaderName, setUploaderName] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    async function load() {
      const { data: w } = await supabase.from("weddings").select("*").eq("slug", slug).in("status", ["published", "preview"]).single();
      if (!w) { setLoading(false); return; }
      setWedding(w);

      const { data: evts } = await supabase.from("events").select("*").eq("wedding_id", w.id).order("sort_order");
      setEvents(evts || []);

      if (w.show_photos) {
        const res = await fetch(`/api/photos?wedding_id=${w.id}`);
        setPhotos(await res.json());
      }
      if (w.show_messages) {
        const res = await fetch(`/api/messages?wedding_id=${w.id}`);
        setMsgs(await res.json());
      }

      if (guestToken) {
        const { data: g } = await supabase.from("guests").select("*").eq("token", guestToken).single();
        if (g) {
          setGuest(g); setRsvpName(g.first_name);
          await supabase.from("guests").update({ opened_at: new Date().toISOString(), status: "opened" }).eq("id", g.id);
          const { data: existingRsvp } = await supabase.from("rsvps").select("id").eq("guest_id", g.id).single();
          if (existingRsvp) setRsvpSent(true);
        }
      }

      setLoading(false);
    }
    load();
    return () => audioRef.current?.pause();
  }, [slug, guestToken]);

  // Countdown
  useEffect(() => {
    if (!wedding?.wedding_date) return;
    const target = new Date(wedding.wedding_date).getTime();
    const calc = () => {
      const diff = target - Date.now();
      if (diff <= 0) return;
      setCountdown({ days: Math.floor(diff / 86400000), hours: Math.floor((diff % 86400000) / 3600000), minutes: Math.floor((diff % 3600000) / 60000) });
    };
    calc();
    const t = setInterval(calc, 60000);
    return () => clearInterval(t);
  }, [wedding?.wedding_date]);

  const toggleMusic = () => {
    if (!audioRef.current) { audioRef.current = new Audio(MUSIC_URL); audioRef.current.loop = true; audioRef.current.volume = 0.3; }
    if (musicPlaying) { audioRef.current.pause(); setMusicPlaying(false); }
    else { audioRef.current.play().catch(() => {}); setMusicPlaying(true); }
  };

  const sendRsvp = async () => {
    if (!rsvpName || !attending || !wedding) return;
    await fetch("/api/rsvp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ wedding_id: wedding.id, guest_token: guestToken, name: rsvpName, attending: attending === "yes", diet, message: rsvpMsg }) });
    setRsvpSent(true); setShowRsvp(false);
  };

  const sendMessage = async () => {
    if (!msgAuthor || !msgContent || !wedding) return;
    await fetch("/api/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ wedding_id: wedding.id, guest_token: guestToken, author_name: msgAuthor, content: msgContent }) });
    setMsgs(m => [{ id: Date.now().toString(), author_name: msgAuthor, content: msgContent, created_at: new Date().toISOString() }, ...m]);
    setMsgContent(""); setShowMessageForm(false);
  };

  const uploadPhoto = async () => {
    if (!uploadFile || !wedding) return;
    setUploadLoading(true);
    const fd = new FormData();
    fd.append("file", uploadFile); fd.append("wedding_id", wedding.id);
    fd.append("uploader_name", uploaderName || guest?.first_name || "Gast");
    if (guestToken) fd.append("guest_token", guestToken);
    const res = await fetch("/api/photos", { method: "POST", body: fd });
    const photo = await res.json();
    if (photo.url) setPhotos(p => [photo, ...p]);
    setUploadFile(null); setUploadLoading(false); setShowPhotoUpload(false); setActiveTab("fotos");
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#f5ede8", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width: 36, height: 36, border: "2px solid #8B2635", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );

  if (!wedding) return (
    <div style={{ minHeight: "100vh", background: "#f5ede8", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
      <p style={{ fontFamily: "serif", fontSize: 24, color: "#16161D" }}>Uitnodiging niet gevonden</p>
      <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#6b6560" }}>Controleer de link of vraag het bruidspaar om een nieuwe link.</p>
    </div>
  );

  const template = getTemplate(wedding.template_slug);
  const namen = `${wedding.partner1_first} & ${wedding.partner2_first}`;
  const datum = wedding.wedding_date ? new Date(wedding.wedding_date).toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "";

  return (
    <div style={{ minHeight: "100vh", background: "#f5ede8" }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}.fade-up{animation:fadeUp 0.6s ease both}.pulse{animation:pulse 2s ease-in-out infinite}@keyframes pulse{0%,100%{opacity:0.5}50%{opacity:1}}`}</style>

      {/* Muziek knop */}
      <button onClick={toggleMusic} style={{ position: "fixed", top: 16, right: 16, zIndex: 200, width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.95)", border: "1px solid #e0cbc3", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 12px rgba(0,0,0,0.1)" }}>
        <Music size={16} style={{ color: musicPlaying ? "#8B2635" : "#9a8e88" }} />
      </button>

      {/* GESLOTEN: envelop */}
      {phase === "closed" && (
        <div className="fade-up" onClick={() => setPhase("open")} style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 24 }}>
          <div style={{ position: "relative", width: "min(300px, 80vw)", aspectRatio: "5/3.5", marginBottom: 28 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 12, background: "#fff8f5", border: "1px solid #e0cbc3", boxShadow: "0 20px 60px rgba(139,38,53,0.15)" }} />
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "52%", overflow: "hidden", borderRadius: "12px 12px 0 0" }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #edddd5 50%, transparent 50%)" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(225deg, #edddd5 50%, transparent 50%)" }} />
            </div>
            <div style={{ position: "absolute", bottom: 0, left: 0, width: "50%", height: "52%", background: "linear-gradient(315deg, #e5cec5 50%, transparent 50%)", borderBottomLeftRadius: 12 }} />
            <div style={{ position: "absolute", bottom: 0, right: 0, width: "50%", height: "52%", background: "linear-gradient(225deg, #e5cec5 50%, transparent 50%)", borderBottomRightRadius: 12 }} />
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 10, width: 52, height: 52, borderRadius: "50%", background: "radial-gradient(circle at 38% 38%, #b03545, #8B2635 50%, #701e2a)", border: "2px solid #701e2a", boxShadow: "0 4px 16px rgba(139,38,53,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#f5ddd8", fontSize: 14, fontFamily: "serif", fontStyle: "italic" }}>CN</span>
            </div>
          </div>
          <p style={{ fontFamily: "serif", fontSize: "clamp(18px,4vw,24px)", color: "#16161D", marginBottom: 6 }}>{namen}</p>
          {guest && <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b6560", marginBottom: 20 }}>nodigt {guest.first_name} uit</p>}
          <p className="pulse" style={{ fontFamily: "sans-serif", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#8B2635", opacity: 0.75 }}>Tik om te openen</p>
        </div>
      )}

      {/* OPEN: uitnodiging */}
      {phase === "open" && (
        <div className="fade-up" style={{ maxWidth: 520, margin: "0 auto", padding: "16px 16px 100px" }}>
          {/* Template afbeelding */}
          {template && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={template.img} alt={template.name} style={{ width: "100%", borderRadius: "24px 24px 0 0", display: "block" }} />
          )}

          {/* Hoofdkaart */}
          <div style={{ background: "white", borderRadius: phase === "open" && template ? "0 0 24px 24px" : 24, padding: "32px 28px 28px", boxShadow: "0 20px 60px rgba(0,0,0,0.10)" }}>
            <p style={{ fontFamily: "sans-serif", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B2635", textAlign: "center", marginBottom: 8 }}>Met liefde uitgenodigd</p>
            <h1 style={{ fontFamily: "serif", fontSize: "clamp(2rem,6vw,2.8rem)", color: "#16161D", textAlign: "center", lineHeight: 1.1, marginBottom: 20 }}>{namen}</h1>
            <div style={{ height: 1, background: "#ece8e4", marginBottom: 20 }} />
            {datum && <p style={{ fontFamily: "sans-serif", fontSize: 15, color: "#16161D", textAlign: "center", fontWeight: 500, marginBottom: 4 }}>{datum}</p>}
            {wedding.wedding_time && <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b6560", textAlign: "center", marginBottom: 4 }}>Aanvang {wedding.wedding_time} uur</p>}
            {wedding.venue && <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#16161D", textAlign: "center", fontWeight: 500, marginTop: 12 }}>{wedding.venue}</p>}
            {wedding.city && <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b6560", textAlign: "center" }}>{wedding.city}</p>}

            {/* Countdown */}
            {wedding.show_countdown && countdown.days > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, margin: "20px 0", background: "#f9f5f1", borderRadius: 14, padding: "16px" }}>
                {[{ v: countdown.days, l: "dagen" }, { v: countdown.hours, l: "uren" }, { v: countdown.minutes, l: "minuten" }].map(({ v, l }) => (
                  <div key={l} style={{ textAlign: "center" }}>
                    <p style={{ fontFamily: "serif", fontSize: 28, color: "#8B2635", fontWeight: 600, lineHeight: 1 }}>{v}</p>
                    <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "#9a8e88", marginTop: 2 }}>{l}</p>
                  </div>
                ))}
              </div>
            )}

            {wedding.welcome_message && (
              <div style={{ background: "#fdf6f4", borderRadius: 12, padding: "16px 20px", margin: "20px 0" }}>
                <p style={{ fontFamily: "serif", fontSize: 16, fontStyle: "italic", color: "#5a5550", lineHeight: 1.7, textAlign: "center" }}>"{wedding.welcome_message}"</p>
              </div>
            )}

            {/* Events */}
            {events.length > 0 && (
              <div style={{ margin: "20px 0" }}>
                <p style={{ fontFamily: "sans-serif", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9a8e88", marginBottom: 12 }}>Programma</p>
                {events.map(ev => (
                  <div key={ev.id} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: "1px solid #ece8e4" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#fdf6f4", border: "1px solid #e0cbc3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 16 }}>💍</span>
                    </div>
                    <div>
                      <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#16161D", fontWeight: 500 }}>{ev.name}</p>
                      {ev.start_time && <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88" }}>{ev.start_time} uur</p>}
                      {ev.venue && <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#6b6560" }}>{ev.venue}{ev.city && `, ${ev.city}`}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ height: 1, background: "#ece8e4", margin: "20px 0" }} />

            {/* RSVP */}
            {wedding.show_rsvp && (
              rsvpSent ? (
                <div style={{ textAlign: "center", padding: "12px 0" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                    <Check size={20} style={{ color: "#16a34a" }} />
                  </div>
                  <p style={{ fontFamily: "serif", fontSize: 17, color: "#16161D" }}>Bedankt{guest ? `, ${guest.first_name}` : ""}!</p>
                  <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b6560", marginTop: 4 }}>Je aanwezigheid is bevestigd.</p>
                </div>
              ) : (
                <button onClick={() => setShowRsvp(true)} style={{ width: "100%", background: "#8B2635", color: "white", border: "none", borderRadius: 999, padding: "16px", fontFamily: "sans-serif", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
                  Bevestig je aanwezigheid
                </button>
              )
            )}
          </div>

          {/* Tabs: Foto's & Berichten */}
          {(wedding.show_photos || wedding.show_messages) && (
            <div style={{ marginTop: 20 }}>
              <div style={{ display: "flex", gap: 0, background: "white", borderRadius: 12, border: "1px solid #ece8e4", padding: 4, marginBottom: 16 }}>
                {[
                  { id: "uitnodiging", label: "Uitnodiging" },
                  ...(wedding.show_photos ? [{ id: "fotos", label: `Foto's (${photos.length})` }] : []),
                  ...(wedding.show_messages ? [{ id: "berichten", label: `Berichten (${msgs.length})` }] : []),
                ].map(t => (
                  <button key={t.id} onClick={() => setActiveTab(t.id as typeof activeTab)} style={{ flex: 1, padding: "10px 8px", borderRadius: 8, border: "none", background: activeTab === t.id ? "#8B2635" : "transparent", color: activeTab === t.id ? "white" : "#6b6560", fontFamily: "sans-serif", fontSize: 12, cursor: "pointer" }}>{t.label}</button>
                ))}
              </div>

              {/* Foto's */}
              {activeTab === "fotos" && (
                <div>
                  <button onClick={() => setShowPhotoUpload(true)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "white", border: "1.5px dashed #e0cbc3", borderRadius: 14, padding: "16px", fontFamily: "sans-serif", fontSize: 14, color: "#8B2635", cursor: "pointer", marginBottom: 16 }}>
                    <Camera size={16} /> Upload je foto's
                  </button>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                    {photos.map(p => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <div key={p.id} style={{ borderRadius: 10, overflow: "hidden", aspectRatio: "1", background: "#f0ebe8" }}>
                        <img src={p.url} alt={p.uploader_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    ))}
                    {photos.length === 0 && <p style={{ gridColumn: "span 2", fontFamily: "sans-serif", fontSize: 14, color: "#9a8e88", textAlign: "center", padding: "32px" }}>Nog geen foto's. Upload de eerste!</p>}
                  </div>
                </div>
              )}

              {/* Berichten */}
              {activeTab === "berichten" && (
                <div>
                  <button onClick={() => setShowMessageForm(true)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "white", border: "1.5px dashed #e0cbc3", borderRadius: 14, padding: "16px", fontFamily: "sans-serif", fontSize: 14, color: "#8B2635", cursor: "pointer", marginBottom: 16 }}>
                    <MessageSquare size={16} /> Laat een bericht achter
                  </button>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {msgs.map(m => (
                      <div key={m.id} style={{ background: "white", borderRadius: 14, padding: "16px 18px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                        <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#8B2635", fontWeight: 600, marginBottom: 6 }}>{m.author_name}</p>
                        <p style={{ fontFamily: "serif", fontSize: 15, fontStyle: "italic", color: "#5a5550", lineHeight: 1.6 }}>"{m.content}"</p>
                      </div>
                    ))}
                    {msgs.length === 0 && <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#9a8e88", textAlign: "center", padding: "32px" }}>Nog geen berichten. Wees de eerste!</p>}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* RSVP Modal */}
      {showRsvp && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={() => setShowRsvp(false)}>
          <div style={{ background: "white", borderRadius: "24px 24px 0 0", padding: "28px 24px 48px", width: "100%", maxWidth: 520 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontFamily: "serif", fontSize: 22, color: "#16161D" }}>Bevestig je aanwezigheid</h3>
              <button onClick={() => setShowRsvp(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} style={{ color: "#9a8e88" }} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", marginBottom: 6 }}>Jouw naam</label>
                <input value={rsvpName} onChange={e => setRsvpName(e.target.value)} style={{ width: "100%", border: "1.5px solid #e0dbd7", borderRadius: 10, padding: "12px 14px", fontFamily: "sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", marginBottom: 8 }}>Kom je?</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {([["yes", "✓  Ik kom!"], ["no", "✗  Ik kan niet"]] as const).map(([val, label]) => (
                    <button key={val} onClick={() => setAttending(val)} style={{ padding: "13px", borderRadius: 12, border: `1.5px solid ${attending === val ? "#8B2635" : "#e0dbd7"}`, background: attending === val ? "#8B2635" : "white", color: attending === val ? "white" : "#5a5550", fontFamily: "sans-serif", fontSize: 13, cursor: "pointer", fontWeight: attending === val ? 600 : 400 }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              {attending === "yes" && (
                <div>
                  <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", marginBottom: 6 }}>Dieetwensen</label>
                  <input value={diet} onChange={e => setDiet(e.target.value)} placeholder="Vegetarisch, glutenvrij..." style={{ width: "100%", border: "1.5px solid #e0dbd7", borderRadius: 10, padding: "12px 14px", fontFamily: "sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                </div>
              )}
              <div>
                <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", marginBottom: 6 }}>Bericht</label>
                <textarea value={rsvpMsg} onChange={e => setRsvpMsg(e.target.value)} rows={2} placeholder="Schrijf iets liefs..." style={{ width: "100%", border: "1.5px solid #e0dbd7", borderRadius: 10, padding: "12px 14px", fontFamily: "sans-serif", fontSize: 14, outline: "none", resize: "none", boxSizing: "border-box" }} />
              </div>
              <button onClick={sendRsvp} disabled={!rsvpName || !attending} style={{ background: "#8B2635", color: "white", border: "none", borderRadius: 999, padding: "15px", fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, cursor: !rsvpName || !attending ? "not-allowed" : "pointer", opacity: !rsvpName || !attending ? 0.5 : 1 }}>
                Bevestig mijn aanwezigheid
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Foto upload modal */}
      {showPhotoUpload && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={() => setShowPhotoUpload(false)}>
          <div style={{ background: "white", borderRadius: "24px 24px 0 0", padding: "28px 24px 48px", width: "100%", maxWidth: 520 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontFamily: "serif", fontSize: 22, color: "#16161D" }}>Foto uploaden</h3>
              <button onClick={() => setShowPhotoUpload(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {!guest && (
                <div>
                  <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", marginBottom: 6 }}>Jouw naam</label>
                  <input value={uploaderName} onChange={e => setUploaderName(e.target.value)} placeholder="Sophie" style={{ width: "100%", border: "1.5px solid #e0dbd7", borderRadius: 10, padding: "12px 14px", fontFamily: "sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                </div>
              )}
              <div>
                <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", marginBottom: 6 }}>Selecteer foto's (max 15MB)</label>
                <input type="file" accept="image/*" multiple onChange={e => e.target.files && setUploadFile(e.target.files[0])} style={{ fontFamily: "sans-serif", fontSize: 13 }} />
              </div>
              <button onClick={uploadPhoto} disabled={!uploadFile || uploadLoading} style={{ background: "#8B2635", color: "white", border: "none", borderRadius: 999, padding: "15px", fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, cursor: !uploadFile || uploadLoading ? "not-allowed" : "pointer", opacity: !uploadFile || uploadLoading ? 0.5 : 1 }}>
                {uploadLoading ? "Uploaden..." : "Upload foto"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bericht modal */}
      {showMessageForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={() => setShowMessageForm(false)}>
          <div style={{ background: "white", borderRadius: "24px 24px 0 0", padding: "28px 24px 48px", width: "100%", maxWidth: 520 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontFamily: "serif", fontSize: 22, color: "#16161D" }}>Laat een bericht achter</h3>
              <button onClick={() => setShowMessageForm(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {!guest && (
                <div>
                  <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", marginBottom: 6 }}>Jouw naam</label>
                  <input value={msgAuthor} onChange={e => setMsgAuthor(e.target.value)} style={{ width: "100%", border: "1.5px solid #e0dbd7", borderRadius: 10, padding: "12px 14px", fontFamily: "sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                </div>
              )}
              {guest && !msgAuthor && setMsgAuthor(guest.first_name)}
              <div>
                <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", marginBottom: 6 }}>Jouw bericht</label>
                <textarea value={msgContent} onChange={e => setMsgContent(e.target.value)} rows={4} placeholder="Schrijf een mooi wens voor het bruidspaar..." style={{ width: "100%", border: "1.5px solid #e0dbd7", borderRadius: 10, padding: "12px 14px", fontFamily: "sans-serif", fontSize: 14, outline: "none", resize: "none", boxSizing: "border-box" }} />
              </div>
              <button onClick={sendMessage} disabled={!msgContent || (!guest && !msgAuthor)} style={{ background: "#8B2635", color: "white", border: "none", borderRadius: 999, padding: "15px", fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                Verstuur bericht
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "20px", maxWidth: 520, margin: "0 auto" }}>
        <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "rgba(90,80,72,0.4)" }}>Casa Nomada · Digitale trouwkaarten</p>
      </div>
    </div>
  );
}
