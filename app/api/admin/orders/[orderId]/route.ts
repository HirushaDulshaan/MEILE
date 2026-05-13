import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        const { orderId } = await params;
        const body = await req.json();
        const { status } = body;

        const updatedOrder = await db.order.update({
            where: { id: Number(orderId) },
            data: { status },
        });

        return NextResponse.json(updatedOrder);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}