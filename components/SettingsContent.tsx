"use client";

import React, { useState } from "react";
import { Lock, ShieldCheck, Loader2, Send, CheckCircle2 } from "lucide-react";
import { useUserStore } from "@/app/hooks/use-user-store";
import toast from "react-hot-toast";

export default function SettingsContent() {
    const { user } = useUserStore();
    const [step, setStep] = useState(1); // 1: Request OTP, 2: Verify & Change
    const [loading, setLoading] = useState(false);

    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const handleSendOTP = async () => {
        if (!user?.email) return;
        setLoading(true);
        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                body: JSON.stringify({ email: user.email }),
            });
            if (res.ok) {
                setStep(2);
                toast.success("Verification code sent to your email!");
            } else {
                toast.error("Failed to send code.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async () => {
        if (otp.length !== 6 || !newPassword) {
            toast.error("Please fill all fields correctly.");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "PATCH",
                body: JSON.stringify({
                    userId: user?.id,
                    email: user?.email,
                    otp,
                    newPassword
                }),
            });
            if (res.ok) {
                toast.success("Password updated successfully! 🔐");
                setStep(1);
                setOtp("");
                setNewPassword("");
            } else {
                toast.error("Invalid OTP or error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-6 border-b pb-4">
                Security Settings
            </h2>

            <div className="max-w-md space-y-8">
                {/* Info Card */}
                <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 flex items-start gap-4">
                    <ShieldCheck className="text-blue-600 shrink-0" size={24} />
                    <div>
                        <h4 className="text-[11px] font-black text-blue-900 uppercase tracking-widest mb-1">Password Protection</h4>
                        <p className="text-[10px] text-blue-600/70 font-bold leading-relaxed uppercase">
                            To change your password, we need to verify your identity. A 6-digit code will be sent to your registered email.
                        </p>
                    </div>
                </div>

                {step === 1 ? (
                    /* Step 1 UI */
                    <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Registered Email</span>
                            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-400 text-sm italic">
                                {user?.email}
                            </div>
                        </div>
                        <button
                            onClick={handleSendOTP}
                            disabled={loading}
                            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={16} /> : <><Send size={14} /> Send Verification Code</>}
                        </button>
                    </div>
                ) : (
                    /* Step 2 UI */
                    <div className="space-y-5 animate-in zoom-in-95 duration-300">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Verification Code</label>
                            <input
                                type="text" maxLength={6} placeholder="000000"
                                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-xl text-center tracking-widest outline-none focus:border-blue-600"
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">New Password</label>
                            <input
                                type="password" placeholder="••••••••"
                                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:border-blue-600"
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleReset}
                                disabled={loading}
                                className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" size={16} /> : <><CheckCircle2 size={14} /> Update Password</>}
                            </button>
                            <button onClick={() => setStep(1)} className="px-6 bg-white border border-slate-100 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}