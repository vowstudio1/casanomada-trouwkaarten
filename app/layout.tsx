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
  title: "Casa Nomada Digital | Digitale Trouwkaarten",
  description:
    "Maak prachtige digitale trouwuitnodigingen met AI-personalisatie, gastenregistratie en meer. Vanaf €89.",
  keywords: "digitale trouwkaart, trouwuitnodiging, online uitnodiging, bruiloft",
  openGraph: {
    title: "Casa Nomada Digital | Digitale Trouwkaarten",
    description: "Prachtige digitale trouwuitnodigingen met AI-personalisatie.",
    type: "website",
    locale: "nl_NL",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className={`${cormorant.variable} ${roboto.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
