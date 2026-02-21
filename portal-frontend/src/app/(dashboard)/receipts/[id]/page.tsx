"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Receipt, receiptService } from "@/services/receiptService";
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

    useEffect(() => {
        // Add print styles
        const style = document.createElement('style');
        style.textContent = `
            @media print {
                body * {
                    visibility: hidden;
                }

                .print-only, .print-only * {
                    visibility: visible;
                }

                .print-only {
                    position: static !important;   /* jangan absolute */
                    width: 100% !important;
                    margin: 0 !important;
                    padding: 0 !important;
                }

                .no-print {
                    display: none !important;
                }

                html, body {
                    margin: 0 !important;
                    padding: 0 !important;
                    height: auto !important;
                }

                @page {
                    margin: 10mm;
                }
            }
            
        `;
        document.head.appendChild(style);
        
        return () => {
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        };
    }, []);

    const fetchReceipt = async () => {
        try {
            // Get table info from localStorage or URL params if available
            const urlParams = new URLSearchParams(window.location.search);
            const tableSuffix = urlParams.get('table') || localStorage.getItem('receiptTable_' + id) || undefined;
            
            const data = await receiptService.getById(Number(id), tableSuffix);
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
            // Get table info from localStorage or URL params if available
            const urlParams = new URLSearchParams(window.location.search);
            const tableSuffix = urlParams.get('table') || localStorage.getItem('receiptTable_' + id) || undefined;
            
            await receiptService.delete(Number(id), tableSuffix);
            router.push("/receipts");
        } catch (error) {
            console.error("Failed to delete receipt", error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!receipt) return <div>Receipt not found</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="no-print flex justify-between items-center">
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

            <div className="print-only grid grid-cols-1 md:grid-cols-3 gap-6">
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
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">
                                                {item.name}
                                                {item.is_free_item && (
                                                    <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                                        Free Item
                                                    </span>
                                                )}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {item.quantity} x {new Intl.NumberFormat("id-ID", {
                                                    style: "currency",
                                                    currency: "IDR",
                                                }).format(Number(item.price))}
                                                {item.is_free_item && (
                                                    <span className="ml-2 text-green-600 text-xs">(Free)</span>
                                                )}
                                            </p>
                                        </div>
                                        <div className="font-semibold text-gray-900 text-right">
                                            <p className="font-semibold text-gray-900 text-right">
                                                {new Intl.NumberFormat("id-ID", {
                                                    style: "currency",
                                                    currency: "IDR",
                                                }).format(Number(item.total))}
                                            </p>
                                            {item.is_free_item && (
                                                <div className="text-xs text-green-600 mt-1">Free</div>
                                            )}
                                        </div>
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
                                <span>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(Number(receipt.total_amount))}</span>
                            </div>
                            <div className="flex justify-between text-lg font-semibold text-blue-600">
                                <span>Paid</span>
                                <span>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(Number(receipt.payable_amount))}</span>
                            </div>
                            {Number(receipt.change_amount) > 0 && (
                                <div className="flex justify-between text-lg font-semibold text-green-600">
                                    <span>Change</span>
                                    <span>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(Number(receipt.change_amount))}</span>
                                </div>
                            )}
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
                        <div className="no-print bg-amber-50 rounded-xl border border-amber-100 p-6">
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
