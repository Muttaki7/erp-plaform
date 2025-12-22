import { useEffect, useState } from "react";
import api from "../api/axios";

interface InventoryItem {
    _id: string;
    name: string;
    quantity: number;
}

export default function Inventory() {
    const [items, setItems] = useState<InventoryItem[]>([]);

    useEffect(() => {
        api.get("/inventory").then((res) => setItems(res.data));
    }, []);

    return (
        <div>
            <h2>Inventory</h2>
            <ul>
                {items.map((i: InventoryItem) => (
                    <li key={i._id}>{i.name} - {i.quantity}</li>
                ))}
            </ul>
        </div>
    );
}
