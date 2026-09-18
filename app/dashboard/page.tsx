"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users, Share2, Eye, Heart, Check, LogOut,
  Copy, Mail, LayoutGrid, Calendar, MapPin, ExternalLink,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Invitation {
  id: string;
  partner1: string;
  partner2: string;
  wedding_date: string;
  location: string;
  template: string;
  template_img: string;
  published: boolean;
  share_url: string;
}

interface RSVPStats {
  total: number;
  confirmed: number;
  declined: number;
  pending: number;
}

interface Guest {
  id: string;
  name: string;
  attending: boolean | null;
  guest_count: number;
  dietary: string[];
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [stats, setStats] = useState<RSVPStats>({ total: 0, confirmed: 0, declined: 0, pending: 0 });
  const [guests, setGuests] = useState<Guest[]>([]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "guests">("overview");

  useEffect(() => {
    async function init() {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.push("/login");
        return;
      }
      setUserEmail(data.user.email || "");
      const meta = data.user.user_metadata || {};
      const name = meta.partner1
        ? `${meta.partner1} & ${meta.partner2}`
        : data.user.email?.split("@")[0] || "Gebruiker";
      setUserName(name);

      // Build invitation preview from user metadata
      if (meta.partner1) {
        const templateImgMap: Record<string, string> = {
          "bloom": "bloom-en-vetrina-96e6b193",
          "volta-celeste": "volta-celeste-en-vetrina-63b82e9f",
          "zomertuin": "giardino-destate-en-vetrina-e4c79ec8",
          "villa-aurora": "villa-aurora-en-vetrina-50b36ee0",
          "het-zwanenmeer": "lago-dei-cigni-en-vetrina-6e0256ed",
          "villa-cortina": "villa-cortina-en-vetrina-553a7717",
          "minimale-couture": "couture-minimale-en-vetrina-93e7c6cd",
          "betoverd-bos": "incanto-nel-bosco-en-vetrina-6c056d35",
          "riviera-70": "riviera-70-en-vetrina-253c0193",
          "italiaanse-aquarel": "acquerello-italia-en-vetrina-3869b8cc",
          "oro-antico": "oro-antico-en-vetrina-22d36ceb",
          "tuscany-chic": "tuscany-chic-en-vetrina-3646f639",
          "gouden-uur": "tipografico-moderno-en-vetrina-2c921489",
          "de-geheime-tuin": "giardino-segreto-en-vetrina-c0e0298d",
          "tratto-d-inchiostro": "tratto-inchiostro-en-vetrina-48f6d0e0",
          "idillio": "idillio-en-vetrina-4806113a",
          "romantisch-botanisch": "botanico-romantico-en-vetrina-5a476f93",
          "strawberry-matcha": "strawberry-matcha-en-vetrina-4c490953",
          "toile-de-jouy": "toile-bleu-en-vetrina-a0fc5d6a",
        };
        const slug = meta.template || "bloom";
        const imgKey = templateImgMap[slug] || "bloom-en-vetrina-96e6b193";
        setInvitation({
          id: data.user.id,
          partner1: meta.partner1,
          partner2: meta.partner2,
          wedding_date: meta.wedding_date || "",
          location: meta.location || "",
          template: slug,
          template_img: `https://sponsalia.app/_next/image?url=%2Fassets%2Fmarketing%2Ftemplates%2F${imgKey}.jpg&w=800&q=75`,
          published: false,
          share_url: `${typeof window !== "undefined" ? window.location.origin : ""}/invitation/${data.user.id}`,
        });
      }

      // Fetch RSVP responses
      try {
        const { data: rsvpData } = await supabase
          .from("rsvp_responses")
          .select("*")
          .eq("invitation_id", data.user.id);

        if (rsvpData) {
          const confirmed = rsvpData.filter((r: { attending: boolean }) => r.attending === true).length;
          const declined = rsvpData.filter((r: { attending: boolean }) => r.attending === false).length;
          setStats({
            total: rsvpData.length,
            confirmed,
            declined,
            pending: 0,
          });
          setGuests(
            rsvpData.map((r: {
              id: string;
              guest_names: string;
              attending: boolean;
              guest_count: number;
              dietary: string[];
              created_at: string;
            }) => ({
              id: r.id,
              name: r.guest_names || "Anoniem",
              attending: r.attending,
              guest_count: r.guest_count || 1,
              dietary: r.dietary || [],
              created_at: r.created_at,
            }))
          );
        }
      } catch {
        // RSVP table may not exist yet; silently ignore
      }

      setLoading(false);
    }
    init();
  }, [router]);

