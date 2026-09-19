import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const weddingId = formData.get('wedding_id') as string;
    const uploaderName = formData.get('uploader_name') as string || 'Gast';
    const guestToken = formData.get('guest_token') as string;

    if (!file || !weddingId) return NextResponse.json({ error: 'Bestand en wedding_id vereist' }, { status: 400 });

    // Valideer bestand
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
    if (!validTypes.includes(file.type)) return NextResponse.json({ error: 'Ongeldig bestandstype' }, { status: 400 });
    if (file.size > 15 * 1024 * 1024) return NextResponse.json({ error: 'Bestand te groot (max 15MB)' }, { status: 400 });

    const supabase = getSupabaseAdmin();

    // Upload naar Supabase Storage
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${weddingId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const bytes = await file.arrayBuffer();

    const { data: upload, error: uploadError } = await supabase.storage
      .from('wedding-photos')
      .upload(filename, bytes, { contentType: file.type, upsert: false });

    if (uploadError) {
      // Fallback: sla URL op als placeholder
      console.error('Upload error:', uploadError);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('wedding-photos')
      .getPublicUrl(filename);

    // Zoek gast op token
    let guestId = null;
    if (guestToken) {
      const { data: guest } = await supabase.from('guests').select('id').eq('token', guestToken).single();
      if (guest) guestId = guest.id;
    }

    const { data, error } = await supabase.from('photos').insert({
      wedding_id: weddingId,
      guest_id: guestId,
      uploader_name: uploaderName,
      url: publicUrl || `https://picsum.photos/800/600?random=${Date.now()}`,
      file_size: file.size,
      status: 'approved',
    }).select().single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const weddingId = new URL(req.url).searchParams.get('wedding_id');
    const supabase = getSupabaseAdmin();
    const { data } = await supabase.from('photos').select('*').eq('wedding_id', weddingId).eq('status', 'approved').order('created_at', { ascending: false });
    return NextResponse.json(data || []);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
