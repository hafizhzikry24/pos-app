"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Receipt, receiptService } from "@/services/receipt";
import { ArrowLeft, Printer, Trash2, Calendar, User, CreditCard, Tag, FileText } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ReceiptDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [receipt, setReceipt] = useState<Receipt | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchReceipt();
        }
    }, [id]);

    const fetchReceipt = async () => {
        try {
            const data = await receiptService.getById(Number(id));
            setReceipt(data);
        } catch (error) {
            console.error("Failed to fetch receipt", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this receipt?")) return;
        try {
            await receiptService.delete(Number(id));
            router.push("/receipts");
        } catch (error) {
            console.error("Failed to delete receipt", error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!receipt) return <div>Receipt not found</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div className="flex justify-between items-center">
                {/* <Link
                    href="/receipts"
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Receipts
                </Link> */}
                <div className="flex gap-2">
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Printer size={18} />
                        Print
                    </button>
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                        <Trash2 size={18} />
                        Delete
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    {/* Receipt Header Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-1">Receipt #{receipt.number}</h1>
                                <div className="flex items-center gap-2 text-gray-500 text-sm">
                                    <Calendar size={14} />
                                    {new Date(receipt.created_at).toLocaleString("id-ID")}
                                </div>
                            </div>
                            <span
                                className={cn(
                                    "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                                    receipt.status === 'completed'
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                )}
                            >
                                {receipt.status}
                            </span>
                        </div>

                        <div className="border-t border-gray-100 pt-6">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FileText size={18} className="text-gray-400" />
                                Items
                            </h3>
                            <div className="space-y-4">
                                {receipt.receipt_items?.map((item) => (
                                    <div key={item.id} className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium text-gray-900">{item.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {item.quantity} x {new Intl.NumberFormat("id-ID", {
                                                    style: "currency",
                                                    currency: "IDR",
                                                }).format(Number(item.price))}
                                            </p>
                                        </div>
                                        <p className="font-semibold text-gray-900 text-right">
                                            {new Intl.NumberFormat("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                            }).format(Number(item.total))}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-gray-100 mt-6 pt-6 space-y-3">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(Number(receipt.total_amount))}</span>
                            </div>
                            {Number(receipt.discount_amount) > 0 && (
                                <div className="flex justify-between text-red-600">
                                    <span>Discount</span>
                                    <span>-{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(Number(receipt.discount_amount))}</span>
                                </div>
                            )}
                            {Number(receipt.tax_amount) > 0 && (
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax</span>
                                    <span>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(Number(receipt.tax_amount))}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-100">
                                <span>Total</span>
                                <span>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(Number(receipt.payable_amount))}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <User size={18} className="text-gray-400" />
                            Customer Information
                        </h3>
                        {receipt.customer ? (
                            <div className="space-y-1">
                                <p className="font-medium text-gray-900">{receipt.customer.name}</p>
                                <p className="text-sm text-gray-500">{receipt.customer.phone_number}</p>
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">Guest Customer</p>
                        )}
                    </div>

                    {/* Transaction Details */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <CreditCard size={18} className="text-gray-400" />
                            Transaction Details
                        </h3>
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Payment Method</span>
                                <span className="font-medium text-gray-900 uppercase">{receipt.payment_method}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Cashier</span>
                                <span className="font-medium text-gray-900">{receipt.cashier?.name || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Location</span>
                                <span className="font-medium text-gray-900">{receipt.location?.name || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    {receipt.note && (
                        <div className="bg-amber-50 rounded-xl border border-amber-100 p-6">
                            <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                                <Tag size={18} className="text-amber-500" />
                                Notes
                            </h3>
                            <p className="text-amber-800 text-sm whitespace-pre-wrap">{receipt.note}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
