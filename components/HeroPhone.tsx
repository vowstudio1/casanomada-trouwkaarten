"use client";
import { useState } from "react";

const BLOOM_LOCAL = "/assets/templates/bloom.jpg";
const BLOOM_FALLBACK = "https://sponsalia.app/assets/marketing/templates/bloom-en-vetrina-96e6b193.jpg";

export default function HeroPhone() {
  const [imgError, setImgError] = useState(false);

  return (
    <div style={{ position: "relative", width: 280, height: 560 }}>
      {/* Telefoon frame */}
      <div style={{ position: "absolute", inset: 0, borderRadius: 40, background: "#1a1a1a", boxShadow: "0 40px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.08)", overflow: "hidden" }}>
        {/* Notch */}
        <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", width: 80, height: 24, background: "#1a1a1a", borderRadius: 12, zIndex: 10 }} />
        {/* Scherm */}
        <div style={{ position: "absolute", inset: 4, borderRadius: 36, overflow: "hidden", background: "#f5ede8" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgError ? BLOOM_FALLBACK : BLOOM_LOCAL}
            alt="Bloom sjabloon preview"
            onError={() => setImgError(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          {/* Overlay met namen */}
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", padding: "0 20px 40px", background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)" }}>
            <p style={{ fontFamily: "sans-serif", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.8)", marginBottom: 4 }}>Met liefde uitgenodigd</p>
            <p style={{ fontFamily: "serif", fontSize: 20, color: "white", textAlign: "center", lineHeight: 1.2 }}>Emma & Lucas</p>
            <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>14 juni 2025 · Landgoed De Hooge Vuursche</p>
          </div>
          {/* Tik om te openen hint */}
          <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", background: "rgba(139,38,53,0.9)", borderRadius: 999, padding: "4px 12px" }}>
            <p style={{ fontFamily: "sans-serif", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "white" }}>Tik om te openen</p>
          </div>
        </div>
      </div>
      {/* Decoratieve elementen */}
      <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(139,38,53,0.08)", zIndex: -1 }} />
      <div style={{ position: "absolute", bottom: -30, left: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(139,38,53,0.05)", zIndex: -1 }} />
    </div>
  );
}
