const templates = [
  { id: 1, name: "Volta Celeste", desc: "Geschilderde lucht en wit rankwerk.", color: "bg-blue-50" },
  { id: 2, name: "Strawberry Matcha", desc: "Fris en speels, matcha en aardbei.", color: "bg-green-50" },
  { id: 3, name: "Tratto d'Inchiostro", desc: "Penlijnen op papier.", color: "bg-stone-100" },
  { id: 4, name: "Toile de Jouy", desc: "Toile in vier tinten op crème papier.", color: "bg-rose-50" },
  { id: 5, name: "Idillio", desc: "Gouden strik en zwanen.", color: "bg-amber-50" },
  { id: 6, name: "Villa Cortina", desc: "Kant en kristal.", color: "bg-slate-100" },
  { id: 7, name: "Romantisch Botanisch", desc: "Bladeren en bloemen.", color: "bg-emerald-50" },
  { id: 8, name: "Tuscany Chic", desc: "Warm en verfijnd.", color: "bg-orange-50" },
  { id: 9, name: "De Geheime Tuin", desc: "Rozenboog en Italiaanse tuin.", color: "bg-pink-50" },
  { id: 10, name: "Betoverd Bos", desc: "Geschilderd bos en wilde rozen.", color: "bg-teal-50" },
  { id: 11, name: "Zomertuin", desc: "Groene tuin en roze kant.", color: "bg-lime-50" },
  { id: 12, name: "Het Zwanenmeer", desc: "Romantisch en luchtig.", color: "bg-sky-50" },
];
export default function TemplatesPage() {
  return (
    <main className="min-h-screen bg-cream-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl text-charcoal-900 mb-4">Kies je stijl</h1>
          <p className="text-lg text-charcoal-800">Zorgvuldig vormgegeven sjablonen voor de smartphone.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((t) => (
            <div key={t.id} className="group bg-white rounded-2xl overflow-hidden border border-cream-200 hover:shadow-2xl transition-all">
              <div className={`${t.color} h-64 flex items-center justify-center`}>
                <div className="text-center"><p className="font-serif text-2xl text-charcoal-900">Laura &amp; Marco</p><p className="text-xs text-champagne-300 mt-2 uppercase tracking-widest">19 · 06 · 2027</p></div>
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl text-charcoal-900 mb-2">{t.name}</h3>
                <p className="text-charcoal-800 text-sm mb-4 italic">{t.desc}</p>
                <button className="w-full px-4 py-2 bg-charcoal-900 text-white rounded-full text-sm hover:bg-champagne-300 hover:text-charcoal-900 transition">Gebruik dit ontwerp</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}