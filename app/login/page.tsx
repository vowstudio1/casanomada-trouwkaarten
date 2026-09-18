"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowRight, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(
        authError.message === "Invalid login credentials"
          ? "Ongeldig e-mailadres of wachtwoord."
          : authError.message
      );
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.75rem 0.875rem",
    border: "1px solid #D1D5DB",
    borderRadius: "0.625rem",
    fontSize: "0.9375rem",
    backgroundColor: "#FFFFFF",
    color: "#16161D",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "system-ui, sans-serif",
    transition: "border-color 0.15s",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f9f5f1",
      }}
    >
      <Nav />

      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem 1.5rem",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "26rem",
            backgroundColor: "#FFFFFF",
            borderRadius: "1.25rem",
            border: "1px solid #E8E6E3",
            padding: "2.5rem 2rem",
            boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div
              style={{
                width: "3rem",
                height: "3rem",
                borderRadius: "50%",
                backgroundColor: "#F9EDEE",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.25rem",
              }}
            >
              <Mail size={20} style={{ color: "#8B2635" }} />
            </div>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "1.75rem",
                fontWeight: 600,
                color: "#16161D",
                marginBottom: "0.375rem",
              }}
            >
              Welkom terug
            </h1>
            <p
              style={{
                color: "#6B6B76",
                fontSize: "0.875rem",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Log in op je bruiloftsplanner
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div
                style={{
                  backgroundColor: "#FEF2F2",
                  border: "1px solid #FECACA",
                  borderRadius: "0.625rem",
                  padding: "0.75rem 1rem",
                  marginBottom: "1.25rem",
                  color: "#991B1B",
                  fontSize: "0.875rem",
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                {error}
              </div>
            )}

            <div style={{ marginBottom: "1.125rem" }}>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  color: "#16161D",
                  marginBottom: "0.375rem",
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                E-mailadres
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={15}
                  style={{
                    position: "absolute",
                    left: "0.875rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9CA3AF",
                    pointerEvents: "none",
                  }}
                />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jouw@email.nl"
                  style={{ ...inputStyle, paddingLeft: "2.5rem" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#8B2635")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#D1D5DB")}
                />
              </div>
            </div>

            <div style={{ marginBottom: "1.75rem" }}>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  color: "#16161D",
                  marginBottom: "0.375rem",
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                Wachtwoord
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Je wachtwoord"
                  style={{ ...inputStyle, paddingRight: "2.75rem" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#8B2635")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#D1D5DB")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "0.875rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9CA3AF",
                    padding: 0,
                    display: "flex",
                  }}
                  aria-label={showPassword ? "Wachtwoord verbergen" : "Wachtwoord tonen"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.8125rem",
                backgroundColor: loading ? "#B08086" : "#8B2635",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "9999px",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                transition: "background-color 0.15s",
                fontFamily: "system-ui, sans-serif",
                letterSpacing: "0.04em",
              }}
            >
              {loading ? "Inloggen…" : "Inloggen"}
              {!loading && <ArrowRight size={15} />}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              marginTop: "1.5rem",
              fontSize: "0.875rem",
              color: "#6B6B76",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Nog geen account?{" "}
            <Link
              href="/register"
              style={{ color: "#8B2635", textDecoration: "underline", fontWeight: 500 }}
            >
              Registreren
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
