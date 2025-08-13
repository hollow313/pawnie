import { useEffect, useState } from "react";
import Header from "../components/Header";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function NewListing() {
  const [animals, setAnimals] = useState<any[]>([]);
  const [form, setForm] = useState({ title:"", description:"", type:"sale", species:"dog", price:"", images:[] as string[], animal_id:"" });
  const nav = useNavigate();

  useEffect(()=>{
    api.get("/animals").then(r=>setAnimals(r.data||[])).catch(()=>{});
  },[]);

  const onUpload = async (e:any) => {
    const f = e.target.files?.[0]; if(!f) return;
    const fd = new FormData(); fd.append("file", f);
    const { data } = await api.post("/uploads", fd);
    setForm(s => ({...s, images: [...s.images, data.url]}));
  };

  const submit = async (e:any) => {
    e.preventDefault();
    const payload:any = {
      title: form.title, description: form.description, type: form.type, species: form.species,
      price: form.price ? Number(form.price) : 0, images: form.images
    };
    if (form.animal_id) payload.animal_id = Number(form.animal_id);
    await api.post("/listings", payload);
    nav("/listings");
  };

  return (
    <div>
      <Header />
      <main className="max-w-2xl mx-auto p-4">
        <h1 className="text-xl font-semibold mb-3">Nouvelle annonce</h1>
        <form onSubmit={submit} className="space-y-3 bg-white border rounded-xl p-4">
          <input className="w-full border rounded p-2" placeholder="Titre" value={form.title} onChange={e=>setForm({...form, title:e.target.value})}/>
          <textarea className="w-full border rounded p-2" rows={4} placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})}/>
          <div className="grid grid-cols-2 gap-2">
            <select className="border rounded p-2" value={form.type} onChange={e=>setForm({...form, type:e.target.value})}>
              <option value="sale">Vente</option><option value="breeding">Saillie</option>
            </select>
            <select className="border rounded p-2" value={form.species} onChange={e=>setForm({...form, species:e.target.value})}>
              <option value="dog">Chien</option><option value="cat">Chat</option><option value="other">Autre</option>
            </select>
          </div>
          <input className="w-full border rounded p-2" placeholder="Prix (€)" value={form.price} onChange={e=>setForm({...form, price:e.target.value})}/>
          <div className="space-y-2">
            <input type="file" onChange={onUpload}/>
            <div className="flex gap-2 flex-wrap">
              {form.images.map((u,i)=> <img key={i} src={u} className="w-20 h-20 object-cover rounded" />)}
            </div>
          </div>
          <select className="border rounded p-2 w-full" value={form.animal_id} onChange={e=>setForm({...form, animal_id:e.target.value})}>
            <option value="">Associer un animal (optionnel)</option>
            {animals.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <button className="px-4 py-2 rounded bg-paw-600 text-white">Publier</button>
        </form>
      </main>
    </div>
  )
}
