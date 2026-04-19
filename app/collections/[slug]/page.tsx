"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { SlidersHorizontal, Filter, Loader2, ChevronDown } from "lucide-react";

export default function CollectionPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [products, setProducts] = useState<any[]>([]);
    const [dbSizes, setDbSizes] = useState<any[]>([]);
    const [dbColors, setDbColors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // ✅ Collapse States - මුලින්ම ඕන ඒවා true/false කරලා තියාගන්න පුළුවන්
    const [openFilters, setOpenFilters] = useState({
        size: true,
        color: true
    });

    const [selectedSize, setSelectedSize] = useState("all");
    const [selectedColor, setSelectedColor] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    const title = slug ? slug.replace("-", " ").toUpperCase() : "COLLECTION";

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                const [prodRes, sizeRes, colorRes] = await Promise.all([
                    fetch(`/api/products?type=${slug}`),
                    fetch("/api/size"),
                    fetch("/api/color")
                ]);
                const [prodData, sizeData, colorData] = await Promise.all([
                    prodRes.json(), sizeRes.json(), colorRes.json()
                ]);
                setProducts(Array.isArray(prodData) ? prodData : []);
                setDbSizes(Array.isArray(sizeData) ? sizeData : []);
                setDbColors(Array.isArray(colorData) ? colorData : []);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        if (slug) fetchAllData();
    }, [slug]);

    // ✅ Toggle Function
    const toggleFilter = (section: keyof typeof openFilters) => {
        setOpenFilters(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const filteredProducts = products.filter(product => {
        const sizeMatch = selectedSize === "all" || product.stocks?.some((s: any) => s.size?.sizeCode === selectedSize);
        const colorMatch = selectedColor === "all" || product.colors?.some((c: any) => c.name === selectedColor);
        return sizeMatch && colorMatch;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        return 0;
    });

    return (
        <main className="min-h-screen bg-[#F8FAFC] pb-20">
            {/* Header ... (පරණ කෝඩ් එකමයි) */}
            <div className="bg-white border-b border-slate-100 mb-10 pt-16 pb-10 px-6">
                <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-end gap-6">
                    <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">{title}</h1>
                    <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                        <SlidersHorizontal size={14} className="text-slate-400" />
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer">
                            <option value="newest">Newest</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* SIDEBAR FILTERS */}
                <aside className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-2 text-slate-900 font-black text-[11px] uppercase tracking-widest border-b pb-4 mb-4">
                        <Filter size={16} /> Filters
                    </div>

                    {/* ✅ SIZE FILTER (Collapsible) */}
                    <div className="bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden shadow-sm">
                        <button
                            onClick={() => toggleFilter('size')}
                            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-all"
                        >
                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Select Size</span>
                            <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${openFilters.size ? 'rotate-180' : ''}`} />
                        </button>

                        {openFilters.size && (
                            <div className="p-4 pt-0 flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                <button onClick={() => setSelectedSize("all")} className={`px-3 py-1.5 rounded-lg text-[9px] font-black border transition-all ${selectedSize === "all" ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}>ALL</button>
                                {dbSizes.map((s) => (
                                    <button key={s.id} onClick={() => setSelectedSize(s.sizeCode)} className={`px-3 py-1.5 rounded-lg text-[9px] font-black border transition-all ${selectedSize === s.sizeCode ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-white border-slate-100 text-slate-400 hover:border-blue-600'}`}>{s.sizeCode}</button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ✅ COLOR FILTER (Collapsible) */}
                    <div className="bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden shadow-sm">
                        <button
                            onClick={() => toggleFilter('color')}
                            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-all"
                        >
                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Select Color</span>
                            <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${openFilters.color ? 'rotate-180' : ''}`} />
                        </button>

                        {openFilters.color && (
                            <div className="p-4 pt-0 flex flex-wrap gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <button onClick={() => setSelectedColor("all")} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[8px] font-bold ${selectedColor === "all" ? 'border-blue-600 bg-slate-100 shadow-inner' : 'border-slate-100 bg-white'}`}>ALL</button>
                                {dbColors.map((c) => (
                                    <button key={c.id} onClick={() => setSelectedColor(c.name)} className={`w-8 h-8 rounded-full border transition-all ${selectedColor === c.name ? 'ring-2 ring-blue-600 ring-offset-2 scale-110 shadow-md' : 'border-slate-100 hover:scale-105'}`} style={{ backgroundColor: c.hexCode }} title={c.name} />
                                ))}
                            </div>
                        )}
                    </div>
                </aside>

                {/* PRODUCT GRID ... (පරණ කෝඩ් එකමයි) */}
                <div className="lg:col-span-10">
                    {loading ? (
                        <div className="flex flex-col items-center py-24 gap-4">
                            <Loader2 className="animate-spin text-blue-600" size={32} />
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Syncing Styles...</span>
                        </div>
                    ) : sortedProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-in fade-in duration-700">
                            {sortedProducts.map((product, index) => (
                                <ProductCard key={product.id} data={product} index={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-32 text-center bg-white border border-slate-100 rounded-[2.5rem] shadow-sm italic text-slate-300 uppercase font-black text-[10px] tracking-widest">Zero items match your filters</div>
                    )}
                </div>
            </div>
        </main>
    );
}