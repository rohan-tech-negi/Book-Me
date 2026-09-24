import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/user.models.js"
import { requestEmailOtp, verifyEmailOtp } from "../utils/emailOtp.js"
import slugify from "../utils/slug.js"

const createToken = (userId) =>{
    return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '7d'})
}