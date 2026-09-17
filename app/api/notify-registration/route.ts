import { NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error("Notify error: RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: "Emailservice is niet geconfigureerd" },
        { status: 503 },
      );
    }

    const resend = new Resend(apiKey);
    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ error: "Naam en email zijn verplicht" }, { status: 400 });
    }

    const now = new Date().toLocaleString("nl-NL", {
      timeZone: "Europe/Amsterdam",
      dateStyle: "full",
      timeStyle: "short",
    });

    await resend.emails.send({
      from: "Casa Nomada Trouwkaarten <noreply@casanomadadigital.com>",
      to: "casanomada.digital@gmail.com",
      subject: `Nieuwe aanmelding: ${name}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 500px; margin: 0 auto; padding: 32px; background: #FAFAF8; border: 1px solid #E8E6E3; border-radius: 12px;">
          <h1 style="color: #59262F; font-size: 22px; margin-bottom: 4px;">Nieuwe klant aangemeld</h1>
          <p style="color: #9c9789; font-size: 13px; margin-top: 0;">${now}</p>
          <hr style="border: none; border-top: 1px solid #E8E6E3; margin: 20px 0;" />
          <table style="width: 100%; font-size: 15px; color: #16161D;">
            <tr><td style="padding: 8px 0; color: #6B6B76;">Naam</td><td style="padding: 8px 0; font-weight: 600;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #6B6B76;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #59262F;">${email}</a></td></tr>
          </table>
          <hr style="border: none; border-top: 1px solid #E8E6E3; margin: 20px 0;" />
          <p style="font-size: 12px; color: #9c9789; text-align: center;">Casa Nomada Trouwkaarten</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notify error:", error);
    return NextResponse.json({ error: "Email versturen mislukt" }, { status: 500 });
  }
}
