import api from './api';
import { Item } from './itemService';

export interface FreeItem {
    id: number;
    name: string;
    required_purchase_amount: number;
    is_active: boolean;
    description: string | null;
    eligible_items: Item[];
    selectable_items: Item[];
    created_at: string;
    updated_at: string;
}

export interface CreateFreeItemRequest {
    name: string;
    required_purchase_amount: number;
    is_active?: boolean;
    description?: string;
    eligible_items?: number[];
    selectable_items?: number[];
}

export interface UpdateFreeItemRequest {
    name?: string;
    required_purchase_amount?: number;
    is_active?: boolean;
    description?: string;
    eligible_items?: number[];
    selectable_items?: number[];
}

export interface CheckEligibilityRequest {
    purchase_amount: number;
    cart_items?: {
        item_id: number;
        quantity: number;
    }[];
}

export interface EligibilityResponse {
    eligible_free_items: FreeItem[];
    purchase_amount: number;
}

export const freeItemService = {
    getAll: async (): Promise<FreeItem[]> => {
        const response = await api.get<FreeItem[]>('/free-items');
        return response.data;
    },

    getById: async (id: number): Promise<FreeItem> => {
        const response = await api.get<FreeItem>(`/free-items/${id}`);
        return response.data;
    },

    create: async (data: CreateFreeItemRequest): Promise<FreeItem> => {
        const response = await api.post<FreeItem>('/free-items', data);
        return response.data;
    },

    update: async (id: number, data: UpdateFreeItemRequest): Promise<FreeItem> => {
        const response = await api.put<FreeItem>(`/free-items/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/free-items/${id}`);
    },

    checkEligibility: async (data: CheckEligibilityRequest): Promise<EligibilityResponse> => {
        const response = await api.post<EligibilityResponse>('/free-items/check-eligibility', data);
        return response.data;
    },
};
