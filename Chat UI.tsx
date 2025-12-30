export default function AICopilot() {
    const [q, setQ] = useState("");
    const [a, setA] = useState("");

    const ask = async () => {
        const r = await api.post("/ai/ask", { question: q });
        setA(r.data.answer);
    };

    return (
        <>
            <input onChange={e => setQ(e.target.value)} />
            <button onClick={ask}>Ask AI</button>
            <p>{a}</p>
        </>
    );
}
import { useState } from "react";
import api from "../api/axios";
