import mongoose from "mongoose";

export const connectDB = async()=>{
    await mongoose.connect("mongodb+srv://rohannegipixelpotion_db_user:2uzQc4VkhkCvV41J@cluster0.tahosjg.mongodb.net/")
}