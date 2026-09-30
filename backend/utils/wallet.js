import WalletTransaction from "../models/WalletTransaction.models.js";
import Withdrawal from "../models/Withdrawl.js";

export const createBookingPayouttransaction= async({booking, description}) => {
    if(!booking?.providerPayoutAmount) return null;

    try {
        return await WalletTransaction.create({
            userId: booking.user_id,
            bookingId: booking._id,
            type: 'booking_Payout',
            amount: booking.providerPayoutAmount,
            currency: booking.currency,
            status: 'available',
            description: description || 'Booking payout after platform fee'
        })
    } catch (error) {
        if(error.code === 11000){
            return WalletTransaction.findOne({bookingId: booking._id, type: 'booking_payout'})
        }   
        throw error
    }
}