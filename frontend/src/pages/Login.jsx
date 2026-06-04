import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const { login } = useContext(AuthContext);
const navigate = useNavigate();

const handleChange = (e) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value,
    });
};

const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
        const { data } = await API.post("/auth/login", formData);

        login(data);

        navigate("/");
    } catch (err) {
        setError(
        err.response?.data?.message || "Login failed"
        );
    } finally {
        setLoading(false);
    }
};

    return (
    <div
        style={{
            maxWidth: "400px",
            margin: "50px auto",
            padding: "20px",
        }}
    >
    <h2>Login</h2>

    {error && (
        <p style={{ color: "red" }}>
            {error}
        </p>
        )}

    <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
            <label>Email</label>
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                    width: "100%",
                    padding: "10px",
            }}
            />
        </div>

        <div style={{ marginBottom: "15px" }}>
            <label>Password</label>
            <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                    width: "100%",
                    padding: "10px",
            }}
            />
        </div>

        <button
            type="submit"
            disabled={loading}
            style={{
                width: "100%",
                padding: "10px",
                cursor: "pointer",
            }}
        >
        {loading ? "Logging in..." : "Login"}
        </button>
        </form>

        <p style={{ marginTop: "15px" }}>
            Don't have an account?{" "}
        <Link to="/register">Register</Link>
        </p>
    </div>
    );
};

export default Login;