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
    try {
        const {name, email, password, businessName, businessDescription, timezone, emailOtp} = req.body
        if(!name || !email || !password){
            return res.status(400).json({message: "name email and password are required"})
        }

        const normalizedEmail = email.toLowerCase().trim()

        const existingUser = await User.findOne({email: normalizedEmail})

        if(existingUser){
            return res.status(400).json({message: "Email already exists"})
        }

        const otpResult = await verifyEmailOtp({
            email: normalizedEmail,
            purpose: "registration",
            code: emailOtp,
            consume: true
        })
    } catch (error) {
        
    }
}