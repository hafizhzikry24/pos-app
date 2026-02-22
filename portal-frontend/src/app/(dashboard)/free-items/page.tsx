'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { freeItemService, FreeItem, PaginatedResponse } from '@/services/freeItem';
import { Item } from '@/services/itemService';
import { Plus, Pencil, Trash2, Gift, DollarSign, Package, CheckCircle, XCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function FreeItemsPage() {
    const { user, logout, loading } = useAuth();
    const [freeItems, setFreeItems] = useState<FreeItem[]>([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    });
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
        if (user) {
            setCurrentPage(1);
            loadFreeItems();
        }
    }, [user, loading, router, search, currentPage]);

    const loadFreeItems = async () => {
        try {
            const data: PaginatedResponse<FreeItem> = await freeItemService.getPaginated(search, currentPage, 10);
            setFreeItems(data.data);
            setPagination({
                current_page: data.current_page,
                last_page: data.last_page,
                per_page: data.per_page,
                total: data.total
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this free item promotion?')) {
            try {
                await freeItemService.delete(id);
                loadFreeItems();
            } catch (err) {
                console.error(err);
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!user) return null;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Free Items</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage promotional free items and purchase requirements.</p>
                </div>
                <Link
                    href="/free-items/create"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Add Free Item
                </Link>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by name or description..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Name</th>
                                <th className="px-6 py-4 font-semibold">Required Purchase</th>
                                <th className="px-6 py-4 font-semibold">Eligible Items</th>
                                <th className="px-6 py-4 font-semibold">Selectable Items</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {freeItems.map((freeItem: FreeItem) => (
                                <tr key={freeItem.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="font-medium text-gray-900">{freeItem.name}</div>
                                            {freeItem.description && (
                                                <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                    {freeItem.description}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-900">
                                                RP {freeItem.required_purchase_amount}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Package className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600">
                                                {freeItem.eligible_items.length} items
                                            </span>
                                        </div>
                                        {freeItem.eligible_items.length > 0 && (
                                            <div className="text-xs text-gray-500 mt-1">
                                                {freeItem.eligible_items.slice(0, 2).map((item: Item) => item.name).join(', ')}
                                                {freeItem.eligible_items.length > 2 && '...'}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Gift className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600">
                                                {freeItem.selectable_items.length} items
                                            </span>
                                        </div>
                                        {freeItem.selectable_items.length > 0 && (
                                            <div className="text-xs text-gray-500 mt-1">
                                                {freeItem.selectable_items.slice(0, 2).map((item: Item) => item.name).join(', ')}
                                                {freeItem.selectable_items.length > 2 && '...'}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${freeItem.is_active
                                            ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20'
                                            : 'bg-red-50 text-red-700 ring-1 ring-red-600/20'
                                            }`}>
                                            {freeItem.is_active ? (
                                                <>
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    Active
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="w-3 h-3 mr-1" />
                                                    Inactive
                                                </>
                                            )}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <Link
                                                href={`/free-items/${freeItem.id}`}
                                                className="text-gray-400 hover:text-blue-600 transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(freeItem.id)}
                                                className="text-gray-400 hover:text-red-600 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {freeItems.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <Gift className="w-8 h-8 text-gray-400 mb-2" />
                                            <p className="font-medium">No free items found</p>
                                            <p className="text-sm">Try adjusting your search or add a new free item promotion.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {pagination.last_page >= 1 && (
                <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-700">
                        Showing <span className="font-medium">{(pagination.current_page - 1) * pagination.per_page + 1}</span> to{' '}
                        <span className="font-medium">{Math.min(pagination.current_page * pagination.per_page, pagination.total)}</span> of{' '}
                        <span className="font-medium">{pagination.total}</span> results
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={pagination.current_page === 1}
                            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4 text-gray-900" />
                        </button>
                        <span className="text-sm text-gray-700 px-3">
                            Page {pagination.current_page} of {pagination.last_page}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(pagination.last_page, prev + 1))}
                            disabled={pagination.current_page === pagination.last_page}
                            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-4 h-4 text-gray-900" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
