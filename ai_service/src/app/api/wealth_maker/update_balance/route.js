import Gambler from "../../../../../models/gambler";
import { connectMongoDB } from "../../../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req){
    try{
        const { email, balance } = await req.json()

        await connectMongoDB()
        const existingGambler = await Gambler.findOne({ email });

        if (!existingGambler) {
            console.log('Gambler not found');
            return;
        }

        existingGambler.balance = balance;
        await existingGambler.save();

        return NextResponse.json({ updated: true }, {status: 200})
    }
    catch(error){
        return NextResponse.json({ updated: false }, {status: 500})
    }
}