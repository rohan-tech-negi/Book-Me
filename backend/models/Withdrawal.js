import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
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
        type: String,
        enum: ['pending', 'completed', 'rejected'],
        default: 'pending'
    },
    payoutSnapshot: {
        accountHolderName: String,
        bankName: String,
        accountLast4: String,
        ifsc: String,
        upiId: String
    },
    adminNote: {
        type: String,
        default: '',
        trim: true
    },
}, { timestamps: true });

const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);

export default Withdrawal;
