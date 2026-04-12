import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
    try {
        const { imageBase64 } = await req.json();
        const buffer = Buffer.from(imageBase64.split(",")[1], "base64");

        const fileName = `img-${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
        const uploadDir = path.join(process.cwd(), "public/uploads");

        // Folder eka nathnam hadanna
        try { await mkdir(uploadDir, { recursive: true }); } catch (e) {}

        await writeFile(path.join(uploadDir, fileName), buffer);
        return NextResponse.json({ url: `/uploads/${fileName}` });
    } catch (error) {
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}