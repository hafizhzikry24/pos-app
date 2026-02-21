'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Store, User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const { authService } = useAuth();
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        try {
            await authService.register({ name, email, password });
            router.push('/login');
        } catch (err: any) {
            console.error('Registration error:', err);
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else if (err.response?.data?.message) {
                setErrors({ general: [err.response.data.message] });
            } else {
                setErrors({ general: ['Registration failed. Please try again.'] });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center transform rotate-3 mb-4">
                        <Store className="h-8 w-8 text-white -rotate-3" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                    <p className="mt-2 text-gray-600">Join us and start managing your store</p>
                </div>

                {errors.general && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100 flex items-start gap-2 animate-in fade-in slide-in-from-top-1">
                        <span className="font-semibold shrink-0">Error:</span>
                        <span>{errors.general[0]}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900`}
                                placeholder="John Doe"
                            />
                        </div>
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-600 animate-in fade-in slide-in-from-top-1">{errors.name[0]}</p>
                        )}
                    </div>

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
                                placeholder="name@example.com"
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
                        disabled={loading}
                        className="w-full flex items-center justify-center py-2.5 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-semibold transition-all shadow-md hover:shadow-lg transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating account...
                            </>
                        ) : (
                            <>
                                Sign Up
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
