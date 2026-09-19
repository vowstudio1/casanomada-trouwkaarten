"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/Layout";
import { User, Lock, Bell, Trash2, Save, Check, Eye, EyeOff } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [session, setSession] = useState<string | null>(null);
  const [profile, setProfile] = useState({ first_name: "", last_name: "", email: "" });
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [savedProfile, setSavedProfile] = useState(false);
  const [savedPw, setSavedPw] = useState(false);
  const [pwError, setPwError] = useState("");
  const [activeTab, setActiveTab] = useState("profiel");
  const [notifications, setNotifications] = useState({ rsvp: true, photos: true, messages: true, weekly: false });

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      if (!s) { router.push("/login"); return; }
      setSession(s.access_token);
      setProfile(prev => ({ ...prev, email: s.user.email || "" }));
      const { data: p } = await supabase.from("profiles").select("first_name, last_name").eq("id", s.user.id).single();
      if (p) setProfile(prev => ({ ...prev, first_name: p.first_name || "", last_name: p.last_name || "" }));
    });
  }, [router]);

  const saveProfile = async () => {
    const { data: { session: s } } = await supabase.auth.getSession();
    if (!s) return;
    await supabase.from("profiles").update({ first_name: profile.first_name, last_name: profile.last_name }).eq("id", s.user.id);
    setSavedProfile(true);
    setTimeout(() => setSavedProfile(false), 2000);
  };

  const savePassword = async () => {
    setPwError("");
    if (passwords.new !== passwords.confirm) { setPwError("Wachtwoorden komen niet overeen"); return; }
    if (passwords.new.length < 6) { setPwError("Minimaal 6 tekens"); return; }
    const { error } = await supabase.auth.updateUser({ password: passwords.new });
    if (error) { setPwError(error.message); return; }
    setPasswords({ current: "", new: "", confirm: "" });
    setSavedPw(true);
    setTimeout(() => setSavedPw(false), 2000);
  };

  const deleteAccount = async () => {
    if (!confirm("Weet je zeker dat je je account wilt verwijderen? Dit kan niet ongedaan worden gemaakt.")) return;
    if (!confirm("Alle bruiloftdata, gasten en foto's worden permanent verwijderd. Doorgaan?")) return;
    await supabase.auth.signOut();
    router.push("/");
  };

  const inputStyle: React.CSSProperties = { border: "1.5px solid #e0dbd7", borderRadius: 10, padding: "11px 14px", fontFamily: "sans-serif", fontSize: 14, color: "#16161D", outline: "none", background: "white", width: "100%", boxSizing: "border-box" };
  const tabs = [{ id: "profiel", label: "Profiel", icon: User }, { id: "beveiliging", label: "Beveiliging", icon: Lock }, { id: "notificaties", label: "Notificaties", icon: Bell }];

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 24px" }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "serif", fontSize: 28, color: "#16161D", marginBottom: 4 }}>Instellingen</h1>
          <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#9a8e88" }}>Beheer je account en voorkeuren</p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, background: "white", borderRadius: 12, border: "1px solid #ece8e4", padding: 4, marginBottom: 24, width: "fit-content" }}>
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 8, border: "none", background: activeTab === id ? "#8B2635" : "transparent", color: activeTab === id ? "white" : "#6b6560", fontFamily: "sans-serif", fontSize: 13, cursor: "pointer" }}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {activeTab === "profiel" && (
          <div style={{ background: "white", borderRadius: 16, border: "1px solid #ece8e4", padding: 24 }}>
            <h2 style={{ fontFamily: "serif", fontSize: 20, color: "#16161D", marginBottom: 20 }}>Persoonlijke gegevens</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ fontFamily: "sans-serif", fontSize: 11, color: "#9a8e88", display: "block", marginBottom: 5 }}>Voornaam</label>
                <input value={profile.first_name} onChange={e => setProfile(p => ({ ...p, first_name: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontFamily: "sans-serif", fontSize: 11, color: "#9a8e88", display: "block", marginBottom: 5 }}>Achternaam</label>
                <input value={profile.last_name} onChange={e => setProfile(p => ({ ...p, last_name: e.target.value }))} style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontFamily: "sans-serif", fontSize: 11, color: "#9a8e88", display: "block", marginBottom: 5 }}>E-mailadres</label>
              <input value={profile.email} disabled style={{ ...inputStyle, background: "#f9f5f1", color: "#9a8e88" }} />
              <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "#c0b8b4", marginTop: 4 }}>E-mailadres kan niet worden gewijzigd</p>
            </div>
            <button onClick={saveProfile} style={{ display: "flex", alignItems: "center", gap: 6, background: "#8B2635", color: "white", border: "none", borderRadius: 999, padding: "11px 22px", fontFamily: "sans-serif", fontSize: 13, cursor: "pointer" }}>
              {savedProfile ? <><Check size={14} /> Opgeslagen</> : <><Save size={14} /> Opslaan</>}
            </button>
          </div>
        )}

        {activeTab === "beveiliging" && (
          <>
            <div style={{ background: "white", borderRadius: 16, border: "1px solid #ece8e4", padding: 24, marginBottom: 16 }}>
              <h2 style={{ fontFamily: "serif", fontSize: 20, color: "#16161D", marginBottom: 20 }}>Wachtwoord wijzigen</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[["new", "Nieuw wachtwoord"], ["confirm", "Bevestig wachtwoord"]].map(([field, label]) => (
                  <div key={field}>
                    <label style={{ fontFamily: "sans-serif", fontSize: 11, color: "#9a8e88", display: "block", marginBottom: 5 }}>{label}</label>
                    <div style={{ position: "relative" }}>
                      <input type={showPw ? "text" : "password"} value={passwords[field as "new" | "confirm"]} onChange={e => setPasswords(p => ({ ...p, [field]: e.target.value }))} style={{ ...inputStyle, paddingRight: 44 }} />
                      <button onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9a8e88" }}>
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                ))}
                {pwError && <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#8B2635" }}>{pwError}</p>}
                <button onClick={savePassword} style={{ display: "flex", alignItems: "center", gap: 6, background: "#8B2635", color: "white", border: "none", borderRadius: 999, padding: "11px 22px", fontFamily: "sans-serif", fontSize: 13, cursor: "pointer", width: "fit-content" }}>
                  {savedPw ? <><Check size={14} /> Gewijzigd</> : <><Lock size={14} /> Wachtwoord wijzigen</>}
                </button>
              </div>
            </div>
            <div style={{ background: "#fff8f8", borderRadius: 16, border: "1px solid #f5c6cb", padding: 24 }}>
              <h2 style={{ fontFamily: "serif", fontSize: 18, color: "#8B2635", marginBottom: 10 }}>Account verwijderen</h2>
              <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#5a5550", marginBottom: 16, lineHeight: 1.6 }}>Hiermee verwijder je permanent je account en alle bijbehorende data. Deze actie kan niet ongedaan worden gemaakt.</p>
              <button onClick={deleteAccount} style={{ display: "flex", alignItems: "center", gap: 6, background: "#8B2635", color: "white", border: "none", borderRadius: 999, padding: "11px 22px", fontFamily: "sans-serif", fontSize: 13, cursor: "pointer" }}>
                <Trash2 size={14} /> Account verwijderen
              </button>
            </div>
          </>
        )}

        {activeTab === "notificaties" && (
          <div style={{ background: "white", borderRadius: 16, border: "1px solid #ece8e4", padding: 24 }}>
            <h2 style={{ fontFamily: "serif", fontSize: 20, color: "#16161D", marginBottom: 20 }}>E-mailnotificaties</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {([["rsvp", "Nieuwe RSVP", "Ontvang een e-mail bij elke nieuwe bevestiging"], ["photos", "Nieuwe foto", "Wanneer een gast een foto uploadt"], ["messages", "Nieuw bericht", "Wanneer een gast een bericht achterlaat"], ["weekly", "Wekelijks overzicht", "Samenvatting van alle activiteit"]] as [keyof typeof notifications, string, string][]).map(([key, label, desc]) => (
                <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", border: "1px solid #ece8e4", borderRadius: 10 }}>
                  <div>
                    <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#16161D" }}>{label}</p>
                    <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88" }}>{desc}</p>
                  </div>
                  <button onClick={() => setNotifications(n => ({ ...n, [key]: !n[key] }))} style={{ width: 44, height: 24, borderRadius: 999, background: notifications[key] ? "#8B2635" : "#e0dbd7", border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
                    <div style={{ position: "absolute", top: 2, left: notifications[key] ? 22 : 2, width: 20, height: 20, borderRadius: "50%", background: "white", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
