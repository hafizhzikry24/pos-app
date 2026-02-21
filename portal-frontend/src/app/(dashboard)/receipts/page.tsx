"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Receipt, receiptService, PaginatedResponse } from "@/services/receiptService";
import { FileText, Eye, Package, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function ReceiptListPage() {
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [search, setSearch] = useState('');
    const { user, loading } = useAuth();
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
            fetchReceipts();
        }
    }, [search, currentPage, user, loading, router]);


    const handleViewReceipt = (receipt: Receipt) => {
        // Store table info in localStorage for the detail page
        if (receipt.table_info?.suffix && receipt.table_info.suffix !== 'original') {
            localStorage.setItem(`receiptTable_${receipt.id}`, receipt.table_info.suffix);
            // Navigate with table parameter
            window.location.href = `/receipts/${receipt.id}?table=${receipt.table_info.suffix}`;
        } else {
            // Remove any existing table info for original table receipts
            localStorage.removeItem(`receiptTable_${receipt.id}`);
            window.location.href = `/receipts/${receipt.id}`;
        }
    };

    const fetchReceipts = async () => {
        try {
            const data: PaginatedResponse<Receipt> = await receiptService.getPaginated(search, currentPage, 10);
            setReceipts(data.data || []);
            setPagination({
                current_page: data.current_page,
                last_page: data.last_page,
                per_page: data.per_page,
                total: data.total
            });
        } catch (error) {
            console.error("Failed to fetch receipts", error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Receipts</h2>
                    <p className="text-sm text-gray-500 mt-1">View and manage all transaction receipts.</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by receipt number, cashier, or customer..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4">Receipt #</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Cashier</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Total</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {receipts.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <FileText className="w-8 h-8 text-gray-400" />
                                        <span>No receipts found.</span>
                                        <p className="text-sm">Try adjusting your search criteria.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            receipts.map((receipt) => (
                                <tr key={`${receipt.id}-${receipt.table_info?.suffix || 'original'}`} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs">{receipt.number}</td>
                                    <td className="px-6 py-4">
                                        {new Date(receipt.created_at).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </td>
                                    <td className="px-6 py-4">{receipt.cashier?.name || 'N/A'}</td>
                                    <td className="px-6 py-4">{receipt.customer?.name || 'Guest'}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {new Intl.NumberFormat("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                        }).format(Number(receipt.payable_amount))}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={cn(
                                                "px-2 py-1 rounded-full text-xs font-medium uppercase",
                                                receipt.status === 'completed'
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            )}
                                        >
                                            {receipt.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleViewReceipt(receipt)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center gap-1"
                                        >
                                            <Eye size={18} />
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
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
