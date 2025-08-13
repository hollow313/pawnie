import { useEffect, useState } from "react";
import Header from "../components/Header";
import api from "../lib/api";

export default function Admin() {
  const [stats, setStats] = useState<any>(null);
  const [banner, setBanner] = useState<{text:string, enabled:boolean}>({text:"", enabled:false});
  const [listingId, setListingId] = useState("");

  const load = async () => {
    try { const { data } = await api.get("/admin/stats"); setStats(data); } catch {}
    try { const { data } = await api.get("/admin/banner"); setBanner(data); } catch {}
  };
  useEffect(()=>{ load(); }, []);

  const saveBanner = async (e:any) => { e.preventDefault();
    const { data } = await api.post("/admin/banner", null, { params: { text: banner.text, enabled: banner.enabled }});
    setBanner(data);
  };
  const toggleListing = async () => {
    if (!listingId) return;
    await api.post("/admin/moderation/toggle_listing", null, { params: { listing_id: Number(listingId) }});
    alert("Statut de l'annonce basculé.");
  };

  return (
    <div><Header />
      <main className="max-w-6xl mx-auto p-4 grid md:grid-cols-2 gap-4">
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
        <section className="bg-white border rounded-xl p-4">
          <h2 className="text-xl font-semibold mb-3">Bannière</h2>
          <form onSubmit={saveBanner} className="space-y-2">
            <textarea className="w-full border rounded-lg p-2" rows={3} value={banner.text} onChange={e=>setBanner({...banner, text:e.target.value})}/>
            <label className="flex items-center gap-2"><input type="checkbox" checked={banner.enabled} onChange={e=>setBanner({...banner, enabled:e.target.checked})}/> Activer</label>
            <button className="px-4 py-2 rounded-lg bg-paw-600 text-white">Enregistrer</button>
          </form>
        </section>
        <section className="bg-white border rounded-xl p-4 md:col-span-2">
          <h2 className="text-xl font-semibold mb-3">Modération</h2>
          <div className="flex gap-2">
            <input className="border rounded-lg p-2" placeholder="ID annonce" value={listingId} onChange={e=>setListingId(e.target.value)} />
            <button onClick={toggleListing} className="px-4 py-2 rounded-lg border">Basculer actif/inactif</button>
          </div>
        </section>
      </main>
    </div>
  );
}