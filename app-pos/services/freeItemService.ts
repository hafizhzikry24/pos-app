import api from './api';

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
  // Check eligibility for free items
  checkEligibility: async (data: CheckEligibilityRequest): Promise<EligibilityResponse> => {
    const response = await api.post<EligibilityResponse>('/free-items/check-eligibility', data);
    return response.data;
  }
};
