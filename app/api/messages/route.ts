import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  try {
    const { wedding_id, guest_token, author_name, content } = await req.json();
    if (!wedding_id || !author_name || !content) return NextResponse.json({ error: 'Verplichte velden ontbreken' }, { status: 400 });
    const supabase = getSupabaseAdmin();

    let guestId = null;
    if (guest_token) {
      const { data: guest } = await supabase.from('guests').select('id').eq('token', guest_token).single();
      if (guest) guestId = guest.id;
    }

    const { data, error } = await supabase.from('messages').insert({
      wedding_id, guest_id: guestId, author_name, content, status: 'approved',
    }).select().single();

    if (error) throw error;

    // Notificatie
    const { data: wedding } = await supabase.from('weddings').select('user_id').eq('id', wedding_id).single();
    if (wedding) {
      await supabase.from('notifications').insert({
        user_id: wedding.user_id, wedding_id,
        type: 'new_message',
        title: `Nieuw bericht van ${author_name}`,
        message: content.slice(0, 100),
      });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const weddingId = new URL(req.url).searchParams.get('wedding_id');
    const supabase = getSupabaseAdmin();
    const { data } = await supabase.from('messages').select('*').eq('wedding_id', weddingId).eq('status', 'approved').order('created_at', { ascending: false });
    return NextResponse.json(data || []);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
