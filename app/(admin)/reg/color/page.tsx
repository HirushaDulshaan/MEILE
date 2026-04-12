"use client";
import { useState, useEffect } from "react";
import { Paintbrush, Hash, Save, Edit, RotateCcw, Palette, Loader2 } from "lucide-react";

export default function SaveColor() {
    const [formData, setFormData] = useState({
        id: null as number | null, // ID එක Number බවට පත් කළා
        color: "",
        hexColor: "#3b82f6",
    });

    const [savedColors, setSavedColors] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchColors = async () => {
        try {
            const res = await fetch("/api/color");
            const data = await res.json();
            setSavedColors(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch color", error);
        }
    };

    useEffect(() => { fetchColors(); }, []);

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
                fetchColors();
                resetForm();
            } else {
                alert("ගැටලුවක් පැනනැගුනා.");
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
            color: item.name,
            hexColor: item.hexCode
        });
    };

    const resetForm = () => {
        setIsEditing(false);
        setFormData({ id: null, color: "", hexColor: "#3b82f6" });
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 text-slate-900 font-sans">
            <div className="max-w-6xl mx-auto">
                <header className="mb-10 flex items-center gap-4">
                    <div className="bg-slate-900 p-3 rounded-2xl text-white shadow-lg"><Palette size={28} /></div>
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tight">Color Palette</h1>
                        <p className="text-slate-500 font-medium text-sm">Manage product color variants</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* FORM */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8 sticky top-10">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="text-center relative">
                                    {isEditing && (
                                        <button type="button" onClick={resetForm} className="absolute right-0 top-0 p-2 text-slate-400 hover:text-blue-600"><RotateCcw size={20} /></button>
                                    )}
                                    <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600"><Paintbrush size={28} /></div>
                                    <h2 className="text-2xl font-bold text-slate-800">{isEditing ? "Update Variant" : "New Color"}</h2>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-slate-500 ml-1">Color Name</label>
                                        <input name="color" required value={formData.color} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all"/>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-slate-500 ml-1">Hex Code</label>
                                        <div className="flex gap-3">
                                            <div className="relative flex-1">
                                                <span className="absolute left-4 top-4 text-slate-400"><Hash size={16} /></span>
                                                <input name="hexColor" required value={formData.hexColor} onChange={handleChange} className="w-full p-4 pl-10 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-mono text-sm uppercase"/>
                                            </div>
                                            <div className="relative w-14 h-14 shrink-0">
                                                <input type="color" name="hexColor" value={formData.hexColor} onChange={handleChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                                <div className="w-full h-full rounded-2xl border-4 border-white shadow-sm ring-1 ring-slate-200" style={{ backgroundColor: formData.hexColor }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button disabled={isLoading} className={`w-full text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-3 transition-all ${isEditing ? 'bg-blue-600' : 'bg-slate-900'}`}>
                                    {isLoading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                                    {isEditing ? "Update Changes" : "Save Color"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* TABLE WITH SCROLLBAR */}
                    <div className="lg:col-span-7 bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm h-fit">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Registered Colors</h2>
                            <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">{savedColors.length}</span>
                        </div>

                        <div className="overflow-y-auto max-h-[500px] custom-scrollbar">
                            <table className="w-full text-left">
                                <thead className="sticky top-0 bg-white z-10 shadow-sm">
                                <tr className="text-slate-400 uppercase text-[9px] tracking-widest font-black border-b border-slate-100">
                                    <th className="px-8 py-4">Preview</th>
                                    <th className="px-8 py-4">Name</th>
                                    <th className="px-8 py-4 text-right">Action</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                {savedColors.map((item) => (
                                    <tr key={item.id} className="group hover:bg-blue-50/30 transition-colors">
                                        <td className="px-8 py-3">
                                            <div className="w-8 h-8 rounded-lg shadow-inner ring-1 ring-slate-200" style={{ backgroundColor: item.hexCode }} />
                                        </td>
                                        <td className="px-8 py-3">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-700">{item.name}</span>
                                                <code className="text-[10px] text-slate-400 uppercase font-mono">{item.hexCode}</code>
                                            </div>
                                        </td>
                                        <td className="px-8 py-3 text-right">
                                            <button onClick={() => handleEdit(item)} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-blue-600 transition-all shadow-sm">
                                                <Edit size={14} />
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