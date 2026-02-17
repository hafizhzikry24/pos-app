"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Receipt, receiptService } from "@/services/receipt";
import { ArrowLeft, Printer, Trash2, Calendar, User, MapPin, Calculator } from "lucide-react";
import Link from "next/link";

export default function ReceiptDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [receipt, setReceipt] = useState<Receipt | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchReceipt(Number(params.id));
        }
    }, [params.id]);

    const fetchReceipt = async (id: number) => {
        try {
            const response = await receiptService.getById(id);
            if (response.success) {
                setReceipt(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch receipt detail", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (receipt && confirm("Are you sure you want to delete this receipt?")) {
            try {
                await receiptService.delete(receipt.id);
                router.push("/receipts");
            } catch (error) {
                console.error("Failed to delete receipt", error);
                alert("Failed to delete receipt");
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!receipt) return <div>Receipt not found.</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link
                        href="/receipts"
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </Link>
                    <h2 className="text-2xl font-bold text-gray-800">Receipt Details: {receipt.number}</h2>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => window.print()}
                        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors"
                    >
                        <Printer size={18} />
                        Print
                    </button>
                    <button
                        onClick={handleDelete}
                        className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-100 transition-colors"
                    >
                        <Trash2 size={18} />
                        Delete
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Info Cards */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="space-y-1">
                                <div className="flex items-center gap-1 text-xs text-gray-400 font-medium uppercase tracking-wider">
                                    <Calendar size={14} /> Date
                                </div>
                                <div className="text-sm font-semibold text-gray-900">
                                    {new Date(receipt.created_at).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric"
                                    })}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {new Date(receipt.created_at).toLocaleTimeString("id-ID", {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-1 text-xs text-gray-400 font-medium uppercase tracking-wider">
                                    <MapPin size={14} /> Location
                                </div>
                                <div className="text-sm font-semibold text-gray-900">{receipt.location?.name || 'N/A'}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-1 text-xs text-gray-400 font-medium uppercase tracking-wider">
                                    <User size={14} /> Cashier
                                </div>
                                <div className="text-sm font-semibold text-gray-900">{receipt.cashier?.name || 'N/A'}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-1 text-xs text-gray-400 font-medium uppercase tracking-wider">
                                    <Calculator size={14} /> Payment
                                </div>
                                <div className="text-sm font-semibold text-gray-900 uppercase">{receipt.payment_method}</div>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
                            <h3 className="font-semibold text-gray-800">Line Items</h3>
                        </div>
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3">Item Name</th>
                                    <th className="px-6 py-3 text-center">Qty</th>
                                    <th className="px-6 py-3 text-right">Price</th>
                                    <th className="px-6 py-3 text-right">Discount</th>
                                    <th className="px-6 py-3 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {receipt.receipt_items?.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                                        <td className="px-6 py-4 text-center">{item.quantity}</td>
                                        <td className="px-6 py-4 text-right">
                                            {new Intl.NumberFormat("id-ID").format(Number(item.price))}
                                        </td>
                                        <td className="px-6 py-4 text-right text-red-500">
                                            -{new Intl.NumberFormat("id-ID").format(Number(item.discount))}
                                        </td>
                                        <td className="px-6 py-4 text-right font-semibold text-gray-900">
                                            {new Intl.NumberFormat("id-ID").format(Number(item.total))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Summary Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="font-bold text-gray-800 mb-4 border-b pb-4">Transaction Summary</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="font-medium">Rp {new Intl.NumberFormat("id-ID").format(Number(receipt.total_amount))}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Tax</span>
                                <span className="font-medium">Rp {new Intl.NumberFormat("id-ID").format(Number(receipt.tax_amount))}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Discount</span>
                                <span className="font-medium text-red-500">-Rp {new Intl.NumberFormat("id-ID").format(Number(receipt.discount_amount))}</span>
                            </div>
                            <div className="pt-4 border-t border-dashed flex justify-between items-center">
                                <span className="text-base font-bold text-gray-800">Total Payable</span>
                                <span className="text-xl font-black text-blue-600">
                                    Rp {new Intl.NumberFormat("id-ID").format(Number(receipt.payable_amount))}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                        <h4 className="text-xs font-bold text-blue-800 uppercase tracking-widest mb-2">Customer Info</h4>
                        {receipt.customer ? (
                            <div className="space-y-1">
                                <div className="font-bold text-blue-900">{receipt.customer.name}</div>
                                <div className="text-sm text-blue-700">{receipt.customer.phone_number}</div>
                                <div className="text-sm text-blue-700">{receipt.customer.address}</div>
                            </div>
                        ) : (
                            <div className="text-sm text-blue-700 italic">No member associated (Guest Transaction)</div>
                        )}
                    </div>

                    {receipt.note && (
                        <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
                            <h4 className="text-xs font-bold text-yellow-800 uppercase tracking-widest mb-1">Notes</h4>
                            <p className="text-sm text-yellow-800">{receipt.note}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
