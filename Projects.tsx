import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Projects() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        api.get("/projects").then(r => setProjects(r.data));
    }, []);

    return <pre>{JSON.stringify(projects, null, 2)}</pre>;
}
