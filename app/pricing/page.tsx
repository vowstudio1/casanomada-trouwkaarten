"use client";

import { motion } from "framer-motion";
import { PRICING_PLANS } from "@/lib/constants";
import PricingCard from "@/components/PricingCard";

export default function PricingPage() {
  return (
    <main className="pt-28 pb-20 bg-cream min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-serif text-brand-950">Prijzen</h1>
          <p className="mt-4 text-brand-600">
            Eén betaling, geen abonnement. Maak je uitnodiging gratis, betaal om te publiceren.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRICING_PLANS.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </main>
  );
}
