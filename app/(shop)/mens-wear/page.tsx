"use client";

import { useEffect, useState } from "react";
import ProductCard from '@/components/ProductCard';
import { Sparkles, Loader2, Filter, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";

export default function MensProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [sizes, setSizes] = useState<any[]>([]);
    const [colors, setColors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Section ID for Men is 1
    const sectionId = 1;

    // Collapse States
    const [openFilters, setOpenFilters] = useState({
        category: true,
        size: true,
        color: true
    });

    // Filter States
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedSize, setSelectedSize] = useState<string>("all");
    const [selectedColor, setSelectedColor] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("newest");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, catRes, sizeRes, colorRes] = await Promise.all([
                    fetch(`/api/products?sectionId=${sectionId}`),
                    fetch(`/api/category?sectionId=${sectionId}`),
                    fetch("/api/size"),
                    fetch("/api/color")
                ]);

                const [prodData, catData, sizeData, colorData] = await Promise.all([
                    prodRes.json(), catRes.json(), sizeRes.json(), colorRes.json()
                ]);

                setProducts(Array.isArray(prodData) ? prodData : []);
                setCategories(Array.isArray(catData) ? catData : []);
                setSizes(Array.isArray(sizeData) ? sizeData : []);
                setColors(Array.isArray(colorData) ? colorData : []);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [sectionId]);

    // Toggle Collapse
    const toggleFilter = (filterName: keyof typeof openFilters) => {
        setOpenFilters(prev => ({ ...prev, [filterName]: !prev[filterName] }));
    };

    // Filter Logic with Safety Check
    const filteredProducts = products.filter(product => {
        const categoryMatch = selectedCategory === "all" || product.category?.name === selectedCategory;
        const sizeMatch = selectedSize === "all" ||
            product.stocks?.some((s: any) => s.size?.sizeCode === selectedSize);
        const colorMatch = selectedColor === "all" ||
            product.colors?.some((c: any) => c.name === selectedColor);
        return categoryMatch && sizeMatch && colorMatch;
    });

    // Sorting Logic
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        return 0;
    });

    return (
        <main className="min-h-screen bg-[#F8FAFC]">
            <section className="max-w-[1600px] mx-auto px-6 py-12 lg:py-20">

                {/* HEADER SECTION */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="border-l-4 border-blue-600 pl-6">
                        <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
                            <Sparkles size={12} /> Exclusive Collection
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase">
                            Men's <span className="text-blue-600">Fashion</span>
                        </h1>
                    </div>

                    {/* SORTING */}
                    <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm self-end">
                        <SlidersHorizontal size={14} className="text-slate-400" />
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-xs font-black text-slate-700 outline-none bg-transparent cursor-pointer uppercase tracking-widest">
                            <option value="newest">Newest First</option>
                            <option value="price-low">LKR: Low to High</option>
                            <option value="price-high">LKR: High to Low</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* SIDEBAR FILTERS (Card-style & Collapsible) */}
                    <aside className="lg:col-span-2 space-y-2">
                        <div className="flex items-center gap-2 mb-8 border-b border-slate-100 pb-4">
                            <Filter size={18} className="text-blue-600" />
                            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight text-slate-950">Filters</h2>
                        </div>

                        {/* Category Card */}
                        <div className="bg-white rounded-3xl border border-slate-50 overflow-hidden mb-3 shadow-sm shadow-slate-100/50">
                            <button onClick={() => toggleFilter('category')} className="flex items-center justify-between w-full p-5 hover:bg-slate-50 transition-colors">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</h3>
                                <div className={`transition-transform duration-300 ${openFilters.category ? 'rotate-180' : ''}`}>
                                    <ChevronDown size={14} className="text-slate-400" />
                                </div>
                            </button>
                            {openFilters.category && (
                                <div className="px-4 pb-5 flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2">
                                    <button onClick={() => setSelectedCategory("all")} className={`text-[12px] font-bold text-left px-4 py-2 rounded-xl transition-all ${selectedCategory === "all" ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
                                        All Collections
                                    </button>
                                    {categories.map((cat) => (
                                        <button key={cat.id} onClick={() => setSelectedCategory(cat.name)} className={`text-[12px] font-bold text-left px-4 py-2 rounded-xl transition-all ${selectedCategory === cat.name ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Size Card */}
                        <div className="bg-white rounded-3xl border border-slate-50 overflow-hidden mb-3 shadow-sm shadow-slate-100/50">
                            <button onClick={() => toggleFilter('size')} className="flex items-center justify-between w-full p-5 hover:bg-slate-50 transition-colors">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Size</h3>
                                <div className={`transition-transform duration-300 ${openFilters.size ? 'rotate-180' : ''}`}>
                                    <ChevronDown size={14} className="text-slate-400" />
                                </div>
                            </button>
                            {openFilters.size && (
                                <div className="px-4 pb-5 flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2">
                                    <button onClick={() => setSelectedSize("all")} className={`w-10 h-8 rounded-lg text-[9px] font-black border-2 ${selectedSize === "all" ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-100 text-slate-400'}`}>ANY</button>
                                    {sizes.map((s) => (
                                        <button key={s.id} onClick={() => setSelectedSize(s.sizeCode)} className={`w-10 h-8 rounded-lg text-[9px] font-black border-2 transition-all ${selectedSize === s.sizeCode ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'border-slate-100 text-slate-400 hover:border-blue-600'}`}>
                                            {s.sizeCode}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Color Card */}
                        <div className="bg-white rounded-3xl border border-slate-50 overflow-hidden mb-3 shadow-sm shadow-slate-100/50">
                            <button onClick={() => toggleFilter('color')} className="flex items-center justify-between w-full p-5 hover:bg-slate-50 transition-colors">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Colors</h3>
                                <div className={`transition-transform duration-300 ${openFilters.color ? 'rotate-180' : ''}`}>
                                    <ChevronDown size={14} className="text-slate-400" />
                                </div>
                            </button>
                            {openFilters.color && (
                                <div className="px-4 pb-5 flex flex-wrap gap-3 animate-in fade-in slide-in-from-top-2">
                                    <button onClick={() => setSelectedColor("all")} className={`w-7 h-7 rounded-full border-2 border-slate-200 bg-slate-100 ${selectedColor === "all" ? 'ring-2 ring-blue-600 ring-offset-2' : ''}`} />
                                    {colors.map((c) => (
                                        <button key={c.id} onClick={() => setSelectedColor(c.name)} className={`w-7 h-7 rounded-full border border-slate-100 transition-all ${selectedColor === c.name ? 'ring-2 ring-blue-600 ring-offset-2 scale-110 shadow-md' : 'hover:scale-105'}`} style={{ backgroundColor: c.hexCode }} title={c.name} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* PRODUCT GRID (10 Columns, 5 per row) */}
                    <div className="lg:col-span-10">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <Loader2 className="animate-spin text-blue-600" size={40} />
                                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Syncing Styles...</p>
                            </div>
                        ) : (
                            <>
                                {sortedProducts.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                        {sortedProducts.map((product, index) => (
                                            <ProductCard key={product.id} data={product} index={index} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-[2.5rem] p-20 text-center border border-dashed border-slate-200">
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No products found for this selection.</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}