import axios from 'axios';
import { storage } from './storage';
import { environment } from '@/environment/environment';

const api = axios.create({
    baseURL: environment.API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

api.interceptors.request.use(async (config) => {
    const token = await storage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => {
        // If the response has our standard structure, return the data field
        if (response.data && response.data.status === 'success') {
            return {
                ...response,
                data: response.data.data
            };
        }
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
