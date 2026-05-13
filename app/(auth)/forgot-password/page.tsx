"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, ArrowLeft, KeyRound } from "lucide-react";

export default function ForgotPassword() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const router = useRouter();

    //  Send OTP
    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                body: JSON.stringify({ email }),
            });
            if (res.ok) { setStep(2); toast.success("OTP sent to your email"); }
            else { toast.error("User not found or error occurred"); }
        } finally { setLoading(false); }
    };

    //  Reset Password
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                body: JSON.stringify({ email, otp, newPassword }),
            });
            if (res.ok) {
                toast.success("Password changed! Please login.");
                router.push("/login");
            } else { toast.error("Invalid OTP or error occurred"); }
        } finally { setLoading(false); }
    };

    const inputClass = "w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:border-blue-600 transition-all";

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#F8FAFC] p-4">
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl w-full max-w-md border border-slate-100">

                {step === 1 && (
                    <form onSubmit={handleSendOTP} className="animate-in fade-in duration-300">
                        <h2 className="text-2xl font-black mb-2 text-slate-900 uppercase">Forgot Password?</h2>
                        <p className="text-slate-400 text-[10px] font-bold uppercase mb-8">No worries, we'll send you reset instructions.</p>
                        <input type="email" placeholder="Enter your email" required className={inputClass} onChange={(e) => setEmail(e.target.value)} />
                        <button disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase mt-6 hover:bg-blue-600 transition-all flex justify-center items-center gap-2">
                            {loading ? <Loader2 className="animate-spin" size={14} /> : "Send Reset Code"}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={() => setStep(3)} className="animate-in fade-in duration-300">
                        <h2 className="text-2xl font-black mb-2 text-slate-900 uppercase">Verify OTP</h2>
                        <p className="text-slate-400 text-[10px] font-bold uppercase mb-8">Enter the 6-digit code sent to {email}</p>
                        <input type="text" maxLength={6} placeholder="000000" required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-2xl text-center tracking-widest outline-none" onChange={(e) => setOtp(e.target.value)} />
                        <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase mt-6">Continue</button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="animate-in fade-in duration-300">
                        <h2 className="text-2xl font-black mb-2 text-slate-900 uppercase">New Password</h2>
                        <p className="text-slate-400 text-[10px] font-bold uppercase mb-8">Set your new password to access your account.</p>
                        <input type="password" placeholder="••••••••" required className={inputClass} onChange={(e) => setNewPassword(e.target.value)} />
                        <button disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase mt-6 hover:bg-slate-900 transition-all flex justify-center items-center gap-2">
                            {loading ? <Loader2 className="animate-spin" size={14} /> : "Reset Password"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}