import React, { useState, useEffect } from 'react';
import { FileStorage } from '../../utils/fileStorage';

interface Employee {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    department_id: number;
    position: string;
    hire_date: string;
    salary: number;
    tenant_id: number;
}

const EmployeeList: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [tenantId, setTenantId] = useState<number>(1);

    const employeeStorage = new FileStorage<Employee>('employees');

    useEffect(() => {
        loadEmployees();
    }, [tenantId]);

    const loadEmployees = () => {
        const data = employeeStorage.getAll(tenantId);
        setEmployees(data);
    };

    const handleSave = (employeeData: Omit<Employee, 'id'>) => {
        if (editingEmployee) {
            employeeStorage.update(editingEmployee.id, employeeData, tenantId);
        } else {
            employeeStorage.create(employeeData);
        }
        loadEmployees();
        setShowForm(false);
        setEditingEmployee(null);
    };

    const handleEdit = (employee: Employee) => {
        setEditingEmployee(employee);
        setShowForm(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            employeeStorage.delete(id, tenantId);
            loadEmployees();
        }
    };

    return (
        <div className="container mt-4">
            <h2>Employee Management</h2>
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
                <EmployeeForm
                    employee={editingEmployee}
                    onSave={handleSave}
                    onCancel={() => { setShowForm(false); setEditingEmployee(null); }}
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
                            <th>Department</th>
                            <th>Position</th>
                            <th>Hire Date</th>
                            <th>Salary</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map(employee => (
                            <tr key={employee.id}>
                                <td>{employee.id}</td>
                                <td>{employee.first_name} {employee.last_name}</td>
                                <td>{employee.email}</td>
                                <td>{employee.phone}</td>
                                <td>{employee.department_id}</td>
                                <td>{employee.position}</td>
                                <td>{employee.hire_date}</td>
                                <td>${employee.salary.toFixed(2)}</td>
                                <td>
                                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(employee)}>Edit</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(employee.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className="btn btn-success" onClick={() => { setEditingEmployee(null); setShowForm(true); }}>Add New Employee</button>
        </div>
    );
};

interface EmployeeFormProps {
    employee: Employee | null;
    onSave: (employee: Omit<Employee, 'id'>) => void;
    onCancel: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        first_name: employee?.first_name || '',
        last_name: employee?.last_name || '',
        email: employee?.email || '',
        phone: employee?.phone || '',
        department_id: employee?.department_id || 1,
        position: employee?.position || '',
        hire_date: employee?.hire_date || new Date().toISOString().split('T')[0],
        salary: employee?.salary || 0,
        tenant_id: employee?.tenant_id || 1
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="card mb-3">
            <div className="card-body">
                <h5>{employee ? 'Edit Employee' : 'Add New Employee'}</h5>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">First Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter first name"
                                    value={formData.first_name}
                                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Last Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter last name"
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                    required
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
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Department ID</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter department ID"
                                    value={formData.department_id}
                                    onChange={(e) => setFormData({ ...formData, department_id: parseInt(e.target.value) })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Position</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter position"
                                    value={formData.position}
                                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Hire Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={formData.hire_date}
                                    onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Salary</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                    placeholder="Enter salary"
                                    value={formData.salary}
                                    onChange={(e) => setFormData({ ...formData, salary: parseFloat(e.target.value) })}
                                    required
                                />
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

export default EmployeeList;
