import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const defaultCenter = {
  lat: 24.8607, // Karachi example
  lng: 67.0011,
};

const GoogleMapView = ({ bins = [] }) => {
  const locations = bins
    .filter((bin) => Number.isFinite(bin?.lat) && Number.isFinite(bin?.lng))
    .map((bin) => ({
      id: bin._id || bin.binNumber,
      lat: bin.lat,
      lng: bin.lng,
      binNumber: bin.binNumber,
      zoneName: bin.zoneName,
      wardName: bin.wardName,
      isActive: bin.isActive,
    }));

  const center = locations.length
    ? { lat: locations[0].lat, lng: locations[0].lng }
    : defaultCenter;

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="border-3 border-gray-300 rounded-4xl overflow-hidden shadow-lg">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={14}
          scrollWheelZoom={true}
          style={{ width: "100%", height: "500px" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {locations.map((loc) => (
            <Marker
              key={loc.id}
              position={[loc.lat, loc.lng]}
              icon={defaultIcon}
            >
              <Popup>
                <div className="text-sm">
                  <div>Bin #{loc.binNumber || loc.id}</div>
                  <div className="text-gray-500">
                    {loc.zoneName || "Unknown zone"} • {loc.wardName || "Unknown ward"}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default GoogleMapView;
