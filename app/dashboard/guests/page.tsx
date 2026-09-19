"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Plus, Copy, Check, ArrowLeft, Search, Download, Upload, Trash2 } from "lucide-react";
import { GUEST_GROUPS, APP_URL } from "@/lib/config";

type Guest = { id: string; first_name: string; last_name: string; email: string; phone: string; group_name: string; token: string; status: string; opened_at: string | null; rsvp?: { attending: boolean }[] };
type Wedding = { id: string; partner1_first: string; partner2_first: string };

export default function GuestsPage() {
  const router = useRouter();
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [copied, setCopied] = useState<string | null>(null);
  const [session, setSession] = useState<string | null>(null);
  // Nieuw gast
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [group, setGroup] = useState("Gasten");
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const loadGuests = useCallback(async (wId: string, token: string) => {
    const res = await fetch(`/api/guests?invitation_id=${wId}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setGuests(Array.isArray(data) ? data : []);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      if (!s) { router.push("/login"); return; }
      setSession(s.access_token);
      const res = await fetch("/api/weddings", { headers: { Authorization: `Bearer ${s.access_token}` } });
      const ws = await res.json();
      if (ws[0]) { setWedding(ws[0]); await loadGuests(ws[0].id, s.access_token); }
      setLoading(false);
    });
  }, [router, loadGuests]);

  const addGuest = async () => {
    if (!firstName || !wedding || !session) return;
    setAdding(true);
    await fetch("/api/guests", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session}` },
      body: JSON.stringify({ invitation_id: wedding.id, guests: [{ name: `${firstName} ${lastName}`.trim(), email, phone, group_name: group, language: "nl" }] }),
    });
    setFirstName(""); setLastName(""); setEmail(""); setPhone(""); setGroup("Gasten"); setAdding(false); setShowForm(false);
    await loadGuests(wedding.id, session);
  };

  const deleteGuest = async (id: string) => {
    if (!confirm("Gast verwijderen?")) return;
    await supabase.from("guests").delete().eq("id", id);
    setGuests(g => g.filter(x => x.id !== id));
  };

  const copyLink = (token: string) => {
    const url = `${APP_URL}/invite/${wedding?.partner1_first?.toLowerCase()}-${wedding?.partner2_first?.toLowerCase()}?t=${token}`;
    navigator.clipboard.writeText(url);
    setCopied(token); setTimeout(() => setCopied(null), 2000);
  };

  const exportCSV = () => {
    const rows = [["Voornaam", "Achternaam", "E-mail", "Groep", "Status", "RSVP"], ...guests.map(g => [g.first_name, g.last_name || "", g.email || "", g.group_name, g.status, g.rsvp?.[0] ? (g.rsvp[0].attending ? "Aanwezig" : "Afwezig") : "—"])];
    const csv = rows.map(r => r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "gasten.csv"; a.click();
  };

  const filtered = guests.filter(g => {
    const q = search.toLowerCase();
    const match = g.first_name.toLowerCase().includes(q) || (g.last_name || "").toLowerCase().includes(q) || (g.email || "").toLowerCase().includes(q);
    if (filter === "all") return match;
    return match && g.status === filter;
  });

  const aanwezig = guests.filter(g => g.rsvp?.[0]?.attending).length;
  const afwezig = guests.filter(g => g.rsvp?.[0] && !g.rsvp[0].attending).length;

  if (loading) return <div style={{ minHeight: "100vh", background: "#f9f5f1", display: "flex", alignItems: "center", justifyContent: "center" }}><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style><div style={{ width: 36, height: 36, border: "2px solid #8B2635", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /></div>;

  return (
    <div style={{ minHeight: "100vh", background: "#f9f5f1" }}>
      <header style={{ background: "white", borderBottom: "1px solid #ece8e4", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "sans-serif", fontSize: 13, color: "#6b6560", textDecoration: "none" }}><ArrowLeft size={14} /> Dashboard</Link>
          <div style={{ width: 1, height: 20, background: "#e0dbd7" }} />
          <span style={{ fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, color: "#16161D" }}>Gasten</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button onClick={exportCSV} style={{ display: "flex", alignItems: "center", gap: 6, background: "white", border: "1px solid #e0dbd7", borderRadius: 8, padding: "8px 14px", fontFamily: "sans-serif", fontSize: 12, cursor: "pointer", color: "#5a5550" }}><Download size={13} /> Export CSV</button>
            <button onClick={() => setShowForm(!showForm)} style={{ display: "flex", alignItems: "center", gap: 6, background: "#8B2635", color: "white", border: "none", borderRadius: 8, padding: "8px 14px", fontFamily: "sans-serif", fontSize: 12, cursor: "pointer" }}><Plus size={13} /> Gast toevoegen</button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
          {[{ l: "Totaal", v: guests.length, c: "#8B2635" }, { l: "Aanwezig", v: aanwezig, c: "#16a34a" }, { l: "Afwezig", v: afwezig, c: "#dc2626" }, { l: "Wacht", v: guests.length - aanwezig - afwezig, c: "#e0a000" }].map(({ l, v, c }) => (
            <div key={l} style={{ background: "white", borderRadius: 12, border: "1px solid #ece8e4", padding: "16px", textAlign: "center" }}>
              <p style={{ fontFamily: "serif", fontSize: 28, color: c, fontWeight: 600, lineHeight: 1 }}>{v}</p>
              <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", marginTop: 4 }}>{l}</p>
            </div>
          ))}
        </div>

        {/* Gast toevoegen form */}
        {showForm && (
          <div style={{ background: "white", borderRadius: 16, border: "1px solid #ece8e4", padding: "20px", marginBottom: 16 }}>
            <h3 style={{ fontFamily: "serif", fontSize: 18, color: "#16161D", marginBottom: 16 }}>Gast toevoegen</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
              {[["Voornaam *", firstName, setFirstName, "Sophie"], ["Achternaam", lastName, setLastName, "De Vries"], ["E-mail", email, setEmail, "sophie@email.com"], ["Telefoon", phone, setPhone, "+31 6 12345678"]].map(([l, v, s, p]) => (
                <div key={l as string}>
                  <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 11, color: "#9a8e88", marginBottom: 4 }}>{l as string}</label>
                  <input value={v as string} onChange={e => (s as (v: string) => void)(e.target.value)} placeholder={p as string} style={{ width: "100%", border: "1.5px solid #e0dbd7", borderRadius: 8, padding: "9px 12px", fontFamily: "sans-serif", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <select value={group} onChange={e => setGroup(e.target.value)} style={{ border: "1.5px solid #e0dbd7", borderRadius: 8, padding: "9px 12px", fontFamily: "sans-serif", fontSize: 13, outline: "none", background: "white" }}>
                {GUEST_GROUPS.map(g => <option key={g}>{g}</option>)}
              </select>
              <button onClick={addGuest} disabled={!firstName || adding} style={{ background: "#8B2635", color: "white", border: "none", borderRadius: 8, padding: "9px 18px", fontFamily: "sans-serif", fontSize: 13, cursor: "pointer", opacity: !firstName || adding ? 0.6 : 1 }}>
                {adding ? "Toevoegen..." : "Voeg toe"}
              </button>
              <button onClick={() => setShowForm(false)} style={{ background: "white", border: "1px solid #e0dbd7", borderRadius: 8, padding: "9px 14px", fontFamily: "sans-serif", fontSize: 13, cursor: "pointer", color: "#6b6560" }}>Annuleren</button>
            </div>
          </div>
        )}

        {/* Zoeken & filteren */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9a8e88" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Zoek op naam of e-mail..." style={{ width: "100%", border: "1.5px solid #e0dbd7", borderRadius: 10, padding: "10px 12px 10px 34px", fontFamily: "sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box", background: "white" }} />
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)} style={{ border: "1.5px solid #e0dbd7", borderRadius: 10, padding: "10px 14px", fontFamily: "sans-serif", fontSize: 13, outline: "none", background: "white" }}>
            <option value="all">Alle gasten</option>
            <option value="invited">Uitgenodigd</option>
            <option value="confirmed">Bevestigd</option>
            <option value="declined">Afgewezen</option>
          </select>
        </div>

        {/* Gastenlijst */}
        <div style={{ background: "white", borderRadius: 16, border: "1px solid #ece8e4", overflow: "hidden" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "48px", textAlign: "center" }}>
              <p style={{ fontSize: 36, marginBottom: 12 }}>👥</p>
              <p style={{ fontFamily: "serif", fontSize: 20, color: "#16161D", marginBottom: 6 }}>Nog geen gasten</p>
              <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#9a8e88" }}>Voeg je eerste gast toe om unieke links te genereren.</p>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #ece8e4" }}>
                  {["Naam", "E-mail", "Groep", "Status", "RSVP", "Link", ""].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontFamily: "sans-serif", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a8e88", fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((g, i) => {
                  const rsvp = g.rsvp?.[0];
                  return (
                    <tr key={g.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #ece8e4" : "none" }}>
                      <td style={{ padding: "14px 16px" }}>
                        <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#16161D", fontWeight: 500 }}>{g.first_name} {g.last_name}</p>
                      </td>
                      <td style={{ padding: "14px 16px", fontFamily: "sans-serif", fontSize: 13, color: "#6b6560" }}>{g.email || "—"}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontFamily: "sans-serif", fontSize: 11, color: "#9a8e88", background: "#f5f0ed", padding: "3px 8px", borderRadius: 999 }}>{g.group_name}</span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontFamily: "sans-serif", fontSize: 11, color: g.opened_at ? "#2563eb" : "#9a8e88", background: g.opened_at ? "#eff6ff" : "#f5f0ed", padding: "3px 8px", borderRadius: 999 }}>
                          {g.opened_at ? "✓ Geopend" : "Niet geopend"}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        {rsvp ? (
                          <span style={{ fontFamily: "sans-serif", fontSize: 11, color: rsvp.attending ? "#16a34a" : "#dc2626", background: rsvp.attending ? "#f0fdf4" : "#fef2f2", padding: "3px 8px", borderRadius: 999 }}>
                            {rsvp.attending ? "✓ Aanwezig" : "✗ Afwezig"}
                          </span>
                        ) : <span style={{ fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88" }}>—</span>}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <button onClick={() => copyLink(g.token)} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "1px solid #e0dbd7", borderRadius: 6, padding: "5px 10px", fontFamily: "sans-serif", fontSize: 11, cursor: "pointer", color: "#5a5550" }}>
                          {copied === g.token ? <Check size={11} style={{ color: "#16a34a" }} /> : <Copy size={11} />}
                          {copied === g.token ? "Gekopieerd" : "Kopieer link"}
                        </button>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <button onClick={() => deleteGuest(g.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", opacity: 0.6 }}><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
