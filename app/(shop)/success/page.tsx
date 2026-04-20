"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/app/hooks/use-cart";
import { useUserStore } from "@/app/hooks/use-user-store";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

function SuccessContent() {
    const cart = useCart();
    const { user } = useUserStore();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [status, setStatus] = useState("processing");

    useEffect(() => {
        if (sessionId) {
            fetch(`/api/checkout/success?session_id=${sessionId}`)
                .then((res) => {
                    if (res.ok) {
                        setStatus("success");
                        cart.clearCart();
                    } else {
                        setStatus("error");
                    }
                })
                .catch(() => setStatus("error"));
        }
    }, [sessionId]);

    return (
        <main className="min-h-[80vh] flex flex-col items-center justify-center px-6">
            <div className="bg-white p-10 rounded-[3rem] flex flex-col items-center text-center max-w-md shadow-2xl border border-slate-50">
                {status === "processing" ? (
                    <div className="flex flex-col items-center">
                        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                        <h2 className="font-black uppercase tracking-widest text-xs text-slate-400">Confirming Payment...</h2>
                    </div>
                ) : status === "success" ? (
                    <>
                        <div className="bg-green-500 p-4 rounded-full text-white mb-6 animate-bounce shadow-lg shadow-green-100">
                            <CheckCircle2 size={40} />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">Order Confirmed!</h1>
                        <p className="text-slate-500 font-medium mb-8 text-sm uppercase tracking-tight">
                            Thank you {user?.firstName || "Customer"}. Your payment was successful and your order is now processing.
                        </p>
                    </>
                ) : (
                    <div className="text-red-500 font-black uppercase text-xs">Something went wrong while saving your order.</div>
                )}

                <div className="w-full space-y-3 mt-4">
                    <Link href="/profile?tab=orders" className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-600 transition-all uppercase tracking-widest text-xs">
                        View My Orders <ArrowRight size={16} />
                    </Link>
                    <Link href="/dees" className="w-full bg-white text-slate-500 font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-all uppercase tracking-widest text-[10px]">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={
            <main className="min-h-[80vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </main>
        }>
            <SuccessContent />
        </Suspense>
    );
}