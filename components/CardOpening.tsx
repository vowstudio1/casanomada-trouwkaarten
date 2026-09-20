"use client";

import { useState } from "react";
import BloomInvite from "./BloomInvite";

type Props = {
  templateImg:   string;
  templateName:  string;
  templateSlug?: string;
  namen?:        string;
  datumLang?:    string;
  color?:        string;
  onComplete?:   () => void;
};

export default function CardOpening({
  templateImg,
  templateName,
  templateSlug,
  namen     = "Emma & Lucas",
  datumLang = "zaterdag 14 juni 2025",
  color     = "#8B2635",
  onComplete,
}: Props) {
  const [opened, setOpened] = useState(false);

  // Bloom: gebruik de volledige BloomInvite als demo
  if (templateSlug === "bloom") {
    if (!opened) {
      return (
        <BloomInvite
          namen={namen}
          datumLang={datumLang}
          weddingTime="15:00"
          venue="Landgoed De Hooge Vuursche"
          stad="Baarn"
          welcomeMessage="Wij zijn zo blij dat jullie erbij zijn op onze grote dag."
          events={[
            { id: "1", name: "Ceremonie",     start_time: "15:00", end_time: "16:00", venue: "Landgoed De Hooge Vuursche", city: "Baarn", description: "", is_main: true,  event_date: "" },
            { id: "2", name: "Receptie",      start_time: "16:00", end_time: "18:00", venue: "Terras",                    city: "Baarn", description: "", is_main: false, event_date: "" },
            { id: "3", name: "Diner & Feest", start_time: "18:00", end_time: "23:59", venue: "Grote Zaal",                city: "Baarn", description: "", is_main: false, event_date: "" },
          ]}
          color={color}
          showRsvp={true}
          showPhotos={true}
          showMessages={true}
          showCountdown={false}
          demoMode={false}
        />
      );
    }
    return null;
  }

  // Overige templates: simpele klik → preview afbeelding
  const [phase, setPhase] = useState<"idle" | "open">("idle");

  const handleComplete = () => {
    setPhase("open");
    onComplete?.();
  };

  if (phase === "open") {
    return (
      <div style={{ position: "absolute", inset: 0, overflowY: "auto", overflowX: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={templateImg} alt={templateName} style={{ width: "100%", display: "block" }} />
        <div style={{ background: "#f9f3ef", padding: "10px 8px 16px", borderTop: "1px solid #e0cbc3" }}>
          <div style={{ display: "flex", gap: 3, justifyContent: "center" }}>
            {["HOME", "DE LOCATIE", "CADEAUS", "BEVESTIGEN"].map(item => (
              <span key={item} style={{ fontSize: 6, letterSpacing: "0.06em", color: "#8B2635", fontFamily: "sans-serif", padding: "2.5px 4px", border: "0.5px solid #d4b9b0", borderRadius: 3 }}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div onClick={handleComplete} style={{ position: "absolute", inset: 0, cursor: "pointer", overflow: "hidden" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={templateImg} alt={templateName} style={{ width: "100%", display: "block", filter: "brightness(0.97)" }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: "linear-gradient(to top, rgba(249,243,239,0.95) 0%, transparent 100%)",
        padding: "32px 0 16px", textAlign: "center",
      }}>
        <p style={{ fontFamily: "sans-serif", fontSize: "clamp(6px,1vw,8px)", letterSpacing: "0.22em", textTransform: "uppercase", color: "#8B2635", opacity: 0.75 }}>
          Tik om te openen
        </p>
      </div>
    </div>
  );
}
