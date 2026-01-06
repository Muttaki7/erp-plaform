import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
    return (
        <nav className="bg-light sidebar" style={{ width: '250px', height: '100vh', position: 'fixed', left: 0, top: 0, padding: '20px' }}>
            <h4 className="mb-4">ERP System</h4>
            <ul className="nav flex-column">
                <li className="nav-item mb-2">
                    <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item mb-2">
                    <h6 className="sidebar-heading">User Management</h6>
                    <ul className="nav flex-column ms-3">
                        <li className="nav-item">
                            <Link className="nav-link" to="/users">Users</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/roles">Roles</Link>
                        </li>
                    </ul>
                </li>
                <li className="nav-item mb-2">
                    <h6 className="sidebar-heading">Finance</h6>
                    <ul className="nav flex-column ms-3">
                        <li className="nav-item">
                            <Link className="nav-link" to="/finance/gl-accounts">GL Accounts</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/finance/journal-entries">Journal Entries</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/finance/budget">Budget</Link>
                        </li>
                    </ul>
                </li>
                <li className="nav-item mb-2">
                    <h6 className="sidebar-heading">Inventory</h6>
                    <ul className="nav flex-column ms-3">
                        <li className="nav-item">
                            <Link className="nav-link" to="/inventory/items">Items</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/inventory/warehouses">Warehouses</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/inventory/vendors">Vendors</Link>
                        </li>
                    </ul>
                </li>
                <li className="nav-item mb-2">
                    <h6 className="sidebar-heading">Procurement</h6>
                    <ul className="nav flex-column ms-3">
                        <li className="nav-item">
                            <Link className="nav-link" to="/procurement/orders">Purchase Orders</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/procurement/invoices">Invoices</Link>
                        </li>
                    </ul>
                </li>
                <li className="nav-item mb-2">
                    <h6 className="sidebar-heading">HR</h6>
                    <ul className="nav flex-column ms-3">
                        <li className="nav-item">
                            <Link className="nav-link" to="/hr/employees">Employees</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/hr/leave">Leave Management</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/hr/payroll">Payroll</Link>
                        </li>
                    </ul>
                </li>
                <li className="nav-item mb-2">
                    <h6 className="sidebar-heading">Sales</h6>
                    <ul className="nav flex-column ms-3">
                        <li className="nav-item">
                            <Link className="nav-link" to="/sales/customers">Customers</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/sales/leads">Leads</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/sales/quotes">Quotes</Link>
                        </li>
                    </ul>
                </li>
                <li className="nav-item mb-2">
                    <h6 className="sidebar-heading">Project Management</h6>
                    <ul className="nav flex-column ms-3">
                        <li className="nav-item">
                            <Link className="nav-link" to="/projects/dashboard">Dashboard</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/projects/tasks">Tasks</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/projects/milestones">Milestones</Link>
                        </li>
                    </ul>
                </li>
                <li className="nav-item mb-2">
                    <h6 className="sidebar-heading">Documents</h6>
                    <ul className="nav flex-column ms-3">
                        <li className="nav-item">
                            <Link className="nav-link" to="/documents">Document List</Link>
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>
    );
};

export default Sidebar;
