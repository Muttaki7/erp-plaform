import users from "../../data/users.json";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = () => {
        const user = users.find(
            u => u.username === username && u.password === password
        );
        if (user) navigate("/dashboard");
        else alert("Invalid credentials");
    };

    return (
        <div className="container mt-5">
            <h3>ERP Login</h3>
            <input className="form-control mb-2" placeholder="Username"
                onChange={e => setUsername(e.target.value)} />
            <input type="password" className="form-control mb-2"
                placeholder="Password"
                onChange={e => setPassword(e.target.value)} />
            <button className="btn btn-primary" onClick={handleLogin}>
                Login
            </button>
        </div>
    );
}
