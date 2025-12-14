import api from './api';

export interface Item {
    id: number;
    name: string;
    sku_code: string;
    price: number;
    measure: string;
    is_active: boolean;
}

export const itemService = {
    getAll: async () => {
        const response = await api.get<Item[]>('/items');
        return response.data;
    },
    getBySku: async (sku: string) => {
        // Assuming backend has search or we filter locally if list is small.
        // For now, let's fetch all and filter, or assume we fetch all on load.
        // Ideally backend should support ?sku=...
        const response = await api.get<Item[]>(`/items?sku=${sku}`);
        return response.data;
    },

    processTransaction: async () => {
        // const response = await api.post<Transaction>('/transactions', transaction);
        // return response.data;
        console.log("Processing transaction...");
    }
};
