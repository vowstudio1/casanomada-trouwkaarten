"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/Layout";
import { Plus, Trash2, Download, Copy, Check, Users, Search, Link } from "lucide-react";

type Guest = { id: string; first_name: string; last_name: string; email: string; phone: string; group_name: string; token: string; status: string; };

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://casanomada-trouwkaarten.netlify.app";

export default function GuestsPage() {
  const router = useRouter();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [weddingId, setWeddingId] = useState<string | null>(null);
  const [weddingSlug, setWeddingSlug] = useState("");
  const [session, setSession] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newGuest, setNewGuest] = useState({ first_name: "", last_name: "", email: "", phone: "", group_name: "" });

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      if (!s) { router.push("/login"); return; }
      setSession(s.access_token);
      const res = await fetch("/api/weddings", { headers: { Authorization: `Bearer ${s.access_token}` } });
      const ws = await res.json();
      if (ws[0]) {
        setWeddingId(ws[0].id);
        setWeddingSlug(ws[0].slug);
        const { data } = await supabase.from("guests").select("*").eq("wedding_id", ws[0].id).order("last_name");
        setGuests(data || []);
      }
      setLoading(false);
    });
  }, [router]);

  const addGuest = async () => {
    if (!weddingId || !session || !newGuest.first_name) return;
    const res = await fetch("/api/guests", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session}` },
      body: JSON.stringify({ ...newGuest, wedding_id: weddingId }),
    });
    const guest = await res.json();
    setGuests(prev => [...prev, guest]);
    setNewGuest({ first_name: "", last_name: "", email: "", phone: "", group_name: "" });
    setShowAdd(false);
  };

  const deleteGuest = async (id: string) => {
    if (!confirm("Gast verwijderen?")) return;
    await supabase.from("guests").delete().eq("id", id);
    setGuests(prev => prev.filter(g => g.id !== id));
  };

  const copyLink = (token: string, id: string) => {
    navigator.clipboard.writeText(`${APP_URL}/invite/${weddingSlug}?t=${token}`);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const exportCSV = () => {
    const rows = [["Voornaam", "Achternaam", "Email", "Telefoon", "Groep", "Status"], ...guests.map(g => [g.first_name, g.last_name, g.email, g.phone, g.group_name, g.status])];
    const csv = rows.map(r => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = "gasten.csv";
    a.click();
  };

  const filtered = guests.filter(g => `${g.first_name} ${g.last_name} ${g.email} ${g.group_name}`.toLowerCase().includes(search.toLowerCase()));
  const inputStyle: React.CSSProperties = { border: "1.5px solid #e0dbd7", borderRadius: 8, padding: "9px 12px", fontFamily: "sans-serif", fontSize: 13, color: "#16161D", outline: "none", background: "white", width: "100%", boxSizing: "border-box" };

  if (loading) return <DashboardLayout><div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "50vh" }}><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style><div style={{ width: 32, height: 32, border: "2px solid #8B2635", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: "serif", fontSize: 28, color: "#16161D", marginBottom: 4 }}>Gasten</h1>
            <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#9a8e88" }}>{guests.length} gasten uitgenodigd</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={exportCSV} style={{ display: "flex", alignItems: "center", gap: 6, background: "white", border: "1.5px solid #e0dbd7", borderRadius: 999, padding: "10px 18px", fontFamily: "sans-serif", fontSize: 13, color: "#5a5550", cursor: "pointer" }}>
              <Download size={14} /> Exporteer
            </button>
            <button onClick={() => setShowAdd(true)} style={{ display: "flex", alignItems: "center", gap: 6, background: "#8B2635", color: "white", border: "none", borderRadius: 999, padding: "10px 18px", fontFamily: "sans-serif", fontSize: 13, cursor: "pointer" }}>
              <Plus size={14} /> Gast toevoegen
            </button>
          </div>
        </div>

        {/* Toevoegen form */}
        {showAdd && (
          <div style={{ background: "white", borderRadius: 16, border: "1px solid #ece8e4", padding: 20, marginBottom: 16 }}>
            <h3 style={{ fontFamily: "serif", fontSize: 18, color: "#16161D", marginBottom: 14 }}>Gast toevoegen</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 12 }}>
              <input value={newGuest.first_name} onChange={e => setNewGuest(g => ({ ...g, first_name: e.target.value }))} placeholder="Voornaam *" style={inputStyle} />
              <input value={newGuest.last_name} onChange={e => setNewGuest(g => ({ ...g, last_name: e.target.value }))} placeholder="Achternaam" style={inputStyle} />
              <input value={newGuest.email} onChange={e => setNewGuest(g => ({ ...g, email: e.target.value }))} placeholder="E-mail" type="email" style={inputStyle} />
              <input value={newGuest.phone} onChange={e => setNewGuest(g => ({ ...g, phone: e.target.value }))} placeholder="Telefoon" style={inputStyle} />
              <input value={newGuest.group_name} onChange={e => setNewGuest(g => ({ ...g, group_name: e.target.value }))} placeholder="Groep (bijv. Familie, Vrienden)" style={inputStyle} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={addGuest} style={{ background: "#8B2635", color: "white", border: "none", borderRadius: 8, padding: "9px 18px", fontFamily: "sans-serif", fontSize: 13, cursor: "pointer" }}>Toevoegen</button>
              <button onClick={() => setShowAdd(false)} style={{ background: "white", color: "#5a5550", border: "1px solid #e0dbd7", borderRadius: 8, padding: "9px 18px", fontFamily: "sans-serif", fontSize: 13, cursor: "pointer" }}>Annuleren</button>
            </div>
          </div>
        )}

        {/* Zoekbalk */}
        <div style={{ position: "relative", marginBottom: 16 }}>
          <Search size={14} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9a8e88" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Zoek op naam, e-mail of groep..." style={{ ...inputStyle, paddingLeft: 38, borderRadius: 10 }} />
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: 16, border: "1px solid #ece8e4" }}>
            <Users size={40} style={{ color: "#c0b8b4", margin: "0 auto 16px" }} />
            <p style={{ fontFamily: "serif", fontSize: 20, color: "#9a8e88" }}>Nog geen gasten</p>
            <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#c0b8b4" }}>Voeg gasten toe om gepersonaliseerde uitnodigingslinks te maken</p>
          </div>
        ) : (
          <div style={{ background: "white", borderRadius: 16, border: "1px solid #ece8e4", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f9f5f1", borderBottom: "1px solid #ece8e4" }}>
                  {["Naam", "E-mail / Telefoon", "Groep", "Status", "Persoonlijke link", ""].map(h => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontFamily: "sans-serif", fontSize: 11, color: "#9a8e88", fontWeight: 600, letterSpacing: "0.05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((guest, i) => (
                  <tr key={guest.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #f5f0ec" : "none" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <p style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 600, color: "#16161D" }}>{guest.first_name} {guest.last_name}</p>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#5a5550" }}>{guest.email}</p>
                      <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88" }}>{guest.phone}</p>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {guest.group_name && <span style={{ fontFamily: "sans-serif", fontSize: 11, background: "#f5f0ec", color: "#5a5550", borderRadius: 999, padding: "3px 8px" }}>{guest.group_name}</span>}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontFamily: "sans-serif", fontSize: 11, borderRadius: 999, padding: "3px 8px", background: guest.status === "confirmed" ? "#f0faf0" : guest.status === "declined" ? "#fff0f0" : "#f9f5f1", color: guest.status === "confirmed" ? "#28a745" : guest.status === "declined" ? "#8B2635" : "#9a8e88" }}>
                        {guest.status === "confirmed" ? "Bevestigd" : guest.status === "declined" ? "Afgemeld" : "Niet geopend"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {guest.token && (
                        <button onClick={() => copyLink(guest.token, guest.id)} style={{ display: "flex", alignItems: "center", gap: 4, background: "white", border: "1px solid #e0dbd7", borderRadius: 8, padding: "5px 10px", fontFamily: "sans-serif", fontSize: 11, color: "#5a5550", cursor: "pointer" }}>
                          {copied === guest.id ? <><Check size={11} style={{ color: "#28a745" }} /> Gekopieerd</> : <><Copy size={11} /> Kopieer link</>}
                        </button>
                      )}
                    </td>
                    <td style={{ padding: "12px 8px", textAlign: "right" }}>
                      <button onClick={() => deleteGuest(guest.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#c0b8b4", padding: "4px" }}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