  async function handleLogout() {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/login");
  }

  function copyShareUrl() {
    if (!invitation) return;
    navigator.clipboard.writeText(invitation.share_url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function formatDate(dateStr: string) {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("nl-NL", {
        day: "numeric", month: "long", year: "numeric",
      });
    } catch {
      return dateStr;
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f9f5f1", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "2.5rem", height: "2.5rem", border: "3px solid #F0D0D4", borderTopColor: "#8B2635", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 1rem" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.125rem", color: "#8B2635" }}>Laden…</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Uitgenodigd", value: stats.total || "—", icon: <Users size={18} />, color: "#1E3A5F" },
    { label: "Bevestigd", value: stats.confirmed || "—", icon: <Check size={18} />, color: "#166534" },
    { label: "Afgemeld", value: stats.declined || "—", icon: <Heart size={18} />, color: "#8B2635" },
    { label: "Gasten", value: guests.reduce((s, g) => s + (g.guest_count || 0), 0) || "—", icon: <Users size={18} />, color: "#6B2D8B" },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9f5f1" }}>
      {/* Top bar */}
      <header style={{ backgroundColor: "#FFFFFF", borderBottom: "1px solid #E8E6E3", position: "sticky", top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.5rem", height: "4rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.0625rem", fontWeight: 600, letterSpacing: "0.2em", color: "#16161D", textDecoration: "none" }}>
            CASA NOMADA
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "0.8125rem", color: "#6B6B76", fontFamily: "system-ui, sans-serif" }} className="hidden sm:inline">
              {userEmail}
            </span>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.5rem 0.875rem", backgroundColor: "transparent", color: "#6B6B76", border: "1px solid #E8E6E3", borderRadius: "9999px", fontSize: "0.8125rem", cursor: "pointer", fontFamily: "system-ui, sans-serif" }}
            >
              <LogOut size={14} />
              {loggingOut ? "Uitloggen…" : "Uitloggen"}
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "2.5rem 1.5rem 4rem" }}>

        {/* Welcome */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 600, color: "#16161D", marginBottom: "0.25rem" }}>
            Hallo, {userName} 👋
          </h1>
          <p style={{ fontSize: "0.9375rem", color: "#6B6B76", fontFamily: "system-ui, sans-serif" }}>
            Hier beheer je jullie bruiloftsuitnodiging.
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0", marginBottom: "2rem", borderBottom: "1px solid #E8E6E3" }}>
          {(["overview", "guests"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "0.75rem 1.25rem",
                fontSize: "0.875rem",
                fontFamily: "system-ui, sans-serif",
                fontWeight: activeTab === tab ? 600 : 400,
                color: activeTab === tab ? "#8B2635" : "#6B6B76",
                background: "none",
                border: "none",
                borderBottom: activeTab === tab ? "2px solid #8B2635" : "2px solid transparent",
                cursor: "pointer",
                marginBottom: "-1px",
                transition: "color 0.15s",
              }}
            >
              {tab === "overview" ? "Overzicht" : `Gasten (${stats.confirmed + stats.declined})`}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }} className="lg:grid-cols-3">

            {/* Invitation preview */}
            <div style={{ gridColumn: "span 1" }} className="lg:col-span-1">
              <div style={{ backgroundColor: "#FFFFFF", borderRadius: "1rem", border: "1px solid #E8E6E3", overflow: "hidden" }}>
                {invitation ? (
                  <>
                    <div style={{ aspectRatio: "3/4", overflow: "hidden", backgroundColor: "#F5EDE8" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={invitation.template_img} alt="Uitnodiging preview" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                    </div>
                    <div style={{ padding: "1.25rem" }}>
                      <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.25rem", fontWeight: 600, color: "#16161D", marginBottom: "0.75rem" }}>
                        {invitation.partner1} & {invitation.partner2}
                      </h2>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.25rem" }}>
                        {invitation.wedding_date && (
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", color: "#6B6B76", fontFamily: "system-ui, sans-serif" }}>
                            <Calendar size={13} style={{ color: "#8B2635", flexShrink: 0 }} />
                            {formatDate(invitation.wedding_date)}
                          </div>
                        )}
                        {invitation.location && (
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", color: "#6B6B76", fontFamily: "system-ui, sans-serif" }}>
                            <MapPin size={13} style={{ color: "#8B2635", flexShrink: 0 }} />
                            {invitation.location}
                          </div>
                        )}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", color: "#6B6B76", fontFamily: "system-ui, sans-serif" }}>
                          <LayoutGrid size={13} style={{ color: "#8B2635", flexShrink: 0 }} />
                          Sjabloon: {invitation.template}
                        </div>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                        <Link
                          href={`/invitation/${invitation.id}`}
                          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.6875rem", backgroundColor: "#8B2635", color: "#FFFFFF", borderRadius: "9999px", textDecoration: "none", fontSize: "0.8125rem", fontWeight: 600, fontFamily: "system-ui, sans-serif" }}
                        >
                          <Eye size={14} /> Uitnodiging bekijken
                        </Link>
                        <button
                          onClick={copyShareUrl}
                          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.6875rem", backgroundColor: "transparent", color: copied ? "#166534" : "#16161D", border: `1px solid ${copied ? "#BBF7D0" : "#E8E6E3"}`, borderRadius: "9999px", fontSize: "0.8125rem", cursor: "pointer", fontFamily: "system-ui, sans-serif", transition: "all 0.15s" }}
                        >
                          {copied ? <Check size={14} /> : <Copy size={14} />}
                          {copied ? "Gekopieerd!" : "Deel-link kopiëren"}
                        </button>
                        <button
                          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.6875rem", backgroundColor: "transparent", color: "#6B6B76", border: "1px solid #E8E6E3", borderRadius: "9999px", fontSize: "0.8125rem", cursor: "pointer", fontFamily: "system-ui, sans-serif" }}
                        >
                          <Share2 size={14} /> Delen via WhatsApp
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ padding: "3rem 1.5rem", textAlign: "center" }}>
                    <Mail size={32} style={{ color: "#D1BDB0", margin: "0 auto 1rem" }} />
                    <p style={{ fontSize: "0.9375rem", color: "#6B6B76", fontFamily: "system-ui, sans-serif", marginBottom: "1.25rem" }}>
                      Je hebt nog geen uitnodiging aangemaakt.
                    </p>
                    <Link href="/register" style={{ display: "inline-block", padding: "0.75rem 1.5rem", backgroundColor: "#8B2635", color: "#FFFFFF", borderRadius: "9999px", textDecoration: "none", fontSize: "0.875rem", fontWeight: 600, fontFamily: "system-ui, sans-serif" }}>
                      Maak je uitnodiging
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Stats + actions */}
            <div style={{ gridColumn: "span 1", display: "flex", flexDirection: "column", gap: "1.5rem" }} className="lg:col-span-2">

              {/* Stat cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
                {statCards.map((card) => (
                  <div key={card.label} style={{ backgroundColor: "#FFFFFF", borderRadius: "0.875rem", border: "1px solid #E8E6E3", padding: "1.25rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                      <span style={{ fontSize: "0.8125rem", color: "#6B6B76", fontFamily: "system-ui, sans-serif" }}>{card.label}</span>
                      <span style={{ color: card.color, opacity: 0.7 }}>{card.icon}</span>
                    </div>
                    <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "2rem", fontWeight: 600, color: "#16161D", lineHeight: 1 }}>
                      {card.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div style={{ backgroundColor: "#FFFFFF", borderRadius: "1rem", border: "1px solid #E8E6E3", padding: "1.5rem" }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.25rem", fontWeight: 600, color: "#16161D", marginBottom: "1.25rem" }}>
                  Acties
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {[
                    { icon: <Eye size={16} />, label: "Bekijk je uitnodiging", sub: "Zie hoe gasten hem ervaren", href: invitation ? `/invitation/${invitation.id}` : "#", primary: true },
                    { icon: <Mail size={16} />, label: "Uitnodigingen versturen", sub: "Deel de link via WhatsApp of e-mail", href: "#", primary: false },
                    { icon: <Users size={16} />, label: "Gastenlijst exporteren", sub: "Download als CSV voor de cateraar", href: "#", primary: false },
                    { icon: <ExternalLink size={16} />, label: "Sjabloon wijzigen", sub: "Kies een ander ontwerp", href: "/templates", primary: false },
                  ].map((action) => (
                    <Link
                      key={action.label}
                      href={action.href}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.875rem",
                        padding: "0.875rem 1rem",
                        backgroundColor: action.primary ? "#FDF6F7" : "#F9F8F7",
                        borderRadius: "0.75rem",
                        border: `1px solid ${action.primary ? "#F0D0D4" : "#E8E6E3"}`,
                        textDecoration: "none",
                        transition: "background-color 0.15s",
                      }}
                    >
                      <span style={{ color: action.primary ? "#8B2635" : "#6B6B76", flexShrink: 0 }}>{action.icon}</span>
                      <div>
                        <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "#16161D", fontFamily: "system-ui, sans-serif" }}>{action.label}</p>
                        <p style={{ fontSize: "0.75rem", color: "#9CA3AF", fontFamily: "system-ui, sans-serif" }}>{action.sub}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "guests" && (
          <div>
            {guests.length === 0 ? (
              <div style={{ backgroundColor: "#FFFFFF", borderRadius: "1rem", border: "1px solid #E8E6E3", padding: "4rem 2rem", textAlign: "center" }}>
                <Users size={40} style={{ color: "#D1BDB0", margin: "0 auto 1rem" }} />
                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.375rem", fontWeight: 600, color: "#16161D", marginBottom: "0.5rem" }}>
                  Nog geen reacties
                </h3>
                <p style={{ fontSize: "0.9375rem", color: "#6B6B76", fontFamily: "system-ui, sans-serif", marginBottom: "1.5rem" }}>
                  Zodra gasten jullie uitnodiging bevestigen of afmelden, verschijnen ze hier.
                </p>
                {invitation && (
                  <button onClick={copyShareUrl} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", backgroundColor: "#8B2635", color: "#FFFFFF", border: "none", borderRadius: "9999px", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", fontFamily: "system-ui, sans-serif" }}>
                    <Copy size={15} /> Deel de uitnodiging
                  </button>
                )}
              </div>
            ) : (
              <div style={{ backgroundColor: "#FFFFFF", borderRadius: "1rem", border: "1px solid #E8E6E3", overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#F9F8F7", borderBottom: "1px solid #E8E6E3" }}>
                        {["Naam", "Status", "Gasten", "Dieet", "Ontvangen"].map((h) => (
                          <th key={h} style={{ padding: "0.875rem 1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 600, color: "#6B6B76", fontFamily: "system-ui, sans-serif", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {guests.map((g) => (
                        <tr key={g.id} style={{ borderBottom: "1px solid #F3F1EF" }}>
                          <td style={{ padding: "0.875rem 1rem", fontSize: "0.875rem", fontWeight: 500, color: "#16161D", fontFamily: "system-ui, sans-serif" }}>
                            {g.name}
                          </td>
                          <td style={{ padding: "0.875rem 1rem" }}>
                            <span style={{
                              display: "inline-flex", alignItems: "center", gap: "0.25rem",
                              padding: "0.25rem 0.625rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 500, fontFamily: "system-ui, sans-serif",
                              backgroundColor: g.attending === true ? "#DCFCE7" : g.attending === false ? "#FEF2F2" : "#F3F4F6",
                              color: g.attending === true ? "#166534" : g.attending === false ? "#991B1B" : "#6B7280",
                            }}>
                              {g.attending === true ? "✓ Bevestigd" : g.attending === false ? "✗ Afgemeld" : "In afwachting"}
                            </span>
                          </td>
                          <td style={{ padding: "0.875rem 1rem", fontSize: "0.875rem", color: "#6B6B76", fontFamily: "system-ui, sans-serif" }}>
                            {g.guest_count}
                          </td>
                          <td style={{ padding: "0.875rem 1rem", fontSize: "0.8125rem", color: "#6B6B76", fontFamily: "system-ui, sans-serif" }}>
                            {g.dietary?.length ? g.dietary.join(", ") : "—"}
                          </td>
                          <td style={{ padding: "0.875rem 1rem", fontSize: "0.8125rem", color: "#9CA3AF", fontFamily: "system-ui, sans-serif" }}>
                            {new Date(g.created_at).toLocaleDateString("nl-NL")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
