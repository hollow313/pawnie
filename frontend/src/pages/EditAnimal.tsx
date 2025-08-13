import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import api from "../lib/api";

export default function EditAnimal(){
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState<any>({});

  useEffect(()=>{ api.get("/animals").then(r=>{
    const found = (r.data||[]).find((x:any)=> String(x.id)===String(id));
    if(found) setForm(found); else nav("/animals");
  })},[id]);

  const onUpload = async (e:any) => {
    const f = e.target.files?.[0]; if(!f) return;
    const fd = new FormData(); fd.append("file", f);
    const { data } = await api.post("/uploads", fd);
    setForm((s:any)=>({...s, avatar_url: data.url}));
  };

  const save = async (e:any) => {
    e.preventDefault();
    await api.patch(`/animals/${id}`, { name:form.name, species:form.species, breed:form.breed, age_months:form.age_months, avatar_url:form.avatar_url });
    nav("/animals");
  };

  return (
    <div>
      <Header />
      <main className="max-w-xl mx-auto p-4">
        <h1 className="text-xl font-semibold mb-3">Éditer l’animal #{id}</h1>
        <form onSubmit={save} className="space-y-3 bg-white border rounded-xl p-4">
          <input className="w-full border rounded p-2" value={form.name||""} onChange={e=>setForm({...form, name:e.target.value})}/>
          <input className="w-full border rounded p-2" value={form.species||""} onChange={e=>setForm({...form, species:e.target.value})}/>
          <input className="w-full border rounded p-2" value={form.breed||""} onChange={e=>setForm({...form, breed:e.target.value})}/>
          <input className="w-full border rounded p-2" value={form.age_months||0} onChange={e=>setForm({...form, age_months:Number(e.target.value)||0})}/>
          <div className="space-y-2">
            <img src={form.avatar_url || "/placeholder.svg"} className="w-full h-40 object-cover rounded"/>
            <input type="file" onChange={onUpload}/>
          </div>
          <button className="px-4 py-2 rounded bg-paw-600 text-white">Enregistrer</button>
        </form>
      </main>
    </div>
  )
}
