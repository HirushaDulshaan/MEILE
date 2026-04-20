import {NextResponse} from "next/server";
import {db} from "@/lib/db";

export async function POST(request: Request) {
    const { email, firstName, lastName, contact, password, otp } = await request.json();

    const record = await db.verificationToken.findFirst({
        where: { email, token: otp }
    });

    if (!record || record.expires < new Date()) {
        return new NextResponse("Invalid OTP", { status: 400 });
    }

    // OTP එක හරි නම් User ව Create කරනවා
    const user = await db.user.create({
        data: { email, firstName, lastName, contact, password }
    });

    // පාවිච්චි කරපු Token එක Delete කරමු
    await db.verificationToken.delete({ where: { email } });

    return NextResponse.json(user);
}