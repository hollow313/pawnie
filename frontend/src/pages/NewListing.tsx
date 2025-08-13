import { useEffect, useState } from "react";
import Header from "../components/Header";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function NewListing() {
  const [animals, setAnimals] = useState<any[]>([]);
  const [file, setFile] = useState<File|null>(null);
  const [form, setForm] = useState({ title:"", type:"sale", price:0, location:"", description:"", photo_url:"", animal_id:0 });
  const nav = useNavigate();
  useEffect(() => { api.get("/animals").then(r=>setAnimals(r.data)); }, []);
  const upload = async () => { if (!file) return; const fd = new FormData(); fd.append("file", file);
    const { data } = await api.post("/uploads", fd, { headers: { "Content-Type":"multipart/form-data" }}); setForm(f => ({...f, photo_url: data.url})); };
  const submit = async (e:any) => { e.preventDefault(); if (file && !form.photo_url) await upload();
    const payload = { ...form, animal_id: form.animal_id || undefined }; await api.post("/listings", payload); nav("/listings"); };
  return (
    <div><Header /><main className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Créer une annonce</h1>
      <form onSubmit={submit} className="bg-white p-4 rounded-2xl border space-y-3">
        <input className="w-full border rounded-lg p-2" placeholder="Titre" value={form.title} onChange={e=>setForm({...form, title:e.target.value})}/>
        <div className="grid md:grid-cols-3 gap-3">
          <select className="border rounded-lg p-2" value={form.type} onChange={e=>setForm({...form, type:e.target.value})}>
            <option value="sale">Vente</option><option value="breeding">Saillie</option>
          </select>
          <input type="number" className="border rounded-lg p-2" placeholder="Prix" value={form.price} onChange={e=>setForm({...form, price:Number(e.target.value)})}/>
          <input className="border rounded-lg p-2" placeholder="Localisation" value={form.location} onChange={e=>setForm({...form, location:e.target.value})}/>
        </div>
        <select className="border rounded-lg p-2" value={form.animal_id} onChange={e=>setForm({...form, animal_id:Number(e.target.value)})}>
          <option value={0}>— Lier un de mes animaux (optionnel)</option>
          {animals.map(a=> <option key={a.id} value={a.id}>{a.name} ({a.species})</option>)}
        </select>
        <textarea className="w-full border rounded-lg p-2" placeholder="Description" rows={4} value={form.description} onChange={e=>setForm({...form, description:e.target.value})}/>
        <div className="flex items-center gap-3">
          <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)} />
          <button type="button" onClick={upload} className="px-3 py-2 border rounded-lg">Uploader la photo</button>
        </div>
        <button className="px-4 py-2 rounded-lg bg-paw-600 text-white">Publier</button>
        {form.photo_url && <img src={form.photo_url} className="w-48 h-48 object-cover rounded-lg border" />}
      </form>
    </main></div>
  );
}