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
    is_free_item: boolean;
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
    change_amount: string;
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

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export const receiptService = {
    getAll: async (): Promise<Receipt[]> => {
        const response = await api.get<Receipt[]>("/receipts");
        return response.data;
    },

    getPaginated: async (search?: string, page: number = 1, perPage: number = 10): Promise<PaginatedResponse<Receipt>> => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        params.append('page', page.toString());
        params.append('per_page', perPage.toString());
        
        const response = await api.get<PaginatedResponse<Receipt>>(`/receipts?${params.toString()}`);
        return response.data;
    },
    getById: async (id: number, tableSuffix?: string): Promise<Receipt> => {
        const url = tableSuffix 
            ? `/receipts/${id}?table=${tableSuffix}`
            : `/receipts/${id}`;
        const response = await api.get<Receipt>(url);
        return response.data;
    },
    delete: async (id: number, tableSuffix?: string): Promise<void> => {
        const url = tableSuffix 
            ? `/receipts/${id}?table=${tableSuffix}`
            : `/receipts/${id}`;
        await api.delete(url);
    },
};
