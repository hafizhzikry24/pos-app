import api from "./api";

export interface Location {
    id: number;
    code: string;
    name: string;
    address: string;
    created_at: string;
    updated_at: string;
}

export const locationService = {
    getAll: async () => {
        const response = await api.get<Location[]>("/locations");
        return response.data;
    },
    getById: async (id: number) => {
        const response = await api.get<Location>(`/locations/${id}`);
        return response.data;
    },
    create: async (data: Partial<Location>) => {
        const response = await api.post<Location>("/locations", data);
        return response.data;
    },
    update: async (id: number, data: Partial<Location>) => {
        const response = await api.put<Location>(`/locations/${id}`, data);
        return response.data;
    },
    delete: async (id: number) => {
        await api.delete(`/locations/${id}`);
    },
};
