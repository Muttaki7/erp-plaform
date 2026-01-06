import React, { useState, useEffect } from 'react';
import { GLAccount } from '../../models/Finance';

const FinanceList: React.FC = () => {
    const [glAccounts, setGlAccounts] = useState<GLAccount[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load finance data from JSON file
        fetch('/data/finance.json')
            .then(response => response.json())
            .then(data => {
                setGlAccounts(data.glAccounts);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error loading finance data:', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="container mt-4">Loading...</div>;
    }

    return (
        <div className="container mt-4">
            <h2>Finance Management</h2>
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Balance</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {glAccounts.map(account => (
                            <tr key={account.id}>
                                <td>{account.id}</td>
                                <td>{account.name}</td>
                                <td>{account.type}</td>
                                <td>{account.balance}</td>
                                <td>
                                    <button className="btn btn-sm btn-primary me-2">Edit</button>
                                    <button className="btn btn-sm btn-danger">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className="btn btn-success">Add New Account</button>
        </div>
    );
};

export default FinanceList;
