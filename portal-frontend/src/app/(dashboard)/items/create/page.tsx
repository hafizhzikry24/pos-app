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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await itemService.create({
                ...formData,
                price: parseFloat(formData.price),
            });
            router.push("/items");
        } catch (error) {
            console.error("Failed to create item", error);
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
                <h2 className="text-2xl font-bold text-gray-800">Add New Item</h2>
            </div>

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
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="e.g. ITEM-001"
                        />
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
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="e.g. Mineral Water"
                        />
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
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="0"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Unit Measure
                        </label>
                        <select
                            value={formData.measure}
                            onChange={(e) => setFormData({ ...formData, measure: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        >
                            <option value="pcs">Pcs</option>
                            <option value="kg">Kg</option>
                            <option value="ltr">Liter</option>
                            <option value="pack">Pack</option>
                            <option value="box">Box</option>
                        </select>
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
