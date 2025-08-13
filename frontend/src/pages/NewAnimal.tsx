import { useState } from "react";
import Header from "../components/Header";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function NewAnimal() {
  const [form, setForm] = useState({ name:"", species:"dog", breed:"", sex:"M", age_months:0, description:"", photo_url:"" });
  const [file, setFile] = useState<File|null>(null);
  const nav = useNavigate();

  const upload = async () => {
    if (!file) return;
    const fd = new FormData(); fd.append("file", file);
    const { data } = await api.post("/uploads", fd, { headers: { "Content-Type":"multipart/form-data" }});
    setForm(f => ({...f, photo_url: data.url}));
  };
  const submit = async (e:any) => {
    e.preventDefault(); if (file && !form.photo_url) await upload(); await api.post("/animals", form); nav("/animals");
  };

  return (
    <div>
      <Header />
      <main className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Ajouter un animal</h1>
        <form onSubmit={submit} className="bg-white p-4 rounded-2xl border space-y-3">
          <input className="w-full border rounded-lg p-2" placeholder="Nom" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
          <div className="grid md:grid-cols-3 gap-3">
            <select className="border rounded-lg p-2" value={form.species} onChange={e=>setForm({...form, species:e.target.value})}>
              <option value="dog">Chien</option><option value="cat">Chat</option><option value="other">Autre</option>
            </select>
            <input className="border rounded-lg p-2" placeholder="Race" value={form.breed} onChange={e=>setForm({...form, breed:e.target.value})}/>
            <select className="border rounded-lg p-2" value={form.sex} onChange={e=>setForm({...form, sex:e.target.value})}>
              <option value="M">Mâle</option><option value="F">Femelle</option>
            </select>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <input type="number" className="border rounded-lg p-2" placeholder="Âge (mois)" value={form.age_months} onChange={e=>setForm({...form, age_months:Number(e.target.value)})}/>
            <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)} />
          </div>
          <textarea className="w-full border rounded-lg p-2" placeholder="Description" rows={4} value={form.description} onChange={e=>setForm({...form, description:e.target.value})}/>
          <div className="flex gap-2">
            <button type="button" onClick={upload} className="px-3 py-2 border rounded-lg">Uploader la photo</button>
            <button className="px-4 py-2 rounded-lg bg-paw-600 text-white">Enregistrer</button>
          </div>
          {form.photo_url && <img src={form.photo_url} className="w-48 h-48 object-cover rounded-lg border" />}
        </form>
      </main>
    </div>
  );
}