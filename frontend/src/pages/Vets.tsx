import { useState } from "react";
import Header from "../components/Header";
import api from "../lib/api";

export default function Vets(){
  const [city, setCity] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const search = async (e:any)=>{ e.preventDefault(); const { data } = await api.get("/vets/search", { params:{ city }}); setRows(data); };
  return (
    <div>
      <Header />
      <main className="max-w-3xl mx-auto p-4">
        <h1 className="text-xl font-semibold mb-3">Trouver un vétérinaire</h1>
        <form onSubmit={search} className="flex gap-2 mb-3">
          <input className="border rounded p-2 flex-1" placeholder="Ville" value={city} onChange={e=>setCity(e.target.value)}/>
          <button className="px-4 py-2 rounded bg-paw-600 text-white">Rechercher</button>
        </form>
        <div className="space-y-2">
          {rows.map((r:any)=>(
            <div key={r.place_id} className="bg-white border rounded-xl p-3">
              <div className="font-semibold">{r.name}</div>
              <div className="text-sm text-slate-600">{r.address}</div>
              {r.rating && <div className="text-sm">Note: {r.rating} ({r.user_ratings_total})</div>}
            </div>
          ))}
          {!rows.length && <div className="text-sm text-slate-500">Entrez une ville pour commencer.</div>}
        </div>
      </main>
    </div>
  )
}
