"use client";

import { motion } from "framer-motion";
import { TEMPLATES } from "@/lib/constants";
import TemplateCard from "@/components/TemplateCard";

export default function TemplatesPage() {
  return (
    <main className="pt-28 pb-20 bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-serif text-brand-950">
            Alle sjablonen
          </h1>
          <p className="mt-4 text-brand-600 max-w-2xl mx-auto">
            Kies het sjabloon dat het best bij jullie past. Elk ontwerp is volledig aanpasbaar.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEMPLATES.map((t) => (
            <TemplateCard key={t.id} template={t} />
          ))}
        </div>
      </div>
    </main>
  );
}
