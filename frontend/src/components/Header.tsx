import { Link, useNavigate } from "react-router-dom";
import PawLogo from "./PawLogo";
import { useEffect, useState } from "react";
import api from "../lib/api";

export default function Header() {
  const nav = useNavigate();
  const logout = () => { localStorage.removeItem("token"); nav("/login"); location.reload(); };
  const [banner, setBanner] = useState<{text:string, enabled:boolean}|null>(null);
  const [me, setMe] = useState<any>(null);

  useEffect(()=>{
    api.get("/admin/banner").then(r=>setBanner(r.data)).catch(()=>{});
    api.get("/users/me").then(r=>setMe(r.data)).catch(()=>{});
  },[]);

  return (
    <div className="sticky top-0 z-10">
      {banner?.enabled && (
        <div className="bg-paw-700 text-white text-sm text-center py-1 px-2">{banner.text}</div>
      )}
      <header className="bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-paw-700"><PawLogo /></Link>
          <nav className="flex items-center gap-4">
            <Link to="/" className="hover:underline">Accueil</Link>
            <Link to="/listings" className="hover:underline">Annonces</Link>
            <Link to="/animals" className="hover:underline">Mes animaux</Link>
            <Link to="/messages" className="hover:underline">Messages</Link>
            {me?.is_admin && <Link to="/admin" className="px-3 py-1.5 rounded-md bg-paw-600 text-white">Admin</Link>}
            <button onClick={logout} className="px-3 py-1.5 rounded-md border">Déconnexion</button>
          </nav>
        </div>
      </header>
    </div>
  )
}
