import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Stack, useRouter, Slot } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

export default function RootNavigation() {
    const { token, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Simple navigation protection
        if (!isLoading) {
            if (token) {
                router.replace('/(tabs)');
            } else {
                router.replace('/login');
            }
        }
    }, [token, isLoading]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return <Slot />;
}
