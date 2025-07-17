import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import useReports from '../Hooks/useReports';


const createIcon = (color) =>
  L.icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });


const categoryColors = {
  General: "blue",
  Traffic: "orange",
  Crime: "red",
  Alert: "violet", // change to supported color
};




// ✅ Helper to dynamically fit bounds
function FitBounds({ reports }) {
  const map = useMap();

  useEffect(() => {
    if (reports.length > 0) {
      const bounds = reports.map((r) => [r.lat, r.lng]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [reports, map]);

  return null;
}

function MapView() {
  const reports = useReports();

  

  return (
    <MapContainer
      center={[18.5204, 73.8567]} // fallback center
      zoom={13}                  // fallback zoom
      className="h-screen w-full z-0"
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* ✅ Dynamically fit the map view */}
      <FitBounds reports={reports} />

      {/* Optional message if no reports */}
      {reports.length === 0 && (
        <div className="absolute top-4 left-4 bg-white text-black p-2 rounded shadow z-[10000]">
          🔍 No reports found!
        </div>
      )}

      {/* Render markers */}
      {reports.map((report) => {
        console.log("Rendering pin:", report.category, report.lat, report.lng);
        const icon = createIcon(categoryColors[report.category] || "gray");

        return (
          <Marker
            key={report.id}
            position={[report.lat, report.lng]}
            icon={icon}
            zIndexOffset={1000}
          >
            <Popup>
              <div className="text-sm">
                <p><strong>Category:</strong> {report.category}</p>
                <p><strong>Message:</strong> {report.message}</p>
                <p><strong>Time:</strong> {new Date(report.timestamp).toLocaleString()}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default MapView;
