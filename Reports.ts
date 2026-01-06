export interface Dashboard {
    id: number;
    name: string;
    widgets: Widget[];
    tenant_id: number;
}

export interface Widget {
    id: number;
    type: "CHART" | "TABLE" | "METRIC";
    title: string;
    data_source: string; // e.g., "finance.transactions", "inventory.items"
    config: any; // JSON config for the widget
    tenant_id: number;
}

export interface Report {
    id: number;
    name: string;
    description: string;
    query: string; // SQL-like query or data filter
    parameters: ReportParameter[];
    tenant_id: number;
}

export interface ReportParameter {
    name: string;
    type: "STRING" | "NUMBER" | "DATE" | "SELECT";
    required: boolean;
    default_value: any;
}
