import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// 1. GET: All Colors
export async function GET() {
    try {
        const colors = await db.color.findMany({
            orderBy: { id: 'asc' }
        });
        return NextResponse.json(colors);
    } catch (error) {
        console.log("[COLOR_GET_ERROR]", error);
        return new NextResponse("Database Error", { status: 500 });
    }
}

// 2. POST: Create New Color
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

// 3. PUT: Update Existing Color
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, color, hexColor } = body;

        if (!id) return new NextResponse("ID Required", { status: 400 });

        const updatedColor = await db.color.update({
            where: { id: Number(id) }, // ID එක Number එකක් බවට පත් කළා
            data: {
                name: color,
                hexCode: hexColor,
            },
        });
        return NextResponse.json(updatedColor);
    } catch (error) {
        console.log("[COLOR_PUT_ERROR]", error);
        return new NextResponse("Update Error", { status: 500 });
    }
}