"use client";

import React, { useState } from "react";
import { Heart, Trash2, ShoppingBag, ArrowRight, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useWishlist } from "@/app/hooks/use-wishlist";
import Link from "next/link";

export default function WishlistContent() {
    const wishlist = useWishlist();

    // --- Pagination States ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // පේජ් එකකට අයිටම් 5ක් පෙන්වමු

    if (!wishlist) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
            </div>
        );
    }

    // --- Pagination Logic ---
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = wishlist.items.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(wishlist.items.length / itemsPerPage);

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8 border-b pb-4">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">My Wishlist</h2>
                <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-full uppercase tracking-widest">
                    {wishlist.items.length} Items Saved
                </span>
            </div>

            {wishlist.items.length > 0 ? (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        {currentItems.map((item: any) => (
                            <div
                                key={item.id}
                                className="group relative overflow-hidden border border-slate-100 rounded-[2rem] bg-white transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1"
                            >
                                <div className="p-4 flex items-center gap-6">
                                    {/* Product Image */}
                                    <div className="w-20 h-24 bg-slate-50 rounded-2xl overflow-hidden shrink-0 border border-slate-100">
                                        <img
                                            src={item.image}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            alt={item.name}
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight truncate">
                                            {item.name}
                                        </h4>
                                        <p className="text-[13px] font-bold text-blue-600">
                                            LKR {item.price.toLocaleString()}
                                        </p>
                                        <Link
                                            href={`/product/${item.id}`}
                                            className="inline-flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
                                        >
                                            View Product <ArrowRight size={10} />
                                        </Link>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => wishlist.removeItem(item.id)}
                                            className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        <Link
                                            href={`/product/${item.id}`}
                                            className="p-3 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-slate-200 active:scale-95"
                                        >
                                            <ShoppingBag size={18} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* --- PAGINATION BUTTONS --- */}
                    {wishlist.items.length > itemsPerPage && (
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
                /* Empty State (ඔයාගේ පරණ එකමයි) */
                <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                        <Heart size={32} className="text-slate-200" />
                    </div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Your wishlist is empty</h3>
                    <Link href="/shop" className="mt-8 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 shadow-xl">
                        Explore Collection
                    </Link>
                </div>
            )}
        </div>
    );
}