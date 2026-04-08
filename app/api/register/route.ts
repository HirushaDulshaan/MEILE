import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, name, password } = body;

        // 1. කලින් මේ email එකෙන් register වෙලාද බලනවා
        const existingUser = await db.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return new NextResponse("Email already exists", { status: 400 });
        }

        // 2. Password එක කෙලින්ම (Plain Text) Save කරනවා
        const user = await db.user.create({
            data: {
                email,
                name,
                password: password, // Hash කරන්නේ නැතුව කෙලින්ම දානවා
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.log("REGISTER_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}