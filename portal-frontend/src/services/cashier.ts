import api from './api';

export const cashierService = {
    getAll: async () => {
        const response = await api.get('/cashiers');
        return response.data;
    },
    getById: async (id: number) => {
        const response = await api.get(`/cashiers/${id}`);
        return response.data;
    },
    create: async (data: any) => {
        const response = await api.post('/cashiers', data);
        return response.data;
    },
    update: async (id: number, data: any) => {
        const response = await api.put(`/cashiers/${id}`, data);
        return response.data;
    },
    delete: async (id: number) => {
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
