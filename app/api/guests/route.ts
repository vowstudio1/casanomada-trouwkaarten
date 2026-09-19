import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

async function getUserFromRequest(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) throw new Error("Geen token");
  const { data: { user }, error } = await getSupabaseAdmin().auth.getUser(token);
  if (error || !user) throw new Error("Ongeldig token");
  return user.id;
}

// POST: Voeg gasten toe aan een uitnodiging
export async function POST(req: NextRequest) {
  try {
    const userId = await getUserFromRequest(req);
    const { invitation_id, guests } = await req.json();
    const supabase = getSupabaseAdmin();

    // Controleer of uitnodiging van deze user is
    const { data: inv } = await supabase
      .from("invitations").select("id").eq("id", invitation_id).eq("user_id", userId).single();
    if (!inv) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });

    // Maak unieke token per gast
    const rows = guests.map((g: { name: string; email?: string; language?: string }) => ({
      invitation_id,
      name: g.name,
      email: g.email || null,
      language: g.language || "nl",
      token: crypto.randomBytes(8).toString("hex"), // bijv. "a1b2c3d4e5f6g7h8"
    }));

    const { data, error } = await supabase.from("guests").insert(rows).select();
    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// GET: Haal alle gasten op voor een uitnodiging
export async function GET(req: NextRequest) {
  try {
    const userId = await getUserFromRequest(req);
    const invId = new URL(req.url).searchParams.get("invitation_id");
    const supabase = getSupabaseAdmin();

    // Verificeer eigenaar
    const { data: inv } = await supabase
      .from("invitations").select("id").eq("id", invId).eq("user_id", userId).single();
    if (!inv) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });

    const { data } = await supabase
      .from("guests")
      .select("*, rsvp(*)")
      .eq("invitation_id", invId)
      .order("created_at");

    return NextResponse.json(data || []);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
