"use client";

import React, { useState, useEffect } from "react";
import { useUserStore } from "@/app/hooks/use-user-store";
import { profileSchema } from "@/lib/validations/auth";
import toast from "react-hot-toast";
import { AlertCircle, Loader2 } from "lucide-react";

const InputField = ({ label, name, value, onChange, error, type = "text", fullWidth = false }: any) => (
    <div className={`space-y-1 ${fullWidth ? "md:col-span-2" : ""}`}>
        <label className={`text-[10px] font-black uppercase tracking-widest ml-2 ${error ? 'text-rose-500' : 'text-slate-400'}`}>
            {label}
        </label>
        <input
            suppressHydrationWarning
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full p-4 bg-slate-50 border ${error ? 'border-rose-500' : 'border-slate-100'} rounded-2xl font-bold text-slate-700 outline-none focus:border-blue-600 focus:bg-white transition-all text-sm`}
            placeholder={`Enter ${label}`}
        />
        {error && (
            <p className="text-rose-500 text-[9px] font-black uppercase tracking-tight flex items-center gap-1 mt-1 ml-2">
                <AlertCircle size={10} /> {error[0]}
            </p>
        )}
    </div>
);

export default function ProfileContent() {
    const [mounted, setMounted] = useState(false);
    const { user, setUser } = useUserStore();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<any>({});

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        contact: "",
        address1: "",
        address2: "",
        city: "",
        postalCode: ""
    });

    useEffect(() => {
        setMounted(true);
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                contact: user.contact || "",
                address1: user.address1 || "",
                address2: user.address2 || "",
                city: user.city || "",
                postalCode: user.postalCode || "",
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!user?.id) return;
        setErrors({});

        const validation = profileSchema.safeParse(formData);
        if (!validation.success) {
            setErrors(validation.error.flatten().fieldErrors);
            toast.error("Please check the highlighted fields.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: user.id,
                    ...formData
                }),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setUser(updatedUser);
                toast.success("Profile Updated Successfully! 🚀");
            } else {
                const errorText = await response.text();
                toast.error(errorText || "Update failed");
            }
        } catch (error) {
            toast.error("Network error!");
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-6 border-b pb-4">
                Edit Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} error={errors.firstName} />
                <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} error={errors.lastName} />
                <InputField label="Email Address" name="email" value={formData.email} type="email" fullWidth onChange={handleChange} error={errors.email} />
                <InputField label="Mobile Number" name="contact" value={formData.contact} fullWidth onChange={handleChange} error={errors.contact} />
                <InputField label="Address Line 1" name="address1" value={formData.address1} fullWidth onChange={handleChange} error={errors.address1} />
                <InputField label="Address Line 2" name="address2" value={formData.address2} fullWidth onChange={handleChange} error={errors.address2} />
                <InputField label="City" name="city" value={formData.city} onChange={handleChange} error={errors.city} />
                <InputField label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleChange} error={errors.postalCode} />
            </div>

            <div className="mt-10 flex gap-4">
                <button
                    disabled={loading}
                    onClick={handleSave}
                    className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-blue-100 flex items-center gap-2"
                >
                    {loading && <Loader2 className="animate-spin" size={14} />}
                    Save Changes
                </button>
                <button className="bg-white text-slate-400 border border-slate-100 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
                    Cancel
                </button>
            </div>
        </div>
    );
}