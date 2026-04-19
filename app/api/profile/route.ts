import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { userId, firstName, lastName, email, mobile, address1, address2, city, postalCode } = body;

        // Prisma හරහා User ගේ තොරතුරු සහ ඇඩ්‍රස් එක update කරනවා
        // ඔයාගේ schema එකේ මේ fields ටික තිබිය යුතුයි
        const updatedUser = await db.user.update({
            where: { id: Number(userId) },
            data: {
                firstName,
                lastName,
                email,
                contact: mobile, // Database එකේ තියෙන්නේ contact නමින් නම්
                // මෙතනින් පල්ලෙහා තියෙන ඒවත් schema එකේ තියෙන්න ඕනේ
                address1,
                address2,
                city,
                postalCode,
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("[PROFILE_UPDATE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}