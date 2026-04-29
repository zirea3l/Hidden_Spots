import { useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../api/axios";
import { FaHeart } from "react-icons/fa";

const PlaceCard = ({ place }) => {
    const navigate = useNavigate();
    const [likes, setLikes] = useState(place.likesCount);

    const handleLike = async (e) => {
        e.stopPropagation();

        try {
            const { data } = await API.post(`/places/${place._id}/like`);
            setLikes(data.likesCount);
        }
        catch(err) {
            console.log(err);
        }
    };
    return (
        <div 
        onClick = {() => navigate(`/place/${place._id}`)}
        style = {{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "10px",
            marginBottom: "10px",
            cursor: "pointer",
        }}
        >
            {/* Image */}
            {place.images?.[0]?.url && (
                <img 
                    src = {place.images[0].url}
                    alt = "place"
                    style ={{ width: "100%", borderRadius: "10px"}}
                />
            )}

            <h3>{place.title}</h3>
            <p>{place.description}</p>

            { /*Like Button*/ }
            <button onCLick = {handleLike}>
                <FaHeart /> {likes}
            </button>
        </div>
    );
};

export default PlaceCard;