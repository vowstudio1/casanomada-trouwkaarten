import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserFromRequest(req);
    const { invitation_id } = await req.json();
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("invitations")
      .update({ published: true, paid: true })
      .eq("id", invitation_id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
