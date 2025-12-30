import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Reports() {
    const [data, setData] = useState([]);

    useEffect(() => {
        api.get("/reports/summary").then(r => setData(r.data));
    }, []);

    return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
