"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Attraction } from "@/types";
import { useEffect } from "react";

// Fix leaflet default icon issue in Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Props {
  attractions: Attraction[];
}

export default function TripMap({ attractions }: Props) {
  useEffect(() => {
    L.Marker.prototype.options.icon = DefaultIcon;
  }, []);

  const validAttractions = attractions.filter((a) => a.lat && a.lng);
  if (validAttractions.length === 0) return null;

  const center: [number, number] = [validAttractions[0].lat!, validAttractions[0].lng!];

  return (
    <div className="h-[400px] w-full overflow-hidden rounded-lg">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validAttractions.map((attraction, i) => (
          <Marker key={i} position={[attraction.lat!, attraction.lng!]}>
            <Popup>
              <div className="text-right" dir="rtl">
                <strong>{attraction.name}</strong>
                <p className="text-sm">{attraction.description}</p>
                {attraction.cost > 0 && (
                  <p className="text-sm">💰 ₪{attraction.cost}</p>
                )}
                <p className="text-xs text-gray-500">{attraction.timeNeeded}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
