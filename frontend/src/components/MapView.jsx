import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const MapView = ({ places }) => {
    return (
        <MapContainer center = {[28.61, 77.20]} zoom = {10} style = {{ height: "400px"}}>
            <TileLayer
                url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {places.map((place) => (
                <Marker 
                    key = {place._id}
                    position = {[
                        place.location.coordinates[1],
                        place.location.coordinates[0],
                    ]}
                >
                    <Popup>{place.title}</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapView;