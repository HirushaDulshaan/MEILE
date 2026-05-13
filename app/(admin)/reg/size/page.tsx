"use client";
import { useState, useEffect } from "react";
import { Ruler, Save, Edit, RotateCcw, Type, Loader2 } from "lucide-react";

export default function SizeManagement() {
    const [formData, setFormData] = useState({
        id: null as number | null,
        sizeCode: "",
        sizeName: "",
    });

    const [savedSizes, setSavedSizes] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchSizes = async () => {
        try {
            const res = await fetch("/api/size");
            const data = await res.json();
            setSavedSizes(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch sizes", error);
        }
    };

    useEffect(() => { fetchSizes(); }, []);

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
                await fetchSizes();
                resetForm();
            } else {
                const err = await response.json();
                alert(err.error || "Something went wrong!");
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
            sizeCode: item.sizeCode,
            sizeName: item.sizeName,
        });
    };

    const resetForm = () => {
        setIsEditing(false);
        setFormData({ id: null, sizeCode: "", sizeName: "" });
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 text-slate-900 font-sans">
            <div className="max-w-6xl mx-auto">
                <header className="mb-10 flex items-center gap-4">
                    <div className="bg-emerald-600 p-3 rounded-2xl shadow-lg">
                        <Ruler className="text-white" size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tight">Size Guide</h1>
                        <p className="text-slate-500 font-medium">Manage inventory size variants</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* FORM SECTION */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="text-center relative">
                                    {isEditing && (
                                        <button type="button" onClick={resetForm} className="absolute right-0 top-0 p-2 text-slate-400 hover:text-emerald-600">
                                            <RotateCcw size={20} />
                                        </button>
                                    )}
                                    <div className="bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600">
                                        <Type size={28} />
                                    </div>
                                    <h2 className="text-2xl font-bold">{isEditing ? "Update Size" : "New Size"}</h2>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Size Code</label>
                                        <input name="sizeCode" required value={formData.sizeCode} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. XL, UK 10"/>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                                        <input name="sizeName" required value={formData.sizeName} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Extra Large"/>
                                    </div>
                                </div>

                                <button disabled={isLoading} className={`w-full text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-3 transition-all ${isEditing ? 'bg-emerald-600' : 'bg-slate-900'}`}>
                                    {isLoading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                                    {isEditing ? "Update Details" : "Add to Guide"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* TABLE SECTION  */}
                    <div className="lg:col-span-7 bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm h-fit">
                        <div className="bg-slate-50 border-b border-slate-100 px-8 py-4 flex justify-between items-center">
                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Available Sizes</h2>
                            <span className="text-[10px] font-bold bg-slate-200 px-2 py-0.5 rounded-md text-slate-600">{savedSizes.length}</span>
                        </div>

                        <div className="overflow-y-auto max-h-[500px] custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-slate-50 z-10 shadow-sm">
                                <tr className="text-slate-400 uppercase text-[9px] tracking-widest font-black">
                                    <th className="px-8 py-3">ID</th>
                                    <th className="px-8 py-3">Code</th>
                                    <th className="px-8 py-3">Name</th>
                                    <th className="px-8 py-3 text-right">Action</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                {savedSizes.length > 0 ? (
                                    savedSizes.map((item) => (
                                        <tr key={item.id} className="group hover:bg-emerald-50/30 transition-colors">
                                            <td className="px-8 py-3 font-mono text-[10px] text-slate-400">#{item.id}</td>
                                            <td className="px-8 py-3 font-bold text-xs text-slate-800">{item.sizeCode}</td>
                                            <td className="px-8 py-3 font-medium text-xs text-slate-500">{item.sizeName}</td>
                                            <td className="px-8 py-3 text-right">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-emerald-600 hover:border-emerald-200 shadow-sm transition-all active:scale-90"
                                                >
                                                    <Edit size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-10 text-center text-slate-400 text-xs italic">
                                            No sizes found. Add some to get started!
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                    </div>                </div>
            </div>
        </div>
    );
}