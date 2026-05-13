"use client";

import React, { useEffect, useState } from "react";
import { Package, ChevronRight, Clock, CheckCircle2, Loader2, ChevronDown, MapPin, Phone, CreditCard, ChevronLeft, Download } from "lucide-react";
import { useUserStore } from "@/app/hooks/use-user-store";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function OrdersContent() {
    const { user } = useUserStore();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;

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

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(orders.length / ordersPerPage);

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        setExpandedOrder(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const downloadInvoice = (order: any) => {
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
                    {orders.length} Total Orders
                </span>
            </div>

            {orders.length > 0 ? (
                <div className="space-y-4">
                    {currentOrders.map((order: any) => (
                        <div key={order.id} className="overflow-hidden border border-slate-100 rounded-[2rem] transition-all duration-300 shadow-sm hover:shadow-md bg-white">
                            <div
                                className={`p-5 flex flex-col md:flex-row items-center gap-6 cursor-pointer transition-colors ${expandedOrder === order.id ? "bg-white" : "bg-slate-50 hover:bg-white"}`}
                                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                            >
                                {/* Preview & Info */}
                                <div className="w-16 h-20 bg-white rounded-2xl overflow-hidden shrink-0 shadow-sm border border-slate-100">
                                    <img src={order.items[0]?.productImage} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 text-center md:text-left space-y-1">
                                    <span className="text-xs font-black text-slate-900 uppercase tracking-widest">ORD-{order.id}</span>
                                    <div className="text-[9px] font-black text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded-md w-fit mx-auto md:mx-0">
                                        {order.status}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-slate-900">LKR {order.totalAmount.toLocaleString()}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">View Details</p>
                                </div>
                            </div>

                            {expandedOrder === order.id && (
                                <div className="p-8 bg-white border-t border-slate-50 animate-in slide-in-from-top-2 duration-300">
                                    {/* ... (Detailed Info) ... */}
                                    <button onClick={() => downloadInvoice(order)} className="w-full bg-slate-900 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all">
                                        Download Invoice
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* --- PAGINATION BUTTONS --- */}
                    {orders.length > ordersPerPage && (
                        <div className="flex items-center justify-center gap-2 pt-10">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 rounded-xl border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-all"
                            >
                                <ChevronLeft size={18} />
                            </button>

                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => paginate(index + 1)}
                                    className={`w-10 h-10 rounded-xl font-black text-[10px] transition-all ${
                                        currentPage === index + 1
                                            ? "bg-slate-900 text-white shadow-lg"
                                            : "bg-white text-slate-400 border border-slate-100 hover:bg-slate-50"
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-xl border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-all"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    )}
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