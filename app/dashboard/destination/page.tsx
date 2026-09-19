"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/Layout";
import { MapPin, Plane, Hotel, Info, ExternalLink, Save, Check } from "lucide-react";

const DESTINATION_LOCATIONS = [
  { id: "toscane", name: "Toscane, Italië", emoji: "🇮🇹", popular: true },
  { id: "provence", name: "Provence, Frankrijk", emoji: "🇫🇷", popular: true },
  { id: "santorini", name: "Santorini, Griekenland", emoji: "🇬🇷", popular: true },
  { id: "algarve", name: "Algarve, Portugal", emoji: "🇵🇹", popular: true },
  { id: "andalucie", name: "Andalusië, Spanje", emoji: "🇪🇸", popular: true },
  { id: "mallorca", name: "Mallorca, Spanje", emoji: "🇪🇸", popular: false },
  { id: "lake_como", name: "Comomeer, Italië", emoji: "🇮🇹", popular: false },
  { id: "costa_rica", name: "Costa Rica", emoji: "🇨🇷", popular: false },
  { id: "bali", name: "Bali, Indonesië", emoji: "🇮🇩", popular: false },
  { id: "custom", name: "Andere locatie", emoji: "🌍", popular: false },
];

export default function DestinationPage() {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [customLocation, setCustomLocation] = useState("");
  const [flightInfo, setFlightInfo] = useState("");
  const [hotelInfo, setHotelInfo] = useState("");
  const [tipsInfo, setTipsInfo] = useState("");
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const ta = (v: string, s: (v: string) => void, p: string) => (
    <textarea value={v} onChange={e => s(e.target.value)} rows={4} placeholder={p} style={{ border: "1.5px solid #e0dbd7", borderRadius: 10, padding: "11px 14px", fontFamily: "sans-serif", fontSize: 13, color: "#16161D", outline: "none", background: "white", width: "100%", boxSizing: "border-box", resize: "vertical" }} />
  );

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "28px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: "serif", fontSize: 28, color: "#16161D", marginBottom: 4 }}>Destination Wedding</h1>
            <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#9a8e88" }}>Praktische informatie voor jullie gasten</p>
          </div>
          <button onClick={save} style={{ display: "flex", alignItems: "center", gap: 6, background: "#8B2635", color: "white", border: "none", borderRadius: 999, padding: "10px 20px", fontFamily: "sans-serif", fontSize: 13, cursor: "pointer" }}>
            {saved ? <><Check size={14} /> Opgeslagen</> : <><Save size={14} /> Opslaan</>}
          </button>
        </div>

        {/* Locatiekeuze */}
        <div style={{ background: "white", borderRadius: 16, border: "1px solid #ece8e4", padding: 24, marginBottom: 20 }}>
          <h2 style={{ fontFamily: "serif", fontSize: 20, color: "#16161D", marginBottom: 16 }}>Locatie</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))", gap: 10 }}>
            {DESTINATION_LOCATIONS.map(loc => (
              <button key={loc.id} onClick={() => setSelectedLocation(loc.id)} style={{ padding: "12px", borderRadius: 12, border: `1.5px solid ${selectedLocation === loc.id ? "#8B2635" : "#e0dbd7"}`, background: selectedLocation === loc.id ? "#fdf6f4" : "white", cursor: "pointer", textAlign: "left" }}>
                <span style={{ fontSize: 18, marginRight: 6 }}>{loc.emoji}</span>
                <span style={{ fontFamily: "sans-serif", fontSize: 13, color: "#16161D" }}>{loc.name}</span>
                {loc.popular && <span style={{ fontFamily: "sans-serif", fontSize: 10, color: "#8B2635", marginLeft: 6 }}>★ populair</span>}
              </button>
            ))}
          </div>
          {selectedLocation === "custom" && (
            <div style={{ marginTop: 12 }}>
              <input value={customLocation} onChange={e => setCustomLocation(e.target.value)} placeholder="Naam van de locatie" style={{ border: "1.5px solid #e0dbd7", borderRadius: 10, padding: "11px 14px", fontFamily: "sans-serif", fontSize: 13, width: "100%", boxSizing: "border-box", outline: "none" }} />
            </div>
          )}
        </div>

        {/* Vluchten */}
        <div style={{ background: "white", borderRadius: 16, border: "1px solid #ece8e4", padding: 24, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <Plane size={18} style={{ color: "#8B2635" }} />
            <h2 style={{ fontFamily: "serif", fontSize: 20, color: "#16161D" }}>Vluchten & Vervoer</h2>
          </div>
          {ta(flightInfo, setFlightInfo, "Informatie over de beste vluchten, luchthavens, treinen of andere vervoersmogelijkheden naar de bestemming...")}
        </div>

        {/* Hotels */}
        <div style={{ background: "white", borderRadius: 16, border: "1px solid #ece8e4", padding: 24, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <Hotel size={18} style={{ color: "#8B2635" }} />
            <h2 style={{ fontFamily: "serif", fontSize: 20, color: "#16161D" }}>Accommodatie</h2>
          </div>
          {ta(hotelInfo, setHotelInfo, "Aanbevolen hotels, vakantiehuizen of accommodaties in de buurt van de locatie. Voeg eventueel een groepskorting of reserveringslink toe...")}
        </div>

        {/* Tips */}
        <div style={{ background: "white", borderRadius: 16, border: "1px solid #ece8e4", padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <Info size={18} style={{ color: "#8B2635" }} />
            <h2 style={{ fontFamily: "serif", fontSize: 20, color: "#16161D" }}>Tips & Informatie</h2>
          </div>
          {ta(tipsInfo, setTipsInfo, "Handige tips over het klimaat, dresscode, lokale gewoonten, currency, wat te zien en doen in de omgeving...")}
        </div>
      </div>
    </DashboardLayout>
  );
}
