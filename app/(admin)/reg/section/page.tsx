"use client";
import { FormEvent, useEffect, useState } from "react";
import { Layers, Save, Edit, RotateCcw, Loader2 } from "lucide-react";

export default function SectionManagement() {
    const [formData, setFormData] = useState({
        id: null as number | null,
        sectionName: "",
    });

    const [isEditing, setIsEditing] = useState(false);
    const [savedSections, setSavedSections] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchSections = async () => {
        try {
            const res = await fetch("/api/sections");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setSavedSections(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch sections:", error);
        }
    };

    useEffect(() => { fetchSections(); }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!formData.sectionName.trim()) return alert("Please enter a name");

        setIsLoading(true);
        try {
            const method = isEditing ? "PUT" : "POST";
            const response = await fetch("/api/sections", {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                await fetchSections();
                resetForm();
            } else {
                alert("Something went wrong!");
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong!");
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
            sectionName: item.name,
        });
    };

    const resetForm = () => {
        setIsEditing(false);
        setFormData({ id: null, sectionName: "" });
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 text-slate-900 font-sans">
            <div className="max-w-6xl mx-auto">
                <header className="mb-10 flex items-center gap-4">
                    <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg text-white">
                        <Layers size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tight">Sections</h1>
                        <p className="text-slate-500 font-medium">Manage main store categories</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* FORM */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8 sticky top-10">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="text-center relative">
                                    {isEditing && (
                                        <button type="button" onClick={resetForm} className="absolute right-0 top-0 p-2 text-slate-400 hover:text-indigo-600 transition">
                                            <RotateCcw size={20} />
                                        </button>
                                    )}
                                    <h2 className="text-2xl font-bold">{isEditing ? "Update" : "New Section"}</h2>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Section Name</label>
                                    <input name="sectionName" required value={formData.sectionName} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="e.g. Mens Fashion"/>
                                </div>
                                <button disabled={isLoading} className={`w-full text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-3 transition-all ${isEditing ? 'bg-indigo-600' : 'bg-slate-900'}`}>
                                    {isLoading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                                    {isEditing ? "Update Changes" : "Save Section"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="lg:col-span-7 bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm h-fit">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 border-b border-slate-100">
                                <tr className="text-slate-400 uppercase text-[10px] tracking-widest font-black">
                                    <th className="px-8 py-5">ID</th>
                                    <th className="px-8 py-5">Name</th>
                                    <th className="px-8 py-5 text-right">Action</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 text-sm">
                                {savedSections.map((item) => (
                                    <tr key={item.id} className="group hover:bg-indigo-50/20 transition-colors font-medium text-slate-700">
                                        <td className="px-8 py-5 font-mono text-xs text-slate-400 font-bold">#{item.id}</td>
                                        <td className="px-8 py-5 font-bold">{item.name}</td>
                                        <td className="px-8 py-5 text-right">
                                            <button onClick={() => handleEdit(item)} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 transition-all shadow-sm">
                                                <Edit size={16} />
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