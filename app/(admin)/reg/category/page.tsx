"use client";
import { useState } from "react";
import { LayoutGrid, Save, Edit, RotateCcw, Filter } from "lucide-react";

export default function CategoryManagement() {
    const [formData, setFormData] = useState({
        id: null as number | null,
        categoryName: "",
        sectionId: "",
    });

    const [isEditing, setIsEditing] = useState(false);
    const [filterSection, setFilterSection] = useState("All");

    // Sections list (Meka database eken ena ekak widiyata hithanna)
    const sections = ["Men", "Women", "Kids", "Accessories"];

    // Categories list (Dummy Data)
    const [savedCategories, setSavedCategories] = useState([
        { id: 1, name: "T-Shirts", section: "Men" },
        { id: 2, name: "Handbags", section: "Women" },
        { id: 3, name: "Jeans", section: "Men" },
        { id: 4, name: "Dresses", section: "Women" },
    ]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = (item: any) => {
        setIsEditing(true);
        setFormData({
            id: item.id,
            categoryName: item.name,
            sectionId: item.section,
        });
    };

    const resetForm = () => {
        setIsEditing(false);
        setFormData({ id: null, categoryName: "", sectionId: "" });
    };

    // Filter Logic
    const filteredData = filterSection === "All"
        ? savedCategories
        : savedCategories.filter(cat => cat.section === filterSection);

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 text-slate-900">
            <div className="max-w-6xl mx-auto">

                {/* PAGE HEADER */}
                <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-slate-900 p-3 rounded-2xl shadow-lg">
                            <LayoutGrid className="text-white" size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
                                Category Management
                            </h1>
                            <p className="text-slate-500 font-medium">Organize products into sections and categories</p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT SIDE: Form (5 Columns) */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8 sticky top-10">
                            <div className="text-center mb-8 relative">
                                {isEditing && (
                                    <button onClick={resetForm} className="absolute right-0 top-0 p-2 text-slate-400 hover:text-blue-600 transition">
                                        <RotateCcw size={20} />
                                    </button>
                                )}
                                <h2 className="text-2xl font-bold text-slate-800">
                                    {isEditing ? "Update Category" : "New Category"}
                                </h2>
                            </div>

                            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                                {/* Category Name */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Category Name</label>
                                    <input
                                        name="categoryName"
                                        type="text"
                                        value={formData.categoryName}
                                        placeholder="e.g. Casual Shirts"
                                        onChange={handleChange}
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                                    />
                                </div>

                                {/* Section Select Dropdown */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Assign Section</label>
                                    <select
                                        name="sectionId"
                                        value={formData.sectionId}
                                        onChange={handleChange}
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Select a Section</option>
                                        {sections.map(sec => (
                                            <option key={sec} value={sec}>{sec}</option>
                                        ))}
                                    </select>
                                </div>

                                <button className={`w-full text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${isEditing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-900 hover:bg-black'}`}>
                                    <Save size={20} />
                                    {isEditing ? "Update Category" : "Save Category"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Table (7 Columns) */}
                    <div className="lg:col-span-7 bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden h-fit">
                        <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <h2 className="text-xl font-bold flex items-center gap-3">
                                <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                                Categories
                            </h2>

                            {/* FILTER BUTTONS */}
                            <div className="flex bg-slate-100 p-1 rounded-xl">
                                {["All", "Men", "Women"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setFilterSection(tab)}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filterSection === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                <tr className="bg-slate-50/50 text-slate-400 uppercase text-[10px] tracking-[0.2em] font-black border-b border-slate-100">
                                    <th className="px-8 py-5">ID</th>
                                    <th className="px-8 py-5">Category Name</th>
                                    <th className="px-8 py-5">Section</th>
                                    <th className="px-8 py-5 text-right">Action</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                {filteredData.map((item) => (
                                    <tr key={item.id} className="group hover:bg-blue-50/30 transition-colors">
                                        <td className="px-8 py-5">
                                            <span className="text-xs font-mono font-bold text-slate-400">#{item.id.toString().padStart(3, '0')}</span>
                                        </td>
                                        <td className="px-8 py-5 font-bold text-slate-700">{item.name}</td>
                                        <td className="px-8 py-5">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${item.section === 'Men' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-pink-50 text-pink-600 border-pink-100'}`}>
                                                    {item.section}
                                                </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button onClick={() => handleEdit(item)} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 transition-all">
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