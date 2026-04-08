import { db } from "@/lib/db"; // 👈 ඔයාගේ db file එක මෙතනින් import කරන්න
import { NextResponse } from "next/server";

// 1. GET: සියලුම Sizes ලබා ගැනීමට
// Example for GET in route.ts
export async function GET() {
    try {
        const sizes = await db.size.findMany({
            orderBy: { id: 'asc' }
        });
        return NextResponse.json(sizes);
    } catch (error) {
        console.log("[SIZE_GET_ERROR]", error);
        // ✅ Return a JSON object instead of a string
        return NextResponse.json({ error: "Data fetch error" }, { status: 500 });
    }
}

// 2. POST: අලුත් Size එකක් save කිරීමට
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { sizeCode, sizeName } = body;

        if (!sizeCode || !sizeName) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        // Check if sizeCode already exists to avoid the 500 error
        const existingSize = await db.size.findUnique({
            where: { sizeCode }
        });

        if (existingSize) {
            return NextResponse.json({ error: "Size code already exists" }, { status: 400 });
        }

        const newSize = await db.size.create({
            data: { sizeCode, sizeName },
        });

        return NextResponse.json(newSize, { status: 201 });
    } catch (error: any) {
        console.error("PRISMA ERROR:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// 3. PUT: Size එකක් update කිරීමට
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, sizeCode, sizeName } = body;

        const updatedSize = await db.size.update({
            where: { id: Number(id) },
            data: {
                sizeCode,
                sizeName,
            },
        });

        return NextResponse.json(updatedSize);
    } catch (error) {
        console.log("[SIZE_PUT_ERROR]", error);
        // ✅ Change this to JSON
        return NextResponse.json({ error: "Update error" }, { status: 500 });
    }
}