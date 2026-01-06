import React, { useState, useEffect } from 'react';

interface GLAccount {
    id: number;
    name: string;
    type: string;
    balance: number;
    tenant_id: number;
}

const GLAccountList: React.FC = () => {
    const [accounts, setAccounts] = useState<GLAccount[]>([]);
    const [editingAccount, setEditingAccount] = useState<GLAccount | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [tenantId, setTenantId] = useState<number>(1);

    const { FileStorage } = require('../../utils/fileStorage');
    const accountStorage = new FileStorage<GLAccount>('glAccounts');

    useEffect(() => {
        loadAccounts();
    }, [tenantId]);

    const loadAccounts = () => {
        const data = accountStorage.getAll(tenantId);
        setAccounts(data);
    };

    const handleSave = (accountData: Omit<GLAccount, 'id'>) => {
        if (editingAccount) {
            accountStorage.update(editingAccount.id, accountData, tenantId);
        } else {
            accountStorage.create(accountData);
        }
        loadAccounts();
        setShowForm(false);
        setEditingAccount(null);
    };

    const handleEdit = (account: GLAccount) => {
        setEditingAccount(account);
        setShowForm(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this GL account?')) {
            accountStorage.delete(id, tenantId);
            loadAccounts();
        }
    };

    return (
        <div className="container mt-4">
            <h2>GL Account Management</h2>
            <div className="mb-3">
                <label className="form-label">Tenant ID</label>
                <input
                    type="number"
                    className="form-control"
                    placeholder="Enter tenant ID"
                    value={tenantId}
                    onChange={(e) => setTenantId(parseInt(e.target.value))}
                />
            </div>
            {showForm && (
                <GLAccountForm
                    account={editingAccount}
                    onSave={handleSave}
                    onCancel={() => { setShowForm(false); setEditingAccount(null); }}
                />
            )}
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
                        {accounts.map(account => (
                            <tr key={account.id}>
                                <td>{account.id}</td>
                                <td>{account.name}</td>
                                <td>{account.type}</td>
                                <td>${account.balance.toFixed(2)}</td>
                                <td>
                                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(account)}>Edit</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(account.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className="btn btn-success" onClick={() => { setEditingAccount(null); setShowForm(true); }}>Add New GL Account</button>
        </div>
    );
};

interface GLAccountFormProps {
    account: GLAccount | null;
    onSave: (account: Omit<GLAccount, 'id'>) => void;
    onCancel: () => void;
}

const GLAccountForm: React.FC<GLAccountFormProps> = ({ account, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: account?.name || '',
        type: account?.type || 'asset',
        balance: account?.balance || 0,
        tenant_id: account?.tenant_id || 1
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="card mb-3">
            <div className="card-body">
                <h5>{account ? 'Edit GL Account' : 'Add New GL Account'}</h5>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter account name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Type</label>
                                <select
                                    className="form-select"
                                    title="Select account type"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="asset">Asset</option>
                                    <option value="liability">Liability</option>
                                    <option value="equity">Equity</option>
                                    <option value="revenue">Revenue</option>
                                    <option value="expense">Expense</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Balance</label>
                        <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            placeholder="Enter balance"
                            value={formData.balance}
                            onChange={(e) => setFormData({ ...formData, balance: parseFloat(e.target.value) })}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary me-2">Save</button>
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default GLAccountList;
