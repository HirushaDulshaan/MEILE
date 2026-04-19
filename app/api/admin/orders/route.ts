import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // ඇඩ්මින් කෙනෙක් නිසා අපි ඔක්කොම ඕඩර්ස් ගේනවා
        const orders = await db.order.findMany({
            include: {
                // ඕඩර් එක දාපු යූසර්ගේ නම සහ ඊමේල් එක ගන්නවා
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                    }
                },
                // ඕඩර් එකේ තියෙන අයිටම්ස් ටික ගන්නවා
                items: true,
            },
            // අලුත්ම ඕඩර්ස් උඩට එන විදිහට සෝට් කරනවා
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error("[ADMIN_ORDERS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}