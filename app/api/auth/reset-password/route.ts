import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { email, otp, newPassword } = await req.json();

        // 1. OTP එක නිවැරදිද බලනවා
        const tokenRecord = await db.verificationToken.findFirst({
            where: { email, token: otp }
        });

        if (!tokenRecord || tokenRecord.expires < new Date()) {
            return new NextResponse("Invalid or expired OTP", { status: 400 });
        }

        // 2. Password එක Update කරනවා
        await db.user.update({
            where: { email },
            data: { password: newPassword } // 👈 මෙතන bcrypt පාවිච්චි කරනවා නම් hash කරන්න
        });

        // 3. Token එක අයින් කරනවා
        await db.verificationToken.delete({ where: { email } });

        return NextResponse.json({ message: "Password reset successful" });
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}


export async function PATCH(req: Request) {
    try {
        const { userId, email, otp, newPassword } = await req.json();

        // 1. OTP එක නිවැරදිද බලනවා
        const tokenRecord = await db.verificationToken.findFirst({
            where: { email, token: otp }
        });

        if (!tokenRecord || tokenRecord.expires < new Date()) {
            return new NextResponse("Invalid or expired OTP", { status: 400 });
        }

        // 2. Password එක Update කරනවා
        await db.user.update({
            where: { id: userId },
            data: { password: newPassword }
        });

        // 3. Token එක අයින් කරනවා
        await db.verificationToken.delete({ where: { email } });

        return NextResponse.json({ message: "Password updated successfully" });
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}