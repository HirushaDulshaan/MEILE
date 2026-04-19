"use client";

import { useEffect, useState } from "react";
import {
    Search,
    Eye,
    Truck,
    CheckCircle2,
    Clock,
    XCircle,
    User,
    MapPin,
    Phone,
    ChevronLeft,
    ChevronRight,
    ReceiptText // ✅ අයිකන් එක මෙතනට එකතු කළා
} from "lucide-react";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/admin/orders");
            const data = await res.json();
            setOrders(data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId: number, newStatus: string) => {
        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: "PATCH",
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                alert("Order Status Updated! ✅");
                fetchOrders();
                setSelectedOrder(null);
            }
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    // Filter Logic
    const filteredOrders = orders.filter(order =>
        order.id.toString().includes(searchTerm) ||
        order.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination Logic
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Processing": return <Clock size={16} className="text-amber-500" />;
            case "Shipped": return <Truck size={16} className="text-blue-500" />;
            case "Delivered": return <CheckCircle2 size={16} className="text-emerald-500" />;
            default: return <XCircle size={16} className="text-rose-500" />;
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Orders...</p>
            </div>
        </div>
    );

    return (
        <main className="p-6 bg-[#F8FAFC] min-h-screen font-sans">
            <div className="max-w-[1600px] mx-auto">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Order <span className="text-blue-600">Management</span></h1>
                        <p className="text-slate-500 text-sm font-medium">Tracking {filteredOrders.length} total orders</p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search ID or Customer..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm font-medium shadow-sm"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT: Orders Table */}
                    <div className={`transition-all duration-500 ${selectedOrder ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                            <div className="max-h-[650px] overflow-y-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="sticky top-0 bg-white z-20 shadow-sm border-b border-slate-100">
                                    <tr>
                                        <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                                        <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                                        <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                        <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                        <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                        <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Action</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                    {currentOrders.map((order) => (
                                        <tr
                                            key={order.id}
                                            className={`hover:bg-blue-50/30 transition-colors cursor-pointer ${selectedOrder?.id === order.id ? 'bg-blue-50/50' : ''}`}
                                            onClick={() => setSelectedOrder(order)}
                                        >
                                            <td className="p-5 font-bold text-slate-900 text-sm">#{order.id}</td>
                                            <td className="p-5 text-sm font-semibold text-slate-700">{order.user.firstName} {order.user.lastName}</td>
                                            <td className="p-5 text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td className="p-5 font-black text-slate-900 text-sm">LKR {order.totalAmount.toLocaleString()}</td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 w-fit">
                                                    {getStatusIcon(order.status)}
                                                    <span className="text-[9px] font-black uppercase text-slate-600">{order.status}</span>
                                                </div>
                                            </td>
                                            <td className="p-5 text-center">
                                                <Eye size={18} className="mx-auto text-slate-300 hover:text-blue-600 transition-colors" />
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Controls */}
                            <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Page {currentPage} of {totalPages || 1}
                                </span>
                                <div className="flex gap-2">
                                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 bg-white rounded-xl border border-slate-200 disabled:opacity-30 hover:shadow-md transition-all">
                                        <ChevronLeft size={18} />
                                    </button>
                                    <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)} className="p-2 bg-white rounded-xl border border-slate-200 disabled:opacity-30 hover:shadow-md transition-all">
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Detail View Sidebar */}
                    {selectedOrder && (
                        <div className="lg:col-span-5 animate-in slide-in-from-right-4 duration-500">
                            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8 sticky top-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Order Details</h2>
                                    <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-rose-500 transition-colors">
                                        <XCircle size={24} />
                                    </button>
                                </div>

                                <div className="space-y-6 mb-8 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                                    {/* Customer Name */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm"><User size={20}/></div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase mb-0.5">Customer Name</p>
                                            <p className="text-sm font-bold text-slate-800">{selectedOrder.user.firstName} {selectedOrder.user.lastName}</p>
                                            <p className="text-[11px] text-slate-500 font-medium">{selectedOrder.user.email}</p>
                                        </div>
                                    </div>

                                    {/* Shipping Address */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 shadow-sm"><MapPin size={20}/></div>
                                        <div>
                                            <p className="text-[10px] font-black text-orange-400 uppercase mb-0.5">Shipping Address (Delivery)</p>
                                            <p className="text-sm font-bold text-slate-800 leading-relaxed">{selectedOrder.address}</p>
                                        </div>
                                    </div>

                                    {/* Billing Address ✅ */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm"><ReceiptText size={20}/></div>
                                        <div>
                                            <p className="text-[10px] font-black text-emerald-600 uppercase mb-0.5">Billing Information</p>
                                            <p className="text-sm font-bold text-slate-800 leading-relaxed">{selectedOrder.billingAddress || "Same as shipping"}</p>
                                        </div>
                                    </div>

                                    {/* Contact Number */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 shadow-sm"><Phone size={20}/></div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase mb-0.5">Customer Phone</p>
                                            <p className="text-sm font-bold text-slate-800">{selectedOrder.contact}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-slate-100 w-full mb-8" />

                                {/* Order Items List ✅ */}
                                <div className="space-y-4 mb-8">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Items Purchased</p>
                                    {selectedOrder.items.map((item: any) => (
                                        <div key={item.id} className="flex items-center gap-4 group">
                                            <div className="w-16 h-20 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 shrink-0 shadow-sm">
                                                <img src={item.productImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-slate-900 truncate">{item.productName}</p>
                                                <p className="text-[10px] text-slate-500 font-medium">LKR {item.price.toLocaleString()} × {item.quantity}</p>
                                            </div>
                                            <div className="text-xs font-black text-slate-900">
                                                LKR {(item.price * item.quantity).toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Update Order Progress</p>
                                    <select
                                        value={selectedOrder.status}
                                        onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                                        className="w-full p-4 bg-slate-950 text-white rounded-2xl font-bold text-sm focus:ring-4 focus:ring-blue-500/20 transition-all cursor-pointer shadow-lg"
                                    >
                                        <option value="Processing">⏳ Processing</option>
                                        <option value="Shipped">🚚 Shipped</option>
                                        <option value="Delivered">✅ Delivered</option>
                                        <option value="Cancelled">❌ Cancelled</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}