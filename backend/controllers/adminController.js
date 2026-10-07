import bcrypt from 'bcrypt.js'
import jwt from 'jsonwebtoken'
import Booking from '../models/Booking.models.js'
import User from '../models/user.models.js'
import WalletTransaction from '../models/WalletTransaction.models.js'
import Withdrawal from '../models/Withdrawl.js'

const createAdminToken = (email) =>{
    return jwt.sign({email, role: 'admin'}, process.env.JWT_SECRET, {expiresIn: '7'})
}

const terminalWithdrawlStatus = ['paid', 'rejected']

const sumByKey = (rows) => rows.reduce((acc, row)=> ({...acc, [row._id]: row.total}), {})