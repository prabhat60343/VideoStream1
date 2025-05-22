/*import mongoose from "mongoose";
import { DB_NAME } from "../constants";
const connectDB=async()=>{
    try{
    const connectionInstances=await mongoose.connect(`${process.env.MONOGODB_URI}/{DB_NAME}`);
    console.log(`\n MongoDB connected !! DB HOST:  ${connectionInstances.connection.host}`);
}catch(error){
    console.error("Mongo db connection  Error",error);
    process.exit(1);
}
}
export default connectDB;*/

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        console.log("MongoDB URI:", process.env.MONGODB_URI);
        console.log("DB_NAME:", DB_NAME);

        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1);
    }
};

export default connectDB;
