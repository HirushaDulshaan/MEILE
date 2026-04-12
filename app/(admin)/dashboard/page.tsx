export default function AdminDashboard() {
    return (
        <div className="p-10 max-w-7xl mx-auto">
            <h1 className="text-4xl font-black mb-10">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Quick Links */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition">
                    <h2 className="text-xl font-bold mb-4 text-blue-600">Products</h2>
                    <p className="text-gray-500 mb-6 text-sm">Add, Edit or Remove items from your shop.</p>
                    <a href="/admin/products" className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold">Manage</a>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition">
                    <h2 className="text-xl font-bold mb-4 text-green-600">Categories</h2>
                    <p className="text-gray-500 mb-6 text-sm">Organize products into different groups.</p>
                    <a href="/admin/categories" className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold">Manage</a>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition">
                    <h2 className="text-xl font-bold mb-4 text-purple-600">Orders</h2>
                    <p className="text-gray-500 mb-6 text-sm">View and manage customer purchases.</p>
                    <button className="bg-gray-200 text-gray-500 px-4 py-2 rounded-lg text-sm font-semibold cursor-not-allowed">Coming Soon</button>
                </div>
            </div>
        </div>
    );
}
///this is dashboard page.tsx eka