import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: 24.8607, // Karachi example
  lng: 67.0011,
};

const GoogleMapView = () => {
  const locations = [
    { id: 1, lat: 24.8615, lng: 67.005, type: "green" },
    { id: 2, lat: 24.859, lng: 67.002, type: "red" },
    { id: 3, lat: 24.863, lng: 67.008, type: "green" },
    { id: 4, lat: 24.857, lng: 67.006, type: "red" },
  ];

  return (
    <div className="  bg-gray-100 min-h-screen">
      <div className="border-3 border-gray-300 rounded-4xl overflow-hidden shadow-lg">
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={14}
          >
            {locations.map((loc) => (
              <Marker
                key={loc.id}
                position={{ lat: loc.lat, lng: loc.lng }}
                icon={{
                  url:
                    loc.type === "green"
                    
                      ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                      : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                }}
              />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>
      
    </div>
  );
};

export default GoogleMapView;
