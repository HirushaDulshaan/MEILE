"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { User as UserIcon, Package, Settings, ChevronRight, LogOut, Heart } from "lucide-react";
import { useUserStore } from "@/app/hooks/use-user-store";
import ProfileContent from "@/components/ProfileContent";
import OrdersContent from "@/components/OrdersContent";
import WishlistContent from "@/components/WishlistContent";
import SettingsContent from "@/components/SettingsContent";

function ProfilePageContent() {
    const { user } = useUserStore();
    const [activeTab, setActiveTab] = useState("profile");
    const searchParams = useSearchParams();

    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab === "orders") setActiveTab("orders");
        else if (tab === "profile") setActiveTab("profile");
        else if (tab === "wishlist") setActiveTab("wishlist");
    }, [searchParams]);

    const menuItems = [
        { id: "profile", label: "My Profile", icon: <UserIcon size={18} /> },
        { id: "orders", label: "My Orders", icon: <Package size={18} /> },
        { id: "wishlist", label: "My Wishlist", icon: <Heart size={18} /> },
        { id: "settings", label: "Settings", icon: <Settings size={18} /> },
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT SIDEBAR */}
                <aside className="lg:col-span-3 space-y-4">
                    <div className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm mb-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-100">
                            {user?.firstName?.charAt(0) || "U"}
                        </div>
                        <div className="min-w-0">
                            <h2 className="font-black text-slate-900 text-sm uppercase truncate">
                                {user?.firstName} {user?.lastName}
                            </h2>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Premium Member</p>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                                    activeTab === item.id
                                        ? "bg-slate-900 text-white shadow-xl shadow-slate-200 translate-x-2" 
                                        : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`${activeTab === item.id ? "text-blue-400" : "text-slate-400"}`}>
                                        {item.icon}
                                    </span>
                                    <span className="uppercase tracking-widest text-[10px] font-black">{item.label}</span>
                                </div>
                                <ChevronRight size={14} className={activeTab === item.id ? "opacity-100" : "opacity-0"} />
                            </button>
                        ))}

                        <button className="w-full flex items-center gap-3 p-4 rounded-2xl text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all mt-10 group">
                            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> Logout
                        </button>
                    </nav>
                </aside>

                <section className="lg:col-span-9 bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-sm min-h-[600px] relative">
                    {activeTab === "profile" && <ProfileContent />}
                    {activeTab === "orders" && <OrdersContent />}
                    {activeTab === "wishlist" && <WishlistContent />}
                    {activeTab === "settings" && <SettingsContent />}


                </section>
            </div>
        </div>
    );
}

export default function ProfilePage() {
    return (
        <Suspense fallback={
            <div className="h-screen flex items-center justify-center uppercase font-black text-[10px] tracking-widest text-slate-400">
                Loading Profile...
            </div>
        }>
            <ProfilePageContent />
        </Suspense>
    );
}