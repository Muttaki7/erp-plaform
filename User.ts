export interface User {
    id: number;
    username: string;
    password: string;
    role: "ADMIN" | "USER";
    department_id: number;
    tenant_id: number;
}

export interface Role {
    id: number;
    name: string;
    permissions: Permission[];
    tenant_id: number;
}

export interface Department {
    id: number;
    name: string;
    tenant_id: number;
}

export interface Permission {
    id: number;
    name: string;
    tenant_id: number;
}
