import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import useReports from '../Hooks/useReports';
import PostForm from './PostForm';


const createIcon = (color) =>
  L.icon({
    iconUrl: `https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-${color}.png`,
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

// ✅ New: Track clicked point
function MapClickHandler({ setSelectedPosition }) {
  const map = useMap();

  useEffect(() => {
    const handleClick = (e) => {
      setSelectedPosition([e.latlng.lat, e.latlng.lng]);
    };

    map.on('click', handleClick);
    return () => map.off('click', handleClick);
  }, [map, setSelectedPosition]);

  return null;
}


function MapView() {
  const reports = useReports();
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredReports = selectedCategory === "All"
      ? reports
      : reports.filter((report) => report.category === selectedCategory);
  

  return (

    <div className="relative w-full h-screen">

      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white p-2 rounded shadow flex gap-2">
        {["All", "General", "Traffic", "Crime", "Alert"].map((cat) => (
        <button
        key={cat}
        className={`px-3 py-1 rounded-full text-sm font-medium transition ${
        selectedCategory === cat ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
        }`}
        onClick={() => setSelectedCategory(cat)}
      >
        {cat}
        </button>
        ))}
      </div>

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

      <MapClickHandler setSelectedPosition={setSelectedPosition} />

      
      {reports.length === 0 && (
        <div className="absolute top-4 left-4 bg-white text-black p-2 rounded shadow z-[10000]">
          🔍 No reports found!
        </div>
      )}

      
      

      {filteredReports.map((report) => {
        console.log("Marker Report:", report)
        
        return (<Marker
          key={report.id}
          position={[report.lat, report.lng]}
          icon={createIcon(categoryColors[report.category])} // fallback color
        >
        <Popup>
          <div>
            <h3>{report.category}</h3>
            <p>{report.message}</p>
            <p>
              {report.timestamp
                ? new Date(report.timestamp).toLocaleDateString()
                : "N/A"}
            </p>
            <p>
              {report.timestamp
                ? new Date(report.timestamp).toLocaleTimeString()
                : "N/A"}
            </p>
            <p>{report.severity || "Unspecified"}</p>
          </div>
        </Popup>

        </Marker>);
      })}



      {selectedPosition && (
        <Marker position={selectedPosition} icon={createIcon("green")}>
          <Popup>
            <PostForm position={selectedPosition} onClose={() => setSelectedPosition(null)} />
        </Popup>
        </Marker>
      )}

      </MapContainer>
    </div>

    
  );
}

export default MapView;
