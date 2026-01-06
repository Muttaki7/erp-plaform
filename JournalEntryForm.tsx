import React, { useState } from 'react';

interface JournalEntry {
    id: number;
    date: string;
    description: string;
    debit_account_id: number;
    credit_account_id: number;
    amount: number;
    tenant_id: number;
}

interface GLAccount {
    id: number;
    name: string;
    type: string;
    balance: number;
    tenant_id: number;
}

const JournalEntryForm: React.FC = () => {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        description: '',
        debit_account_id: 0,
        credit_account_id: 0,
        amount: 0,
        tenant_id: 1
    });
    const [accounts, setAccounts] = useState<GLAccount[]>([]);

    const { FileStorage } = require('../../utils/fileStorage');
    const entryStorage = new FileStorage<JournalEntry>('journalEntries');
    const accountStorage = new FileStorage<GLAccount>('glAccounts');

    React.useEffect(() => {
        const data = accountStorage.getAll(formData.tenant_id);
        setAccounts(data);
    }, [formData.tenant_id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        entryStorage.create(formData);
        // Reset form
        setFormData({
            date: new Date().toISOString().split('T')[0],
            description: '',
            debit_account_id: 0,
            credit_account_id: 0,
            amount: 0,
            tenant_id: 1
        });
        alert('Journal entry created successfully!');
    };

    return (
        <div className="container mt-4">
            <h2>Create Journal Entry</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input
                        type="date"
                        className="form-control"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        placeholder="Enter description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                    />
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="form-label">Debit Account</label>
                            <select
                                className="form-select"
                                title="Select debit account"
                                value={formData.debit_account_id}
                                onChange={(e) => setFormData({ ...formData, debit_account_id: parseInt(e.target.value) })}
                                required
                            >
                                <option value={0}>Select Account</option>
                                {accounts.map(account => (
                                    <option key={account.id} value={account.id}>{account.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="form-label">Credit Account</label>
                            <select
                                className="form-select"
                                title="Select credit account"
                                value={formData.credit_account_id}
                                onChange={(e) => setFormData({ ...formData, credit_account_id: parseInt(e.target.value) })}
                                required
                            >
                                <option value={0}>Select Account</option>
                                {accounts.map(account => (
                                    <option key={account.id} value={account.id}>{account.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Amount</label>
                    <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        placeholder="Enter amount"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Tenant ID</label>
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Enter tenant ID"
                        value={formData.tenant_id}
                        onChange={(e) => setFormData({ ...formData, tenant_id: parseInt(e.target.value) })}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Create Journal Entry</button>
            </form>
        </div>
    );
};

export default JournalEntryForm;
