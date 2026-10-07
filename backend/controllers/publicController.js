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

export const getPublicSLots = async(req,res)=>{
    try {
        const{date, serviceId} = req.query
        if(!date || !serviceId){
           return res.status(400).json({message: 'Date and service are reuqired'}) 
        }
        const business = await getBusinessBySlug(req.params.slug)
        if(!business){
            return res.status(404).json({message:"Business not found"})
        }

        const service = await Service.findOne({
            _id: serviceId,
            userId: business._id,
            isActive:true,
            isDeleted: {$ne: true}

        })
        if(!service){
            return res.status(404).json({message: 'Servicenot found'})
        }
        const slots = await generateSlots({userId : business_id, service, date})

        res.json({slots})
    } catch (error) {
        res.status(500).json({message: "Service error", error: error.message})
    }
}


export const requestPublicBookingOtp = async(req,res)=>{
    try {
        const {customerEmail} = req.body;
        const normalizedEmail = customerEmail?.toLowerCase().trim()

        if(!normalizedEmail){
            return res.status(400).json({message: 'Customer email is required'})

        }

        const business = await getBusinessBySlug(req.params.slug)
        if(!business){
            return res.status(404).json({message: "business is not found"})
        }

        const result = await requestEmailOtp({email: normalizedEmail, purpose: 'booking'})
        res.json({message: 'Verification code sent', result})
    } catch (error) {
        res.status(503).json({message: error.message})
    }
}


export const verifyPublicBookingOtp = async (req, res) => {
  try {
    const { customerEmail, emailOtp } = req.body;
    
    if (!customerEmail || !emailOtp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const otpResult = await verifyEmailOtp({
      email: customerEmail,
      purpose: 'booking',
      code: emailOtp,
      consume: false,
    });

    if (!otpResult.verified) {
      return res.status(400).json({ message: otpResult.reason || 'Invalid OTP' });
    }

    res.json({ message: 'OTP verified' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};




export const createPublicBooking = async (req, res) => {
  try {
    const { serviceId, customerName, customerEmail, customerAvatar, date, startTime, endTime, notes, emailOtp } = req.body;

    if (!serviceId || !customerName || !customerEmail || !date || !startTime || !endTime) {
      return res.status(400).json({ message: 'All booking fields are required' });
    }

    const normalizedCustomerEmail = customerEmail.toLowerCase().trim();

    const business = await getBusinessBySlug(req.params.slug);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    const service = await Service.findOne({
      _id: serviceId,
      userId: business._id,
      isActive: true,
      isDeleted: { $ne: true },
    });
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const bookings = await findActiveSlotBookings({ userId: business._id, date });

    const hasConflict = bookings.some((booking) => (
      timesOverlap(startTime, endTime, booking.startTime, booking.endTime)
    ));

    if (hasConflict) {
      return res.status(409).json({ message: 'That slot is no longer available' });
    }

    const otpResult = await verifyEmailOtp({
      email: normalizedCustomerEmail,
      purpose: 'booking',
      code: emailOtp,
      consume: true,
    });

    if (!otpResult.verified) {
      return res.status(400).json({ message: otpResult.reason || 'Email verification is required' });
    }

    const amount = toStripeAmount(service.price);
    const { platformFeeAmount, providerPayoutAmount } = calculatePlatformSplit(amount);
    const currency = 'inr';
    const stripe = amount > 0 ? getStripe() : null;

    if (amount > 0 && !stripe) {
      return res.status(503).json({ message: 'Stripe payments are not configured yet' });
    }

    const customerCalendarUrl = buildCustomerCalendarUrl({
      business,
      service,
      booking: { date, startTime, endTime, customerName, customerEmail: normalizedCustomerEmail, notes },
    });

    const booking = await Booking.create({
      userId: business._id,
      serviceId,
      customerName,
      customerEmail: normalizedCustomerEmail,
      customerAvatar: customerAvatar || 'A1.png',
      date,
      startTime,
      endTime,
      notes: notes || '',
      amount,
      platformFeeAmount,
      providerPayoutAmount,
      payoutStatus: amount > 0 ? 'pending' : 'not_required',
      currency,
      paymentStatus: amount > 0 ? 'pending' : 'not_required',
      status: amount > 0 ? 'pending_payment' : 'confirmed',
      customerCalendarUrl,
    });

    if (amount === 0) {
      try {
        const calendarResult = await createBookingCalendarEvent({ business, service, booking });
        booking.googleEventId = calendarResult.googleEventId || '';
        booking.customerCalendarUrl = calendarResult.customerCalendarUrl;
        await booking.save();
      } catch (calendarError) {
        booking.customerCalendarUrl = customerCalendarUrl;
        await booking.save();
      }

      let emailResult = { sent: 'processing' };
      sendBookingNotification({ business, service, booking, type: 'confirmed' })
        .catch(emailError => console.error('Booking confirmation email failed:', emailError.message));

      return res.status(201).json({
        message: 'Booking confirmed',
        booking,
        customerCalendarUrl: booking.customerCalendarUrl,
        email: emailResult,
      });
    }

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: normalizedCustomerEmail,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: amount,
            product_data: {
              name: service.name,
              description: `${date} ${startTime}-${endTime}`,
            },
          },
        },
      ],
      metadata: {
        bookingId: String(booking._id),
      },
      success_url: `${clientUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}&slug=${business.slug}`,
      cancel_url: `${clientUrl}/booking/cancelled?booking_id=${booking._id}&slug=${business.slug}`,
    });

    booking.stripeSessionId = session.id;
    await booking.save();

    res.status(201).json({
      message: 'Continue to payment',
      bookingId: booking._id,
      checkoutUrl: session.url,
    });
  } catch (error) {
    const errorMsg = error.type?.includes('Stripe') ? (error.raw?.message || error.message) : 'Server error: ' + error.message;
    res.status(error.statusCode || 500).json({ message: errorMsg, error: error.message });
  }
};