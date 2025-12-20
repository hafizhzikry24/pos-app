import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  Text, 
  Alert, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const { login } = useAuth();

    const validateForm = () => {
        let isValid = true;
        setEmailError('');
        setPasswordError('');

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setEmailError('Email is required');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            setEmailError('Please enter a valid email');
            isValid = false;
        }

        // Password validation
        if (!password) {
            setPasswordError('Password is required');
            isValid = false;
        } else if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            isValid = false;
        }

        return isValid;
    };

    const handleLogin = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            await login({ email, password });
            console.log("Login successful, redirecting...");
            
            // Navigate to main app
            if (router.canGoBack()) {
                router.dismissAll();
            }
            router.replace('/(tabs)');
        } catch (error: any) {
            console.error("Login component error:", error);
            Alert.alert(
                'Login Failed',
                'Invalid email or password. Please try again.',
                [{ text: 'OK', style: 'default' }]
            );
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView 
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Ionicons name="cash-outline" size={60} color="#4A90E2" />
                        <Text style={styles.appName}>Cashier Pos</Text>
                    </View>
                    <Text style={styles.welcomeText}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Sign in to continue</Text>
                </View>

                {/* Form */}
                <View style={styles.formContainer}>
                    {/* Email Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email Address</Text>
                        <View style={[styles.inputWrapper, emailError ? styles.inputError : null]}>
                            <Ionicons 
                                name="mail-outline" 
                                size={20} 
                                color="#666" 
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your email"
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    if (emailError) setEmailError('');
                                }}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                autoComplete="email"
                                editable={!isLoading}
                            />
                        </View>
                        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <View style={[styles.inputWrapper, passwordError ? styles.inputError : null]}>
                            <Ionicons 
                                name="lock-closed-outline" 
                                size={20} 
                                color="#666" 
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={[styles.input, { flex: 1 }]}
                                placeholder="Enter your password"
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    if (passwordError) setPasswordError('');
                                }}
                                secureTextEntry={!showPassword}
                                editable={!isLoading}
                            />
                            <TouchableOpacity 
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeIcon}
                            >
                                <Ionicons 
                                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                                    size={20} 
                                    color="#666" 
                                />
                            </TouchableOpacity>
                        </View>
                        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                    </View>

                    {/* Login Button */}
                    <TouchableOpacity 
                        style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                        onPress={handleLogin}
                        disabled={isLoading}
                        activeOpacity={0.8}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Text style={styles.loginButtonText}>Sign In</Text>
                                <Ionicons name="arrow-forward" size={20} color="#fff" />
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                {/* <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Need help?{' '}
                        <Text style={styles.footerLink}>Contact Support</Text>
                    </Text>
                    <Text style={styles.versionText}>Version 1.0.0</Text>
                </View> */}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    appName: {
        fontSize: 28,
        fontWeight: '700',
        color: '#2c3e50',
        marginTop: 10,
        letterSpacing: 0.5,
    },
    welcomeText: {
        fontSize: 22,
        fontWeight: '600',
        color: '#34495e',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#7f8c8d',
    },
    formContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
        marginBottom: 30,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        paddingHorizontal: 16,
        backgroundColor: '#f8f9fa',
        height: 56,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#2c3e50',
        marginLeft: 12,
        paddingVertical: 8,
    },
    inputIcon: {
        opacity: 0.7,
    },
    inputError: {
        borderColor: '#e74c3c',
        backgroundColor: '#fef2f2',
    },
    errorText: {
        color: '#e74c3c',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    eyeIcon: {
        padding: 8,
    },
    loginButton: {
        backgroundColor: '#4A90E2',
        borderRadius: 12,
        paddingVertical: 18,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#4A90E2',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    loginButtonDisabled: {
        opacity: 0.7,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginRight: 8,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#ecf0f1',
    },
    dividerText: {
        paddingHorizontal: 16,
        color: '#95a5a6',
        fontSize: 14,
        fontWeight: '500',
    },
    demoContainer: {
        backgroundColor: '#f0f7ff',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    demoTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4A90E2',
        marginBottom: 8,
    },
    demoText: {
        fontSize: 12,
        color: '#5d6d7e',
        marginBottom: 2,
    },
    footer: {
        alignItems: 'center',
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#ecf0f1',
    },
    footerText: {
        fontSize: 14,
        color: '#7f8c8d',
        marginBottom: 8,
    },
    footerLink: {
        color: '#4A90E2',
        fontWeight: '600',
    },
    versionText: {
        fontSize: 12,
        color: '#bdc3c7',
    },
});