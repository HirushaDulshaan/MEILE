"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {email} from "valibot";
import {emailAddress} from "fast-check";

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch("/api/login", {
            method: "POST",
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const user = await response.json();
            alert(`Welcome back, ${user.name}!`);
            router.push("/shop"); // Login වුණාම shop එකට යවනවා
        } else {
            alert("Login Failed! Check email or password.");
            console.log("Login Attempt Data:", formData);        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center">Login to Meili</h2>

                <input
                    type="email" placeholder="Email" required
                    className="w-full p-3 mb-4 border rounded-lg outline-none focus:border-blue-500"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                />

                <input
                    type="password" placeholder="Password" required
                    className="w-full p-3 mb-6 border rounded-lg outline-none focus:border-blue-500"
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                />

                <button className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition">
                    Login
                </button>

                <p className="text-center mt-4 text-sm text-gray-600">
                    Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Register</a>
                </p>
            </form>
        </div>
    );
}