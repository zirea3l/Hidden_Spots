/*import { useEffect, useState, useCallback } from "react";
import API from "../api/axios";
import PlaceCard from "../components/PlaceCard";

const Home = () => {
    const [places, setPlaces] = useState([]);

    const fetchFeed = useCallback(async () => {
        try {
            const { data } = await API.get("/places");
            setPlaces(data);
        }
        catch (err) {
            console.log(err);
        }
    }, []);

    useEffect(() => {
        fetchFeed();
    }, [fetchFeed]);

    return (
        <div style = {{ maxWidth: "600px", margin: "auto"}}>
            <h1>Explore Places 🌍</h1>
            
            {places.map((place) => (
                <PlaceCard key = {place._id} place={place}/>
            ))}
        </div>
    );
};

export default Home;*/

import { useEffect, useState } from "react";
import API from "../api/axios";
import PlaceCard from "../components/PlaceCard";
import { useNavigate } from "react-router-dom";



const Home = () => {
    const [places, setPlaces] = useState([]);

    const navigate = useNavigate();
    useEffect(() => {
        let isMounted = true;

        const fetchFeed = async () => {
            try {
                const { data } = await API.get("/places");
                if (isMounted) {
                    setPlaces(data);
                }
            } catch (err) {
                console.log(err);
            }
        };

        fetchFeed();

        return () => {
            isMounted = false; // cleanup
        };
    }, []);

    return (
        <div style={{ maxWidth: "600px", margin: "auto" }}>
            <h1>Explore Places 🌍</h1>

            <button onClick={() => navigate("/create")}>
                Add Place ➕
            </button>
            
            {places.map((place) => (
                <PlaceCard key={place._id} place={place} />
            ))}
        </div>
    );
};




export default Home;