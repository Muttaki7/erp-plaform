import React, { useState, useEffect } from 'react';

interface Vendor {
    id: number;
    name: string;
    contact_person: string;
    email: string;
    phone: string;
    address: string;
    tenant_id: number;
}

const VendorList: React.FC = () => {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [tenantId, setTenantId] = useState<number>(1);

    const { FileStorage } = require('../../utils/fileStorage');
    const vendorStorage = new FileStorage<Vendor>('vendors');

    useEffect(() => {
        loadVendors();
    }, [tenantId]);

    const loadVendors = () => {
        const data = vendorStorage.getAll(tenantId);
        setVendors(data);
    };

    const handleSave = (vendorData: Omit<Vendor, 'id'>) => {
        if (editingVendor) {
            vendorStorage.update(editingVendor.id, vendorData, tenantId);
        } else {
            vendorStorage.create(vendorData);
        }
        loadVendors();
        setShowForm(false);
        setEditingVendor(null);
    };

    const handleEdit = (vendor: Vendor) => {
        setEditingVendor(vendor);
        setShowForm(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this vendor?')) {
            vendorStorage.delete(id, tenantId);
            loadVendors();
        }
    };

    return (
        <div className="container mt-4">
            <h2>Vendor Management</h2>
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
                <VendorForm
                    vendor={editingVendor}
                    onSave={handleSave}
                    onCancel={() => { setShowForm(false); setEditingVendor(null); }}
                />
            )}
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Contact Person</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendors.map(vendor => (
                            <tr key={vendor.id}>
                                <td>{vendor.id}</td>
                                <td>{vendor.name}</td>
                                <td>{vendor.contact_person}</td>
                                <td>{vendor.email}</td>
                                <td>{vendor.phone}</td>
                                <td>{vendor.address}</td>
                                <td>
                                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(vendor)}>Edit</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(vendor.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className="btn btn-success" onClick={() => { setEditingVendor(null); setShowForm(true); }}>Add New Vendor</button>
        </div>
    );
};

interface VendorFormProps {
    vendor: Vendor | null;
    onSave: (vendor: Omit<Vendor, 'id'>) => void;
    onCancel: () => void;
}

const VendorForm: React.FC<VendorFormProps> = ({ vendor, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: vendor?.name || '',
        contact_person: vendor?.contact_person || '',
        email: vendor?.email || '',
        phone: vendor?.phone || '',
        address: vendor?.address || '',
        tenant_id: vendor?.tenant_id || 1
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="card mb-3">
            <div className="card-body">
                <h5>{vendor ? 'Edit Vendor' : 'Add New Vendor'}</h5>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter vendor name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Contact Person</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter contact person"
                                    value={formData.contact_person}
                                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Enter email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Phone</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    placeholder="Enter phone number"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Address</label>
                        <textarea
                            className="form-control"
                            placeholder="Enter address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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

export default VendorList;
