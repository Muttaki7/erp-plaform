import React, { useState, useEffect } from 'react';

interface PurchaseOrder {
    id: number;
    vendor_id: number;
    order_date: string;
    expected_delivery_date: string;
    status: 'draft' | 'approved' | 'ordered' | 'received' | 'cancelled';
    total_amount: number;
    tenant_id: number;
}

const PurchaseOrderList: React.FC = () => {
    const [orders, setOrders] = useState<PurchaseOrder[]>([]);
    const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [tenantId, setTenantId] = useState<number>(1);

    const { FileStorage } = require('../../utils/fileStorage');
    const orderStorage = new FileStorage<PurchaseOrder>('purchaseOrders');

    useEffect(() => {
        loadOrders();
    }, [tenantId]);

    const loadOrders = () => {
        const data = orderStorage.getAll(tenantId);
        setOrders(data);
    };

    const handleSave = (orderData: Omit<PurchaseOrder, 'id'>) => {
        if (editingOrder) {
            orderStorage.update(editingOrder.id, orderData, tenantId);
        } else {
            orderStorage.create(orderData);
        }
        loadOrders();
        setShowForm(false);
        setEditingOrder(null);
    };

    const handleEdit = (order: PurchaseOrder) => {
        setEditingOrder(order);
        setShowForm(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this purchase order?')) {
            orderStorage.delete(id, tenantId);
            loadOrders();
        }
    };

    const updateStatus = (id: number, status: 'draft' | 'approved' | 'ordered' | 'received' | 'cancelled') => {
        orderStorage.update(id, { status }, tenantId);
        loadOrders();
    };

    return (
        <div className="container mt-4">
            <h2>Purchase Order Management</h2>
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
                <PurchaseOrderForm
                    order={editingOrder}
                    onSave={handleSave}
                    onCancel={() => { setShowForm(false); setEditingOrder(null); }}
                />
            )}
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Vendor ID</th>
                            <th>Order Date</th>
                            <th>Expected Delivery</th>
                            <th>Status</th>
                            <th>Total Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.vendor_id}</td>
                                <td>{order.order_date}</td>
                                <td>{order.expected_delivery_date}</td>
                                <td>
                                    <select
                                        className="form-select form-select-sm"
                                        title="Update status"
                                        value={order.status}
                                        onChange={(e) => updateStatus(order.id, e.target.value as 'draft' | 'approved' | 'ordered' | 'received' | 'cancelled')}
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="approved">Approved</option>
                                        <option value="ordered">Ordered</option>
                                        <option value="received">Received</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td>${order.total_amount.toFixed(2)}</td>
                                <td>
                                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(order)}>Edit</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(order.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className="btn btn-success" onClick={() => { setEditingOrder(null); setShowForm(true); }}>Add New Purchase Order</button>
        </div>
    );
};

interface PurchaseOrderFormProps {
    order: PurchaseOrder | null;
    onSave: (order: Omit<PurchaseOrder, 'id'>) => void;
    onCancel: () => void;
}

const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({ order, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        vendor_id: order?.vendor_id || 1,
        order_date: order?.order_date || new Date().toISOString().split('T')[0],
        expected_delivery_date: order?.expected_delivery_date || new Date().toISOString().split('T')[0],
        status: order?.status || 'draft' as 'draft' | 'approved' | 'ordered' | 'received' | 'cancelled',
        total_amount: order?.total_amount || 0,
        tenant_id: order?.tenant_id || 1
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="card mb-3">
            <div className="card-body">
                <h5>{order ? 'Edit Purchase Order' : 'Add New Purchase Order'}</h5>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Vendor ID</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter vendor ID"
                                    value={formData.vendor_id}
                                    onChange={(e) => setFormData({ ...formData, vendor_id: parseInt(e.target.value) })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Total Amount</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                    placeholder="Enter total amount"
                                    value={formData.total_amount}
                                    onChange={(e) => setFormData({ ...formData, total_amount: parseFloat(e.target.value) })}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Order Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={formData.order_date}
                                    onChange={(e) => setFormData({ ...formData, order_date: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Expected Delivery Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={formData.expected_delivery_date}
                                    onChange={(e) => setFormData({ ...formData, expected_delivery_date: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Status</label>
                        <select
                            className="form-select"
                            title="Select status"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'approved' | 'ordered' | 'received' | 'cancelled' })}
                        >
                            <option value="draft">Draft</option>
                            <option value="approved">Approved</option>
                            <option value="ordered">Ordered</option>
                            <option value="received">Received</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary me-2">Save</button>
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default PurchaseOrderList;
