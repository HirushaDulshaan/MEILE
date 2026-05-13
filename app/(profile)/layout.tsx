import React from "react";
 import Navbar from "@/components/Navbar";
 import Footer from "@/components/Footer";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-[#F8FAFC] min-h-screen">
             <Navbar />

            <main>
                {children}
            </main>

             <Footer />
        </div>
    );
}