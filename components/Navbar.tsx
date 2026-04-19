"use client";

import { useState } from "react";
import Link from "next/link";
import { User, LogOut, ShoppingCart, Search, X, Menu } from "lucide-react"; // ✅ Menu icon එක ගත්තා
import SearchBar from "@/components/SearchBar";
import { useUserStore } from "@/app/hooks/use-user-store";
import { useRouter } from "next/navigation";

const Navbar = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // ✅ Mobile menu state එක
    const { user, logout } = useUserStore();
    const router = useRouter();

    const handleProfileClick = () => {
        setIsMenuOpen(false); // Menu එක වහන්න
        if (user) {
            router.push("/profile");
        } else {
            router.push("/login");
        }
    };

    return (
        <div className="relative w-full z-[100]">
            <nav className="bg-black px-6 py-5 shadow-md uppercase tracking-widest text-white relative z-50 border-b border-white/5">
                <div className="max-w-7xl mx-auto flex justify-between items-center">

                    {/* MOBILE MENU BUTTON - පේන්නේ mobile වලදී විතරයි */}
                    <button
                        className="md:hidden p-1 hover:text-blue-500 transition"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {/* LOGO */}
                    <Link href="/dees" className="text-xl md:text-2xl font-black hover:opacity-80 transition tracking-tighter">
                        M E I L I
                    </Link>

                    {/* MAIN LINKS - Desktop Only */}
                    {!isSearchOpen && (
                        <div className="hidden md:flex items-center gap-10 text-[11px] font-black animate-in fade-in duration-500">
                            <Link href="/mens-wear" className="hover:text-blue-500 transition tracking-[0.2em]">MEN</Link>
                            <Link href="/womens-wear" className="hover:text-blue-500 transition tracking-[0.2em]">WOMEN</Link>
                        </div>
                    )}

                    {/* ACTIONS */}
                    <div className="flex items-center gap-4 md:gap-6">
                        {!isSearchOpen && (
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="hover:text-blue-500 transition p-1"
                            >
                                <Search size={20}/>
                            </button>
                        )}

                        <Link href="/cart" className="hover:text-blue-500 transition relative">
                            <ShoppingCart size={20}/>
                        </Link>

                        <div className="hidden md:flex items-center gap-5 border-l border-white/20 pl-5 ml-2">
                            <button
                                onClick={handleProfileClick}
                                className="hover:text-blue-500 transition flex items-center gap-2 group"
                            >
                                <User size={20}/>
                                {user?.firstName && (
                                    <span className="text-[10px] font-black uppercase tracking-widest transition group-hover:text-blue-500">
                                        {user.firstName}
                                    </span>
                                )}
                            </button>

                            {user && (
                                <button
                                    onClick={() => {
                                        logout();
                                        router.push("/login");
                                    }}
                                    className="hover:text-red-500 transition ml-2 p-1"
                                    title="Logout"
                                >
                                    <LogOut size={18}/>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* SEARCH BAR OVERLAY */}
                {isSearchOpen && (
                    <div className="absolute inset-0 bg-black z-[60] flex items-center px-6 animate-in slide-in-from-top duration-300">
                        <div className="max-w-7xl mx-auto w-full flex justify-between items-center gap-4">
                            <SearchBar />
                            <button onClick={() => setIsSearchOpen(false)} className="p-2 text-white">
                                <X size={24} />
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* ✅ MOBILE DRAWER - Mobile එකේ Menu එක click කළාම එන එක */}
            {isMenuOpen && (
                <div className="fixed inset-0 top-[72px] bg-black/95 z-40 md:hidden animate-in slide-in-from-left duration-300 backdrop-blur-md">
                    <div className="flex flex-col p-10 gap-8">
                        <Link onClick={() => setIsMenuOpen(false)} href="/mens-wear" className="text-2xl font-black tracking-widest border-b border-white/10 pb-4">MEN</Link>
                        <Link onClick={() => setIsMenuOpen(false)} href="/womens-wear" className="text-2xl font-black tracking-widest border-b border-white/10 pb-4">WOMEN</Link>

                        <div className="mt-4 flex flex-col gap-6">
                            <button onClick={handleProfileClick} className="flex items-center gap-4 text-sm font-bold tracking-[0.2em] text-blue-500">
                                <User size={20} /> {user ? `PROFILE (${user.firstName})` : "LOGIN / REGISTER"}
                            </button>

                            {user && (
                                <button
                                    onClick={() => { logout(); router.push("/login"); setIsMenuOpen(false); }}
                                    className="flex items-center gap-4 text-sm font-bold tracking-[0.2em] text-red-500"
                                >
                                    <LogOut size={20} /> LOGOUT
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;