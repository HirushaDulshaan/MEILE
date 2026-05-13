import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { sendOTP } from "@/lib/mail";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        const user = await db.user.findUnique({ where: { email } });
        if (!user) return new NextResponse("User not found", { status: 404 });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 10 * 60 * 1000);

        await db.verificationToken.upsert({
            where: { email },
            update: { token: otp, expires },
            create: { email, token: otp, expires }
        });

        await sendOTP(email, otp);

        return NextResponse.json({ message: "OTP Sent" });
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}