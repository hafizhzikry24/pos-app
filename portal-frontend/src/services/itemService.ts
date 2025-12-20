import api from "./api";

export interface Item {
    id: number;
    name: string;
    sku_code: string;
    price: any;
    is_active: boolean;
    measure: string;
    created_at: string;
    updated_at: string;
}

export const itemService = {
    getAll: async () => {
        const response = await api.get<Item[]>("/items");
        return response.data;
    },
    getById: async (id: number) => {
        const response = await api.get<Item>(`/items/${id}`);
        return response.data;
    },
    create: async (data: Partial<Item>) => {
        const response = await api.post<Item>("/items", data);
        return response.data;
    },
    update: async (id: number, data: Partial<Item>) => {
        const response = await api.put<Item>(`/items/${id}`, data);
        return response.data;
    },
    delete: async (id: number) => {
        await api.delete(`/items/${id}`);
    },
};
