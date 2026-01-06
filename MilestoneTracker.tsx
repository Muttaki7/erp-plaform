import React, { useState, useEffect } from 'react';

interface Milestone {
    id: number;
    project_id: number;
    name: string;
    description: string;
    due_date: string;
    status: 'not_started' | 'in_progress' | 'completed';
    tenant_id: number;
}

const MilestoneTracker: React.FC = () => {
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [tenantId, setTenantId] = useState<number>(1);

    const { FileStorage } = require('../../utils/fileStorage');
    const milestoneStorage = new FileStorage<Milestone>('milestones');

    useEffect(() => {
        loadMilestones();
    }, [tenantId]);

    const loadMilestones = () => {
        const data = milestoneStorage.getAll(tenantId);
        setMilestones(data);
    };

    const handleSave = (milestoneData: Omit<Milestone, 'id'>) => {
        if (editingMilestone) {
            milestoneStorage.update(editingMilestone.id, milestoneData, tenantId);
        } else {
            milestoneStorage.create(milestoneData);
        }
        loadMilestones();
        setShowForm(false);
        setEditingMilestone(null);
    };

    const handleEdit = (milestone: Milestone) => {
        setEditingMilestone(milestone);
        setShowForm(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this milestone?')) {
            milestoneStorage.delete(id, tenantId);
            loadMilestones();
        }
    };

    const updateStatus = (id: number, status: 'not_started' | 'in_progress' | 'completed') => {
        milestoneStorage.update(id, { status }, tenantId);
        loadMilestones();
    };

    return (
        <div className="container mt-4">
            <h2>Milestone Tracker</h2>
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
                <MilestoneForm
                    milestone={editingMilestone}
                    onSave={handleSave}
                    onCancel={() => { setShowForm(false); setEditingMilestone(null); }}
                />
            )}
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Project</th>
                            <th>Description</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {milestones.map(milestone => (
                            <tr key={milestone.id}>
                                <td>{milestone.id}</td>
                                <td>{milestone.name}</td>
                                <td>{milestone.project_id}</td>
                                <td>{milestone.description}</td>
                                <td>{milestone.due_date}</td>
                                <td>
                                    <select
                                        className="form-select form-select-sm"
                                        title="Update status"
                                        value={milestone.status}
                                        onChange={(e) => updateStatus(milestone.id, e.target.value as 'not_started' | 'in_progress' | 'completed')}
                                    >
                                        <option value="not_started">Not Started</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </td>
                                <td>
                                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(milestone)}>Edit</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(milestone.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className="btn btn-success" onClick={() => { setEditingMilestone(null); setShowForm(true); }}>Add New Milestone</button>
        </div>
    );
};

interface MilestoneFormProps {
    milestone: Milestone | null;
    onSave: (milestone: Omit<Milestone, 'id'>) => void;
    onCancel: () => void;
}

const MilestoneForm: React.FC<MilestoneFormProps> = ({ milestone, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        project_id: milestone?.project_id || 1,
        name: milestone?.name || '',
        description: milestone?.description || '',
        due_date: milestone?.due_date || new Date().toISOString().split('T')[0],
        status: milestone?.status || 'not_started' as 'not_started' | 'in_progress' | 'completed',
        tenant_id: milestone?.tenant_id || 1
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="card mb-3">
            <div className="card-body">
                <h5>{milestone ? 'Edit Milestone' : 'Add New Milestone'}</h5>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter milestone name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Project ID</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter project ID"
                                    value={formData.project_id}
                                    onChange={(e) => setFormData({ ...formData, project_id: parseInt(e.target.value) })}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-control"
                            placeholder="Enter description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div className="row">
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
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Status</label>
                                <select
                                    className="form-select"
                                    title="Select status"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'not_started' | 'in_progress' | 'completed' })}
                                >
                                    <option value="not_started">Not Started</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
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

export default MilestoneTracker;
