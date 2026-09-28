import mongoose from "mongoose"

const walletTransactionSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }, 
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking', 
        index: true
    },
     withdrawnId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Withdrawl', 
        index: true
    },
    type: {
        type: String,
        enum: ['booking_payout', 'withdrawl_hold', 'withdrawl_reversal'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'inr'
    },
    status: {
        type: String
    }
})