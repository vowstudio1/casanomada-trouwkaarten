import type { Metadata } from "next";
import { Cormorant_Garamond, Roboto } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

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
    <html lang="nl" className={cormorant.variable + " " + roboto.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
