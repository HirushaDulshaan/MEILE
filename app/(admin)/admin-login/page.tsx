"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ShieldCheck, AlertCircle } from "lucide-react";
import { adminLoginSchema } from "@/lib/validations/admin";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const validation = adminLoginSchema.safeParse({ email, password });

        if (!validation.success) {
            const formattedErrors = validation.error.flatten().fieldErrors;
            setErrors(formattedErrors);
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                router.push("/dashboard");
            } else {
                const errorData = await res.json();
                alert(errorData.message || "Login Failed! Please check your admin credentials.");
            }
        } catch (error) {
            alert("Something went wrong. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6 font-sans">
            <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl border border-slate-100 p-12 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-50" />

                <div className="relative z-10">
                    <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white mb-8 shadow-xl shadow-blue-200">
                        <ShieldCheck size={32} />
                    </div>

                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">Admin <span className="text-blue-600">Portal</span></h1>
                    <p className="text-slate-400 text-sm font-medium mb-10">Please enter your credentials to access the management panel.</p>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.email ? 'text-rose-500' : 'text-slate-400'}`} size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full pl-12 pr-4 py-4 bg-slate-50 border ${errors.email ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-slate-100'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-sm transition-all`}
                                    placeholder="admin@dees.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-rose-500 text-[10px] font-black uppercase tracking-tight flex items-center gap-1 mt-1 ml-1 animate-in fade-in slide-in-from-top-1">
                                    <AlertCircle size={12} /> {errors.email[0]}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Password</label>
                            <div className="relative">
                                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.password ? 'text-rose-500' : 'text-slate-400'}`} size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full pl-12 pr-4 py-4 bg-slate-50 border ${errors.password ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-slate-100'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-sm transition-all`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && (
                                <p className="text-rose-500 text-[10px] font-black uppercase tracking-tight flex items-center gap-1 mt-1 ml-1 animate-in fade-in slide-in-from-top-1">
                                    <AlertCircle size={12} /> {errors.password[0]}
                                </p>
                            )}
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-blue-600 active:scale-[0.98] transition-all uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Verifying..." : "Access Dashboard"}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}