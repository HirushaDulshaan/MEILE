"use client";

import React, { useState, useEffect } from "react";
import { useUserStore } from "@/app/hooks/use-user-store";

// ✅ 1. InputField එක ප්‍රධාන function එකෙන් එළියට ගත්තා.
// දැන් මේක හැමවෙලේම re-render වෙන්නේ නැති නිසා focus එක නැති වෙන්නේ නැහැ.
const InputField = ({ label, name, value, onChange, type = "text", fullWidth = false }: any) => (
    <div className={`space-y-1 ${fullWidth ? "md:col-span-2" : ""}`}>
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:border-blue-600 focus:bg-white transition-all text-sm"
            placeholder={`Enter ${label}`}
        />
    </div>
);

export default function ProfileContent() {
    const { user } = useUserStore();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        address1: "",
        address2: "",
        city: "",
        postalCode: ""
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                mobile: user.contact || "",
                address1: user.address1 || "",
                address2: user.address2 || "",
                city: user.city || "",
                postalCode: user.postalCode || "",
            }));
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!user?.id) return;

        try {
            const response = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    ...formData
                }),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                useUserStore.getState().setUser(updatedUser);
                alert("Profile & Address updated successfully! ✅");
            } else {
                alert("Failed to update profile.");
            }
        } catch (error) {
            console.error("Update error:", error);
            alert("Something went wrong!");
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-6 border-b pb-4">
                Edit Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
                <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
                <InputField label="Email Address" name="email" value={formData.email} type="email" fullWidth onChange={handleChange} />
                <InputField label="Mobile Number" name="mobile" value={formData.mobile} fullWidth onChange={handleChange} />
                <InputField label="Address Line 1" name="address1" value={formData.address1} fullWidth onChange={handleChange} />
                <InputField label="Address Line 2" name="address2" value={formData.address2} fullWidth onChange={handleChange} />
                <InputField label="City" name="city" value={formData.city} onChange={handleChange} />
                <InputField label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleChange} />
            </div>

            <div className="mt-10 flex gap-4">
                <button
                    onClick={handleSave}
                    className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-blue-100"
                >
                    Save Changes
                </button>
                <button className="bg-white text-slate-400 border border-slate-100 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
                    Cancel
                </button>
            </div>
        </div>
    );
}