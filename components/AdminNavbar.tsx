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

                    {/* Logo */}
                    <Link href="/admin" className="text-2xl font-black hover:text-gray-300 transition">
                        D E E S <span className="text-[10px] tracking-normal font-light bg-white text-black px-2 py-0.5 ml-2 rounded">ADMIN</span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-10 text-[13px] font-bold">
                        <Link href="/admin/products" className="flex items-center gap-2 hover:text-gray-400 transition">
                            <Package size={16} /> Products
                        </Link>
                        <Link href="/admin/users" className="flex items-center gap-2 hover:text-gray-400 transition">
                            <Users size={16} /> Users
                        </Link>
                        <Link href="/admin/orders" className="flex items-center gap-2 hover:text-gray-400 transition">
                            <ShoppingBag size={16} /> Orders
                        </Link>

                        {/* Registration Dropdown */}
                        {/* Registration Dropdown Container */}
                        <div className="relative group py-2"> {/* Methane 'py-2' dammahama mouse eka thawa tikak eliyata giyath menu eka wahenne ne */}
                            <button className="flex items-center gap-2 hover:text-gray-400 transition focus:outline-none">
                                <Settings size={16} /> Registration <ChevronDown size={14} />
                            </button>

                            {/* Dropdown Menu */}
                            {/* Dropdown Menu */}
                            <div className="absolute top-full left-0 w-48 hidden group-hover:block pt-4">
                                <div className="bg-white text-black rounded-xl shadow-2xl py-3 border border-gray-100">

                                    {/* 1. Colour - කලින් තිබ්බේ /dashboard/reg/color. Meka hariyata confirm karanna */}
                                    <Link href="/reg/color" className="block px-6 py-2 hover:bg-gray-100 transition normal-case font-semibold">
                                        Colour
                                    </Link>

                                    {/* 2. Size */}
                                    <Link href="/reg/size" className="block px-6 py-2 hover:bg-gray-100 transition normal-case font-semibold">
                                        Size
                                    </Link>

                                    {/* 3. Section */}
                                    <Link href="/reg/section" className="block px-6 py-2 hover:bg-gray-100 transition normal-case font-semibold">
                                        Section
                                    </Link>

                                    {/* 4. Category */}
                                    <Link href="/reg/category" className="block px-6 py-2 hover:bg-gray-100 transition normal-case font-semibold">
                                        Category
                                    </Link>

                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Icon */}
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