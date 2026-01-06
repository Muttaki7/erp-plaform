import React, { useState, useEffect } from 'react';

interface Project {
    id: number;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    status: 'planning' | 'in_progress' | 'completed' | 'on_hold';
    budget: number;
    tenant_id: number;
}

interface Task {
    id: number;
    project_id: number;
    status: 'todo' | 'in_progress' | 'completed';
    tenant_id: number;
}

const ProjectDashboard: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [tenantId, setTenantId] = useState<number>(1);

    const { FileStorage } = require('../../utils/fileStorage');
    const projectStorage = new FileStorage<Project>('projects');
    const taskStorage = new FileStorage<Task>('tasks');

    useEffect(() => {
        loadData();
    }, [tenantId]);

    const loadData = () => {
        const projectData = projectStorage.getAll(tenantId);
        setProjects(projectData);
        const taskData = taskStorage.getAll(tenantId);
        setTasks(taskData);
    };

    const getProjectStats = (projectId: number) => {
        const projectTasks = tasks.filter(task => task.project_id === projectId);
        const totalTasks = projectTasks.length;
        const completedTasks = projectTasks.filter(task => task.status === 'completed').length;
        const inProgressTasks = projectTasks.filter(task => task.status === 'in_progress').length;
        return { totalTasks, completedTasks, inProgressTasks };
    };

    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'in_progress').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);

    return (
        <div className="container mt-4">
            <h2>Project Dashboard</h2>
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
                <div className="col-md-3">
                    <div className="card text-white bg-primary">
                        <div className="card-body">
                            <h5 className="card-title">Total Projects</h5>
                            <p className="card-text">{totalProjects}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-white bg-success">
                        <div className="card-body">
                            <h5 className="card-title">Active Projects</h5>
                            <p className="card-text">{activeProjects}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-white bg-info">
                        <div className="card-body">
                            <h5 className="card-title">Completed Projects</h5>
                            <p className="card-text">{completedProjects}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-white bg-warning">
                        <div className="card-body">
                            <h5 className="card-title">Total Budget</h5>
                            <p className="card-text">${totalBudget.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Project Name</th>
                            <th>Status</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Budget</th>
                            <th>Total Tasks</th>
                            <th>Completed Tasks</th>
                            <th>In Progress Tasks</th>
                            <th>Progress</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map(project => {
                            const stats = getProjectStats(project.id);
                            const progress = stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0;
                            return (
                                <tr key={project.id}>
                                    <td>{project.name}</td>
                                    <td>
                                        <span className={`badge ${project.status === 'completed' ? 'bg-success' : project.status === 'in_progress' ? 'bg-primary' : 'bg-secondary'}`}>
                                            {project.status}
                                        </span>
                                    </td>
                                    <td>{project.start_date}</td>
                                    <td>{project.end_date}</td>
                                    <td>${project.budget.toFixed(2)}</td>
                                    <td>{stats.totalTasks}</td>
                                    <td>{stats.completedTasks}</td>
                                    <td>{stats.inProgressTasks}</td>
                                    <td>
                                        <div className="progress">
                                            <div
                                                className="progress-bar"
                                                role="progressbar"
                                                style={{ width: `${progress}%` }}
                                                aria-valuenow={progress}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                            >
                                                {progress.toFixed(0)}%
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProjectDashboard;
