import React, { useState, useEffect } from 'react';
import { FileStorage } from '../../utils/fileStorage';

interface Task {
    id: number;
    project_id: number;
    name: string;
    description: string;
    assigned_to: number;
    status: 'todo' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    due_date: string;
    tenant_id: number;
}

const TaskList: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [tenantId, setTenantId] = useState<number>(1);

    const taskStorage = new FileStorage<Task>('tasks');

    useEffect(() => {
        loadTasks();
    }, [tenantId]);

    const loadTasks = () => {
        const data = taskStorage.getAll(tenantId);
        setTasks(data);
    };

    const handleSave = (taskData: Omit<Task, 'id'>) => {
        if (editingTask) {
            taskStorage.update(editingTask.id, taskData, tenantId);
        } else {
            taskStorage.create(taskData);
        }
        loadTasks();
        setShowForm(false);
        setEditingTask(null);
    };

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setShowForm(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            taskStorage.delete(id, tenantId);
            loadTasks();
        }
    };

    const updateStatus = (id: number, status: 'todo' | 'in_progress' | 'completed') => {
        taskStorage.update(id, { status }, tenantId);
        loadTasks();
    };

    return (
        <div className="container mt-4">
            <h2>Task Management</h2>
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
                <TaskForm
                    task={editingTask}
                    onSave={handleSave}
                    onCancel={() => { setShowForm(false); setEditingTask(null); }}
                />
            )}
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Project</th>
                            <th>Assigned To</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Due Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map(task => (
                            <tr key={task.id}>
                                <td>{task.id}</td>
                                <td>{task.name}</td>
                                <td>{task.project_id}</td>
                                <td>{task.assigned_to}</td>
                                <td>
                                    <select
                                        className="form-select form-select-sm"
                                        title="Update status"
                                        value={task.status}
                                        onChange={(e) => updateStatus(task.id, e.target.value as 'todo' | 'in_progress' | 'completed')}
                                    >
                                        <option value="todo">To Do</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </td>
                                <td>
                                    <span className={`badge ${task.priority === 'high' ? 'bg-danger' : task.priority === 'medium' ? 'bg-warning' : 'bg-success'}`}>
                                        {task.priority}
                                    </span>
                                </td>
                                <td>{task.due_date}</td>
                                <td>
                                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(task)}>Edit</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(task.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className="btn btn-success" onClick={() => { setEditingTask(null); setShowForm(true); }}>Add New Task</button>
        </div>
    );
};

interface TaskFormProps {
    task: Task | null;
    onSave: (task: Omit<Task, 'id'>) => void;
    onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        project_id: task?.project_id || 1,
        name: task?.name || '',
        description: task?.description || '',
        assigned_to: task?.assigned_to || 1,
        status: task?.status || 'todo' as 'todo' | 'in_progress' | 'completed',
        priority: task?.priority || 'medium' as 'low' | 'medium' | 'high',
        due_date: task?.due_date || new Date().toISOString().split('T')[0],
        tenant_id: task?.tenant_id || 1
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="card mb-3">
            <div className="card-body">
                <h5>{task ? 'Edit Task' : 'Add New Task'}</h5>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter task name"
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
                                <label className="form-label">Assigned To</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter assigned user ID"
                                    value={formData.assigned_to}
                                    onChange={(e) => setFormData({ ...formData, assigned_to: parseInt(e.target.value) })}
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
                                <label className="form-label">Status</label>
                                <select
                                    className="form-select"
                                    title="Select status"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'todo' | 'in_progress' | 'completed' })}
                                >
                                    <option value="todo">To Do</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Priority</label>
                                <select
                                    className="form-select"
                                    title="Select priority"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
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

export default TaskList;
