import User from "../../../../../models/user";
import { connectMongoDB } from "../../../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(){
    try{
        await connectMongoDB()
        const allUser = await User.find({}, { name: 1, email: 1});

        if (allUser.length === 0) {
            console.log('No user found');
            return NextResponse.json({ users: [{}] }, {status: 201});
        }

        return NextResponse.json({ users: allUser }, {status: 200})
    }
    catch(error){
        return NextResponse.json({ users: null }, {status: 500})
    }
}