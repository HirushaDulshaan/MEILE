import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { name, description, price, categoryId } = await req.json();

        const product = await db.product.create({
            data: {
                name,
                description,
                price,
                categoryId,
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        return new NextResponse("Error saving product", { status: 500 });
    }
}