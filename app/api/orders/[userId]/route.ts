import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await params;

        if (!userId) {
            return new NextResponse("User ID is required", { status: 400 });
        }

        const orders = await db.order.findMany({
            where: {
                userId: Number(userId)
            },
            include: {
                items: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error("[ORDERS_GET_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}