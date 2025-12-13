import api from './api';

export const authService = {
    login: async (credentials: any) => {
        const response = await api.post('/login', credentials);
        return response.data;
    },
    register: async (data: any) => {
        const response = await api.post('/register', data);
        return response.data;
    },
    logout: async () => {
        await api.post('/logout');
    },
    getUser: async () => {
        const response = await api.get('/user');
        return response.data;
    }
};
