"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Music, Heart, MapPin, Clock, Camera, MessageSquare, Check } from "lucide-react";
import BloomOpening from "@/components/BloomOpening";

// ── Types ────────────────────────────────────────────────────────────────────
type Wedding = {
  id: string;
  partner1_first: string; partner2_first: string;
  partner1_last: string;  partner2_last: string;
  wedding_date: string;   wedding_time: string;
  venue: string;          city: string;          address: string;
  welcome_message: string;
  template_slug: string;
  show_rsvp: boolean;     show_photos: boolean;
  show_messages: boolean; show_countdown: boolean;
  primary_color: string;  slug: string;
};
type Event = {
  id: string; name: string;
  event_date: string; start_time: string; end_time: string;
  venue: string; city: string; description: string; is_main: boolean;
};
type Guest = { id: string; first_name: string; last_name: string; token: string; };

// ── Bloom assets ─────────────────────────────────────────────────────────────
const B = {
  body:         "/assets/templates/bloom/bl-cartoncino-body.webp",
  line:         "/assets/templates/bloom/bl-cartoncino-line.webp",
  cornice_leaf: "/assets/templates/bloom/bl-data-cornice-leaf.webp",
  cornice_ink:  "/assets/templates/bloom/bl-data-cornice-ink.webp",
  fascia:       "/assets/templates/bloom/bl-fascia-righe-ink.webp",
  fiocco:       "/assets/templates/bloom/bl-fiocco-ink.webp",
  fiocco_lungo: "/assets/templates/bloom/bl-fiocco-lungo-ink.webp",
  colomba:      "/assets/templates/bloom/bl-colomba-ink.webp",
  hero_ink:     "/assets/templates/bloom/bl-hero-pieno-ink.webp",
  hero_leaf:    "/assets/templates/bloom/bl-hero-pieno-leaf.webp",
  wave:         "/assets/templates/bloom/bl-wave.svg",
};

// ── Kleurfilter voor inkt-assets ─────────────────────────────────────────────
function inkFilter(color: string): string {
  const map: Record<string, string> = {
    "#8B2635": "sepia(1) saturate(3) hue-rotate(310deg) brightness(0.9)",
    "#1a2e4a": "sepia(1) saturate(2) hue-rotate(190deg) brightness(0.7)",
    "#5a7a5a": "sepia(1) saturate(2) hue-rotate(80deg)  brightness(0.8)",
    "#b5924d": "sepia(1) saturate(2) hue-rotate(20deg)  brightness(1.0)",
    "#b07070": "sepia(1) saturate(2) hue-rotate(330deg) brightness(1.0)",
    "#4a5568": "sepia(1) saturate(1) hue-rotate(200deg) brightness(0.7)",
    "#c4713d": "sepia(1) saturate(2) hue-rotate(5deg)   brightness(0.95)",
    "#2d5016": "sepia(1) saturate(2) hue-rotate(70deg)  brightness(0.7)",
  };
  return map[color] ?? "sepia(1) saturate(3) hue-rotate(310deg) brightness(0.9)";
}

// ── Bloom sectie-types ───────────────────────────────────────────────────────
// "card"   = ivoor karton achtergrond
// "fascia" = gestreepte aquarel band
// "plain"  = lichte achtergrond zonder textuur

// ── Sub-componenten ──────────────────────────────────────────────────────────

/** Ivoor kaartje-sectie met optionele cornice */
function BloomCard({
  children,
  withCornice = false,
  color,
  style: extraStyle,
}: {
  children: React.ReactNode;
  withCornice?: boolean;
  color: string;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{
      margin: "0 16px",
      background: "white",
      borderRadius: 20,
      padding: "28px 22px",
      boxShadow: "0 6px 28px rgba(0,0,0,0.07)",
      position: "relative",
      overflow: "hidden",
      ...extraStyle,
    }}>
      {/* Kartontextuur */}
      <img src={B.line} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.07, pointerEvents: "none" }} />
      {/* Cornice kader */}
      {withCornice && (
        <>
          <img src={B.cornice_leaf} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", opacity: 0.12, pointerEvents: "none" }} />
          <img src={B.cornice_ink}  alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", opacity: 0.10, filter: inkFilter(color), pointerEvents: "none" }} />
        </>
      )}
      <div style={{ position: "relative" }}>{children}</div>
    </div>
  );
}

