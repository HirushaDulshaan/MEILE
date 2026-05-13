import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { email, otp, newPassword } = await req.json();

        const tokenRecord = await db.verificationToken.findFirst({
            where: { email, token: otp }
        });

        if (!tokenRecord || tokenRecord.expires < new Date()) {
            return new NextResponse("Invalid or expired OTP", { status: 400 });
        }

        await db.user.update({
            where: { email },
            data: { password: newPassword }
        });

        await db.verificationToken.delete({ where: { email } });

        return NextResponse.json({ message: "Password reset successful" });
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}


export async function PATCH(req: Request) {
    try {
        const { userId, email, otp, newPassword } = await req.json();

        const tokenRecord = await db.verificationToken.findFirst({
            where: { email, token: otp }
        });

        if (!tokenRecord || tokenRecord.expires < new Date()) {
            return new NextResponse("Invalid or expired OTP", { status: 400 });
        }

        await db.user.update({
            where: { id: userId },
            data: { password: newPassword }
        });

        await db.verificationToken.delete({ where: { email } });

        return NextResponse.json({ message: "Password updated successfully" });
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}