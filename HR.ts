export interface Employee {
    id: number;
    name: string;
    position: string;
    salary: number;
    department_id: number;
    tenant_id: number;
}

export interface Leave {
    id: number;
    employee_id: number;
    start_date: string;
    end_date: string;
    type: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    tenant_id: number;
}

export interface Payroll {
    id: number;
    employee_id: number;
    month: string;
    year: number;
    gross_salary: number;
    deductions: number;
    net_salary: number;
    tenant_id: number;
}

export interface Position {
    id: number;
    title: string;
    department_id: number;
    tenant_id: number;
}
