import mongoose from 'mongoose'

export const connectMongoDB = async () =>{
    try{
        await mongoose.connect(process.env.uri)
        console.log("Connected to MongoDB")
    }
    catch(error){
        console.log("Error occurs -> cant connecting to the MongoDB: ", error)
    }
}