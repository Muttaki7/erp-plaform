export interface Item {
    id: number;
    name: string;
    quantity: number;
    price: number;
    tenant_id: number;
}

export interface Stock {
    id: number;
    item_id: number;
    warehouse_id: number;
    quantity: number;
    tenant_id: number;
}

export interface Warehouse {
    id: number;
    location: string;
    tenant_id: number;
}

export interface Vendor {
    id: number;
    name: string;
    contact: string;
    tenant_id: number;
}
