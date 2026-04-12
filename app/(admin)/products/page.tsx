"use client";
import { useEffect, useState } from "react";
import { Loader2, Save, Upload, X, RefreshCw, Edit3 } from "lucide-react";

export default function AddProductPage() {
    // 1. Form States
    const [formData, setFormData] = useState({
        id: null as number | null, // Dan ID eka Number | null
        sectionId: "",
        categoryId: "",
        title: "",
        price: "",
        description: "",
        colorIds: [] as number[], // IDs dan Numbers
    });

    const [stockData, setStockData] = useState({
        productId: "",
        status: "Active",
        sizeId: "",
        qty: "",
    });

    // 2. Data States
    const [sections, setSections] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [dbColors, setDbColors] = useState<any[]>([]);
    const [dbSizes, setDbSizes] = useState<any[]>([]);
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isStockLoading, setIsStockLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    // 3. Initial Data Load
    const loadInitialData = async () => {
        try {
            const [secRes, colRes, sizeRes, prodRes] = await Promise.all([
                fetch("/api/sections"),
                fetch("/api/color"),
                fetch("/api/size"),
                fetch("/api/products")
            ]);
            setSections(await secRes.json());
            setDbColors(await colRes.json());
            setDbSizes(await sizeRes.json());
            setAllProducts(await prodRes.json());
        } catch (error) {
            console.error("Error loading data", error);
        }
    };

    useEffect(() => {
        loadInitialData();
    }, []);

    // Filter Categories by Section
    useEffect(() => {
        if (formData.sectionId) {
            fetch(`/api/category?sectionId=${formData.sectionId}`)
                .then(res => res.json())
                .then(data => setCategories(data));
        }
    }, [formData.sectionId]);

    // --- PRODUCT SELECTION LOGIC ---
    const handleProductSelect = (productId: string) => {
        if (productId === "new") {
            resetForm();
            return;
        }

        const selected = allProducts.find(p => p.id === Number(productId));
        if (selected) {
            setIsEditMode(true);
            setFormData({
                id: selected.id,
                sectionId: selected.sectionId.toString(),
                categoryId: selected.categoryId.toString(),
                title: selected.name,
                price: selected.price.toString(),
                description: selected.description,
                colorIds: selected.colors.map((c: any) => c.id),
            });
            setPreviews(selected.images.map((img: any) => img.url));
            setStockData(prev => ({ ...prev, productId: selected.id.toString() }));
        }
    };

    const resetForm = () => {
        setIsEditMode(false);
        setFormData({ id: null, sectionId: "", categoryId: "", title: "", price: "", description: "", colorIds: [] });
        setPreviews([]);
    };

    const handleProductChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleStockChange = (e: any) => {
        setStockData({ ...stockData, [e.target.name]: e.target.value });
    };

    // 4. Image Handle (Max 3)
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (previews.length + files.length > 3) {
            alert("Maximum 3 images only!");
            return;
        }
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    // 5. Save / Update Product Logic
    const handleSaveProduct = async () => {
        if (!formData.title || !formData.price || previews.length === 0) {
            alert("Please fill required fields!");
            return;
        }

        setIsLoading(true);
        try {
            const finalImageUrls = [];
            for (const img of previews) {
                if (img.startsWith("data:image")) {
                    const res = await fetch("/api/upload", {
                        method: "POST",
                        body: JSON.stringify({ imageBase64: img }),
                    });
                    const data = await res.json();
                    finalImageUrls.push(data.url);
                } else {
                    finalImageUrls.push(img);
                }
            }

            const method = isEditMode ? "PUT" : "POST";
            const response = await fetch("/api/products", {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: formData.id,
                    name: formData.title,
                    description: formData.description,
                    price: formData.price,
                    categoryId: formData.categoryId,
                    sectionId: formData.sectionId,
                    images: finalImageUrls,
                    colorIds: formData.colorIds,
                }),
            });

            if (response.ok) {
                alert(isEditMode ? "✅ Product updated!" : "✅ Product saved!");
                loadInitialData();
                resetForm();
            }
        } catch (error) {
            alert("❌ Error saving product");
        } finally {
            setIsLoading(false);
        }
    };

    // 6. Save Stock Logic
    const handleUpdateStock = async () => {
        if (!stockData.productId || !stockData.sizeId || !stockData.qty) {
            alert("Please select product, size and quantity!");
            return;
        }
        setIsStockLoading(true);
        try {
            const res = await fetch("/api/stocks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...stockData,
                    productId: Number(stockData.productId),
                    sizeId: Number(stockData.sizeId),
                    qty: Number(stockData.qty)
                }),
            });
            if (res.ok) {
                alert("✅ Inventory Updated!");
                setStockData(prev => ({ ...prev, sizeId: "", qty: "" }));
            }
        } catch (e) {
            alert("❌ Error updating inventory");
        } finally {
            setIsStockLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-12 text-slate-900">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT: Product Creation */}
                <div className="lg:col-span-8 space-y-6">
                    <header className="flex justify-between items-end">
                        <div>
                            <h1 className="text-4xl font-black tracking-tight uppercase">
                                {isEditMode ? "Edit Product" : "Create Product"}
                            </h1>
                            <p className="text-slate-500 font-medium">Manage your product details and media.</p>
                        </div>
                        {isEditMode && (
                            <button onClick={resetForm} className="text-xs bg-slate-200 hover:bg-slate-300 px-4 py-2 rounded-lg font-bold transition-all">
                                CREATE NEW INSTEAD
                            </button>
                        )}
                    </header>

                    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* Product Selector / Title Dropdown */}
                            <div className="md:col-span-2 flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Product Title / Select Existing</label>
                                <div className="relative group">
                                    <select
                                        className="w-full p-4 bg-blue-50/50 border border-blue-100 rounded-2xl outline-none appearance-none font-bold text-blue-900"
                                        onChange={(e) => handleProductSelect(e.target.value)}
                                        value={isEditMode ? (formData.id?.toString() || "new") : "new"}
                                    >
                                        <option value="new">+ Create New Product</option>
                                        {allProducts.map(p => (
                                            <option key={p.id} value={p.id}>{p.name} (LKR {p.price})</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <Edit3 size={18} className="text-blue-400" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Section</label>
                                <select name="sectionId" value={formData.sectionId} onChange={handleProductChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none">
                                    <option value="">Choose Section...</option>
                                    {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Category</label>
                                <select name="categoryId" disabled={!formData.sectionId} value={formData.categoryId} onChange={handleProductChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none disabled:opacity-50">
                                    <option value="">Choose Category...</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>

                            {/* Title (for new entry) */}
                            <div className="md:col-span-2 flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Display Name</label>
                                <input name="title" value={formData.title} onChange={handleProductChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" placeholder="Enter title..."/>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Price (LKR)</label>
                                <input name="price" type="number" value={formData.price} onChange={handleProductChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" placeholder="0.00"/>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Color</label>
                                <select
                                    name="colorIds"
                                    value={formData.colorIds[0] || ""}
                                    onChange={(e) => setFormData({...formData, colorIds: [Number(e.target.value)]})}
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                                >
                                    <option value="">Select Color...</option>
                                    {dbColors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>

                            <div className="md:col-span-2 flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Description</label>
                                <textarea name="description" rows={3} value={formData.description} onChange={handleProductChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none resize-none" placeholder="Description..."/>
                            </div>

                            <div className="md:col-span-2 space-y-4">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Gallery (Max 3)</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {previews.map((src, i) => (
                                        <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200">
                                            <img src={src} className="object-cover w-full h-full" alt="preview" />
                                            <button onClick={() => removeImage(i)} className="absolute top-1 right-1 p-1 bg-white/80 rounded-full text-red-500"><X size={14}/></button>
                                        </div>
                                    ))}
                                    {previews.length < 3 && (
                                        <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition">
                                            <Upload className="text-slate-400" />
                                            <input type="file" multiple className="hidden" accept="image/*" onChange={handleImageChange} />
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSaveProduct}
                            disabled={isLoading}
                            className={`mt-10 w-full text-white font-bold py-5 rounded-[1.5rem] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl ${isEditMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-900 hover:bg-black'}`}
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                            {isLoading ? "Processing..." : isEditMode ? "Update Product Details" : "Save New Product"}
                        </button>
                    </div>
                </div>

                {/* RIGHT: Stock Management */}
                <div className="lg:col-span-4 space-y-6">
                    <h2 className="text-2xl font-bold text-slate-800">Stock Management</h2>
                    <div className="bg-[#1E293B] text-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-700 space-y-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase">Target Product</label>
                            <select
                                name="productId"
                                value={stockData.productId}
                                onChange={handleStockChange}
                                className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl outline-none"
                            >
                                <option value="">Select Product...</option>
                                {allProducts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase">Inventory Status</label>
                            <select name="status" value={stockData.status} onChange={handleStockChange} className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl outline-none">
                                <option value="Active">Active</option>
                                <option value="Out of Stock">Out of Stock</option>
                                <option value="Discontinued">Discontinued</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase">Size Variant</label>
                            <select name="sizeId" value={stockData.sizeId} onChange={handleStockChange} className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl outline-none">
                                <option value="">Select Size...</option>
                                {dbSizes.map(s => <option key={s.id} value={s.id}>{s.sizeName}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase">Quantity</label>
                            <input name="qty" type="number" value={stockData.qty} onChange={handleStockChange} placeholder="0" className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl outline-none"/>
                        </div>
                        <button onClick={handleUpdateStock} disabled={isStockLoading} className="w-full bg-emerald-500 text-slate-950 font-black py-5 rounded-[1.5rem] uppercase flex items-center justify-center gap-2">
                            {isStockLoading && <Loader2 size={18} className="animate-spin" />}
                            Update Inventory
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}