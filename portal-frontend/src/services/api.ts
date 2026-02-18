import axios from "axios";
import { environment } from "../../environment/environment-development";

const api = axios.create({
    baseURL: environment.apiUrl,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token') || environment.token_identifier;
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
        // Handle common error structures if needed
        return Promise.reject(error);
    }
);

export default api;
