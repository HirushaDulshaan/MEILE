"use client";
import { useState } from "react";
import { Layers, Save, Edit, RotateCcw } from "lucide-react";

export default function SectionManagement() {
    const [formData, setFormData] = useState({
        id: null as number | null,
        sectionName: "",
    });

    const [isEditing, setIsEditing] = useState(false);

    // Table එකට Dummy Data (පස්සේ Spring Boot එකෙන් fetch කරන්න)
    const [savedSections, setSavedSections] = useState([
        { id: 1, name: "Electronics" },
        { id: 2, name: "Clothing" },
        { id: 3, name: "Shoes" },
    ]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, sectionName: e.target.value });
    };

    // Edit Button එක click කළ විට
    const handleEdit = (item: any) => {
        setIsEditing(true);
        setFormData({
            id: item.id,
            sectionName: item.name,
        });
    };

    // Form එක reset කිරීමට
    const resetForm = () => {
        setIsEditing(false);
        setFormData({ id: null, sectionName: "" });
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 text-slate-900">
            <div className="max-w-6xl mx-auto">

                {/* PAGE HEADER */}
                <header className="mb-10 text-center lg:text-left">
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
                        Section Management
                    </h1>
                    <p className="text-slate-500 mt-1">Add and manage main store sections for SmartStyle</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT SIDE: New Section Form (5 Columns) */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8 sticky top-10">
                            <div className="text-center mb-8 relative">
                                {isEditing && (
                                    <button
                                        onClick={resetForm}
                                        className="absolute right-0 top-0 p-2 text-slate-400 hover:text-blue-600 transition"
                                        title="Cancel Edit"
                                    >
                                        <RotateCcw size={20} />
                                    </button>
                                )}
                                <div className="bg-indigo-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600">
                                    <Layers size={28} />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800">
                                    {isEditing ? "Update Section" : "New Section"}
                                </h2>
                            </div>

                            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Section Name</label>
                                    <input
                                        name="sectionName"
                                        type="text"
                                        value={formData.sectionName}
                                        placeholder="e.g. Men's Fashion"
                                        onChange={handleChange}
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                                    />
                                </div>

                                <button className={`w-full text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${isEditing ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200' : 'bg-slate-900 hover:bg-black shadow-slate-200'}`}>
                                    <Save size={20} />
                                    {isEditing ? "Update Section" : "Save Section"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Sections Table (7 Columns) */}
                    <div className="lg:col-span-7 bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden h-fit">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold flex items-center gap-3 text-slate-800">
                                <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
                                Available Sections
                            </h2>
                            <span className="text-xs font-bold bg-indigo-50 px-4 py-1.5 rounded-full text-indigo-600 border border-indigo-100">
                                {savedSections.length} Total
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                <tr className="bg-slate-50/50 text-slate-400 uppercase text-[10px] tracking-[0.2em] font-black border-b border-slate-100">
                                    <th className="px-8 py-5">ID</th>
                                    <th className="px-8 py-5">Section Name</th>
                                    <th className="px-8 py-5 text-right">Action</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                {savedSections.map((item) => (
                                    <tr key={item.id} className="group hover:bg-indigo-50/30 transition-colors">
                                        <td className="px-8 py-5">
                                                <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                                                    #{item.id.toString().padStart(3, '0')}
                                                </span>
                                        </td>
                                        <td className="px-8 py-5 font-bold text-slate-700 tracking-tight">
                                            {item.name}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-md transition-all active:scale-90"
                                            >
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