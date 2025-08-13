import { useEffect, useState } from "react";
import Header from "../components/Header";
import api from "../lib/api";
import ListingCard from "../components/ListingCard";
import { useNavigate } from "react-router-dom";

export default function Listings() {
  const [items, setItems] = useState<any[]>([]);
  const [favs, setFavs] = useState<number[]>([]);
  const [filters, setFilters] = useState({ type:"", species:"", price_min:"", price_max:"", q:"" });
  const nav = useNavigate();

  const load = async () => {
    const { data } = await api.get("/listings", { params: filters });
    setItems(data);
    try { const favs = await api.get("/favorites"); setFavs(favs.data.map((x:any)=>x.id)); } catch {}
  };

  useEffect(()=>{ load(); }, []);
  const onSearch = async (e:any) => { e.preventDefault(); load(); };
  const toggleFav = async (id:number) => { await api.post(`/favorites/${id}`); load(); };
  const contact = async (listingId:number) => {
    const { data } = await api.post("/messages/start", null, { params: { listing_id: listingId } });
    nav(`/messages?thread=${data.id}`);
  };

  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto p-4">
        <form onSubmit={onSearch} className="grid md:grid-cols-6 gap-3 bg-white p-3 rounded-xl border mb-4">
          <select className="border rounded-lg p-2" value={filters.type} onChange={e=>setFilters({...filters, type:e.target.value})}>
            <option value="">Type</option><option value="sale">Vente</option><option value="breeding">Saillie</option>
          </select>
          <select className="border rounded-lg p-2" value={filters.species} onChange={e=>setFilters({...filters, species:e.target.value})}>
            <option value="">Espèce</option><option value="dog">Chien</option><option value="cat">Chat</option><option value="other">Autre</option>
          </select>
          <input className="border rounded-lg p-2" placeholder="Prix min" value={filters.price_min} onChange={e=>setFilters({...filters, price_min:e.target.value})}/>
          <input className="border rounded-lg p-2" placeholder="Prix max" value={filters.price_max} onChange={e=>setFilters({...filters, price_max:e.target.value})}/>
          <input className="border rounded-lg p-2 md:col-span-2" placeholder="Recherche..." value={filters.q} onChange={e=>setFilters({...filters, q:e.target.value})}/>
          <div className="md:col-span-6"><button className="px-4 py-2 rounded-lg bg-paw-600 text-white">Rechercher</button></div>
        </form>
        <div className="grid md:grid-cols-3 gap-4">
          {items.map(it => (
            <ListingCard key={it.id} item={it} onFav={toggleFav} isFav={favs.includes(it.id)} onMessage={contact} />
          ))}
        </div>
      </main>
    </div>
  )
}