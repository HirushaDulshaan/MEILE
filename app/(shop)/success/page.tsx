"use client";
import React, { useEffect } from "react";
import { useCart } from "@/app/hooks/use-cart";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
    const cart = useCart();

    // Payment එක success නිසා අපි cart එක clear කරමු
    useEffect(() => {
        cart.clearCart();
    }, []);

    return (
        <main className="min-h-[80vh] flex flex-col items-center justify-center px-6 font-sans">
            <div className="bg-green-50 p-10 rounded-[3rem] flex flex-col items-center text-center max-w-md shadow-sm border border-green-100">
                <div className="bg-green-500 p-4 rounded-full text-white mb-6 animate-bounce">
                    <CheckCircle2 size={40} />
                </div>

                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">
                    Payment Success!
                </h1>
                <p className="text-slate-500 font-medium leading-relaxed mb-8">
                    Thank you for your purchase Hirusha. Your order has been placed successfully and we'll start processing it right away.
                </p>

                <div className="w-full space-y-3">
                    <Link href="/dees" className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-600 transition-all uppercase tracking-widest text-xs">
                        Continue Shopping <ArrowRight size={16} />
                    </Link>

                    <Link href="/" className="w-full bg-white text-slate-500 font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-all uppercase tracking-widest text-[10px]">
                        <ShoppingBag size={14} /> Back to Home
                    </Link>
                </div>
            </div>

            <p className="mt-10 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                Secure Order Confirmed by MEILI
            </p>
        </main>
    );
}