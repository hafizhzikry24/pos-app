import api from './api';

export interface Customer {
    id: number;
    name: string;
    phone_number: string;
    created_at: string;
    updated_at: string;
}

export interface CreateCustomerRequest {
    name: string;
    phone_number: string;
}

export interface UpdateCustomerRequest {
    name?: string;
    phone_number?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export const customerService = {
    getAll: async (): Promise<Customer[]> => {
        const response = await api.get<Customer[]>('/customers');
        return response.data;
    },

    getPaginated: async (search?: string, page: number = 1, perPage: number = 10): Promise<PaginatedResponse<Customer>> => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        params.append('page', page.toString());
        params.append('per_page', perPage.toString());
        
        const response = await api.get<PaginatedResponse<Customer>>(`/customers?${params.toString()}`);
        return response.data;
    },

    getById: async (id: number): Promise<Customer> => {
        const response = await api.get<Customer>(`/customers/${id}`);
        return response.data;
    },

    create: async (data: CreateCustomerRequest): Promise<Customer> => {
        const response = await api.post<Customer>('/customers', data);
        return response.data;
    },

    update: async (id: number, data: UpdateCustomerRequest): Promise<Customer> => {
        const response = await api.put<Customer>(`/customers/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/customers/${id}`);
    },
};
