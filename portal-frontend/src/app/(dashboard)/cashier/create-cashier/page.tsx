'use client';

import { useState, useEffect } from 'react';
import { cashierService } from '@/services/cashier';
import { locationService, Location } from '@/services/locationService';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateCashierPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [locationId, setLocationId] = useState<number | ''>('');
    const [locations, setLocations] = useState<Location[]>([]);

    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const data = await locationService.getAll();
            setLocations(data);
        } catch (error) {
            console.error("Failed to fetch locations", error);
        }
    };

    if (authLoading) return <div>Loading...</div>;
    if (!user) {
        router.push('/login');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        try {
            await cashierService.create({
                name,
                email,
                password,
                phone,
                address,
                is_active: isActive,
                location_id: locationId || null
            });
            router.push('/cashier');
        } catch (err: any) {
            console.error(err);
            if (err.response?.status === 422 && err.response.data?.errors) {
                setErrors(err.response.data.errors);
            } else if (err.response?.data?.message) {
                setErrors({ submit: [err.response.data.message] });
            } else {
                setErrors({ submit: ['Failed to create cashier. Please try again.'] });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 p-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/cashier"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} className="text-gray-600" />
                </Link>
                <h2 className="text-2xl font-bold text-white">Create Cashier</h2>
            </div>

            {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-in fade-in slide-in-from-top-1">
                    <p className="text-red-600 text-sm">{errors.submit[0]}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            if (errors.name) {
                                const newErrors = { ...errors };
                                delete newErrors.name;
                                setErrors(newErrors);
                            }
                        }}
                        required
                        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600 animate-in fade-in slide-in-from-top-1">{errors.name[0]}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) {
                                const newErrors = { ...errors };
                                delete newErrors.email;
                                setErrors(newErrors);
                            }
                        }}
                        required
                        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600 animate-in fade-in slide-in-from-top-1">{errors.email[0]}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (errors.password) {
                                const newErrors = { ...errors };
                                delete newErrors.password;
                                setErrors(newErrors);
                            }
                        }}
                        required
                        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 ${errors.password ? 'border-red-300' : 'border-gray-300'}`}
                    />
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-600 animate-in fade-in slide-in-from-top-1">{errors.password[0]}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <select
                        value={locationId}
                        onChange={(e) => {
                            setLocationId(Number(e.target.value) || '');
                            if (errors.location_id) {
                                const newErrors = { ...errors };
                                delete newErrors.location_id;
                                setErrors(newErrors);
                            }
                        }}
                        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 ${errors.location_id ? 'border-red-300' : 'border-gray-300'}`}
                    >
                        <option value="">Select Location...</option>
                        {locations.map((loc) => (
                            <option key={loc.id} value={loc.id}>
                                {loc.name} ({loc.code})
                            </option>
                        ))}
                    </select>
                    {errors.location_id && (
                        <p className="mt-1 text-sm text-red-600 animate-in fade-in slide-in-from-top-1">{errors.location_id[0]}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => {
                            setPhone(e.target.value);
                            if (errors.phone) {
                                const newErrors = { ...errors };
                                delete newErrors.phone;
                                setErrors(newErrors);
                            }
                        }}
                        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 ${errors.phone ? 'border-red-300' : 'border-gray-300'}`}
                    />
                    {errors.phone && (
                        <p className="mt-1 text-sm text-red-600 animate-in fade-in slide-in-from-top-1">{errors.phone[0]}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                        value={address}
                        onChange={(e) => {
                            setAddress(e.target.value);
                            if (errors.address) {
                                const newErrors = { ...errors };
                                delete newErrors.address;
                                setErrors(newErrors);
                            }
                        }}
                        rows={3}
                        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 ${errors.address ? 'border-red-300' : 'border-gray-300'}`}
                    />
                    {errors.address && (
                        <p className="mt-1 text-sm text-red-600 animate-in fade-in slide-in-from-top-1">{errors.address[0]}</p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="isActive"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                        Active Account
                    </label>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <Link
                        href="/cashier"
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Create Cashier"}
                    </button>
                </div>
            </form>
        </div>
    );
}
