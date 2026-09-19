"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/Layout";
import { Save, Eye, ArrowRight, Check } from "lucide-react";

type Wedding = {
  id: string; partner1_first: string; partner1_last: string;
  partner2_first: string; partner2_last: string; wedding_date: string;
  wedding_time: string; city: string; venue: string; address: string;
  welcome_message: string; intro_text: string; template_slug: string;
  show_photos: boolean; show_messages: boolean; show_rsvp: boolean; show_countdown: boolean;
  slug: string;
};

export default function BuilderPage() {
  const router = useRouter();
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [session, setSession] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("algemeen");

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      if (!s) { router.push("/login"); return; }
      setSession(s.access_token);
      const res = await fetch("/api/weddings", { headers: { Authorization: `Bearer ${s.access_token}` } });
      const ws = await res.json();
      if (ws[0]) setWedding(ws[0]);
      else router.push("/register");
    });
  }, [router]);

  const save = useCallback(async (data: Wedding) => {
    if (!session) return;
    setSaving(true); setSaved(false);
    await fetch("/api/weddings", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session}` },
      body: JSON.stringify(data),
    });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [session]);

  const update = (field: keyof Wedding, value: string | boolean) => {
    if (!wedding) return;
    const updated = { ...wedding, [field]: value };
    setWedding(updated);
  };

  if (!wedding) return (
    <DashboardLayout>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ width: 32, height: 32, border: "2px solid #8B2635", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div>
    </DashboardLayout>
  );

  const tabs = [
    { id: "algemeen", label: "Algemeen" },
    { id: "opties", label: "Opties" },
    { id: "teksten", label: "Teksten" },
  ];

  const inputStyle: React.CSSProperties = { width: "100%", border: "1.5px solid #e0dbd7", borderRadius: 10, padding: "11px 14px", fontFamily: "sans-serif", fontSize: 14, color: "#16161D", outline: "none", boxSizing: "border-box", background: "white" };
  const labelStyle: React.CSSProperties = { display: "block", fontFamily: "sans-serif", fontSize: 11, color: "#9a8e88", marginBottom: 5, letterSpacing: "0.05em" };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: "serif", fontSize: 28, color: "#16161D", marginBottom: 4 }}>Builder</h1>
            <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#9a8e88" }}>Bewerk de inhoud van jullie uitnodiging</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <a href={`/invite/${wedding.slug}`} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, background: "white", border: "1.5px solid #e0dbd7", borderRadius: 999, padding: "10px 18px", fontFamily: "sans-serif", fontSize: 13, color: "#5a5550", textDecoration: "none" }}>
              <Eye size={14} /> Preview
            </a>
            <button onClick={() => save(wedding)} disabled={saving} style={{ display: "flex", alignItems: "center", gap: 6, background: "#8B2635", color: "white", border: "none", borderRadius: 999, padding: "10px 18px", fontFamily: "sans-serif", fontSize: 13, cursor: "pointer" }}>
              {saved ? <><Check size={14} /> Opgeslagen</> : saving ? "Opslaan..." : <><Save size={14} /> Opslaan</>}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, background: "white", borderRadius: 12, border: "1px solid #ece8e4", padding: 4, marginBottom: 24, width: "fit-content" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: "9px 20px", borderRadius: 8, border: "none", background: activeTab === t.id ? "#8B2635" : "transparent", color: activeTab === t.id ? "white" : "#6b6560", fontFamily: "sans-serif", fontSize: 13, cursor: "pointer", transition: "all 0.15s" }}>{t.label}</button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24 }}>
          {/* Formulier */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {activeTab === "algemeen" && (
              <>
                <div style={{ background: "white", borderRadius: 16, border: "1px solid #ece8e4", padding: "24px" }}>
                  <h3 style={{ fontFamily: "serif", fontSize: 18, color: "#16161D", marginBottom: 18 }}>Namen</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    {([["Voornaam partner 1", "partner1_first"], ["Achternaam partner 1", "partner1_last"], ["Voornaam partner 2", "partner2_first"], ["Achternaam partner 2", "partner2_last"]] as [string, keyof Wedding][]).map(([label, field]) => (
                      <div key={field}>
                        <label style={labelStyle}>{label}</label>
                        <input value={String(wedding[field] || "")} onChange={e => update(field, e.target.value)} style={inputStyle} />
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ background: "white", borderRadius: 16, border: "1px solid #ece8e4", padding: "24px" }}>
                  <h3 style={{ fontFamily: "serif", fontSize: 18, color: "#16161D", marginBottom: 18 }}>Datum & Locatie</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                      <label style={labelStyle}>Datum</label>
                      <input type="date" value={String(wedding.wedding_date || "")} onChange={e => update("wedding_date", e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Tijdstip</label>
                      <input type="time" value={String(wedding.wedding_time || "")} onChange={e => update("wedding_time", e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Locatienaam</label>
                      <input value={String(wedding.venue || "")} onChange={e => update("venue", e.target.value)} placeholder="Landgoed..." style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Stad</label>
                      <input value={String(wedding.city || "")} onChange={e => update("city", e.target.value)} placeholder="Amsterdam" style={inputStyle} />
                    </div>
                  </div>
                  <div style={{ marginTop: 14 }}>
                    <label style={labelStyle}>Adres</label>
                    <input value={String(wedding.address || "")} onChange={e => update("address", e.target.value)} placeholder="Straatnaam 1" style={inputStyle} />
                  </div>
                </div>
              </>
            )}

            {activeTab === "opties" && (
              <div style={{ background: "white", borderRadius: 16, border: "1px solid #ece8e4", padding: "24px" }}>
                <h3 style={{ fontFamily: "serif", fontSize: 18, color: "#16161D", marginBottom: 18 }}>Secties tonen</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {([["show_countdown", "Countdown timer"], ["show_rsvp", "RSVP bevestiging"], ["show_photos", "Fotoalbum"], ["show_messages", "Gastenberichten"]] as [keyof Wedding, string][]).map(([field, label]) => (
                    <div key={field} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", border: "1px solid #ece8e4", borderRadius: 10 }}>
                      <span style={{ fontFamily: "sans-serif", fontSize: 14, color: "#16161D" }}>{label}</span>
                      <button onClick={() => update(field, !wedding[field])} style={{ width: 44, height: 24, borderRadius: 999, background: wedding[field] ? "#8B2635" : "#e0dbd7", border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
                        <div style={{ position: "absolute", top: 2, left: wedding[field] ? 22 : 2, width: 20, height: 20, borderRadius: "50%", background: "white", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "teksten" && (
              <div style={{ background: "white", borderRadius: 16, border: "1px solid #ece8e4", padding: "24px" }}>
                <h3 style={{ fontFamily: "serif", fontSize: 18, color: "#16161D", marginBottom: 18 }}>Teksten</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Persoonlijk bericht (zichtbaar op de uitnodiging)</label>
                    <textarea value={String(wedding.welcome_message || "")} onChange={e => update("welcome_message", e.target.value)} rows={4} placeholder="Schrijf een persoonlijk welkomstbericht voor jullie gasten..." style={{ ...inputStyle, resize: "vertical" }} />
                  </div>
                  <div>
                    <label style={labelStyle}>Intro tekst</label>
                    <textarea value={String(wedding.intro_text || "")} onChange={e => update("intro_text", e.target.value)} rows={3} placeholder="Korte introductie..." style={{ ...inputStyle, resize: "vertical" }} />
                  </div>
                </div>
              </div>
            )}

            <button onClick={() => save(wedding)} style={{ background: "#8B2635", color: "white", border: "none", borderRadius: 999, padding: "14px", fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Save size={16} /> Wijzigingen opslaan
            </button>
          </div>

          {/* Live Preview */}
          <div style={{ position: "sticky", top: 24 }}>
            <div style={{ background: "white", borderRadius: 16, border: "1px solid #ece8e4", padding: "16px", marginBottom: 12 }}>
              <p style={{ fontFamily: "sans-serif", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a8e88", marginBottom: 12 }}>Live preview</p>
              {/* Mini telefoon */}
              <div style={{ width: "100%", aspectRatio: "9/16", background: "#f5ede8", borderRadius: 12, overflow: "hidden", position: "relative" }}>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, gap: 8 }}>
                  <p style={{ fontFamily: "sans-serif", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "#8B2635" }}>Met liefde uitgenodigd</p>
                  <p style={{ fontFamily: "serif", fontSize: 18, color: "#16161D", textAlign: "center", lineHeight: 1.2 }}>{wedding.partner1_first || "Naam 1"} & {wedding.partner2_first || "Naam 2"}</p>
                  {wedding.wedding_date && <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "#6b6560", textAlign: "center" }}>{new Date(wedding.wedding_date).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}</p>}
                  {wedding.venue && <p style={{ fontFamily: "sans-serif", fontSize: 10, color: "#9a8e88", textAlign: "center" }}>{wedding.venue}</p>}
                  {wedding.city && <p style={{ fontFamily: "sans-serif", fontSize: 10, color: "#9a8e88", textAlign: "center" }}>{wedding.city}</p>}
                  {wedding.welcome_message && <p style={{ fontFamily: "serif", fontSize: 11, fontStyle: "italic", color: "#5a5550", textAlign: "center", lineHeight: 1.5, marginTop: 8 }}>"{wedding.welcome_message.slice(0, 80)}{wedding.welcome_message.length > 80 ? "..." : ""}"</p>}
                </div>
              </div>
            </div>
            <a href={`/invite/${wedding.slug}`} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "white", border: "1.5px solid #e0dbd7", borderRadius: 999, padding: "12px", fontFamily: "sans-serif", fontSize: 13, color: "#5a5550", textDecoration: "none" }}>
              <Eye size={14} /> Open volledige preview <ArrowRight size={12} />
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
