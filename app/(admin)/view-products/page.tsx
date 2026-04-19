"use client";

import { useEffect, useState } from "react";
import { Search, Edit, Trash2, Plus, Package, XCircle, Database, Palette, ChevronLeft, ChevronRight, Info } from "lucide-react";
import Link from "next/link";

export default function AllProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8;

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products");
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <main className="p-8 bg-[#F8FAFC] min-h-screen font-sans relative">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Product <span className="text-blue-600">Inventory</span></h1>
                        <p className="text-slate-500 text-sm font-medium">Managing {filteredProducts.length} total items</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                        <Link href="/products" className="bg-slate-900 text-white p-3 rounded-2xl hover:bg-blue-600 transition-all shadow-lg">
                            <Plus size={24} />
                        </Link>
                    </div>
                </div>

                {/* Products Table Wrapper */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/50 border-b border-slate-100 font-black uppercase text-[10px] text-slate-400 tracking-widest">
                            <tr>
                                <th className="p-6">Product</th>
                                <th className="p-6">Category</th>
                                <th className="p-6">Price</th>
                                <th className="p-6 text-center">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                            {currentProducts.map((product) => (
                                <tr
                                    key={product.id}
                                    className="hover:bg-blue-50/30 transition-colors group cursor-pointer"
                                    onClick={() => setSelectedProduct(product)}
                                >
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-20 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 shadow-sm shrink-0">
                                                <img src={product.images[0]?.url || "/placeholder.png"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-sm leading-tight mb-1">{product.name}</p>
                                                <p className="text-[10px] font-black text-blue-600 uppercase">ID: #{product.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 font-bold text-xs text-slate-500 uppercase">{product.category.name}</td>
                                    <td className="p-6 font-black text-slate-900 text-sm">LKR {product.price.toLocaleString()}</td>
                                    <td className="p-6 text-center">
                                        <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                                            <Link href={`/products?edit=${product.id}`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit size={18} /></Link>
                                            <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Page {currentPage} of {totalPages || 1}
                        </span>
                        <div className="flex gap-2">
                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-2 bg-white rounded-xl border border-slate-200 disabled:opacity-30 hover:shadow-md transition-all">
                                <ChevronLeft size={18} />
                            </button>
                            <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(prev => prev + 1)} className="p-2 bg-white rounded-xl border border-slate-200 disabled:opacity-30 hover:shadow-md transition-all">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ✅ IMPROVED PRODUCT DETAILS MODAL ✅ */}
                {selectedProduct && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative animate-in zoom-in-95 duration-300">

                            {/* Close Button */}
                            <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full hover:bg-rose-100 hover:text-rose-600 transition-all shadow-sm">
                                <XCircle size={24} />
                            </button>

                            {/* Left: Image Section */}
                            <div className="md:w-1/2 h-80 md:h-auto bg-slate-100 border-r border-slate-50">
                                <img src={selectedProduct.images[0]?.url} className="w-full h-full object-cover" alt={selectedProduct.name} />
                            </div>

                            {/* Right: Detailed Content Section */}
                            <div className="md:w-1/2 p-10 overflow-y-auto custom-scrollbar">
                                <div className="space-y-6">
                                    {/* Header */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="bg-blue-50 text-blue-600 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{selectedProduct.section.name}</span>
                                            <span className="bg-slate-100 text-slate-600 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{selectedProduct.category.name}</span>
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">{selectedProduct.name}</h2>
                                        <p className="text-2xl font-bold text-slate-900 mt-3">LKR {selectedProduct.price.toLocaleString()}</p>
                                    </div>

                                    {/* Description ✅ */}
                                    <div className="space-y-2">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Info size={14} /> Description
                                        </h4>
                                        <p className="text-slate-500 text-sm leading-relaxed italic">
                                            {selectedProduct.description || "No description provided for this product."}
                                        </p>
                                    </div>

                                    {/* Colors ✅ */}
                                    <div className="space-y-3">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Palette size={14} /> Available Colors
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedProduct.colors?.map((c: any) => (
                                                <div key={c.id} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
                                                    <div className="w-3 h-3 rounded-full border border-slate-200" style={{ backgroundColor: c.hexCode }} />
                                                    <span className="text-[10px] font-bold text-slate-600 uppercase">{c.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Stock Levels */}
                                    <div className="space-y-3 pt-4 border-t border-slate-100">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Database size={14} /> Stock Levels
                                        </h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            {selectedProduct.stocks.map((s: any) => (
                                                <div key={s.id} className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100">
                                                    <span className="font-bold text-slate-700 text-xs uppercase">{s.size.sizeCode}</span>
                                                    <span className={`text-xs font-black ${s.qty > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>{s.qty} Qty</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}