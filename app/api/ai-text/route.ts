import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY || "sk-placeholder";
const openai = new OpenAI({ apiKey });

export async function POST(req: NextRequest) {
  if (apiKey === "sk-placeholder") {
    return NextResponse.json(
      { error: "OpenAI is nog niet geconfigureerd." },
      { status: 503 }
    );
  }

  try {
    const { prompt, type } = await req.json();

    const systemPrompt =
      type === "table"
        ? "Je bent een AI-assistent die helpt met tafelindelingen voor bruiloften. Wees vriendelijk en precies. Antwoord in het Nederlands."
        : "Je bent een creatieve schrijver die prachtige teksten schrijft voor trouwuitnodigingen. Schrijf elegant en persoonlijk. Antwoord in het Nederlands.";

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      max_tokens: 1000,
    });

    return NextResponse.json({
      text: completion.choices[0]?.message?.content || "",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Onbekende fout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
