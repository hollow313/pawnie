import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import api from "../lib/api";

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState<string | null>(null);
  const submit = async (e: any) => {
    e.preventDefault();
    setErr(null);
    try {
      const { data } = await api.post("/auth/login", form);
      // suppose que data = { access_token, token_type, ... }
      localStorage.setItem("token", data.access_token);
      nav("/");
      setTimeout(() => location.reload(), 50);
    } catch (e: any) {
      setErr(e?.response?.data?.detail || "Identifiants invalides");
    }
  };
  return (
    <div>
      <Header />
      <main className="max-w-md mx-auto p-4">
        <h1 className="text-xl font-semibold mb-3">Connexion</h1>
        <form onSubmit={submit} className="space-y-3 bg-white border rounded-xl p-4">
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
            placeholder="Mot de passe"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          {err && <div className="text-red-600 text-sm">{err}</div>}
          <button className="px-4 py-2 rounded bg-paw-600 text-white">Se connecter</button>
          <div className="text-sm">
            Pas de compte ? <Link to="/register" className="text-paw-700 underline">Créer un compte</Link>
          </div>
        </form>
      </main>
    </div>
  );
}
