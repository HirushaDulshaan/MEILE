"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function NewArrivals() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestProducts = async () => {
            try {
                const res = await fetch("/api/products");
                const data = await res.json();
                // Latest 4 products pamanak gannawa
                setProducts(data.slice(0, 4));
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLatestProducts();
    }, []);

    if (loading) return (
        <div className="max-w-7xl mx-auto px-6 py-20 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">
            Loading New Style...
        </div>
    );

    return (
        <section className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-[0.3em]">
                        <Sparkles size={14} />
                        Just Landed
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase">
                        New <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Arrivals</span>
                    </h2>
                    <p className="text-slate-500 font-medium max-w-md">
                        Discover the latest trends in our collection. Handpicked styles just for you.
                    </p>
                </div>

                <Link
                    href="/shop"
                    className="group flex items-center gap-3 font-bold text-slate-900 hover:text-blue-600 transition-all"
                >
                    View All Collection
                    <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all">
                        <ArrowRight size={18} />
                    </div>
                </Link>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                    <ProductCard key={product.id} data={product} />
                ))}
            </div>
        </section>
    );
}