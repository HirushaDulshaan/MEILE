"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Users, DollarSign, Package, TrendingUp, Zap, Star } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from "next/link";

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        fetch("/api/admin/stats")
            .then(res => res.json())
            .then(data => setStats(data));
    }, []);

    const cards = [
        { title: "Total Revenue", value: `LKR ${stats?.revenue.toLocaleString()}`, icon: <DollarSign className="text-emerald-600" />, color: "bg-emerald-50" },
        { title: "Total Orders", value: stats?.orders, icon: <ShoppingBag className="text-blue-600" />, color: "bg-blue-50" },
        { title: "Customers", value: stats?.users, icon: <Users className="text-purple-600" />, color: "bg-purple-50" },
        { title: "Products", value: stats?.products, icon: <Package className="text-orange-600" />, color: "bg-orange-50" },
    ];

    return (
        <main className="p-8 bg-[#F8FAFC] min-h-screen font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Admin <span className="text-blue-600">Overview</span></h1>
                    <p className="text-slate-500 font-medium">Visualizing your business growth over time.</p>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {cards.map((card, i) => (
                        <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:translate-y-[-5px]">
                            <div className={`w-12 h-12 ${card.color} rounded-2xl flex items-center justify-center mb-4 shadow-inner`}>
                                {card.icon}
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{card.title}</p>
                            <h3 className="text-2xl font-black text-slate-900 mt-1">{card.value || "0"}</h3>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT: Revenue Chart ✅ */}
                    <div className="lg:col-span-8">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-full">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                    <TrendingUp className="text-blue-600" /> Revenue Growth
                                </h2>
                                <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-50 px-3 py-1 rounded-full">Last 7 Days</span>
                            </div>

                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stats?.chartData}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={10} />
                                        <YAxis hide />
                                        <Tooltip
                                            contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '15px'}}
                                            labelStyle={{fontWeight: '900', color: '#1e293b', marginBottom: '5px', textTransform: 'uppercase', fontSize: '10px'}}
                                        />
                                        <Area type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Quick Summary */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-full">
                            <h2 className="text-lg font-black text-slate-900 uppercase mb-6 flex items-center gap-2">
                                <Zap size={20} className="text-amber-500" /> System Highlights
                            </h2>
                            <div className="space-y-4">
                                <div className="p-6 bg-slate-900 rounded-[2rem] text-white shadow-xl shadow-slate-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Star size={14} className="text-amber-400 fill-amber-400" />
                                        <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">Performance</p>
                                    </div>
                                    <h4 className="text-lg font-bold leading-tight">Sales increasing by 15% this week</h4>
                                    <Link href="/admin/orders" className="text-blue-400 text-[10px] font-black uppercase mt-4 block hover:underline">View Sales Report</Link>
                                </div>

                                <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100">
                                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Active Store</p>
                                    <p className="text-sm font-bold text-blue-900 mt-1">Status: Operational</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}