'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { cashierService } from '@/services/cashier';
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
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                    <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Logout</button>
                </div>

                <div className="bg-white p-6 rounded shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-700">Cashiers</h2>
                        <Link href="/cashier/create-cashier" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add Cashier</Link>
                    </div>

                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="border-b py-2 text-gray-600">Name</th>
                                <th className="border-b py-2 text-gray-600">Email</th>
                                <th className="border-b py-2 text-gray-600">Phone</th>
                                <th className="border-b py-2 text-gray-600">Status</th>
                                <th className="border-b py-2 text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cashiers.map((cashier) => (
                                <tr key={cashier.id}>
                                    <td className="py-2 border-b text-gray-800">{cashier.name}</td>
                                    <td className="py-2 border-b text-gray-800">{cashier.email}</td>
                                    <td className="py-2 border-b text-gray-800">{cashier.phone || '-'}</td>
                                    <td className="py-2 border-b">
                                        <span className={`px-2 py-1 text-xs rounded ${
                                            cashier.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {cashier.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="py-2 border-b">
                                        <Link 
                                            href={`/cashier/${cashier.id}`}
                                            className="text-blue-500 hover:text-blue-700 mr-3"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(cashier.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {cashiers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-4 text-center text-gray-500">No cashiers found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
