import React, { useState, useEffect } from 'react';

interface ApprovalRequest {
    id: number;
    type: 'leave' | 'purchase_order' | 'expense' | 'project_change';
    request_id: number;
    requester_id: number;
    approver_id: number;
    status: 'pending' | 'approved' | 'rejected';
    submitted_date: string;
    tenant_id: number;
}

const ApprovalQueue: React.FC = () => {
    const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
    const [tenantId, setTenantId] = useState<number>(1);

    const { FileStorage } = require('../../utils/fileStorage');
    const approvalStorage = new FileStorage<ApprovalRequest>('approvalRequests');

    useEffect(() => {
        loadApprovals();
    }, [tenantId]);

    const loadApprovals = () => {
        const data = approvalStorage.getAll(tenantId);
        setApprovals(data);
    };

    const updateStatus = (id: number, status: 'approved' | 'rejected') => {
        approvalStorage.update(id, { status }, tenantId);
        loadApprovals();
    };

    const pendingApprovals = approvals.filter(a => a.status === 'pending');

    return (
        <div className="container mt-4" style={{ marginLeft: '250px' }}>
            <h2>Approval Queue</h2>
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
            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="card text-white bg-warning">
                        <div className="card-body">
                            <h5 className="card-title">Pending Approvals</h5>
                            <p className="card-text">{pendingApprovals.length}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-white bg-success">
                        <div className="card-body">
                            <h5 className="card-title">Approved Today</h5>
                            <p className="card-text">{approvals.filter(a => a.status === 'approved' && a.submitted_date === new Date().toISOString().split('T')[0]).length}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-white bg-danger">
                        <div className="card-body">
                            <h5 className="card-title">Rejected Today</h5>
                            <p className="card-text">{approvals.filter(a => a.status === 'rejected' && a.submitted_date === new Date().toISOString().split('T')[0]).length}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Type</th>
                            <th>Request ID</th>
                            <th>Requester</th>
                            <th>Submitted Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingApprovals.map(approval => (
                            <tr key={approval.id}>
                                <td>{approval.id}</td>
                                <td>{approval.type}</td>
                                <td>{approval.request_id}</td>
                                <td>{approval.requester_id}</td>
                                <td>{approval.submitted_date}</td>
                                <td>
                                    <span className="badge bg-warning">Pending</span>
                                </td>
                                <td>
                                    <button className="btn btn-sm btn-success me-2" onClick={() => updateStatus(approval.id, 'approved')}>Approve</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => updateStatus(approval.id, 'rejected')}>Reject</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {pendingApprovals.length === 0 && (
                <div className="alert alert-info">
                    No pending approvals at this time.
                </div>
            )}
        </div>
    );
};

export default ApprovalQueue;
