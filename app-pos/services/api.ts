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

export default api;
