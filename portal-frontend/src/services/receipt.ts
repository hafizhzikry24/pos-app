import api from "./api";

export interface ReceiptItem {
    id: number;
    receipt_id: number;
    item_id: number;
    name: string;
    quantity: number;
    price: string;
    discount: string;
    total: string;
    created_at: string;
    updated_at: string;
}

export interface Receipt {
    id: number;
    number: string;
    location_id: number;
    cashier_id: number;
    customer_id: number | null;
    total_amount: string;
    discount_amount: string;
    tax_amount: string;
    payable_amount: string;
    payment_method: string;
    status: string;
    note: string | null;
    created_at: string;
    updated_at: string;
    receipt_items?: ReceiptItem[];
    location?: any;
    cashier?: any;
    customer?: any;
    table_info?: {
        date: string;
        suffix: string;
        receipts_table: string;
        receipt_items_table: string;
    };
}

export const receiptService = {
    getAll: async () => {
        const response = await api.get<Receipt[]>("/receipts");
        return response.data;
    },
    getById: async (id: number, tableSuffix?: string) => {
        const url = tableSuffix 
            ? `/receipts/${id}?table=${tableSuffix}`
            : `/receipts/${id}`;
        const response = await api.get<Receipt>(url);
        return response.data;
    },
    delete: async (id: number, tableSuffix?: string) => {
        const url = tableSuffix 
            ? `/receipts/${id}?table=${tableSuffix}`
            : `/receipts/${id}`;
        const response = await api.delete<any>(url);
        return response.data;
    },
};
