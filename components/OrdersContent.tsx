"use client";

import React, { useEffect, useState } from "react";
import { Package, ChevronRight, Clock, CheckCircle2, Loader2, ChevronDown, MapPin, Phone, CreditCard } from "lucide-react";
import { useUserStore } from "@/app/hooks/use-user-store";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Download } from "lucide-react";

export default function OrdersContent() {
    const { user } = useUserStore();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState<number | null>(null); // ✅ විස්තර පෙන්වන ඕඩර් එකේ ID එක තියාගන්න

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user?.id) return;
            try {
                const response = await fetch(`/api/orders/${user.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user?.id]);

    const toggleDetails = (id: number) => {
        setExpandedOrder(expandedOrder === id ? null : id);
    };




    const downloadInvoice = (order: any) => {
        const doc = new jsPDF();

        // 1. Header - Company Details
        doc.setFontSize(22);
        doc.setTextColor(15, 23, 42); // Slate 900
        doc.text("MEILI CLOTHING", 14, 20);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("Premium Fashion Store", 14, 26);
        doc.text("Colombo, Sri Lanka", 14, 31);
        doc.text("Contact: +94 77 123 4567", 14, 36);

        // 2. Invoice Info
        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.text(`INVOICE: #ORD-${order.id}`, 140, 20);
        doc.setFontSize(10);
        doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 140, 26);
        doc.text(`Status: ${order.status}`, 140, 31);

        // 3. Customer Details
        doc.setFontSize(12);
        doc.text("Bill To:", 14, 50);
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`${user?.firstName} ${user?.lastName}`, 14, 56);
        doc.text(order.address, 14, 61, { maxWidth: 80 });
        doc.text(`Phone: ${order.contact}`, 14, 71);

        // 4. Items Table
        const tableRows = order.items.map((item: any) => [
            item.productName,
            `${item.quantity}`,
            `LKR ${item.price.toLocaleString()}`,
            `LKR ${(item.price * item.quantity).toLocaleString()}`
        ]);

        autoTable(doc, {
            startY: 80,
            head: [['Product Name', 'Qty', 'Unit Price', 'Total']],
            body: tableRows,
            theme: 'grid',
            headStyles: { fillColor: [15, 23, 42], fontSize: 10, fontStyle: 'bold' },
            styles: { fontSize: 9 },
            margin: { left: 14, right: 14 }
        });

        // 5. Final Total
        const finalY = (doc as any).lastAutoTable.finalY + 10;
        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.text(`Grand Total: LKR ${order.totalAmount.toLocaleString()}`, 140, finalY);

        // 6. Footer
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text("Thank you for shopping with Meili!", 105, finalY + 30, { align: "center" });

        // Download PDF
        doc.save(`Invoice_ORD_${order.id}.pdf`);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Fetching Your Orders...</p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between mb-8 border-b pb-4">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Order History</h2>
                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">
                    {orders.length} Orders
                </span>
            </div>

            {orders.length > 0 ? (
                <div className="space-y-4">
                    {orders.map((order: any) => (
                        <div key={order.id} className="overflow-hidden border border-slate-100 rounded-[2rem] transition-all duration-300 shadow-sm hover:shadow-md">
                            <div
                                className={`p-5 flex flex-col md:flex-row items-center gap-6 cursor-pointer transition-colors ${expandedOrder === order.id ? "bg-white" : "bg-slate-50 hover:bg-white"}`}
                                onClick={() => toggleDetails(order.id)}
                            >
                                {/* Product Preview Image */}
                                <div className="w-16 h-20 bg-white rounded-2xl overflow-hidden shrink-0 shadow-sm flex items-center justify-center">
                                    {order.items[0]?.productImage ? (
                                        <img src={order.items[0].productImage} className="w-full h-full object-cover" alt="Order" />
                                    ) : (
                                        <Package size={20} className="text-slate-200" />
                                    )}
                                </div>

                                {/* Order Basic Details */}
                                <div className="flex-1 text-center md:text-left space-y-1">
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <span className="text-xs font-black text-slate-900 uppercase tracking-widest">ORD-{order.id}</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-center md:justify-start gap-2">
                                        {order.status === "Delivered" ? (
                                            <div className="flex items-center gap-1 text-[9px] font-black text-green-600 uppercase bg-green-50 px-2 py-0.5 rounded-md">
                                                <CheckCircle2 size={10} /> Delivered
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1 text-[9px] font-black text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded-md animate-pulse">
                                                <Clock size={10} /> {order.status}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Price & Action */}
                                <div className="flex flex-col items-center md:items-end gap-1">
                                    <span className="text-sm font-black text-slate-900">LKR {order.totalAmount.toLocaleString()}</span>
                                    <div className="flex items-center gap-1 text-[10px] font-black uppercase text-blue-600">
                                        {expandedOrder === order.id ? "Hide" : "View"} Details
                                        {expandedOrder === order.id ? <ChevronDown size={14} className="rotate-180 transition-transform" /> : <ChevronRight size={14} />}
                                    </div>
                                </div>
                            </div>

                            {/* ✅ EXPANDED DETAILS SECTION */}
                            {expandedOrder === order.id && (
                                <div className="p-8 bg-white border-t border-slate-50 animate-in slide-in-from-top-2 duration-300">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                                        {/* Left: Items List */}
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Items Summary</h4>
                                            {order.items.map((item: any, idx: number) => (
                                                <div key={idx} className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                                                    <div className="w-12 h-14 rounded-xl overflow-hidden bg-white border border-slate-100">
                                                        <img src={item.productImage} className="w-full h-full object-cover" alt="" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-black text-slate-900 truncate uppercase tracking-tight">{item.productName}</p>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase">{item.quantity} x LKR {item.price.toLocaleString()}</p>
                                                    </div>
                                                    <p className="text-xs font-black text-slate-900">LKR {(item.price * item.quantity).toLocaleString()}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Right: Shipping & Summary */}
                                        <div className="space-y-6 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                                            <div className="space-y-3">
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Shipping Details</h4>

                                                <div className="flex items-start gap-3">
                                                    <MapPin size={16} className="text-blue-600 mt-0.5" />
                                                    <p className="text-xs font-bold text-slate-600 leading-relaxed uppercase">{order.address}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Phone size={16} className="text-blue-600" />
                                                    <p className="text-xs font-bold text-slate-600 uppercase">{order.contact}</p>
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-slate-200 space-y-2">
                                                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    <span>Total Amount</span>
                                                    <span className="text-sm font-black text-blue-600">LKR {order.totalAmount.toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase bg-white w-fit px-3 py-1 rounded-full border border-slate-100">
                                                    <CreditCard size={12} /> Paid via Stripe
                                                </div>
                                            </div>
                                        </div>
                                        {/* Shipping Details එකට යටින් හෝ පසෙකින් මේ බටන් එක දාන්න */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation(); // Card එක collapse වෙන්නේ නැති වෙන්න
                                                downloadInvoice(order);
                                            }}
                                            className="mt-4 w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-200"
                                        >
                                            <Download size={14} /> Download Invoice PDF
                                        </button>

                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Package size={40} className="text-slate-200 mb-4" />
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">No Orders Found</h3>
                </div>
            )}
        </div>
    );
}