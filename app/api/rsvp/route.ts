import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { wedding_id, guest_token, name, attending, adults, children, diet, allergies, message, answers } = body;
    const supabase = getSupabaseAdmin();

    // Zoek gast op token
    let guestId = null;
    if (guest_token) {
      const { data: guest } = await supabase.from('guests').select('id').eq('token', guest_token).single();
      if (guest) {
        guestId = guest.id;
        await supabase.from('guests').update({
          status: attending ? 'confirmed' : 'declined',
          updated_at: new Date().toISOString(),
        }).eq('id', guest.id);
      }
    }

    const { data: rsvp, error } = await supabase.from('rsvps').insert({
      wedding_id, guest_id: guestId, name, attending,
      adults: adults || 1, children: children || 0,
      diet, allergies, message,
    }).select().single();

    if (error) throw error;

    // Sla antwoorden op custom vragen op
    if (answers && answers.length > 0) {
      await supabase.from('rsvp_answers').insert(
        answers.map((a: { question_id: string; answer: string }) => ({
          rsvp_id: rsvp.id, question_id: a.question_id, answer: a.answer,
        }))
      );
    }

    // Notificatie naar eigenaar
    const { data: wedding } = await supabase.from('weddings').select('user_id, partner1_first').eq('id', wedding_id).single();
    if (wedding) {
      await supabase.from('notifications').insert({
        user_id: wedding.user_id, wedding_id,
        type: 'new_rsvp',
        title: attending ? `${name} komt naar jullie bruiloft!` : `${name} kan helaas niet komen`,
        message: message || null,
      });
    }

    return NextResponse.json(rsvp, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
    
    const { getUserFromToken } = await import('@/lib/supabase-server');
    const user = await getUserFromToken(token);
    const weddingId = new URL(req.url).searchParams.get('wedding_id');
    const supabase = getSupabaseAdmin();

    const { data } = await supabase
      .from('rsvps')
      .select('*, rsvp_answers(*)')
      .eq('wedding_id', weddingId)
      .order('created_at', { ascending: false });

    return NextResponse.json(data || []);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
