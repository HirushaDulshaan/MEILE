"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { ArrowRight, Flame } from "lucide-react";
import Link from "next/link";

export default function MostSelling() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                const res = await fetch("/api/products?type=most-selling");
                const data = await res.json();
                setProducts(data.slice(0, 5));
            } catch (error) {
                console.error("Failed to fetch best sellers:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBestSellers();
    }, []);

    if (loading && products.length === 0) return null;

    return (
        <section className="max-w-[1440px] mx-auto px-6 py-16 lg:py-24 border-t border-slate-50">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 px-2">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-orange-500 font-black text-xs uppercase tracking-[0.3em]">
                        <Flame size={14} fill="currentColor" />
                        Best Sellers
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase">
                        Most <span className="text-orange-500">Selling</span>
                    </h2>
                    <p className="text-slate-500 font-medium max-w-md">
                        The pieces everyone is loving right now. Grab yours before they are gone.
                    </p>
                </div>

                <Link
                    href="/collections/most-selling"
                    className="group flex items-center gap-3 font-bold text-slate-900 hover:text-orange-500 transition-all"
                >
                    <span className="text-[10px] font-black uppercase tracking-widest">Explore All</span>
                    <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500 transition-all">
                        <ArrowRight size={18} />
                    </div>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {products.map((product, index) => (
                    <ProductCard key={product.id} data={product} index={index} />
                ))}
            </div>
        </section>
    );
}