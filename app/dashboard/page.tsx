import { Users, CheckCircle, XCircle, Clock } from "lucide-react";
export default function Dashboard() {
  const stats = [
    { label: "Uitgenodigd", value: 120, icon: Users, color: "bg-blue-50 text-blue-600" },
    { label: "Bevestigd", value: 85, icon: CheckCircle, color: "bg-green-50 text-green-600" },
    { label: "Niet Aanwezig", value: 15, icon: XCircle, color: "bg-red-50 text-red-600" },
    { label: "Geen Reactie", value: 20, icon: Clock, color: "bg-amber-50 text-amber-600" },
  ];
  return (
    <div className="min-h-screen bg-cream-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-serif text-3xl md:text-4xl text-charcoal-900 mb-2">Welkom terug, Laura &amp; Marco</h1>
        <p className="text-charcoal-800 mb-10">Jullie bruiloft in Lake Como is over 245 dagen.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-cream-100 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.color}`}><stat.icon className="w-6 h-6" /></div>
              <div><p className="text-sm text-charcoal-800">{stat.label}</p><p className="text-2xl font-serif font-bold text-charcoal-900">{stat.value}</p></div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-cream-100 p-8">
          <h2 className="font-serif text-2xl mb-4">Dashboard</h2>
          <p className="text-charcoal-800">Hier beheer je je uitnodigingen, RSVP&apos;s, tafelindeling en gastenboek.</p>
        </div>
      </div>
    </div>
  );
}