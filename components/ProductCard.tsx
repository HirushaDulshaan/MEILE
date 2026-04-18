"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";

interface ProductCardProps {
    data: {
        id: string;
        name: string;
        price: number;
        description: string;
        category: { name: string };
        images: { url: string }[];
    };
    index?: number; // 👈 Index එක pass කරනවා priority එක තීරණය කරන්න
}

export default function ProductCard({ data, index = 0 }: ProductCardProps) {
    const mainImage = data.images[0]?.url || "/placeholder.jpg";

    return (
        <Link href={`/product/${data.id}`}>
            <div className="cursor-pointer group">
                <div className="group bg-white rounded-3xl border border-slate-100 p-3 transition-all hover:shadow-2xl hover:shadow-slate-200/60 hover:-translate-y-1">

                    {/* Image Section */}
                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-100">
                        <Image
                            src={mainImage}
                            alt={data.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
                            // මුල් product 5 ට විතරක් priority true කරනවා LCP warning එක නැති කරන්න
                            priority={index < 5}
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />

                        {/* Badges & Actions */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 transform translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                            <button className="p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:bg-white text-slate-900 transition-colors">
                                <Heart size={18} />
                            </button>
                            <button className="p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:bg-white text-slate-900 transition-colors">
                                <ShoppingBag size={18} />
                            </button>
                        </div>

                        {/* Category Tag */}
                        <div className="absolute bottom-3 left-3">
                            <span className="px-3 py-1 bg-white/80 backdrop-blur-md text-[10px] font-black uppercase tracking-widest rounded-full text-slate-800 border border-white/20">
                                {data.category?.name || "Global"}
                            </span>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="mt-4 px-2 pb-2 text-slate-950">
                        <h3 className="text-sm font-bold text-slate-800 truncate leading-tight group-hover:text-blue-600 transition-colors uppercase">
                            {data.name}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-1 font-medium">
                            {data.description}
                        </p>

                        <div className="mt-3 flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Price</span>
                                <span className="text-base font-black text-slate-900 tracking-tighter">
                                    Rs. {data.price.toLocaleString()}
                                </span>
                            </div>

                            <button className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center text-white hover:bg-blue-600 active:scale-90 transition-all shadow-lg shadow-slate-200">
                                <ShoppingBag size={18} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}