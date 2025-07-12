"use client";

import React, { useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";

// Fix default icon issue in Leaflet with Next.js
// https://github.com/PaulLeCam/react-leaflet/issues/453

delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const colors = [
  "#e6194b",
  "#3cb44b",
  "#ffe119",
  "#4363d8",
  "#f58231",
  "#911eb4",
  "#46f0f0",
  "#f032e6",
  "#bcf60c",
  "#fabebe",
  "#008080",
  "#e6beff",
  "#9a6324",
  "#fffac8",
  "#800000",
  "#aaffc3",
  "#808000",
  "#ffd8b1",
  "#000075",
  "#808080",
];

interface Location {
  id: string;
  label?: string;
  latitude: number;
  longitude: number;
}

interface MapProps {
  locations: Location[];
  center?: [number, number];
  height?: string | number;
}

const Map: React.FC<MapProps> = ({
  locations,
  center = [30.57881, -97.85307], // default Leander center
  height = "400px",
}) => {
  //   const latlngs = locations.map((loc) => [loc.latitude, loc.longitude]);
  const latlngs = locations.map((loc) => [loc.latitude, loc.longitude]);
  let markerGroups = {};
  locations.forEach((loc) => {
    if (loc.label && loc.label in markerGroups) {
      markerGroups[loc.label].push([loc.latitude, loc.longitude]);
    } else {
      markerGroups[loc.label] = [[loc.latitude, loc.longitude]];
    }
  });
  const bounds = latlngs.length > 0
          ? (latlngs as L.LatLngExpression[] )
          : ([center] as L.LatLngExpression[])
  console.log(bounds)
  return (
    <MapContainer
      style={{ height: height, width: "100%", borderRadius: "1rem", zIndex: 5 }}
      bounds={bounds}
      //   scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* <Polyline pathOptions={{ color: "blue" }} positions={latlngs} /> */}
      {Object.keys(markerGroups).map((label, idx) => {
        // Generate a random color for each group (stable per render)
        const color = useMemo(() => {
          return colors[idx % colors.length];
        }, [idx]);
        return (
          <Polyline
            key={label}
            pathOptions={{ color }}
            positions={markerGroups[label]}
          />
        );
      })}
      {/* Place markers */}
      {locations.map(({ latitude, longitude, label, id }) => (
        <Marker key={id} position={[latitude, longitude]}>
          {label && <Popup>{label}</Popup>}
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
