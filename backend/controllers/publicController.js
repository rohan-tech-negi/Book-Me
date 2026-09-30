import Booking from "../models/Booking.models.js"
import Service from "../models/service.models.js"
import User from "../models/user.models.js"
import {buildCustomerCalenderUrl} from "../utils/calenderLink.js"
import {createBookingCalenderEvent} from "../utils/googleCalender.js"
import {sendBookingNotification} from"../utils/bookingNotifications.js"
import {requestEmailOtp, verifyEmailOtp} from "../utils/emailOtp.js"
import {generateSlots} from "../utils/slogGenerator.js"
import {getStripe, toStripeAmount} from "../utils/stripe.js"
import {calculatePlatformSplit} from "../utils/money.js"
import { timeOverlap } from "../utils/overlap.js"
import { createBookingCalendarEvent } from "../utils/googleCalender.js"


const getBusinessBySlug = async(slug) =>{
    return User.findOne({slug}).select('-password')
}

const toPublicBusiness = (business) => ({
    id: business._id,
    name: business.name,
    slug: business.slug,
    businessName: business.businessName,
    businessDescription: business.businessDescription,
    brandTheme: business.brandTheme,
    brandAccount: business.brandAccount,
    timezone: business.timezone,
    googleCalenderConnected: business.googleCalenderConnected
})

const holdWindowStart = () =>{
    Date(Date.now() - 30 * 60 * 1000)
}

const findActiveSlotBooking = ({userId, date}) =>{
    return Booking.find({
        userId,
        date,
         $or: [
            {status: 'confirmed'},
            {
                status: 'pending_payment',
                createdAt: {$gte: holdWindowStart}
            }
         ]
    })
}


export const getPublicBusiness = async(req,res)=>{
    try {
        const business = await  getBusinessBySlug(req.params.slug)

        if(!business){
            return res.status(404).json({message: 'Business not found'})
        }

        const services = await Service.find({
            userId: business_id,
            isActive: true,
            isDeleted: {$ne: true}
        }).sort({name: 1})

        res.json({business: toPublicBusiness(business),services})
    } catch (error) {
        res.status(500).json({message: 'Server error', error: error.message})
    }
}

export