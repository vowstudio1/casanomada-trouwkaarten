"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/Layout";
import { Edit3, Users, CheckSquare, Image, MessageSquare, Globe, ArrowRight, Wand2 } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [wedding, setWedding] = useState<{ id: string; partner1_first: string; partner2_first: string; wedding_date: string; status: string; slug: string } | null>(null);
  const [stats, setStats] = useState({ guests: 0, rsvp: 0, photos: 0, messages: 0 });
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push("/login"); return; }
      const { data: p } = await supabase.from("profiles").select("first_name").eq("id", session.user.id).single();
      if (p?.first_name) setFirstName(p.first_name);
      const res = await fetch("/api/weddings", { headers: { Authorization: `Bearer ${session.access_token}` } });
      const ws = await res.json();
      if (ws[0]) {
        setWedding(ws[0]);
        const [g, r, ph, m] = await Promise.all([
          supabase.from("guests").select("id", { count: "exact", head: true }).eq("wedding_id", ws[0].id),
          supabase.from("rsvps").select("id", { count: "exact", head: true }).eq("wedding_id", ws[0].id).eq("status", "confirmed"),
          supabase.from("photos").select("id", { count: "exact", head: true }).eq("wedding_id", ws[0].id),
          supabase.from("messages").select("id", { count: "exact", head: true }).eq("wedding_id", ws[0].id).eq("status", "pending"),
        ]);
        setStats({ guests: g.count || 0, rsvp: r.count || 0, photos: ph.count || 0, messages: m.count || 0 });
      } else { router.push("/register"); }
    });
  }, [router]);

  const daysLeft = wedding?.wedding_date ? Math.ceil((new Date(wedding.wedding_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;

  if (!wedding) return (
    <DashboardLayout>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "50vh" }}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ width: 32, height: 32, border: "2px solid #8B2635", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 24px" }}>
        {/* Hero welkom */}
        <div style={{ background: "linear-gradient(135deg, #8B2635 0%, #a83545 100%)", borderRadius: 20, padding: "28px 32px", marginBottom: 24, color: "white", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -20, top: -20, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
          <p style={{ fontFamily: "sans-serif", fontSize: 13, opacity: 0.8, marginBottom: 6, letterSpacing: "0.05em" }}>Welkom terug{firstName ? `, ${firstName}` : ""}</p>
          <h1 style={{ fontFamily: "serif", fontSize: 28, marginBottom: 6 }}>{wedding.partner1_first} & {wedding.partner2_first}</h1>
          {wedding.wedding_date && (
            <p style={{ fontFamily: "sans-serif", fontSize: 14, opacity: 0.85 }}>
              {new Date(wedding.wedding_date).toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              {daysLeft !== null && daysLeft > 0 && <span style={{ marginLeft: 12, background: "rgba(255,255,255,0.2)", borderRadius: 999, padding: "2px 10px", fontSize: 12 }}>nog {daysLeft} dagen</span>}
            </p>
          )}
          {wedding.status === "published" && (
            <a href={`/invite/${wedding.slug}`} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 14, background: "rgba(255,255,255,0.2)", color: "white", textDecoration: "none", borderRadius: 999, padding: "8px 16px", fontFamily: "sans-serif", fontSize: 13 }}>
              <Globe size={13} /> Bekijk live uitnodiging
            </a>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Gasten", value: stats.guests, icon: Users, href: "/dashboard/guests", color: "#3b82f6" },
            { label: "RSVP bevestigd", value: stats.rsvp, icon: CheckSquare, href: "/dashboard/rsvp", color: "#28a745" },
            { label: "Foto's", value: stats.photos, icon: Image, href: "/dashboard/fotoalbum", color: "#f59e0b" },
            { label: "Berichten nieuw", value: stats.messages, icon: MessageSquare, href: "/dashboard/berichten", color: "#8B2635" },
          ].map(({ label, value, icon: Icon, href, color }) => (
            <Link key={label} href={href} style={{ background: "white", borderRadius: 14, border: "1px solid #ece8e4", padding: "18px 20px", textDecoration: "none", display: "block", transition: "border-color 0.15s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ fontFamily: "sans-serif", fontSize: 26, fontWeight: 700, color: "#16161D" }}>{value}</p>
                  <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88" }}>{label}</p>
                </div>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={17} style={{ color }} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Snelle acties */}
        <div style={{ background: "white", borderRadius: 16, border: "1px solid #ece8e4", padding: 24, marginBottom: 16 }}>
          <h2 style={{ fontFamily: "serif", fontSize: 20, color: "#16161D", marginBottom: 16 }}>Snelle acties</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
            {[
              { label: "Uitnodiging bouwen", href: "/dashboard/builder", icon: Edit3, desc: "Bewerk namen en teksten" },
              { label: "Gasten toevoegen", href: "/dashboard/guests", icon: Users, desc: "Personaliseerde links" },
              { label: "Design aanpassen", href: "/dashboard/design", icon: Wand2, desc: "Sjabloon en kleuren" },
              { label: "Publiceren", href: "/dashboard/billing", icon: Globe, desc: "Maak de uitnodiging live" },
            ].map(({ label, href, icon: Icon, desc }) => (
              <Link key={href} href={href} style={{ display: "flex", flexDirection: "column", gap: 6, padding: "14px 16px", borderRadius: 12, border: "1px solid #ece8e4", textDecoration: "none", background: "#fdf9f7", transition: "border-color 0.15s" }}>
                <Icon size={18} style={{ color: "#8B2635" }} />
                <p style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 600, color: "#16161D" }}>{label}</p>
                <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "#9a8e88" }}>{desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Status */}
        <div style={{ background: "white", borderRadius: 16, border: "1px solid #ece8e4", padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: wedding.status === "published" ? "#28a745" : "#f59e0b" }} />
            <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#5a5550" }}>
              Status: <strong>{wedding.status === "published" ? "Gepubliceerd en live" : wedding.status === "paid" ? "Betaald – klaar om te publiceren" : "Concept"}</strong>
            </p>
            {wedding.status !== "published" && (
              <Link href="/dashboard/billing" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, fontFamily: "sans-serif", fontSize: 12, color: "#8B2635", textDecoration: "none" }}>
                Publiceren <ArrowRight size={12} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
