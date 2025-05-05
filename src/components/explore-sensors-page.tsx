import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvent,
} from "react-leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Override the default icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const redIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconRetinaUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Sensor {
  id: number;
  lat: number;
  lng: number;
}

export default function ExploreSensors() {
  const [sensors] = useState<Sensor[]>([
    { id: 1, lat: 40.7128, lng: -74.006 },
    { id: 2, lat: 34.0522, lng: -118.2437 },
    { id: 3, lat: 51.5074, lng: -0.1278 },
    { id: 4, lat: 48.8566, lng: 2.3522 },
    { id: 5, lat: 35.6895, lng: 139.6917 },
    { id: 6, lat: -33.8688, lng: 151.2093 },
    { id: 7, lat: 55.7558, lng: 37.6173 },
    { id: 8, lat: 37.7749, lng: -122.4194 },
    { id: 9, lat: 52.52, lng: 13.405 },
    { id: 10, lat: -23.5505, lng: -46.6333 },
  ]);

  const center = [sensors[0].lat, sensors[0].lng] as [number, number];

  const [newMarkerPos, setNewMarkerPos] = useState<[number, number] | null>(
    null
  );

  // attach a click listener to the map
  function MapClickHandler() {
    useMapEvent("click", (e) => {
      setNewMarkerPos([e.latlng.lat, e.latlng.lng]);
    });
    return null;
  }

  const handleButtonClick = (id: number | "new") => {
    if (id === "new") {
      alert("You clicked the new red marker!");
    } else {
      alert(`Button clicked for sensor ${id}`);
    }
  };

  return (
    <div
      style={{
        width: 1000,
        height: 600,
        margin: "40px auto",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      }}
    >
      <MapContainer
        center={center}
        zoom={3}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {sensors.map((sensor) => {
          const position = [sensor.lat, sensor.lng] as [number, number];
          return (
            <Marker key={sensor.id} position={position}>
              <Popup>
                <div style={{ textAlign: "center", width: 200, height: 100 }}>
                  <p>Sensor #{sensor.id}</p>
                  <button
                    onClick={() => handleButtonClick(sensor.id)}
                    className="primary-button"
                  >
                    Request data
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <MapClickHandler />
        {newMarkerPos && (
          <Marker position={newMarkerPos} icon={redIcon}>
            <Popup>
              <div style={{ textAlign: "center" }}>
                <p>You have selected a region without a sensor</p>
                <button
                  onClick={() => handleButtonClick("new")}
                  className="primary-button"
                >
                  Calculate data
                </button>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
