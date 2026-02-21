"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { locationService } from "@/services/locationService";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateLocationPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        code: "",
        name: "",
        address: "",
    });
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        try {
            await locationService.create(formData);
            router.push("/locations");
        } catch (err: any) {
            console.error("Failed to create location", err);
            if (err.response?.status === 422 && err.response.data?.errors) {
                setErrors(err.response.data.errors);
            } else if (err.response?.data?.message) {
                setErrors({ submit: [err.response.data.message] });
            } else {
                setErrors({ submit: ['Failed to create location. Please try again.'] });
            }
        } finally {
            setLoading(false);
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

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/locations"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} className="text-gray-600" />
                </Link>
                <h2 className="text-2xl font-bold text-gray-800">Add New Location</h2>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
                {errors.submit && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-in fade-in slide-in-from-top-1">
                        <p className="text-red-600 text-sm">{errors.submit[0]}</p>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location Code
                    </label>
                    <input
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 ${errors.code ? 'border-red-300' : 'border-gray-300'}`}
                        placeholder="e.g. WH-01"
                    />
                    {errors.code && (
                        <p className="mt-1 text-sm text-red-600 animate-in fade-in slide-in-from-top-1">{errors.code[0]}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
                        placeholder="e.g. Main Warehouse"
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600 animate-in fade-in slide-in-from-top-1">{errors.name[0]}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                    </label>
                    <textarea
                        name="address"
                        rows={3}
                        value={formData.address}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 ${errors.address ? 'border-red-300' : 'border-gray-300'}`}
                        placeholder="Complete address..."
                    />
                    {errors.address && (
                        <p className="mt-1 text-sm text-red-600 animate-in fade-in slide-in-from-top-1">{errors.address[0]}</p>
                    )}
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <Link
                        href="/locations"
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Create Location"}
                    </button>
                </div>
            </form>
        </div>
    );
}
