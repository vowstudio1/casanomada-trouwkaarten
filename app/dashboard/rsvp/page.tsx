"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/Layout";
import { Download, Users, CheckCircle, XCircle, Clock } from "lucide-react";

type RSVP = { id: string; guest_name: string; status: string; dietary_wishes: string; message: string; created_at: string; plus_one: boolean; };

export default function RSVPPage() {
  const router = useRouter();
  const [rsvps, setRSVPs] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "confirmed" | "declined">("all");

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push("/login"); return; }
      const res = await fetch("/api/weddings", { headers: { Authorization: `Bearer ${session.access_token}` } });
      const ws = await res.json();
      if (ws[0]) {
        const { data } = await supabase.from("rsvps").select("*").eq("wedding_id", ws[0].id).order("created_at", { ascending: false });
        setRSVPs(data || []);
      }
      setLoading(false);
    });
  }, [router]);

  const confirmed = rsvps.filter(r => r.status === "confirmed");
  const declined = rsvps.filter(r => r.status === "declined");
  const filtered = rsvps.filter(r => filter === "all" || r.status === filter);

  const exportCSV = () => {
    const rows = [["Naam", "Status", "Plus 1", "Dieetwensen", "Bericht", "Datum"], ...rsvps.map(r => [r.guest_name, r.status === "confirmed" ? "Aanwezig" : "Afwezig", r.plus_one ? "Ja" : "Nee", r.dietary_wishes || "", r.message || "", new Date(r.created_at).toLocaleDateString("nl-NL")])];
    const csv = rows.map(r => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = "rsvp.csv";
    a.click();
  };

  if (loading) return <DashboardLayout><div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "50vh" }}><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style><div style={{ width: 32, height: 32, border: "2px solid #8B2635", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "28px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontFamily: "serif", fontSize: 28, color: "#16161D", marginBottom: 4 }}>RSVP</h1>
            <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#9a8e88" }}>{rsvps.length} reacties ontvangen</p>
          </div>
          {rsvps.length > 0 && (
            <button onClick={exportCSV} style={{ display: "flex", alignItems: "center", gap: 6, background: "white", border: "1.5px solid #e0dbd7", borderRadius: 999, padding: "10px 18px", fontFamily: "sans-serif", fontSize: 13, color: "#5a5550", cursor: "pointer" }}>
              <Download size={14} /> Exporteer CSV
            </button>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
          {[
            { label: "Aanwezig", count: confirmed.length, icon: CheckCircle, color: "#28a745", bg: "#f0faf0" },
            { label: "Afwezig", count: declined.length, icon: XCircle, color: "#8B2635", bg: "#fff0f0" },
            { label: "Totaal", count: rsvps.length, icon: Users, color: "#5a5550", bg: "#f5f0ec" },
          ].map(({ label, count, icon: Icon, color, bg }) => (
            <div key={label} style={{ background: "white", borderRadius: 14, border: "1px solid #ece8e4", padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={20} style={{ color }} />
              </div>
              <div>
                <p style={{ fontFamily: "sans-serif", fontSize: 24, fontWeight: 700, color: "#16161D" }}>{count}</p>
                <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88" }}>{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {(["all", "confirmed", "declined"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 16px", borderRadius: 999, border: filter === f ? "none" : "1px solid #e0dbd7", background: filter === f ? "#8B2635" : "white", color: filter === f ? "white" : "#6b6560", fontFamily: "sans-serif", fontSize: 13, cursor: "pointer" }}>
              {f === "all" ? "Alle" : f === "confirmed" ? "Aanwezig" : "Afwezig"}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: 16, border: "1px solid #ece8e4" }}>
            <Clock size={40} style={{ color: "#c0b8b4", margin: "0 auto 16px" }} />
            <p style={{ fontFamily: "serif", fontSize: 20, color: "#9a8e88" }}>Nog geen RSVP's ontvangen</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map(rsvp => (
              <div key={rsvp.id} style={{ background: "white", borderRadius: 12, border: "1px solid #ece8e4", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <p style={{ fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, color: "#16161D" }}>{rsvp.guest_name}</p>
                    {rsvp.plus_one && <span style={{ fontFamily: "sans-serif", fontSize: 10, background: "#f5f0ec", color: "#5a5550", borderRadius: 999, padding: "2px 6px" }}>+1</span>}
                    <span style={{ fontFamily: "sans-serif", fontSize: 11, borderRadius: 999, padding: "2px 8px", background: rsvp.status === "confirmed" ? "#f0faf0" : "#fff0f0", color: rsvp.status === "confirmed" ? "#28a745" : "#8B2635" }}>
                      {rsvp.status === "confirmed" ? "Aanwezig" : "Afwezig"}
                    </span>
                  </div>
                  {rsvp.dietary_wishes && <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88" }}>Dieet: {rsvp.dietary_wishes}</p>}
                  {rsvp.message && <p style={{ fontFamily: "serif", fontSize: 13, color: "#5a5550", fontStyle: "italic", marginTop: 4 }}>"{rsvp.message}"</p>}
                </div>
                <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "#c0b8b4", marginLeft: 12, flexShrink: 0 }}>{new Date(rsvp.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
