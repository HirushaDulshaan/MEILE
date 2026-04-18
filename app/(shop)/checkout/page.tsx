"use client";
import React, { useState } from "react";
import { useCart } from "@/app/hooks/use-cart";
import { ChevronLeft, CreditCard, Truck, ShieldCheck, ReceiptText } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
    const cart = useCart();

    const [shippingData, setShippingData] = useState({
        firstName: "", lastName: "", email: "", address: "", city: "", phone: "",
    });

    const [billingData, setBillingData] = useState({
        firstName: "", lastName: "", email: "", address: "", city: "", phone: "",
    });

    const [sameAsShipping, setSameAsShipping] = useState(false);

    const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShippingData(prev => ({ ...prev, [name]: value }));
        if (sameAsShipping) {
            setBillingData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBillingData({ ...billingData, [e.target.name]: e.target.value });
    };

    const toggleSameAsShipping = () => {
        const nextState = !sameAsShipping;
        setSameAsShipping(nextState);
        if (nextState) {
            setBillingData({ ...shippingData });
        }
    };

    const subtotal = cart.items.reduce((acc, item) => acc + item.price * item.qty, 0);
    const delivery = 350;
    const total = subtotal + delivery;

    const onPlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: cart.items,
                    email: shippingData.email,
                }),
            });

            const data = await response.json();

            if (data.url) {
                // Stripe Checkout Page එකට User ව යවනවා
                window.location.href = data.url;
            } else {
                alert("Payment failed to initialize.");
            }
        } catch (error) {
            console.error("STRIPE_ERROR", error);
            alert("Something went wrong!");
        }
    };

    if (cart.items.length === 0) return <div className="min-h-screen flex flex-col items-center justify-center font-bold">Your cart is empty!</div>;

    // Reusable input class to keep code clean and fix the white text issue
    const inputClass = "w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-600 text-slate-950 placeholder:text-slate-400 transition-all font-medium";

    return (
        <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20 font-sans min-h-screen">
            <Link href="/cart" className="flex items-center gap-2 text-slate-500 hover:text-black transition-all mb-8 w-fit font-bold">
                <ChevronLeft size={18} /> BACK TO CART
            </Link>

            <form onSubmit={onPlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-7 space-y-12">

                    {/* SHIPPING SECTION */}
                    <section>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-6 flex items-center gap-3">
                            <Truck size={24} className="text-blue-600" /> Shipping Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6"> {/* gap-y-6 දැම්මා label එකට ඉඩ තියන්න */}

                            {/* First Name */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">First Name</label>
                                <input type="text" name="firstName" placeholder="First Name" required value={shippingData.firstName} onChange={handleShippingChange} className={inputClass} />
                            </div>

                            {/* Last Name */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Last Name</label>
                                <input type="text" name="lastName" placeholder="Last Name" required value={shippingData.lastName} onChange={handleShippingChange} className={inputClass} />
                            </div>

                            {/* Email Address */}
                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Email Address</label>
                                <input type="email" name="email" placeholder="Email Address" required value={shippingData.email} onChange={handleShippingChange} className={inputClass} />
                            </div>

                            {/* Shipping Address */}
                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Shipping Address</label>
                                <input type="text" name="address" placeholder="Shipping Address" required value={shippingData.address} onChange={handleShippingChange} className={inputClass} />
                            </div>

                            {/* City */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">City</label>
                                <input type="text" name="city" placeholder="City" required value={shippingData.city} onChange={handleShippingChange} className={inputClass} />
                            </div>

                            {/* Phone Number */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Phone Number</label>
                                <input type="tel" name="phone" placeholder="Phone Number" required value={shippingData.phone} onChange={handleShippingChange} className={inputClass} />
                            </div>

                        </div>
                    </section>

                    {/* TOGGLE CHECKBOX */}
                    <div className="flex items-center gap-3 bg-slate-100 p-4 rounded-2xl cursor-pointer hover:bg-slate-200 transition-all shadow-sm" onClick={toggleSameAsShipping}>
                        <input type="checkbox" checked={sameAsShipping} onChange={toggleSameAsShipping} className="w-5 h-5 accent-blue-600 cursor-pointer" />
                        <span className="text-sm font-bold text-slate-700 select-none uppercase tracking-wider">"Billing address same as shipping"</span>
                    </div>

                    {/* BILLING SECTION */}
                    {!sameAsShipping && (
                        <section>
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-6 flex items-center gap-3">
                                <Truck size={24} className="text-blue-600" /> Billing Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6"> {/* gap-y-6 දැම්මා label එකට ඉඩ තියන්න */}

                                {/* First Name */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">First Name</label>
                                    <input type="text" name="firstName" placeholder="First Name" required value={shippingData.firstName} onChange={handleShippingChange} className={inputClass} />
                                </div>

                                {/* Last Name */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Last Name</label>
                                    <input type="text" name="lastName" placeholder="Last Name" required value={shippingData.lastName} onChange={handleShippingChange} className={inputClass} />
                                </div>

                                {/* Email Address */}
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Email Address</label>
                                    <input type="email" name="email" placeholder="Email Address" required value={shippingData.email} onChange={handleShippingChange} className={inputClass} />
                                </div>

                                {/* Shipping Address */}
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Shipping Address</label>
                                    <input type="text" name="address" placeholder="Shipping Address" required value={shippingData.address} onChange={handleShippingChange} className={inputClass} />
                                </div>

                                {/* City */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">City</label>
                                    <input type="text" name="city" placeholder="City" required value={shippingData.city} onChange={handleShippingChange} className={inputClass} />
                                </div>

                                {/* Phone Number */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Phone Number</label>
                                    <input type="tel" name="phone" placeholder="Phone Number" required value={shippingData.phone} onChange={handleShippingChange} className={inputClass} />
                                </div>

                            </div>
                        </section>
                    )}
                </div>

                {/* RIGHT: Order Summary */}
                <div className="lg:col-span-5">
                    <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-2xl sticky top-28">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
                        <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar space-y-4 mb-6">
                            {cart.items.map((item) => (
                                <div key={`${item.id}-${item.size}`} className="flex gap-4">
                                    <div className="w-16 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0"><img src={item.image} className="w-full h-full object-cover" alt={item.name} /></div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-sm text-slate-900 truncate">{item.name}</h4>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">{item.size} × {item.qty}</p>
                                        <p className="font-bold text-sm mt-1 text-blue-600">LKR {item.price.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-3 border-t border-slate-100 pt-6 text-sm">
                            <div className="flex justify-between text-slate-500"><span>Subtotal</span><span className="font-bold text-slate-900 text-base">LKR {subtotal.toLocaleString()}</span></div>
                            <div className="flex justify-between text-slate-500"><span>Shipping</span><span className="font-bold text-slate-900 text-base">LKR {delivery.toLocaleString()}</span></div>
                            <div className="flex justify-between pt-4 border-t border-slate-100"><span className="text-lg font-bold text-slate-900">Total</span><span className="text-2xl font-black text-slate-900">LKR {total.toLocaleString()}</span></div>
                        </div>
                        <button type="submit" className="w-full bg-black text-white font-black py-5 rounded-2xl mt-8 hover:bg-blue-600 transition-all shadow-xl">PLACE ORDER NOW</button>
                    </div>
                </div>
            </form>
        </main>
    );
}