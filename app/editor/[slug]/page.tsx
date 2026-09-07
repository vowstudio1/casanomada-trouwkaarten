"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Heart } from "lucide-react";

const THEME_COLORS = [
  { value: "#59262F", label: "Burgundy" },
  { value: "#1f2937", label: "Donker" },
  { value: "#065f46", label: "Groen" },
  { value: "#6b21a8", label: "Paars" },
  { value: "#075985", label: "Blauw" },
  { value: "#9a3412", label: "Terracotta" },
];

const DRESSCODE_OPTIONS = [
  "Geen voorkeur",
  "Formeel",
  "Smart casual",
  "Casual",
];

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("nl-NL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(timeStr: string): string {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(":");
  return hours + ":" + minutes + " uur";
}

function templateNameFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function EditorPage({
  params,
}: {
  params: { slug: string };
}) {
  const templateName = templateNameFromSlug(params.slug);

  const [partner1, setPartner1] = useState("");
  const [partner2, setPartner2] = useState("");
  const [datum, setDatum] = useState("");
  const [locatieNaam, setLocatieNaam] = useState("");
  const [stad, setStad] = useState("");
  const [bericht, setBericht] = useState("");
  const [dresscode, setDresscode] = useState("Geen voorkeur");
  const [tijd, setTijd] = useState("");
  const [themeColor, setThemeColor] = useState("#59262F");
  const [showTooltip, setShowTooltip] = useState(false);

  const displayNames =
    partner1 || partner2
      ? (partner1 || "...") + " & " + (partner2 || "...")
      : "Jullie namen";

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAF8" }}>
      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{
          backgroundColor: "#FAFAF8",
          borderColor: "#e5e5e5",
        }}
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/templates"
              className="flex items-center gap-2 text-sm transition-colors"
              style={{ color: "#16161D" }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Terug</span>
            </Link>
            <div className="h-5 w-px bg-gray-300" />
            <Link
              href="/"
              className="text-lg tracking-widest font-semibold"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                color: "#59262F",
              }}
            >
              CASA NOMADA
            </Link>
            <div className="h-5 w-px bg-gray-300 hidden sm:block" />
            <span
              className="text-sm hidden sm:inline"
              style={{ color: "#71717a" }}
            >
              {templateName}
            </span>
          </div>

          <div className="relative">
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="px-5 py-2 rounded-xl text-sm font-medium transition-opacity cursor-not-allowed opacity-50"
              style={{
                backgroundColor: "#59262F",
                color: "#FAFAF8",
              }}
              disabled
            >
              Opslaan
            </button>
            {showTooltip && (
              <div
                className="absolute top-full right-0 mt-2 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap shadow-lg"
                style={{
                  backgroundColor: "#16161D",
                  color: "#FAFAF8",
                }}
              >
                Binnenkort beschikbaar
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-4rem)]">
          {/* LEFT — Form */}
          <div
            className="p-6 sm:p-8 lg:p-12 overflow-y-auto"
            style={{ borderRight: "1px solid #e5e5e5" }}
          >
            <div className="max-w-md mx-auto space-y-8">
              <div>
                <h1
                  className="text-2xl font-semibold mb-1"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    color: "#16161D",
                  }}
                >
                  Uitnodiging bewerken
                </h1>
                <p className="text-sm" style={{ color: "#71717a" }}>
                  Vul de gegevens in en zie direct het resultaat.
                </p>
              </div>

              {/* Namen */}
              <fieldset className="space-y-3">
                <legend
                  className="text-xs font-medium uppercase tracking-widest mb-3 block"
                  style={{ color: "#71717a" }}
                >
                  Namen
                </legend>
                <div>
                  <label
                    htmlFor="partner1"
                    className="text-xs font-medium uppercase tracking-wide block mb-1.5"
                    style={{ color: "#71717a" }}
                  >
                    Naam partner 1
                  </label>
                  <input
                    id="partner1"
                    type="text"
                    value={partner1}
                    onChange={(e) => setPartner1(e.target.value)}
                    placeholder="Bijv. Sophie"
                    className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-shadow"
                    style={{
                      borderColor: "#e5e7eb",
                      color: "#16161D",
                      backgroundColor: "white",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 0 0 2px #59262F40")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.boxShadow = "none")
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor="partner2"
                    className="text-xs font-medium uppercase tracking-wide block mb-1.5"
                    style={{ color: "#71717a" }}
                  >
                    Naam partner 2
                  </label>
                  <input
                    id="partner2"
                    type="text"
                    value={partner2}
                    onChange={(e) => setPartner2(e.target.value)}
                    placeholder="Bijv. Thomas"
                    className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-shadow"
                    style={{
                      borderColor: "#e5e7eb",
                      color: "#16161D",
                      backgroundColor: "white",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 0 0 2px #59262F40")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.boxShadow = "none")
                    }
                  />
                </div>
              </fieldset>

              {/* Datum */}
              <fieldset className="space-y-3">
                <legend
                  className="text-xs font-medium uppercase tracking-widest mb-3 block"
                  style={{ color: "#71717a" }}
                >
                  Datum
                </legend>
                <div>
                  <label
                    htmlFor="datum"
                    className="text-xs font-medium uppercase tracking-wide block mb-1.5"
                    style={{ color: "#71717a" }}
                  >
                    Datum van de bruiloft
                  </label>
                  <input
                    id="datum"
                    type="date"
                    value={datum}
                    onChange={(e) => setDatum(e.target.value)}
                    className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-shadow"
                    style={{
                      borderColor: "#e5e7eb",
                      color: "#16161D",
                      backgroundColor: "white",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 0 0 2px #59262F40")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.boxShadow = "none")
                    }
                  />
                </div>
              </fieldset>

              {/* Locatie */}
              <fieldset className="space-y-3">
                <legend
                  className="text-xs font-medium uppercase tracking-widest mb-3 block"
                  style={{ color: "#71717a" }}
                >
                  Locatie
                </legend>
                <div>
                  <label
                    htmlFor="locatieNaam"
                    className="text-xs font-medium uppercase tracking-wide block mb-1.5"
                    style={{ color: "#71717a" }}
                  >
                    Naam locatie
                  </label>
                  <input
                    id="locatieNaam"
                    type="text"
                    value={locatieNaam}
                    onChange={(e) => setLocatieNaam(e.target.value)}
                    placeholder="Bijv. Landgoed De Hooge Vuursche"
                    className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-shadow"
                    style={{
                      borderColor: "#e5e7eb",
                      color: "#16161D",
                      backgroundColor: "white",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 0 0 2px #59262F40")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.boxShadow = "none")
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor="stad"
                    className="text-xs font-medium uppercase tracking-wide block mb-1.5"
                    style={{ color: "#71717a" }}
                  >
                    Stad
                  </label>
                  <input
                    id="stad"
                    type="text"
                    value={stad}
                    onChange={(e) => setStad(e.target.value)}
                    placeholder="Bijv. Baarn"
                    className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-shadow"
                    style={{
                      borderColor: "#e5e7eb",
                      color: "#16161D",
                      backgroundColor: "white",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 0 0 2px #59262F40")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.boxShadow = "none")
                    }
                  />
                </div>
              </fieldset>

              {/* Bericht */}
              <fieldset className="space-y-3">
                <legend
                  className="text-xs font-medium uppercase tracking-widest mb-3 block"
                  style={{ color: "#71717a" }}
                >
                  Bericht
                </legend>
                <div>
                  <label
                    htmlFor="bericht"
                    className="text-xs font-medium uppercase tracking-wide block mb-1.5"
                    style={{ color: "#71717a" }}
                  >
                    Persoonlijk bericht aan gasten
                  </label>
                  <textarea
                    id="bericht"
                    value={bericht}
                    onChange={(e) => {
                      if (e.target.value.length <= 200) {
                        setBericht(e.target.value);
                      }
                    }}
                    placeholder="Bijv. Wij vieren de liefde en hopen dat jullie erbij zijn!"
                    rows={3}
                    className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-shadow resize-none"
                    style={{
                      borderColor: "#e5e7eb",
                      color: "#16161D",
                      backgroundColor: "white",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 0 0 2px #59262F40")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.boxShadow = "none")
                    }
                  />
                  <p className="text-xs mt-1 text-right" style={{ color: "#a1a1aa" }}>
                    {bericht.length}/200
                  </p>
                </div>
              </fieldset>

              {/* Dresscode */}
              <fieldset className="space-y-3">
                <legend
                  className="text-xs font-medium uppercase tracking-widest mb-3 block"
                  style={{ color: "#71717a" }}
                >
                  Dresscode
                </legend>
                <div>
                  <label
                    htmlFor="dresscode"
                    className="text-xs font-medium uppercase tracking-wide block mb-1.5"
                    style={{ color: "#71717a" }}
                  >
                    Kledingvoorschrift
                  </label>
                  <select
                    id="dresscode"
                    value={dresscode}
                    onChange={(e) => setDresscode(e.target.value)}
                    className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-shadow appearance-none"
                    style={{
                      borderColor: "#e5e7eb",
                      color: "#16161D",
                      backgroundColor: "white",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 0 0 2px #59262F40")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.boxShadow = "none")
                    }
                  >
                    {DRESSCODE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </fieldset>

              {/* Tijdstip */}
              <fieldset className="space-y-3">
                <legend
                  className="text-xs font-medium uppercase tracking-widest mb-3 block"
                  style={{ color: "#71717a" }}
                >
                  Tijdstip
                </legend>
                <div>
                  <label
                    htmlFor="tijd"
                    className="text-xs font-medium uppercase tracking-wide block mb-1.5"
                    style={{ color: "#71717a" }}
                  >
                    Tijd
                  </label>
                  <input
                    id="tijd"
                    type="time"
                    value={tijd}
                    onChange={(e) => setTijd(e.target.value)}
                    className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-shadow"
                    style={{
                      borderColor: "#e5e7eb",
                      color: "#16161D",
                      backgroundColor: "white",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 0 0 2px #59262F40")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.boxShadow = "none")
                    }
                  />
                </div>
              </fieldset>

              {/* Kleur thema */}
              <fieldset className="space-y-3">
                <legend
                  className="text-xs font-medium uppercase tracking-widest mb-3 block"
                  style={{ color: "#71717a" }}
                >
                  Kleur thema
                </legend>
                <div className="flex items-center gap-3">
                  {THEME_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setThemeColor(color.value)}
                      className="w-8 h-8 rounded-full transition-all flex items-center justify-center"
                      style={{
                        backgroundColor: color.value,
                        boxShadow:
                          themeColor === color.value
                            ? "0 0 0 2px #FAFAF8, 0 0 0 4px " + color.value
                            : "none",
                      }}
                      title={color.label}
                      aria-label={color.label}
                    >
                      {themeColor === color.value && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="pb-8" />
            </div>
          </div>

          {/* RIGHT — Live Preview */}
          <div
            className="p-6 sm:p-8 lg:p-12 flex items-start lg:items-center justify-center"
            style={{ backgroundColor: "#f5f5f0" }}
          >
            <div className="w-full max-w-xs sticky top-28">
              <p
                className="text-xs font-medium uppercase tracking-widest mb-4 text-center"
                style={{ color: "#71717a" }}
              >
                Voorbeeld
              </p>

              {/* Invitation Card */}
              <div
                className="rounded-2xl overflow-hidden shadow-lg"
                style={{ backgroundColor: "white" }}
              >
                {/* Colored header band */}
                <div
                  className="px-6 py-5 text-center transition-colors duration-300"
                  style={{ backgroundColor: themeColor }}
                >
                  <p
                    className="text-xs font-medium uppercase tracking-[0.25em]"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    Uitnodiging
                  </p>
                </div>

                {/* Card body */}
                <div className="px-6 py-8 text-center space-y-5">
                  {/* Heart icon */}
                  <div className="flex justify-center">
                    <Heart
                      className="w-5 h-5 transition-colors duration-300"
                      style={{ color: themeColor }}
                      fill={themeColor}
                    />
                  </div>

                  {/* Names */}
                  <h2
                    className="text-2xl leading-tight transition-colors duration-300"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      color: partner1 || partner2 ? "#16161D" : "#a1a1aa",
                    }}
                  >
                    {displayNames}
                  </h2>

                  {/* Divider */}
                  <div className="flex items-center justify-center gap-3">
                    <div
                      className="h-px w-8 transition-colors duration-300"
                      style={{ backgroundColor: themeColor + "40" }}
                    />
                    <div
                      className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
                      style={{ backgroundColor: themeColor }}
                    />
                    <div
                      className="h-px w-8 transition-colors duration-300"
                      style={{ backgroundColor: themeColor + "40" }}
                    />
                  </div>

                  {/* Date */}
                  {datum ? (
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#16161D" }}
                    >
                      {formatDate(datum)}
                    </p>
                  ) : (
                    <p className="text-sm" style={{ color: "#a1a1aa" }}>
                      Kies een datum
                    </p>
                  )}

                  {/* Time */}
                  {tijd && (
                    <p className="text-xs" style={{ color: "#71717a" }}>
                      Aanvang {formatTime(tijd)}
                    </p>
                  )}

                  {/* Location */}
                  {(locatieNaam || stad) && (
                    <div>
                      {locatieNaam && (
                        <p
                          className="text-sm font-medium"
                          style={{ color: "#16161D" }}
                        >
                          {locatieNaam}
                        </p>
                      )}
                      {stad && (
                        <p className="text-xs" style={{ color: "#71717a" }}>
                          {stad}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Personal message */}
                  {bericht && (
                    <p
                      className="text-sm italic leading-relaxed"
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        color: "#52525b",
                      }}
                    >
                      &ldquo;{bericht}&rdquo;
                    </p>
                  )}

                  {/* Dresscode */}
                  {dresscode !== "Geen voorkeur" && (
                    <div
                      className="inline-block px-3 py-1 rounded-full text-xs"
                      style={{
                        backgroundColor: themeColor + "12",
                        color: themeColor,
                      }}
                    >
                      Dresscode: {dresscode}
                    </div>
                  )}

                  {/* Spacer */}
                  <div className="pt-2">
                    <div
                      className="h-px w-full"
                      style={{ backgroundColor: "#e5e7eb" }}
                    />
                  </div>

                  {/* RSVP Button */}
                  <button
                    type="button"
                    className="w-full py-3 rounded-xl text-sm font-medium transition-colors duration-300 cursor-default"
                    style={{
                      backgroundColor: themeColor,
                      color: "white",
                    }}
                  >
                    RSVP
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
