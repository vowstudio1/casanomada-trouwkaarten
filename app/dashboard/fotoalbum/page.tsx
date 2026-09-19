"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/Layout";
import { Trash2, Download, Eye, ImageOff, Images } from "lucide-react";

type Photo = { id: string; url: string; uploader_name: string; created_at: string; };

export default function FotoalbumPage() {
  const router = useRouter();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [weddingId, setWeddingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push("/login"); return; }
      const res = await fetch("/api/weddings", { headers: { Authorization: `Bearer ${session.access_token}` } });
      const ws = await res.json();
      if (ws[0]) {
        setWeddingId(ws[0].id);
        const { data } = await supabase.from("photos").select("*").eq("wedding_id", ws[0].id).order("created_at", { ascending: false });
        setPhotos(data || []);
      }
      setLoading(false);
    });
  }, [router]);

  const deletePhoto = async (id: string, url: string) => {
    if (!confirm("Foto verwijderen?")) return;
    const path = url.split("/wedding-photos/")[1];
    if (path) await supabase.storage.from("wedding-photos").remove([path]);
    await supabase.from("photos").delete().eq("id", id);
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  if (loading) return <DashboardLayout><div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "50vh" }}><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style><div style={{ width: 32, height: 32, border: "2px solid #8B2635", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "28px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: "serif", fontSize: 28, color: "#16161D", marginBottom: 4 }}>Fotoalbum</h1>
            <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#9a8e88" }}>{photos.length} foto's gedeeld door jullie gasten</p>
          </div>
          {photos.length > 0 && (
            <button style={{ display: "flex", alignItems: "center", gap: 6, background: "white", border: "1.5px solid #e0dbd7", borderRadius: 999, padding: "10px 18px", fontFamily: "sans-serif", fontSize: 13, color: "#5a5550", cursor: "pointer" }}>
              <Download size={14} /> Alles downloaden
            </button>
          )}
        </div>

        {photos.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: 16, border: "1px solid #ece8e4" }}>
            <Images size={40} style={{ color: "#c0b8b4", margin: "0 auto 16px" }} />
            <p style={{ fontFamily: "serif", fontSize: 20, color: "#9a8e88", marginBottom: 8 }}>Nog geen foto's</p>
            <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#c0b8b4" }}>Gasten kunnen foto's uploaden via jullie uitnodiging</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {photos.map(photo => (
              <div key={photo.id} style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #ece8e4", background: "white", position: "relative", group: 1 }}>
                <div style={{ aspectRatio: "1", position: "relative", overflow: "hidden" }}>
                  <img src={photo.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, opacity: 0, transition: "opacity 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "0")}>
                    <button onClick={() => setSelected(photo.url)} style={{ background: "white", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Eye size={14} style={{ color: "#16161D" }} />
                    </button>
                    <button onClick={() => deletePhoto(photo.id, photo.url)} style={{ background: "white", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Trash2 size={14} style={{ color: "#8B2635" }} />
                    </button>
                  </div>
                </div>
                <div style={{ padding: "10px 12px" }}>
                  <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#5a5550" }}>{photo.uploader_name || "Anoniem"}</p>
                  <p style={{ fontFamily: "sans-serif", fontSize: 10, color: "#c0b8b4" }}>{new Date(photo.created_at).toLocaleDateString("nl-NL")}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox */}
        {selected && (
          <div onClick={() => setSelected(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <img src={selected} alt="" style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", borderRadius: 8 }} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
