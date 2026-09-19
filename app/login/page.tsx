"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) { setError(err.message); setLoading(false); return; }
    router.push("/dashboard");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f9f5f1", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <Link href="/" style={{ display: "block", textAlign: "center", fontFamily: "sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.22em", color: "#8B2635", textDecoration: "none", marginBottom: 40 }}>CASA NOMADA</Link>
        <div style={{ background: "white", borderRadius: 20, padding: "40px 36px", boxShadow: "0 4px 32px rgba(0,0,0,0.07)" }}>
          <h1 style={{ fontFamily: "serif", fontSize: 28, color: "#16161D", marginBottom: 6, textAlign: "center" }}>Welkom terug</h1>
          <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#9a8e88", textAlign: "center", marginBottom: 32 }}>Log in op je Casa Nomada account</p>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", marginBottom: 6 }}>E-mailadres</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="jouw@email.com"
                style={{ width: "100%", border: "1.5px solid #e0dbd7", borderRadius: 10, padding: "13px 14px", fontFamily: "sans-serif", fontSize: 14, color: "#16161D", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ position: "relative" }}>
              <label style={{ display: "block", fontFamily: "sans-serif", fontSize: 12, color: "#9a8e88", marginBottom: 6 }}>Wachtwoord</label>
              <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                style={{ width: "100%", border: "1.5px solid #e0dbd7", borderRadius: 10, padding: "13px 44px 13px 14px", fontFamily: "sans-serif", fontSize: 14, color: "#16161D", outline: "none", boxSizing: "border-box" }} />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: 36, background: "none", border: "none", cursor: "pointer", color: "#9a8e88" }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div style={{ textAlign: "right", marginTop: -8 }}>
              <Link href="/forgot-password" style={{ fontFamily: "sans-serif", fontSize: 12, color: "#8B2635", textDecoration: "none" }}>Wachtwoord vergeten?</Link>
            </div>
            {error && <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#dc2626", background: "#fef2f2", padding: "10px 14px", borderRadius: 8 }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ background: "#8B2635", color: "white", border: "none", borderRadius: 999, padding: "15px", fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1, marginTop: 4 }}>
              {loading ? "Inloggen..." : "Inloggen"}
            </button>
          </form>
          <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#9a8e88", textAlign: "center", marginTop: 24 }}>
            Nog geen account? <Link href="/register" style={{ color: "#8B2635", fontWeight: 500 }}>Registreer gratis</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
