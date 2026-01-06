import React, { useState, useEffect } from 'react';
import { FileStorage } from '../../utils/fileStorage';

interface Budget {
    id: number;
    department_id: number;
    year: number;
    month: number;
    budgeted_amount: number;
    actual_amount: number;
    tenant_id: number;
}

const BudgetDashboard: React.FC = () => {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [tenantId, setTenantId] = useState<number>(1);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

    const budgetStorage = new FileStorage<Budget>('budgets');

    useEffect(() => {
        loadBudgets();
    }, [tenantId, selectedYear]);

    const loadBudgets = () => {
        const data = budgetStorage.getAll(tenantId).filter(b => b.year === selectedYear);
        setBudgets(data);
    };

    const totalBudgeted = budgets.reduce((sum, b) => sum + b.budgeted_amount, 0);
    const totalActual = budgets.reduce((sum, b) => sum + b.actual_amount, 0);
    const variance = totalBudgeted - totalActual;

    return (
        <div className="container mt-4">
            <h2>Budget Dashboard</h2>
            <div className="row mb-3">
                <div className="col-md-4">
                    <label className="form-label">Tenant ID</label>
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Enter tenant ID"
                        value={tenantId}
                        onChange={(e) => setTenantId(parseInt(e.target.value))}
                    />
                </div>
                <div className="col-md-4">
                    <label className="form-label">Year</label>
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Enter year"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    />
                </div>
            </div>
            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="card text-white bg-primary">
                        <div className="card-body">
                            <h5 className="card-title">Total Budgeted</h5>
                            <p className="card-text">${totalBudgeted.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-white bg-success">
                        <div className="card-body">
                            <h5 className="card-title">Total Actual</h5>
                            <p className="card-text">${totalActual.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className={`card text-white ${variance >= 0 ? 'bg-info' : 'bg-danger'}`}>
                        <div className="card-body">
                            <h5 className="card-title">Variance</h5>
                            <p className="card-text">${variance.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Department</th>
                            <th>Month</th>
                            <th>Budgeted Amount</th>
                            <th>Actual Amount</th>
                            <th>Variance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {budgets.map(budget => (
                            <tr key={budget.id}>
                                <td>{budget.department_id}</td>
                                <td>{budget.month}</td>
                                <td>${budget.budgeted_amount.toFixed(2)}</td>
                                <td>${budget.actual_amount.toFixed(2)}</td>
                                <td className={budget.budgeted_amount - budget.actual_amount >= 0 ? 'text-success' : 'text-danger'}>
                                    ${(budget.budgeted_amount - budget.actual_amount).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BudgetDashboard;
