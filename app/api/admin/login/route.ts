import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ... imports ...

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        const user = await db.user.findUnique({ where: { email } });

        if (!user) return new NextResponse("User not found", { status: 401 });
        if (user.role !== "ADMIN") return new NextResponse("Admins Only", { status: 403 });

        // ✅ Testing නිසා bcrypt නැතුව කෙළින්ම චෙක් කරනවා
        if (user.password !== password) {
            return new NextResponse("Invalid credentials", { status: 401 });
        }

        // Token එක හදන කොටස පරණ විදිහටම තියන්න
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "1d" }
        );

        const response = NextResponse.json({
            message: "Login successful",
            user: { id: user.id, name: user.firstName, role: user.role }
        });

        response.cookies.set("admin-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24,
            path: "/",
        });

        return response;

    } catch (error) {
        return new NextResponse("Error", { status: 500 });
    }
}