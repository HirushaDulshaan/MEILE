"use client";
import { useState } from "react";

export default function AddProductPage() {
    const [formData, setFormData] = useState({
        section: "",
        category: "",
        title: "",
        price: "",
        colors: "",
        description: "",
        images: ["", "", ""],
    });

    const [stockData, setStockData] = useState({
        product: "",
        status: "",
        size: "",
        qty: "",
    });

    const categories: Record<string, string[]> = {
        Electronics: ["Phones", "Laptops", "Accessories"],
        Clothing: ["Men", "Women", "Kids"],
        Shoes: ["Sports", "Casual"],
    };

    const colorOptions = ["Black", "White", "Navy Blue", "Red", "Grey"];
    const statusOptions = ["Active", "Out of Stock", "Discontinued"];
    const sizeOptions = ["XS", "S", "M", "L", "XL", "UK 7", "UK 8", "UK 9"];

    const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleStockChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setStockData({ ...stockData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-12 text-slate-900">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT: Product Creation (8 Columns) */}
                <div className="lg:col-span-8 space-y-6">
                    <header>
                        <h1 className="text-3xl font-extrabold tracking-tight">Create Product</h1>
                        <p className="text-slate-500">Fill in the details to list a new item in your store.</p>
                    </header>

                    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* 1. Section */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-700">Select Section</label>
                                <select
                                    name="section"
                                    value={formData.section}
                                    onChange={(e) => {
                                        handleProductChange(e);
                                        setFormData(prev => ({ ...prev, section: e.target.value, category: "" }));
                                    }}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                                >
                                    <option value="">Choose Section...</option>
                                    {Object.keys(categories).map((sec) => <option key={sec} value={sec}>{sec}</option>)}
                                </select>
                            </div>

                            {/* 2. Category */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-700">Select Category</label>
                                <select
                                    name="category"
                                    disabled={!formData.section}
                                    value={formData.category}
                                    onChange={handleProductChange}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                                >
                                    <option value="">Choose Category...</option>
                                    {formData.section && categories[formData.section].map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* 3. Title (Full Width) */}
                            <div className="md:col-span-2 flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-700">Product Title</label>
                                <input
                                    name="title"
                                    placeholder="Enter product name"
                                    onChange={handleProductChange}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                                />
                            </div>

                            {/* 4. Price */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-700">Price</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-slate-400">Rs.</span>
                                    <input
                                        name="price"
                                        type="number"
                                        placeholder="0.00"
                                        onChange={handleProductChange}
                                        className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                                    />
                                </div>
                            </div>

                            {/* 5. Colors (Dropdown) */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-700">Primary Color</label>
                                <select
                                    name="colors"
                                    onChange={handleProductChange}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                                >
                                    <option value="">Select Color...</option>
                                    {colorOptions.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            {/* 6. Description (Full Width) */}
                            <div className="md:col-span-2 flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-700">Description</label>
                                <textarea
                                    name="description"
                                    rows={4}
                                    placeholder="Write something about this product..."
                                    onChange={handleProductChange}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none resize-none"
                                />
                            </div>

                            {/* 7. Image URLs */}
                            <div className="md:col-span-2 flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-700 text-slate-400 uppercase tracking-widest text-[10px]">Image Gallery</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[0, 1, 2].map((i) => (
                                        <input
                                            key={i}
                                            placeholder={`Image URL ${i + 1}`}
                                            className="p-3 bg-white border border-slate-200 rounded-xl text-xs focus:border-blue-600 outline-none shadow-sm"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-all shadow-xl active:scale-[0.99]">
                            Save New Product
                        </button>
                    </div>
                </div>

                {/* RIGHT: Stock Management (4 Columns) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <h2 className="text-2xl font-bold text-slate-800">Stock Management</h2>

                    <div className="bg-[#1E293B] text-white p-8 rounded-[2rem] shadow-2xl border border-slate-700">
                        <div className="space-y-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase">Target Product</label>
                                <select name="product" onChange={handleStockChange} className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 outline-none">
                                    <option value="">Select Product...</option>
                                    <option>SmartStyle Cotton Tee</option>
                                    <option>Denim Jacket V2</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase">Inventory Status</label>
                                <select name="status" onChange={handleStockChange} className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 outline-none">
                                    <option value="">Select Status...</option>
                                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase">Size Variant</label>
                                <select name="size" onChange={handleStockChange} className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 outline-none">
                                    <option value="">Select Size...</option>
                                    {sizeOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase">Quantity In Hand</label>
                                <input
                                    name="qty"
                                    type="number"
                                    placeholder="0"
                                    onChange={handleStockChange}
                                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>

                            <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-4 rounded-2xl shadow-lg shadow-emerald-900/20 transition-all mt-4 uppercase tracking-wider">
                                Update Inventory
                            </button>
                        </div>
                    </div>

                    {/* Quick Tip for your Portfolio */}
                    <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl">
                        <p className="text-sm text-blue-700 leading-relaxed">
                            💡 <strong>Tip:</strong> In a real Next.js app, you can use <strong>Server Actions</strong> to handle these form submissions directly to your database.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}