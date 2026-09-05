import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
export const metadata = { title: 'Casanomada Trouwkaarten | Digitale Uitnodigingen', description: 'Jullie mooiste uitnodiging, jullie eenvoudigste reacties.' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-cream-50 text-charcoal-900 font-sans antialiased">{children}</body>
    </html>
  );
}