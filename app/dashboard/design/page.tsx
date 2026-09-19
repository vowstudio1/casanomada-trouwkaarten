"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/Layout";
import { templates as TEMPLATES } from "@/lib/templates";
import { Check, Save } from "lucide-react";

const FONTS = [
  { id: "cormorant", label: "Cormorant", style: "Cormorant Garamond, serif" },
  { id: "playfair", label: "Playfair", style: "Playfair Display, serif" },
  { id: "lora", label: "Lora", style: "Lora, serif" },
  { id: "garamond", label: "EB Garamond", style: "EB Garamond, serif" },
];

const COLOR_PALETTES = [
  { id: "bordeaux", label: "Bordeaux", primary: "#8B2635", accent: "#f5ede8" },
  { id: "navy", label: "Navy", primary: "#1a2e4a", accent: "#e8edf5" },
  { id: "sage", label: "Sage", primary: "#5a7a5a", accent: "#edf2ed" },
  { id: "champagne", label: "Champagne", primary: "#b5924d", accent: "#faf4ea" },
  { id: "dusty", label: "Dusty Rose", primary: "#b07070", accent: "#f9f0f0" },
  { id: "slate", label: "Slate", primary: "#4a5568", accent: "#edf2f7" },
  { id: "terracotta", label: "Terracotta", primary: "#c4713d", accent: "#faf0e9" },
  { id: "forest", label: "Forest", primary: "#2d5016", accent: "#f0f5ec" },
];

export default function DesignPage() {
  const router = useRouter();
  const [wedding, setWedding] = useState<{ id: string; template_slug: string; primary_color: string } | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedColor, setSelectedColor] = useState("#8B2635");
  const [selectedFont, setSelectedFont] = useState("cormorant");
  const [session, setSession] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      if (!s) { router.push("/login"); return; }
      setSession(s.access_token);
      const res = await fetch("/api/weddings", { headers: { Authorization: `Bearer ${s.access_token}` } });
      const ws = await res.json();
      if (ws[0]) {
        setWedding(ws[0]);
        setSelectedTemplate(ws[0].template_slug || "bloom");
        setSelectedColor(ws[0].primary_color || "#8B2635");
      }
    });
  }, [router]);

  const save = async () => {
    if (!session || !wedding) return;
    setSaving(true);
    await fetch("/api/weddings", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session}` },
      body: JSON.stringify({ ...wedding, template_slug: selectedTemplate, primary_color: selectedColor }),
    });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: "serif", fontSize: 28, color: "#16161D", marginBottom: 4 }}>Design</h1>
            <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#9a8e88" }}>Kies het uiterlijk van jullie uitnodiging</p>
          </div>
          <button onClick={save} disabled={saving} style={{ display: "flex", alignItems: "center", gap: 6, background: "#8B2635", color: "white", border: "none", borderRadius: 999, padding: "10px 20px", fontFamily: "sans-serif", fontSize: 13, cursor: "pointer" }}>
            {saved ? <><Check size={14} /> Opgeslagen</> : <><Save size={14} /> {saving ? "Opslaan..." : "Opslaan"}</>}
          </button>
        </div>

        {/* Sjablonen */}
        <div style={{ background: "white", borderRadius: 16, border: "1px solid #ece8e4", padding: 24, marginBottom: 20 }}>
          <h2 style={{ fontFamily: "serif", fontSize: 20, color: "#16161D", marginBottom: 16 }}>Sjabloon</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
            {TEMPLATES.slice(0, 12).map(t => (
              <button key={t.slug} onClick={() => setSelectedTemplate(t.slug)} style={{ border: `2px solid ${selectedTemplate === t.slug ? "#8B2635" : "#ece8e4"}`, borderRadius: 12, overflow: "hidden", background: "transparent", cursor: "pointer", padding: 0, position: "relative" }}>
                {selectedTemplate === t.slug && (
                  <div style={{ position: "absolute", top: 8, right: 8, width: 22, height: 22, borderRadius: "50%", background: "#8B2635", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Check size={12} color="white" />
                  </div>
                )}
                <div style={{ aspectRatio: "3/4", background: t.colors?.background || "#f5ede8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "serif", fontSize: 12, color: t.colors?.text || "#16161D" }}>{t.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Kleuren */}
        <div style={{ background: "white", borderRadius: 16, border: "1px solid #ece8e4", padding: 24, marginBottom: 20 }}>
          <h2 style={{ fontFamily: "serif", fontSize: 20, color: "#16161D", marginBottom: 16 }}>Kleurenpalet</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 12 }}>
            {COLOR_PALETTES.map(p => (
              <button key={p.id} onClick={() => setSelectedColor(p.primary)} style={{ border: `2px solid ${selectedColor === p.primary ? "#8B2635" : "#ece8e4"}`, borderRadius: 12, padding: "12px 8px", background: p.accent, cursor: "pointer", textAlign: "center" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: p.primary, margin: "0 auto 8px" }} />
                <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "#5a5550" }}>{p.label}</p>
                {selectedColor === p.primary && <Check size={12} style={{ color: "#8B2635", marginTop: 4 }} />}
              </button>
            ))}
          </div>
        </div>

        {/* Fonts */}
        <div style={{ background: "white", borderRadius: 16, border: "1px solid #ece8e4", padding: 24 }}>
          <h2 style={{ fontFamily: "serif", fontSize: 20, color: "#16161D", marginBottom: 16 }}>Lettertype</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
            {FONTS.map(f => (
              <button key={f.id} onClick={() => setSelectedFont(f.id)} style={{ border: `2px solid ${selectedFont === f.id ? "#8B2635" : "#ece8e4"}`, borderRadius: 12, padding: "16px", background: "white", cursor: "pointer", textAlign: "center" }}>
                <p style={{ fontFamily: f.style, fontSize: 20, color: "#16161D", marginBottom: 4 }}>Aa</p>
                <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88" }}>{f.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
