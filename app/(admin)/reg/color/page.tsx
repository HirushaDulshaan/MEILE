"use client";
import { useState, useEffect } from "react";
import { Paintbrush, Hash, Save, Edit, RotateCcw, Palette, Loader2 } from "lucide-react";

export default function SaveColor() {
    const [formData, setFormData] = useState({
        id: null as string | null, // Prisma cuid() පාවිච්චි කරන නිසා string
        color: "",
        hexColor: "#3b82f6",
    });

    const [savedColors, setSavedColors] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // --- 1. Database එකෙන් පාටවල් ලබා ගැනීම (Fetch) ---
    const fetchColors = async () => {
        try {
            const res = await fetch("/api/color");
            const data = await res.json();
            setSavedColors(data);
        } catch (error) {
            console.error("Failed to fetch color", error);
        }
    };

    useEffect(() => {
        fetchColors();
    }, []);

    // --- 2. Save හෝ Update Logic එක ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const method = isEditing ? "PUT" : "POST";
            const response = await fetch("/api/color", {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                fetchColors(); // Table එක refresh කරන්න
                resetForm();
            } else {
                alert("ගැටලුවක් පැනනැගුනා. නැවත උත්සාහ කරන්න.");
            }
        } catch (error) {
            console.error("Error saving color", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = (item: any) => {
        setIsEditing(true);
        setFormData({
            id: item.id,
            color: item.name, // Schema එකේ තියෙන්නේ 'name' ලෙස
            hexColor: item.hexCode // Schema එකේ තියෙන්නේ 'hexCode' ලෙස
        });
    };

    const resetForm = () => {
        setIsEditing(false);
        setFormData({ id: null, color: "", hexColor: "#3b82f6" });
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 text-slate-900 font-sans">
            <div className="max-w-6xl mx-auto">

                {/* PAGE HEADER */}
                <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-slate-900 p-3 rounded-2xl shadow-lg shadow-slate-200 text-white">
                            <Palette size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Color Palette</h1>
                            <p className="text-slate-500 font-medium">Manage product color variants and styling</p>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <nav className="text-xs font-bold text-slate-400 uppercase tracking-widest flex gap-2">
                            <span>Inventory</span> / <span className="text-blue-600">Configurations</span>
                        </nav>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT SIDE: FORM */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8 sticky top-10">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="text-center mb-8 relative">
                                    {isEditing && (
                                        <button type="button" onClick={resetForm} className="absolute right-0 top-0 p-2 text-slate-400 hover:text-blue-600 transition">
                                            <RotateCcw size={20} />
                                        </button>
                                    )}
                                    <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Paintbrush className="text-blue-600" size={28} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-800">{isEditing ? "Update Variant" : "Add New Variant"}</h2>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Color Name</label>
                                        <input
                                            name="color"
                                            required
                                            value={formData.color}
                                            onChange={handleChange}
                                            suppressHydrationWarning
                                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Pick Color</label>
                                        <div className="flex gap-3">
                                            <div className="relative flex-1">
                                                <span className="absolute left-4 top-4 text-slate-400"><Hash size={18} /></span>
                                                <input
                                                    name="hexColor"
                                                    required
                                                    value={formData.hexColor}
                                                    onChange={handleChange}
                                                    suppressHydrationWarning
                                                    className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-mono text-sm"
                                                />
                                            </div>
                                            <div className="relative w-16 h-16 shrink-0">
                                                <input type="color" name="hexColor" value={formData.hexColor} onChange={handleChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                                <div className="w-full h-full rounded-2xl border-4 border-white shadow-md" style={{ backgroundColor: formData.hexColor }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    disabled={isLoading}
                                    className={`w-full text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${isEditing ? 'bg-blue-600' : 'bg-slate-900'}`}
                                >
                                    {isLoading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                                    {isEditing ? "Update Changes" : "Save Color"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* RIGHT SIDE: TABLE */}
                    <div className="lg:col-span-7 bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden h-fit">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white/50 backdrop-blur-sm">
                            <h2 className="text-xl font-bold flex items-center gap-3 text-slate-800">
                                <span className="w-2 h-6 bg-blue-600 rounded-full"></span>Registered Variants
                            </h2>
                            <span className="text-xs font-bold bg-blue-50 px-4 py-1.5 rounded-full text-blue-600 border border-blue-100 uppercase tracking-tighter">
                                {savedColors.length} Active
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                <tr className="bg-slate-50/50 text-slate-400 uppercase text-[10px] tracking-[0.2em] font-black border-b border-slate-100">
                                    <th className="px-8 py-5">Preview</th>
                                    <th className="px-8 py-5">Color Name</th>
                                    <th className="px-8 py-5">Hex Code</th>
                                    <th className="px-8 py-5 text-right">Action</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                {savedColors.map((item) => (
                                    <tr key={item.id} className="group hover:bg-blue-50/20 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="w-10 h-10 rounded-xl shadow-inner border-2 border-white ring-1 ring-slate-100" style={{ backgroundColor: item.hexCode }} />
                                        </td>
                                        <td className="px-8 py-5 font-bold text-slate-700 tracking-tight">{item.name}</td>
                                        <td className="px-8 py-5">
                                            <code className="bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-500 tracking-wider uppercase">
                                                {item.hexCode}
                                            </code>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button onClick={() => handleEdit(item)} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:shadow-md transition-all shadow-sm">
                                                <Edit size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}