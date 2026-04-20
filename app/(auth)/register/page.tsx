"use client";

import { useState, useEffect } from "react"; // useEffect එකතු කළා
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserStore } from "@/app/hooks/use-user-store";
import { registerSchema } from "@/lib/validations/auth";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
    const [mounted, setMounted] = useState(false); // 🚀 Hydration Fix සඳහා
    const [formData, setFormData] = useState({
        firstName: "", lastName: "", email: "", contact: "", password: ""
    });

    const [showOTP, setShowOTP] = useState(false);
    const [otpCode, setOtpCode] = useState("");
    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);

    const setUser = useUserStore((state) => state.setUser);
    const router = useRouter();

    // 🚀 Component එක බ්‍රවුසර් එකේ load වුණාම විතරක් පෙන්වන්න
    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

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
                setShowOTP(true);
                toast.success("Verification code sent to your email!");
            } else {
                const errorData = await response.text();
                toast.error(errorData || "Registration failed!");
            }
        } catch (error) {
            toast.error("Connection error!");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otpCode.length !== 6) {
            toast.error("Please enter a valid 6-digit code");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/register/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, otp: otpCode }),
            });

            if (response.ok) {
                const newUser = await response.json();
                setUser(newUser);
                toast.success("Welcome to MEILI!");
                router.push("/dees");
            } else {
                toast.error("Invalid or Expired OTP!");
            }
        } catch (error) {
            toast.error("Verification failed!");
        } finally {
            setLoading(false);
        }
    };

    const ErrorMsg = ({ field }: { field: string }) => (
        errors[field] ? (
            <p className="text-rose-500 text-[9px] font-black uppercase tracking-tight flex items-center gap-1 mt-1 ml-2">
                <AlertCircle size={10} /> {errors[field][0]}
            </p>
        ) : null
    );

    // 🚀 Hydration mismatch එක සම්පූර්ණයෙන්ම නවත්වන තැන
    if (!mounted) return null;

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#F8FAFC] p-4 font-sans">
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl w-full max-w-lg border border-slate-100">

                {!showOTP ? (
                    <form onSubmit={handleSubmit}>
                        <h2 className="text-3xl font-black mb-2 text-slate-900 uppercase tracking-tighter">Create Account</h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">Join the Meili community</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">First Name</label>
                                <input suppressHydrationWarning type="text" placeholder="Sahan" className={`w-full p-4 bg-slate-50 border ${errors.firstName ? 'border-rose-500' : 'border-slate-100'} rounded-2xl font-bold text-sm outline-none transition-all`} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                                <ErrorMsg field="firstName" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Last Name</label>
                                <input suppressHydrationWarning type="text" placeholder="Perera" className={`w-full p-4 bg-slate-50 border ${errors.lastName ? 'border-rose-500' : 'border-slate-100'} rounded-2xl font-bold text-sm outline-none transition-all`} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                                <ErrorMsg field="lastName" />
                            </div>
                            <div className="md:col-span-2 space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
                                <input suppressHydrationWarning type="email" placeholder="name@example.com" className={`w-full p-4 bg-slate-50 border ${errors.email ? 'border-rose-500' : 'border-slate-100'} rounded-2xl font-bold text-sm outline-none transition-all`} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                                <ErrorMsg field="email" />
                            </div>
                            <div className="md:col-span-2 space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Contact Number</label>
                                <input suppressHydrationWarning type="tel" placeholder="0771234567" className={`w-full p-4 bg-slate-50 border ${errors.contact ? 'border-rose-500' : 'border-slate-100'} rounded-2xl font-bold text-sm outline-none transition-all`} onChange={(e) => setFormData({...formData, contact: e.target.value})} />
                                <ErrorMsg field="contact" />
                            </div>
                            <div className="md:col-span-2 space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Password</label>
                                <input suppressHydrationWarning type="password" placeholder="••••••••" className={`w-full p-4 bg-slate-50 border ${errors.password ? 'border-rose-500' : 'border-slate-100'} rounded-2xl font-bold text-sm outline-none transition-all`} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                                <ErrorMsg field="password" />
                            </div>
                        </div>

                        <button suppressHydrationWarning disabled={loading} type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] mt-8 hover:bg-blue-600 transition-all shadow-lg disabled:bg-slate-400 flex justify-center items-center gap-2">
                            {loading ? <Loader2 size={16} className="animate-spin" /> : "Sign Up Now"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOTP} className="animate-in fade-in zoom-in duration-300">
                        <button type="button" onClick={() => setShowOTP(false)} className="mb-6 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-all">
                            <ArrowLeft size={14} /> Back to edit
                        </button>
                        <h2 className="text-3xl font-black mb-2 text-slate-900 uppercase tracking-tighter">Verify Email</h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8 leading-relaxed">
                            Enter the 6-digit code sent to <br /><span className="text-blue-600">{formData.email}</span>
                        </p>

                        <div className="space-y-4">
                            <input
                                suppressHydrationWarning
                                type="text"
                                maxLength={6}
                                placeholder="000000"
                                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-3xl font-black text-3xl text-center tracking-[0.5em] text-blue-600 outline-none focus:border-blue-600 transition-all"
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value)}
                            />
                            <p className="text-[9px] font-black text-center text-slate-400 uppercase tracking-widest">
                                Didn't receive the code? <button type="button" onClick={handleSubmit} className="text-blue-600 hover:underline">Resend</button>
                            </p>
                        </div>

                        <button suppressHydrationWarning disabled={loading} type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] mt-8 hover:bg-slate-900 transition-all shadow-xl shadow-blue-100 flex justify-center items-center gap-2">
                            {loading ? <Loader2 size={16} className="animate-spin" /> : "Verify & Create Account"}
                        </button>
                    </form>
                )}

                <p className="text-center mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
}