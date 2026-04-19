"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserStore } from "@/app/hooks/use-user-store";
import { registerSchema } from "@/lib/validations/auth"; // Schema එක import කරන්න
import { AlertCircle } from "lucide-react";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        contact: "",
        password: ""
    });
    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);

    const setUser = useUserStore((state) => state.setUser);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        // 1. Client-side Validation
        const validation = registerSchema.safeParse(formData);
        if (!validation.success) {
            setErrors(validation.error.flatten().fieldErrors);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const newUser = await response.json();
                setUser(newUser);
                alert("Welcome to Dees!");
                router.push("/dees");
            } else {
                const errorData = await response.text();
                alert(errorData || "Something went wrong!");
            }
        } catch (error) {
            alert("Connection error!");
        } finally {
            setLoading(false);
        }
    };

    // Error Message පෙන්වන Component එක
    const ErrorMsg = ({ field }: { field: string }) => (
        errors[field] ? (
            <p className="text-rose-500 text-[9px] font-black uppercase tracking-tight flex items-center gap-1 mt-1 ml-2">
                <AlertCircle size={10} /> {errors[field][0]}
            </p>
        ) : null
    );

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#F8FAFC] p-4 font-sans">
            <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl w-full max-w-lg border border-slate-100">
                <h2 className="text-3xl font-black mb-2 text-slate-900 uppercase tracking-tighter">Create Account</h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">Join the Dees community</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* First Name */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">First Name</label>
                        <input
                            type="text" placeholder="Sahan"
                            className={`w-full p-4 bg-slate-50 border ${errors.firstName ? 'border-rose-500' : 'border-slate-100'} rounded-2xl font-bold text-sm outline-none transition-all`}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        />
                        <ErrorMsg field="firstName" />
                    </div>

                    {/* Last Name */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Last Name</label>
                        <input
                            type="text" placeholder="Perera"
                            className={`w-full p-4 bg-slate-50 border ${errors.lastName ? 'border-rose-500' : 'border-slate-100'} rounded-2xl font-bold text-sm outline-none transition-all`}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        />
                        <ErrorMsg field="lastName" />
                    </div>

                    {/* Email */}
                    <div className="md:col-span-2 space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
                        <input
                            type="email" placeholder="name@example.com"
                            className={`w-full p-4 bg-slate-50 border ${errors.email ? 'border-rose-500' : 'border-slate-100'} rounded-2xl font-bold text-sm outline-none transition-all`}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                        <ErrorMsg field="email" />
                    </div>

                    {/* Contact Number */}
                    <div className="md:col-span-2 space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Contact Number</label>
                        <input
                            type="tel" placeholder="0771234567"
                            className={`w-full p-4 bg-slate-50 border ${errors.contact ? 'border-rose-500' : 'border-slate-100'} rounded-2xl font-bold text-sm outline-none transition-all`}
                            onChange={(e) => setFormData({...formData, contact: e.target.value})}
                        />
                        <ErrorMsg field="contact" />
                    </div>

                    {/* Password */}
                    <div className="md:col-span-2 space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Password</label>
                        <input
                            type="password" placeholder="••••••••"
                            className={`w-full p-4 bg-slate-50 border ${errors.password ? 'border-rose-500' : 'border-slate-100'} rounded-2xl font-bold text-sm outline-none transition-all`}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                        <ErrorMsg field="password" />
                    </div>
                </div>

                <button
                    disabled={loading}
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] mt-8 hover:bg-blue-600 transition-all shadow-lg disabled:bg-slate-400"
                >
                    {loading ? "Creating Account..." : "Sign Up Now"}
                </button>

                <p className="text-center mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
                </p>
            </form>
        </div>
    );
}