import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import { FaHeart } from "react-icons/fa";

const PlaceDetails = () => {
    const { id } = useParams();

    const [place, setPlace] = useState(null);
    const [comments, setComments] = useState([]);
    const [text, setText] = useState("");

    useEffect(() => {
        fetchPlace();
        fetchComments();
    }, []);

    const fetchPlace = async () => {
        try {
            const { data } = await API.get(`/places/${id}`);
            setPlace(data);
        }
        catch (err) {
            console.log(err);
        }
    };

    const fetchComments = async () => {
        try {
            const { data } = await API.get(`/comments/${id}`);
            setComments(data);
        }
        catch (err) {
            console.log(err);
        }
    };

    const handleLike = async () => {
        try {
            await API.post(`/places/${id}/like`);
            fetchPlace(); //refresh
        }
        catch (err) {
            console.log(err);
        }
    };

    const handleComment = async () => {
        if(!text) return;

        try {
            await API.post(`/comments${id}` , { content: text });
            setText("");
            fetchComments();
        }
        catch (err) {
            console.log(err);
        }
    };

    if(!place) return <p>Loading...</p>;

    return (
        <div style={{ maxWidth: "600px", margin: "auto"}}>
            <h2>{place.title}</h2>

            {/* Images */}
            {place.images?.map((img, i) => (
                <img
                    key={i}
                    src={img.url}
                    alt=""
                    style={{ width: "100%", marginBottom: "10px", borderRadius: "10px"}}
                />
            ))}

            {/* Description */}
            <p>{place.description}</p>

            {/* Like */}
            <button onClick={handleLike}>
                <FaHeart /> {place.likesCount}
            </button>

            <hr />

            {/* Comments */}
            <h3>Comments</h3>

            {comments.map((c) => (
                <div key={c._id} style={{ marginBottom: "10px"}}>
                    <strong>{c.user?.name}</strong>
                    <p>{c.content}</p>
                </div>
            ))}

            {/* Add Comment */}
            <div>
                <input 
                    type="text"
                    placeholder="Write a comment..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button onClick={handleComment}>Post</button>
            </div>
        </div>
    );
};

export default PlaceDetails;