import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken, getSupabaseAdmin } from '@/lib/supabase-server';
import { PACKAGES, APP_URL } from '@/lib/config';

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
    const user = await getUserFromToken(token);
    const { wedding_id, package: pkg } = await req.json();

    const packageConfig = PACKAGES[pkg as keyof typeof PACKAGES];
    if (!packageConfig) return NextResponse.json({ error: 'Ongeldig pakket' }, { status: 400 });

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      // Tijdelijk: zonder Stripe direct naar Tikkie
      return NextResponse.json({ 
        tikkie_url: 'https://tikkie.me/pay/ch43q8tuu0jco3beatpf',
        package: pkg,
        price: packageConfig.price
      });
    }

    // Stripe Checkout session
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeKey);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'ideal'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Casa Nomada — ${packageConfig.name}`,
            description: 'Digitale trouwkaart platform',
          },
          unit_amount: packageConfig.price * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${APP_URL}/dashboard/billing?success=1&wedding_id=${wedding_id}`,
      cancel_url: `${APP_URL}/dashboard/billing?cancelled=1`,
      metadata: { wedding_id, user_id: user.id, package: pkg },
      customer_email: user.email,
    });

    // Sla betaling op als pending
    const supabase = getSupabaseAdmin();
    await supabase.from('payments').insert({
      wedding_id,
      user_id: user.id,
      stripe_session_id: session.id,
      amount: packageConfig.price * 100,
      status: 'pending',
      package: pkg,
    });

    return NextResponse.json({ checkout_url: session.url });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
