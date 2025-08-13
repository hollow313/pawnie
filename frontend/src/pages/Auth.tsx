import { useState } from "react";
import api, { setToken } from "../lib/api";
import { Link, useNavigate } from "react-router-dom";

export function Login() {
  const [email, setEmail] = useState(""); const [password, setPwd] = useState(""); const [err, setErr] = useState("");
  const nav = useNavigate();
  const submit = async (e:any) => {
    e.preventDefault(); setErr("");
    try { const { data } = await api.post("/auth/login", { email, password, full_name: "" });
      localStorage.setItem("token", data.access_token); setToken(data.access_token); nav("/"); } 
    catch (e:any) { setErr(e?.response?.data?.detail || "Erreur de connexion"); }
  };
  return (
    <div className="min-h-screen paw-bg flex items-center justify-center p-4">
      <form onSubmit={submit} className="bg-white p-6 rounded-2xl shadow max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-4">Connexion</h1>
        {err && <div className="text-red-600 text-sm mb-2">{err}</div>}
        <input className="w-full border rounded-lg p-2 mb-3" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="w-full border rounded-lg p-2 mb-3" placeholder="Mot de passe" value={password} onChange={e=>setPwd(e.target.value)} />
        <button className="w-full bg-paw-600 text-white rounded-lg py-2">Se connecter</button>
        <div className="text-sm mt-3">Pas de compte ? <Link to="/register" className="underline">Inscription</Link></div>
      </form>
    </div>
  );
}

export function Register() {
  const [email, setEmail] = useState(""); const [full_name, setName] = useState(""); const [password, setPwd] = useState("");
  const [err, setErr] = useState(""); const nav = useNavigate();
  const submit = async (e:any) => {
    e.preventDefault(); setErr("");
    try { await api.post("/auth/register", { email, full_name, password }); nav("/login"); }
    catch (e:any) { setErr(e?.response?.data?.detail || "Erreur d'inscription"); }
  };
  return (
    <div className="min-h-screen paw-bg flex items-center justify-center p-4">
      <form onSubmit={submit} className="bg-white p-6 rounded-2xl shadow max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-4">Créer un compte</h1>
        {err && <div className="text-red-600 text-sm mb-2">{err}</div>}
        <input className="w-full border rounded-lg p-2 mb-3" placeholder="Nom complet" value={full_name} onChange={e=>setName(e.target.value)} />
        <input className="w-full border rounded-lg p-2 mb-3" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="w-full border rounded-lg p-2 mb-3" placeholder="Mot de passe (≥6)" value={password} onChange={e=>setPwd(e.target.value)} />
        <button className="w-full bg-paw-600 text-white rounded-lg py-2">S'inscrire</button>
        <div className="text-sm mt-3">Déjà inscrit ? <Link to="/login" className="underline">Connexion</Link></div>
      </form>
    </div>
  );
}