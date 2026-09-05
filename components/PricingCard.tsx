"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface Plan {
  id: string;
  name: string;
  price: number;
  recommended: boolean;
  features: string[];
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function PricingCard({ plan }: { plan: Plan }) {
  return (
    <motion.div
      variants={fadeUp}
      className={`relative rounded-2xl p-8 border transition-shadow hover:shadow-lg ${
        plan.recommended
          ? "border-brand-950 bg-brand-950 text-white"
          : "border-brand-200 bg-white"
      }`}
    >
      {plan.recommended && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-[10px] tracking-wider uppercase px-4 py-1 rounded-full">
          Aanbevolen
        </span>
      )}
      <h3 className={`font-serif text-xl ${plan.recommended ? "text-white" : "text-brand-950"}`}>
        {plan.name}
      </h3>
      <div className="mt-4 flex items-baseline gap-1">
        <span className={`text-4xl font-serif ${plan.recommended ? "text-white" : "text-brand-950"}`}>
          €{plan.price}
        </span>
      </div>
      <p className={`text-xs mt-1 ${plan.recommended ? "text-brand-300" : "text-brand-500"}`}>
        EENMALIGE BETALING
      </p>
      <ul className="mt-6 space-y-3">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-sm">
            <svg
              className={`w-4 h-4 shrink-0 mt-0.5 ${plan.recommended ? "text-brand-300" : "text-brand-500"}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className={plan.recommended ? "text-brand-100" : "text-brand-700"}>
              {f}
            </span>
          </li>
        ))}
      </ul>
      <Link
        href="/templates"
        className={`mt-8 block text-center py-3 rounded-full text-sm font-medium transition-colors ${
          plan.recommended
            ? "bg-white text-brand-950 hover:bg-brand-50"
            : "bg-brand-950 text-white hover:bg-brand-800"
        }`}
      >
        Maak je uitnodiging — gratis
      </Link>
    </motion.div>
  );
}
