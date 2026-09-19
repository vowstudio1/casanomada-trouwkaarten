"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/Layout";
import { Trash2, Check, X, MessageCircle, Eye, EyeOff } from "lucide-react";

type Message = { id: string; author_name: string; content: string; status: string; created_at: string; };

export default function BerichtenPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [weddingId, setWeddingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "approved" | "pending">("all");

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push("/login"); return; }
      const res = await fetch("/api/weddings", { headers: { Authorization: `Bearer ${session.access_token}` } });
      const ws = await res.json();
      if (ws[0]) {
        setWeddingId(ws[0].id);
        const { data } = await supabase.from("messages").select("*").eq("wedding_id", ws[0].id).order("created_at", { ascending: false });
        setMessages(data || []);
      }
      setLoading(false);
    });
  }, [router]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("messages").update({ status }).eq("id", id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m));
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Bericht verwijderen?")) return;
    await supabase.from("messages").delete().eq("id", id);
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const filtered = messages.filter(m => filter === "all" || m.status === filter);
  const pending = messages.filter(m => m.status === "pending").length;

  if (loading) return <DashboardLayout><div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "50vh" }}><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style><div style={{ width: 32, height: 32, border: "2px solid #8B2635", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "28px 24px" }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontFamily: "serif", fontSize: 28, color: "#16161D" }}>Berichten</h1>
            {pending > 0 && <span style={{ background: "#8B2635", color: "white", fontFamily: "sans-serif", fontSize: 11, fontWeight: 700, borderRadius: 999, padding: "2px 8px" }}>{pending} nieuw</span>}
          </div>
          <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#9a8e88" }}>{messages.length} berichten van jullie gasten</p>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {(["all", "approved", "pending"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 16px", borderRadius: 999, border: "none", background: filter === f ? "#8B2635" : "white", color: filter === f ? "white" : "#6b6560", fontFamily: "sans-serif", fontSize: 13, cursor: "pointer", border: filter === f ? "none" : "1px solid #e0dbd7" }}>
              {f === "all" ? "Alle" : f === "approved" ? "Zichtbaar" : "Te reviewen"}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: 16, border: "1px solid #ece8e4" }}>
            <MessageCircle size={40} style={{ color: "#c0b8b4", margin: "0 auto 16px" }} />
            <p style={{ fontFamily: "serif", fontSize: 20, color: "#9a8e88" }}>Nog geen berichten</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map(msg => (
              <div key={msg.id} style={{ background: "white", borderRadius: 14, border: `1.5px solid ${msg.status === "pending" ? "#f5c6cb" : "#ece8e4"}`, padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#fdf6f4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 700, color: "#8B2635" }}>{msg.author_name[0]?.toUpperCase()}</span>
                      </div>
                      <div>
                        <p style={{ fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, color: "#16161D" }}>{msg.author_name}</p>
                        <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "#9a8e88" }}>{new Date(msg.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "long" })}</p>
                      </div>
                      {msg.status === "pending" && <span style={{ background: "#fff3cd", color: "#856404", fontFamily: "sans-serif", fontSize: 10, borderRadius: 999, padding: "2px 8px" }}>Te reviewen</span>}
                      {msg.status === "hidden" && <span style={{ background: "#f8d7da", color: "#721c24", fontFamily: "sans-serif", fontSize: 10, borderRadius: 999, padding: "2px 8px" }}>Verborgen</span>}
                    </div>
                    <p style={{ fontFamily: "serif", fontSize: 15, color: "#16161D", lineHeight: 1.6, fontStyle: "italic" }}>"{msg.content}"</p>
                  </div>
                  <div style={{ display: "flex", gap: 6, marginLeft: 12 }}>
                    {msg.status !== "approved" && (
                      <button onClick={() => updateStatus(msg.id, "approved")} title="Goedkeuren" style={{ background: "#f0faf0", border: "1px solid #c3e6cb", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <Check size={14} style={{ color: "#28a745" }} />
                      </button>
                    )}
                    {msg.status === "approved" && (
                      <button onClick={() => updateStatus(msg.id, "hidden")} title="Verbergen" style={{ background: "#fff8f0", border: "1px solid #ffd6a5", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <EyeOff size={14} style={{ color: "#fd7e14" }} />
                      </button>
                    )}
                    <button onClick={() => deleteMessage(msg.id)} title="Verwijderen" style={{ background: "#fff0f0", border: "1px solid #f5c6cb", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                      <Trash2 size={14} style={{ color: "#8B2635" }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
