// app/api/invitations/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// --- Types ---

interface InvitationInsert {
  template_slug: string;
  partner1_name?: string;
  partner2_name?: string;
  wedding_date?: string;
  location_name?: string;
  location_city?: string;
  message?: string;
  dresscode?: string;
  wedding_time?: string;
  theme_color?: string;
}

interface InvitationRow extends InvitationInsert {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
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

// --- Auth helper ---

async function getUserFromRequest(req: NextRequest): Promise<string> {
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Missing or invalid Authorization header");
  }

  const token = authHeader.replace("Bearer ", "");
  const supabase = getSupabaseAdmin();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    throw new Error("Invalid or expired token");
  }

  return user.id;
}

// --- POST: Create a new invitation ---

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserFromRequest(req);
    const body: InvitationInsert = await req.json();

    if (!body.template_slug) {
      return NextResponse.json(
        { error: "template_slug is required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("invitations")
      .insert({
        user_id: userId,
        template_slug: body.template_slug,
        partner1_name: body.partner1_name ?? null,
        partner2_name: body.partner2_name ?? null,
        wedding_date: body.wedding_date ?? null,
        location_name: body.location_name ?? null,
        location_city: body.location_city ?? null,
        message: body.message ?? null,
        dresscode: body.dresscode ?? "Geen voorkeur",
        wedding_time: body.wedding_time ?? null,
        theme_color: body.theme_color ?? "#59262F",
      })
      .select()
      .single();

    if (error) {
      console.error("Insert invitation error:", error);
      return NextResponse.json(
        { error: "Failed to create invitation" },
        { status: 500 }
      );
    }

    return NextResponse.json(data as InvitationRow, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    const status = message.includes("token") || message.includes("Authorization")
      ? 401
      : 500;

    return NextResponse.json({ error: message }, { status });
  }
}

// --- GET: Get all invitations for the authenticated user ---

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserFromRequest(req);
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("invitations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch invitations error:", error);
      return NextResponse.json(
        { error: "Failed to fetch invitations" },
        { status: 500 }
      );
    }

    return NextResponse.json(data as InvitationRow[]);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    const status = message.includes("token") || message.includes("Authorization")
      ? 401
      : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
