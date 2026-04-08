import Link from "next/link";
import {relative} from "pathe";
import { User, LogOut, ShoppingCart, Search, X } from "lucide-react";


const Navbar = () => {
    return (
        <div className={"relative w-full z -50"}>
            <nav className={"bg-black px-6 py-4 shadow-md uppercase tracking-widest text-white relative z-50"}>
                <div className={"max-w-7xl mx-auto flex justify-between items-center"}>
                    <Link href="/" className={"text-2xl font-black hover:opacity-80 transition"}>D E E S</Link>


                    <div className={"hidden md:flex items-center gap-10 text-sm font-medium"}>
                        <Link href="/men" className="hover:text-gray-400 transition">
                            MEN
                        </Link>
                        <Link href="/women" className="hover:text-gray-400 transition">
                            WOMEN
                        </Link>
                    </div>

                    <div className={"flex items-center gap-6"}>
                        <button className={"hover:text-gray-400 transition"} >
                            <Search size={20}/>
                        </button>

                        <Link href="/cart" className={"hover:text-gray-400 transition"} ><ShoppingCart size={20}/></Link>

                        <div className={"flex items-center gap-5"}>
                            <Link href={"/profile"} className={"hover:text-gray-400 transition"}/><User size={20}/>
                        </div>
                    </div>
                </div>
            </nav>

        </div>
    );
};

export default Navbar;