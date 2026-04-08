"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // api/register කියන එක ඔයාගේ screenshot එකේ තියෙන spelling එකට ගැලපෙන්න මෙතන දුන්නා
        const response = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            alert("Registration Successful!");
            router.push("/shop"); // වැඩේ හරි නම් shop එකට යවනවා
        } else {
            alert("Something went wrong!");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                <h2 className="text-3xl font-extrabold mb-8 text-center text-slate-800">Create Account</h2>

                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Full Name</label>
                        <input
                            required
                            type="text" placeholder="John Doe"
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Email Address</label>
                        <input
                            required
                            type="email" placeholder="name@example.com"
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Password</label>
                        <input
                            required
                            type="password" placeholder="••••••••"
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold mt-8 hover:bg-blue-700 active:scale-95 transition-all shadow-lg">
                    Sign Up
                </button>
            </form>
        </div>
    );
}