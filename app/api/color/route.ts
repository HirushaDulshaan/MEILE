import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const colors = await db.color.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(colors);
    } catch (error) {
        console.log("[COLOR_GET_ERROR]", error);
        return new NextResponse("Database Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { color, hexColor } = body;

        const newColor = await db.color.create({
            data: {
                name: color,
                hexCode: hexColor,
            },
        });
        return NextResponse.json(newColor, { status: 201 });
    } catch (error) {
        console.log("[COLOR_POST_ERROR]", error);
        return new NextResponse("Insert Error", { status: 500 });
    }
}