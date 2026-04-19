import Link from "next/link";
import {

    Mail,
    Phone,
    MapPin
} from "lucide-react";


const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-slate-100 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Brand Section */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-black tracking-tighter text-slate-900">
                            MEILI<span className="text-blue-600">.</span>
                        </h2>
                        <p className="text-slate-500 text-sm leading-relaxed font-medium">
                            Elevating your everyday style with premium quality and timeless designs. Based in Sri Lanka, shipping worldwide.
                        </p>
                        <div className="flex gap-4">
                            {/* Instagram */}
                            <Link href="#" className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                                </svg>
                            </Link>

                            {/* Facebook */}
                            <Link href="#" className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                                </svg>
                            </Link>

                            {/* Twitter (X) */}
                            <Link href="#" className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                                {/* දැන් X අයිකන් එක පාවිච්චි කරන එක වඩාත් හොඳයි */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* Shop Categories */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 mb-6">Shop</h4>
                        <ul className="space-y-4">
                            <li><Link href="/mens-wear" className="text-slate-500 hover:text-blue-600 text-xs font-bold uppercase tracking-wider transition-colors">Men's Wear</Link></li>
                            <li><Link href="/womens-wear" className="text-slate-500 hover:text-blue-600 text-xs font-bold uppercase tracking-wider transition-colors">Women's Wear</Link></li>
                            <li><Link href="/accessories" className="text-slate-500 hover:text-blue-600 text-xs font-bold uppercase tracking-wider transition-colors">Accessories</Link></li>
                            <li><Link href="/new-arrivals" className="text-slate-500 hover:text-blue-600 text-xs font-bold uppercase tracking-wider transition-colors">New Arrivals</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 mb-6">Support</h4>
                        <ul className="space-y-4">
                            <li><Link href="/profile?tab=orders" className="text-slate-500 hover:text-blue-600 text-xs font-bold uppercase tracking-wider transition-colors">Order Tracking</Link></li>
                            <li><Link href="/shipping" className="text-slate-500 hover:text-blue-600 text-xs font-bold uppercase tracking-wider transition-colors">Shipping Policy</Link></li>
                            <li><Link href="/faq" className="text-slate-500 hover:text-blue-600 text-xs font-bold uppercase tracking-wider transition-colors">FAQs</Link></li>
                            <li><Link href="/contact" className="text-slate-500 hover:text-blue-600 text-xs font-bold uppercase tracking-wider transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 mb-6">Get in Touch</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-slate-500">
                                <Mail size={16} className="text-blue-600" />
                                <span className="text-xs font-bold uppercase tracking-wider">support@meili.lk</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-500">
                                <Phone size={16} className="text-blue-600" />
                                <span className="text-xs font-bold uppercase tracking-wider">+94 77 123 4567</span>
                            </div>
                            <div className="flex items-start gap-3 text-slate-500">
                                <MapPin size={16} className="text-blue-600 shrink-0" />
                                <span className="text-xs font-bold uppercase tracking-wider leading-relaxed">
                                    No 123, Fashion Avenue,<br />Colombo 07, Sri Lanka
                                </span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        © {currentYear} MEILI CLOTHING PVT LTD. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Privacy</Link>
                        <Link href="/terms" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;