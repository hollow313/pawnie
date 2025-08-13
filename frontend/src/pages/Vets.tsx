import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix des icônes par défaut (chemins packagés par Vite)
import markerIcon2xUrl from 'leaflet/dist/images/marker-icon-2x.png';
import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Applique les URLs aux icônes Leaflet
const DefaultIcon = L.icon({
  iconUrl: markerIconUrl,
  iconRetinaUrl: markerIcon2xUrl,
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const Vets: React.FC = () => {
  // Centre par défaut (ex: Toulouse)
  const center = useMemo<[number, number]>(() => [43.6045, 1.444], []);

  // TODO: branche sur ton backend pour lister les vétos
  const vets = [
    { id: 'v1', name: 'Clinique Vétérinaire Wilson', lat: 43.606, lng: 1.447 },
    { id: 'v2', name: 'Cabinet Vet Patte Blanche', lat: 43.598, lng: 1.43 }
  ];

  return (
    <div className="w-full h-[calc(100vh-80px)]">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {vets.map(v => (
          <Marker key={v.id} position={[v.lat, v.lng]}>
            <Popup>
              <div className="font-semibold">{v.name}</div>
              <div className="text-xs text-gray-500">({v.lat.toFixed(4)}, {v.lng.toFixed(4)})</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Vets;
