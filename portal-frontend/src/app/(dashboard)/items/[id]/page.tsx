'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { itemService, Item } from '@/services/itemService';
import { ArrowLeft, Save, Package, Tag, DollarSign, Ruler } from 'lucide-react';
import Link from 'next/link';

export default function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { user, loading } = useAuth();
    const router = useRouter();

    const [item, setItem] = useState<Item | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        sku_code: '',
        price: '',
        measure: '',
        is_active: true,
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
            loadItem(parseInt(id));
        }
    }, [user, loading, router, id]);

    const loadItem = async (id: number) => {
        try {
            const data = await itemService.getById(id);
            setItem(data);
            setFormData({
                name: data.name,
                sku_code: data.sku_code,
                price: data.price.toString(),
                measure: data.measure,
                is_active: data.is_active,
            });
        } catch (err) {
            console.error(err);
            router.push('/items');
        } finally {
            setIsLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string[]> = {};

        if (!formData.name.trim()) {
            newErrors.name = ['Item name is required'];
        }

        if (!formData.sku_code.trim()) {
            newErrors.sku_code = ['SKU code is required'];
        }

        if (!formData.price || isNaN(parseFloat(formData.price))) {
            newErrors.price = ['Valid price is required'];
        }

        if (!formData.measure.trim()) {
            newErrors.measure = ['Measure unit is required (e.g., kg, pcs)'];
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
            await itemService.update(parseInt(id), {
                ...formData,
                price: parseFloat(formData.price),
            });
            router.push('/items');
        } catch (err: any) {
            console.error(err);
            if (err.response?.status === 422 && err.response.data?.errors) {
                setErrors(err.response.data.errors);
            } else if (err.response?.data?.message) {
                setErrors({ submit: [err.response.data.message] });
            } else {
                setErrors({ submit: ['Failed to update item. Please try again.'] });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

        setFormData(prev => ({ ...prev, [name]: val }));
        if (errors[name]) {
            const newErrors = { ...errors };
            delete newErrors[name];
            setErrors(newErrors);
        }
    };

    if (loading || isLoading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
    if (!user) return null;
    if (!item) return <div className="p-8 text-center text-gray-500">Item not found</div>;

    return (
        <div className="space-y-6 max-w-4xl mx-auto p-4 md:p-6 pb-20">
            <div className="flex items-center gap-4">
                <Link
                    href="/items"
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Items
                </Link>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                    <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Edit Item</h1>
                    <p className="text-sm text-gray-500 mt-1">Update item details, pricing and availability.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <form onSubmit={handleSubmit} className="divide-y divide-gray-100">
                    <div className="p-6 space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-semibold text-gray-700">
                                Item Name *
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900 ${errors.name ? 'border-red-300' : 'border-gray-200'
                                        }`}
                                    placeholder="e.g. Daging A4"
                                />
                            </div>
                            {errors.name && <p className="text-xs text-red-600 font-medium animate-in fade-in slide-in-from-top-1">{errors.name[0]}</p>}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="sku_code" className="text-sm font-semibold text-gray-700">
                                SKU Code *
                            </label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    id="sku_code"
                                    name="sku_code"
                                    value={formData.sku_code}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900 ${errors.sku_code ? 'border-red-300' : 'border-gray-200'
                                        }`}
                                    placeholder="SKU-XXXXXX"
                                />
                            </div>
                            {errors.sku_code && <p className="text-xs text-red-600 font-medium animate-in fade-in slide-in-from-top-1">{errors.sku_code[0]}</p>}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="price" className="text-sm font-semibold text-gray-700">
                                Price (IDR) *
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    step="0.01"
                                    className={`w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900 ${errors.price ? 'border-red-300' : 'border-gray-200'
                                        }`}
                                    placeholder="0.00"
                                />
                            </div>
                            {errors.price && <p className="text-xs text-red-600 font-medium animate-in fade-in slide-in-from-top-1">{errors.price[0]}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Unit Measure
                            </label>
                            <select
                                value={formData.measure}
                                name="measure"
                                onChange={handleChange}
                                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 ${errors.measure ? 'border-red-300' : 'border-gray-300'}`}
                            >
                                <option value="pcs">Pcs</option>
                                <option value="kg">Kg</option>
                                <option value="ltr">Liter</option>
                                <option value="pack">Pack</option>
                                <option value="box">Box</option>
                            </select>
                            {errors.measure && <p className="text-xs text-red-600 font-medium animate-in fade-in slide-in-from-top-1">{errors.measure[0]}</p>}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
                        <input
                            type="checkbox"
                            id="is_active"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={handleChange}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="is_active" className="text-sm font-medium text-gray-700 flex flex-col">
                            <span>Active Status</span>
                            <span className="text-xs text-gray-500 leading-none">Inactive items won't appear in the POS system</span>
                        </label>
                    </div>

                    <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
                        <Link
                            href="/items"
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
