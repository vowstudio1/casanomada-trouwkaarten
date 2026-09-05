import { SITE_NAME } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-brand-800 text-white/70 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white tracking-[0.2em] text-sm font-medium uppercase mb-4">{SITE_NAME}</h3>
            <p className="text-sm leading-relaxed">Luxe digitale trouwkaarten met RSVP, AI-tafelindeling en gastenboek.</p>
          </div>
          <div>
            <h4 className="text-white text-sm font-medium mb-4">Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#sjablonen" className="hover:text-white transition-colors">Sjablonen</a></li>
              <li><a href="#prijzen" className="hover:text-white transition-colors">Prijzen</a></li>
              <li><a href="#hoe-het-werkt" className="hover:text-white transition-colors">Hoe het werkt</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-medium mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:info@casanomadadigital.com" className="hover:text-white transition-colors">info@casanomadadigital.com</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-white/10 text-center text-xs text-white/40">
          &copy; {new Date().getFullYear()} {SITE_NAME}. Alle rechten voorbehouden.
        </div>
      </div>
    </footer>
  );
}
