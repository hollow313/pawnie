import { useEffect, useState } from "react";
import Header from "../components/Header";
import api from "../lib/api";

type User = { id:number; email:string; full_name?:string; is_active:boolean; is_admin:boolean };

export default function Admin() {
  const [tab, setTab] = useState<"stats"|"banner"|"moderation"|"settings"|"users">("stats");

  // Stats
  const [stats, setStats] = useState<any>(null);

  // Banner
  const [banner, setBanner] = useState<{text:string, enabled:boolean}>({text:"", enabled:false});

  // Moderation
  const [listingId, setListingId] = useState("");

  // Settings
  const [settings, setSettings] = useState<any>({ site_title:"Pawnie 🐾", upload_max_mb:"20", default_page_size:"24" });

  // Users
  const [users, setUsers] = useState<User[]>([]);
  const [q, setQ] = useState("");

  const loadStats = async () => { try { const { data } = await api.get("/admin/stats"); setStats(data); } catch {} };
  const loadBanner = async () => { try { const { data } = await api.get("/admin/banner"); setBanner(data); } catch {} };
  const loadSettings = async () => { try { const { data } = await api.get("/admin/settings"); setSettings((s:any)=>({ ...s, ...data })); } catch {} };
  const loadUsers = async () => { try { const { data } = await api.get("/admin/users", { params: { q } }); setUsers(data); } catch {} };

  useEffect(()=>{ loadStats(); loadBanner(); loadSettings(); loadUsers(); }, []);
  useEffect(()=>{ loadUsers(); }, [q]);

  const saveBanner = async (e:any) => {
    e.preventDefault();
    const { data } = await api.post("/admin/banner", null, { params: { text: banner.text, enabled: banner.enabled }});
    setBanner(data);
  };

  const toggleListing = async () => {
    if (!listingId) return;
    await api.post("/admin/moderation/toggle_listing", null, { params: { listing_id: Number(listingId) }});
    alert("Statut de l'annonce basculé.");
  };

  const saveSettings = async (e:any) => {
    e.preventDefault();
    await api.post("/admin/settings", settings);
    alert("Paramètres enregistrés.");
  };

  const updateUser = async (u: User, patch: Partial<User>) => {
    const { data } = await api.patch(`/admin/users/${u.id}`, null, { params: patch });
    setUsers(prev => prev.map(x => x.id === u.id ? data : x));
  };

  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto p-4">
        <div className="flex gap-2 mb-4">
          <button onClick={()=>setTab("stats")} className={`px-3 py-2 rounded-lg border ${tab==="stats"?"bg-paw-100":""}`}>Stats</button>
          <button onClick={()=>setTab("banner")} className={`px-3 py-2 rounded-lg border ${tab==="banner"?"bg-paw-100":""}`}>Bannière</button>
          <button onClick={()=>setTab("moderation")} className={`px-3 py-2 rounded-lg border ${tab==="moderation"?"bg-paw-100":""}`}>Modération</button>
          <button onClick={()=>setTab("settings")} className={`px-3 py-2 rounded-lg border ${tab==="settings"?"bg-paw-100":""}`}>Paramètres</button>
          <button onClick={()=>setTab("users")} className={`px-3 py-2 rounded-lg border ${tab==="users"?"bg-paw-100":""}`}>Utilisateurs</button>
        </div>

        {tab==="stats" && (
          <section className="bg-white border rounded-xl p-4">
            <h2 className="text-xl font-semibold mb-3">Stats</h2>
            {stats ? (
              <ul className="space-y-1">
                <li>Utilisateurs: {stats.users}</li>
                <li>Animaux: {stats.animals}</li>
                <li>Annonces: {stats.listings}</li>
                <li>Messages: {stats.messages}</li>
              </ul>
            ) : <div>Chargement...</div>}
          </section>
        )}

        {tab==="banner" && (
          <section className="bg-white border rounded-xl p-4">
            <h2 className="text-xl font-semibold mb-3">Bannière</h2>
            <form onSubmit={saveBanner} className="space-y-2">
              <textarea className="w-full border rounded-lg p-2" rows={3} value={banner.text} onChange={e=>setBanner({...banner, text:e.target.value})}/>
              <label className="flex items-center gap-2"><input type="checkbox" checked={banner.enabled} onChange={e=>setBanner({...banner, enabled:e.target.checked})}/> Activer</label>
              <button className="px-4 py-2 rounded-lg bg-paw-600 text-white">Enregistrer</button>
            </form>
          </section>
        )}

        {tab==="moderation" && (
          <section className="bg-white border rounded-xl p-4">
            <h2 className="text-xl font-semibold mb-3">Modération annonces</h2>
            <div className="flex gap-2">
              <input className="border rounded-lg p-2" placeholder="ID annonce" value={listingId} onChange={e=>setListingId(e.target.value)} />
              <button onClick={toggleListing} className="px-4 py-2 rounded-lg border">Basculer actif/inactif</button>
            </div>
          </section>
        )}

        {tab==="settings" && (
          <section className="bg-white border rounded-xl p-4">
            <h2 className="text-xl font-semibold mb-3">Paramètres du site</h2>
            <form onSubmit={saveSettings} className="grid md:grid-cols-3 gap-3">
              <div className="md:col-span-3">
                <label className="text-sm text-slate-600">Titre du site</label>
                <input className="w-full border rounded-lg p-2" value={settings.site_title||""} onChange={e=>setSettings({...settings, site_title:e.target.value})}/>
              </div>
              <div>
                <label className="text-sm text-slate-600">Taille max upload (Mo)</label>
                <input className="w-full border rounded-lg p-2" value={settings.upload_max_mb||""} onChange={e=>setSettings({...settings, upload_max_mb:e.target.value})}/>
              </div>
              <div>
                <label className="text-sm text-slate-600">Taille page par défaut</label>
                <input className="w-full border rounded-lg p-2" value={settings.default_page_size||""} onChange={e=>setSettings({...settings, default_page_size:e.target.value})}/>
              </div>
              <div className="md:col-span-3"><button className="px-4 py-2 rounded-lg bg-paw-600 text-white">Enregistrer</button></div>
            </form>
            <p className="text-xs text-slate-500 mt-2">
              Note : la taille d’upload est aussi limitée par Nginx (actuellement 20 Mo dans la conf).
            </p>
          </section>
        )}

        {tab==="users" && (
          <section className="bg-white border rounded-xl p-4">
            <h2 className="text-xl font-semibold mb-3">Utilisateurs</h2>
            <div className="flex gap-2 mb-3">
              <input className="border rounded-lg p-2" placeholder="Recherche nom/email" value={q} onChange={e=>setQ(e.target.value)} />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 pr-3">ID</th>
                    <th className="py-2 pr-3">Nom</th>
                    <th className="py-2 pr-3">Email</th>
                    <th className="py-2 pr-3">Actif</th>
                    <th className="py-2 pr-3">Admin</th>
                    <th className="py-2 pr-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u=>(
                    <tr key={u.id} className="border-b">
                      <td className="py-2 pr-3">{u.id}</td>
                      <td className="py-2 pr-3">
                        <input className="border rounded p-1" value={u.full_name||""} onChange={e=>setUsers(prev=>prev.map(x=>x.id===u.id?{...x, full_name:e.target.value}:x))}/>
                      </td>
                      <td className="py-2 pr-3">{u.email}</td>
                      <td className="py-2 pr-3">
                        <input type="checkbox" checked={u.is_active} onChange={e=>updateUser(u, { is_active: e.target.checked })}/>
                      </td>
                      <td className="py-2 pr-3">
                        <input type="checkbox" checked={u.is_admin} onChange={e=>updateUser(u, { is_admin: e.target.checked })}/>
                      </td>
                      <td className="py-2 pr-3">
                        <button className="px-2 py-1 border rounded" onClick={()=>updateUser(u, { full_name: u.full_name||"" })}>Enregistrer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
