"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import { useWishlist } from "@/app/hooks/use-wishlist"; // 👈 Hook එක import කරන්න

interface ProductCardProps {
    data: {
        id: string;
        name: string;
        price: number;
        description?: string;
        category: { name: string };
        images: { url: string }[];
    };
    index?: number;
}

export default function ProductCard({ data, index = 0 }: ProductCardProps) {
    const wishlist = useWishlist();
    const mainImage = data.images[0]?.url || "/placeholder.jpg";

    // ✅ දැනටමත් Wishlist එකේ තියෙනවද බලන්න
    const isWishlisted = wishlist.items.some((item) => item.id === data.id);

    const onWishlistClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isWishlisted) {
            wishlist.removeItem(data.id);
        } else {
            wishlist.addItem({
                id: data.id,
                name: data.name,
                price: data.price,
                image: mainImage,
            });
        }
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

                        {/* ✅ Heart Button with Dynamic Color */}
                        <div className="absolute top-4 right-4 opacity-0 transform translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                            <button
                                onClick={onWishlistClick}
                                className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition-all group/heart"
                            >
                                <Heart
                                    size={18}
                                    className={`transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-900 group-hover/heart:text-red-500'}`}
                                />
                            </button>
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

                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1 text-opacity-70">Price</span>
                                <span className="text-[16px] font-black text-slate-900 tracking-tighter">
                                    LKR {data.price.toLocaleString()}
                                </span>
                            </div>

                            {/* Action Icon */}
                            <div className="h-10 w-10 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300">
                                <Plus size={18} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}