import { useEffect, useState } from "react";
import Header from "../components/Header";
import api from "../lib/api";

export default function Profile(){
  const [me, setMe] = useState<any>(null);
  const [pw, setPw] = useState({ current_password:"", new_password:"" });

  useEffect(()=>{ api.get("/users/me").then(r=>setMe(r.data)); },[]);

  const save = async (e:any)=>{ e.preventDefault(); await api.patch("/users/me", me); alert("Profil mis à jour"); }
  const changePw = async (e:any)=>{ e.preventDefault(); await api.post("/users/me/password", pw); alert("Mot de passe changé"); setPw({current_password:"", new_password:""}); }

  if(!me) return <div><Header/><main className="p-4">Chargement…</main></div>;

  return (
    <div>
      <Header />
      <main className="max-w-xl mx-auto p-4 space-y-6">
        <section className="bg-white border rounded-xl p-4">
          <h2 className="font-semibold mb-3">Profil</h2>
          <form onSubmit={save} className="space-y-2">
            <input className="w-full border rounded p-2" value={me.full_name||""} onChange={e=>setMe({...me, full_name:e.target.value})} placeholder="Nom complet"/>
            <input className="w-full border rounded p-2" value={me.address||""} onChange={e=>setMe({...me, address:e.target.value})} placeholder="Adresse"/>
            <input className="w-full border rounded p-2" value={me.city||""} onChange={e=>setMe({...me, city:e.target.value})} placeholder="Ville"/>
            <input className="w-full border rounded p-2" value={me.phone||""} onChange={e=>setMe({...me, phone:e.target.value})} placeholder="Téléphone"/>
            <button className="px-4 py-2 rounded bg-paw-600 text-white">Enregistrer</button>
          </form>
        </section>
        <section className="bg-white border rounded-xl p-4">
          <h2 className="font-semibold mb-3">Mot de passe</h2>
          <form onSubmit={changePw} className="space-y-2">
            <input className="w-full border rounded p-2" type="password" placeholder="Mot de passe actuel" value={pw.current_password} onChange={e=>setPw({...pw, current_password:e.target.value})}/>
            <input className="w-full border rounded p-2" type="password" placeholder="Nouveau mot de passe" value={pw.new_password} onChange={e=>setPw({...pw, new_password:e.target.value})}/>
            <button className="px-4 py-2 rounded bg-paw-600 text-white">Changer</button>
          </form>
        </section>
      </main>
    </div>
  )
}
