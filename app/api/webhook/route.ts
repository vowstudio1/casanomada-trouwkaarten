import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY || "sk_placeholder";
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" });

export async function POST(req: NextRequest) {
  if (stripeKey === "sk_placeholder") {
    return NextResponse.json({ error: "Niet geconfigureerd" }, { status: 503 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Ongeldige handtekening" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    // TODO: update Supabase — markeer de uitnodiging als betaald
    console.log("Betaling voltooid:", session.id);
  }

  return NextResponse.json({ received: true });
}
