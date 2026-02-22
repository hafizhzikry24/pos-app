import api from './api';

export interface Cashier {
    id: number;
    name: string;
    email: string;
    store_id: number;
    phone: string;
    address: string;
    is_active: boolean;
    location_id: number;
    created_at: string;
    updated_at: string;
}

export interface CreateCashierRequest {
    name: string;
    email: string;
    password: string;
    store_id: number;
    phone: string;
    address: string;
    is_active: boolean;
    location_id: number;
}

export interface UpdateCashierRequest {
    name?: string;
    email?: string;
    password?: string;
    store_id?: number;
    phone?: string;
    address?: string;
    is_active?: boolean;
    location_id?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export const cashierService = {
    getAll: async (): Promise<Cashier[]> => {
        const response = await api.get<Cashier[]>('/cashiers');
        return response.data;
    },

    getPaginated: async (search?: string, page: number = 1, perPage: number = 10): Promise<PaginatedResponse<Cashier>> => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        params.append('page', page.toString());
        params.append('per_page', perPage.toString());
        
        const response = await api.get<PaginatedResponse<Cashier>>(`/cashiers?${params.toString()}`);
        return response.data;
    },
    getById: async (id: number): Promise<Cashier> => {
        const response = await api.get<Cashier>(`/cashiers/${id}`);
        return response.data;
    },
    create: async (data: CreateCashierRequest): Promise<Cashier> => {
        const response = await api.post<Cashier>('/cashiers', data);
        return response.data;
    },
    update: async (id: number, data: UpdateCashierRequest): Promise<Cashier> => {
        const response = await api.put<Cashier>(`/cashiers/${id}`, data);
        return response.data;
    },
    delete: async (id: number): Promise<void> => {
        await api.delete(`/cashiers/${id}`);
    }
};

export const cashierStoreService = {
    // Service for managing cashier stores through the new cashier system
    createCashier: async (data: any) => {
        const response = await api.post('/cashiers', data);
        return response.data;
    },
    getCashiersByStore: async (storeId: number) => {
        const response = await api.get(`/cashiers?store_id=${storeId}`);
        return response.data;
    }
};
