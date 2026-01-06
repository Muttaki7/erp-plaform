import React, { useState, useEffect } from 'react';

interface PayrollRecord {
    id: number;
    employee_id: number;
    pay_period_start: string;
    pay_period_end: string;
    base_salary: number;
    overtime_hours: number;
    overtime_rate: number;
    deductions: number;
    net_pay: number;
    tenant_id: number;
}

const Payroll: React.FC = () => {
    const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
    const [editingRecord, setEditingRecord] = useState<PayrollRecord | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [tenantId, setTenantId] = useState<number>(1);

    const { FileStorage } = require('../../utils/fileStorage');
    const payrollStorage = new FileStorage<PayrollRecord>('payrollRecords');

    useEffect(() => {
        loadPayrollRecords();
    }, [tenantId]);

    const loadPayrollRecords = () => {
        const data = payrollStorage.getAll(tenantId);
        setPayrollRecords(data);
    };

    const handleSave = (recordData: Omit<PayrollRecord, 'id'>) => {
        if (editingRecord) {
            payrollStorage.update(editingRecord.id, recordData, tenantId);
        } else {
            payrollStorage.create(recordData);
        }
        loadPayrollRecords();
        setShowForm(false);
        setEditingRecord(null);
    };

    const handleEdit = (record: PayrollRecord) => {
        setEditingRecord(record);
        setShowForm(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this payroll record?')) {
            payrollStorage.delete(id, tenantId);
            loadPayrollRecords();
        }
    };

    return (
        <div className="container mt-4">
            <h2>Payroll Management</h2>
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
                <PayrollForm
                    record={editingRecord}
                    onSave={handleSave}
                    onCancel={() => { setShowForm(false); setEditingRecord(null); }}
                />
            )}
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Employee ID</th>
                            <th>Pay Period</th>
                            <th>Base Salary</th>
                            <th>Overtime</th>
                            <th>Deductions</th>
                            <th>Net Pay</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payrollRecords.map(record => (
                            <tr key={record.id}>
                                <td>{record.id}</td>
                                <td>{record.employee_id}</td>
                                <td>{record.pay_period_start} to {record.pay_period_end}</td>
                                <td>${record.base_salary.toFixed(2)}</td>
                                <td>${(record.overtime_hours * record.overtime_rate).toFixed(2)}</td>
                                <td>${record.deductions.toFixed(2)}</td>
                                <td>${record.net_pay.toFixed(2)}</td>
                                <td>
                                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(record)}>Edit</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(record.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className="btn btn-success" onClick={() => { setEditingRecord(null); setShowForm(true); }}>Add New Payroll Record</button>
        </div>
    );
};

interface PayrollFormProps {
    record: PayrollRecord | null;
    onSave: (record: Omit<PayrollRecord, 'id'>) => void;
    onCancel: () => void;
}

const PayrollForm: React.FC<PayrollFormProps> = ({ record, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        employee_id: record?.employee_id || 1,
        pay_period_start: record?.pay_period_start || new Date().toISOString().split('T')[0],
        pay_period_end: record?.pay_period_end || new Date().toISOString().split('T')[0],
        base_salary: record?.base_salary || 0,
        overtime_hours: record?.overtime_hours || 0,
        overtime_rate: record?.overtime_rate || 0,
        deductions: record?.deductions || 0,
        net_pay: record?.net_pay || 0,
        tenant_id: record?.tenant_id || 1
    });

    const calculateNetPay = () => {
        const overtimePay = formData.overtime_hours * formData.overtime_rate;
        return formData.base_salary + overtimePay - formData.deductions;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const netPay = calculateNetPay();
        onSave({ ...formData, net_pay: netPay });
    };

    return (
        <div className="card mb-3">
            <div className="card-body">
                <h5>{record ? 'Edit Payroll Record' : 'Add New Payroll Record'}</h5>
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
                                <label className="form-label">Base Salary</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                    placeholder="Enter base salary"
                                    value={formData.base_salary}
                                    onChange={(e) => setFormData({ ...formData, base_salary: parseFloat(e.target.value) })}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Pay Period Start</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={formData.pay_period_start}
                                    onChange={(e) => setFormData({ ...formData, pay_period_start: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Pay Period End</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={formData.pay_period_end}
                                    onChange={(e) => setFormData({ ...formData, pay_period_end: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Overtime Hours</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                    placeholder="Enter overtime hours"
                                    value={formData.overtime_hours}
                                    onChange={(e) => setFormData({ ...formData, overtime_hours: parseFloat(e.target.value) })}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Overtime Rate</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                    placeholder="Enter overtime rate"
                                    value={formData.overtime_rate}
                                    onChange={(e) => setFormData({ ...formData, overtime_rate: parseFloat(e.target.value) })}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Deductions</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                    placeholder="Enter deductions"
                                    value={formData.deductions}
                                    onChange={(e) => setFormData({ ...formData, deductions: parseFloat(e.target.value) })}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Net Pay</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                    value={calculateNetPay().toFixed(2)}
                                    readOnly
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

export default Payroll;
