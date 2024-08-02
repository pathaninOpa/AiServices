import { NextResponse } from "next/server";

export async function POST(req) {
    const {var1, var2} = await req.json();
    const sum = parseInt(var1, 10) + parseInt(var2, 10);
    return NextResponse.json({ "message": sum, "status": 200 });
}