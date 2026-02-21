'use client';
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { freeItemService, FreeItem, UpdateFreeItemRequest } from '@/services/freeItem';
import { itemService, Item } from '@/services/itemService';
import { ArrowLeft, Save, Gift, DollarSign, Package, CheckCircle, Check } from 'lucide-react';
import Link from 'next/link';

export default function EditFreeItemPage({ params }: { params: Promise<{ id: string }> }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const resolvedParams = use(params);
    const [items, setItems] = useState<Item[]>([]);
    const [freeItem, setFreeItem] = useState<FreeItem | null>(null);
    const [formData, setFormData] = useState<UpdateFreeItemRequest>({
        name: '',
        required_purchase_amount: 0,
        is_active: true,
        description: '',
        eligible_items: [],
        selectable_items: [],
    });
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
            return;
        }

        if (user && resolvedParams.id) {
            Promise.all([loadFreeItem(parseInt(resolvedParams.id)), loadItems()]);
        }
    }, [user, loading, router, resolvedParams.id]);

    const loadFreeItem = async (id: number) => {
        try {
            const data = await freeItemService.getById(id);
            setFreeItem(data);
            setFormData({
                name: data.name,
                required_purchase_amount: data.required_purchase_amount,
                is_active: data.is_active,
                description: data.description || '',
                eligible_items: data.eligible_items.map((item: Item) => item.id),
                selectable_items: data.selectable_items.map((item: Item) => item.id),
            });
        } catch (err) {
            console.error(err);
            router.push('/free-items');
        }
    };

    const loadItems = async () => {
        try {
            const data = await itemService.getAll();
            setItems(data.filter(item => item.is_active));
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string[]> = {};

        if (!formData.name?.trim()) {
            newErrors.name = ['Free item name is required'];
        }

        if (formData.required_purchase_amount && formData.required_purchase_amount <= 0) {
            newErrors.required_purchase_amount = ['Required purchase amount must be greater than 0'];
        }

        if (formData.eligible_items && formData.eligible_items.length === 0) {
            newErrors.eligible_items = ['At least one eligible item must be selected'];
        }

        if (formData.selectable_items && formData.selectable_items.length === 0) {
            newErrors.selectable_items = ['At least one selectable item must be selected'];
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
            await freeItemService.update(parseInt(resolvedParams.id), formData);
            router.push('/free-items');
        } catch (err: any) {
            console.error(err);
            if (err.response?.status === 422 && err.response.data?.errors) {
                setErrors(err.response.data.errors);
            } else if (err.response?.data?.message) {
                setErrors({ submit: [err.response.data.message] });
            } else {
                setErrors({ submit: ['Failed to update free item. Please try again.'] });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
        if (errors[name]) {
            const newErrors = { ...errors };
            delete newErrors[name];
            setErrors(newErrors);
        }
    };

    const handleCheckboxChange = (type: 'eligible_items' | 'selectable_items', itemId: number) => {
        setFormData(prev => ({
            ...prev,
            [type]: prev[type]?.includes(itemId)
                ? prev[type]?.filter(id => id !== itemId)
                : [...(prev[type] || []), itemId]
        }));
        if (errors[type]) {
            const newErrors = { ...errors };
            delete newErrors[type];
            setErrors(newErrors);
        }
    };

    if (loading || isLoading) return <div>Loading...</div>;
    if (!user) return null;
    if (!freeItem) return <div>Free item not found</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/free-items"
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Free Items
                </Link>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                    <Gift className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Edit Free Item</h1>
                    <p className="text-sm text-gray-500 mt-1">Update promotional free item offer.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {errors.submit && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-in fade-in slide-in-from-top-1">
                            <p className="text-red-600 text-sm">{errors.submit[0]}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Free Item Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${errors.name ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                placeholder="e.g., Free Coffee with Breakfast"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600 animate-in fade-in slide-in-from-top-1">{errors.name[0]}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="required_purchase_amount" className="block text-sm font-medium text-gray-700 mb-2">
                                Required Purchase Amount *
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="number"
                                    id="required_purchase_amount"
                                    name="required_purchase_amount"
                                    value={formData.required_purchase_amount}
                                    onChange={handleChange}
                                    step="0.01"
                                    min="0"
                                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${errors.required_purchase_amount ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder="0.00"
                                />
                            </div>
                            {errors.required_purchase_amount && (
                                <p className="mt-1 text-sm text-red-600 animate-in fade-in slide-in-from-top-1">{errors.required_purchase_amount[0]}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            placeholder="Describe the free item promotion..."
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="is_active"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                            Active (customers can claim this free item)
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Eligible Items *
                                <span className="text-xs text-gray-500 ml-1">(items that qualify for this offer)</span>
                            </label>
                            <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
                                <div className="grid grid-cols-1 gap-2">
                                    {items.map((item: Item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => handleCheckboxChange('eligible_items', item.id)}
                                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer border transition-colors ${formData.eligible_items?.includes(item.id)
                                                ? 'bg-blue-50 border-blue-200 text-blue-700'
                                                : 'bg-white border-gray-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.eligible_items?.includes(item.id)
                                                    ? 'bg-blue-600 border-blue-600'
                                                    : 'border-gray-300'
                                                    }`}>
                                                    {formData.eligible_items?.includes(item.id) && (
                                                        <Check className="w-3 h-3 text-white" />
                                                    )}
                                                </div>
                                                <span className="text-sm font-medium">{item.name}</span>
                                            </div>
                                            <span className="text-sm">RP {String(parseFloat(item.price).toFixed(2))}</span>
                                        </div>
                                    ))}
                                </div>
                                {items.length === 0 && (
                                    <p className="text-sm text-gray-500">No active items available</p>
                                )}
                            </div>
                            {errors.eligible_items && (
                                <p className="mt-1 text-sm text-red-600 animate-in fade-in slide-in-from-top-1">{errors.eligible_items[0]}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Selectable Items *
                                <span className="text-xs text-gray-500 ml-1">(items customers can choose as free)</span>
                            </label>
                            <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
                                <div className="grid grid-cols-1 gap-2">
                                    {items.map((item: Item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => handleCheckboxChange('selectable_items', item.id)}
                                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer border transition-colors ${formData.selectable_items?.includes(item.id)
                                                ? 'bg-blue-50 border-blue-200 text-blue-700'
                                                : 'bg-white border-gray-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.selectable_items?.includes(item.id)
                                                    ? 'bg-blue-600 border-blue-600'
                                                    : 'border-gray-300'
                                                    }`}>
                                                    {formData.selectable_items?.includes(item.id) && (
                                                        <Check className="w-3 h-3 text-white" />
                                                    )}
                                                </div>
                                                <span className="text-sm font-medium">{item.name}</span>
                                            </div>
                                            <span className="text-sm">RP {String(parseFloat(item.price.toString()).toFixed(2))}</span>
                                        </div>
                                    ))}
                                </div>
                                {items.length === 0 && (
                                    <p className="text-sm text-gray-500">No active items available</p>
                                )}
                            </div>
                            {errors.selectable_items && (
                                <p className="mt-1 text-sm text-red-600 animate-in fade-in slide-in-from-top-1">{errors.selectable_items[0]}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <Link
                            href="/free-items"
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
                            {isSubmitting ? 'Updating...' : 'Update Free Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
