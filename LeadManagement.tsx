import React, { useState, useEffect } from 'react';

interface Lead {
    id: number;
    name: string;
    email: string;
    phone: string;
    company: string;
    status: 'new' | 'contacted' | 'qualified' | 'lost';
    source: string;
    tenant_id: number;
}

const LeadManagement: React.FC = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [editingLead, setEditingLead] = useState<Lead | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [tenantId, setTenantId] = useState<number>(1);

    const { FileStorage } = require('../../utils/fileStorage');
    const leadStorage = new FileStorage<Lead>('leads');

    useEffect(() => {
        loadLeads();
    }, [tenantId]);

    const loadLeads = () => {
        const data = leadStorage.getAll(tenantId);
        setLeads(data);
    };

    const handleSave = (leadData: Omit<Lead, 'id'>) => {
        if (editingLead) {
            leadStorage.update(editingLead.id, leadData, tenantId);
        } else {
            leadStorage.create(leadData);
        }
        loadLeads();
        setShowForm(false);
        setEditingLead(null);
    };

    const handleEdit = (lead: Lead) => {
        setEditingLead(lead);
        setShowForm(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this lead?')) {
            leadStorage.delete(id, tenantId);
            loadLeads();
        }
    };

    const updateStatus = (id: number, status: 'new' | 'contacted' | 'qualified' | 'lost') => {
        leadStorage.update(id, { status }, tenantId);
        loadLeads();
    };

    return (
        <div className="container mt-4">
            <h2>Lead Management</h2>
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
                <LeadForm
                    lead={editingLead}
                    onSave={handleSave}
                    onCancel={() => { setShowForm(false); setEditingLead(null); }}
                />
            )}
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Company</th>
                            <th>Source</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.map(lead => (
                            <tr key={lead.id}>
                                <td>{lead.id}</td>
                                <td>{lead.name}</td>
                                <td>{lead.email}</td>
                                <td>{lead.phone}</td>
                                <td>{lead.company}</td>
                                <td>{lead.source}</td>
                                <td>
                                    <select
                                        className="form-select form-select-sm"
                                        title="Update status"
                                        value={lead.status}
                                        onChange={(e) => updateStatus(lead.id, e.target.value as 'new' | 'contacted' | 'qualified' | 'lost')}
                                    >
                                        <option value="new">New</option>
                                        <option value="contacted">Contacted</option>
                                        <option value="qualified">Qualified</option>
                                        <option value="lost">Lost</option>
                                    </select>
                                </td>
                                <td>
                                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(lead)}>Edit</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(lead.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className="btn btn-success" onClick={() => { setEditingLead(null); setShowForm(true); }}>Add New Lead</button>
        </div>
    );
};

interface LeadFormProps {
    lead: Lead | null;
    onSave: (lead: Omit<Lead, 'id'>) => void;
    onCancel: () => void;
}

const LeadForm: React.FC<LeadFormProps> = ({ lead, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: lead?.name || '',
        email: lead?.email || '',
        phone: lead?.phone || '',
        company: lead?.company || '',
        status: lead?.status || 'new' as 'new' | 'contacted' | 'qualified' | 'lost',
        source: lead?.source || '',
        tenant_id: lead?.tenant_id || 1
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="card mb-3">
            <div className="card-body">
                <h5>{lead ? 'Edit Lead' : 'Add New Lead'}</h5>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter lead name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Company</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter company name"
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
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
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Source</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter lead source"
                                    value={formData.source}
                                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
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
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'new' | 'contacted' | 'qualified' | 'lost' })}
                                >
                                    <option value="new">New</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="qualified">Qualified</option>
                                    <option value="lost">Lost</option>
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

export default LeadManagement;
