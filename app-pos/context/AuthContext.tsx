import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '@/services/storage';
import api from '@/services/api';
import { environment } from '@/environment/environment';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/profile');
            // Interceptor already returned response.data.data into response.data
            setUser(response.data);
        } catch (error) {
            console.error("Fetch Profile Error:", error);
        }
    };

    useEffect(() => {
        const loadToken = async () => {
            try {
                const storedToken = await storage.getItem('token');
                if (storedToken) {
                    setToken(storedToken);
                    await fetchProfile();
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
            const response = await api.post('/login', {
                ...credentials,
                token_identifier: environment.TOKEN_IDENTIFIER
            });
            // Interceptor returns response.data.data into response.data
            // We expect token inside that data
            const { token } = response.data;
            if (!token) throw new Error("No token received");

            await storage.setItem('token', token);
            setToken(token);
            await fetchProfile();
            return true;
        } catch (error: any) {
            console.error("AuthContext Login Error:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            if (token) {
                await api.post('/logout');
            }
        } catch (e) {
            // ignore error on logout
        }
        await storage.deleteItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
