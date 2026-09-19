"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getTemplate } from "@/lib/templates";
import { Copy, Check, Users, Mail, LogOut, Plus, Eye, Send, ExternalLink } from "lucide-react";

const TIKKIE_URL = "https://tikkie.me/pay/ch43q8tuu0jco3beatpf";

type Invitation = {
  id: string; template_slug: string; partner1_name: string; partner2_name: string;
  wedding_date: string; location_name: string; published: boolean; paid: boolean; created_at: string;
};
type Guest = {
  id: string; name: string; email: string; token: string; opened_at: string | null;
  rsvp: { attending: boolean; diet: string; message: string }[];
};

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [selectedInv, setSelectedInv] = useState<Invitation | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"uitnodiging" | "gasten" | "statistieken">("uitnodiging");
  const [copied, setCopied] = useState<string | null>(null);

  // Gast toevoegen
  const [newGuestName, setNewGuestName] = useState("");
  const [newGuestEmail, setNewGuestEmail] = useState("");
  const [addingGuest, setAddingGuest] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) { router.push("/login"); return; }
      setUser({ id: u.id, email: u.email ?? "" });

      const { data: invs } = await supabase
        .from("invitations").select("*").eq("user_id", u.id).order("created_at", { ascending: false });
      setInvitations(invs || []);
      if (invs && invs.length > 0) {
        setSelectedInv(invs[0]);
        loadGuests(invs[0].id, u.id);
      }
      setLoading(false);
    }
    load();
  }, [router]);

  const loadGuests = async (invId: string, userId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const res = await fetch(`/api/guests?invitation_id=${invId}`, {
      headers: { Authorization: `Bearer ${session.access_token}` }
    });
    const data = await res.json();
    setGuests(Array.isArray(data) ? data : []);
  };

  const addGuest = async () => {
    if (!newGuestName || !selectedInv) return;
    setAddingGuest(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await fetch("/api/guests", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ invitation_id: selectedInv.id, guests: [{ name: newGuestName, email: newGuestEmail }] })
    });
    setNewGuestName(""); setNewGuestEmail("");
    setAddingGuest(false);
    loadGuests(selectedInv.id, user!.id);
  };

  const publishInvitation = async () => {
    if (!selectedInv) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await fetch("/api/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ invitation_id: selectedInv.id })
    });
    const updated = { ...selectedInv, published: true, paid: true };
    setSelectedInv(updated);
    setInvitations(invs => invs.map(i => i.id === updated.id ? updated : i));
  };

  const copyLink = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#f9f5f1", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width: 36, height: 36, border: "2px solid #8B2635", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );

  const template = selectedInv ? getTemplate(selectedInv.template_slug) : null;
  const namen = selectedInv ? `${selectedInv.partner1_name} & ${selectedInv.partner2_name}` : "";
  const aanwezig = guests.filter(g => g.rsvp?.[0]?.attending).length;
  const afwezig = guests.filter(g => g.rsvp?.[0] && !g.rsvp[0].attending).length;
  const geopend = guests.filter(g => g.opened_at).length;

  return (
    <div style={{ minHeight: "100vh", background: "#f9f5f1" }}>
      {/* Header */}
      <header style={{ background: "white", borderBottom: "1px solid #ece8e4", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ fontFamily: "sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: "0.18em", color: "#8B2635", textDecoration: "none" }}>CASA NOMADA</Link>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontFamily: "sans-serif", fontSize: 13, color: "#9a8e88" }}>{user?.email}</span>
            <button onClick={logout} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "sans-serif", fontSize: 13, color: "#6b6560" }}>
              <LogOut size={14} /> Uitloggen
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>

        {/* Geen uitnodiging */}
        {invitations.length === 0 ? (
          <div style={{ textAlign: "center" as const, padding: "80px 24px" }}>
            <h2 style={{ fontFamily: "serif", fontSize: 28, color: "#16161D", marginBottom: 12 }}>Nog geen uitnodiging</h2>
            <p style={{ fontFamily: "sans-serif", fontSize: 15, color: "#6b6560", marginBottom: 28 }}>Maak je eerste digitale trouwkaart aan.</p>
            <Link href="/register" style={{ background: "#8B2635", color: "white", borderRadius: 999, padding: "14px 28px", fontFamily: "sans-serif", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
              Maak je uitnodiging
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 24, alignItems: "start" }}>

            {/* Sidebar */}
            <div>
              {/* Uitnodigingen */}
              <div style={{ background: "white", borderRadius: 16, border: "1px solid #ece8e4", overflow: "hidden", marginBottom: 16 }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #ece8e4" }}>
                  <p style={{ fontFamily: "sans-serif", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "#9a8e88" }}>Mijn uitnodigingen</p>
                </div>
                {invitations.map(inv => (
                  <div key={inv.id} onClick={() => { setSelectedInv(inv); loadGuests(inv.id, user!.id); }}
                    style={{ padding: "14px 20px", cursor: "pointer", background: selectedInv?.id === inv.id ? "#fdf6f4" : "white", borderBottom: "1px solid #ece8e4", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <p style={{ fontFamily: "serif", fontSize: 15, color: "#16161D" }}>{inv.partner1_name} & {inv.partner2_name}</p>
                      <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "#9a8e88", marginTop: 2 }}>{getTemplate(inv.template_slug)?.name}</p>
                    </div>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: inv.published ? "#16a34a" : "#e0dbd7" }} />
                  </div>
                ))}
                <Link href="/register" style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 20px", fontFamily: "sans-serif", fontSize: 13, color: "#8B2635", textDecoration: "none" }}>
                  <Plus size={14} /> Nieuwe uitnodiging
                </Link>
              </div>

              {/* Statistieken */}
              {selectedInv && (
                <div style={{ background: "white", borderRadius: 16, border: "1px solid #ece8e4", padding: "16px 20px" }}>
                  <p style={{ fontFamily: "sans-serif", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "#9a8e88", marginBottom: 14 }}>Overzicht</p>
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
                    {[
                      { label: "Gasten", value: guests.length, icon: "👥" },
                      { label: "Geopend", value: geopend, icon: "👁" },
                      { label: "Aanwezig", value: aanwezig, icon: "✓" },
                      { label: "Afwezig", value: afwezig, icon: "✗" },
                    ].map(({ label, value, icon }) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b6560" }}>{icon} {label}</span>
                        <span style={{ fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, color: "#16161D" }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Hoofdcontent */}
            {selectedInv && (
              <div>
                {/* Tabs */}
                <div style={{ display: "flex", gap: 0, background: "white", borderRadius: 12, border: "1px solid #ece8e4", padding: 4, marginBottom: 20 }}>
                  {(["uitnodiging", "gasten", "statistieken"] as const).map(t => (
                    <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", background: tab === t ? "#8B2635" : "transparent", color: tab === t ? "white" : "#6b6560", fontFamily: "sans-serif", fontSize: 13, cursor: "pointer", textTransform: "capitalize" as const }}>
                      {t}
                    </button>
                  ))}
                </div>

                {/* TAB: Uitnodiging */}
                {tab === "uitnodiging" && (
                  <div style={{ background: "white", borderRadius: 16, border: "1px solid #ece8e4", padding: "24px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
                      {/* Template preview */}
                      <div>
                        {template && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={template.img} alt={template.name} style={{ width: "100%", borderRadius: 12, display: "block" }} />
                        )}
                      </div>
                      {/* Info */}
                      <div>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999, background: selectedInv.published ? "#f0fdf4" : "#fdf6f4", marginBottom: 16 }}>
                          <div style={{ width: 7, height: 7, borderRadius: "50%", background: selectedInv.published ? "#16a34a" : "#e0a000" }} />
                          <span style={{ fontFamily: "sans-serif", fontSize: 12, color: selectedInv.published ? "#15803d" : "#854d0e" }}>
                            {selectedInv.published ? "Gepubliceerd" : "Concept"}
                          </span>
                        </div>
                        <h2 style={{ fontFamily: "serif", fontSize: 24, color: "#16161D", marginBottom: 6 }}>{namen}</h2>
                        <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b6560", marginBottom: 20 }}>{template?.name}</p>

                        <div style={{ display: "flex", flexDirection: "column" as const, gap: 8, marginBottom: 24 }}>
                          <Link href={`/editor/${selectedInv.template_slug}`} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "sans-serif", fontSize: 13, color: "#8B2635", textDecoration: "none" }}>
                            <Eye size={14} /> Bewerk uitnodiging
                          </Link>
                          {selectedInv.published && (
                            <Link href={`/invitation/${selectedInv.id}`} target="_blank" style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "sans-serif", fontSize: 13, color: "#8B2635", textDecoration: "none" }}>
                              <ExternalLink size={14} /> Bekijk live uitnodiging
                            </Link>
                          )}
                        </div>

                        {/* Publiceren */}
                        {!selectedInv.published ? (
                          <div style={{ border: "1.5px solid #e0dbd7", borderRadius: 14, padding: "20px" }}>
                            <h4 style={{ fontFamily: "serif", fontSize: 16, color: "#16161D", marginBottom: 8 }}>Publiceer jullie uitnodiging</h4>
                            <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b6560", marginBottom: 16, lineHeight: 1.5 }}>Betaal eenmalig €89 via Tikkie en publiceer daarna direct.</p>
                            <a href={TIKKIE_URL} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#009DE0", color: "white", borderRadius: 12, padding: "13px", fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, textDecoration: "none", marginBottom: 10 }}>
                              💳 Betaal via Tikkie — €89
                            </a>
                            <button onClick={publishInvitation} style={{ width: "100%", background: "#16161D", color: "white", border: "none", borderRadius: 12, padding: "13px", fontFamily: "sans-serif", fontSize: 14, cursor: "pointer" }}>
                              ✓ Betaald — Publiceer nu
                            </button>
                          </div>
                        ) : (
                          <div>
                            {/* Deel de uitnodiging */}
                            <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", marginBottom: 8 }}>Algemene link (voor alle gasten):</p>
                            <div style={{ display: "flex", gap: 8, background: "#f5f0ed", borderRadius: 10, padding: "10px 14px", alignItems: "center", marginBottom: 16 }}>
                              <span style={{ fontFamily: "sans-serif", fontSize: 12, color: "#5a5550", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
                                {baseUrl}/invitation/{selectedInv.id}
                              </span>
                              <button onClick={() => copyLink(`${baseUrl}/invitation/${selectedInv.id}`, "inv")} style={{ background: "#8B2635", color: "white", border: "none", borderRadius: 6, padding: "5px 10px", fontFamily: "sans-serif", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                                {copied === "inv" ? <Check size={11} /> : <Copy size={11} />} {copied === "inv" ? "Gekopieerd" : "Kopieer"}
                              </button>
                            </div>
                            <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#6b6560" }}>
                              💡 Voeg gasten toe voor unieke links per persoon →
                              <button onClick={() => setTab("gasten")} style={{ background: "none", border: "none", color: "#8B2635", cursor: "pointer", fontFamily: "sans-serif", fontSize: 12, marginLeft: 4 }}>Gasten beheren</button>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: Gasten */}
                {tab === "gasten" && (
                  <div>
                    {/* Gast toevoegen */}
                    <div style={{ background: "white", borderRadius: 16, border: "1px solid #ece8e4", padding: "20px", marginBottom: 16 }}>
                      <h3 style={{ fontFamily: "serif", fontSize: 18, color: "#16161D", marginBottom: 16 }}>Gast toevoegen</h3>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 10 }}>
                        <input value={newGuestName} onChange={e => setNewGuestName(e.target.value)} placeholder="Naam" onKeyDown={e => e.key === "Enter" && addGuest()} style={{ border: "1.5px solid #e0dbd7", borderRadius: 10, padding: "10px 14px", fontFamily: "sans-serif", fontSize: 14, outline: "none" }} />
                        <input value={newGuestEmail} onChange={e => setNewGuestEmail(e.target.value)} placeholder="E-mail (optioneel)" style={{ border: "1.5px solid #e0dbd7", borderRadius: 10, padding: "10px 14px", fontFamily: "sans-serif", fontSize: 14, outline: "none" }} />
                        <button onClick={addGuest} disabled={!newGuestName || addingGuest} style={{ background: "#8B2635", color: "white", border: "none", borderRadius: 10, padding: "10px 16px", fontFamily: "sans-serif", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" as const }}>
                          <Plus size={14} /> Voeg toe
                        </button>
                      </div>
                    </div>

                    {/* Gastenlijst */}
                    <div style={{ background: "white", borderRadius: 16, border: "1px solid #ece8e4", overflow: "hidden" }}>
                      {guests.length === 0 ? (
                        <div style={{ padding: "40px", textAlign: "center" as const }}>
                          <Users size={32} style={{ color: "#e0dbd7", margin: "0 auto 12px" }} />
                          <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#9a8e88" }}>Nog geen gasten. Voeg gasten toe voor unieke links.</p>
                        </div>
                      ) : (
                        <table style={{ width: "100%", borderCollapse: "collapse" as const }}>
                          <thead>
                            <tr style={{ borderBottom: "1px solid #ece8e4" }}>
                              {["Naam", "Status", "RSVP", "Unieke link", ""].map(h => (
                                <th key={h} style={{ padding: "12px 16px", textAlign: "left" as const, fontFamily: "sans-serif", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#9a8e88", fontWeight: 500 }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {guests.map((g, i) => {
                              const rsvp = g.rsvp?.[0];
                              const link = `${baseUrl}/i/${g.token}`;
                              return (
                                <tr key={g.id} style={{ borderBottom: i < guests.length - 1 ? "1px solid #ece8e4" : "none" }}>
                                  <td style={{ padding: "14px 16px", fontFamily: "sans-serif", fontSize: 14, color: "#16161D" }}>{g.name}</td>
                                  <td style={{ padding: "14px 16px" }}>
                                    <span style={{ fontFamily: "sans-serif", fontSize: 12, color: g.opened_at ? "#15803d" : "#9a8e88", background: g.opened_at ? "#f0fdf4" : "#f5f0ed", padding: "3px 8px", borderRadius: 999 }}>
                                      {g.opened_at ? "Geopend" : "Nog niet geopend"}
                                    </span>
                                  </td>
                                  <td style={{ padding: "14px 16px" }}>
                                    {rsvp ? (
                                      <span style={{ fontFamily: "sans-serif", fontSize: 12, color: rsvp.attending ? "#15803d" : "#dc2626", background: rsvp.attending ? "#f0fdf4" : "#fef2f2", padding: "3px 8px", borderRadius: 999 }}>
                                        {rsvp.attending ? "✓ Aanwezig" : "✗ Afwezig"}
                                      </span>
                                    ) : (
                                      <span style={{ fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88" }}>—</span>
                                    )}
                                  </td>
                                  <td style={{ padding: "14px 16px" }}>
                                    <span style={{ fontFamily: "sans-serif", fontSize: 11, color: "#9a8e88", fontFamily: "monospace" as const }}>/i/{g.token}</span>
                                  </td>
                                  <td style={{ padding: "14px 16px" }}>
                                    <button onClick={() => copyLink(link, g.id)} style={{ background: "none", border: "1px solid #e0dbd7", borderRadius: 6, padding: "5px 10px", fontFamily: "sans-serif", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "#5a5550" }}>
                                      {copied === g.id ? <Check size={11} style={{ color: "#16a34a" }} /> : <Copy size={11} />}
                                      {copied === g.id ? "Gekopieerd!" : "Kopieer link"}
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB: Statistieken */}
                {tab === "statistieken" && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
                    {[
                      { label: "Totaal gasten", value: guests.length, color: "#8B2635", icon: "👥" },
                      { label: "Geopend", value: geopend, color: "#2563eb", icon: "👁" },
                      { label: "Aanwezig", value: aanwezig, color: "#16a34a", icon: "✓" },
                      { label: "Afwezig", value: afwezig, color: "#dc2626", icon: "✗" },
                      { label: "Wacht op reactie", value: guests.length - aanwezig - afwezig, color: "#e0a000", icon: "⏳" },
                      { label: "Respons %", value: guests.length > 0 ? Math.round(((aanwezig + afwezig) / guests.length) * 100) + "%" : "—", color: "#8B2635", icon: "%" },
                    ].map(({ label, value, color, icon }) => (
                      <div key={label} style={{ background: "white", borderRadius: 16, border: "1px solid #ece8e4", padding: "24px", textAlign: "center" as const }}>
                        <p style={{ fontSize: 28, marginBottom: 6 }}>{icon}</p>
                        <p style={{ fontFamily: "serif", fontSize: 36, color, fontWeight: 600, lineHeight: 1 }}>{value}</p>
                        <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#9a8e88", marginTop: 6 }}>{label}</p>
                      </div>
                    ))}
                    {/* RSVP berichten */}
                    {guests.some(g => g.rsvp?.[0]?.message) && (
                      <div style={{ gridColumn: "span 2", background: "white", borderRadius: 16, border: "1px solid #ece8e4", padding: "20px" }}>
                        <h4 style={{ fontFamily: "serif", fontSize: 18, color: "#16161D", marginBottom: 16 }}>Berichten van gasten</h4>
                        <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
                          {guests.filter(g => g.rsvp?.[0]?.message).map(g => (
                            <div key={g.id} style={{ background: "#fdf6f4", borderRadius: 10, padding: "12px 16px" }}>
                              <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#8B2635", marginBottom: 4, fontWeight: 600 }}>{g.name}</p>
                              <p style={{ fontFamily: "serif", fontSize: 14, fontStyle: "italic", color: "#5a5550" }}>"{g.rsvp[0].message}"</p>
                              {g.rsvp[0].diet && <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", marginTop: 4 }}>Dieet: {g.rsvp[0].diet}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
