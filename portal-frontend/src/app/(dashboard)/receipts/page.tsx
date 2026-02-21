"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Receipt, receiptService } from "@/services/receipt";
import { FileText, Eye, Package } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ReceiptListPage() {
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReceipts();
    }, []);

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
            const data = await receiptService.getAll();
            setReceipts(data || []);
        } catch (error) {
            console.error("Failed to fetch receipts", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Receipts</h2>
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
        </div>
    );
}
