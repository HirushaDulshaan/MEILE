"use client";

import { useEffect, useState } from "react";
import {
    Search,
    User,
    Mail,
    Phone,
    Calendar,
    ShoppingBag,
    ShieldCheck,
    ChevronLeft,
    ChevronRight,
    XCircle
} from "lucide-react";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState<any>(null);

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/users");
            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    // Filter Logic
    const filteredUsers = users.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination Logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Customers...</p>
            </div>
        </div>
    );

    return (
        <main className="p-6 bg-[#F8FAFC] min-h-screen font-sans">
            <div className="max-w-[1600px] mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">User <span className="text-emerald-600">Base</span></h1>
                        <p className="text-slate-500 text-sm font-medium">Managing {filteredUsers.length} registered customers</p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm font-medium shadow-sm"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT: Users Table */}
                    <div className={`transition-all duration-500 ${selectedUser ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                            <div className="max-h-[650px] overflow-y-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="sticky top-0 bg-white z-20 border-b border-slate-100 shadow-sm">
                                    <tr>
                                        <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                                        <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
                                        <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Orders</th>
                                        <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Role</th>
                                        <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Joined Date</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                    {currentUsers.map((user) => (
                                        <tr
                                            key={user.id}
                                            className={`hover:bg-emerald-50/30 transition-colors cursor-pointer ${selectedUser?.id === user.id ? 'bg-emerald-50/50' : ''}`}
                                            onClick={() => setSelectedUser(user)}
                                        >
                                            <td className="p-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                                                        {user.firstName[0]}
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-900">{user.firstName} {user.lastName}</span>
                                                </div>
                                            </td>
                                            <td className="p-5 text-sm text-slate-500 font-medium">{user.email}</td>
                                            <td className="p-5 text-center">
                                                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-black">
                                                        {user._count.orders}
                                                    </span>
                                            </td>
                                            <td className="p-5 text-center">
                                                    <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md ${user.role === 'ADMIN' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
                                                        {user.role}
                                                    </span>
                                            </td>
                                            <td className="p-5 text-right text-sm text-slate-400">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Page {currentPage} of {totalPages || 1}
                                </span>
                                <div className="flex gap-2">
                                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 bg-white rounded-xl border border-slate-200 disabled:opacity-30 hover:shadow-md transition-all">
                                        <ChevronLeft size={18} />
                                    </button>
                                    <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)} className="p-2 bg-white rounded-xl border border-slate-200 disabled:opacity-30 hover:shadow-md transition-all">
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: User Detail Sidebar */}
                    {selectedUser && (
                        <div className="lg:col-span-5 animate-in slide-in-from-right-4 duration-500">
                            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8 sticky top-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-xl font-black text-slate-900 uppercase">User Profile</h2>
                                    <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-rose-500">
                                        <XCircle size={24} />
                                    </button>
                                </div>

                                <div className="flex flex-col items-center mb-8">
                                    <div className="w-24 h-24 rounded-[2rem] bg-emerald-100 flex items-center justify-center text-emerald-600 text-3xl font-black mb-4 shadow-inner">
                                        {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{selectedUser.firstName} {selectedUser.lastName}</h3>
                                    <p className="text-slate-500 font-medium">{selectedUser.role} Account</p>
                                </div>

                                <div className="space-y-4 bg-slate-50 p-6 rounded-[2rem] border border-slate-100 mb-8">
                                    <div className="flex items-center gap-4">
                                        <Mail size={18} className="text-slate-400" />
                                        <span className="text-sm font-bold text-slate-700">{selectedUser.email}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Phone size={18} className="text-slate-400" />
                                        <span className="text-sm font-bold text-slate-700">{selectedUser.contact}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Calendar size={18} className="text-slate-400" />
                                        <span className="text-sm font-bold text-slate-700">Joined {new Date(selectedUser.createdAt).toDateString()}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100 text-center">
                                        <ShoppingBag size={24} className="mx-auto text-blue-600 mb-2" />
                                        <p className="text-[10px] font-black text-blue-400 uppercase">Total Orders</p>
                                        <p className="text-2xl font-black text-blue-900">{selectedUser._count.orders}</p>
                                    </div>
                                    <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 text-center">
                                        <ShieldCheck size={24} className="mx-auto text-emerald-600 mb-2" />
                                        <p className="text-[10px] font-black text-emerald-400 uppercase">Status</p>
                                        <p className="text-lg font-black text-emerald-900 uppercase">Verified</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}