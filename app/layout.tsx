import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast"; // 👈 මේක අනිවාර්යයෙන්ම ඕනේ

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "M E I L I",
    description: "E-commerce store",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        // ✅ suppressHydrationWarning ඇඩ් කරන්න.
        // එතකොට browser extensions නිසා එන attributes වල පරස්පරතා Next.js නොසලකා හරිනවා.
        <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
                style: {
                    zIndex: 9999,
                }
            }}
        />
        {children}
        </body>
        </html>
    );
}