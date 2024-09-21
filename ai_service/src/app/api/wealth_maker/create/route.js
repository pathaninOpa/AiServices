import Gambler from "../../../../../models/gambler";
import { connectMongoDB } from "../../../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req){
    try{
        const { email, balance } = await req.json()
        //debugging zone//
        // console.log("Name: ", name)
        // console.log("Email: ", email)
        // console.log("Password: ", password)

        await connectMongoDB()
        await Gambler.create({email, balance})

        return NextResponse.json({ message: "Gambler registered"}, {status: 200})
    }
    catch(error){
        return NextResponse.json({ message: "An error occured while registrating the gambler"}, {status: 500})
    }
}