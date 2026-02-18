'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Store, Mail, Lock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const { login, user } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    useEffect(() => {
        if (user) {
            router.push('/locations');
        }
    }, [user, router]);

    // Redirect if already logged in (prevent flash) - optional, but useEffect is safer for Router updates
    if (user) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        try {
            await login({ email, password });
        } catch (err: any) {
            console.error('Login submit error:', err);
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else if (err.response?.data?.message) {
                setErrors({ general: [err.response.data.message] });
            } else {
                setErrors({ general: ['Login failed. Please check your credentials.'] });
            }
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center transform rotate-3 mb-4">
                        <Store className="h-8 w-8 text-white -rotate-3" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
                    <p className="mt-2 text-gray-600">Please sign in to your dashboard</p>
                </div>

                {errors.general && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100 flex items-start gap-2 animate-in fade-in slide-in-from-top-1">
                        <span className="font-semibold shrink-0">Error:</span>
                        <span>{errors.general[0]}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900`}
                                placeholder="admin@example.com"
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-600 animate-in fade-in slide-in-from-top-1">{errors.email[0]}</p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900`}
                                placeholder="••••••••"
                            />
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-600 animate-in fade-in slide-in-from-top-1">{errors.password[0]}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full flex items-center justify-center py-2.5 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-semibold transition-all shadow-md hover:shadow-lg transform active:scale-[0.98]"
                    >
                        Sign In
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
}
