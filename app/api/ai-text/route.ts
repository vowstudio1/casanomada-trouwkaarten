import { NextResponse } from 'next/server';
import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'sk-placeholder' });
export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-placeholder') {
    return NextResponse.json({ error: "OpenAI niet geconfigureerd" }, { status: 503 });
  }
  const { prompt, tone, language } = await req.json();
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: `Je bent een bruiloftsschrijver. Toon: ${tone || 'elegant'}. Taal: ${language || 'nl'}.` },
      { role: "user", content: prompt }
    ],
  });
  return NextResponse.json({ text: completion.choices[0].message.content });
}