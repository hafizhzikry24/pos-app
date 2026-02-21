'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { cashierService } from '@/services/cashier';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const { user, logout, loading } = useAuth();
    const [cashiers, setCashiers] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
        if (user) {
            loadCashiers();
        }
    }, [user, loading, router]);

    const loadCashiers = async () => {
        try {
            const data = await cashierService.getAll();
            setCashiers(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure?')) {
            await cashierService.delete(id);
            loadCashiers();
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!user) return null;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Cashiers</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your store cashiers and their access.</p>
                </div>
                <Link
                    href="/cashier/create-cashier"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Add Cashier
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Name</th>
                                <th className="px-6 py-4 font-semibold">Email</th>
                                <th className="px-6 py-4 font-semibold">Phone</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {cashiers.map((cashier) => (
                                <tr key={cashier.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{cashier.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{cashier.email}</td>
                                    <td className="px-6 py-4 text-gray-600 font-mono">{cashier.phone || '-'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cashier.is_active
                                            ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20'
                                            : 'bg-red-50 text-red-700 ring-1 ring-red-600/20'
                                            }`}>
                                            {cashier.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <Link
                                                href={`/cashier/${cashier.id}`}
                                                className="text-gray-400 hover:text-blue-600 transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(cashier.id)}
                                                className="text-gray-400 hover:text-red-600 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {cashiers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <Users className="w-8 h-8 text-gray-400 mb-2" />
                                            <p className="font-medium">No cashiers found</p>
                                            <p className="text-sm">Get started by adding a new cashier.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
