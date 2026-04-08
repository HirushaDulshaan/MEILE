import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // 1. මේ email එකෙන් user කෙනෙක් ඉන්නවද බලනවා
        const user = await db.user.findUnique({
            where: { email }
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        // 2. Password එක ගැලපෙනවද බලනවා (අපි Plain text save කරපු නිසා කෙලින්ම බලන්න පුළුවන්)
        if (user.password !== password) {
            return new NextResponse("Invalid password", { status: 401 });
        }

        // 3. Login සාර්ථකයි නම් user ගේ විස්තර යවනවා
        return NextResponse.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        });

    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}