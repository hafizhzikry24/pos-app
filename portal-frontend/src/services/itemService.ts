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

export interface CreateItemRequest {
    name: string;
    sku_code: string;
    price: number;
    is_active: boolean;
    measure: string;
}

export interface UpdateItemRequest {
    name?: string;
    sku_code?: string;
    price?: number;
    is_active?: boolean;
    measure?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export const itemService = {
    getAll: async (): Promise<Item[]> => {
        const response = await api.get<Item[]>("/items");
        return response.data;
    },

    getPaginated: async (search?: string, page: number = 1, perPage: number = 10): Promise<PaginatedResponse<Item>> => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        params.append('page', page.toString());
        params.append('per_page', perPage.toString());
        
        const response = await api.get<PaginatedResponse<Item>>(`/items?${params.toString()}`);
        return response.data;
    },
    getById: async (id: number): Promise<Item> => {
        const response = await api.get<Item>(`/items/${id}`);
        return response.data;
    },
    create: async (data: CreateItemRequest): Promise<Item> => {
        const response = await api.post<Item>("/items", data);
        return response.data;
    },
    update: async (id: number, data: UpdateItemRequest): Promise<Item> => {
        const response = await api.put<Item>(`/items/${id}`, data);
        return response.data;
    },
    delete: async (id: number): Promise<void> => {
        await api.delete(`/items/${id}`);
    },
};
