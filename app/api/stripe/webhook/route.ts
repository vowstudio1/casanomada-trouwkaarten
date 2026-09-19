import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ error: 'Stripe niet geconfigureerd' }, { status: 400 });
  }

  try {
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeKey);
    const body = await req.text();
    const sig = req.headers.get('stripe-signature')!;
    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as { id: string; metadata?: { wedding_id?: string; user_id?: string; package?: string } };
      const { wedding_id, user_id, package: pkg } = session.metadata || {};
      const supabase = getSupabaseAdmin();

      await supabase.from('payments').update({
        status: 'paid', paid_at: new Date().toISOString(),
      }).eq('stripe_session_id', session.id);

      if (wedding_id) {
        await supabase.from('weddings').update({
          status: 'paid', package: pkg,
        }).eq('id', wedding_id);

        // Notificatie
        if (user_id) {
          await supabase.from('notifications').insert({
            user_id, wedding_id,
            type: 'payment_success',
            title: 'Betaling ontvangen!',
            message: 'Je uitnodiging kan nu gepubliceerd worden.',
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 400 });
  }
}
