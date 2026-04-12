"use client";

import { useEffect, useState } from "react";
import ProductCard from '@/components/ProductCard'; // Path eka check karanna
import { Sparkles, Loader2 } from "lucide-react";

export default function MensProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMensProducts = async () => {
            try {
                // Section ID 1 filter kalla gannawa
                const res = await fetch("/api/products?sectionId=1");
                const data = await res.json();

                // Array ekakda kiyala check karala set karanawa
                setProducts(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMensProducts();
    }, []);

    return (
        <main className="min-h-screen bg-[#F8FAFC]">
            <section className="max-w-7xl mx-auto px-6 py-16 lg:py-24">

                {/* PAGE HEADER */}
                <div className="flex flex-col mb-12 border-l-4 border-blue-600 pl-6">
                    <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-[0.3em] mb-2">
                        <Sparkles size={14} />
                        Exclusive Collection
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 uppercase">
                        Men's <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Fashion</span>
                    </h1>
                    <p className="text-slate-500 font-medium max-w-xl mt-4">
                        From street style to formal looks, explore our curated selection of premium menswear designed for the modern lifestyle.
                    </p>
                </div>

                {/* LOADING STATE */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="animate-spin text-blue-600" size={40} />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Curating Best Styles...</p>
                    </div>
                ) : (
                    <>
                        {/* PRODUCTS GRID */}
                        {products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                {products.map((product) => (
                                    <ProductCard key={product.id} data={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-[2.5rem] p-20 text-center border border-dashed border-slate-200">
                                <p className="text-slate-400 font-medium italic text-sm">No products found in this section yet.</p>
                            </div>
                        )}
                    </>
                )}
            </section>
        </main>
    );
}