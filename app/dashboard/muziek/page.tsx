"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/Layout";
import { Music, Play, Check, Save } from "lucide-react";

const MUSIC_MOMENTS = [
  { id: "entrance", label: "Binnenkomst bruidspaar", description: "Het openingsmoment" },
  { id: "ceremony", label: "Tijdens ceremonie", description: "Muziek op de achtergrond" },
  { id: "signing", label: "Ondertekening", description: "Terwijl de akte wordt getekend" },
  { id: "exit", label: "Verlaten zaal", description: "Het eerste moment als getrouwd stel" },
  { id: "dinner", label: "Tijdens diner", description: "Sfeervolle achtergrondmuziek" },
  { id: "first_dance", label: "Eerste dans", description: "Het dansnummer" },
];

const MUSIC_SUGGESTIONS = [
  { title: "Can't Help Falling in Love", artist: "Elvis Presley", moment: "entrance" },
  { title: "A Thousand Years", artist: "Christina Perri", moment: "ceremony" },
  { title: "Perfect", artist: "Ed Sheeran", moment: "first_dance" },
  { title: "Thinking Out Loud", artist: "Ed Sheeran", moment: "first_dance" },
  { title: "At Last", artist: "Etta James", moment: "first_dance" },
  { title: "La Vie en Rose", artist: "Édith Piaf", moment: "dinner" },
  { title: "Make You Feel My Love", artist: "Adele", moment: "signing" },
  { title: "You Are the Best Thing", artist: "Ray LaMontagne", moment: "exit" },
];

export default function MuziekPage() {
  const router = useRouter();
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({});
  const [session, setSession] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      if (!s) { router.push("/login"); return; }
      setSession(s.access_token);
    });
  }, [router]);

  const selectSong = (momentId: string, song: string) => {
    setSelections(prev => ({ ...prev, [momentId]: song }));
  };

  const saveMusic = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "28px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: "serif", fontSize: 28, color: "#16161D", marginBottom: 4 }}>Muziek</h1>
            <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#9a8e88" }}>Kies de nummers voor de belangrijkste momenten</p>
          </div>
          <button onClick={saveMusic} style={{ display: "flex", alignItems: "center", gap: 6, background: "#8B2635", color: "white", border: "none", borderRadius: 999, padding: "10px 20px", fontFamily: "sans-serif", fontSize: 13, cursor: "pointer" }}>
            {saved ? <><Check size={14} /> Opgeslagen</> : <><Save size={14} /> Opslaan</>}
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {MUSIC_MOMENTS.map(moment => (
            <div key={moment.id} style={{ background: "white", borderRadius: 16, border: "1px solid #ece8e4", padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#fdf6f4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Music size={16} style={{ color: "#8B2635" }} />
                </div>
                <div>
                  <p style={{ fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, color: "#16161D" }}>{moment.label}</p>
                  <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88" }}>{moment.description}</p>
                </div>
              </div>

              {/* Suggesties voor dit moment */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                {MUSIC_SUGGESTIONS.filter(s => s.moment === moment.id).map(song => (
                  <button key={song.title} onClick={() => selectSong(moment.id, `${song.title} - ${song.artist}`)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 999, border: `1px solid ${selections[moment.id] === `${song.title} - ${song.artist}` ? "#8B2635" : "#e0dbd7"}`, background: selections[moment.id] === `${song.title} - ${song.artist}` ? "#fdf6f4" : "white", cursor: "pointer" }}>
                    {selections[moment.id] === `${song.title} - ${song.artist}` ? <Check size={11} style={{ color: "#8B2635" }} /> : <Play size={11} style={{ color: "#9a8e88" }} />}
                    <span style={{ fontFamily: "sans-serif", fontSize: 12, color: "#16161D" }}>{song.title}</span>
                    <span style={{ fontFamily: "sans-serif", fontSize: 11, color: "#9a8e88" }}>{song.artist}</span>
                  </button>
                ))}
              </div>

              <div>
                <label style={{ fontFamily: "sans-serif", fontSize: 11, color: "#9a8e88", display: "block", marginBottom: 5 }}>Of typ zelf een nummer</label>
                <input value={customInputs[moment.id] || selections[moment.id] || ""} onChange={e => { setCustomInputs(prev => ({ ...prev, [moment.id]: e.target.value })); setSelections(prev => ({ ...prev, [moment.id]: e.target.value })); }} placeholder="Naam nummer - Artiest" style={{ border: "1.5px solid #e0dbd7", borderRadius: 8, padding: "9px 12px", fontFamily: "sans-serif", fontSize: 13, color: "#16161D", outline: "none", background: "white", width: "100%", boxSizing: "border-box" }} />
              </div>

              {selections[moment.id] && (
                <div style={{ marginTop: 10, padding: "8px 12px", background: "#fdf6f4", borderRadius: 8, display: "flex", alignItems: "center", gap: 8 }}>
                  <Music size={13} style={{ color: "#8B2635" }} />
                  <span style={{ fontFamily: "sans-serif", fontSize: 12, color: "#8B2635" }}>Geselecteerd: {selections[moment.id]}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
