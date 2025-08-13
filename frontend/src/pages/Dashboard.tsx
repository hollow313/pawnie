import Header from "../components/Header";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto p-4">
        <div className="rounded-3xl p-8 bg-gradient-to-r from-paw-100 to-white border">
          <h1 className="text-3xl font-bold mb-2">Bienvenue sur Pawnie 🐾</h1>
          <p className="text-slate-600">Gérez vos animaux, publiez des annonces, échangez avec les acheteurs.</p>
          <div className="mt-6 flex gap-3">
            <Link to="/new-animal" className="px-4 py-2 rounded-xl bg-paw-600 text-white">Ajouter un animal</Link>
            <Link to="/new-listing" className="px-4 py-2 rounded-xl border">Créer une annonce</Link>
            <Link to="/messages" className="px-4 py-2 rounded-xl border">Ouvrir la messagerie</Link>
          </div>
        </div>
      </main>
    </div>
  );
}