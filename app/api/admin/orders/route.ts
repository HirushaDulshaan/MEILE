import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const orders = await db.order.findMany({
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                    }
                },
                items: true,
            },
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