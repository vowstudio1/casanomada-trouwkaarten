import Link from "next/link";
import { ArrowLeft, Heart, LayoutGrid, Users, MessageSquare, Table2 } from "lucide-react";

export const metadata = {
  title: "Dashboard | Casa Nomada Digital",
};

export default function DashboardPage() {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-sans text-sm tracking-[0.25em] uppercase font-medium text-[#16161D]">
            CASA NOMADA DIGITAL
          </Link>
          <Link href="/" className="flex items-center gap-2 text-sm text-text-muted hover:text-[#16161D] font-sans">
            <ArrowLeft size={16} /> Terug naar home
          </Link>
        </div>
      </header>

      <main className="pt-24 min-h-screen bg-cream">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-brand-800/10 flex items-center justify-center mx-auto mb-6">
            <Heart size={28} className="text-brand-800" />
          </div>
          <p className="text-xs tracking-[0.2em] uppercase text-brand-600 mb-3 font-sans font-medium">
            Dashboard
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#16161D] mb-4">
            Welkom terug
          </h1>
          <p className="font-sans text-text-muted mb-10 max-w-md mx-auto">
            Log in om uw uitnodigingen te beheren, RSVP&apos;s te bekijken en de tafelindeling te maken.
          </p>

          {/* mock login form */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 max-w-sm mx-auto text-left mb-8">
            <h2 className="font-serif text-2xl text-[#16161D] mb-6">Inloggen</h2>
            <div className="space-y-4">
              <div>
                <label className="font-sans text-xs text-text-muted block mb-1.5 tracking-wide uppercase">E-mail</label>
                <div className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-sans text-text-muted bg-cream">
                  jullie@email.nl
                </div>
              </div>
              <div>
                <label className="font-sans text-xs text-text-muted block mb-1.5 tracking-wide uppercase">Wachtwoord</label>
                <div className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-sans text-text-muted bg-cream">
                  ••••••••
                </div>
              </div>
              <div className="bg-brand-800 text-white rounded-full py-3 text-center font-sans text-sm font-medium cursor-pointer hover:bg-brand-700 transition-colors">
                Inloggen
              </div>
            </div>
            <p className="text-center mt-4 font-sans text-xs text-text-muted">
              Nog geen account?{" "}
              <Link href="/pricing" className="text-brand-700 underline">
                Kies een pakket
              </Link>
            </p>
          </div>

          {/* feature preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
            {[
              { Icon: LayoutGrid,    label: "Uitnodigingen" },
              { Icon: Users,         label: "Gasten"        },
              { Icon: MessageSquare, label: "Gastenboek"    },
              { Icon: Table2,        label: "Tafelindeling" },
            ].map(({ Icon, label }) => (
              <div key={label} className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col items-center gap-2 opacity-50">
                <Icon size={20} className="text-brand-800" />
                <p className="font-sans text-xs text-text-muted">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
