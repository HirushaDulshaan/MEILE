import AdminNavbar from "@/components/AdminNavbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <main className="flex-1">
                <AdminNavbar/>

                {children}
            </main>
        </div>
    );
}