"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/Layout";
import { Plus, Trash2, GripVertical, Clock, MapPin, Save } from "lucide-react";

type Event = { id?: string; name: string; event_date: string; start_time: string; end_time: string; venue: string; city: string; description: string; is_main: boolean; sort_order: number; };

export default function ProgrammaPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [weddingId, setWeddingId] = useState<string | null>(null);
  const [session, setSession] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      if (!s) { router.push("/login"); return; }
      setSession(s.access_token);
      const res = await fetch("/api/weddings", { headers: { Authorization: `Bearer ${s.access_token}` } });
      const ws = await res.json();
      if (ws[0]) {
        setWeddingId(ws[0].id);
        const { data: evs } = await supabase.from("events").select("*").eq("wedding_id", ws[0].id).order("sort_order");
        setEvents(evs || []);
      }
    });
  }, [router]);

  const addEvent = () => {
    setEvents(prev => [...prev, { name: "", event_date: "", start_time: "", end_time: "", venue: "", city: "", description: "", is_main: false, sort_order: prev.length }]);
  };

  const updateEvent = (i: number, field: keyof Event, value: string | boolean) => {
    setEvents(prev => prev.map((e, idx) => idx === i ? { ...e, [field]: value } : e));
  };

  const removeEvent = (i: number) => setEvents(prev => prev.filter((_, idx) => idx !== i));

  const save = async () => {
    if (!weddingId || !session) return;
    setSaving(true);
    // Verwijder alle events en voeg opnieuw in
    await supabase.from("events").delete().eq("wedding_id", weddingId);
    for (const ev of events) {
      if (ev.name) {
        await supabase.from("events").insert({ ...ev, wedding_id: weddingId });
      }
    }
    setSaving(false);
  };

  const inputStyle: React.CSSProperties = { border: "1.5px solid #e0dbd7", borderRadius: 8, padding: "9px 12px", fontFamily: "sans-serif", fontSize: 13, color: "#16161D", outline: "none", background: "white", width: "100%", boxSizing: "border-box" };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "28px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: "serif", fontSize: 28, color: "#16161D", marginBottom: 4 }}>Programma</h1>
            <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#9a8e88" }}>Voeg de onderdelen van jullie trouwdag toe</p>
          </div>
          <button onClick={save} disabled={saving} style={{ display: "flex", alignItems: "center", gap: 6, background: "#8B2635", color: "white", border: "none", borderRadius: 999, padding: "10px 20px", fontFamily: "sans-serif", fontSize: 13, cursor: "pointer" }}>
            <Save size={14} /> {saving ? "Opslaan..." : "Opslaan"}
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {events.map((ev, i) => (
            <div key={i} style={{ background: "white", borderRadius: 16, border: `1.5px solid ${ev.is_main ? "#8B2635" : "#ece8e4"}`, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                  <GripVertical size={16} style={{ color: "#c0b8b4", cursor: "grab" }} />
                  <input value={ev.name} onChange={e => updateEvent(i, "name", e.target.value)} placeholder="Naam (bijv. Ceremonie, Diner, Feest)" style={{ ...inputStyle, fontWeight: 600, fontSize: 15 }} />
                </div>
                <div style={{ display: "flex", gap: 8, marginLeft: 10 }}>
                  <button onClick={() => updateEvent(i, "is_main", !ev.is_main)} style={{ fontSize: 11, fontFamily: "sans-serif", padding: "4px 10px", borderRadius: 999, border: `1px solid ${ev.is_main ? "#8B2635" : "#e0dbd7"}`, background: ev.is_main ? "#fdf6f4" : "white", color: ev.is_main ? "#8B2635" : "#9a8e88", cursor: "pointer" }}>
                    {ev.is_main ? "★ Hoofdmoment" : "Markeer als hoofdmoment"}
                  </button>
                  <button onClick={() => removeEvent(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#c0b8b4" }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 10 }}>
                <div>
                  <label style={{ fontFamily: "sans-serif", fontSize: 10, color: "#9a8e88", display: "block", marginBottom: 4 }}>Datum</label>
                  <input type="date" value={ev.event_date} onChange={e => updateEvent(i, "event_date", e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontFamily: "sans-serif", fontSize: 10, color: "#9a8e88", display: "block", marginBottom: 4 }}><Clock size={10} style={{ display: "inline", marginRight: 3 }} />Begintijd</label>
                  <input type="time" value={ev.start_time} onChange={e => updateEvent(i, "start_time", e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontFamily: "sans-serif", fontSize: 10, color: "#9a8e88", display: "block", marginBottom: 4 }}><Clock size={10} style={{ display: "inline", marginRight: 3 }} />Eindtijd</label>
                  <input type="time" value={ev.end_time} onChange={e => updateEvent(i, "end_time", e.target.value)} style={inputStyle} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10, marginBottom: 10 }}>
                <div>
                  <label style={{ fontFamily: "sans-serif", fontSize: 10, color: "#9a8e88", display: "block", marginBottom: 4 }}><MapPin size={10} style={{ display: "inline", marginRight: 3 }} />Locatie</label>
                  <input value={ev.venue} onChange={e => updateEvent(i, "venue", e.target.value)} placeholder="Naam locatie" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontFamily: "sans-serif", fontSize: 10, color: "#9a8e88", display: "block", marginBottom: 4 }}>Stad</label>
                  <input value={ev.city} onChange={e => updateEvent(i, "city", e.target.value)} placeholder="Stad" style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={{ fontFamily: "sans-serif", fontSize: 10, color: "#9a8e88", display: "block", marginBottom: 4 }}>Beschrijving (optioneel)</label>
                <textarea value={ev.description} onChange={e => updateEvent(i, "description", e.target.value)} rows={2} placeholder="Extra informatie voor jullie gasten..." style={{ ...inputStyle, resize: "vertical" }} />
              </div>
            </div>
          ))}
        </div>

        <button onClick={addEvent} style={{ display: "flex", alignItems: "center", gap: 8, background: "white", border: "1.5px dashed #c0b8b4", borderRadius: 14, padding: "14px 20px", fontFamily: "sans-serif", fontSize: 14, color: "#9a8e88", cursor: "pointer", marginTop: 14, width: "100%", justifyContent: "center" }}>
          <Plus size={16} /> Onderdeel toevoegen
        </button>
      </div>
    </DashboardLayout>
  );
}
