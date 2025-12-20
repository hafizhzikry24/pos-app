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
        const loginData = {
            ...credentials,
            token_identifier: environment.token_identifier,
        };
        const data = await authService.login(loginData);
        localStorage.setItem('token', data.token);
        const userData = await authService.getUser();
        setUser(userData);
        router.push('/cashier');
    };

    const logout = async () => {
        await authService.logout();
        localStorage.removeItem('token');
        setUser(null);
        router.push('/login');
    };

    return { user, loading, login, logout, authService }; // exposing authService for register etc if needed
};
