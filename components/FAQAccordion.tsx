"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  { q: "Wanneer betaal ik? Kan ik de uitnodiging eerst zien?", a: "Je maakt de uitnodiging zonder te betalen en zonder kaart: wat je ziet is de echte, afgewerkte uitnodiging, geen schets. Zolang hij niet gepubliceerd is, zien alleen jullie hem. Je betaalt €89, één keer, om hem te publiceren en zichtbaar te maken voor jullie gasten." },
  { q: "Wat kost het? Zijn er abonnementen?", a: "€89, een eenmalige betaling om jullie uitnodiging te publiceren. Geen abonnementen en geen terugkerende kosten, met onbeperkte uitnodigingen — één voor elke gast." },
  { q: "Hoe lang duurt het voordat hij klaar is?", a: "Een paar minuten. Kies een thema, vul jullie gegevens in en publiceer met één klik. Je kunt alles op elk moment aanpassen, ook na het publiceren." },
  { q: "Kunnen gasten hun aanwezigheid bevestigen (RSVP)?", a: "Natuurlijk. Elke uitnodiging bevat het RSVP-formulier, de gastenlijst en de bevestigingen op één plek, zodat je altijd weet wie heeft gereageerd." },
  { q: "Heb ik technische kennis nodig?", a: "Nee. De editor is voor iedereen gemaakt: je schrijft de teksten en het resultaat is meteen elegant en geoptimaliseerd voor smartphones." },
  { q: "In welke talen kan de uitnodiging zijn?", a: "Elke gast ziet de uitnodiging automatisch in zijn eigen taal: je beheert één enkele uitnodiging en iedereen leest hem zoals hij wil." },
  { q: "Hoe stuur ik de uitnodigingen naar mijn gasten?", a: "Deel de persoonlijke link van elke uitnodiging via WhatsApp, Instagram of waar je maar wilt — ook per e-mail of bericht. Geen drukwerk, geen portokosten." },
  { q: "Sommige gasten komen naar het diner en anderen alleen naar de receptie: moet ik twee uitnodigingen maken?", a: "Nee, één is genoeg. Verdeel de bruiloft in momenten en kies wie waarvoor is uitgenodigd: iedere gast ziet op zijn eigen uitnodiging alleen de momenten waarvoor je hem hebt uitgenodigd." },
];

export default function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-gray-100">
      {faqs.map((faq, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between py-6 text-left group"
            aria-expanded={open === i}
          >
            <span className="font-serif text-lg text-[#16161D] pr-4 group-hover:text-brand-800 transition-colors">
              {faq.q}
            </span>
            <span className="shrink-0 text-brand-800/40 group-hover:text-brand-800 transition-colors">
              {open === i ? <Minus size={18} /> : <Plus size={18} />}
            </span>
          </button>
          <div
            className="accordion-content"
            style={{ maxHeight: open === i ? "500px" : "0", opacity: open === i ? 1 : 0 }}
          >
            <p className="pb-6 font-sans text-sm text-text-muted leading-relaxed">{faq.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}