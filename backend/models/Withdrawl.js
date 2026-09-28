import mongoose from "mongoose"

const withdrawlSchema = new mongoose.Schema({
    userID: {
         type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    amount
})