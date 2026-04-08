import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
        // මේ tags දෙක අනිවාර්යයෙන්ම මෙතන තියෙන්න ඕනේ
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children} {/* මෙතනට තමයි අර (shop) සහ (dashboard) layouts ටික ඇවිත් වාඩි වෙන්නේ */}
        </body>
        </html>
    );
}