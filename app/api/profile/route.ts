import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { profileSchema } from "@/lib/validations/auth";
import logger from "@/lib/logger";

export async function PATCH(req: Request) {
    try {
        const body = await req.json();

        // 1. Zod Validation
        // body එකේ කෙලින්ම contact සහ id තියෙන නිසා අමුතුවෙන් map කරන්න ඕනේ නැහැ
        const validation = profileSchema.safeParse(body);

        if (!validation.success) {
            console.log("VALIDATION_ERROR_DETAILS:", validation.error.format());
            // body.id ලෙස පාවිච්චි කරන්න (body.userId නෙවෙයි)
            logger.warn(`Profile update validation failed for User ID: ${body.id}`);
            return new NextResponse("Invalid data formats", { status: 400 });
        }

        const { id } = body; // Frontend එකෙන් එන 'id' එක ගන්න
        const validatedData = validation.data;

        // 2. Database Update
        const updatedUser = await db.user.update({
            where: { id: Number(id) },
            data: {
                firstName: validatedData.firstName,
                lastName: validatedData.lastName,
                email: validatedData.email,
                contact: validatedData.contact,
                address1: validatedData.address1,
                address2: validatedData.address2,
                city: validatedData.city,
                postalCode: validatedData.postalCode,
            }
        });

        logger.info(`Profile updated successfully: ${updatedUser.email}`);
        return NextResponse.json(updatedUser);

    } catch (error: any) {
        logger.error(`PROFILE_UPDATE_ERROR: ${error.message}`, { stack: error.stack });
        return new NextResponse("Internal Error", { status: 500 });
    }
}