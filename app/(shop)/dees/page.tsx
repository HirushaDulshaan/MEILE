"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import Hero from "@/components/Hero";
import NewArrivals from "@/components/NewArrivals";
import MostSelling from "@/components/MostSelling";

export default function Home() {

    useEffect(() => {
        const name = sessionStorage.getItem("loginSuccess");
        if (name) {
            sessionStorage.removeItem("loginSuccess");
            toast.success(`Welcome back, ${name}!`, {
                duration: 4000,
                icon: '🚀',
                style: {
                    borderRadius: '12px',
                    background: '#1e293b',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    border: '1px solid #334155'
                },
            });
        }
    }, []);

    return (
        <main>
            <Hero />
            <NewArrivals />
            <MostSelling />
        </main>
    );
}