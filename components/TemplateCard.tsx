"use client";

import { motion } from "framer-motion";

interface Template {
  id: string;
  name: string;
  description: string;
  color: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function TemplateCard({ template }: { template: Template }) {
  return (
    <motion.div
      variants={fadeUp}
      className="group cursor-pointer"
    >
      <div
        className="aspect-[3/4] rounded-2xl overflow-hidden relative border border-brand-100 transition-shadow hover:shadow-xl"
        style={{ backgroundColor: template.color + "20" }}
      >
        {/* Phone mockup inside card */}
        <div className="absolute inset-4 flex items-center justify-center">
          <div className="w-[140px] h-[280px] bg-white rounded-[1.5rem] border-[3px] border-gray-800 shadow-lg overflow-hidden">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-3 bg-gray-800 rounded-b-xl" />
            <div className="flex items-center justify-center h-full px-3">
              <div className="text-center">
                <p className="font-serif text-sm" style={{ color: template.color }}>
                  Laura
                </p>
                <p className="font-serif text-[10px] text-gray-400 italic">&amp;</p>
                <p className="font-serif text-sm" style={{ color: template.color }}>
                  Marco
                </p>
                <div className="mt-2 w-8 h-px mx-auto" style={{ backgroundColor: template.color }} />
              </div>
            </div>
          </div>
        </div>
        {/* Decorative background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: `radial-gradient(circle at 30% 70%, ${template.color}, transparent 70%)`,
          }}
        />
      </div>
      <div className="mt-4 text-center">
        <h3 className="font-serif text-brand-950 group-hover:text-brand-700 transition-colors">
          {template.name}
        </h3>
        <p className="text-sm text-brand-500 mt-1">{template.description}</p>
      </div>
    </motion.div>
  );
}
