import Stripe from 'stripe';
import { NextResponse } from 'next/server';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_placeholder', { apiVersion: '2023-10-16' });
export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_placeholder') {
    return NextResponse.json({ error: "Stripe niet geconfigureerd" }, { status: 503 });
  }
  const { plan } = await req.json();
  const amounts: Record<string, number> = { collectie: 8900, destination: 14900, opmaat: 24900 };
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card', 'ideal'],
    line_items: [{ price_data: { currency: 'eur', product_data: { name: `Casanomada ${plan}` }, unit_amount: amounts[plan] || 8900 }, quantity: 1 }],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/pricing`,
  });
  return NextResponse.json({ url: session.url });
}