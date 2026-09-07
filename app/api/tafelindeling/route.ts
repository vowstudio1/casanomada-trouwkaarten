import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { guests, seatsPerTable, instructions } = await req.json();

    const guestList = guests
      .split("\n")
      .map((g: string) => g.trim())
      .filter(Boolean);

    if (guestList.length === 0) {
      return NextResponse.json(
        { error: "Geen gasten opgegeven" },
        { status: 400 }
      );
    }

    const prompt = `Je bent een bruiloft-tafelindeling assistent. Verdeel deze ${guestList.length} gasten over tafels van maximaal ${seatsPerTable} personen.

Gasten:
${guestList.join("\n")}

${instructions ? "Speciale instructies: " + instructions : ""}

Geef het resultaat als een JSON object met een "tables" key die een array bevat in dit formaat:
{"tables": [{"name": "Tafelnaam", "guests": ["Gast 1", "Gast 2", ...]}]}

Gebruik creatieve tafelnamen (bijv. Italiaanse steden, bloemen, of sterrenbeelden). Zorg dat elke tafel maximaal ${seatsPerTable} gasten heeft. Elke gast moet precies één keer voorkomen.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      return NextResponse.json(
        { error: "Geen antwoord ontvangen van AI" },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(content);
    const tables = parsed.tables || parsed;

    return NextResponse.json({ tables });
  } catch (error: unknown) {
    console.error("Tafelindeling API error:", error);
    const message =
      error instanceof Error ? error.message : "Onbekende fout";
    return NextResponse.json(
      { error: "Er ging iets mis bij het genereren van de tafelindeling: " + message },
      { status: 500 }
    );
  }
}
