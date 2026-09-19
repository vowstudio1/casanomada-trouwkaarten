import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Casa Nomada | Digitale Trouwkaarten",
    template: "%s | Casa Nomada",
  },
  description: "Maak in enkele minuten een elegante digitale trouwkaart. Gratis voorbeeld, publiceren met een klik, en elke gast krijgt de zijne in zijn eigen taal.",
  keywords: ["digitale trouwkaarten", "trouwuitnodiging", "online uitnodiging", "bruiloft", "RSVP", "wedding invitation", "Casa Nomada"],
  authors: [{ name: "Casa Nomada Digital" }],
  openGraph: {
    title: "Casa Nomada | Digitale Trouwkaarten",
    description: "Elegante digitale trouwkaarten met AI-personalisatie, meertalige RSVP en tafelindeling.",
    url: "https://casanomada-trouwkaarten.netlify.app",
    siteName: "Casa Nomada",
    locale: "nl_NL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Casa Nomada | Digitale Trouwkaarten",
    description: "Elegante digitale trouwkaarten met AI-personalisatie.",
  },
  robots: { index: true, follow: true },
  metadataBase: new URL("https://casanomada-trouwkaarten.netlify.app"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: "'Inter', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
