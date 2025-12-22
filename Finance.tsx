import { useEffect, useState } from "react";
import api from "../api/axios";

interface FinanceItem {
    _id: string;
    title: string;
    amount: number;
}

export default function Finance() {
    const [data, setData] = useState<FinanceItem[]>([]);

    useEffect(() => {
        api.get("/finance").then((res) => setData(res.data));
    }, []);

    return (
        <div>
            <h2>Finance</h2>
            <ul>
                {data.map((f: FinanceItem) => (
                    <li key={f._id}>{f.title} - {f.amount}</li>
                ))}
            </ul>
        </div>
    );
}
