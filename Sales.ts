export interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    tenant_id: number;
}

export interface Lead {
    id: number;
    customer_id: number;
    source: string;
    status: "NEW" | "CONTACTED" | "QUALIFIED" | "PROPOSAL" | "NEGOTIATION" | "CLOSED_WON" | "CLOSED_LOST";
    value: number;
    created_date: string;
    tenant_id: number;
}

export interface Quote {
    id: number;
    lead_id: number;
    items: QuoteItem[];
    total_amount: number;
    status: "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED";
    valid_until: string;
    tenant_id: number;
}

export interface QuoteItem {
    id: number;
    item_id: number;
    quantity: number;
    price: number;
    discount: number;
}

export interface Interaction {
    id: number;
    lead_id: number;
    type: "CALL" | "EMAIL" | "MEETING" | "NOTE";
    description: string;
    date: string;
    user_id: number;
    tenant_id: number;
}
