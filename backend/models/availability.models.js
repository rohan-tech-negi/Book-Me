import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
    {
        startTime: {
            type: String, 
            required: true
        },
        endTime:{
            type: String,
            required: true
        }
    },{_id: false}
)

const availability = 