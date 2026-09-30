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


