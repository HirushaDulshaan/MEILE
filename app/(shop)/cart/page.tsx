"use client";
import React from "react";
import {ArrowRight, Minus, Plus, ShoppingBag, Trash2} from "lucide-react";
import Link from "next/link";
import {useCart} from "@/app/hooks/use-cart";
import {useUserStore} from "@/app/hooks/use-user-store";

export default function CartPage() {

    const cart = useCart();
    const { user } = useUserStore();


    const subtotal = cart.items.reduce((acc, item) => acc + item.price * item.qty, 0);
    const delivery = cart.items.length > 0 ? 350 : 0;

    if (cart.items.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6">
                <div className="bg-slate-100 p-8 rounded-full">
                    <ShoppingBag size={50} className="text-slate-400"/>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Your bag is empty</h2>
                <Link href="/dees"
                      className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-blue-600 transition-all">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20 font-sans">
            <div className="flex justify-between items-end mb-10">
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Your Shopping Bag</h1>
                <button
                    onClick={() => cart.clearCart()}
                    className="text-xs font-bold text-red-500 hover:underline uppercase tracking-widest"
                >
                    Clear All
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* LEFT: Cart Items List */}
                <div className="lg:col-span-8 space-y-6">
                    {cart.items.map((item) => (
                        <div key={`${item.id}-${item.size}`}
                             className="flex gap-6 p-4 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm hover:shadow-md transition-shadow">
                            {/* Product Image */}
                            <div className="w-24 h-32 md:w-32 md:h-40 bg-slate-50 rounded-2xl overflow-hidden shrink-0">
                                <img src={item.image} className="w-full h-full object-cover" alt={item.name}/>
                            </div>

                            {/* Product Info */}
                            <div className="flex flex-col justify-between w-full py-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900 leading-tight">{item.name}</h3>
                                        <p className="text-slate-500 text-sm mt-1">Size: <span
                                            className="font-bold text-slate-900">{item.size}</span></p>
                                    </div>
                                    <button
                                        onClick={() => cart.removeItem(item.id, item.size)}
                                        className="text-slate-300 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={20}/>
                                    </button>
                                </div>

                                <div className="flex justify-between items-center mt-4">
                                    <div
                                        className="flex items-center gap-4 bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl">
                                        <button
                                            onClick={() => cart.updateQty(item.id, item.size, 'minus')}
                                            className="text-slate-950 hover:text-blue-600 transition-colors "
                                        >
                                            <Minus size={16}/>
                                        </button>
                                        <span className="font-bold text-slate-950 text-sm w-4 text-center">{item.qty}</span>
                                        <button
                                            onClick={() => cart.updateQty(item.id, item.size, 'plus')}
                                            className=" text-slate-950 hover:text-blue-600 transition-colors"
                                        >
                                            <Plus size={16}/>
                                        </button>
                                    </div>
                                    <p className="font-black text-slate-900 leading-none">
                                        LKR {(item.price * item.qty).toLocaleString()}
                                    </p></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* RIGHT: Order Summary */}
                <div className="lg:col-span-4">
                    <div
                        className="bg-slate-900 text-white p-8 rounded-[2.5rem] sticky top-28 shadow-2xl shadow-slate-200">
                        <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                        <div className="space-y-4 text-slate-300 text-sm">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="text-white font-bold text-base">LKR {subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-800 pb-4">
                                <span>Estimated Delivery</span>
                                <span className="text-white font-bold text-base">LKR {delivery.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between pt-2">
                                <span className="text-lg font-bold text-white">Total</span>
                                <span
                                    className="text-2xl font-black text-blue-400">LKR {(subtotal + delivery).toLocaleString()}</span>
                            </div>
                        </div>

                        <Link href={user ? "/checkout" : "/login"}>
                            <button
                                className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl mt-8 flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all active:scale-95 group">
                                {user ? "CHECKOUT NOW" : "LOGIN TO CHECKOUT"}
                                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform"/>
                            </button>
                        </Link>

                        <p className="text-[10px] text-slate-500 text-center mt-6 uppercase tracking-widest leading-relaxed">
                            Secure payment & easy returns. <br/> Taxes included in prices.
                        </p>
                    </div>
                </div>

            </div>
        </main>
    );
}