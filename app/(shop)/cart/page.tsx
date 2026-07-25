"use client";

import React from "react";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/app/hooks/use-cart";
import { useUserStore } from "@/app/hooks/use-user-store";

export default function CartPage() {
    const cart = useCart();
    const { user } = useUserStore();

    const subtotal = cart.items.reduce((acc, item) => acc + item.price * item.qty, 0);
    const delivery = cart.items.length > 0 ? 350 : 0;

    return (
        <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20 font-sans">
            <AnimatePresence mode="wait">
                {cart.items.length === 0 ? (
                    /* EMPTY CART ANIMATED STATE */
                    <motion.div
                        key="empty-cart"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="min-h-[70vh] flex flex-col items-center justify-center space-y-6"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
                            className="bg-slate-100 p-8 rounded-full"
                        >
                            <ShoppingBag size={50} className="text-slate-400" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-slate-900">Your bag is empty</h2>
                        <Link
                            href="/dees"
                            className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-blue-600 transition-all shadow-md active:scale-95"
                        >
                            Continue Shopping
                        </Link>
                    </motion.div>
                ) : (
                    /* MAIN CART CONTENT */
                    <motion.div
                        key="cart-content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-end mb-10">
                            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
                                Your Shopping Bag
                            </h1>
                            <button
                                onClick={() => cart.clearCart()}
                                className="text-xs font-bold text-red-500 hover:underline uppercase tracking-widest cursor-pointer"
                            >
                                Clear All
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            {/* LEFT: Cart Items List */}
                            <div className="lg:col-span-8 space-y-6">
                                <AnimatePresence initial={false}>
                                    {cart.items.map((item) => (
                                        <motion.div
                                            key={`${item.id}-${item.size}`}
                                            layout // Smoothly slides remaining items up when one is deleted
                                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            /* 💡 FIXED: Defined exit animation & exit duration here */
                                            exit={{
                                                opacity: 0,
                                                x: -100,
                                                scale: 0.85,
                                                transition: { duration: 0.25 }
                                            }}
                                            transition={{
                                                layout: { type: "spring", stiffness: 300, damping: 30 },
                                                opacity: { duration: 0.2 },
                                            }}
                                            className="flex gap-6 p-4 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            {/* Product Image */}
                                            <div className="w-24 h-32 md:w-32 md:h-40 bg-slate-50 rounded-2xl overflow-hidden shrink-0">
                                                <img
                                                    src={item.image}
                                                    className="w-full h-full object-cover"
                                                    alt={item.name}
                                                />
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex flex-col justify-between w-full py-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-bold text-lg text-slate-900 leading-tight">
                                                            {item.name}
                                                        </h3>
                                                        <p className="text-slate-500 text-sm mt-1">
                                                            Size:{" "}
                                                            <span className="font-bold text-slate-900">
                                                                {item.size}
                                                            </span>
                                                        </p>
                                                    </div>
                                                    <motion.button
                                                        whileHover={{ scale: 1.15 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => cart.removeItem(item.id, item.size)}
                                                        className="text-slate-300 hover:text-red-500 transition-colors cursor-pointer p-1"
                                                    >
                                                        <Trash2 size={20} />
                                                    </motion.button>
                                                </div>

                                                <div className="flex justify-between items-center mt-4">
                                                    <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl">
                                                        <motion.button
                                                            whileTap={{ scale: 0.8 }}
                                                            onClick={() => cart.updateQty(item.id, item.size, "minus")}
                                                            className="text-slate-950 hover:text-blue-600 transition-colors cursor-pointer"
                                                        >
                                                            <Minus size={16} />
                                                        </motion.button>
                                                        <span className="font-bold text-slate-950 text-sm w-4 text-center select-none">
                                                            {item.qty}
                                                        </span>
                                                        <motion.button
                                                            whileTap={{ scale: 0.8 }}
                                                            onClick={() => cart.updateQty(item.id, item.size, "plus")}
                                                            className="text-slate-950 hover:text-blue-600 transition-colors cursor-pointer"
                                                        >
                                                            <Plus size={16} />
                                                        </motion.button>
                                                    </div>
                                                    <p className="font-black text-slate-900 leading-none">
                                                        LKR {(item.price * item.qty).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* RIGHT: Order Summary */}
                            <div className="lg:col-span-4">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                                    className="bg-slate-900 text-white p-8 rounded-[2.5rem] sticky top-28 shadow-2xl shadow-slate-200"
                                >
                                    <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                                    <div className="space-y-4 text-slate-300 text-sm">
                                        <div className="flex justify-between">
                                            <span>Subtotal</span>
                                            <span className="text-white font-bold text-base">
                                                LKR {subtotal.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between border-b border-slate-800 pb-4">
                                            <span>Estimated Delivery</span>
                                            <span className="text-white font-bold text-base">
                                                LKR {delivery.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between pt-2">
                                            <span className="text-lg font-bold text-white">Total</span>
                                            <span className="text-2xl font-black text-blue-400">
                                                LKR {(subtotal + delivery).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <Link href={user ? "/checkout" : "/login"}>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl mt-8 flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all shadow-lg group cursor-pointer"
                                        >
                                            {user ? "CHECKOUT NOW" : "LOGIN TO CHECKOUT"}
                                            <ArrowRight
                                                size={20}
                                                className="group-hover:translate-x-2 transition-transform"
                                            />
                                        </motion.button>
                                    </Link>

                                    <p className="text-[10px] text-slate-500 text-center mt-6 uppercase tracking-widest leading-relaxed">
                                        Secure payment & easy returns. <br /> Taxes included in prices.
                                    </p>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}