"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { itemService } from "@/services/itemService";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateItemPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        sku_code: "",
        name: "",
        price: "",
        measure: "pcs",
        is_active: true,
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        try {
            await itemService.create({
                ...formData,
                price: parseFloat(formData.price),
            });
            router.push("/items");
        } catch (error: any) {
            console.error("Failed to create item", error);
            if (error.response?.status === 422 && error.response.data?.errors) {
                setErrors(error.response.data.errors);
            } else if (error.response?.data?.message) {
                setErrors({ general: [error.response.data.message] });
            } else {
                setErrors({ general: ["An unexpected error occurred. Please try again."] });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/items"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} className="text-gray-600" />
                </Link>
                <h2 className="text-2xl font-bold text-white">Add New Item</h2>
            </div>

            {errors.general && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100 animate-in fade-in slide-in-from-top-1">
                    {errors.general[0]}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            SKU Code
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.sku_code}
                            onChange={(e) => setFormData({ ...formData, sku_code: e.target.value })}
                            className={`w-full px-4 py-2 rounded-lg border ${errors.sku_code ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900`}
                            placeholder="e.g. ITEM-001"
                        />
                        {errors.sku_code && (
                            <p className="mt-1 text-xs text-red-600">{errors.sku_code[0]}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={`w-full px-4 py-2 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900`}
                            placeholder="e.g. Mineral Water"
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-600">{errors.name[0]}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-500">Rp</span>
                            <input
                                type="number"
                                required
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${errors.price ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900`}
                                placeholder="0"
                            />
                        </div>
                        {errors.price && (
                            <p className="mt-1 text-xs text-red-600">{errors.price[0]}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Unit Measure
                        </label>
                        <select
                            value={formData.measure}
                            onChange={(e) => setFormData({ ...formData, measure: e.target.value })}
                            className={`w-full px-4 py-2 rounded-lg border ${errors.measure ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900`}
                        >
                            <option value="pcs">Pcs</option>
                            <option value="kg">Kg</option>
                            <option value="ltr">Liter</option>
                            <option value="pack">Pack</option>
                            <option value="box">Box</option>
                        </select>
                        {errors.measure && (
                            <p className="mt-1 text-xs text-red-600">{errors.measure[0]}</p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="is_active"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                        Active Item
                    </label>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <Link
                        href="/items"
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Create Item"}
                    </button>
                </div>
            </form>
        </div>
    );
}
