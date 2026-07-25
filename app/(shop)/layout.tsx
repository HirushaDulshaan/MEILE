import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatBubble from "@/components/AIChatBubble"; // Path එක අනුව adjust කරගන්න



export default function ShopLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main>
                {children}
                <AIChatBubble />
            </main>
            <Footer />
        </>
    );
}