"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchResults = async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }
            setLoading(true);
            try {
                const res = await fetch(`/api/search?q=${query}`);
                const data = await res.json();
                setResults(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchResults, 300); // Debounce: typing ඉවර වෙලා පොඩි වෙලාවකින් fetch කරනවා
        return () => clearTimeout(timeoutId);
    }, [query]);

    // SearchBar.tsx ඇතුළේ Dropdown එක තියෙන තැන මේ විදිහට වෙනස් කරන්න

    return (
        <div className="relative w-full max-w-md">
            <div className="relative flex items-center">
                <Search className="absolute left-4 text-slate-400" size={18} />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for styles..."
                    className="w-full bg-white/10 border border-white/20 rounded-2xl py-3 pl-12 pr-10 text-sm font-bold outline-none focus:bg-white focus:text-slate-900 transition-all text-white"
                />
                {query && (
                    <button onClick={() => setQuery("")} className="absolute right-3 p-1 hover:bg-white/20 rounded-full">
                        <X size={14} className="text-white" />
                    </button>
                )}
            </div>

            {/* SEARCH RESULTS DROPDOWN - Responsive & Centered */}
            {results.length > 0 && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 md:left-auto md:right-0 md:translate-x-0 mt-4 w-[90vw] max-w-[350px] md:w-[450px] bg-white rounded-[2rem] border border-slate-100 shadow-2xl p-4 z-[100] animate-in fade-in zoom-in-95 duration-200">

                    <div className="flex items-center justify-between mb-4 px-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Search Results</span>
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{results.length} Found</span>
                    </div>

                    <div className="max-h-[60vh] md:max-h-[400px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
                        {results.map((product) => (
                            <button
                                key={product.id}
                                onClick={() => {
                                    router.push(`/product/${product.id}`);
                                    setQuery("");
                                }}
                                className="flex items-center gap-4 w-full p-3 hover:bg-slate-50 rounded-2xl transition-all group border border-transparent hover:border-slate-100"
                            >
                                <div className="w-14 h-16 bg-slate-100 rounded-xl overflow-hidden shrink-0 shadow-sm">
                                    <Image
                                        src={product.images[0]?.url}
                                        alt={product.name}
                                        width={56}
                                        height={64}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="flex-1 text-left">
                                    <h4 className="text-sm font-black text-slate-900 truncate uppercase leading-tight">{product.name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{product.category.name}</span>
                                        <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                        <span className="text-xs font-black text-blue-600">LKR {product.price.toLocaleString()}</span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}