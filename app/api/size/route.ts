import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// 1. GET: All Sizes
export async function GET() {
    try {
        const sizes = await db.size.findMany({
            orderBy: { id: 'asc' } // Dan ID eka Integer nisa asc (1, 2, 3...) danna puluwan
        });
        return NextResponse.json(sizes);
    } catch (error) {
        console.error("[SIZE_GET_ERROR]", error);
        return NextResponse.json({ error: "Data fetch error" }, { status: 500 });
    }
}

// 2. POST: Create Size
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { sizeCode, sizeName } = body;

        if (!sizeCode || !sizeName) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const existingSize = await db.size.findUnique({ where: { sizeCode } });
        if (existingSize) {
            return NextResponse.json({ error: "Size code already exists" }, { status: 400 });
        }

        const newSize = await db.size.create({
            data: { sizeCode, sizeName },
        });

        return NextResponse.json(newSize, { status: 201 });
    } catch (error) {
        console.error("[SIZE_POST_ERROR]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// 3. PUT: Update Size
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, sizeCode, sizeName } = body;

        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        const updatedSize = await db.size.update({
            where: { id: Number(id) }, // 👈 Dan ID eka Integer nisa Number() aniwaaryayi
            data: {
                sizeCode,
                sizeName,
            },
        });

        return NextResponse.json(updatedSize);
    } catch (error) {
        console.error("[SIZE_PUT_ERROR]", error);
        return NextResponse.json({ error: "Update error" }, { status: 500 });
    }
}