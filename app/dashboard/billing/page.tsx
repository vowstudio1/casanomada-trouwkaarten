"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/Layout";
import { ExternalLink, Check, CreditCard, Globe, Lock, Sparkles } from "lucide-react";

const TIKKIE_URL = "https://tikkie.me/pay/ch43q8tuu0jco3beatpf";

function BillingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const [wedding, setWedding] = useState<{ id: string; status: string; partner1_first: string; partner2_first: string; slug: string } | null>(null);
  const [session, setSession] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      if (!s) { router.push("/login"); return; }
      setSession(s.access_token);
      const res = await fetch("/api/weddings", { headers: { Authorization: `Bearer ${s.access_token}` } });
      const ws = await res.json();
      if (ws[0]) { setWedding(ws[0]); if (ws[0].status === "published") setPublished(true); }
    });
  }, [router]);

  const publishWedding = async () => {
    if (!session || !wedding) return;
    setPublishing(true);
    const res = await fetch("/api/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session}` },
      body: JSON.stringify({ wedding_id: wedding.id }),
    });
    if (res.ok) { setPublished(true); setWedding(w => w ? { ...w, status: "published" } : w); }
    setPublishing(false);
  };

  const isPaid = wedding?.status === "paid" || wedding?.status === "published" || success === "1";
  const isPublished = published || wedding?.status === "published";

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 24px" }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "serif", fontSize: 28, color: "#16161D", marginBottom: 4 }}>Betaling & Publiceren</h1>
          <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#9a8e88" }}>Activeer jullie digitale uitnodiging</p>
        </div>

        {/* Stappen */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28, alignItems: "center" }}>
          {[
            { step: "1", label: "Uitnodiging bouwen", done: true },
            { step: "2", label: "Betalen", done: isPaid },
            { step: "3", label: "Publiceren", done: isPublished },
          ].map(({ step, label, done }, i) => (
            <div key={step} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: done ? "#8B2635" : "white", border: `2px solid ${done ? "#8B2635" : "#e0dbd7"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {done ? <Check size={13} color="white" /> : <span style={{ fontFamily: "sans-serif", fontSize: 11, color: "#9a8e88" }}>{step}</span>}
                </div>
                <span style={{ fontFamily: "sans-serif", fontSize: 13, color: done ? "#8B2635" : "#9a8e88" }}>{label}</span>
              </div>
              {i < 2 && <div style={{ width: 24, height: 2, background: "#e0dbd7", margin: "0 4px" }} />}
            </div>
          ))}
        </div>

        {isPublished ? (
          /* Gepubliceerd */
          <div style={{ background: "white", borderRadius: 20, border: "2px solid #28a745", padding: 32, textAlign: "center", marginBottom: 20 }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#f0faf0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Globe size={28} style={{ color: "#28a745" }} />
            </div>
            <h2 style={{ fontFamily: "serif", fontSize: 26, color: "#16161D", marginBottom: 8 }}>Jullie uitnodiging is live!</h2>
            <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#9a8e88", marginBottom: 20 }}>Gasten kunnen jullie uitnodiging nu bekijken en RSVP geven.</p>
            <a href={`/invite/${wedding?.slug}`} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#8B2635", color: "white", textDecoration: "none", borderRadius: 999, padding: "12px 24px", fontFamily: "sans-serif", fontSize: 14, fontWeight: 600 }}>
              <ExternalLink size={15} /> Bekijk uitnodiging
            </a>
          </div>
        ) : !isPaid ? (
          /* Betalen */
          <div style={{ background: "white", borderRadius: 20, border: "1px solid #ece8e4", padding: 32, marginBottom: 20 }}>
            <div style={{ display: "flex", align: "center", gap: 10, marginBottom: 20 }}>
              <Sparkles size={20} style={{ color: "#8B2635" }} />
              <h2 style={{ fontFamily: "serif", fontSize: 22, color: "#16161D" }}>Casa Nomada Uitnodiging — € 89</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {["Levenslang toegankelijke digitale uitnodiging", "Onbeperkt gasten uitnodigen", "RSVP bevestigingen", "Fotoalbum", "Gastenboek", "Programma & locatieinfo", "QR codes inbegrepen", "Persoonlijke ondersteuning"].map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Check size={15} style={{ color: "#28a745" }} />
                  <span style={{ fontFamily: "sans-serif", fontSize: 14, color: "#5a5550" }}>{f}</span>
                </div>
              ))}
            </div>
            <a href={TIKKIE_URL} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#8B2635", color: "white", textDecoration: "none", borderRadius: 999, padding: "14px", fontFamily: "sans-serif", fontSize: 15, fontWeight: 600, marginBottom: 12 }}>
              <CreditCard size={16} /> Betalen via Tikkie
            </a>
            <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", textAlign: "center" }}>Na betaling ontvang je een e-mail. Dan kun je hier publiceren.</p>
            <div style={{ marginTop: 16, padding: "12px 16px", background: "#f9f5f1", borderRadius: 10, display: "flex", alignItems: "center", gap: 8 }}>
              <Lock size={13} style={{ color: "#9a8e88" }} />
              <span style={{ fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88" }}>Heb je al betaald? Stuur even een berichtje zodat we je account activeren.</span>
            </div>
          </div>
        ) : (
          /* Publiceren na betaling */
          <div style={{ background: "white", borderRadius: 20, border: "1px solid #ece8e4", padding: 32, marginBottom: 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#f0faf0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Check size={24} style={{ color: "#28a745" }} />
            </div>
            <h2 style={{ fontFamily: "serif", fontSize: 22, color: "#16161D", marginBottom: 8, textAlign: "center" }}>Betaling ontvangen!</h2>
            <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#9a8e88", marginBottom: 24, textAlign: "center" }}>Jullie uitnodiging staat klaar om te publiceren.</p>
            <button onClick={publishWedding} disabled={publishing} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#8B2635", color: "white", border: "none", borderRadius: 999, padding: "14px", fontFamily: "sans-serif", fontSize: 15, fontWeight: 600, cursor: "pointer", width: "100%" }}>
              <Globe size={16} /> {publishing ? "Publiceren..." : "Uitnodiging publiceren"}
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function BillingPage() {
  return <Suspense fallback={null}><BillingContent /></Suspense>;
}
