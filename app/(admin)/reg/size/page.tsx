"use client";
import { useState, useEffect } from "react"; // 👈 useEffect එකතු කළා
import { Ruler, Save, Edit, RotateCcw, Type, Loader2 } from "lucide-react";

export default function SizeManagement() {
    const [formData, setFormData] = useState({
        id: null as number | null,
        sizeCode: "",
        sizeName: "",
    });

    const [savedSizes, setSavedSizes] = useState<any[]>([]); // Table එකේ data
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Button loading state එකට

    // --- 1. Database එකෙන් Data Load කිරීම ---
    const fetchSizes = async () => {
        try {
            const res = await fetch("/api/size");
            const data = await res.json();
            setSavedSizes(data);
        } catch (error) {
            console.error("Failed to fetch sizes", error);
        }
    };

    useEffect(() => {
        fetchSizes();
    }, []);

    // --- 2. Save හෝ Update කිරීම ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const method = isEditing ? "PUT" : "POST";
            const response = await fetch("/api/size", {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                fetchSizes(); // Table එක refresh කරන්න
                resetForm();
            } else {
                alert("Something went wrong!");
            }
        } catch (error) {
            console.error("Error saving size", error);
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
            sizeCode: item.sizeCode, // 👈 API එකෙන් එන නම sizeCode
            sizeName: item.sizeName, // 👈 API එකෙන් එන නම sizeName
        });
    };

    const resetForm = () => {
        setIsEditing(false);
        setFormData({ id: null, sizeCode: "", sizeName: "" });
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 text-slate-900 font-sans">
            <div className="max-w-6xl mx-auto">
                <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-emerald-600 p-3 rounded-2xl shadow-lg">
                            <Ruler className="text-white" size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Size Guide</h1>
                            <p className="text-slate-500 font-medium">Define size variants for your inventory</p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* FORM */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8 sticky top-10">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="text-center mb-8 relative">
                                    {isEditing && (
                                        <button type="button" onClick={resetForm} className="absolute right-0 top-0 p-2 text-slate-400 hover:text-emerald-600 transition">
                                            <RotateCcw size={20} />
                                        </button>
                                    )}
                                    <div className="bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600">
                                        <Type size={28} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-800">{isEditing ? "Update Size" : "New Size"}</h2>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Size Code</label>
                                        <input
                                            name="sizeCode"
                                            required
                                            value={formData.sizeCode}
                                            onChange={handleChange}
                                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                                        <input
                                            name="sizeName"
                                            required
                                            value={formData.sizeName}
                                            onChange={handleChange}
                                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <button
                                    disabled={isLoading}
                                    className={`w-full text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${isEditing ? 'bg-emerald-600' : 'bg-slate-900'}`}
                                >
                                    {isLoading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                                    {isEditing ? "Update Size" : "Add Size"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="lg:col-span-7 bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden h-fit">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold flex items-center gap-3"><span className="w-2 h-6 bg-emerald-500 rounded-full"></span>Available Sizes</h2>
                            <span className="text-xs font-bold bg-emerald-50 px-4 py-1.5 rounded-full text-emerald-600 border border-emerald-100">{savedSizes.length} Total</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                <tr className="bg-slate-50/50 text-slate-400 uppercase text-[10px] tracking-[0.2em] font-black border-b border-slate-100">
                                    <th className="px-8 py-5">ID</th>
                                    <th className="px-8 py-5">Size Code</th>
                                    <th className="px-8 py-5">Full Name</th>
                                    <th className="px-8 py-5 text-right">Action</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                {savedSizes.map((item) => (
                                    <tr key={item.id} className="group hover:bg-emerald-50/20 transition-colors">
                                        <td className="px-8 py-5 font-mono text-xs text-slate-400">#{item.id}</td>
                                        <td className="px-8 py-5 font-black text-slate-800">{item.sizeCode}</td>
                                        <td className="px-8 py-5 font-semibold text-slate-600">{item.sizeName}</td>
                                        <td className="px-8 py-5 text-right">
                                            <button onClick={() => handleEdit(item)} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-emerald-600 transition-all shadow-sm">
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