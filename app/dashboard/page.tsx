"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, Mail, Star, LayoutGrid, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  status: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(function () {
    async function checkAuth() {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.push("/login");
        return;
      }
      setUserEmail(data.user.email || "");
      setLoading(false);
    }
    checkAuth();
  }, [router]);

  async function handleLogout() {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#FAFAF8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.25rem",
            color: "#59262F",
          }}
        >
          Laden...
        </p>
      </div>
    );
  }

  var features: FeatureCard[] = [
    {
      title: "Uitnodigingen",
      description: "Ontwerp en verstuur je bruiloftsuitnodigingen",
      icon: <Mail size={24} color="#59262F" />,
      status: "Binnenkort beschikbaar",
    },
    {
      title: "Gasten",
      description: "Beheer je gastenlijst en RSVP's",
      icon: <Heart size={24} color="#59262F" />,
      status: "Binnenkort beschikbaar",
    },
    {
      title: "Gastenboek",
      description: "Laat gasten mooie berichten achterlaten",
      icon: <Star size={24} color="#59262F" />,
      status: "Binnenkort beschikbaar",
    },
    {
      title: "Tafelindeling",
      description: "Plan de perfecte tafelindeling",
      icon: <LayoutGrid size={24} color="#59262F" />,
      status: "Binnenkort beschikbaar",
    },
  ];

  var stats = [
    { label: "Uitnodigingen", value: "0" },
    { label: "Gasten", value: "0" },
    { label: "Berichten", value: "0" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#FAFAF8",
        color: "#16161D",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "1.5rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #E8E6E3",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "#59262F",
            textDecoration: "none",
            fontSize: "0.875rem",
          }}
        >
          <ArrowLeft size={16} />
          <span>Home</span>
        </Link>
        <Link
          href="/"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.5rem",
            fontWeight: 600,
            color: "#59262F",
            textDecoration: "none",
            letterSpacing: "0.05em",
          }}
        >
          CASA NOMADA
        </Link>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "transparent",
            color: "#59262F",
            border: "1px solid #59262F",
            borderRadius: "0.375rem",
            fontSize: "0.8125rem",
            fontWeight: 500,
            cursor: loggingOut ? "not-allowed" : "pointer",
            transition: "background-color 0.2s",
          }}
        >
          {loggingOut ? "Uitloggen..." : "Uitloggen"}
        </button>
      </header>

      <main
        style={{
          maxWidth: "56rem",
          margin: "0 auto",
          padding: "2.5rem 1.5rem",
        }}
      >
        {/* Welcome */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "2rem",
              fontWeight: 600,
              color: "#59262F",
              marginBottom: "0.375rem",
            }}
          >
            Welkom terug
          </h1>
          <p
            style={{
              color: "#6B6B76",
              fontSize: "0.9375rem",
            }}
          >
            {userEmail}
          </p>
        </div>

        {/* Quick Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1rem",
            marginBottom: "2.5rem",
          }}
        >
          {stats.map(function (stat) {
            return (
              <div
                key={stat.label}
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E8E6E3",
                  borderRadius: "0.75rem",
                  padding: "1.25rem",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: "#59262F",
                    marginBottom: "0.25rem",
                  }}
                >
                  {stat.value}
                </p>
                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: "#6B6B76",
                  }}
                >
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Feature Cards */}
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.375rem",
            fontWeight: 600,
            color: "#59262F",
            marginBottom: "1.25rem",
          }}
        >
          Jouw bruiloftstools
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1rem",
          }}
        >
          {features.map(function (feature) {
            return (
              <div
                key={feature.title}
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E8E6E3",
                  borderRadius: "0.75rem",
                  padding: "1.5rem",
                  transition: "box-shadow 0.2s",
                }}
              >
                <div
                  style={{
                    width: "3rem",
                    height: "3rem",
                    borderRadius: "0.625rem",
                    backgroundColor: "#FDF2F4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1rem",
                  }}
                >
                  {feature.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    color: "#16161D",
                    marginBottom: "0.375rem",
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: "#6B6B76",
                    marginBottom: "1rem",
                    lineHeight: 1.5,
                  }}
                >
                  {feature.description}
                </p>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: "#59262F",
                    backgroundColor: "#FDF2F4",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "9999px",
                  }}
                >
                  {feature.status}
                </span>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
