import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Documents() {
    const [docs, setDocs] = useState([]);

    useEffect(() => {
        api.get("/documents").then(r => setDocs(r.data));
    }, []);

    return <pre>{JSON.stringify(docs, null, 2)}</pre>;
}
