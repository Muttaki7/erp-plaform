export interface Project {
    id: number;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    status: "PLANNING" | "IN_PROGRESS" | "COMPLETED" | "ON_HOLD";
    budget: number;
    tenant_id: number;
}

export interface Task {
    id: number;
    project_id: number;
    name: string;
    description: string;
    assigned_to: number; // employee_id
    status: "TODO" | "IN_PROGRESS" | "DONE";
    due_date: string;
    tenant_id: number;
}

export interface Milestone {
    id: number;
    project_id: number;
    name: string;
    description: string;
    due_date: string;
    status: "PENDING" | "ACHIEVED";
    tenant_id: number;
}

export interface Resource {
    id: number;
    project_id: number;
    type: "HUMAN" | "MATERIAL" | "EQUIPMENT";
    name: string;
    quantity: number;
    cost: number;
    tenant_id: number;
}
