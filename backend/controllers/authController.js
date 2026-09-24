import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/user.models.js"
import { requestEmailOtp, verifyEmailOtp } from "../utils/emailOtp.js"
import slugify from "../utils/slug.js"

const createToken = (userId) =>{
    return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '7d'})
}


const toUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  slug: user.slug,
  businessName: user.businessName,
  businessDescription: user.businessDescription,
  brandTheme: user.brandTheme,
  brandAccent: user.brandAccent,
  timezone: user.timezone,
  googleCalendarConnected: user.googleCalendarConnected,
  googleCalendarId: user.googleCalendarId,
  payoutDetails: user.payoutDetails,
  stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY),
});



export const registerUser = async(req,res)=>{
    
}