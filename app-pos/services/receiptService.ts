import api from './api';

export interface ReceiptItem {
    item_id: number;
    name: string;
    quantity: number;
    price: number;
    discount?: number;
    total: number;
}

export interface ReceiptData {
    number: string;
    location_id: number;
    cashier_id: number;
    customer_id?: number | null;
    total_amount: number;
    discount_amount?: number;
    tax_amount?: number;
    payable_amount: number;
    payment_method: string;
    note?: string;
    items: ReceiptItem[];
}

export const receiptService = {
    create: async (data: ReceiptData) => {
        const response = await api.post<{ success: boolean; message: string; data: any }>('/receipts', data);
        return response.data;
    },
    getById: async (id: number) => {
        const response = await api.get<{ success: boolean; data: any }>(`/receipts/${id}`);
        return response.data;
    }
};
