"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Download } from "lucide-react";

type Rsvp = { id: string; name: string; attending: boolean; adults: number; children: number; diet: string; allergies: string; message: string; created_at: string };

export default function RsvpPage() {
  const router = useRouter();
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push("/login"); return; }
      const wRes = await fetch("/api/weddings", { headers: { Authorization: `Bearer ${session.access_token}` } });
      const ws = await wRes.json();
      if (!ws[0]) { setLoading(false); return; }
      const res = await fetch(`/api/rsvp?wedding_id=${ws[0].id}`, { headers: { Authorization: `Bearer ${session.access_token}` } });
      const data = await res.json();
      setRsvps(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, [router]);

  const exportCSV = () => {
    const rows = [["Naam", "Aanwezig", "Volwassenen", "Kinderen", "Dieet", "Bericht", "Datum"], ...rsvps.map(r => [r.name, r.attending ? "Ja" : "Nee", r.adults, r.children, r.diet || "", r.message || "", new Date(r.created_at).toLocaleDateString("nl-NL")])];
    const csv = rows.map(r => r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "rsvp.csv"; a.click();
  };

  const filtered = filter === "all" ? rsvps : rsvps.filter(r => filter === "yes" ? r.attending : !r.attending);
  const aanwezig = rsvps.filter(r => r.attending).length;
  const afwezig = rsvps.filter(r => !r.attending).length;

  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style><div style={{ width: 36, height: 36, border: "2px solid #8B2635", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /></div>;

  return (
    <div style={{ minHeight: "100vh", background: "#f9f5f1" }}>
      <header style={{ background: "white", borderBottom: "1px solid #ece8e4", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "sans-serif", fontSize: 13, color: "#6b6560", textDecoration: "none" }}><ArrowLeft size={14} /> Dashboard</Link>
          <div style={{ width: 1, height: 20, background: "#e0dbd7" }} />
          <span style={{ fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, color: "#16161D" }}>RSVP Overzicht</span>
          <button onClick={exportCSV} style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, background: "white", border: "1px solid #e0dbd7", borderRadius: 8, padding: "8px 14px", fontFamily: "sans-serif", fontSize: 12, cursor: "pointer", color: "#5a5550" }}><Download size={13} /> Export CSV</button>
        </div>
      </header>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20 }}>
          {[{ l: "Totaal reacties", v: rsvps.length, c: "#8B2635" }, { l: "Aanwezig", v: aanwezig, c: "#16a34a" }, { l: "Afwezig", v: afwezig, c: "#dc2626" }].map(({ l, v, c }) => (
            <div key={l} style={{ background: "white", borderRadius: 14, border: "1px solid #ece8e4", padding: "20px", textAlign: "center" }}>
              <p style={{ fontFamily: "serif", fontSize: 36, color: c, fontWeight: 600, lineHeight: 1 }}>{v}</p>
              <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#9a8e88", marginTop: 4 }}>{l}</p>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {[["all", "Alle"], ["yes", "Aanwezig"], ["no", "Afwezig"]].map(([v, l]) => (
            <button key={v} onClick={() => setFilter(v)} style={{ padding: "8px 16px", borderRadius: 999, border: `1.5px solid ${filter === v ? "#8B2635" : "#e0dbd7"}`, background: filter === v ? "#8B2635" : "white", color: filter === v ? "white" : "#5a5550", fontFamily: "sans-serif", fontSize: 13, cursor: "pointer" }}>{l}</button>
          ))}
        </div>
        <div style={{ background: "white", borderRadius: 16, border: "1px solid #ece8e4", overflow: "hidden" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "48px", textAlign: "center" }}>
              <p style={{ fontSize: 36, marginBottom: 12 }}>📋</p>
              <p style={{ fontFamily: "serif", fontSize: 20, color: "#16161D", marginBottom: 6 }}>Nog geen RSVP's</p>
              <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#9a8e88" }}>RSVP's verschijnen hier zodra gasten bevestigen.</p>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr style={{ borderBottom: "1px solid #ece8e4" }}>
                {["Naam", "Aanwezig", "Volwassenen", "Kinderen", "Dieet", "Bericht", "Datum"].map(h => <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontFamily: "sans-serif", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9a8e88", fontWeight: 500 }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #ece8e4" : "none" }}>
                    <td style={{ padding: "14px 16px", fontFamily: "sans-serif", fontSize: 14, color: "#16161D", fontWeight: 500 }}>{r.name}</td>
                    <td style={{ padding: "14px 16px" }}><span style={{ fontFamily: "sans-serif", fontSize: 12, color: r.attending ? "#16a34a" : "#dc2626", background: r.attending ? "#f0fdf4" : "#fef2f2", padding: "3px 8px", borderRadius: 999 }}>{r.attending ? "✓ Ja" : "✗ Nee"}</span></td>
                    <td style={{ padding: "14px 16px", fontFamily: "sans-serif", fontSize: 14, color: "#5a5550" }}>{r.adults || 1}</td>
                    <td style={{ padding: "14px 16px", fontFamily: "sans-serif", fontSize: 14, color: "#5a5550" }}>{r.children || 0}</td>
                    <td style={{ padding: "14px 16px", fontFamily: "sans-serif", fontSize: 13, color: "#6b6560" }}>{r.diet || "—"}</td>
                    <td style={{ padding: "14px 16px", fontFamily: "sans-serif", fontSize: 13, color: "#6b6560", maxWidth: 200 }}><p style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.message || "—"}</p></td>
                    <td style={{ padding: "14px 16px", fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88" }}>{new Date(r.created_at).toLocaleDateString("nl-NL")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
