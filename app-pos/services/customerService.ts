import api from './api';

export interface Customer {
  id: number;
  name: string;
  phone_number: string;
  created_at: string;
  updated_at: string;
}

export const customerService = {
  // Search customer by phone number
  searchByPhone: async (phoneNumber: string): Promise<Customer | null> => {
    try {
      const response = await api.get(`/customers/search/${phoneNumber}`);
      return response.data;
    } catch (error) {
      console.error('Customer search failed:', error);
      return null;
    }
  },

  // Get customer by ID
  getById: async (id: number): Promise<Customer> => {
    const response = await api.get<Customer>(`/customers/${id}`);
    return response.data;
  },

  // Create new customer
  create: async (customerData: { name: string; phone_number: string }): Promise<Customer> => {
    const response = await api.post<Customer>('/customers', customerData);
    return response.data;
  }
};
