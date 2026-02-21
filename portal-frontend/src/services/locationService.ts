import api from "./api";

export interface Location {
    id: number;
    code: string;
    name: string;
    address: string;
    created_at: string;
    updated_at: string;
}

export interface CreateLocationRequest {
    code: string;
    name: string;
    address: string;
}

export interface UpdateLocationRequest {
    code?: string;
    name?: string;
    address?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export const locationService = {
    getAll: async (): Promise<Location[]> => {
        const response = await api.get<Location[]>("/locations");
        return response.data;
    },

    getPaginated: async (search?: string, page: number = 1, perPage: number = 10): Promise<PaginatedResponse<Location>> => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        params.append('page', page.toString());
        params.append('per_page', perPage.toString());
        
        const response = await api.get<PaginatedResponse<Location>>(`/locations?${params.toString()}`);
        return response.data;
    },
    getById: async (id: number): Promise<Location> => {
        const response = await api.get<Location>(`/locations/${id}`);
        return response.data;
    },
    create: async (data: CreateLocationRequest): Promise<Location> => {
        const response = await api.post<Location>("/locations", data);
        return response.data;
    },
    update: async (id: number, data: UpdateLocationRequest): Promise<Location> => {
        const response = await api.put<Location>(`/locations/${id}`, data);
        return response.data;
    },
    delete: async (id: number): Promise<void> => {
        await api.delete(`/locations/${id}`);
    },
};
