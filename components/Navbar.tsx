"use client";

import { useState } from "react";
import Link from "next/link";
import { User, LogOut, ShoppingCart, Search, X, Menu } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import { useUserStore } from "@/app/hooks/use-user-store";
import { useRouter } from "next/navigation";

const Navbar = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout } = useUserStore();
    const router = useRouter();

    const handleProfileClick = () => {
        setIsMenuOpen(false);
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

                    <button
                        className="md:hidden p-1 hover:text-blue-500 transition"
                        onClick={() => setIsMenuOpen(true)}
                    >
                        <Menu size={24} />
                    </button>

                    {/* LOGO */}
                    <Link href="/dees" className="text-xl md:text-2xl font-black hover:opacity-80 transition tracking-tighter">
                        M E I L I
                    </Link>

                    {/* MAIN LINKS - Desktop */}
                    {!isSearchOpen && (
                        <div className="hidden md:flex items-center gap-10 text-[11px] font-black animate-in fade-in duration-500">
                            <Link href="/mens-wear" className="hover:text-blue-500 transition tracking-[0.2em]">MEN</Link>
                            <Link href="/womens-wear" className="hover:text-blue-500 transition tracking-[0.2em]">WOMEN</Link>
                        </div>
                    )}

                    {/* ACTIONS */}
                    <div className="flex items-center gap-4 md:gap-6">
                        {!isSearchOpen && (
                            <button onClick={() => setIsSearchOpen(true)} className="hover:text-blue-500 transition p-1">
                                <Search size={20}/>
                            </button>
                        )}

                        <Link href="/cart" className="hover:text-blue-500 transition relative">
                            <ShoppingCart size={20}/>
                        </Link>

                        <div className="hidden md:flex items-center gap-5 border-l border-white/20 pl-5 ml-2">
                            <button onClick={handleProfileClick} className="hover:text-blue-500 transition flex items-center gap-2 group">
                                <User size={20}/>
                                {user?.firstName && (
                                    <span className="text-[10px] font-black uppercase tracking-widest transition group-hover:text-blue-500">
                                        {user.firstName}
                                    </span>
                                )}
                            </button>

                            {user && (
                                <button
                                    onClick={() => { logout(); router.push("/login"); }}
                                    className="hover:text-red-500 transition ml-2 p-1"
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


            {isMenuOpen && (
                <div className="fixed inset-0 bg-black z-[110] md:hidden flex flex-col animate-in slide-in-from-left duration-300">
                    <div className="flex justify-between items-center px-6 py-5 border-b border-white/10">
                        <button onClick={() => setIsMenuOpen(false)} className="p-1 text-white">
                            <X size={26} />
                        </button>

                        <span className="text-xl font-black tracking-tighter text-white">M E I L I</span>

                        <div className="flex gap-4">
                            <button onClick={() => { setIsSearchOpen(true); setIsMenuOpen(false); }}>
                                <Search size={22} className="text-white" />
                            </button>
                            <Link href="/cart" onClick={() => setIsMenuOpen(false)}>
                                <ShoppingCart size={22} className="text-white" />
                            </Link>
                        </div>
                    </div>

                    {/* Menu Content */}
                    <div className="flex flex-col p-8 pt-10 gap-2">
                        <Link
                            onClick={() => setIsMenuOpen(false)}
                            href="/mens-wear"
                            className="text-[32px] font-black tracking-tighter text-white py-5 border-b border-white/5 active:text-blue-500 transition-colors"
                        >
                            MEN
                        </Link>
                        <Link
                            onClick={() => setIsMenuOpen(false)}
                            href="/womens-wear"
                            className="text-[32px] font-black tracking-tighter text-white py-5 border-b border-white/5 active:text-blue-500 transition-colors"
                        >
                            WOMEN
                        </Link>

                        <div className="mt-12 flex flex-col gap-8">
                            {/* Profile Link */}
                            <button
                                onClick={handleProfileClick}
                                className="flex items-center gap-4 text-[14px] font-bold tracking-[0.2em] text-blue-400 uppercase"
                            >
                                <User size={20} />
                                {user ? `PROFILE (${user.firstName})` : "LOGIN / REGISTER"}
                            </button>

                            {/* Logout Button */}
                            {user && (
                                <button
                                    onClick={() => { logout(); router.push("/login"); setIsMenuOpen(false); }}
                                    className="flex items-center gap-4 text-[14px] font-bold tracking-[0.2em] text-red-500 uppercase"
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