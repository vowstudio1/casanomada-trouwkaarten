"use client";
import { useState } from "react";
import Link from "next/link";
import { Send, Mail, MessageSquare, Check } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    setSent(true);
    setSending(false);
  };

  const inputStyle: React.CSSProperties = { border: "1.5px solid #e0dbd7", borderRadius: 10, padding: "12px 16px", fontFamily: "sans-serif", fontSize: 14, color: "#16161D", outline: "none", background: "white", width: "100%", boxSizing: "border-box" };

  return (
    <>
      <nav style={{ position: "sticky", top: 0, background: "white", borderBottom: "1px solid #ece8e4", zIndex: 50, padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.2em", color: "#8B2635", textDecoration: "none" }}>CASA NOMADA</Link>
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {[["Templates", "/templates"], ["Prijzen", "/pricing"], ["FAQ", "/faq"]].map(([l, h]) => (
            <Link key={h} href={h} style={{ fontFamily: "sans-serif", fontSize: 13, color: "#5a5550", textDecoration: "none" }}>{l}</Link>
          ))}
          <Link href="/register" style={{ fontFamily: "sans-serif", fontSize: 13, background: "#8B2635", color: "white", borderRadius: 999, padding: "8px 20px", textDecoration: "none" }}>Gratis starten</Link>
        </div>
      </nav>

      <div style={{ minHeight: "calc(100vh - 60px)", background: "#f9f5f1" }}>
        {/* Hero */}
        <div style={{ textAlign: "center", padding: "60px 20px 48px", maxWidth: 600, margin: "0 auto" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#fdf6f4", border: "1px solid #f5ddd8", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <MessageSquare size={24} style={{ color: "#8B2635" }} />
          </div>
          <h1 style={{ fontFamily: "serif", fontSize: 40, color: "#16161D", marginBottom: 12 }}>Neem contact op</h1>
          <p style={{ fontFamily: "sans-serif", fontSize: 16, color: "#9a8e88", lineHeight: 1.7 }}>Heb je een vraag of wil je meer weten? We helpen je graag verder.</p>
        </div>

        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px 60px", display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
          {/* Formulier */}
          <div style={{ background: "white", borderRadius: 20, border: "1px solid #ece8e4", padding: 32 }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#f0faf0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <Check size={24} style={{ color: "#28a745" }} />
                </div>
                <h2 style={{ fontFamily: "serif", fontSize: 24, color: "#16161D", marginBottom: 8 }}>Bericht verzonden!</h2>
                <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#9a8e88" }}>We antwoorden zo snel mogelijk, meestal binnen één werkdag.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <h2 style={{ fontFamily: "serif", fontSize: 22, color: "#16161D", marginBottom: 4 }}>Stuur een bericht</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <label style={{ fontFamily: "sans-serif", fontSize: 11, color: "#9a8e88", display: "block", marginBottom: 5 }}>Naam</label>
                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ fontFamily: "sans-serif", fontSize: 11, color: "#9a8e88", display: "block", marginBottom: 5 }}>E-mail</label>
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label style={{ fontFamily: "sans-serif", fontSize: 11, color: "#9a8e88", display: "block", marginBottom: 5 }}>Onderwerp</label>
                  <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} required style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontFamily: "sans-serif", fontSize: 11, color: "#9a8e88", display: "block", marginBottom: 5 }}>Bericht</label>
                  <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required rows={5} style={{ ...inputStyle, resize: "vertical" }} />
                </div>
                <button type="submit" disabled={sending} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#8B2635", color: "white", border: "none", borderRadius: 999, padding: "13px", fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                  <Send size={15} /> {sending ? "Verzenden..." : "Bericht verzenden"}
                </button>
              </form>
            )}
          </div>

          {/* Contact info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { icon: Mail, label: "E-mail", value: "hallo@casanomada.nl", desc: "We antwoorden binnen 1 werkdag" },
              { icon: MessageSquare, label: "WhatsApp", value: "+31 6 00 00 00 00", desc: "Ma–vr 9:00–17:00" },
            ].map(({ icon: Icon, label, value, desc }) => (
              <div key={label} style={{ background: "white", borderRadius: 16, border: "1px solid #ece8e4", padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#fdf6f4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={16} style={{ color: "#8B2635" }} />
                  </div>
                  <p style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 600, color: "#16161D" }}>{label}</p>
                </div>
                <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#8B2635" }}>{value}</p>
                <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88" }}>{desc}</p>
              </div>
            ))}
            <div style={{ background: "#fdf6f4", borderRadius: 16, border: "1px solid #f5ddd8", padding: 20 }}>
              <p style={{ fontFamily: "serif", fontSize: 16, color: "#8B2635", marginBottom: 6 }}>Veelgestelde vragen</p>
              <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b6560", marginBottom: 12 }}>Misschien staat je vraag al bij de FAQ.</p>
              <Link href="/faq" style={{ fontFamily: "sans-serif", fontSize: 13, color: "#8B2635", textDecoration: "none", fontWeight: 600 }}>Bekijk FAQ →</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
