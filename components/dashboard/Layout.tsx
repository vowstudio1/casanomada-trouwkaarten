"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  LayoutDashboard, Edit3, Palette, Calendar, Image, Music, ClipboardList,
  Users, CheckSquare, BookOpen, MessageSquare, Grid3X3, MapPin, QrCode,
  CreditCard, Settings, LogOut, ChevronRight, Bell, Menu, X
} from "lucide-react";

const NAV = [
  { section: "WEBSITE", items: [
    { href: "/", label: "Naar website", icon: LayoutDashboard, external: true },
  ]},
  { section: "APP", items: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ]},
  { section: "MIJN BRUILOFT", items: [
    { href: "/dashboard/builder", label: "Builder", icon: Edit3 },
    { href: "/dashboard/design", label: "Design", icon: Palette },
    { href: "/dashboard/programma", label: "Programma", icon: Calendar },
    { href: "/dashboard/fotoalbum", label: "Foto's", icon: Image },
    { href: "/dashboard/muziek", label: "Muziek", icon: Music },
    { href: "/dashboard/rsvp", label: "RSVP", icon: ClipboardList },
  ]},
  { section: "GASTEN & DATA", items: [
    { href: "/dashboard/guests", label: "Gasten", icon: Users },
    { href: "/dashboard/rsvp", label: "RSVP overzicht", icon: CheckSquare },
    { href: "/dashboard/fotoalbum", label: "Fotoalbum", icon: BookOpen },
    { href: "/dashboard/berichten", label: "Berichten", icon: MessageSquare },
    { href: "/dashboard/tables", label: "Tafels", icon: Grid3X3 },
    { href: "/dashboard/destination", label: "Destination", icon: MapPin },
    { href: "/dashboard/qr", label: "QR codes", icon: QrCode },
  ]},
  { section: "ACCOUNT", items: [
    { href: "/dashboard/billing", label: "Betaling", icon: CreditCard },
    { href: "/dashboard/settings", label: "Instellingen", icon: Settings },
  ]},
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<{ email: string; first_name?: string } | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return;
      const { data: profile } = await supabase.from("profiles").select("first_name, email").eq("id", session.user.id).single();
      setUser({ email: session.user.email || "", first_name: profile?.first_name });
      const { count } = await supabase.from("notifications").select("*", { count: "exact", head: true }).eq("user_id", session.user.id).eq("read", false);
      setNotifications(count || 0);
    });
  }, []);

  const logout = async () => { await supabase.auth.signOut(); window.location.href = "/"; };

  const Sidebar = () => (
    <div style={{ width: 240, background: "white", borderRight: "1px solid #ece8e4", height: "100vh", display: "flex", flexDirection: "column", overflowY: "auto", flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #ece8e4" }}>
        <Link href="/" style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.2em", color: "#8B2635", textDecoration: "none" }}>CASA NOMADA</Link>
        {user?.first_name && <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", marginTop: 4 }}>Hoi, {user.first_name}</p>}
      </div>

      {/* Navigatie */}
      <nav style={{ flex: 1, padding: "12px 0" }}>
        {NAV.map(({ section, items }) => (
          <div key={section} style={{ marginBottom: 8 }}>
            <p style={{ fontFamily: "sans-serif", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#c0b8b4", padding: "6px 20px 4px" }}>{section}</p>
            {items.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 20px", fontFamily: "sans-serif", fontSize: 13, color: active ? "#8B2635" : "#5a5550", textDecoration: "none", background: active ? "#fdf6f4" : "transparent", borderRight: active ? "2px solid #8B2635" : "2px solid transparent", transition: "all 0.15s" }}>
                  <Icon size={15} style={{ color: active ? "#8B2635" : "#9a8e88" }} />
                  {label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: "16px 20px", borderTop: "1px solid #ece8e4" }}>
        <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "#9a8e88", marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email}</p>
        <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <LogOut size={13} /> Uitloggen
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f9f5f1" }}>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex" style={{ display: "flex" }}>
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex" }}>
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)" }} onClick={() => setMobileOpen(false)} />
          <div style={{ position: "relative", zIndex: 201 }}><Sidebar /></div>
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Mobile header */}
        <div style={{ background: "white", borderBottom: "1px solid #ece8e4", padding: "0 16px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: "none", border: "none", cursor: "pointer" }}>
            {mobileOpen ? <X size={20} style={{ color: "#5a5550" }} /> : <Menu size={20} style={{ color: "#5a5550" }} />}
          </button>
          <Link href="/" style={{ fontFamily: "sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", color: "#8B2635", textDecoration: "none" }}>CASA NOMADA</Link>
          <Link href="/dashboard" style={{ position: "relative" }}>
            <Bell size={18} style={{ color: "#5a5550" }} />
            {notifications > 0 && <div style={{ position: "absolute", top: -4, right: -4, width: 14, height: 14, borderRadius: "50%", background: "#8B2635", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 8, color: "white", fontWeight: 700 }}>{notifications}</span></div>}
          </Link>
        </div>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
