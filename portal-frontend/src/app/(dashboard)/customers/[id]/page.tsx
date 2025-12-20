'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { customerService, Customer, UpdateCustomerRequest } from '@/services/customer';
import { ArrowLeft, Save, UserPlus, Phone } from 'lucide-react';
import Link from 'next/link';

export default function EditCustomerPage({ params }: { params: { id: string } }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [formData, setFormData] = useState<UpdateCustomerRequest>({
        name: '',
        phone_number: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
            return;
        }

        if (user && params.id) {
            loadCustomer(parseInt(params.id));
        }
    }, [user, loading, router, params.id]);

    const loadCustomer = async (id: number) => {
        try {
            const data = await customerService.getById(id);
            setCustomer(data);
            setFormData({
                name: data.name,
                phone_number: data.phone_number,
            });
        } catch (err) {
            console.error(err);
            router.push('/customers');
        } finally {
            setIsLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name?.trim()) {
            newErrors.name = 'Customer name is required';
        }

        if (!formData.phone_number?.trim()) {
            newErrors.phone_number = 'Phone number is required';
        } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone_number)) {
            newErrors.phone_number = 'Please enter a valid phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            await customerService.update(parseInt(params.id), formData);
            router.push('/customers');
        } catch (err) {
            console.error(err);
            setErrors({ submit: 'Failed to update customer. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    if (loading || isLoading) return <div>Loading...</div>;
    if (!user) return null;
    if (!customer) return <div>Customer not found</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/customers"
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Customers
                </Link>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                    <UserPlus className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Edit Customer</h1>
                    <p className="text-sm text-gray-500 mt-1">Update customer information.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {errors.submit && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-600 text-sm">{errors.submit}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Customer Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.name ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder="Enter customer name"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number *
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="tel"
                                    id="phone_number"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.phone_number ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>
                            {errors.phone_number && (
                                <p className="mt-1 text-sm text-red-600">{errors.phone_number}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <Link
                            href="/customers"
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="w-4 h-4" />
                            {isSubmitting ? 'Updating...' : 'Update Customer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
