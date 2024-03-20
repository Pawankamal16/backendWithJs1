//database ko connect krenge through mongoose

import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


// connect db is asnchrous method which return promise
// promis object return completion or failure of an asynchrous operation
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)  // db connection ke baad response ko connectionInstance variable m hold krte j jo li object return krta h
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);

    } catch (error) {
       console.log("MONGODB connection error ",error)
       process.exit(1) // current application kisi na kisi process or run kr rhi hogi uska reference de rhe h - (same as -throw error) 

    }
}

export default connectDB