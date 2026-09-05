"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "Hoe lang duurt het om een uitnodiging te maken?",
    a: "Met onze AI-assistent heeft u binnen 10 minuten een gepersonaliseerde uitnodiging klaar. Kies een sjabloon, voer uw details in en de AI doet de rest.",
  },
  {
    q: "Kunnen gasten online RSVP geven?",
    a: "Ja, elke uitnodiging bevat een ingebouwde RSVP-pagina. Gasten kunnen direct bevestigen, dieetwensen doorgeven en vragen stellen. U ziet alles real-time in uw dashboard.",
  },
  {
    q: "Werkt het ook op mobiele telefoons?",
    a: "Absoluut. Al onze uitnodigingen zijn volledig responsief en geoptimaliseerd voor mobiel. Ze zijn ook deelbaar via WhatsApp, e-mail en sociale media.",
  },
  {
    q: "Kan ik meerdere talen gebruiken?",
    a: "Ja, onze Premium- en Luxe-pakketten ondersteunen meertalige uitnodigingen. Gasten kunnen zelf de taal kiezen (NL, EN, FR, DE, ES en meer).",
  },
  {
    q: "Wat gebeurt er na de bruiloft?",
    a: "Uw uitnodigingspagina blijft 12 maanden actief. Daarna kunt u alle gegevens exporteren als PDF-geheugenboek. Uw herinneringen zijn veilig bij ons.",
  },
  {
    q: "Is er een refundbeleid?",
    a: "Wij bieden 14 dagen niet-goed-geld-terug garantie. Als u niet tevreden bent, retourneren wij het volledige bedrag zonder vragen.",
  },
  {
    q: "Hoe werkt de AI-tafelindeling?",
    a: "Voer uw gastenlijst in met hun relaties en voorkeuren. Onze AI analyseert de verbanden en genereert een optimale tafelindeling. U kunt daarna alles handmatig aanpassen.",
  },
  {
    q: "Kan ik mijn eigen foto's uploaden?",
    a: "Ja, alle pakketten bieden onbeperkte foto-uploads. U kunt uw eigen foto's integreren in het ontwerp, een gallerij toevoegen en een fotoboek voor gasten aanmaken.",
  },
];

export default function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-gray-100 rounded-2xl border border-gray-100 overflow-hidden">
      {faqs.map((faq, i) => (
        <div key={i} className="bg-white">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-cream transition-colors"
            aria-expanded={open === i}
          >
            <span className="font-serif text-lg text-[#16161D] pr-4">{faq.q}</span>
            <span className="shrink-0 text-brand-800">
              {open === i ? <Minus size={18} /> : <Plus size={18} />}
            </span>
          </button>
          <div
            className="accordion-content"
            style={{ maxHeight: open === i ? "400px" : "0", opacity: open === i ? 1 : 0 }}
          >
            <p className="px-6 pb-5 text-text-muted leading-relaxed">{faq.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
