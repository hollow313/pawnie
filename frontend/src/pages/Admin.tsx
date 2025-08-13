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
          </
