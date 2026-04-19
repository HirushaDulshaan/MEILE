"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserStore } from "@/app/hooks/use-user-store";
import { Loader2, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
import { loginSchema } from "@/lib/validations/auth";
import toast from "react-hot-toast";

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<any>({});

    const setUser = useUserStore((state) => state.setUser);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const validation = loginSchema.safeParse(formData);
        if (!validation.success) {
            setErrors(validation.error.flatten().fieldErrors);
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);

                // ✅ Toast home page එකේදී show කරන්න flag set කරනවා
                sessionStorage.setItem("loginSuccess", userData.firstName);

                // Delay නැතිව direct navigate
                router.push("/dees");

            } else {
                const errorMsg = await response.text();

                toast.error(errorMsg || "Login Failed!", {
                    duration: 4000,
                    style: {
                        borderRadius: '12px',
                        color: '#ef4444',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        border: '1px solid #fee2e2'
                    }
                });
                setLoading(false);
            }
        } catch (error) {
            toast.error("Something went wrong! Check your connection.");
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#F8FAFC] p-4 font-sans">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
                        D E E S
                    </h1>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mt-2">
                        Welcome Back to Style
                    </p>
                </div>

                <form
                    onSubmit={handleLogin}
                    className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 animate-in fade-in zoom-in-95 duration-500"
                >
                    <div className="mb-8">
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Login</h2>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                            Enter your credentials
                        </p>
                    </div>

                    <div className="space-y-5">
                        {/* Email Input */}
                        <div className="space-y-1">
                            <label className={`text-[10px] font-black uppercase tracking-widest ml-2 flex items-center gap-2 ${errors.email ? 'text-rose-500' : 'text-slate-400'}`}>
                                <Mail size={12} /> Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                className={`w-full p-4 bg-slate-50 border ${errors.email ? 'border-rose-500 ring-1 ring-rose-500/10' : 'border-slate-100'} rounded-2xl font-bold text-slate-700 outline-none focus:border-blue-600 focus:bg-white transition-all text-sm`}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                            {errors.email && (
                                <p className="text-rose-500 text-[9px] font-black uppercase tracking-tight flex items-center gap-1 mt-1 ml-2">
                                    <AlertCircle size={10} /> {errors.email[0]}
                                </p>
                            )}
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1">
                            <label className={`text-[10px] font-black uppercase tracking-widest ml-2 flex items-center gap-2 ${errors.password ? 'text-rose-500' : 'text-slate-400'}`}>
                                <Lock size={12} /> Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className={`w-full p-4 bg-slate-50 border ${errors.password ? 'border-rose-500 ring-1 ring-rose-500/10' : 'border-slate-100'} rounded-2xl font-bold text-slate-700 outline-none focus:border-blue-600 focus:bg-white transition-all text-sm`}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                            {errors.password && (
                                <p className="text-rose-500 text-[9px] font-black uppercase tracking-tight flex items-center gap-1 mt-1 ml-2">
                                    <AlertCircle size={10} /> {errors.password[0]}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end mt-4">
                        <Link href="#" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] mt-8 hover:bg-blue-600 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 disabled:bg-slate-400"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <>Sign In <ArrowRight size={16} /></>}
                    </button>

                    <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            New to Dees? {" "}
                            <Link href="/register" className="text-blue-600 hover:text-slate-900 transition-colors underline-offset-4 underline font-black">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </form>

                <p className="text-center mt-10 text-[9px] font-bold text-slate-300 uppercase tracking-[0.4em]">
                    &copy; 2026 SmartStyle Premium
                </p>
            </div>
        </div>
    );
}