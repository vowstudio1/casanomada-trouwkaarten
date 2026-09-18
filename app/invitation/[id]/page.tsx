"use client";

import React, { useState, useRef, useEffect } from "react";
import { Check, Heart, Plus, Minus, Music, MapPin, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";

const MUSIC_URL = "https://cdn.pixabay.com/audio/2023/11/10/audio_d4d18e7aa3.mp3";

type Phase = "closed" | "opening" | "open";
type RSVPStep = "idle" | "form" | "submitting" | "done";

interface InvitationData {
  partner1: string;
  partner2: string;
  wedding_date: string;
  location: string;
  template: string;
  template_img: string;
  music?: string;
}

const TEMPLATE_IMG_MAP: Record<string, string> = {
  "bloom": "bloom-en-vetrina-96e6b193",
  "volta-celeste": "volta-celeste-en-vetrina-63b82e9f",
  "zomertuin": "giardino-destate-en-vetrina-e4c79ec8",
  "villa-aurora": "villa-aurora-en-vetrina-50b36ee0",
  "het-zwanenmeer": "lago-dei-cigni-en-vetrina-6e0256ed",
  "villa-cortina": "villa-cortina-en-vetrina-553a7717",
  "minimale-couture": "couture-minimale-en-vetrina-93e7c6cd",
  "betoverd-bos": "incanto-nel-bosco-en-vetrina-6c056d35",
  "riviera-70": "riviera-70-en-vetrina-253c0193",
  "italiaanse-aquarel": "acquerello-italia-en-vetrina-3869b8cc",
  "oro-antico": "oro-antico-en-vetrina-22d36ceb",
  "tuscany-chic": "tuscany-chic-en-vetrina-3646f639",
  "gouden-uur": "tipografico-moderno-en-vetrina-2c921489",
  "de-geheime-tuin": "giardino-segreto-en-vetrina-c0e0298d",
  "tratto-d-inchiostro": "tratto-inchiostro-en-vetrina-48f6d0e0",
  "idillio": "idillio-en-vetrina-4806113a",
  "romantisch-botanisch": "botanico-romantico-en-vetrina-5a476f93",
  "strawberry-matcha": "strawberry-matcha-en-vetrina-4c490953",
  "toile-de-jouy": "toile-bleu-en-vetrina-a0fc5d6a",
};

const DIETARY_OPTIONS = [
  "Vegetarisch", "Veganistisch", "Glutenvrij", "Lactosevrij", "Noten-allergie", "Anders",
];

export default function InvitationPage({ params }: { params: { id: string } }) {
  const invitationId = params.id;

  const [phase, setPhase] = useState<Phase>("closed");
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [rsvpStep, setRsvpStep] = useState<RSVPStep>("idle");
  const [attendance, setAttendance] = useState<"yes" | "no" | null>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [guestNames, setGuestNames] = useState("");
  const [dietary, setDietary] = useState<string[]>([]);
  const [dietaryOther, setDietaryOther] = useState("");
  const [message, setMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    async function loadInvitation() {
      try {
        // Try to get user profile from Supabase profiles table
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", invitationId)
          .single();

        if (data) {
          const slug = data.template || "bloom";
          const imgKey = TEMPLATE_IMG_MAP[slug] || "bloom-en-vetrina-96e6b193";
          setInvitation({
            partner1: data.partner1 || "Sophie",
            partner2: data.partner2 || "Thomas",
            wedding_date: data.wedding_date || "",
            location: data.location || "",
            template: slug,
            template_img: `https://sponsalia.app/_next/image?url=%2Fassets%2Fmarketing%2Ftemplates%2F${imgKey}.jpg&w=800&q=75`,
          });
          return;
        }
      } catch {
        // Fall through to demo data
      }

      // Demo invitation if profile not found
      setInvitation({
        partner1: "Sophie",
        partner2: "Thomas",
        wedding_date: "2025-06-14",
        location: "Kasteel Hoensbroek, Limburg",
        template: "bloom",
        template_img: `https://sponsalia.app/_next/image?url=%2Fassets%2Fmarketing%2Ftemplates%2Fbloom-en-vetrina-96e6b193.jpg&w=800&q=75`,
      });
    }
    loadInvitation();

    return () => { audioRef.current?.pause(); };
  }, [invitationId]);

  function openEnvelope() {
    if (phase !== "closed") return;
    setPhase("opening");

    if (!audioRef.current) {
      audioRef.current = new Audio(MUSIC_URL);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }

    setTimeout(() => {
      setPhase("open");
      audioRef.current?.play().catch(() => {});
      setMusicPlaying(true);
    }, 1000);
  }

  function toggleMusic(e: React.MouseEvent) {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (musicPlaying) {
      audioRef.current.pause();
      setMusicPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setMusicPlaying(true);
    }
  }

  function toggleDietary(option: string) {
    setDietary((prev) =>
      prev.includes(option) ? prev.filter((d) => d !== option) : [...prev, option]
    );
  }

  async function submitRSVP() {
    if (attendance === null) return;
    setRsvpStep("submitting");
    setSubmitError("");

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitation_id: invitationId,
          attending: attendance === "yes",
          guest_count: attendance === "yes" ? guestCount : 0,
          guest_names: attendance === "yes" ? guestNames : "",
          dietary: attendance === "yes" ? dietary : [],
          dietary_other: dietary.includes("Anders") ? dietaryOther : "",
          message,
        }),
      });

      if (!res.ok) throw new Error("Verzenden mislukt");
      setRsvpStep("done");
    } catch (err) {
      setSubmitError("Er ging iets mis. Probeer het opnieuw.");
      setRsvpStep("form");
    }
  }

  function formatDate(dateStr: string) {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("nl-NL", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      });
    } catch {
      return dateStr;
    }
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

  if (!invitation) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f5ede8", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "2rem", height: "2rem", border: "2.5px solid #F0D0D4", borderTopColor: "#8B2635", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5ede8", fontFamily: "system-ui, sans-serif" }}>
      <style>{`
        @keyframes envFlyUp {
          0%   { transform: scale(1) rotate(0deg) translateY(0); opacity: 1; }
          40%  { transform: scale(1.08) rotate(-4deg) translateY(-3%); opacity: 1; }
          100% { transform: scale(0.1) rotate(12deg) translateY(-160%); opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes sealPulse {
          0%, 100% { box-shadow: 0 3px 12px rgba(139,38,53,0.35); }
          50%       { box-shadow: 0 3px 24px rgba(139,38,53,0.6); }
        }
      `}</style>

      {/* ── ENVELOP GESLOTEN ── */}
      {phase === "closed" && (
        <div
          onClick={openEnvelope}
          style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: "2rem", userSelect: "none" }}
        >
          <div style={{ position: "relative", width: "min(320px, 80vw)", aspectRatio: "5/3.5", marginBottom: "2rem" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "12px", background: "#fff8f5", border: "1px solid #e0cbc3", boxShadow: "0 12px 48px rgba(139,38,53,0.12), 0 3px 12px rgba(0,0,0,0.06)" }} />
            {/* Envelope flaps */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "52%", overflow: "hidden", borderRadius: "12px 12px 0 0" }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #edddd5 50%, transparent 50%)" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(225deg, #edddd5 50%, transparent 50%)" }} />
            </div>
            <div style={{ position: "absolute", bottom: 0, left: 0, width: "50%", height: "52%", background: "linear-gradient(315deg, #e5cec5 50%, transparent 50%)", borderBottomLeftRadius: 12 }} />
            <div style={{ position: "absolute", bottom: 0, right: 0, width: "50%", height: "52%", background: "linear-gradient(225deg, #e5cec5 50%, transparent 50%)", borderBottomRightRadius: 12 }} />
            {/* Wax seal */}
            <div style={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
              width: "clamp(44px, 10vw, 60px)", height: "clamp(44px, 10vw, 60px)",
              borderRadius: "50%",
              background: "radial-gradient(circle at 38% 38%, #b03545 0%, #8B2635 55%, #701e2a 100%)",
              border: "1.5px solid #701e2a",
              display: "flex", alignItems: "center", justifyContent: "center",
              animation: "sealPulse 2.5s ease-in-out infinite",
              zIndex: 10,
            }}>
              <span style={{ color: "#f5ddd8", fontSize: "clamp(12px, 2.5vw, 17px)", fontFamily: "Georgia, serif", fontStyle: "italic", letterSpacing: 1 }}>CN</span>
            </div>
          </div>

          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 600, color: "#16161D", textAlign: "center", marginBottom: "0.5rem" }}>
            {invitation.partner1} & {invitation.partner2}
          </h1>
          {invitation.wedding_date && (
            <p style={{ fontSize: "0.9375rem", color: "#8B6B62", marginBottom: "1.5rem", textAlign: "center" }}>
              {formatDate(invitation.wedding_date)}
            </p>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#8B2635", opacity: 0.75 }}>
            <Heart size={14} style={{ fill: "#8B2635" }} />
            <span style={{ fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>Tik om te openen</span>
            <Heart size={14} style={{ fill: "#8B2635" }} />
          </div>
        </div>
      )}

      {/* ── OPENING ANIMATIE ── */}
      {phase === "opening" && (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f5ede8" }}>
          <div style={{
            position: "relative", width: "min(320px, 80vw)", aspectRatio: "5/3.5",
            background: "#fff8f5", borderRadius: 12, border: "1px solid #e0cbc3",
            boxShadow: "0 12px 48px rgba(139,38,53,0.18)",
            animation: "envFlyUp 0.9s cubic-bezier(.4,0,.2,1) forwards",
          }} />
        </div>
      )}

      {/* ── UITNODIGING OPEN ── */}
      {phase === "open" && (
        <div>
          {/* Music toggle */}
          <button
            onClick={toggleMusic}
            style={{
              position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 50,
              width: "3rem", height: "3rem", borderRadius: "50%",
              backgroundColor: "rgba(255,248,245,0.95)", border: "1px solid #e0cbc3",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.12)", padding: 0,
            }}
            aria-label={musicPlaying ? "Muziek pauzeren" : "Muziek afspelen"}
          >
            <Music size={16} style={{ color: "#8B2635" }} />
          </button>

          {/* Hero image */}
          <div style={{ animation: "fadeIn 0.7s ease both" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={invitation.template_img}
              alt={`${invitation.partner1} & ${invitation.partner2}`}
              style={{ width: "100%", maxHeight: "85vh", objectFit: "cover", objectPosition: "top", display: "block" }}
            />
          </div>

          {/* Content */}
          <div style={{ maxWidth: "42rem", margin: "0 auto", padding: "3rem 1.5rem 5rem", animation: "fadeIn 0.7s ease 0.2s both" }}>

            {/* Names & date */}
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <p style={{ fontSize: "0.6875rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#8B2635", marginBottom: "0.75rem", fontWeight: 600 }}>
                Wij gaan trouwen
              </p>
              <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(2rem, 6vw, 3.5rem)", fontWeight: 600, color: "#16161D", lineHeight: 1.1, marginBottom: "1.25rem" }}>
                {invitation.partner1} & {invitation.partner2}
              </h1>
              {invitation.wedding_date && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "0.625rem" }}>
                  <Calendar size={15} style={{ color: "#8B2635", flexShrink: 0 }} />
                  <p style={{ fontSize: "1rem", color: "#16161D" }}>{formatDate(invitation.wedding_date)}</p>
                </div>
              )}
              {invitation.location && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                  <MapPin size={15} style={{ color: "#8B2635", flexShrink: 0 }} />
                  <p style={{ fontSize: "1rem", color: "#6B6B76" }}>{invitation.location}</p>
                </div>
              )}
            </div>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "3rem" }}>
              <div style={{ flex: 1, height: "1px", backgroundColor: "#E0CBC3" }} />
              <Heart size={14} style={{ color: "#8B2635", fill: "#8B2635", flexShrink: 0 }} />
              <div style={{ flex: 1, height: "1px", backgroundColor: "#E0CBC3" }} />
            </div>

            {/* Invitation message */}
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.375rem", color: "#16161D", lineHeight: 1.7, fontStyle: "italic" }}>
                Wij nodigen jullie van harte uit om deze bijzondere dag met ons te vieren.
                Het zou onze dag nog mooier maken als jullie erbij zijn.
              </p>
            </div>

            {/* Day program */}
            <div style={{ backgroundColor: "#FFF8F5", borderRadius: "1rem", border: "1px solid #E0CBC3", padding: "1.75rem", marginBottom: "3rem" }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.375rem", fontWeight: 600, color: "#16161D", marginBottom: "1.25rem", textAlign: "center" }}>
                Het programma
              </h2>
              {[
                { time: "14:00", label: "Ontvangst & aperitief" },
                { time: "15:00", label: "Burgerlijke huwelijksplechtigheid" },
                { time: "17:00", label: "Receptie & amuses" },
                { time: "19:30", label: "Diner" },
                { time: "22:00", label: "Feest & dans" },
              ].map(({ time, label }) => (
                <div key={time} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.625rem 0", borderBottom: "1px solid #EDD8D0" }}>
                  <span style={{ fontSize: "0.8125rem", color: "#8B2635", fontWeight: 600, minWidth: "3.5rem" }}>{time}</span>
                  <span style={{ fontSize: "0.9375rem", color: "#16161D" }}>{label}</span>
                </div>
              ))}
            </div>

            {/* RSVP section */}
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.875rem", fontWeight: 600, color: "#16161D", marginBottom: "0.5rem" }}>
                Bevestig jullie aanwezigheid
              </h2>
              <p style={{ fontSize: "0.9375rem", color: "#6B6B76" }}>
                We ontvangen graag jullie antwoord vóór 1 mei 2025.
              </p>
            </div>

            {rsvpStep === "done" ? (
              <div style={{ backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "1rem", padding: "2.5rem", textAlign: "center" }}>
                <div style={{ width: "3.5rem", height: "3.5rem", borderRadius: "50%", backgroundColor: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                  <Check size={22} style={{ color: "#166534" }} />
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.5rem", fontWeight: 600, color: "#166534", marginBottom: "0.5rem" }}>
                  {attendance === "yes" ? "Tot dan! 🥂" : "Bedankt voor jullie reactie"}
                </h3>
                <p style={{ fontSize: "0.9375rem", color: "#166534" }}>
                  {attendance === "yes"
                    ? "Jullie aanwezigheid is bevestigd. We kijken ernaar uit om jullie te zien!"
                    : "We begrijpen het — bedankt dat jullie jullie antwoord hebben laten weten."}
                </p>
              </div>
            ) : (
              <div style={{ backgroundColor: "#FFFFFF", borderRadius: "1rem", border: "1px solid #E0CBC3", padding: "1.75rem" }}>

                {/* Attendance choice */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem", marginBottom: "1.5rem" }}>
                  {(["yes", "no"] as const).map((choice) => (
                    <button
                      key={choice}
                      onClick={() => { setAttendance(choice); setRsvpStep("form"); }}
                      style={{
                        padding: "1rem",
                        border: `2px solid ${attendance === choice ? "#8B2635" : "#E0CBC3"}`,
                        borderRadius: "0.875rem",
                        backgroundColor: attendance === choice ? "#FDF6F7" : "#FFFFFF",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>
                        {choice === "yes" ? "🥂" : "😢"}
                      </div>
                      <p style={{ fontSize: "0.9375rem", fontWeight: 600, color: attendance === choice ? "#8B2635" : "#16161D" }}>
                        {choice === "yes" ? "Ja, wij komen!" : "Helaas, wij kunnen niet"}
                      </p>
                    </button>
                  ))}
                </div>

                {rsvpStep === "form" && attendance !== null && (
                  <div>
                    {attendance === "yes" && (
                      <>
                        <div style={{ marginBottom: "1.125rem" }}>
                          <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "#16161D", marginBottom: "0.375rem" }}>
                            Jullie namen
                          </label>
                          <input
                            type="text"
                            value={guestNames}
                            onChange={(e) => setGuestNames(e.target.value)}
                            placeholder="Lisa & Mark de Vries"
                            style={inputStyle}
                          />
                        </div>

                        <div style={{ marginBottom: "1.125rem" }}>
                          <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "#16161D", marginBottom: "0.5rem" }}>
                            Aantal gasten
                          </label>
                          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <button onClick={() => setGuestCount((n) => Math.max(1, n - 1))} style={{ width: "2.25rem", height: "2.25rem", borderRadius: "50%", border: "1px solid #E0CBC3", backgroundColor: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <Minus size={14} />
                            </button>
                            <span style={{ fontSize: "1.25rem", fontWeight: 600, color: "#16161D", minWidth: "1.5rem", textAlign: "center" }}>{guestCount}</span>
                            <button onClick={() => setGuestCount((n) => Math.min(10, n + 1))} style={{ width: "2.25rem", height: "2.25rem", borderRadius: "50%", border: "1px solid #E0CBC3", backgroundColor: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>

                        <div style={{ marginBottom: "1.25rem" }}>
                          <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "#16161D", marginBottom: "0.5rem" }}>
                            Dieetwensen <span style={{ fontWeight: 400, color: "#9CA3AF" }}>(optioneel)</span>
                          </label>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                            {DIETARY_OPTIONS.map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => toggleDietary(opt)}
                                style={{
                                  padding: "0.4rem 0.75rem",
                                  border: `1.5px solid ${dietary.includes(opt) ? "#8B2635" : "#E0CBC3"}`,
                                  borderRadius: "9999px",
                                  backgroundColor: dietary.includes(opt) ? "#FDF6F7" : "#FFFFFF",
                                  fontSize: "0.8125rem",
                                  color: dietary.includes(opt) ? "#8B2635" : "#16161D",
                                  cursor: "pointer",
                                  fontWeight: dietary.includes(opt) ? 600 : 400,
                                  transition: "all 0.15s",
                                }}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                          {dietary.includes("Anders") && (
                            <input
                              type="text"
                              value={dietaryOther}
                              onChange={(e) => setDietaryOther(e.target.value)}
                              placeholder="Beschrijf je allergie of dieetwens"
                              style={{ ...inputStyle, marginTop: "0.75rem" }}
                            />
                          )}
                        </div>
                      </>
                    )}

                    <div style={{ marginBottom: "1.25rem" }}>
                      <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "#16161D", marginBottom: "0.375rem" }}>
                        Persoonlijk bericht <span style={{ fontWeight: 400, color: "#9CA3AF" }}>(optioneel)</span>
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Schrijf een warm berichtje aan het bruidspaar…"
                        rows={3}
                        style={{ ...inputStyle, resize: "vertical", minHeight: "5rem" }}
                      />
                    </div>

                    {submitError && (
                      <p style={{ color: "#991B1B", fontSize: "0.875rem", marginBottom: "1rem" }}>{submitError}</p>
                    )}

                    <button
                      onClick={submitRSVP}
                      disabled={rsvpStep === "submitting"}
                      style={{
                        width: "100%",
                        padding: "0.875rem",
                        backgroundColor: rsvpStep === "submitting" ? "#B08086" : "#8B2635",
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: "9999px",
                        fontSize: "0.9375rem",
                        fontWeight: 600,
                        cursor: rsvpStep === "submitting" ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        transition: "background-color 0.15s",
                      }}
                    >
                      {rsvpStep === "submitting" ? "Versturen…" : (
                        attendance === "yes" ? (
                          <><Heart size={16} style={{ fill: "#FFFFFF" }} /> Bevestig aanwezigheid</>
                        ) : "Verstuur mijn antwoord"
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div style={{ textAlign: "center", marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid #E0CBC3" }}>
              <p style={{ fontSize: "0.75rem", color: "#9CA3AF", letterSpacing: "0.1em" }}>
                Digitale uitnodiging door{" "}
                <span style={{ color: "#8B2635", fontWeight: 500 }}>Casa Nomada</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
