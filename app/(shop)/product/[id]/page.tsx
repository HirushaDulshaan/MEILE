"use client";
import {use, useEffect, useState} from "react";
import {Loader2, ShoppingCart} from "lucide-react";
import { useCart} from "@/app/hooks/use-cart";

export default function SingleProductView({params}: { params: Promise<{ id: string }> }) {
    const {id} = use(params);
    const cart = useCart();

    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState("");
    const [selectedSize, setSelectedSize] = useState<number | null>(null);



    useEffect(() => {
        if (!id) return;
        fetch(`/api/products/${id}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                if (data.images?.length > 0) setSelectedImage(data.images[0].url);
                setLoading(false);
            })
            .catch(err => console.error("Error:", err));
    }, [id]);


    const onAddToCart = () => {
        // 1. කලින් Select කරපු stock එක හොයාගන්නවා
        const selectedStock = product.stocks.find((s: any) => s.id === selectedSize);

        if (!selectedSize || !selectedStock) {
            alert("Please select the size");
            return;
        }

        cart.addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0]?.url,
            size: selectedStock.size.sizeCode, // UI එකේ පෙන්වන්න (උදා: UK 10)

            // ✅ ඉතාම වැදගත්: සැබෑ Size ID එක (Prisma Size Table ID එක) මෙතනින් යවනවා
            sizeId: selectedStock.sizeId,

            qty: 1
        });

        // Optional: පොඩි success message එකක්
        // alert("Added to cart!");
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2
        className="animate-spin text-blue-600" size={40}/></div>;
    if (!product) return <div className="text-center py-20 font-bold">Product not found!</div>;

    return (
        <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20 font-sans text-slate-900">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* LEFT: Image Gallery (Span 7 out of 12) */}
                <div className="lg:col-span-7 flex flex-row gap-4">

                    {/* Main Image View */}
                    <div
                        className="flex-1 aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-slate-200 bg-white shadow-sm">
                        <img
                            src={selectedImage}
                            className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                            alt={product.name}
                        />
                    </div>

                    {/* Vertical Thumbnails (Right/Left side) */}
                    <div className="flex flex-col gap-4 w-24 md:w-32">
                        {product.images.map((img: any, i: number) => (
                            <button
                                key={i}
                                onClick={() => setSelectedImage(img.url)}
                                className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all p-1 bg-white ${selectedImage === img.url ? 'border-blue-600 shadow-md scale-105' : 'border-slate-100 hover:border-slate-300'}`}
                            >
                                <img src={img.url} className="w-full h-full object-cover rounded-xl"/>
                            </button>
                        ))}
                    </div>
                </div>

                {/* RIGHT: Product Details (Span 5 out of 12) */}
                <div className="lg:col-span-5 space-y-8">
                    <div>
                        <span
                            className="bg-blue-50 text-blue-600 font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100">
                            {product.category.name}
                        </span>
                        <h1 className="text-4xl font-black text-slate-900 mt-4 uppercase tracking-tighter">
                            {product.name}
                        </h1>
                        <p className="text-3xl font-bold text-slate-900 mt-4">
                            LKR {product.price.toLocaleString()}
                        </p>
                    </div>

                    <div className="h-px bg-slate-100 w-full"/>

                    <p className="text-slate-500 leading-relaxed text-sm">
                        {product.description}
                    </p>

                    {/* Colors Selection */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Available
                            Colors</h3>
                        <div className="flex gap-3">
                            {product.colors.map((c: any) => (
                                <div key={c.id} className="group relative">
                                    <div
                                        className="w-8 h-8 rounded-full border-2 border-white ring-1 ring-slate-200 cursor-pointer shadow-sm"
                                        style={{backgroundColor: c.hexCode}}
                                    />
                                    <span
                                        className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-500 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all">
                                        {c.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sizes Selection */}
                    <div className="space-y-4 pt-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Select Size</h3>
                        <div className="flex flex-wrap gap-2">
                            {product.stocks.map((s: any) => (
                                <button
                                    key={s.id}
                                    disabled={s.qty === 0}
                                    onClick={() => setSelectedSize(s.id)} // Hirusha, මෙතනින් තමයි ID එක Save කරගන්නේ
                                    className={`min-w-[80px] py-3 rounded-xl border-2 font-bold text-sm transition-all
                    ${s.qty === 0
                                        ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                                        : selectedSize === s.id
                                            ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-105' // Select වුණාම පේන විදිහ
                                            : 'border-slate-100 bg-white text-slate-600 hover:border-blue-600 hover:text-blue-600 active:scale-95'
                                    }`}
                                >
                                    {s.size.sizeCode}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-6">
                        <button onClick={onAddToCart}
                            className="w-full bg-slate-900 text-white font-bold py-5 rounded-[1.5rem] flex items-center justify-center gap-3 hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-slate-200 group">
                            <ShoppingCart size={20} className="group-hover:animate-bounce"/>
                            ADD TO SHOPPING BAG
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}