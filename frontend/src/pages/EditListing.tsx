import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import api from "../lib/api";

export default function EditListing(){
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState<any>(null);

  useEffect(()=>{
    api.get("/listings", { params:{ limit:999, offset:0 }}).then(r=>{
      const found = (r.data||[]).find((x:any)=> String(x.id)===String(id));
      if(found) setForm(found); else nav("/listings");
    })
  },[id]);

  if(!form) return <div><Header/><main className="p-4">Chargement…</main></div>;

  const addImage = async (e:any) => {
    const f = e.target.files?.[0]; if(!f) return;
    const fd = new FormData(); fd.append("file", f);
    const { data } = await api.post("/uploads", fd);
    setForm((s:any)=>({ ...s, images: [...(s.images||[]), data.url] }));
  };

  const removeImage = (u:string) => setForm((s:any)=>({ ...s, images: (s.images||[]).filter((x:string)=>x!==u)}));

  const save = async (e:any) => {
    e.preventDefault();
    const payload:any = { title:form.title, description:form.description, type:form.type, species:form.species, price:Number(form.price)||0, images: form.images||[] };
    await api.patch(`/listings/${id}`, payload);
    nav("/listings");
  };

  return (
    <div>
      <Header />
      <main className="max-w-xl mx-auto p-4">
        <h1 className="text-xl font-semibold mb-3">Éditer l’annonce #{id}</h1>
        <form onSubmit={save} className="space-y-3 bg-white border rounded-xl p-4">
          <input className="w-full border rounded p-2" value={form.title} onChange={e=>setForm({...form, title:e.target.value})}/>
          <textarea className="w-full border rounded p-2" rows={4} value={form.description} onChange={e=>setForm({...form, description:e.target.value})}/>
          <div className="grid grid-cols-2 gap-2">
            <input className="border rounded p-2" value={form.type} onChange={e=>setForm({...form, type:e.target.value})}/>
            <input className="border rounded p-2" value={form.species} onChange={e=>setForm({...form, species:e.target.value})}/>
          </div>
          <input className="w-full border rounded p-2" value={form.price} onChange={e=>setForm({...form, price:e.target.value})}/>
          <div className="space-y-2">
            <div className="flex gap-2 flex-wrap">
              {(form.images||[]).map((u:string)=>(<div key={u} className="relative">
                <img src={u} className="w-24 h-24 object-cover rounded"/>
                <button type="button" className="absolute top-1 right-1 bg-white/80 px-1 rounded" onClick={()=>removeImage(u)}>✕</button>
              </div>))}
            </div>
            <input type="file" onChange={addImage}/>
          </div>
          <button className="px-4 py-2 rounded bg-paw-600 text-white">Enregistrer</button>
        </form>
      </main>
    </div>
  )
}
