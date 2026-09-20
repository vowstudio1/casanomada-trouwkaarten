"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import BloomInvite from "@/components/BloomInvite";

type Wedding = {
  id: string;
  partner1_first: string; partner2_first: string;
  partner1_last:  string; partner2_last:  string;
  wedding_date:   string; wedding_time:   string;
  venue: string; city: string; address: string;
  welcome_message: string; template_slug: string;
  show_rsvp: boolean; show_photos: boolean;
  show_messages: boolean; show_countdown: boolean;
  primary_color: string; slug: string;
};
type WeddingEvent = {
  id: string; name: string;
  event_date: string; start_time: string; end_time: string;
  venue: string; city: string; description: string; is_main: boolean;
};
type Guest = { id: string; first_name: string; last_name: string; token: string; };

export default function InvitePage() {
  const params       = useParams();
  const searchParams = useSearchParams();
  const slug  = params.slug as string;
  const token = searchParams.get("t");

  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [events,  setEvents]  = useState<WeddingEvent[]>([]);
  const [guest,   setGuest]   = useState<Guest | null>(null);

  useEffect(() => {
    async function load() {
      const { data: w } = await supabase.from("weddings").select("*").eq("slug", slug).single();
      if (!w) return;
      setWedding(w);

      // Datum beschikbaar maken voor countdown in BloomInvite
      if (w.wedding_date) {
        (window as any).__bloomWeddingDate = w.wedding_date;
      }

      const { data: evs } = await supabase.from("events").select("*").eq("wedding_id", w.id).order("sort_order");
      setEvents(evs || []);

      if (token) {
        const { data: g } = await supabase.from("guests").select("*").eq("token", token).single();
        if (g) {
          setGuest(g);
          await supabase.from("guests")
            .update({ opened_at: new Date().toISOString(), status: "opened" })
            .eq("id", g.id);
        }
      }
    }
    load();
  }, [slug, token]);

  if (!wedding) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100svh", background: "#f3eeea" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width: 32, height: 32, border: "2px solid #cf8fa2", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );

  const namen    = `${wedding.partner1_first} & ${wedding.partner2_first}`;
  const datumLang = wedding.wedding_date
    ? new Date(wedding.wedding_date).toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "";

  const handleRsvp = async (attending: boolean, name: string, diet: string) => {
    await supabase.from("rsvps").insert({
      wedding_id: wedding.id,
      guest_id:   guest?.id || null,
      name, attending, diet, adults: 1,
    });
    if (guest) {
      await supabase.from("guests")
        .update({ status: attending ? "confirmed" : "declined" })
        .eq("id", guest.id);
    }
  };

  const handleMessage = async (text: string, authorName: string) => {
    await supabase.from("messages").insert({
      wedding_id:  wedding.id,
      author_name: authorName,
      content:     text,
      status:      "pending",
    });
  };

  return (
    <BloomInvite
      namen={namen}
      datumLang={datumLang}
      weddingTime={wedding.wedding_time}
      venue={wedding.venue}
      stad={wedding.city}
      address={wedding.address}
      welcomeMessage={wedding.welcome_message}
      events={events.map(e => ({ ...e }))}
      color={wedding.primary_color || "#8B2635"}
      showRsvp={wedding.show_rsvp}
      showPhotos={wedding.show_photos}
      showMessages={wedding.show_messages}
      showCountdown={wedding.show_countdown}
      onRsvp={handleRsvp}
      onMessage={handleMessage}
    />
  );
}
