import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth';
import { environment } from '../../environment/environment-development';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const userData = await authService.getUser();
                setUser(userData);
            } catch (error) {
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };
        checkUser();
    }, []);

    const login = async (credentials: any) => {
        try {
            const loginData = {
                ...credentials,
                token_identifier: environment.token_identifier || '@Pos_apps_2025', // Fallback to hardcoded value if env var is not loaded
            };
            console.log('Login data:', loginData); // Debug log
            const data = await authService.login(loginData);
            localStorage.setItem('token', data.token);
            const userData = await authService.getUser();
            setUser(userData);
            router.push('/cashier');
        } catch (error) {
            console.error('Login error:', error);
            throw error; // Re-throw the error to be handled by the component
        }
    };

    const logout = async () => {
        await authService.logout();
        localStorage.removeItem('token');
        setUser(null);
        router.push('/login');
    };

    return { user, loading, login, logout, authService }; // exposing authService for register etc if needed
};
