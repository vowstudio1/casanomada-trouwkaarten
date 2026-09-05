import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { names, date, venue, style } = body as {
      names: string;
      date:  string;
      venue: string;
      style: string;
    };

    if (!names || !date || !venue) {
      return NextResponse.json(
        { error: "names, date en venue zijn verplicht." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    // Return placeholder when no API key is set
    if (!apiKey || apiKey === "your_openai_api_key") {
      return NextResponse.json({
        text: `Lieve familie en vrienden,\n\nMet veel vreugde nodigen wij — ${names} — jullie uit om onze huwelijksdag te vieren op ${date} in ${venue}.\n\nMet liefde,\n${names}`,
        generated: false,
      });
    }

    // Dynamic import so build works without OPENAI_API_KEY
    const { default: OpenAI } = await import("openai");
    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model:      "gpt-4o-mini",
      max_tokens: 300,
      messages: [
        {
          role:    "system",
          content: "Je bent een professionele schrijver voor trouwuitnodigingen. Schrijf warme, persoonlijke en elegante teksten in het Nederlands.",
        },
        {
          role:    "user",
          content: `Schrijf een korte, persoonlijke uitnodigingstekst voor:\n- Namen: ${names}\n- Datum: ${date}\n- Locatie: ${venue}\n- Stijl: ${style || "romantisch en elegant"}\n\nMax 120 woorden.`,
        },
      ],
    });

    const text = completion.choices[0]?.message?.content ?? "";
    return NextResponse.json({ text, generated: true });
  } catch (err) {
    console.error("AI text error:", err);
    return NextResponse.json({ error: "Er is een fout opgetreden." }, { status: 500 });
  }
}
