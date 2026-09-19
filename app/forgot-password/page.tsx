"use client";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Check } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    if (err) { setError(err.message); setLoading(false); return; }
    setSent(true); setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f9f5f1", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <Link href="/" style={{ display: "block", textAlign: "center", fontFamily: "sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.22em", color: "#8B2635", textDecoration: "none", marginBottom: 40 }}>CASA NOMADA</Link>
        <div style={{ background: "white", borderRadius: 20, padding: "40px 36px", boxShadow: "0 4px 32px rgba(0,0,0,0.07)" }}>
          {sent ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}><Check size={24} style={{ color: "#16a34a" }} /></div>
              <h2 style={{ fontFamily: "serif", fontSize: 24, color: "#16161D", marginBottom: 8 }}>E-mail verstuurd</h2>
              <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#6b6560", marginBottom: 24 }}>Controleer je inbox voor de resetlink.</p>
              <Link href="/login" style={{ color: "#8B2635", fontFamily: "sans-serif", fontSize: 14 }}>← Terug naar inloggen</Link>
            </div>
          ) : (
            <>
              <h1 style={{ fontFamily: "serif", fontSize: 28, color: "#16161D", marginBottom: 6, textAlign: "center" }}>Wachtwoord vergeten</h1>
              <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#9a8e88", textAlign: "center", marginBottom: 28 }}>Vul je e-mailadres in en we sturen je een resetlink.</p>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="jouw@email.com" style={{ width: "100%", border: "1.5px solid #e0dbd7", borderRadius: 10, padding: "13px 14px", fontFamily: "sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                {error && <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#dc2626" }}>{error}</p>}
                <button type="submit" disabled={loading} style={{ background: "#8B2635", color: "white", border: "none", borderRadius: 999, padding: "15px", fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                  {loading ? "Versturen..." : "Stuur resetlink"}
                </button>
              </form>
              <p style={{ textAlign: "center", marginTop: 20, fontFamily: "sans-serif", fontSize: 13, color: "#9a8e88" }}>
                <Link href="/login" style={{ color: "#8B2635" }}>← Terug naar inloggen</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
