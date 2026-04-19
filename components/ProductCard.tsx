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
    index?: number;
}

export default function ProductCard({ data, index = 0 }: ProductCardProps) {
    const mainImage = data.images[0]?.url || "/placeholder.jpg";

    // ✅ Parent Link එකට යන එක නතර කරලා පසුව logic එකක් දාන්න පුළුවන්
    const onActionClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // TODO: Add to Wishlist or Cart logic here
        console.log("Action clicked for:", data.name);
    };

    return (
        <Link href={`/product/${data.id}`}>
            <div className="cursor-pointer group">
                <div className="group bg-white rounded-[2.5rem] border border-slate-100 p-3 transition-all hover:shadow-2xl hover:shadow-slate-200/60 hover:-translate-y-2 duration-500">

                    {/* Image Section */}
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-slate-100">
                        <Image
                            src={mainImage}
                            alt={data.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
                            priority={index < 4}
                            className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* ✅ Wishlist (Heart) Button Only */}
                        <div className="absolute top-4 right-4 opacity-0 transform translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                            <div
                                onClick={onActionClick}
                                className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:bg-white text-slate-900 hover:text-red-500 transition-all cursor-pointer"
                            >
                                <Heart size={20} />
                            </div>
                        </div>

                        {/* Category Tag */}
                        <div className="absolute bottom-4 left-4">
                            <span className="px-4 py-1.5 bg-white/80 backdrop-blur-md text-[9px] font-black uppercase tracking-[0.2em] rounded-full text-slate-900 border border-white/20 shadow-sm">
                                {data.category?.name || "New Arrival"}
                            </span>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="mt-5 px-3 pb-3">
                        <h3 className="text-[13px] font-black text-slate-900 truncate leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                            {data.name}
                        </h3>
                        <p className="text-[10px] text-slate-400 mt-1.5 line-clamp-1 font-bold uppercase tracking-tighter opacity-70">
                            {data.description}
                        </p>

                        <div className="mt-5 flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Price</span>
                                <span className="text-[17px] font-black text-slate-900 tracking-tighter">
                                    Rs. {data.price.toLocaleString()}
                                </span>
                            </div>

                            {/* ✅ Primary Add to Cart Button */}
                            <div
                                onClick={onActionClick}
                                className="h-11 w-11 bg-slate-900 rounded-[1rem] flex items-center justify-center text-white hover:bg-blue-600 active:scale-90 transition-all shadow-xl shadow-slate-200 cursor-pointer"
                            >
                                <ShoppingBag size={20} strokeWidth={2.5} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}