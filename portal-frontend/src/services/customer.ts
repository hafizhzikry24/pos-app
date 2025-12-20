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

export const customerService = {
    getAll: async (): Promise<Customer[]> => {
        const response = await api.get<Customer[]>('/customers');
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
