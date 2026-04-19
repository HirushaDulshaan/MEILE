import React from "react";
 import Navbar from "@/components/Navbar"; // ඔයාගේ Navbar එක මෙතනට ගන්න
 import Footer from "@/components/Footer"; // ඔයාගේ Footer එක මෙතනට ගන්න

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-[#F8FAFC] min-h-screen">
             <Navbar />

            <main>
                {children} {/* මෙතනට තමයි අර page.tsx එකේ කෝඩ් එක එන්නේ */}
            </main>

             <Footer />
        </div>
    );
}