import React, { useEffect, useMemo, useState } from "react";
import VetMap from "../components/VetMap";
import SearchBar from "../components/SearchBar";
import { fetchVets, Vet, GeocodeResult } from "../services/api";

const DEFAULT_CENTER: [number, number] = [43.6045, 1.444]; // Toulouse

const VetsPage: React.FC = () => {
  const [vets, setVets] = useState<Vet[]>([]);
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchVets();
        setVets(data);
      } catch (e) {
        setErr("Impossible de charger les vétérinaires");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const resultsCount = useMemo(() => vets.length, [vets]);

  return (
    <div className="mx-auto grid w-full max-w-7xl grid-rows-[auto,1fr] gap-4 p-4 sm:p-6">
      {/* Header/Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-semibold">Vétérinaires proches</h1>
        <div className="sm:ml-auto w-full sm:w-96">
          <SearchBar
            onSelect={(g: GeocodeResult) => setFlyTo([g.lat, g.lng])}
            placeholder="📍 Chercher une ville, une adresse…"
          />
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
        {/* Map (responsive: 60vh on mobile) */}
        <div className="h-[60vh] min-h-[360px] w-full lg:h-[calc(100vh-160px)]">
          <VetMap vets={vets} center={DEFAULT_CENTER} flyTo={flyTo} />
        </div>

        {/* Side panel list */}
        <aside className="h-[60vh] min-h-[360px] overflow-auto rounded-2xl border border-gray-200 bg-white p-3 lg:h-[calc(100vh-160px)]">
          <div className="mb-3 text-sm text-gray-500">{resultsCount} résultat(s)</div>
          {loading && <div className="text-sm">Chargement…</div>}
          {err && <div className="text-sm text-red-600">{err}</div>}
          {!loading && !err && vets.map((v) => (
            <article key={v.id} className="mb-3 rounded-xl border border-gray-100 p-3 shadow-sm hover:shadow">
              <div className="font-medium">{v.name}</div>
              {v.address && <div className="text-xs text-gray-500">{v.address}</div>}
              {v.phone && (
                <a className="mt-1 inline-block text-sm text-pawnie-700 underline" href={`tel:${v.phone}`}>
                  {v.phone}
                </a>
              )}
              <div className="mt-2">
                <button
                  className="rounded-lg bg-pawnie-600 px-3 py-2 text-sm text-white hover:bg-pawnie-700"
                  onClick={() => setFlyTo([v.lat, v.lng])}
                >
                  Voir sur la carte
                </button>
              </div>
            </article>
          ))}
        </aside>
      </div>
    </div>
  );
};

export default VetsPage;
