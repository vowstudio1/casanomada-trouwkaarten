"use client";

import React, { useState } from "react";
import { Heart, Check, ArrowRight, Plus, Minus, Mail } from "lucide-react";

export default function RSVPPage() {
  const [attendance, setAttendance] = useState<"yes" | "no" | null>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [guestNames, setGuestNames] = useState("");
  const [dietaryNeeds, setDietaryNeeds] = useState<string[]>([]);
  const [dietaryOther, setDietaryOther] = useState("");
  const [childrenCount, setChildrenCount] = useState(0);
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationError, setValidationError] = useState("");

  const weddingDate = "14 juni 2025";
  const coupleName = "Sophie & Thomas";
  const location = "Kasteel Hoensbroek, Limburg";

  const dietaryOptions = [
    "Vegetarisch",
    "Veganistisch",
    "Glutenvrij",
    "Lactosevrij",
    "Noten-allergie",
    "Anders",
  ];

  function toggleDietary(option: string) {
    setDietaryNeeds((prev) =>
      prev.includes(option)
        ? prev.filter((d) => d !== option)
        : [...prev, option]
    );
    if (option === "Anders" && dietaryNeeds.includes("Anders")) {
      setDietaryOther("");
    }
  }

  function handleSubmit() {
    if (attendance === null) {
      setValidationError("Selecteer of je aanwezig kunt zijn.");
      return;
    }
    setValidationError("");

    const formData = {
      attendance,
      guestCount: attendance === "yes" ? guestCount : 0,
      guestNames: attendance === "yes" ? guestNames : "",
      dietaryNeeds: attendance === "yes" ? dietaryNeeds : [],
      dietaryOther:
        attendance === "yes" && dietaryNeeds.includes("Anders")
          ? dietaryOther
          : "",
      childrenCount: attendance === "yes" ? childrenCount : 0,
      message,
    };

    console.log("RSVP Submitted:", formData);
    setIsSubmitted(true);
  }

  if (isSubmitted) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(180deg, #FAFAF8 0%, #f3eeeb 100%)",
        }}
      >
        <div
          style={{
            maxWidth: "32rem",
            margin: "0 auto",
            padding: "2rem 1rem",
          }}
        >
          {/* Success Header */}
          <div
            style={{
              textAlign: "center",
              padding: "3rem 2rem",
              background: "#FFFFFF",
              borderRadius: "1rem",
              boxShadow: "0 4px 24px rgba(89,38,47,0.08)",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                width: "5rem",
                height: "5rem",
                borderRadius: "50%",
                background:
                  attendance === "yes"
                    ? "linear-gradient(135deg, #59262F, #7a3a45)"
                    : "linear-gradient(135deg, #6b7280, #9ca3af)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
              }}
            >
              <Check size={32} color="#FFFFFF" strokeWidth={3} />
            </div>
            <h1
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontSize: "1.75rem",
                color: "#16161D",
                marginBottom: "0.75rem",
                fontWeight: 400,
              }}
            >
              Bedankt voor je reactie!
            </h1>
            <p
              style={{
                color: "#6b7280",
                fontSize: "1rem",
                lineHeight: 1.6,
              }}
            >
              {attendance === "yes"
                ? "We kijken er naar uit je te zien op onze bruiloft!"
                : "Jammer dat je er niet bij kunt zijn. We zullen je missen!"}
            </p>
          </div>

          {/* Summary Card */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "1rem",
              padding: "1.5rem",
              boxShadow: "0 4px 24px rgba(89,38,47,0.08)",
              marginBottom: "1.5rem",
            }}
          >
            <h2
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontSize: "1.125rem",
                color: "#59262F",
                marginBottom: "1rem",
                fontWeight: 400,
              }}
            >
              Samenvatting
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingBottom: "0.75rem",
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                <span style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                  Aanwezigheid
                </span>
                <span
                  style={{
                    color: "#16161D",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                  }}
                >
                  {attendance === "yes" ? "Ja, ik kom!" : "Nee, helaas niet"}
                </span>
              </div>
              {attendance === "yes" && (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingBottom: "0.75rem",
                      borderBottom: "1px solid #f3f4f6",
                    }}
                  >
                    <span style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                      Aantal personen
                    </span>
                    <span
                      style={{
                        color: "#16161D",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                      }}
                    >
                      {guestCount}
                    </span>
                  </div>
                  {guestNames && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        paddingBottom: "0.75rem",
                        borderBottom: "1px solid #f3f4f6",
                      }}
                    >
                      <span style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                        Namen
                      </span>
                      <span
                        style={{
                          color: "#16161D",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          textAlign: "right",
                          maxWidth: "60%",
                        }}
                      >
                        {guestNames}
                      </span>
                    </div>
                  )}
                  {childrenCount > 0 && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        paddingBottom: "0.75rem",
                        borderBottom: "1px solid #f3f4f6",
                      }}
                    >
                      <span style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                        Kinderen
                      </span>
                      <span
                        style={{
                          color: "#16161D",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                        }}
                      >
                        {childrenCount}
                      </span>
                    </div>
                  )}
                  {dietaryNeeds.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        paddingBottom: "0.75rem",
                        borderBottom: "1px solid #f3f4f6",
                      }}
                    >
                      <span style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                        Dieetwensen
                      </span>
                      <span
                        style={{
                          color: "#16161D",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          textAlign: "right",
                          maxWidth: "60%",
                        }}
                      >
                        {dietaryNeeds
                          .map((d) =>
                            d === "Anders" ? "Anders: " + dietaryOther : d
                          )
                          .join(", ")}
                      </span>
                    </div>
                  )}
                </>
              )}
              {message && (
                <div style={{ paddingTop: "0.25rem" }}>
                  <span
                    style={{
                      color: "#6b7280",
                      fontSize: "0.875rem",
                      display: "block",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Bericht
                  </span>
                  <p
                    style={{
                      color: "#16161D",
                      fontSize: "0.875rem",
                      fontStyle: "italic",
                      lineHeight: 1.6,
                      background: "#FAFAF8",
                      padding: "0.75rem 1rem",
                      borderRadius: "0.5rem",
                      margin: 0,
                    }}
                  >
                    &ldquo;{message}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Back Link */}
          <div style={{ textAlign: "center" }}>
            <a
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "#59262F",
                fontSize: "0.875rem",
                textDecoration: "none",
                fontWeight: 500,
                padding: "0.75rem 1.5rem",
                border: "1px solid #59262F",
                borderRadius: "0.5rem",
                transition: "all 0.2s ease",
              }}
            >
              <Mail size={16} />
              De uitnodiging bekijken
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #FAFAF8 0%, #f3eeeb 100%)",
      }}
    >
      <div
        style={{
          maxWidth: "32rem",
          margin: "0 auto",
          padding: "0 0 2rem",
        }}
      >
        {/* ── Invitation Header ── */}
        <div
          style={{
            background: "linear-gradient(135deg, #59262F 0%, #7a3a45 100%)",
            padding: "2.5rem 1.5rem 2rem",
            textAlign: "center",
            borderRadius: "0 0 1.5rem 1.5rem",
            marginBottom: "1.5rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              display: "inline-block",
              padding: "0.25rem 1rem",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "2rem",
              marginBottom: "1.25rem",
              position: "relative",
            }}
          >
            <span
              style={{
                color: "rgba(255,255,255,0.85)",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              Uitnodiging
            </span>
          </div>
          <h1
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: "2.25rem",
              color: "#FFFFFF",
              fontWeight: 400,
              marginBottom: "0.75rem",
              lineHeight: 1.2,
              position: "relative",
            }}
          >
            {coupleName}
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: "0.95rem",
              marginBottom: "0.25rem",
              position: "relative",
            }}
          >
            {weddingDate}
          </p>
          <p
            style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: "0.85rem",
              marginBottom: "1.25rem",
              position: "relative",
            }}
          >
            {location}
          </p>
          <Heart
            size={20}
            color="rgba(255,255,255,0.4)"
            style={{ position: "relative" }}
          />
        </div>

        {/* ── Form Container ── */}
        <div style={{ padding: "0 1rem" }}>
          {/* Validation Error */}
          {validationError && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "0.75rem",
                padding: "0.75rem 1rem",
                marginBottom: "1rem",
                color: "#991b1b",
                fontSize: "0.875rem",
                textAlign: "center",
              }}
            >
              {validationError}
            </div>
          )}

          {/* ── 1. Aanwezigheid ── */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "1rem",
              padding: "1.5rem",
              boxShadow: "0 4px 24px rgba(89,38,47,0.06)",
              marginBottom: "1rem",
            }}
          >
            <h2
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontSize: "1.125rem",
                color: "#16161D",
                marginBottom: "1rem",
                fontWeight: 400,
              }}
            >
              Aanwezigheid
            </h2>
            <div
              style={{ display: "flex", gap: "0.75rem" }}
            >
              {/* Ja button */}
              <button
                type="button"
                onClick={() => {
                  setAttendance("yes");
                  setValidationError("");
                }}
                style={{
                  flex: 1,
                  padding: "1.25rem 1rem",
                  borderRadius: "0.75rem",
                  border:
                    attendance === "yes"
                      ? "2px solid #16a34a"
                      : "2px solid #e5e7eb",
                  background:
                    attendance === "yes" ? "#f0fdf4" : "#FFFFFF",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                {attendance === "yes" ? (
                  <div
                    style={{
                      width: "2rem",
                      height: "2rem",
                      borderRadius: "50%",
                      background: "#16a34a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Check size={16} color="#FFFFFF" strokeWidth={3} />
                  </div>
                ) : (
                  <div
                    style={{
                      width: "2rem",
                      height: "2rem",
                      borderRadius: "50%",
                      background: "#f0fdf4",
                      border: "2px solid #bbf7d0",
                    }}
                  />
                )}
                <span
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: attendance === "yes" ? 600 : 400,
                    color:
                      attendance === "yes" ? "#16a34a" : "#6b7280",
                  }}
                >
                  Ja, ik kom!
                </span>
              </button>

              {/* Nee button */}
              <button
                type="button"
                onClick={() => {
                  setAttendance("no");
                  setValidationError("");
                }}
                style={{
                  flex: 1,
                  padding: "1.25rem 1rem",
                  borderRadius: "0.75rem",
                  border:
                    attendance === "no"
                      ? "2px solid #6b7280"
                      : "2px solid #e5e7eb",
                  background:
                    attendance === "no" ? "#f9fafb" : "#FFFFFF",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                {attendance === "no" ? (
                  <div
                    style={{
                      width: "2rem",
                      height: "2rem",
                      borderRadius: "50%",
                      background: "#6b7280",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Check size={16} color="#FFFFFF" strokeWidth={3} />
                  </div>
                ) : (
                  <div
                    style={{
                      width: "2rem",
                      height: "2rem",
                      borderRadius: "50%",
                      background: "#f9fafb",
                      border: "2px solid #e5e7eb",
                    }}
                  />
                )}
                <span
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: attendance === "no" ? 600 : 400,
                    color:
                      attendance === "no" ? "#374151" : "#6b7280",
                  }}
                >
                  Nee, helaas niet
                </span>
              </button>
            </div>
          </div>

          {/* ── Conditional sections (only when "yes") ── */}
          {attendance === "yes" && (
            <>
              {/* ── 2. Aantal personen ── */}
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: "1rem",
                  padding: "1.5rem",
                  boxShadow: "0 4px 24px rgba(89,38,47,0.06)",
                  marginBottom: "1rem",
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Georgia', 'Times New Roman', serif",
                    fontSize: "1.125rem",
                    color: "#16161D",
                    marginBottom: "1rem",
                    fontWeight: 400,
                  }}
                >
                  Aantal personen
                </h2>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "1.5rem",
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setGuestCount((c) => Math.max(1, c - 1))
                    }
                    disabled={guestCount <= 1}
                    style={{
                      width: "2.75rem",
                      height: "2.75rem",
                      borderRadius: "50%",
                      border: "2px solid #e5e7eb",
                      background: guestCount <= 1 ? "#f9fafb" : "#FFFFFF",
                      cursor: guestCount <= 1 ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s ease",
                      opacity: guestCount <= 1 ? 0.4 : 1,
                    }}
                  >
                    <Minus size={18} color="#59262F" />
                  </button>
                  <span
                    style={{
                      fontSize: "2rem",
                      fontWeight: 600,
                      color: "#59262F",
                      minWidth: "3rem",
                      textAlign: "center",
                      fontFamily: "'Georgia', 'Times New Roman', serif",
                    }}
                  >
                    {guestCount}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setGuestCount((c) => Math.min(6, c + 1))
                    }
                    disabled={guestCount >= 6}
                    style={{
                      width: "2.75rem",
                      height: "2.75rem",
                      borderRadius: "50%",
                      border: "2px solid #e5e7eb",
                      background: guestCount >= 6 ? "#f9fafb" : "#FFFFFF",
                      cursor: guestCount >= 6 ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s ease",
                      opacity: guestCount >= 6 ? 0.4 : 1,
                    }}
                  >
                    <Plus size={18} color="#59262F" />
                  </button>
                </div>
              </div>

              {/* ── 3. Namen gasten ── */}
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: "1rem",
                  padding: "1.5rem",
                  boxShadow: "0 4px 24px rgba(89,38,47,0.06)",
                  marginBottom: "1rem",
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Georgia', 'Times New Roman', serif",
                    fontSize: "1.125rem",
                    color: "#16161D",
                    marginBottom: "0.5rem",
                    fontWeight: 400,
                  }}
                >
                  Namen gasten
                </h2>
                <p
                  style={{
                    color: "#9ca3af",
                    fontSize: "0.8rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  Namen van alle gasten in uw gezelschap
                </p>
                <input
                  type="text"
                  value={guestNames}
                  onChange={(e) => setGuestNames(e.target.value)}
                  placeholder="bijv. Jan & Maria de Vries"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #e5e7eb",
                    fontSize: "0.95rem",
                    color: "#16161D",
                    background: "#FAFAF8",
                    outline: "none",
                    transition: "border-color 0.2s ease",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "#59262F")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "#e5e7eb")
                  }
                />
              </div>

              {/* ── 4. Dieetwensen ── */}
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: "1rem",
                  padding: "1.5rem",
                  boxShadow: "0 4px 24px rgba(89,38,47,0.06)",
                  marginBottom: "1rem",
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Georgia', 'Times New Roman', serif",
                    fontSize: "1.125rem",
                    color: "#16161D",
                    marginBottom: "1rem",
                    fontWeight: 400,
                  }}
                >
                  Dieetwensen
                </h2>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  {dietaryOptions.map((option) => (
                    <label
                      key={option}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.75rem",
                        borderRadius: "0.5rem",
                        border: dietaryNeeds.includes(option)
                          ? "1px solid #59262F"
                          : "1px solid #f3f4f6",
                        background: dietaryNeeds.includes(option)
                          ? "#fdf8f8"
                          : "#FAFAF8",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div
                        style={{
                          width: "1.25rem",
                          height: "1.25rem",
                          borderRadius: "0.25rem",
                          border: dietaryNeeds.includes(option)
                            ? "2px solid #59262F"
                            : "2px solid #d1d5db",
                          background: dietaryNeeds.includes(option)
                            ? "#59262F"
                            : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          transition: "all 0.2s ease",
                        }}
                        onClick={() => toggleDietary(option)}
                      >
                        {dietaryNeeds.includes(option) && (
                          <Check size={12} color="#FFFFFF" strokeWidth={3} />
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: "0.9rem",
                          color: "#16161D",
                        }}
                        onClick={() => toggleDietary(option)}
                      >
                        {option}
                      </span>
                    </label>
                  ))}
                  {dietaryNeeds.includes("Anders") && (
                    <input
                      type="text"
                      value={dietaryOther}
                      onChange={(e) => setDietaryOther(e.target.value)}
                      placeholder="Beschrijf je dieetwensen..."
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        borderRadius: "0.5rem",
                        border: "1px solid #e5e7eb",
                        fontSize: "0.9rem",
                        color: "#16161D",
                        background: "#FAFAF8",
                        outline: "none",
                        marginTop: "0.25rem",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) =>
                        (e.target.style.borderColor = "#59262F")
                      }
                      onBlur={(e) =>
                        (e.target.style.borderColor = "#e5e7eb")
                      }
                    />
                  )}
                </div>
              </div>

              {/* ── 5. Kinderen ── */}
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: "1rem",
                  padding: "1.5rem",
                  boxShadow: "0 4px 24px rgba(89,38,47,0.06)",
                  marginBottom: "1rem",
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Georgia', 'Times New Roman', serif",
                    fontSize: "1.125rem",
                    color: "#16161D",
                    marginBottom: "0.25rem",
                    fontWeight: 400,
                  }}
                >
                  Kinderen
                </h2>
                <p
                  style={{
                    color: "#9ca3af",
                    fontSize: "0.8rem",
                    marginBottom: "1rem",
                  }}
                >
                  Aantal kinderen (onder 12)
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "1.5rem",
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setChildrenCount((c) => Math.max(0, c - 1))
                    }
                    disabled={childrenCount <= 0}
                    style={{
                      width: "2.75rem",
                      height: "2.75rem",
                      borderRadius: "50%",
                      border: "2px solid #e5e7eb",
                      background:
                        childrenCount <= 0 ? "#f9fafb" : "#FFFFFF",
                      cursor:
                        childrenCount <= 0 ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s ease",
                      opacity: childrenCount <= 0 ? 0.4 : 1,
                    }}
                  >
                    <Minus size={18} color="#59262F" />
                  </button>
                  <span
                    style={{
                      fontSize: "2rem",
                      fontWeight: 600,
                      color: "#59262F",
                      minWidth: "3rem",
                      textAlign: "center",
                      fontFamily: "'Georgia', 'Times New Roman', serif",
                    }}
                  >
                    {childrenCount}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setChildrenCount((c) => Math.min(6, c + 1))
                    }
                    disabled={childrenCount >= 6}
                    style={{
                      width: "2.75rem",
                      height: "2.75rem",
                      borderRadius: "50%",
                      border: "2px solid #e5e7eb",
                      background:
                        childrenCount >= 6 ? "#f9fafb" : "#FFFFFF",
                      cursor:
                        childrenCount >= 6 ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s ease",
                      opacity: childrenCount >= 6 ? 0.4 : 1,
                    }}
                  >
                    <Plus size={18} color="#59262F" />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ── 6. Bericht (always visible) ── */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "1rem",
              padding: "1.5rem",
              boxShadow: "0 4px 24px rgba(89,38,47,0.06)",
              marginBottom: "1.5rem",
            }}
          >
            <h2
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontSize: "1.125rem",
                color: "#16161D",
                marginBottom: "0.75rem",
                fontWeight: 400,
              }}
            >
              Bericht voor het bruidspaar
            </h2>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Schrijf een persoonlijke wens..."
              rows={4}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "0.5rem",
                border: "1px solid #e5e7eb",
                fontSize: "0.95rem",
                color: "#16161D",
                background: "#FAFAF8",
                outline: "none",
                resize: "vertical",
                fontFamily: "inherit",
                lineHeight: 1.6,
                boxSizing: "border-box",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "#59262F")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "#e5e7eb")
              }
            />
          </div>

          {/* ── 7. Submit ── */}
          <button
            type="button"
            onClick={handleSubmit}
            style={{
              width: "100%",
              padding: "1rem",
              borderRadius: "0.75rem",
              border: "none",
              background:
                "linear-gradient(135deg, #59262F 0%, #7a3a45 100%)",
              color: "#FFFFFF",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 16px rgba(89,38,47,0.25)",
            }}
          >
            Bevestig RSVP
            <ArrowRight size={18} />
          </button>

          {/* Footer */}
          <p
            style={{
              textAlign: "center",
              color: "#9ca3af",
              fontSize: "0.75rem",
              marginTop: "1.5rem",
              lineHeight: 1.6,
            }}
          >
            Vragen? Neem contact op met het bruidspaar
          </p>
        </div>
      </div>
    </div>
  );
}