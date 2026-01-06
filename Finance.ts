export interface GLAccount {
    id: number;
    name: string;
    type: "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE";
    balance: number;
    tenant_id: number;
}

export interface JournalEntry {
    id: number;
    date: string;
    description: string;
    debit_account_id: number;
    credit_account_id: number;
    amount: number;
    tenant_id: number;
}

export interface Budget {
    id: number;
    account_id: number;
    year: number;
    month: number;
    budgeted_amount: number;
    actual_amount: number;
    tenant_id: number;
}

export interface Transaction {
    id: number;
    account_id: number;
    amount: number;
    type: "DEBIT" | "CREDIT";
    date: string;
    description: string;
    tenant_id: number;
}
