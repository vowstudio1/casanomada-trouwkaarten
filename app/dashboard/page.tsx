"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="pt-28 pb-20 bg-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-serif text-brand-950">Dashboard</h1>
          <p className="mt-4 text-brand-600">
            Beheer je uitnodigingen, bekijk RSVP&apos;s en organiseer je tafels.
          </p>

          {/* Placeholder login */}
          <div className="mt-12 max-w-md mx-auto bg-white rounded-2xl p-8 border border-brand-100 shadow-sm">
            <h2 className="font-serif text-xl text-brand-950 mb-6">Inloggen</h2>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="E-mailadres"
                className="w-full px-4 py-3 rounded-xl border border-brand-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-cream"
              />
              <input
                type="password"
                placeholder="Wachtwoord"
                className="w-full px-4 py-3 rounded-xl border border-brand-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-cream"
              />
              <button className="w-full bg-brand-950 text-white py-3 rounded-full text-sm font-medium hover:bg-brand-800 transition-colors">
                Inloggen
              </button>
            </div>
            <p className="mt-4 text-xs text-brand-500 text-center">
              Nog geen account?{" "}
              <Link href="/templates" className="text-brand-700 underline">
                Maak je uitnodiging
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
