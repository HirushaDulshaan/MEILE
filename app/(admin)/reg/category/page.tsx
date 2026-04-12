"use client";
import { FormEvent, useEffect, useState } from "react";
import { LayoutGrid, Save, Edit, RotateCcw, Loader2 } from "lucide-react";

export default function CategoryManagement() {
    const [formData, setFormData] = useState({
        id: null as number | null, // Dan ID eka number
        categoryName: "",
        sectionId: "",
    });

    const [savedCategories, setSavedCategories] = useState<any[]>([]);
    const [sections, setSections] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [filterSection, setFilterSection] = useState("All");
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async () => {
        try {
            const [catRes, secRes] = await Promise.all([
                fetch("/api/category"),
                fetch("/api/sections")
            ]);
            const catData = await catRes.json();
            const secData = await secRes.json();

            setSavedCategories(Array.isArray(catData) ? catData : []);
            setSections(Array.isArray(secData) ? secData : []);
        } catch (e) {
            console.error("Failed to fetch data", e);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!formData.categoryName || !formData.sectionId) {
            return alert("Please fill all fields");
        }

        setIsLoading(true);
        try {
            const method = isEditing ? "PUT" : "POST";
            const response = await fetch("/api/category", {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                await fetchData();
                resetForm();
            } else {
                alert("Action failed!");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = (item: any) => {
        setIsEditing(true);
        setFormData({
            id: item.id,
            categoryName: item.name,
            sectionId: item.sectionId.toString(), // Select dropdown ekata String conversion ona
        });
    };

    const resetForm = () => {
        setIsEditing(false);
        setFormData({ id: null, categoryName: "", sectionId: "" });
    };

    const filteredData = filterSection === "All"
        ? savedCategories
        : savedCategories.filter(cat => cat.section?.name === filterSection);

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 text-slate-900 font-sans">
            <div className="max-w-6xl mx-auto">
                <header className="mb-10 flex items-center gap-4">
                    <div className="bg-slate-900 p-3 rounded-2xl shadow-lg text-white">
                        <LayoutGrid size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tight">Categories</h1>
                        <p className="text-slate-500 font-medium text-sm">Organize products into sections</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* FORM */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8 sticky top-10">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="text-center relative">
                                    {isEditing && (
                                        <button type="button" onClick={resetForm} className="absolute right-0 top-0 p-2 text-slate-400 hover:text-blue-600"><RotateCcw size={20} /></button>
                                    )}
                                    <h2 className="text-2xl font-bold">{isEditing ? "Update" : "New Category"}</h2>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Name</label>
                                        <input name="categoryName" required value={formData.categoryName} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600" placeholder="e.g. T-Shirts"/>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Section</label>
                                        <select name="sectionId" required value={formData.sectionId} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600">
                                            <option value="">Choose Section...</option>
                                            {sections.map(sec => <option key={sec.id} value={sec.id}>{sec.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <button disabled={isLoading} className={`w-full text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-3 transition-all ${isEditing ? 'bg-blue-600' : 'bg-slate-900'}`}>
                                    {isLoading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                                    {isEditing ? "Update Changes" : "Save Category"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* TABLE WITH SCROLLBAR */}
                    <div className="lg:col-span-7 bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm h-fit">
                        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Available Categories</h2>
                            <div className="flex bg-slate-200 p-1 rounded-xl">
                                <button onClick={() => setFilterSection("All")} className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${filterSection === "All" ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>All</button>
                                {sections.map(sec => (
                                    <button key={sec.id} onClick={() => setFilterSection(sec.name)} className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${filterSection === sec.name ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>{sec.name}</button>
                                ))}
                            </div>
                        </div>

                        <div className="overflow-y-auto max-h-[500px] custom-scrollbar">
                            <table className="w-full text-left">
                                <thead className="sticky top-0 bg-white z-10 shadow-sm">
                                <tr className="text-slate-400 uppercase text-[9px] tracking-widest font-black border-b border-slate-100">
                                    <th className="px-8 py-4">ID</th>
                                    <th className="px-8 py-4">Name</th>
                                    <th className="px-8 py-4">Section</th>
                                    <th className="px-8 py-4 text-right">Action</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                {filteredData.map((item) => (
                                    <tr key={item.id} className="group hover:bg-blue-50/30 transition-colors font-medium text-slate-700">
                                        <td className="px-8 py-4 font-mono text-[10px] text-slate-400">#{item.id}</td>
                                        <td className="px-8 py-4 text-xs font-bold">{item.name}</td>
                                        <td className="px-8 py-4">
                                                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase border bg-blue-50 text-blue-600 border-blue-100">
                                                    {item.section?.name || "N/A"}
                                                </span>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <button onClick={() => handleEdit(item)} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-blue-600 shadow-sm transition-all">
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