export type Vet = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address?: string;
  phone?: string;
};

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export async function fetchVets(): Promise<Vet[]> {
  const r = await fetch(`${API_BASE}/v1/vets`);
  if (!r.ok) throw new Error("Failed to fetch vets");
  return r.json();
}

export type GeocodeResult = {
  lat: number;
  lng: number;
  displayName: string;
};

export async function geocode(query: string): Promise<GeocodeResult[]> {
  const r = await fetch(`${API_BASE}/v1/geocode?q=${encodeURIComponent(query)}`);
  if (!r.ok) throw new Error("Failed to geocode");
  return r.json();
}
