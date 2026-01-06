import React, { useState, useEffect } from 'react';

interface LeaveRequest {
    id: number;
    employee_id: number;
    leave_type: string;
    start_date: string;
    end_date: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    tenant_id: number;
}

const LeaveManagement: React.FC = () => {
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
    const [editingRequest, setEditingRequest] = useState<LeaveRequest | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [tenantId, setTenantId] = useState<number>(1);

    const { FileStorage } = require('../../utils/fileStorage');
    const leaveStorage = new FileStorage<LeaveRequest>('leaveRequests');

    useEffect(() => {
        loadLeaveRequests();
    }, [tenantId]);

    const loadLeaveRequests = () => {
        const data = leaveStorage.getAll(tenantId);
        setLeaveRequests(data);
    };

    const handleSave = (requestData: Omit<LeaveRequest, 'id'>) => {
        if (editingRequest) {
            leaveStorage.update(editingRequest.id, requestData, tenantId);
        } else {
            leaveStorage.create(requestData);
        }
        loadLeaveRequests();
        setShowForm(false);
        setEditingRequest(null);
    };

    const handleEdit = (request: LeaveRequest) => {
        setEditingRequest(request);
        setShowForm(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this leave request?')) {
            leaveStorage.delete(id, tenantId);
            loadLeaveRequests();
        }
    };

    const updateStatus = (id: number, status: 'pending' | 'approved' | 'rejected') => {
        leaveStorage.update(id, { status }, tenantId);
        loadLeaveRequests();
    };

    return (
        <div className="container mt-4">
            <h2>Leave Management</h2>
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
                <LeaveRequestForm
                    request={editingRequest}
                    onSave={handleSave}
                    onCancel={() => { setShowForm(false); setEditingRequest(null); }}
                />
            )}
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Employee ID</th>
                            <th>Leave Type</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Reason</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaveRequests.map(request => (
                            <tr key={request.id}>
                                <td>{request.id}</td>
                                <td>{request.employee_id}</td>
                                <td>{request.leave_type}</td>
                                <td>{request.start_date}</td>
                                <td>{request.end_date}</td>
                                <td>{request.reason}</td>
                                <td>
                                    <select
                                        className="form-select form-select-sm"
                                        title="Update status"
                                        value={request.status}
                                        onChange={(e) => updateStatus(request.id, e.target.value as 'pending' | 'approved' | 'rejected')}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </td>
                                <td>
                                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(request)}>Edit</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(request.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className="btn btn-success" onClick={() => { setEditingRequest(null); setShowForm(true); }}>Add New Leave Request</button>
        </div>
    );
};

interface LeaveRequestFormProps {
    request: LeaveRequest | null;
    onSave: (request: Omit<LeaveRequest, 'id'>) => void;
    onCancel: () => void;
}

const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({ request, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        employee_id: request?.employee_id || 1,
        leave_type: request?.leave_type || 'vacation',
        start_date: request?.start_date || new Date().toISOString().split('T')[0],
        end_date: request?.end_date || new Date().toISOString().split('T')[0],
        reason: request?.reason || '',
        status: request?.status || 'pending' as 'pending' | 'approved' | 'rejected',
        tenant_id: request?.tenant_id || 1
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="card mb-3">
            <div className="card-body">
                <h5>{request ? 'Edit Leave Request' : 'Add New Leave Request'}</h5>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Employee ID</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter employee ID"
                                    value={formData.employee_id}
                                    onChange={(e) => setFormData({ ...formData, employee_id: parseInt(e.target.value) })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Leave Type</label>
                                <select
                                    className="form-select"
                                    title="Select leave type"
                                    value={formData.leave_type}
                                    onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
                                >
                                    <option value="vacation">Vacation</option>
                                    <option value="sick">Sick Leave</option>
                                    <option value="personal">Personal Leave</option>
                                    <option value="maternity">Maternity Leave</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Start Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={formData.start_date}
                                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">End Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={formData.end_date}
                                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Reason</label>
                        <textarea
                            className="form-control"
                            placeholder="Enter reason"
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Status</label>
                        <select
                            className="form-select"
                            title="Select status"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'pending' | 'approved' | 'rejected' })}
                        >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary me-2">Save</button>
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default LeaveManagement;
