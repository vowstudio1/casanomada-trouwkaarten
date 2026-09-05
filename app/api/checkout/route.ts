import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY || "sk_placeholder";
const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" });

export async function POST(req: NextRequest) {
  if (stripeKey === "sk_placeholder") {
    return NextResponse.json(
      { error: "Stripe is nog niet geconfigureerd." },
      { status: 503 }
    );
  }

  try {
    const { priceId, planName } = await req.json();
    const siteUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "ideal"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: `${planName} — Digitale Trouwkaart` },
            unit_amount: priceId,
          },
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Onbekende fout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
