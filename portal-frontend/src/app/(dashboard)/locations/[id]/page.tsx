'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { locationService, Location } from '@/services/locationService';
import { ArrowLeft, Save, MapPin, Tag, Home } from 'lucide-react';
import Link from 'next/link';

export default function EditLocationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { user, loading } = useAuth();
    const router = useRouter();

    const [location, setLocation] = useState<Location | null>(null);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        address: '',
    });
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
            return;
        }

        if (user && id) {
            loadLocation(parseInt(id));
        }
    }, [user, loading, router, id]);

    const loadLocation = async (id: number) => {
        try {
            const data = await locationService.getById(id);
            setLocation(data);
            setFormData({
                code: data.code,
                name: data.name,
                address: data.address,
            });
        } catch (err) {
            console.error(err);
            router.push('/locations');
        } finally {
            setIsLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string[]> = {};

        if (!formData.code.trim()) {
            newErrors.code = ['Location code is required'];
        }

        if (!formData.name.trim()) {
            newErrors.name = ['Location name is required'];
        }

        if (!formData.address.trim()) {
            newErrors.address = ['Address is required'];
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        setErrors({});
        try {
            await locationService.update(parseInt(id), formData);
            router.push('/locations');
        } catch (err: any) {
            console.error(err);
            if (err.response?.status === 422 && err.response.data?.errors) {
                setErrors(err.response.data.errors);
            } else if (err.response?.data?.message) {
                setErrors({ submit: [err.response.data.message] });
            } else {
                setErrors({ submit: ['Failed to update location. Please try again.'] });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            const newErrors = { ...errors };
            delete newErrors[name];
            setErrors(newErrors);
        }
    };

    if (loading || isLoading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
    if (!user) return null;
    if (!location) return <div className="p-8 text-center text-gray-500">Location not found</div>;

    return (
        <div className="space-y-6 max-w-4xl mx-auto p-4 md:p-6 pb-20">
            <div className="flex items-center gap-4">
                <Link
                    href="/locations"
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Locations
                </Link>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                    <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Edit Location</h1>
                    <p className="text-sm text-gray-500 mt-1">Update location details and address.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <form onSubmit={handleSubmit} className="divide-y divide-gray-100">
                    <div className="p-6 space-y-6">
                        {errors.submit && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-in fade-in slide-in-from-top-1">
                                <p className="text-red-600 text-sm font-medium">{errors.submit[0]}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="code" className="text-sm font-semibold text-gray-700">
                                    Location Code *
                                </label>
                                <div className="relative">
                                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        id="code"
                                        name="code"
                                        value={formData.code}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900 ${errors.code ? 'border-red-300' : 'border-gray-200'
                                            }`}
                                        placeholder="LOC-XXXX"
                                    />
                                </div>
                                {errors.code && <p className="text-xs text-red-600 font-medium animate-in fade-in slide-in-from-top-1">{errors.code[0]}</p>}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-semibold text-gray-700">
                                    Location Name *
                                </label>
                                <div className="relative">
                                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900 ${errors.name ? 'border-red-300' : 'border-gray-200'
                                            }`}
                                        placeholder="e.g. Central Store"
                                    />
                                </div>
                                {errors.name && <p className="text-xs text-red-600 font-medium animate-in fade-in slide-in-from-top-1">{errors.name[0]}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="address" className="text-sm font-semibold text-gray-700">
                                Address *
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows={4}
                                className={`w-full px-4 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900 ${errors.address ? 'border-red-300' : 'border-gray-200'
                                    }`}
                                placeholder="Enter full address"
                            />
                            {errors.address && <p className="text-xs text-red-600 font-medium animate-in fade-in slide-in-from-top-1">{errors.address[0]}</p>}
                        </div>
                    </div>

                    <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
                        <Link
                            href="/locations"
                            className="px-4 py-2 text-gray-700 font-medium hover:text-gray-900 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="w-4 h-4" />
                            {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
