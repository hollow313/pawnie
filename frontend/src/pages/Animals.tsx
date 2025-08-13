import { useEffect, useState } from "react";
import api from "../lib/api";
import Header from "../components/Header";

export default function Animals() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { api.get("/animals").then(r=>setItems(r.data)); }, []);
  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto p-4 grid md:grid-cols-3 gap-4">
        {items.map(a=>(
          <div key={a.id} className="border rounded-xl bg-white p-3">
            <img src={a.photo_url || "/placeholder.svg"} className="w-full h-44 object-cover rounded-lg mb-2"/>
            <div className="font-semibold">{a.name} <span className="text-slate-500">({a.species})</span></div>
            <div className="text-sm text-slate-600">{a.breed || "—"} · {a.sex || "?"} · {a.age_months} mois</div>
          </div>
        ))}
      </main>
    </div>
  );
}