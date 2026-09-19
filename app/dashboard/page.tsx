"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getTemplate } from "@/lib/templates";
import { Bell, Settings, LogOut, Plus, Eye, Users, MessageSquare, Image, QrCode, Edit3, Send, Check, ChevronRight, X } from "lucide-react";

type Wedding = {
  id: string; partner1_first: string; partner2_first: string; wedding_date: string;
  city: string; template_slug: string; status: string; slug: string; package: string;
  guests: { count: number }[]; rsvps: { count: number }[]; photos: { count: number }[]; messages: { count: number }[];
};
type Notification = { id: string; type: string; title: string; message: string; read: boolean; created_at: string };

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string; first_name?: string } | null>(null);
  const [weddings, setWeddings] = useState<Wedding[]>([]);
  const [selected, setSelected] = useState<Wedding | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotif, setShowNotif] = useState(false);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<string | null>(null);

  const loadData = useCallback(async (token: string, userId: string) => {
    const res = await fetch("/api/weddings", { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      setWeddings(data); setSelected(data[0]);
    }
    const { data: notifs } = await supabase.from("notifications").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(20);
    setNotifications(notifs || []);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!s) { router.push("/login"); return; }
      setSession(s.access_token);
      supabase.from("profiles").select("*").eq("id", s.user.id).single().then(({ data: profile }) => {
        setUser({ id: s.user.id, email: s.user.email || "", first_name: profile?.first_name });
      });
      loadData(s.access_token, s.user.id).finally(() => setLoading(false));
    });
  }, [router, loadData]);

  const markRead = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotifications(n => n.map(x => x.id === id ? { ...x, read: true } : x));
  };

  const logout = async () => { await supabase.auth.signOut(); router.push("/"); };

  const unread = notifications.filter(n => !n.read).length;
  const template = selected ? getTemplate(selected.template_slug) : null;
  const namen = selected ? `${selected.partner1_first} & ${selected.partner2_first}` : "";
  const guests = selected?.guests?.[0]?.count || 0;
  const rsvps = selected?.rsvps?.[0]?.count || 0;
  const photos = selected?.photos?.[0]?.count || 0;
  const msgs = selected?.messages?.[0]?.count || 0;
  const datum = selected?.wedding_date ? new Date(selected.wedding_date).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" }) : "";

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#f9f5f1", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width: 36, height: 36, border: "2px solid #8B2635", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f9f5f1" }}>
      {/* Header */}
      <header style={{ background: "white", borderBottom: "1px solid #ece8e4", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <Link href="/" style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.2em", color: "#8B2635", textDecoration: "none" }}>CASA NOMADA</Link>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ position: "relative" }}>
              <button onClick={() => setShowNotif(!showNotif)} style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #e0dbd7", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
                <Bell size={16} style={{ color: "#5a5550" }} />
                {unread > 0 && <div style={{ position: "absolute", top: -2, right: -2, width: 16, height: 16, borderRadius: "50%", background: "#8B2635", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 9, color: "white", fontWeight: 700 }}>{unread}</span></div>}
              </button>
              {showNotif && (
                <div style={{ position: "absolute", top: 44, right: 0, width: 320, background: "white", borderRadius: 14, border: "1px solid #ece8e4", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", zIndex: 200, overflow: "hidden" }}>
                  <div style={{ padding: "14px 16px", borderBottom: "1px solid #ece8e4", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 600, color: "#16161D" }}>Notificaties</p>
                    <button onClick={() => setShowNotif(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={14} style={{ color: "#9a8e88" }} /></button>
                  </div>
                  {notifications.length === 0 ? (
                    <p style={{ padding: "20px 16px", fontFamily: "sans-serif", fontSize: 13, color: "#9a8e88", textAlign: "center" }}>Geen notificaties</p>
                  ) : notifications.slice(0, 8).map(n => (
                    <div key={n.id} onClick={() => markRead(n.id)} style={{ padding: "12px 16px", borderBottom: "1px solid #ece8e4", background: n.read ? "white" : "#fdf6f4", cursor: "pointer" }}>
                      <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#16161D", fontWeight: n.read ? 400 : 600 }}>{n.title}</p>
                      {n.message && <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", marginTop: 2 }}>{n.message.slice(0, 60)}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Link href="/dashboard/settings" style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #e0dbd7", background: "white", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
              <Settings size={16} style={{ color: "#5a5550" }} />
            </Link>
            <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "sans-serif", fontSize: 13, color: "#6b6560", background: "none", border: "none", cursor: "pointer" }}>
              <LogOut size={14} /> Uitloggen
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        {/* Welkom */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "serif", fontSize: "clamp(1.6rem,3vw,2.2rem)", color: "#16161D" }}>
            {user?.first_name ? `Welkom, ${user.first_name}` : "Welkom bij Casa Nomada"}
          </h1>
          {weddings.length === 0 && <p style={{ fontFamily: "sans-serif", fontSize: 15, color: "#6b6560", marginTop: 4 }}>Begin met het aanmaken van je eerste digitale trouwkaart.</p>}
        </div>

        {weddings.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 24px", background: "white", borderRadius: 20, border: "1px solid #ece8e4" }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>💌</p>
            <h2 style={{ fontFamily: "serif", fontSize: 28, color: "#16161D", marginBottom: 8 }}>Nog geen uitnodiging</h2>
            <p style={{ fontFamily: "sans-serif", fontSize: 15, color: "#6b6560", marginBottom: 28 }}>Maak je eerste digitale trouwkaart aan.</p>
            <Link href="/register" style={{ background: "#8B2635", color: "white", borderRadius: 999, padding: "14px 28px", fontFamily: "sans-serif", fontSize: 14, fontWeight: 500, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Plus size={16} /> Maak je uitnodiging
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24, alignItems: "start" }}>
            {/* Sidebar */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Bruiloft switcher */}
              <div style={{ background: "white", borderRadius: 16, border: "1px solid #ece8e4", overflow: "hidden" }}>
                <div style={{ padding: "14px 18px", borderBottom: "1px solid #ece8e4" }}>
                  <p style={{ fontFamily: "sans-serif", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9a8e88" }}>Mijn bruiloften</p>
                </div>
                {weddings.map(w => (
                  <button key={w.id} onClick={() => setSelected(w)} style={{ width: "100%", padding: "14px 18px", cursor: "pointer", background: selected?.id === w.id ? "#fdf6f4" : "white", border: "none", borderBottom: "1px solid #ece8e4", display: "flex", alignItems: "center", justifyContent: "space-between", textAlign: "left" }}>
                    <div>
                      <p style={{ fontFamily: "serif", fontSize: 15, color: "#16161D" }}>{w.partner1_first} & {w.partner2_first}</p>
                      <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "#9a8e88", marginTop: 2 }}>{w.status === "published" ? "✓ Live" : w.status === "paid" ? "✓ Betaald" : "Concept"}</p>
                    </div>
                    <ChevronRight size={14} style={{ color: "#c0b8b4" }} />
                  </button>
                ))}
                <Link href="/register" style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 18px", fontFamily: "sans-serif", fontSize: 13, color: "#8B2635", textDecoration: "none" }}>
                  <Plus size={14} /> Nieuwe bruiloft
                </Link>
              </div>

              {/* Snelle navigatie */}
              <div style={{ background: "white", borderRadius: 16, border: "1px solid #ece8e4", overflow: "hidden" }}>
                {[
                  { icon: Edit3, label: "Bewerk uitnodiging", href: `/dashboard/builder` },
                  { icon: Users, label: "Gasten beheren", href: `/dashboard/guests` },
                  { icon: Check, label: "RSVP overzicht", href: `/dashboard/rsvp` },
                  { icon: Image, label: "Fotoalbum", href: `/dashboard/photos` },
                  { icon: MessageSquare, label: "Berichten", href: `/dashboard/messages` },
                  { icon: QrCode, label: "QR codes", href: `/dashboard/qr` },
                  { icon: Settings, label: "Instellingen", href: `/dashboard/settings` },
                ].map(({ icon: Icon, label, href }) => (
                  <Link key={href} href={href} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 18px", fontFamily: "sans-serif", fontSize: 14, color: "#5a5550", textDecoration: "none", borderBottom: "1px solid #ece8e4" }}>
                    <Icon size={15} style={{ color: "#8B2635" }} /> {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Hoofdcontent */}
            {selected && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Hero card */}
                <div style={{ background: "white", borderRadius: 20, border: "1px solid #ece8e4", overflow: "hidden" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 0 }}>
                    {template && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={template.img} alt={template.name} style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: 220 }} />
                    )}
                    <div style={{ padding: "28px 28px 24px" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999, background: selected.status === "published" ? "#f0fdf4" : selected.status === "paid" ? "#eff6ff" : "#fdf6f4", marginBottom: 16 }}>
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: selected.status === "published" ? "#16a34a" : selected.status === "paid" ? "#2563eb" : "#e0a000" }} />
                        <span style={{ fontFamily: "sans-serif", fontSize: 12, color: selected.status === "published" ? "#15803d" : selected.status === "paid" ? "#1d4ed8" : "#854d0e" }}>
                          {selected.status === "published" ? "Gepubliceerd" : selected.status === "paid" ? "Betaald — klaar om te publiceren" : "Concept"}
                        </span>
                      </div>
                      <h2 style={{ fontFamily: "serif", fontSize: 32, color: "#16161D", marginBottom: 4 }}>{namen}</h2>
                      {datum && <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#6b6560", marginBottom: 2 }}>{datum}</p>}
                      {selected.city && <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#9a8e88", marginBottom: 20 }}>{selected.city}</p>}
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <Link href="/dashboard/builder" style={{ display: "flex", alignItems: "center", gap: 6, background: "#8B2635", color: "white", borderRadius: 999, padding: "10px 18px", fontFamily: "sans-serif", fontSize: 13, textDecoration: "none" }}>
                          <Edit3 size={13} /> Bewerk
                        </Link>
                        <Link href={`/invite/${selected.slug}`} target="_blank" style={{ display: "flex", alignItems: "center", gap: 6, background: "white", border: "1.5px solid #e0dbd7", color: "#5a5550", borderRadius: 999, padding: "10px 18px", fontFamily: "sans-serif", fontSize: 13, textDecoration: "none" }}>
                          <Eye size={13} /> Voorbeeld
                        </Link>
                        {selected.status !== "published" && (
                          <Link href="/dashboard/billing" style={{ display: "flex", alignItems: "center", gap: 6, background: "#16161D", color: "white", borderRadius: 999, padding: "10px 18px", fontFamily: "sans-serif", fontSize: 13, textDecoration: "none" }}>
                            <Send size={13} /> {selected.status === "paid" ? "Publiceer nu" : "Koop & publiceer"}
                          </Link>
                        )}
                        {selected.status === "published" && (
                          <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/invite/${selected.slug}`); }} style={{ display: "flex", alignItems: "center", gap: 6, background: "white", border: "1.5px solid #e0dbd7", color: "#5a5550", borderRadius: 999, padding: "10px 18px", fontFamily: "sans-serif", fontSize: 13, cursor: "pointer" }}>
                            📋 Kopieer link
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
                  {[
                    { label: "Gasten", value: guests, icon: "👥", color: "#8B2635", href: "/dashboard/guests" },
                    { label: "RSVP", value: rsvps, icon: "✓", color: "#16a34a", href: "/dashboard/rsvp" },
                    { label: "Foto's", value: photos, icon: "📷", color: "#2563eb", href: "/dashboard/photos" },
                    { label: "Berichten", value: msgs, icon: "💌", color: "#7c3aed", href: "/dashboard/messages" },
                  ].map(({ label, value, icon, color, href }) => (
                    <Link key={label} href={href} style={{ background: "white", borderRadius: 16, border: "1px solid #ece8e4", padding: "20px", textAlign: "center", textDecoration: "none" }}>
                      <p style={{ fontSize: 24, marginBottom: 6 }}>{icon}</p>
                      <p style={{ fontFamily: "serif", fontSize: 32, color, fontWeight: 600, lineHeight: 1 }}>{value}</p>
                      <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", marginTop: 4 }}>{label}</p>
                    </Link>
                  ))}
                </div>

                {/* Recente notificaties */}
                {notifications.filter(n => !n.read).length > 0 && (
                  <div style={{ background: "white", borderRadius: 16, border: "1px solid #ece8e4", overflow: "hidden" }}>
                    <div style={{ padding: "16px 20px", borderBottom: "1px solid #ece8e4" }}>
                      <p style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 600, color: "#16161D" }}>Ongelezen notificaties</p>
                    </div>
                    {notifications.filter(n => !n.read).slice(0, 5).map(n => (
                      <div key={n.id} onClick={() => markRead(n.id)} style={{ padding: "14px 20px", borderBottom: "1px solid #ece8e4", cursor: "pointer", background: "#fdf6f4", display: "flex", alignItems: "flex-start", gap: 12 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#8B2635", flexShrink: 0, marginTop: 4 }} />
                        <div>
                          <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#16161D", fontWeight: 600 }}>{n.title}</p>
                          {n.message && <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", marginTop: 2 }}>{n.message}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Snelle acties */}
                <div style={{ background: "white", borderRadius: 16, border: "1px solid #ece8e4", padding: "20px 24px" }}>
                  <p style={{ fontFamily: "sans-serif", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9a8e88", marginBottom: 16 }}>Snelle acties</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                    {[
                      { label: "Gast toevoegen", href: "/dashboard/guests", icon: "👤" },
                      { label: "Preview bekijken", href: `/invite/${selected.slug}`, icon: "👀" },
                      { label: "QR downloaden", href: "/dashboard/qr", icon: "📱" },
                      { label: "RSVP bekijken", href: "/dashboard/rsvp", icon: "📋" },
                      { label: "Foto's bekijken", href: "/dashboard/photos", icon: "🖼️" },
                      { label: "Tafelindeling", href: "/dashboard/tables", icon: "🪑" },
                    ].map(({ label, href, icon }) => (
                      <Link key={label} href={href} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "16px 12px", background: "#f9f5f1", borderRadius: 12, textDecoration: "none", textAlign: "center" }}>
                        <span style={{ fontSize: 22 }}>{icon}</span>
                        <span style={{ fontFamily: "sans-serif", fontSize: 12, color: "#5a5550" }}>{label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
