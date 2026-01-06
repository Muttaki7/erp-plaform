export interface Document {
    id: number;
    title: string;
    content: string;
    category_id: number;
    owner_id: number;
    created_date: string;
    modified_date: string;
    tenant_id: number;
}

export interface Category {
    id: number;
    name: string;
    description: string;
    tenant_id: number;
}

export interface Version {
    id: number;
    document_id: number;
    version_number: string;
    content: string;
    created_date: string;
    created_by: number; // user_id
    tenant_id: number;
}

export interface Owner {
    id: number;
    user_id: number;
    document_id: number;
    permissions: "READ" | "WRITE" | "DELETE";
    tenant_id: number;
}
