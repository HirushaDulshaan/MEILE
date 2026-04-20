import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// 💡 මෙතන ආයෙත් Fonts import කරන්න හෝ Toaster දාන්න අවශ්‍ය නැහැ.
// ඒවා Main Root Layout එකෙන් උරුම වෙනවා (Inherit).

export default function ShopLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main>
                {children}
            </main>
            <Footer />
        </>
    );
}