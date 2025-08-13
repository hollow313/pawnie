import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import api from "../lib/api";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix des icônes Leaflet en bundler
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

type Vet = {
  id: number | string;
  name: string;
  address?: string;
  phone?: string;
  website?: string;
  lat: number;
  lon: number;
};

type ApiNearRes = {
  center: { lat: number; lon: number };
  radius_m: number;
  items: Vet[];
};

export default function Vets() {
  const [city, setCity] = useState("");
  const [radius, setRadius] = useState(3000);
  const [center, setCenter] = useState<{lat:number; lon:number} | null>(null);
  const [items, setItems] = useState<Vet[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const pos = useMemo(()=> center ? [center.lat, center.lon] as [number, number] : [48.8566, 2.3522] as [number, number], [center]);

  const searchCity = async (e: any) => {
    e?.preventDefault?.();
    if (!city.trim()) return;
    setLoading(true); setErr(null);
    try {
      const { data } = await api.get<ApiNearRes>("/vets/search", { params: { city, radius_m: radius } });
      setCenter(data.center);
      setItems(data.items);
    } catch (e: any) {
      setErr(e?.response?.data?.detail || "Erreur de recherche");
    } finally {
      setLoading(false);
    }
  };

  const aroundMe = () => {
    if (!navigator.geolocation) {
      setErr("La géolocalisation n'est pas supportée par ce navigateur.");
      return;
    }
    setLoading(true); setErr(null);
    navigator.geolocation.getCurrentPosition(async (g) => {
      try {
        const lat = g.coords.latitude, lon = g.coords.longitude;
        const { data } = await api.get<ApiNearRes>("/vets/near", { params: { lat, lon, radius_m: radius } });
        setCenter(data.center);
        setItems(data.items);
      } catch (e: any) {
        setErr(e?.response?.data?.detail || "Erreur de recherche");
      } finally {
        setLoading(false);
      }
    }, (e) => {
      setLoading(false);
      setErr("Impossible d'accéder à la position.");
    }, { enableHighAccuracy: true, timeout: 8000 });
  };

  // petit confort: entrée "Paris" au mount si rien
  useEffect(() => {
    if (!center && !items.length) {
      setCity("Paris");
      // pas d’auto-search pour éviter des appels non désirés
    }
  }, []);

  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto p-4">
        <h1 className="text-xl font-semibold mb-3">Trouver un vétérinaire (OpenStreetMap)</h1>

        <form onSubmit={searchCity} className="grid md:grid-cols-6 gap-2 bg-white border rounded-xl p-3 mb-4">
          <input
            className="md:col-span-3 border rounded-lg p-2"
            placeholder="Ville (ex: Toulouse, Lyon...)"
            value={city}
            onChange={(e)=>setCity(e.target.value)}
          />
          <input
            className="border rounded-lg p-2"
            type="number"
            min={500}
            max={20000}
            step={500}
            value={radius}
            onChange={(e)=>setRadius(Math.max(500, Math.min(20000, Number(e.target.value) || 3000)))}
            placeholder="Rayon (m)"
          />
          <button className="px-3 py-2 rounded-lg bg-paw-600 text-white">Rechercher</button>
          <button type="button" onClick={aroundMe} className="px-3 py-2 rounded-lg border">Autour de moi</button>
        </form>

        {err && <div className="mb-3 text-red-600 text-sm">{err}</div>}

        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="h-[480px] w-full overflow-hidden rounded-xl border bg-white">
              <MapContainer
                center={pos}
                zoom={13}
                scrollWheelZoom
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {center && <Circle center={pos} radius={radius} />}
                {items.map(v => (
                  (typeof v.lat === "number" && typeof v.lon === "number") ? (
                    <Marker key={v.id} position={[v.lat, v.lon]}>
                      <Popup>
                        <div className="space-y-1">
                          <div className="font-semibold">{v.name}</div>
                          {v.address && <div className="text-sm">{v.address}</div>}
                          {v.phone && <div className="text-sm">📞 {v.phone}</div>}
                          {v.website && <a className="text-sm text-paw-700 underline" href={v.website} target="_blank">Site web</a>}
                        </div>
                      </Popup>
                    </Marker>
                  ) : null
                ))}
              </MapContainer>
            </div>
          </div>
          <div className="md:col-span-1">
            <div className="bg-white border rounded-xl">
              <div className="p-3 border-b font-semibold">Résultats {loading && "…"} ({items.length})</div>
              <div className="max-h-[440px] overflow-auto divide-y">
                {items.map(v=>(
                  <div key={v.id} className="p-3">
                    <div className="font-medium">{v.name}</div>
                    {v.address && <div className="text-xs text-slate-600">{v.address}</div>}
                    <div className="text-xs">
                      {v.phone && <div>📞 {v.phone}</div>}
                      {v.website && <a className="text-paw-700 underline" href={v.website} target="_blank">Site web</a>}
                    </div>
                  </div>
                ))}
                {!items.length && !loading && (
                  <div className="p-3 text-sm text-slate-500">Aucun résultat. Lance une recherche ville ou “Autour de moi”.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
