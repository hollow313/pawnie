import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import type { Vet } from "../services/api";
import markerIcon2xUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";

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

function FlyTo({ center, zoom }: { center: [number, number]; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom ?? 13, { duration: 0.8 });
  }, [center, zoom, map]);
  return null;
}

type Props = {
  vets: Vet[];
  center: [number, number];
  zoom?: number;
  flyTo?: [number, number] | null;
};

const VetMap: React.FC<Props> = ({ vets, center, zoom = 12, flyTo = null }) => {
  const markers = useMemo(() => vets.filter(v => Number.isFinite(v.lat) && Number.isFinite(v.lng)), [vets]);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom
      style={{ width: "100%", height: "100%" }}
      className="rounded-2xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {flyTo && <FlyTo center={flyTo} />}

      <MarkerClusterGroup chunkedLoading>
        {markers.map((v) => (
          <Marker key={v.id} position={[v.lat, v.lng]}>
            <Popup>
              <div className="space-y-1">
                <div className="font-semibold">{v.name}</div>
                {v.address && <div className="text-xs text-gray-500">{v.address}</div>}
                {v.phone && (
                  <a className="text-sm text-pawnie-700 underline" href={`tel:${v.phone}`}>
                    {v.phone}
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default VetMap;
