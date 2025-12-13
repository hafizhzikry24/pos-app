import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { environment } from '@/environment/environment';

// Replace with your actual backend URL. 
// For Android Emulator use 10.0.2.2 instead of localhost
// For iOS Simulator localhost is fine
// For Physical device use your machine's IP
const API_URL = environment.API_URL;

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadToken = async () => {
            try {
                const storedToken = await SecureStore.getItemAsync('token');
                if (storedToken) {
                    setToken(storedToken);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        loadToken();
    }, []);

    const login = async (credentials: any) => {
        try {
            const response = await axios.post(`${API_URL}/login`, {
                ...credentials,
                token_identifier: environment.TOKEN_IDENTIFIER
            });
            const { token } = response.data;
            await SecureStore.setItemAsync('token', token);
            setToken(token);
            return true;
        } catch (error: any) {
            console.error(error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            if (token) {
                await axios.post(`${API_URL}/logout`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
        } catch (e) {
            // ignore error on logout
        }
        await SecureStore.deleteItemAsync('token');
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
