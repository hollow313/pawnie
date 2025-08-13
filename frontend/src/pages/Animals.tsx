import { useEffect, useState } from "react";
import Header from "../components/Header";
import api from "../lib/api";
import { Link } from "react-router-dom";

export default function Animals() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(()=>{ api.get("/animals").then(r=>setItems(r.data||[])) },[]);
  return (
    <div>
      <Header />
      <main className="max-w-5xl mx-auto p-4 grid md:grid-cols-3 gap-4">
        {items.map(a=>(
          <Link to={`/edit-animal/${a.id}`} key={a.id} className="bg-white border rounded-xl p-3 hover:shadow">
            <img src={a.avatar_url || "/placeholder.svg"} className="w-full h-40 object-cover rounded" />
            <div className="mt-2 font-semibold">{a.name}</div>
            <div className="text-xs text-slate-600">{a.species} • {a.breed}</div>
          </Link>
        ))}
      </main>
    </div>
  )
}
