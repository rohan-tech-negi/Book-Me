import mongoose from "mongoose";
import dns from "node:dns";

// Use Google Public DNS to reliably resolve MongoDB SRV records
dns.setServers(["8.8.8.8", "8.8.4.4"]);

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://rohannegipixelpotion_db_user:2uzQc4VkhkCvV41J@cluster0.tahosjg.mongodb.net/bookme");
        console.log("DB Connected");
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
    }
};
