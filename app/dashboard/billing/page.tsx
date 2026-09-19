"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Check, ExternalLink } from "lucide-react";
import { PACKAGES } from "@/lib/config";

const TIKKIE_URL = "https://tikkie.me/pay/ch43q8tuu0jco3beatpf";

export default function BillingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const [wedding, setWedding] = useState<{ id: string; status: string; package: string; partner1_first: string; partner2_first: string; slug: string } | null>(null);
  const [session, setSession] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      if (!s) { router.push("/login"); return; }
      setSession(s.access_token);
      const res = await fetch("/api/weddings", { headers: { Authorization: `Bearer ${s.access_token}` } });
      const ws = await res.json();
      if (ws[0]) setWedding(ws[0]);
      setLoading(false);
    });
  }, [router]);

  const handlePublish = async () => {
    if (!wedding || !session) return;
    setPublishing(true);
    await fetch("/api/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session}` },
      body: JSON.stringify({ invitation_id: wedding.id }),
    });
    setWedding(w => w ? { ...w, status: "published" } : null);
    setPublishing(false);
  };

  const handleCheckout = async (pkg: string) => {
    if (!session || !wedding) return;
    const res = await fetch("/api/stripe", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session}` },
      body: JSON.stringify({ wedding_id: wedding.id, package: pkg }),
    });
    const data = await res.json();
    if (data.checkout_url) window.location.href = data.checkout_url;
    else if (data.tikkie_url) window.open(data.tikkie_url, "_blank");
  };

  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style><div style={{ width: 36, height: 36, border: "2px solid #8B2635", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /></div>;

  const isPaid = wedding?.status === "paid" || wedding?.status === "published";
  const isPublished = wedding?.status === "published";

  return (
    <div style={{ minHeight: "100vh", background: "#f9f5f1" }}>
      <header style={{ background: "white", borderBottom: "1px solid #ece8e4", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "sans-serif", fontSize: 13, color: "#6b6560", textDecoration: "none" }}><ArrowLeft size={14} /> Dashboard</Link>
          <span style={{ fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, color: "#16161D" }}>Betaling & Publiceren</span>
        </div>
      </header>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
        {/* Succes banner */}
        {success && (
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 14, padding: "16px 20px", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
            <Check size={18} style={{ color: "#16a34a" }} />
            <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#15803d", margin: 0 }}>Betaling ontvangen! Je kunt nu publiceren.</p>
          </div>
        )}

        {/* Status */}
        {wedding && (
          <div style={{ background: "white", borderRadius: 16, border: "1px solid #ece8e4", padding: "24px", marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ fontFamily: "serif", fontSize: 22, color: "#16161D", marginBottom: 4 }}>{wedding.partner1_first} & {wedding.partner2_first}</h2>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999, background: isPublished ? "#f0fdf4" : isPaid ? "#eff6ff" : "#fdf6f4" }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: isPublished ? "#16a34a" : isPaid ? "#2563eb" : "#e0a000" }} />
                  <span style={{ fontFamily: "sans-serif", fontSize: 12, color: isPublished ? "#15803d" : isPaid ? "#1d4ed8" : "#854d0e" }}>
                    {isPublished ? "Gepubliceerd" : isPaid ? "Betaald" : "Concept"}
                  </span>
                </div>
              </div>
              {isPublished && (
                <div style={{ display: "flex", gap: 10 }}>
                  <Link href={`/invite/${wedding.slug}`} target="_blank" style={{ display: "flex", alignItems: "center", gap: 6, background: "#8B2635", color: "white", borderRadius: 999, padding: "10px 18px", fontFamily: "sans-serif", fontSize: 13, textDecoration: "none" }}>
                    <ExternalLink size={13} /> Bekijk live
                  </Link>
                  <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/invite/${wedding.slug}`)} style={{ display: "flex", alignItems: "center", gap: 6, background: "white", border: "1.5px solid #e0dbd7", borderRadius: 999, padding: "10px 18px", fontFamily: "sans-serif", fontSize: 13, cursor: "pointer", color: "#5a5550" }}>
                    📋 Kopieer link
                  </button>
                </div>
              )}
              {isPaid && !isPublished && (
                <button onClick={handlePublish} disabled={publishing} style={{ display: "flex", alignItems: "center", gap: 8, background: "#8B2635", color: "white", border: "none", borderRadius: 999, padding: "12px 24px", fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                  {publishing ? "Publiceren..." : "🚀 Publiceer nu"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Pakketten */}
        {!isPaid && (
          <div>
            <h2 style={{ fontFamily: "serif", fontSize: 26, color: "#16161D", marginBottom: 6 }}>Kies je pakket</h2>
            <p style={{ fontFamily: "sans-serif", fontSize: 15, color: "#6b6560", marginBottom: 24 }}>Eenmalige betaling, geen abonnement. Publiceer wanneer je wilt.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {Object.values(PACKAGES).map(pkg => (
                <div key={pkg.id} style={{ background: "white", borderRadius: 18, border: pkg.id === "collection" ? "2px solid #8B2635" : "1px solid #ece8e4", padding: "28px 24px", position: "relative" }}>
                  {pkg.id === "collection" && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "#8B2635", color: "white", padding: "3px 14px", borderRadius: 999, fontFamily: "sans-serif", fontSize: 11, fontWeight: 600 }}>MEEST GEKOZEN</div>}
                  <h3 style={{ fontFamily: "serif", fontSize: 20, color: "#16161D", marginBottom: 4 }}>{pkg.name}</h3>
                  <p style={{ fontFamily: "serif", fontSize: 36, color: "#8B2635", fontWeight: 600, marginBottom: 20 }}>€{pkg.price}</p>
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 8 }}>
                    {pkg.features.map(f => (
                      <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontFamily: "sans-serif", fontSize: 13, color: "#5a5550" }}>
                        <Check size={13} style={{ color: "#8B2635", flexShrink: 0, marginTop: 2 }} />{f}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => handleCheckout(pkg.id)} style={{ width: "100%", background: pkg.id === "collection" ? "#8B2635" : "#16161D", color: "white", border: "none", borderRadius: 999, padding: "14px", fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                    Kies {pkg.name}
                  </button>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20, background: "#fdf6f4", border: "1px solid #f0e0db", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 20 }}>💳</span>
              <div>
                <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#16161D", fontWeight: 500 }}>Betalen via Tikkie</p>
                <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b6560" }}>Na betaling klik op "Betaald — Publiceer nu" hierboven om je uitnodiging live te zetten.</p>
              </div>
              <a href={TIKKIE_URL} target="_blank" rel="noopener noreferrer" style={{ marginLeft: "auto", background: "#009DE0", color: "white", borderRadius: 10, padding: "10px 18px", fontFamily: "sans-serif", fontSize: 13, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}>
                Betaal via Tikkie
              </a>
            </div>
            {isPaid !== true && (
              <button onClick={() => { if (wedding && session) { fetch("/api/publish", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${session}` }, body: JSON.stringify({ invitation_id: wedding?.id }) }).then(() => setWedding(w => w ? { ...w, status: "published" } : null)); }}} style={{ marginTop: 10, fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                Ik heb al betaald via Tikkie → Publiceer mijn uitnodiging
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
