"use client";

import React, { useState } from "react";
import { ArrowLeft, Heart, Star, Plus, Minus } from "lucide-react";
import Link from "next/link";

interface TableData {
  name: string;
  guests: string[];
}

const TABLE_COLORS = [
  "#59262F",
  "#7B3F4A",
  "#A0576A",
  "#C27888",
  "#D4978A",
  "#B08968",
  "#8A6E5E",
  "#6B5B4F",
];

export default function TafelindelingPage() {
  const [guests, setGuests] = useState("");
  const [seatsPerTable, setSeatsPerTable] = useState(6);
  const [instructions, setInstructions] = useState("");
  const [tables, setTables] = useState<TableData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const guestCount = guests
    .split("\n")
    .map((g) => g.trim())
    .filter(Boolean).length;

  async function handleGenerate() {
    if (guestCount === 0) {
      setError("Voeg eerst gasten toe aan de lijst.");
      return;
    }

    setIsLoading(true);
    setError("");
    setTables([]);

    try {
      const res = await fetch("/api/tafelindeling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guests, seatsPerTable, instructions }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Er ging iets mis.");
        return;
      }

      setTables(data.tables);
    } catch {
      setError("Kon geen verbinding maken met de server. Probeer het opnieuw.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8" }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: "#59262F",
          padding: "20px 32px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <Link
          href="/dashboard"
          style={{
            color: "#FAFAF8",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            textDecoration: "none",
            fontSize: "14px",
            opacity: 0.85,
          }}
        >
          <ArrowLeft size={16} />
          <span>Dashboard</span>
        </Link>
        <div style={{ flex: 1, textAlign: "center" }}>
          <h1
            style={{
              color: "#FAFAF8",
              fontSize: "24px",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 400,
              margin: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <Heart size={20} fill="#FAFAF8" />
            AI-Tafelindeling
          </h1>
        </div>
        <div style={{ width: "90px" }} />
      </div>

      {/* Main content */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "32px 24px",
          display: "grid",
          gridTemplateColumns: "380px 1fr",
          gap: "32px",
          alignItems: "start",
        }}
      >
        {/* LEFT PANEL — Input */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {/* Guest list */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              border: "1px solid #E8E5E0",
            }}
          >
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 600,
                color: "#16161D",
                marginBottom: "4px",
              }}
            >
              Gastenlijst
            </label>
            <p
              style={{
                fontSize: "13px",
                color: "#6B6B76",
                margin: "0 0 12px 0",
              }}
            >
              {guestCount > 0
                ? guestCount + (guestCount === 1 ? " gast" : " gasten")
                : "Nog geen gasten"}
            </p>
            <textarea
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              placeholder={"Typ de namen van jullie gasten, een per regel:\n\nOom Jan\nTante Maria\nLisa & Mark\n..."}
              rows={14}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "8px",
                border: "1px solid #D4D1CC",
                fontSize: "14px",
                lineHeight: "1.7",
                fontFamily: "inherit",
                resize: "vertical",
                color: "#16161D",
                backgroundColor: "#FAFAF8",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Seats per table */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              border: "1px solid #E8E5E0",
            }}
          >
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 600,
                color: "#16161D",
                marginBottom: "12px",
              }}
            >
              Aantal per tafel
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setSeatsPerTable((v) => Math.max(4, v - 1))
                }
                disabled={seatsPerTable <= 4}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  border: "1px solid #D4D1CC",
                  backgroundColor: seatsPerTable <= 4 ? "#F0EEEB" : "#FFFFFF",
                  cursor: seatsPerTable <= 4 ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#16161D",
                }}
              >
                <Minus size={16} />
              </button>
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: 600,
                  color: "#59262F",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  minWidth: "40px",
                  textAlign: "center",
                }}
              >
                {seatsPerTable}
              </span>
              <button
                type="button"
                onClick={() =>
                  setSeatsPerTable((v) => Math.min(12, v + 1))
                }
                disabled={seatsPerTable >= 12}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  border: "1px solid #D4D1CC",
                  backgroundColor: seatsPerTable >= 12 ? "#F0EEEB" : "#FFFFFF",
                  cursor: seatsPerTable >= 12 ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#16161D",
                }}
              >
                <Plus size={16} />
              </button>
              <span style={{ fontSize: "13px", color: "#6B6B76" }}>
                personen
              </span>
            </div>
          </div>

          {/* AI instructions */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              border: "1px solid #E8E5E0",
            }}
          >
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 600,
                color: "#16161D",
                marginBottom: "4px",
              }}
            >
              Instructies voor de AI
            </label>
            <p
              style={{
                fontSize: "13px",
                color: "#6B6B76",
                margin: "0 0 12px 0",
              }}
            >
              Optioneel — vertel de AI wat belangrijk is
            </p>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder={"Bijv: Familie bruid en bruidegom apart, kinderen aan een eigen tafel, oma naast de bruid..."}
              rows={4}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "8px",
                border: "1px solid #D4D1CC",
                fontSize: "14px",
                lineHeight: "1.6",
                fontFamily: "inherit",
                resize: "vertical",
                color: "#16161D",
                backgroundColor: "#FAFAF8",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Generate button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "16px",
              backgroundColor: isLoading ? "#7B3F4A" : "#59262F",
              color: "#FAFAF8",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: isLoading ? "wait" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              transition: "background-color 0.2s",
            }}
          >
            {isLoading ? (
              <>
                <span
                  style={{
                    display: "inline-block",
                    width: "18px",
                    height: "18px",
                    border: "2px solid rgba(250,250,248,0.3)",
                    borderTopColor: "#FAFAF8",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                AI denkt na...
              </>
            ) : (
              <>
                <Star size={18} />
                Maak tafelindeling
              </>
            )}
          </button>

          {error && (
            <div
              style={{
                backgroundColor: "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: "8px",
                padding: "12px 16px",
                fontSize: "14px",
                color: "#991B1B",
              }}
            >
              {error}
            </div>
          )}
        </div>

        {/* RIGHT PANEL — Results */}
        <div>
          {tables.length === 0 && !isLoading && (
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "12px",
                padding: "64px 32px",
                textAlign: "center",
                border: "1px solid #E8E5E0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  backgroundColor: "#F5F0ED",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px auto",
                }}
              >
                <Heart size={28} color="#59262F" />
              </div>
              <p
                style={{
                  fontSize: "16px",
                  color: "#6B6B76",
                  maxWidth: "300px",
                  margin: "0 auto",
                  lineHeight: "1.6",
                }}
              >
                Vul de gastenlijst in en klik op
                &lsquo;Maak tafelindeling&rsquo; om te beginnen.
              </p>
            </div>
          )}

          {isLoading && (
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "12px",
                padding: "64px 32px",
                textAlign: "center",
                border: "1px solid #E8E5E0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  border: "3px solid #E8E5E0",
                  borderTopColor: "#59262F",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  margin: "0 auto 20px auto",
                }}
              />
              <p
                style={{
                  fontSize: "16px",
                  color: "#59262F",
                  fontWeight: 500,
                }}
              >
                De AI maakt jullie tafelindeling...
              </p>
              <p
                style={{
                  fontSize: "13px",
                  color: "#6B6B76",
                  marginTop: "4px",
                }}
              >
                Dit duurt een paar seconden
              </p>
            </div>
          )}

          {tables.length > 0 && (
            <>
              <div
                style={{
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <h2
                  style={{
                    fontSize: "20px",
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    color: "#16161D",
                    fontWeight: 400,
                    margin: 0,
                  }}
                >
                  Jullie tafelindeling
                </h2>
                <span
                  style={{
                    fontSize: "13px",
                    color: "#6B6B76",
                  }}
                >
                  {tables.length} {tables.length === 1 ? "tafel" : "tafels"} &middot;{" "}
                  {tables.reduce((sum, t) => sum + t.guests.length, 0)} gasten
                </span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                {tables.map((table, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "12px",
                      overflow: "hidden",
                      border: "1px solid #E8E5E0",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                    }}
                  >
                    <div
                      style={{
                        height: "5px",
                        backgroundColor:
                          TABLE_COLORS[index % TABLE_COLORS.length],
                      }}
                    />
                    <div style={{ padding: "20px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "12px",
                        }}
                      >
                        <h3
                          style={{
                            fontSize: "17px",
                            fontFamily:
                              "Georgia, 'Times New Roman', serif",
                            color: "#16161D",
                            fontWeight: 600,
                            margin: 0,
                          }}
                        >
                          {table.name}
                        </h3>
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#FAFAF8",
                            backgroundColor:
                              TABLE_COLORS[index % TABLE_COLORS.length],
                            padding: "2px 10px",
                            borderRadius: "99px",
                            fontWeight: 500,
                          }}
                        >
                          {table.guests.length}
                        </span>
                      </div>
                      <ul
                        style={{
                          listStyle: "none",
                          padding: 0,
                          margin: 0,
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px",
                        }}
                      >
                        {table.guests.map((guest, gi) => (
                          <li
                            key={gi}
                            style={{
                              fontSize: "14px",
                              color: "#3A3A42",
                              padding: "6px 10px",
                              backgroundColor:
                                gi % 2 === 0 ? "#FAFAF8" : "transparent",
                              borderRadius: "6px",
                            }}
                          >
                            {guest}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Spinner animation */}
      <style>
        {`@keyframes spin { to { transform: rotate(360deg); } }`}
      </style>
    </div>
  );
}
