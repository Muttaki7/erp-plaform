import React, { useState, useEffect } from 'react';
import { Item } from '../../models/Inventory';

const InventoryList: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load inventory data from JSON file
        fetch('/data/inventory.json')
            .then(response => response.json())
            .then(data => {
                setItems(data.items);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error loading inventory data:', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="container mt-4">Loading...</div>;
    }

    return (
        <div className="container mt-4">
            <h2>Inventory Management</h2>
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.quantity}</td>
                                <td>{item.price}</td>
                                <td>
                                    <button className="btn btn-sm btn-primary me-2">Edit</button>
                                    <button className="btn btn-sm btn-danger">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className="btn btn-success">Add New Item</button>
        </div>
    );
};

export default InventoryList;
