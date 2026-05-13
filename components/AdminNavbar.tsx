"use client";
import { useState } from "react";
import Link from "next/link";
import { User, LogOut, ChevronDown, Package, Users, ShoppingBag, Settings } from "lucide-react";

const AdminNavbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <div className="relative w-full z-50">
            <nav className="bg-black px-6 py-5 shadow-lg uppercase tracking-widest text-white">
                <div className="max-w-7xl mx-auto flex justify-between items-center">

                    <Link href="/dashboard" className="text-2xl font-black hover:text-gray-300 transition">
                        D E E S <span className="text-[10px] tracking-normal font-light bg-white text-black px-2 py-0.5 ml-2 rounded">ADMIN</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-10 text-[13px] font-bold">

                        <div className="relative group py-2">
                            <button className="flex items-center gap-2 hover:text-gray-400 transition focus:outline-none">
                                <Package size={16} /> Products <ChevronDown size={14} />
                            </button>

                            <div className="absolute top-full left-0 w-48 hidden group-hover:block pt-4 z-50">
                                <div className="bg-white text-black rounded-xl shadow-2xl py-3 border border-gray-100">

                                    <Link href="/view-products" className="block px-6 py-2 hover:bg-gray-100 transition normal-case font-semibold">
                                        All Products
                                    </Link>

                                    <Link href="/products" className="block px-6 py-2 hover:bg-gray-100 transition normal-case font-semibold">
                                        Save Product
                                    </Link>

                                </div>
                            </div>
                        </div>

                        {/* Users Link */}
                        <Link href="/users" className="flex items-center gap-2 hover:text-gray-400 transition">
                            <Users size={16} /> Users
                        </Link>

                        {/* Orders Link */}
                        <Link href="/orders" className="flex items-center gap-2 hover:text-gray-400 transition">
                            <ShoppingBag size={16} /> Orders
                        </Link>

                        <div className="relative group py-2">
                            <button className="flex items-center gap-2 hover:text-gray-400 transition focus:outline-none">
                                <Settings size={16} /> Registration <ChevronDown size={14} />
                            </button>

                            <div className="absolute top-full left-0 w-48 hidden group-hover:block pt-4 z-50">
                                <div className="bg-white text-black rounded-xl shadow-2xl py-3 border border-gray-100">
                                    <Link href="/reg/color" className="block px-6 py-2 hover:bg-gray-100 transition normal-case font-semibold">
                                        Colour
                                    </Link>
                                    <Link href="/reg/size" className="block px-6 py-2 hover:bg-gray-100 transition normal-case font-semibold">
                                        Size
                                    </Link>
                                    <Link href="/reg/section" className="block px-6 py-2 hover:bg-gray-100 transition normal-case font-semibold">
                                        Section
                                    </Link>
                                    <Link href="/reg/category" className="block px-6 py-2 hover:bg-gray-100 transition normal-case font-semibold">
                                        Category
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 border-l border-gray-800 pl-6">
                        <User size={20} className="cursor-pointer hover:text-gray-400" />
                        <LogOut size={20} className="cursor-pointer hover:text-red-500 transition" />
                    </div>

                </div>
            </nav>
        </div>
    );
};

export default AdminNavbar;