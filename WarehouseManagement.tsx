import React, { useState, useEffect } from 'react';

interface Warehouse {
    id: number;
    name: string;
    location: string;
    capacity: number;
    manager_id: number;
    tenant_id: number;
}

const WarehouseManagement: React.FC = () => {
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [tenantId, setTenantId] = useState<number>(1);

    const { FileStorage } = require('../../utils/fileStorage');
    const warehouseStorage = new FileStorage<Warehouse>('warehouses');

    useEffect(() => {
        loadWarehouses();
    }, [tenantId]);

    const loadWarehouses = () => {
        const data = warehouseStorage.getAll(tenantId);
        setWarehouses(data);
    };

    const handleSave = (warehouseData: Omit<Warehouse, 'id'>) => {
        if (editingWarehouse) {
            warehouseStorage.update(editingWarehouse.id, warehouseData, tenantId);
        } else {
            warehouseStorage.create(warehouseData);
        }
        loadWarehouses();
        setShowForm(false);
        setEditingWarehouse(null);
    };

    const handleEdit = (warehouse: Warehouse) => {
        setEditingWarehouse(warehouse);
        setShowForm(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this warehouse?')) {
            warehouseStorage.delete(id, tenantId);
            loadWarehouses();
        }
    };

    return (
        <div className="container mt-4">
            <h2>Warehouse Management</h2>
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
                <WarehouseForm
                    warehouse={editingWarehouse}
                    onSave={handleSave}
                    onCancel={() => { setShowForm(false); setEditingWarehouse(null); }}
                />
            )}
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Location</th>
                            <th>Capacity</th>
                            <th>Manager ID</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {warehouses.map(warehouse => (
                            <tr key={warehouse.id}>
                                <td>{warehouse.id}</td>
                                <td>{warehouse.name}</td>
                                <td>{warehouse.location}</td>
                                <td>{warehouse.capacity}</td>
                                <td>{warehouse.manager_id}</td>
                                <td>
                                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(warehouse)}>Edit</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(warehouse.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className="btn btn-success" onClick={() => { setEditingWarehouse(null); setShowForm(true); }}>Add New Warehouse</button>
        </div>
    );
};

interface WarehouseFormProps {
    warehouse: Warehouse | null;
    onSave: (warehouse: Omit<Warehouse, 'id'>) => void;
    onCancel: () => void;
}

const WarehouseForm: React.FC<WarehouseFormProps> = ({ warehouse, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: warehouse?.name || '',
        location: warehouse?.location || '',
        capacity: warehouse?.capacity || 0,
        manager_id: warehouse?.manager_id || 1,
        tenant_id: warehouse?.tenant_id || 1
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="card mb-3">
            <div className="card-body">
                <h5>{warehouse ? 'Edit Warehouse' : 'Add New Warehouse'}</h5>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter warehouse name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Location</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter location"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Capacity</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter capacity"
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Manager ID</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter manager ID"
                                    value={formData.manager_id}
                                    onChange={(e) => setFormData({ ...formData, manager_id: parseInt(e.target.value) })}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary me-2">Save</button>
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default WarehouseManagement;
