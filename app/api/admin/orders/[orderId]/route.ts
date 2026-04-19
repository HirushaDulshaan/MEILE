import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// app/api/admin/orders/[orderId]/route.ts
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ orderId: string }> } // Promise එකක් විදිහට ගන්න
) {
    try {
        const { orderId } = await params; // await කරන්න
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