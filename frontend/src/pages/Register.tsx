import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import api from "../lib/api";

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", full_name: "" });
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: any) => {
    e.preventDefault();
    setErr(null);
    try {
      await api.post("/auth/register", form);
      // enchaîne sur login
      const { data } = await api.post("/auth/login", { email: form.email, password: form.password });
      localStorage.setItem("token", data.access_token);
      nav("/");
      setTimeout(() => location.reload(), 50);
    } catch (e: any) {
      setErr(e?.response?.data?.detail || "Impossible de créer le compte");
    }
  };

  return (
    <div>
      <Header />
      <main className="max-w-md mx-auto p-4">
        <h1 className="text-xl font-semibold mb-3">Inscription</h1>
        <form onSubmit={submit} className="space-y-3 bg-white border rounded-xl p-4">
          <input
            className="w-full border rounded p-2"
            type="text"
            placeholder="Nom (optionnel)"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          />
          <input
            className="w-full border rounded p-2"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className="w-full border rounded p-2"
            type="password"
            placeholder="Mot de passe (min 6)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          {err && <div className="text-red-600 text-sm">{err}</div>}
          <button className="px-4 py-2 rounded bg-paw-600 text-white">Créer le compte</button>
          <div className="text-sm">
            Déjà inscrit ? <Link to="/login" className="text-paw-700 underline">Se connecter</Link>
          </div>
        </form>
      </main>
    </div>
  );
}
