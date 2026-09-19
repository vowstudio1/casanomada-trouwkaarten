"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/Layout";
import { Wand2, Users, Grid3X3, Plus, Trash2, Download } from "lucide-react";

type Table = { id: string; name: string; seats: number; guests: string[]; };

export default function TablesPage() {
  const router = useRouter();
  const [tables, setTables] = useState<Table[]>([]);
  const [guests, setGuests] = useState<{ id: string; first_name: string; last_name: string; group_name: string; }[]>([]);
  const [weddingId, setWeddingId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [tableCount, setTableCount] = useState(8);
  const [seatsPerTable, setSeatsPerTable] = useState(8);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push("/login"); return; }
      const res = await fetch("/api/weddings", { headers: { Authorization: `Bearer ${session.access_token}` } });
      const ws = await res.json();
      if (ws[0]) {
        setWeddingId(ws[0].id);
        const { data: gs } = await supabase.from("guests").select("id, first_name, last_name, group_name").eq("wedding_id", ws[0].id);
        setGuests(gs || []);
      }
    });
  }, [router]);

  const generateTables = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1500)); // AI simulatie

    const guestsByGroup: Record<string, typeof guests> = {};
    guests.forEach(g => {
      const group = g.group_name || "Overige gasten";
      if (!guestsByGroup[group]) guestsByGroup[group] = [];
      guestsByGroup[group].push(g);
    });

    const newTables: Table[] = [];
    let tableNum = 1;
    let currentTable: Table = { id: `table-${tableNum}`, name: `Tafel ${tableNum}`, seats: seatsPerTable, guests: [] };

    Object.entries(guestsByGroup).forEach(([group, groupGuests]) => {
      groupGuests.forEach(guest => {
        if (currentTable.guests.length >= seatsPerTable) {
          newTables.push(currentTable);
          tableNum++;
          currentTable = { id: `table-${tableNum}`, name: `Tafel ${tableNum}`, seats: seatsPerTable, guests: [] };
        }
        currentTable.guests.push(`${guest.first_name} ${guest.last_name}`);
      });
    });
    if (currentTable.guests.length > 0) newTables.push(currentTable);
    setTables(newTables);
    setGenerating(false);
  };

  const addTable = () => {
    const num = tables.length + 1;
    setTables(prev => [...prev, { id: `table-${Date.now()}`, name: `Tafel ${num}`, seats: seatsPerTable, guests: [] }]);
  };

  const removeTable = (id: string) => setTables(prev => prev.filter(t => t.id !== id));

  const totalSeated = tables.reduce((sum, t) => sum + t.guests.length, 0);

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "28px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: "serif", fontSize: 28, color: "#16161D", marginBottom: 4 }}>Tafelindeling</h1>
            <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#9a8e88" }}>{guests.length} gasten, {totalSeated} ingedeeld</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {tables.length > 0 && (
              <button style={{ display: "flex", alignItems: "center", gap: 6, background: "white", border: "1.5px solid #e0dbd7", borderRadius: 999, padding: "10px 18px", fontFamily: "sans-serif", fontSize: 13, color: "#5a5550", cursor: "pointer" }}>
                <Download size={14} /> Exporteren
              </button>
            )}
            <button onClick={addTable} style={{ display: "flex", alignItems: "center", gap: 6, background: "white", border: "1.5px solid #e0dbd7", borderRadius: 999, padding: "10px 18px", fontFamily: "sans-serif", fontSize: 13, color: "#5a5550", cursor: "pointer" }}>
              <Plus size={14} /> Tafel toevoegen
            </button>
          </div>
        </div>

        {/* AI generator */}
        <div style={{ background: "linear-gradient(135deg, #8B2635 0%, #b04a5a 100%)", borderRadius: 16, padding: 24, marginBottom: 24, color: "white" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Wand2 size={20} />
            <h2 style={{ fontFamily: "serif", fontSize: 20 }}>AI Tafelindeling</h2>
          </div>
          <p style={{ fontFamily: "sans-serif", fontSize: 13, opacity: 0.85, marginBottom: 16, lineHeight: 1.6 }}>
            Laat AI automatisch een tafelindeling maken op basis van groepen. Gasten uit dezelfde groep worden bij elkaar geplaatst.
          </p>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <label style={{ fontFamily: "sans-serif", fontSize: 11, opacity: 0.8, display: "block", marginBottom: 4 }}>Aantal tafels</label>
              <input type="number" value={tableCount} onChange={e => setTableCount(Number(e.target.value))} min={1} max={50} style={{ width: 70, border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 8, padding: "8px 10px", fontFamily: "sans-serif", fontSize: 13, background: "rgba(255,255,255,0.15)", color: "white", outline: "none" }} />
            </div>
            <div>
              <label style={{ fontFamily: "sans-serif", fontSize: 11, opacity: 0.8, display: "block", marginBottom: 4 }}>Plaatsen per tafel</label>
              <input type="number" value={seatsPerTable} onChange={e => setSeatsPerTable(Number(e.target.value))} min={2} max={20} style={{ width: 70, border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 8, padding: "8px 10px", fontFamily: "sans-serif", fontSize: 13, background: "rgba(255,255,255,0.15)", color: "white", outline: "none" }} />
            </div>
            <div style={{ alignSelf: "flex-end" }}>
              <button onClick={generateTables} disabled={generating || guests.length === 0} style={{ display: "flex", alignItems: "center", gap: 8, background: "white", color: "#8B2635", border: "none", borderRadius: 999, padding: "11px 22px", fontFamily: "sans-serif", fontSize: 13, fontWeight: 600, cursor: generating ? "wait" : "pointer" }}>
                <Wand2 size={14} /> {generating ? "Bezig..." : "Genereer indeling"}
              </button>
            </div>
          </div>
          {guests.length === 0 && <p style={{ fontFamily: "sans-serif", fontSize: 12, opacity: 0.7, marginTop: 10 }}>Voeg eerst gasten toe via de Gasten pagina</p>}
        </div>

        {tables.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: 16, border: "1px solid #ece8e4" }}>
            <Grid3X3 size={40} style={{ color: "#c0b8b4", margin: "0 auto 16px" }} />
            <p style={{ fontFamily: "serif", fontSize: 20, color: "#9a8e88", marginBottom: 8 }}>Nog geen tafels</p>
            <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#c0b8b4" }}>Gebruik AI om automatisch een indeling te maken, of voeg handmatig tafels toe</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
            {tables.map(table => (
              <div key={table.id} style={{ background: "white", borderRadius: 14, border: "1px solid #ece8e4", padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#fdf6f4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Grid3X3 size={14} style={{ color: "#8B2635" }} />
                    </div>
                    <div>
                      <p style={{ fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, color: "#16161D" }}>{table.name}</p>
                      <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "#9a8e88" }}>{table.guests.length}/{table.seats} plaatsen</p>
                    </div>
                  </div>
                  <button onClick={() => removeTable(table.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#c0b8b4" }}>
                    <Trash2 size={15} />
                  </button>
                </div>
                {table.guests.length > 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {table.guests.map((g, i) => (
                      <span key={i} style={{ fontFamily: "sans-serif", fontSize: 11, background: "#f5f0ec", color: "#5a5550", borderRadius: 999, padding: "3px 8px" }}>{g}</span>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#c0b8b4", fontStyle: "italic" }}>Geen gasten aan deze tafel</p>
                )}
                {/* Bezettingsbalk */}
                <div style={{ marginTop: 12, height: 4, background: "#f5f0ec", borderRadius: 999 }}>
                  <div style={{ height: "100%", borderRadius: 999, background: table.guests.length >= table.seats ? "#dc3545" : "#8B2635", width: `${Math.min((table.guests.length / table.seats) * 100, 100)}%`, transition: "width 0.3s" }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
