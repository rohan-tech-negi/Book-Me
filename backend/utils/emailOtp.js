import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import EmailOtp from '../models/emailOtp.models'
import { sendOtpNotification } from './bookingNotifications'


const OTP_TIL_MINUTES = 10;
const MAX_ATTEMPTS = 5;
const normalizeEmail = (email = '') => email.toLowerCase().trim()

const createCode = () => crypto.randomInt(100000, 1000000).toString()