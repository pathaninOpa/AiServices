import Gambler from "../../../../../models/gambler";
import { connectMongoDB } from "../../../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req){
    try{
        const { email } = await req.json();

        await connectMongoDB();
        const existingGambler = await Gambler.findOne({ email });

        if (existingGambler){
            return NextResponse.json({
                exist: true,
                balance: existingGambler.balance,
            }, {status: 200});
        }
        else {
            return NextResponse.json({
                exist: false,
                balance: 0,
            }, {status: 200});
        }       
    }
    catch(error){
        return NextResponse.json({
            exist: null,
            balance: null,
        }, {status: 500});
    }
}