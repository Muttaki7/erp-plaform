import { useEffect, useState } from "react";
import api from "../api/axios";

export default function CRM() {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        api.get("/crm").then(r => setCustomers(r.data));
    }, []);

    return <pre>{JSON.stringify(customers, null, 2)}</pre>;
}
