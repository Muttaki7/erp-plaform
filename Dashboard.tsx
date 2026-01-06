import React, { useState, useEffect } from 'react';
import { FileStorage } from '../../utils/fileStorage';
import { User } from '../../models/User';
import { Project, Task } from '../../models/ProjectManagement';
import { Invoice } from '../../models/Procurement';
import { Employee } from '../../models/HR';

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProjects: 0,
        totalInvoices: 0,
        totalRevenue: 0,
        pendingTasks: 0,
        activeEmployees: 0
    });
    const [tenantId, setTenantId] = useState<number>(1);

    useEffect(() => {
        loadDashboardStats();
    }, [tenantId]);

    const loadDashboardStats = () => {
        const userStorage = new FileStorage('users');
        const projectStorage = new FileStorage('projects');
        const invoiceStorage = new FileStorage('invoices');
        const taskStorage = new FileStorage('tasks');
        const employeeStorage = new FileStorage('employees');

        const users = userStorage.getAll(tenantId);
        const projects = projectStorage.getAll(tenantId);
        const invoices = invoiceStorage.getAll(tenantId);
        const tasks = taskStorage.getAll(tenantId);
        const employees = employeeStorage.getAll(tenantId);

        setStats({
            totalUsers: users.length,
            totalProjects: projects.length,
            totalInvoices: invoices.length,
            totalRevenue: invoices.reduce((sum: number, inv: any) => sum + inv.amount, 0),
            pendingTasks: tasks.filter((t: any) => t.status === 'todo').length,
            activeEmployees: employees.filter((e: any) => e.status === 'active').length
        });
    };

    return (
        <div className="container mt-4" style={{ marginLeft: '250px' }}>
            <h2>ERP Dashboard</h2>
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
                <div className="col-md-4 mb-3">
                    <div className="card text-white bg-primary">
                        <div className="card-body">
                            <h5 className="card-title">Total Users</h5>
                            <p className="card-text">{stats.totalUsers}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <div className="card text-white bg-success">
                        <div className="card-body">
                            <h5 className="card-title">Total Projects</h5>
                            <p className="card-text">{stats.totalProjects}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <div className="card text-white bg-info">
                        <div className="card-body">
                            <h5 className="card-title">Total Revenue</h5>
                            <p className="card-text">${stats.totalRevenue.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <div className="card text-white bg-warning">
                        <div className="card-body">
                            <h5 className="card-title">Pending Tasks</h5>
                            <p className="card-text">{stats.pendingTasks}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <div className="card text-white bg-danger">
                        <div className="card-body">
                            <h5 className="card-title">Active Employees</h5>
                            <p className="card-text">{stats.activeEmployees}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <div className="card text-white bg-secondary">
                        <div className="card-body">
                            <h5 className="card-title">Total Invoices</h5>
                            <p className="card-text">{stats.totalInvoices}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            Recent Activities
                        </div>
                        <div className="card-body">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">New user registered</li>
                                <li className="list-group-item">Project milestone completed</li>
                                <li className="list-group-item">Invoice paid</li>
                                <li className="list-group-item">New task assigned</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            Quick Actions
                        </div>
                        <div className="card-body">
                            <div className="d-grid gap-2">
                                <button className="btn btn-primary">Create New User</button>
                                <button className="btn btn-success">Add New Project</button>
                                <button className="btn btn-info">Generate Report</button>
                                <button className="btn btn-warning">Manage Inventory</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
