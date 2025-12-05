import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {useEffect, useState} from "react";

const Map = ({coordonneesX, coordonneesY}) => {
    // const position = [50.588174, 3.105113]
    const [position, setPosition] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setPosition([coordonneesX, coordonneesY])
        setLoading(false)
    }, []);

    return (<>
        {!loading &&
            <MapContainer center={position}
                          zoom={20}
                          scrollWheelZoom={false}
                          className={"z-50 max-h-[300px] w-full bg-red-500"}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    <Popup>
                        Serre-vis Informatique
                    </Popup>
                </Marker>
            </MapContainer>
        }
    </>
    );
};

export default Map;