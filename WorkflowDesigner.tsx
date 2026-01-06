import React, { useState, useEffect } from 'react';

interface Workflow {
    id: number;
    name: string;
    description: string;
    steps: WorkflowStep[];
    tenant_id: number;
}

interface WorkflowStep {
    id: number;
    type: 'start' | 'task' | 'decision' | 'end';
    name: string;
    description: string;
    next_steps: number[];
}

const WorkflowDesigner: React.FC = () => {
    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [tenantId, setTenantId] = useState<number>(1);

    const { FileStorage } = require('../../utils/fileStorage');
    const workflowStorage = new FileStorage<Workflow>('workflows');

    useEffect(() => {
        loadWorkflows();
    }, [tenantId]);

    const loadWorkflows = () => {
        const data = workflowStorage.getAll(tenantId);
        setWorkflows(data);
    };

    const handleSave = (workflowData: Omit<Workflow, 'id'>) => {
        if (selectedWorkflow) {
            workflowStorage.update(selectedWorkflow.id, workflowData, tenantId);
        } else {
            workflowStorage.create(workflowData);
        }
        loadWorkflows();
        setShowForm(false);
        setSelectedWorkflow(null);
    };

    const handleEdit = (workflow: Workflow) => {
        setSelectedWorkflow(workflow);
        setShowForm(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this workflow?')) {
            workflowStorage.delete(id, tenantId);
            loadWorkflows();
        }
    };

    return (
        <div className="container mt-4" style={{ marginLeft: '250px' }}>
            <h2>Workflow Designer</h2>
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
                <WorkflowForm
                    workflow={selectedWorkflow}
                    onSave={handleSave}
                    onCancel={() => { setShowForm(false); setSelectedWorkflow(null); }}
                />
            )}
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Steps</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workflows.map(workflow => (
                            <tr key={workflow.id}>
                                <td>{workflow.id}</td>
                                <td>{workflow.name}</td>
                                <td>{workflow.description}</td>
                                <td>{workflow.steps.length}</td>
                                <td>
                                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(workflow)}>Edit</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(workflow.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className="btn btn-success" onClick={() => { setSelectedWorkflow(null); setShowForm(true); }}>Create New Workflow</button>
        </div>
    );
};

interface WorkflowFormProps {
    workflow: Workflow | null;
    onSave: (workflow: Omit<Workflow, 'id'>) => void;
    onCancel: () => void;
}

const WorkflowForm: React.FC<WorkflowFormProps> = ({ workflow, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: workflow?.name || '',
        description: workflow?.description || '',
        steps: workflow?.steps || [] as WorkflowStep[],
        tenant_id: workflow?.tenant_id || 1
    });

    const addStep = () => {
        const newStep: WorkflowStep = {
            id: Date.now(),
            type: 'task',
            name: '',
            description: '',
            next_steps: []
        };
        setFormData({ ...formData, steps: [...formData.steps, newStep] });
    };

    const updateStep = (index: number, field: keyof WorkflowStep, value: any) => {
        const updatedSteps = [...formData.steps];
        updatedSteps[index] = { ...updatedSteps[index], [field]: value };
        setFormData({ ...formData, steps: updatedSteps });
    };

    const removeStep = (index: number) => {
        const updatedSteps = formData.steps.filter((_, i) => i !== index);
        setFormData({ ...formData, steps: updatedSteps });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="card mb-3">
            <div className="card-body">
                <h5>{workflow ? 'Edit Workflow' : 'Create New Workflow'}</h5>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter workflow name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Steps</label>
                        {formData.steps.map((step, index) => (
                            <div key={step.id} className="border p-3 mb-2">
                                <div className="row">
                                    <div className="col-md-3">
                                        <select
                                            className="form-select"
                                            title="Select step type"
                                            value={step.type}
                                            onChange={(e) => updateStep(index, 'type', e.target.value)}
                                        >
                                            <option value="start">Start</option>
                                            <option value="task">Task</option>
                                            <option value="decision">Decision</option>
                                            <option value="end">End</option>
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Step name"
                                            value={step.name}
                                            onChange={(e) => updateStep(index, 'name', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Description"
                                            value={step.description}
                                            onChange={(e) => updateStep(index, 'description', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-1">
                                        <button type="button" className="btn btn-danger btn-sm" onClick={() => removeStep(index)}>Remove</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button type="button" className="btn btn-secondary btn-sm" onClick={addStep}>Add Step</button>
                    </div>
                    <button type="submit" className="btn btn-primary me-2">Save Workflow</button>
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default WorkflowDesigner;
