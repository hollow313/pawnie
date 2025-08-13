import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../lib/api";
// Si tu as un composant logo, garde-le ; sinon remplace par du texte.
import PawLogo from "./PawLogo";

type Me = {
  id: number;
  email: string;
  full_name?: string;
  is_admin?: boolean;
};

type Banner = { text: string; enabled: boolean };

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [me, setMe] = useState<Me | null>(null);
  const [banner, setBanner] = useState<Banner | null>(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const authed = !!token;

  const logout = () => {
    localStorage.removeItem("token");
    setMe(null);
    nav("/login");
    // On force un refresh léger pour vider l’état app côté front
    setTimeout(() => location.reload(), 50);
  };

  useEffect(() => {
    // Charger bannière (publique)
    api.get("/admin/banner").then(r => setBanner(r.data)).catch(() => {});
    // Charger le profil si connecté
    if (authed) {
      api.get("/users/me").then(r => setMe(r.data)).catch(() => setMe(null));
    } else {
      setMe(null);
    }
  }, [authed]);

  const NavItem = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cx(
          "px-3 py-2 rounded-lg text-sm transition-colors",
          isActive ? "bg-paw-100 text-paw-700" : "hover:bg-slate-100"
        )
      }
      onClick={() => setOpen(false)}
    >
      {children}
    </NavLink>
  );

  return (
    <div className="sticky top-0 z-40">
      {/* Bandeau admin configurable */}
      {banner?.enabled && (
        <div className="bg-paw-700 text-white text-sm text-center py-1 px-2">
          {banner.text}
        </div>
      )}

      {/* Barre principale */}
      <header className="bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo / Titre */}
          <Link to="/" className="flex items-center gap-2 text-paw-700">
            {/* Si tu n’as pas PawLogo, remplace par <span className="font-bold">Pawnie 🐾</span> */}
            <PawLogo />
            <span className="hidden sm:block font-semibold">Pawnie</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavItem to="/">Accueil</NavItem>
            <NavItem to="/listings">Annonces</NavItem>
            <NavItem to="/animals">Mes animaux</NavItem>
            <NavItem to="/messages">Messages</NavItem>
            {/* Vétos (OpenStreetMap) */}
            <NavItem to="/vets">Vétos</NavItem>

            {authed ? (
              <>
                <NavItem to="/profile">Profil</NavItem>
                {me?.is_admin && <NavItem to="/admin">Admin</NavItem>}
                <button
                  onClick={logout}
                  className="ml-2 px-3 py-2 rounded-lg border text-sm hover:bg-slate-50"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <NavItem to="/login">Connexion</NavItem>
                <Link
                  to="/register"
                  className="ml-1 px-3 py-2 rounded-lg bg-paw-600 text-white text-sm hover:brightness-95"
                >
                  S’inscrire
                </Link>
              </>
            )}
          </nav>

          {/* Bouton burger */}
          <button
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border"
            onClick={() => setOpen(s => !s)}
            aria-label="Ouvrir le menu"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              {open ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile nav */}
        {open && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="max-w-6xl mx-auto px-4 py-3 grid gap-1">
              <NavItem to="/">Accueil</NavItem>
              <NavItem to="/listings">Annonces</NavItem>
              <NavItem to="/animals">Mes animaux</NavItem>
              <NavItem to="/messages">Messages</NavItem>
              <NavItem to="/vets">Vétos</NavItem>

              {authed ? (
                <>
                  <NavItem to="/profile">Profil</NavItem>
                  {me?.is_admin && <NavItem to="/admin">Admin</NavItem>}
                  <button
                    onClick={logout}
                    className="mt-1 px-3 py-2 rounded-lg border text-left text-sm"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <NavItem to="/login">Connexion</NavItem>
                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="px-3 py-2 rounded-lg bg-paw-600 text-white text-sm text-center"
                  >
                    S’inscrire
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