/** Gestreepte aquarel fascia-sectie */
function BloomFascia({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  return (
    <div style={{ margin: "0 16px", position: "relative", borderRadius: 20, overflow: "hidden" }}>
      <img src={B.fascia} alt="" style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        objectFit: "cover",
        opacity: 0.18,
        filter: inkFilter(color),
      }} />
      <div style={{
        position: "relative",
        background: `${color}08`,
        borderRadius: 20,
        padding: "24px 22px",
      }}>
        {children}
      </div>
    </div>
  );
}

/** Label boven een sectie */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: "sans-serif", fontSize: 9,
      letterSpacing: "0.22em", textTransform: "uppercase",
      color: "#9a8e88", marginBottom: 14, paddingLeft: 2,
    }}>
      {children}
    </p>
  );
}

// ── Hoofd pagina ─────────────────────────────────────────────────────────────
export default function InvitePage() {
  const params       = useParams();
  const searchParams = useSearchParams();
  const slug  = params.slug as string;
  const token = searchParams.get("t");

  const [wedding,    setWedding]    = useState<Wedding | null>(null);
  const [events,     setEvents]     = useState<Event[]>([]);
  const [guest,      setGuest]      = useState<Guest | null>(null);
  const [opened,     setOpened]     = useState(false);
  const [musicOn,    setMusicOn]    = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<"idle" | "done">("idle");
  const [rsvpName,   setRsvpName]   = useState("");
  const [rsvpDiet,   setRsvpDiet]   = useState("");
  const [rsvpGuest,  setRsvpGuest]  = useState<"yes" | "no" | null>(null);
  const [msgText,    setMsgText]    = useState("");
  const [msgSent,    setMsgSent]    = useState(false);
  const [countdown,  setCountdown]  = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const color = wedding?.primary_color || "#8B2635";
  const ifilter = inkFilter(color);

  // ── Data laden ──────────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      const { data: w } = await supabase.from("weddings").select("*").eq("slug", slug).single();
      if (!w) return;
      setWedding(w);

      // Countdown timer
      if (w.wedding_date) {
        const tick = () => {
          const diff = new Date(w.wedding_date).getTime() - Date.now();
          if (diff <= 0) { if (countdownRef.current) clearInterval(countdownRef.current); return; }
          setCountdown({
            days:    Math.floor(diff / 86400000),
            hours:   Math.floor((diff % 86400000) / 3600000),
            minutes: Math.floor((diff % 3600000)  / 60000),
            seconds: Math.floor((diff % 60000)    / 1000),
          });
        };
        tick();
        countdownRef.current = setInterval(tick, 1000);
      }

      const { data: evs } = await supabase.from("events").select("*").eq("wedding_id", w.id).order("sort_order");
      setEvents(evs || []);

      if (token) {
        const { data: g } = await supabase.from("guests").select("*").eq("token", token).single();
        if (g) {
          setGuest(g);
          setRsvpName(`${g.first_name} ${g.last_name}`);
          await supabase.from("guests").update({ opened_at: new Date().toISOString(), status: "opened" }).eq("id", g.id);
        }
      }
    }
    load();
    return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
  }, [slug, token]);

  // ── Muziek ──────────────────────────────────────────────────────────────
  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (musicOn) { audioRef.current.pause(); setMusicOn(false); }
    else         { audioRef.current.play().catch(() => {}); setMusicOn(true); }
  };

  // ── RSVP ────────────────────────────────────────────────────────────────
  const submitRSVP = async () => {
    if (!wedding || !rsvpName || rsvpGuest === null) return;
    const attending = rsvpGuest === "yes";
    await supabase.from("rsvps").insert({
      wedding_id: wedding.id, guest_id: guest?.id || null,
      name: rsvpName, attending, diet: rsvpDiet, adults: 1,
    });
    if (guest) await supabase.from("guests").update({ status: attending ? "confirmed" : "declined" }).eq("id", guest.id);
    setRsvpStatus("done");
  };

  // ── Bericht ─────────────────────────────────────────────────────────────
  const submitMessage = async () => {
    if (!wedding || !msgText.trim()) return;
    await supabase.from("messages").insert({
      wedding_id: wedding.id,
      author_name: rsvpName || guest?.first_name || "Gast",
      content: msgText, status: "pending",
    });
    setMsgSent(true); setMsgText("");
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (!wedding) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100svh", background: "#f9f0eb" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width: 32, height: 32, border: `2px solid #8B2635`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );

  const namen    = `${wedding.partner1_first} & ${wedding.partner2_first}`;
  const datumLang = wedding.wedding_date
    ? new Date(wedding.wedding_date).toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "";

  // ── FASE 1: Bloom opening ─────────────────────────────────────────────────
  if (!opened) {
    return (
      <BloomOpening
        namen={namen}
        datumLang={datumLang}
        color={color}
        onComplete={() => setOpened(true)}
      />
    );
  }

  // ── FASE 2: Volledige Bloom uitnodiging ───────────────────────────────────
  return (
    <div style={{ minHeight: "100svh", background: "#f5ede8", fontFamily: "serif" }}>
      <style>{`
        @keyframes bloomFadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bloomFadeIn { from{opacity:0} to{opacity:1} }
        .bfu { animation: bloomFadeUp 0.75s ease both; }
        .bfi { animation: bloomFadeIn 0.6s ease both; }
        .bfu1 { animation-delay: 0.05s; }
        .bfu2 { animation-delay: 0.15s; }
        .bfu3 { animation-delay: 0.25s; }
        .bfu4 { animation-delay: 0.35s; }
        .bfu5 { animation-delay: 0.45s; }
        .bfu6 { animation-delay: 0.55s; }
        @media (prefers-reduced-motion: reduce) {
          .bfu,.bfi { animation: none; }
        }
      `}</style>

      {/* Muziek toggle */}
      <button
        onClick={toggleMusic}
        aria-label={musicOn ? "Muziek pauzeren" : "Muziek afspelen"}
        style={{
          position: "fixed", top: 16, right: 16, zIndex: 200,
          width: 40, height: 40, borderRadius: "50%",
          background: "rgba(255,255,255,0.95)", border: `1px solid ${color}25`,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", boxShadow: "0 2px 14px rgba(0,0,0,0.10)",
        }}
      >
        <Music size={15} style={{ color: musicOn ? color : "#9a8e88" }} />
      </button>

      <div style={{ maxWidth: 520, margin: "0 auto", paddingBottom: 80 }}>

        {/* ═══ HERO — gelaagde rozen compositie ═══════════════════════════ */}
        <div className="bfi" style={{ position: "relative", width: "100%", aspectRatio: "692 / 1500", overflow: "hidden" }}>
          {/* Ivoor karton body */}
          <img src={B.body} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          {/* Kartontextuur */}
          <img src={B.line} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.08, mixBlendMode: "multiply" }} />
          {/* Bladeren (altijd groen) */}
          <img src={B.hero_leaf} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          {/* Rozen inkt (kleur) */}
          <img src={B.hero_ink} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: ifilter, opacity: 0.88 }} />

          {/* Namen-cartouche overlay */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "0 48px",
          }}>
            <p style={{ fontFamily: "sans-serif", fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", color, opacity: 0.85, marginBottom: 10 }}>
              Met liefde uitgenodigd
            </p>
            <p style={{ fontFamily: "serif", fontSize: "clamp(24px, 6vw, 36px)", color: "#16161D", textAlign: "center", lineHeight: 1.15, margin: 0 }}>
              {namen}
            </p>
            <img src={B.wave} alt="" style={{ width: "50%", margin: "10px auto 8px", display: "block", opacity: 0.38 }} />
            {datumLang && (
              <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "#5a5550", textAlign: "center", letterSpacing: "0.05em" }}>{datumLang}</p>
            )}
          </div>
        </div>

        {/* Lange strik als overgang hero → content */}
        <div className="bfu bfu1" style={{ display: "flex", justifyContent: "center", margin: "-24px 0 8px", position: "relative", zIndex: 10 }}>
          <img src={B.fiocco_lungo} alt="" style={{ height: 72, width: "auto", filter: ifilter, opacity: 0.85 }} />
        </div>

        {/* ═══ DATUM & LOCATIE — ivoor kaartje met cornice ═════════════════ */}
        <div className="bfu bfu1" style={{ marginBottom: 16 }}>
          <BloomCard withCornice color={color}>
            <div style={{ textAlign: "center" }}>
              <SectionLabel>Datum</SectionLabel>
              <p style={{ fontFamily: "serif", fontSize: 20, color: "#16161D", fontWeight: 500, margin: "0 0 4px" }}>{datumLang}</p>
              {wedding.wedding_time && (
                <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b6560", margin: 0 }}>Aanvang {wedding.wedding_time} uur</p>
              )}
            </div>

            {/* Golvende lijn scheidingslijn */}
            <div style={{ textAlign: "center", margin: "16px 0" }}>
              <img src={B.wave} alt="" style={{ width: "60%", opacity: 0.25 }} />
            </div>

            <div style={{ textAlign: "center" }}>
              <SectionLabel>Locatie</SectionLabel>
              {wedding.venue   && <p style={{ fontFamily: "serif",     fontSize: 18, color: "#16161D", margin: "0 0 2px" }}>{wedding.venue}</p>}
              {wedding.city    && <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b6560", margin: 0 }}>{wedding.city}</p>}
              {wedding.address && (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(wedding.address + " " + wedding.city)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 10, fontFamily: "sans-serif", fontSize: 12, color, textDecoration: "none" }}
                >
                  <MapPin size={12} /> Route bekijken
                </a>
              )}
            </div>
          </BloomCard>
        </div>

        {/* ═══ COUNTDOWN — fascia achtergrond ══════════════════════════════ */}
        {wedding.show_countdown && countdown.days > 0 && (
          <div className="bfu bfu2" style={{ marginBottom: 16 }}>
            <BloomFascia color={color}>
              <p style={{ fontFamily: "sans-serif", fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: "#9a8e88", textAlign: "center", marginBottom: 14 }}>Nog</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                {[
                  { v: countdown.days,    l: "dagen"   },
                  { v: countdown.hours,   l: "uren"    },
                  { v: countdown.minutes, l: "min"     },
                  { v: countdown.seconds, l: "sec"     },
                ].map(({ v, l }) => (
                  <div key={l} style={{ textAlign: "center" }}>
                    <p style={{ fontFamily: "serif", fontSize: 28, color, fontWeight: 600, lineHeight: 1, margin: 0 }}>{String(v).padStart(2,"0")}</p>
                    <p style={{ fontFamily: "sans-serif", fontSize: 9, color: "#9a8e88", marginTop: 3 }}>{l}</p>
                  </div>
                ))}
              </div>
            </BloomFascia>
          </div>
        )}

        {/* ═══ WELKOMSTBERICHT — ivoor kaartje ═════════════════════════════ */}
        {wedding.welcome_message && (
          <div className="bfu bfu2" style={{ marginBottom: 16 }}>
            <BloomCard color={color}>
              {/* Kleine korte strik als decoratie */}
              <div style={{ textAlign: "center", marginBottom: 12 }}>
                <img src={B.fiocco} alt="" style={{ width: 36, opacity: 0.3, filter: ifilter }} />
              </div>
              <p style={{ fontFamily: "serif", fontSize: 16, fontStyle: "italic", color: "#5a5550", lineHeight: 1.8, textAlign: "center", margin: 0 }}>
                "{wedding.welcome_message}"
              </p>
              <div style={{ textAlign: "center", marginTop: 12 }}>
                <img src={B.wave} alt="" style={{ width: "45%", opacity: 0.22 }} />
              </div>
            </BloomCard>
          </div>
        )}

        {/* ═══ PROGRAMMA — per event een ivoor kaartje ═════════════════════ */}
        {events.length > 0 && (
          <div className="bfu bfu3" style={{ marginBottom: 16, padding: "0 16px" }}>
            <SectionLabel>Programma</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {events.map((ev, i) => (
                <div key={ev.id} style={{
                  background: "white",
                  borderRadius: 16,
                  padding: "16px 18px",
                  boxShadow: "0 2px 14px rgba(0,0,0,0.06)",
                  position: "relative", overflow: "hidden",
                  borderLeft: ev.is_main ? `3px solid ${color}` : "3px solid transparent",
                }}>
                  <img src={B.line} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.05, pointerEvents: "none" }} />
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start", position: "relative" }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${color}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Clock size={13} style={{ color }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: "serif", fontSize: 16, color: "#16161D", margin: "0 0 3px" }}>{ev.name}</p>
                      {ev.start_time && (
                        <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", margin: 0 }}>
                          {ev.start_time}{ev.end_time ? ` – ${ev.end_time}` : ""}
                        </p>
                      )}
                      {ev.venue && (
                        <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#6b6560", margin: "2px 0 0" }}>
                          {ev.venue}{ev.city ? `, ${ev.city}` : ""}
                        </p>
                      )}
                      {ev.description && (
                        <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", marginTop: 5, lineHeight: 1.5 }}>{ev.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ RSVP — fascia achtergrond ═══════════════════════════════════ */}
        {wedding.show_rsvp && (
          <div className="bfu bfu4" style={{ marginBottom: 16 }}>
            <BloomFascia color={color}>
              <SectionLabel>RSVP</SectionLabel>
              <p style={{ fontFamily: "serif", fontSize: 20, color: "#16161D", marginBottom: 18, margin: "0 0 18px" }}>Ben jij erbij?</p>

              {rsvpStatus === "done" ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <Heart size={30} style={{ color, margin: "0 auto 10px", display: "block" }} />
                  <p style={{ fontFamily: "serif", fontSize: 18, color: "#16161D", margin: 0 }}>Bedankt voor je bevestiging!</p>
                </div>
              ) : (
                <>
                  {/* Naam */}
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontFamily: "sans-serif", fontSize: 10, color: "#9a8e88", display: "block", marginBottom: 5, letterSpacing: "0.1em" }}>NAAM</label>
                    <input
                      value={rsvpName} onChange={e => setRsvpName(e.target.value)}
                      placeholder="Jouw naam"
                      style={{ border: "1.5px solid #e0dbd7", borderRadius: 10, padding: "10px 14px", fontFamily: "sans-serif", fontSize: 14, width: "100%", boxSizing: "border-box", outline: "none", background: "rgba(255,255,255,0.8)" }}
                    />
                  </div>

                  {/* Aanwezig/Afwezig knoppen */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                    <button
                      onClick={() => setRsvpGuest("yes")}
                      style={{
                        background: rsvpGuest === "yes" ? color : "rgba(255,255,255,0.8)",
                        color: rsvpGuest === "yes" ? "white" : "#5a5550",
                        border: `1.5px solid ${rsvpGuest === "yes" ? color : "#e0dbd7"}`,
                        borderRadius: 10, padding: "11px", fontFamily: "sans-serif", fontSize: 13,
                        cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      }}
                    >
                      {rsvpGuest === "yes" && <Check size={13} />} Ik kom!
                    </button>
                    <button
                      onClick={() => setRsvpGuest("no")}
                      style={{
                        background: rsvpGuest === "no" ? "#5a5550" : "rgba(255,255,255,0.8)",
                        color: rsvpGuest === "no" ? "white" : "#5a5550",
                        border: `1.5px solid ${rsvpGuest === "no" ? "#5a5550" : "#e0dbd7"}`,
                        borderRadius: 10, padding: "11px", fontFamily: "sans-serif", fontSize: 13,
                        cursor: "pointer", transition: "all 0.2s",
                      }}
                    >
                      Ik kan helaas niet
                    </button>
                  </div>

                  {/* Dieetwensen */}
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontFamily: "sans-serif", fontSize: 10, color: "#9a8e88", display: "block", marginBottom: 5, letterSpacing: "0.1em" }}>DIEETWENSEN (OPTIONEEL)</label>
                    <input
                      value={rsvpDiet} onChange={e => setRsvpDiet(e.target.value)}
                      placeholder="Vegetarisch, allergieën..."
                      style={{ border: "1.5px solid #e0dbd7", borderRadius: 10, padding: "10px 14px", fontFamily: "sans-serif", fontSize: 14, width: "100%", boxSizing: "border-box", outline: "none", background: "rgba(255,255,255,0.8)" }}
                    />
                  </div>

                  <button
                    onClick={submitRSVP}
                    disabled={!rsvpName || rsvpGuest === null}
                    style={{
                      background: (!rsvpName || rsvpGuest === null) ? "#c0b8b4" : color,
                      color: "white", border: "none", borderRadius: 999,
                      padding: "13px", fontFamily: "sans-serif", fontSize: 14, fontWeight: 600,
                      cursor: (!rsvpName || rsvpGuest === null) ? "default" : "pointer",
                      width: "100%", transition: "background 0.2s",
                    }}
                  >
                    Bevestigen
                  </button>
                </>
              )}
            </BloomFascia>
          </div>
        )}

        {/* ═══ DUIF DECORATIE ══════════════════════════════════════════════ */}
        <div style={{ display: "flex", justifyContent: "center", margin: "20px 0 12px" }}>
          <img src={B.colomba} alt="" style={{ width: 44, opacity: 0.22, filter: ifilter }} />
        </div>

        {/* ═══ FOTO UPLOAD ══════════════════════════════════════════════════ */}
        {wedding.show_photos && (
          <div className="bfu bfu5" style={{ marginBottom: 16 }}>
            <BloomCard color={color}>
              <div style={{ textAlign: "center" }}>
                <Camera size={22} style={{ color, margin: "0 auto 8px", display: "block" }} />
                <p style={{ fontFamily: "serif", fontSize: 18, color: "#16161D", margin: "0 0 4px" }}>Deel een foto</p>
                <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#9a8e88", margin: "0 0 16px", lineHeight: 1.5 }}>
                  Upload jouw favoriete moment van deze dag
                </p>
                <label style={{
                  display: "inline-block",
                  background: `${color}12`, color,
                  border: `1.5px solid ${color}35`,
                  borderRadius: 999, padding: "10px 22px",
                  fontFamily: "sans-serif", fontSize: 13, cursor: "pointer",
                }}>
                  Foto kiezen
                  <input type="file" accept="image/*" style={{ display: "none" }} />
                </label>
              </div>
            </BloomCard>
          </div>
        )}

        {/* ═══ GASTENBOEK ═══════════════════════════════════════════════════ */}
        {wedding.show_messages && (
          <div className="bfu bfu6" style={{ marginBottom: 16 }}>
            <BloomCard color={color}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <MessageSquare size={17} style={{ color }} />
                <p style={{ fontFamily: "serif", fontSize: 18, color: "#16161D", margin: 0 }}>Laat een bericht achter</p>
              </div>
              {msgSent ? (
                <div style={{ textAlign: "center", padding: "16px 0" }}>
                  <img src={B.fiocco} alt="" style={{ width: 32, opacity: 0.3, filter: ifilter, margin: "0 auto 8px", display: "block" }} />
                  <p style={{ fontFamily: "serif", fontSize: 16, color: "#5a5550", margin: 0 }}>Bedankt voor je bericht!</p>
                </div>
              ) : (
                <>
                  <textarea
                    rows={3} value={msgText} onChange={e => setMsgText(e.target.value)}
                    placeholder="Schrijf een persoonlijk bericht voor het bruidspaar..."
                    style={{ border: "1.5px solid #e0dbd7", borderRadius: 12, padding: "11px 14px", fontFamily: "sans-serif", fontSize: 13, width: "100%", boxSizing: "border-box", outline: "none", resize: "vertical", marginBottom: 10 }}
                  />
                  <button
                    onClick={submitMessage} disabled={!msgText.trim()}
                    style={{
                      background: msgText.trim() ? color : "#c0b8b4",
                      color: "white", border: "none", borderRadius: 999,
                      padding: "11px 20px", fontFamily: "sans-serif", fontSize: 13,
                      cursor: msgText.trim() ? "pointer" : "default", width: "100%",
                      transition: "background 0.2s",
                    }}
                  >
                    Bericht sturen
                  </button>
                </>
              )}
            </BloomCard>
          </div>
        )}

        {/* ═══ FOOTER — Bloom afsluiting ════════════════════════════════════ */}
        <div style={{ textAlign: "center", padding: "28px 16px 0" }}>
          {/* Gestreepte aquarel band */}
          <div style={{ position: "relative", margin: "0 16px 20px", borderRadius: 12, overflow: "hidden", height: 40 }}>
            <img src={B.fascia} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.22, filter: ifilter }} />
          </div>
          <img src={B.fiocco} alt="" style={{ width: 36, opacity: 0.25, filter: ifilter, margin: "0 auto 10px", display: "block" }} />
          <img src={B.wave} alt="" style={{ width: "40%", opacity: 0.2, margin: "0 auto 10px", display: "block" }} />
          <p style={{ fontFamily: "sans-serif", fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: "#c0b8b4" }}>
            Casa Nomada · Digitale trouwuitnodigingen
          </p>
        </div>
      </div>
    </div>
  );
}
