import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/user";

export async function POST(req){
    try{
        await connectMongoDB()
        const {email} = await req.json()
        const user = await User.findOne({email})

        if(user){
            return NextResponse.json({ exists: true}, {status: 200})
        }
        else{
            return NextResponse.json({ exists: false}, {status: 200})
        }
    }
    catch(error){
        console.log("AAAA")
        console.log(error)
    }
}