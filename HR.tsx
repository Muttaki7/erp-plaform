import { useEffect, useState } from "react";
import api from "../api/axios";

export default function HR() {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        api.get("/hr/employees").then(r => setEmployees(r.data));
    }, []);

    return <pre>{JSON.stringify(employees, null, 2)}</pre>;
}
