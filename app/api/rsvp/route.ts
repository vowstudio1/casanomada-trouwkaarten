// app/api/rsvp/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// --- Types ---

interface RsvpInsert {
  invitation_id: string;
  attending: boolean;
  guest_count?: number;
  guest_names?: string;
  dietary?: string[];
  dietary_other?: string;
  children_count?: number;
  message?: string;
}

interface RsvpRow extends RsvpInsert {
  id: string;
  created_at: string;
}

// --- Supabase admin client (service role) ---

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// --- POST: Submit an RSVP response (no auth required) ---

export async function POST(req: NextRequest) {
  try {
    const body: RsvpInsert = await req.json();

    if (!body.invitation_id) {
      return NextResponse.json(
        { error: "invitation_id is required" },
        { status: 400 }
      );
    }

    if (typeof body.attending !== "boolean") {
      return NextResponse.json(
        { error: "attending (boolean) is required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Verify the invitation exists
    const { data: invitation, error: invError } = await supabase
      .from("invitations")
      .select("id")
      .eq("id", body.invitation_id)
      .single();

    if (invError || !invitation) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      );
    }

    const { data, error } = await supabase
      .from("rsvp_responses")
      .insert({
        invitation_id: body.invitation_id,
        attending: body.attending,
        guest_count: body.guest_count ?? 1,
        guest_names: body.guest_names ?? null,
        dietary: body.dietary ?? [],
        dietary_other: body.dietary_other ?? null,
        children_count: body.children_count ?? 0,
        message: body.message ?? null,
      })
      .select()
      .single();

    if (error) {
      console.error("Insert RSVP error:", error);
      return NextResponse.json(
        { error: "Failed to save RSVP response" },
        { status: 500 }
      );
    }

    return NextResponse.json(data as RsvpRow, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// --- GET: Get RSVP responses for an invitation ---

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const invitationId = searchParams.get("invitation_id");

    if (!invitationId) {
      return NextResponse.json(
        { error: "invitation_id query parameter is required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("rsvp_responses")
      .select("*")
      .eq("invitation_id", invitationId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch RSVP error:", error);
      return NextResponse.json(
        { error: "Failed to fetch RSVP responses" },
        { status: 500 }
      );
    }

    // Summary stats
    const total = data.length;
    const attending = data.filter((r) => r.attending).length;
    const declined = total - attending;
    const totalGuests = data
      .filter((r) => r.attending)
      .reduce((sum, r) => sum + (r.guest_count ?? 1), 0);
    const totalChildren = data
      .filter((r) => r.attending)
      .reduce((sum, r) => sum + (r.children_count ?? 0), 0);

    return NextResponse.json({
      responses: data as RsvpRow[],
      summary: {
        total,
        attending,
        declined,
        total_guests: totalGuests,
        total_children: totalChildren,
      },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
