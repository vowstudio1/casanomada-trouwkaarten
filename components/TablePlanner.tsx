"use client";
import { useState } from "react";
import { Sparkles, GripVertical } from "lucide-react";
export default function TablePlanner() {
  const [aiPrompt, setAiPrompt] = useState("");
  const [tables] = useState([
    { id: "t1", name: "Tafel 1: Familie", guests: [{ id: "g1", name: "Ahmed & Fatima", info: "Halal" }] },
    { id: "t2", name: "Tafel 2: Vrienden", guests: [{ id: "g2", name: "Sarah & Tom", info: "Vegetarisch" }] },
  ]);
  return (
    <div className="space-y-6">
      <div className="bg-charcoal-900 p-4 rounded-2xl flex gap-4 items-center">
        <Sparkles className="w-5 h-5 text-champagne-300" />
        <input type="text" placeholder="Bijv: Zet ouders bij elkaar..." className="flex-1 bg-transparent text-cream-50 placeholder-cream-200 border-none outline-none text-sm" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} />
        <button className="px-4 py-2 bg-champagne-300 text-charcoal-900 rounded-lg font-medium text-sm">Genereer</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tables.map((table) => (
          <div key={table.id} className="bg-cream-50 p-4 rounded-xl border border-cream-200">
            <h4 className="font-serif text-lg text-charcoal-900 mb-3">{table.name}</h4>
            {table.guests.map((g) => (
              <div key={g.id} className="flex items-center gap-2 p-3 bg-white border border-cream-200 rounded-lg mb-2">
                <GripVertical className="w-4 h-4 text-charcoal-800" />
                <div><p className="font-medium text-sm">{g.name}</p><p className="text-xs text-charcoal-800">{g.info}</p></div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}