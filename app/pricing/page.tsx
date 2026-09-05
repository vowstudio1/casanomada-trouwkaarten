import { Check } from "lucide-react";
const plans = [
  { name: "Collectie", price: "€89", features: ["Alle sjablonen", "RSVP in realtime", "Elke gast in zijn eigen taal", "Tot 2 momenten"], highlight: false },
  { name: "Destination Wedding", price: "€149", features: ["Alles uit Collectie", "Onbeperkt dagen", "Waar te slapen met hotels", "Aparte tafels per moment"], highlight: true },
  { name: "Op maat", price: "€249", features: ["Alles uit Collectie", "Eigen ontwerp", "4 correctierondes", "Klaar in 7 werkdagen"], highlight: false }
];
export default function PricingPage() {
  return (
    <main className="min-h-screen bg-cream-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl text-charcoal-900 mb-4">Drie pakketten, één betaling</h1>
          <p className="text-lg text-charcoal-800">Eén betaling, nooit een abonnement.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map((plan, i) => (
            <div key={i} className={`rounded-2xl p-8 relative ${plan.highlight ? 'bg-charcoal-900 text-cream-50 shadow-2xl' : 'bg-white border border-cream-200'}`}>
              {plan.highlight && <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-champagne-300 text-charcoal-900 text-xs font-bold px-4 py-1 rounded-full uppercase">Aanbevolen</span>}
              <h3 className="font-serif text-2xl mb-2">{plan.name}</h3>
              <span className="text-5xl font-serif">{plan.price}</span>
              <p className={`text-xs mt-1 uppercase tracking-wider ${plan.highlight ? 'text-cream-200' : 'opacity-70'}`}>EENMALIGE BETALING</p>
              <ul className="space-y-4 my-8">
                {plan.features.map((f, j) => (<li key={j} className="flex items-start gap-3 text-sm"><Check className="w-5 h-5 flex-shrink-0 text-champagne-300" /><span className={plan.highlight ? 'text-cream-100' : ''}>{f}</span></li>))}
              </ul>
              <button className={`w-full py-3 rounded-full font-medium transition ${plan.highlight ? 'bg-champagne-300 text-charcoal-900' : 'bg-charcoal-900 text-white'}`}>Kies {plan.name}</button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}