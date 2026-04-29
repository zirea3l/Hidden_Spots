import { useState } from "react";
import API from "../api/axios";

const CreatePlace = () => {
    const [form, setForm] = useState({
    title: "",
    description: "",
    category: "scenic",
    lat: "",
    lng: "",
    });

    const [images, setImages] = useState([]);

    const handleChange = (e) => {
    setForm({
    ...form,
    [e.target.name]: e.target.value,
    });
    };

    const handleImageChange = (e) => {
    setImages(e.target.files);
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Create place
    const { data } = await API.post("/places", {
        title: form.title,
        description: form.description,
        category: form.category,
        location: {
        type: "Point",
        coordinates: [Number(form.lng), Number(form.lat)],
        },
    });

    const placeId = data._id;

      // 2️⃣ Upload images
    if (images.length > 0) {
        const formData = new FormData();

        for (let img of images) {
        formData.append("images", img);
        }

        await API.post(`/places/${placeId}/images`, formData);
    }

    alert("Place created successfully 🎉");

    } catch (err) {
    console.log(err);
    }
};

return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
    <h2>Add New Place 📍</h2>

    <form onSubmit={handleSubmit}>
        <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
        />

        <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
        />

        <select name="category" onChange={handleChange}>
            <option value="scenic">Scenic</option>
            <option value="food">Food</option>
            <option value="peaceful">Peaceful</option>
            <option value="historic">Historic</option>
            <option value="hidden">Hidden</option>
        </select>

        <input
            name="lat"
            placeholder="Latitude"
            value={form.lat}
            onChange={handleChange}
        />

        <input
            name="lng"
            placeholder="Longitude"
            value={form.lng}
            onChange={handleChange}
        />

        <input type="file" multiple onChange={handleImageChange} />

        <button type="submit">Create Place</button>
        </form>
    </div>
    );
};

export default CreatePlace;