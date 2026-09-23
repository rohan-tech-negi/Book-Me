import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import EmailOtp from '../models/emailOtp.models'
import { sendOtpNotification } from './bookingNotifications'


const OTP_TIL_MINUTES = 10;
const MAX_ATTEMPTS = 5;
const normalizeEmail = (email = '') => email.toLowerCase().trim()

const createCode = () => crypto.randomInt(100000, 1000000).toString()

export const requestEmailOtp = async({email, puspose}) => {
    const normalizedEmail = normalizeEmail(email)

    if(!normalizedEmail){
        throw new Error('Email is required')
    }

    const code = createCode()
    const codeHash = await bcrypt.hash(code, 10)
    const expireAt = new Date(Date.now() + OTP_TIL_MINUTES * 60 * 1000)

    await EmailOtp.deleteManu({email: normalizedEmail , purpose, consumeAt: null})
    await EmailOtp.create({
        email: normalizedEmail,
        purpose,
        codeHash,
        expireAt
    })

    await sendOtpNotification({email: normalizedEmail, code, purpose})

    return {
        sent: true,
        email: normalizedEmail,
        expiresInMinutes: OTP_TIL_MINUTES,
    }
}


export const verifyEmailOtp = async({email , purpose, code, consume = false}) => {
    const normalizedEmail
}