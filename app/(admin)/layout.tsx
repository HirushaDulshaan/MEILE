"use client";

import { usePathname } from "next/navigation";
import AdminNavbar from "@/components/AdminNavbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const isLoginPage = pathname === "/admin-login";

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">
            <main className="flex-1">
                {!isLoginPage && <AdminNavbar />}

                <div className={!isLoginPage ? "p-0" : ""}>
                    {children}
                </div>
            </main>
        </div>
    );
}