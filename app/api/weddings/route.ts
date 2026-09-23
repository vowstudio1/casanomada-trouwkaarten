import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, getUserFromToken } from '@/lib/supabase-server';

async function getAuth(req: NextRequest) {
  // Optie 1: X-User-Id header (bij registratie flow)
  const userId = req.headers.get('x-user-id');
  if (userId) {
    const supabase = getSupabaseAdmin();
    const { data: { user }, error } = await supabase.auth.admin.getUserById(userId);
    if (error || !user) throw new Error('Gebruiker niet gevonden');
    return user;
  }

  // Optie 2: Bearer JWT token (bij ingelogde gebruikers)
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) throw new Error('Geen authenticatie');
  return getUserFromToken(token);
}

export async function GET(req: NextRequest) {
  try {
    const user = await getAuth(req);
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('weddings')
      .select(`*, events(*), guests(count), rsvps(count), photos(count), messages(count)`)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuth(req);
    const body = await req.json();
    const supabase = getSupabaseAdmin();

    // Genereer slug
    const baseSlug = `${body.partner1_first}-${body.partner2_first}`
      .toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    let slug = baseSlug;
    let count = 0;
    while (true) {
      const { data: existing } = await supabase.from('weddings').select('id').eq('slug', slug).single();
      if (!existing) break;
      count++;
      slug = `${baseSlug}-${count}`;
    }

    const { data, error } = await supabase.from('weddings').insert({
      user_id: user.id,
      partner1_first: body.partner1_first || '',
      partner2_first: body.partner2_first || '',
      partner1_last: body.partner1_last || '',
      partner2_last: body.partner2_last || '',
      display_name: body.display_name,
      wedding_date: body.wedding_date,
      wedding_time: body.wedding_time,
      city: body.city,
      venue: body.venue,
      address: body.address,
      country: body.country || 'Nederland',
      template_slug: body.template_slug || 'bloom',
      language: body.language || 'nl',
      slug,
      status: 'draft',
    }).select().single();

    if (error) throw error;

    // Maak hoofd-event aan
    if (body.wedding_date) {
      await supabase.from('events').insert({
        wedding_id: data.id,
        name: 'Huwelijksceremonie',
        event_date: body.wedding_date,
        start_time: body.wedding_time,
        venue: body.venue,
        address: body.address,
        city: body.city,
        is_main: true,
        sort_order: 0,
      });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getAuth(req);
    const body = await req.json();
    const supabase = getSupabaseAdmin();
    const { id, ...updates } = body;

    const { data, error } = await supabase
      .from('weddings')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id).eq('user_id', user.id)
      .select().single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
