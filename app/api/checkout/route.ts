import { NextRequest, NextResponse } from "next/server";

const PRICES: Record<string, number> = {
  starter: 8900,   // €89 in cents
  premium: 14900,  // €149 in cents
  luxe:    24900,  // €249 in cents
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { plan, successUrl, cancelUrl } = body as {
      plan:       string;
      successUrl: string;
      cancelUrl:  string;
    };

    const amount = PRICES[plan?.toLowerCase()];
    if (!amount) {
      return NextResponse.json({ error: "Ongeldig pakket." }, { status: 400 });
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;

    // Return placeholder when no Stripe key is set
    if (!stripeKey || stripeKey === "your_stripe_secret_key") {
      return NextResponse.json({
        url:         successUrl ?? "/dashboard",
        placeholder: true,
        message:     "Stripe is niet geconfigureerd. Stel STRIPE_SECRET_KEY in.",
      });
    }

    // Dynamic import so build works without STRIPE_SECRET_KEY
    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" as any });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "ideal"],
      line_items: [
        {
          price_data: {
            currency:     "eur",
            unit_amount:  amount,
            product_data: {
              name:        `Casa Nomada Digital — ${plan.charAt(0).toUpperCase() + plan.slice(1)} pakket`,
              description: "Digitale trouwuitnodiging",
            },
          },
          quantity: 1,
        },
      ],
      mode:        "payment",
      success_url: successUrl ?? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url:  cancelUrl  ?? `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Er is een fout opgetreden bij het afrekenen." }, { status: 500 });
  }
}
