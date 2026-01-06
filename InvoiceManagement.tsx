import React, { useState, useEffect } from 'react';

interface Invoice {
    id: number;
    purchase_order_id: number;
    invoice_number: string;
    invoice_date: string;
    due_date: string;
    amount: number;
    status: 'pending' | 'paid' | 'overdue';
    tenant_id: number;
}

const InvoiceManagement: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [tenantId, setTenantId] = useState<number>(1);

    const { FileStorage } = require('../../utils/fileStorage');
    const invoiceStorage = new FileStorage<Invoice>('invoices');

    useEffect(() => {
        loadInvoices();
    }, [tenantId]);

    const loadInvoices = () => {
        const data = invoiceStorage.getAll(tenantId);
        setInvoices(data);
    };

    const handleSave = (invoiceData: Omit<Invoice, 'id'>) => {
        if (editingInvoice) {
            invoiceStorage.update(editingInvoice.id, invoiceData, tenantId);
        } else {
            invoiceStorage.create(invoiceData);
        }
        loadInvoices();
        setShowForm(false);
        setEditingInvoice(null);
    };

    const handleEdit = (invoice: Invoice) => {
        setEditingInvoice(invoice);
        setShowForm(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this invoice?')) {
            invoiceStorage.delete(id, tenantId);
            loadInvoices();
        }
    };

    const updateStatus = (id: number, status: 'pending' | 'paid' | 'overdue') => {
        invoiceStorage.update(id, { status }, tenantId);
        loadInvoices();
    };

    return (
        <div className="container mt-4">
            <h2>Invoice Management</h2>
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
                <InvoiceForm
                    invoice={editingInvoice}
                    onSave={handleSave}
                    onCancel={() => { setShowForm(false); setEditingInvoice(null); }}
                />
            )}
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>PO ID</th>
                            <th>Invoice Number</th>
                            <th>Invoice Date</th>
                            <th>Due Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map(invoice => (
                            <tr key={invoice.id}>
                                <td>{invoice.id}</td>
                                <td>{invoice.purchase_order_id}</td>
                                <td>{invoice.invoice_number}</td>
                                <td>{invoice.invoice_date}</td>
                                <td>{invoice.due_date}</td>
                                <td>${invoice.amount.toFixed(2)}</td>
                                <td>
                                    <select
                                        className="form-select form-select-sm"
                                        title="Update status"
                                        value={invoice.status}
                                        onChange={(e) => updateStatus(invoice.id, e.target.value as 'pending' | 'paid' | 'overdue')}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="paid">Paid</option>
                                        <option value="overdue">Overdue</option>
                                    </select>
                                </td>
                                <td>
                                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(invoice)}>Edit</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(invoice.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className="btn btn-success" onClick={() => { setEditingInvoice(null); setShowForm(true); }}>Add New Invoice</button>
        </div>
    );
};

interface InvoiceFormProps {
    invoice: Invoice | null;
    onSave: (invoice: Omit<Invoice, 'id'>) => void;
    onCancel: () => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoice, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        purchase_order_id: invoice?.purchase_order_id || 1,
        invoice_number: invoice?.invoice_number || '',
        invoice_date: invoice?.invoice_date || new Date().toISOString().split('T')[0],
        due_date: invoice?.due_date || new Date().toISOString().split('T')[0],
        amount: invoice?.amount || 0,
        status: invoice?.status || 'pending' as 'pending' | 'paid' | 'overdue',
        tenant_id: invoice?.tenant_id || 1
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="card mb-3">
            <div className="card-body">
                <h5>{invoice ? 'Edit Invoice' : 'Add New Invoice'}</h5>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Purchase Order ID</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter PO ID"
                                    value={formData.purchase_order_id}
                                    onChange={(e) => setFormData({ ...formData, purchase_order_id: parseInt(e.target.value) })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Invoice Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter invoice number"
                                    value={formData.invoice_number}
                                    onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Invoice Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={formData.invoice_date}
                                    onChange={(e) => setFormData({ ...formData, invoice_date: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Due Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={formData.due_date}
                                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
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
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Status</label>
                                <select
                                    className="form-select"
                                    title="Select status"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'pending' | 'paid' | 'overdue' })}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="overdue">Overdue</option>
                                </select>
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

export default InvoiceManagement;
