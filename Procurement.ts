export interface Vendor {
    id: number;
    name: string;
    contact: string;
    address: string;
    tenant_id: number;
}

export interface PurchaseOrder {
    id: number;
    vendor_id: number;
    date: string;
    total_amount: number;
    status: "PENDING" | "APPROVED" | "RECEIVED";
    tenant_id: number;
}

export interface PurchaseRequest {
    id: number;
    requester_id: number;
    item_id: number;
    quantity: number;
    date: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    tenant_id: number;
}

export interface Invoice {
    id: number;
    purchase_order_id: number;
    amount: number;
    date: string;
    status: "PAID" | "UNPAID";
    tenant_id: number;
}
