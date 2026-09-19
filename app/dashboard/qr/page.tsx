"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/Layout";
import { QrCode, Download, Copy, Check, Link } from "lucide-react";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://casanomada-trouwkaarten.netlify.app";

type QRType = { id: string; label: string; description: string; url: string; };

export default function QRPage() {
  const router = useRouter();
  const [wedding, setWedding] = useState<{ slug: string; partner1_first: string; partner2_first: string } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push("/login"); return; }
      const res = await fetch("/api/weddings", { headers: { Authorization: `Bearer ${session.access_token}` } });
      const ws = await res.json();
      if (ws[0]) setWedding(ws[0]);
    });
  }, [router]);

  const copyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!wedding) return <DashboardLayout><div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "50vh" }}><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style><div style={{ width: 32, height: 32, border: "2px solid #8B2635", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /></div></DashboardLayout>;

  const qrTypes: QRType[] = [
    { id: "invite", label: "Uitnodiging", description: "QR code voor de hoofdpagina van jullie uitnodiging", url: `${APP_URL}/invite/${wedding.slug}` },
    { id: "rsvp", label: "RSVP", description: "Direct naar de RSVP bevestiging", url: `${APP_URL}/invite/${wedding.slug}#rsvp` },
    { id: "photos", label: "Foto's uploaden", description: "Gasten kunnen direct foto's toevoegen", url: `${APP_URL}/invite/${wedding.slug}#photos` },
    { id: "messages", label: "Bericht achterlaten", description: "Direct naar het gästenboek", url: `${APP_URL}/invite/${wedding.slug}#messages` },
  ];

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "28px 24px" }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "serif", fontSize: 28, color: "#16161D", marginBottom: 4 }}>QR codes</h1>
          <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#9a8e88" }}>Print of deel QR codes voor elke sectie van jullie uitnodiging</p>
        </div>

        {/* Tip */}
        <div style={{ background: "#fdf6f4", borderRadius: 14, border: "1px solid #f5ddd8", padding: "14px 18px", marginBottom: 24, display: "flex", gap: 12 }}>
          <QrCode size={18} style={{ color: "#8B2635", flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#5a5550", lineHeight: 1.6 }}>
            Zet een QR code op jullie trouwkaarten of in de ceremonieboekjes. Gasten scannen de code met hun telefoon en landen direct op de juiste pagina.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 16 }}>
          {qrTypes.map(qr => (
            <div key={qr.id} style={{ background: "white", borderRadius: 16, border: "1px solid #ece8e4", padding: 24 }}>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                {/* QR placeholder */}
                <div style={{ width: 100, height: 100, background: "#f5f0ec", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <QrCode size={50} style={{ color: "#16161D" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "serif", fontSize: 17, color: "#16161D", marginBottom: 4 }}>{qr.label}</p>
                  <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", marginBottom: 12, lineHeight: 1.5 }}>{qr.description}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f5f0ec", borderRadius: 8, padding: "6px 10px" }}>
                      <Link size={11} style={{ color: "#9a8e88", flexShrink: 0 }} />
                      <span style={{ fontFamily: "sans-serif", fontSize: 10, color: "#6b6560", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{qr.url}</span>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => copyLink(qr.url, qr.id)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "white", border: "1px solid #e0dbd7", borderRadius: 8, padding: "8px", fontFamily: "sans-serif", fontSize: 12, color: "#5a5550", cursor: "pointer" }}>
                        {copied === qr.id ? <><Check size={12} style={{ color: "#28a745" }} /> Gekopieerd</> : <><Copy size={12} /> Kopieer link</>}
                      </button>
                      <button style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "#8B2635", border: "none", borderRadius: 8, padding: "8px", fontFamily: "sans-serif", fontSize: 12, color: "white", cursor: "pointer" }}>
                        <Download size={12} /> Download QR
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Instructies */}
        <div style={{ background: "white", borderRadius: 16, border: "1px solid #ece8e4", padding: 24, marginTop: 20 }}>
          <h2 style={{ fontFamily: "serif", fontSize: 20, color: "#16161D", marginBottom: 16 }}>Hoe gebruik je de QR codes?</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { step: "1", text: "Download de QR code als PNG afbeelding" },
              { step: "2", text: "Voeg de QR code toe aan jullie trouwkaart of ceremonieboekje" },
              { step: "3", text: "Gasten scannen de code met hun telefoon camera" },
              { step: "4", text: "Ze landen direct op de uitnodiging, RSVP of fotoalbum" },
            ].map(({ step, text }) => (
              <div key={step} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#fdf6f4", border: "1px solid #f5ddd8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontFamily: "sans-serif", fontSize: 12, fontWeight: 700, color: "#8B2635" }}>{step}</span>
                </div>
                <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#5a5550" }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
