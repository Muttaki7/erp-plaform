import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../auth/AuthContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const submit = async () => {
        const res = await api.post("/auth/login", {
            username: email,
            password,
        });

        login(res.data.token, { email, name: email });
        navigate("/");
    };

    return (
        <div>
            <h2>Login</h2>
            <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={submit}>Login</button>
        </div>
    );
}
