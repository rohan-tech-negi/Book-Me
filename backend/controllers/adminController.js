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


const getAdminSummary = async () => {
  const [usersCount, bookingTotals, walletTotals, withdrawalTotals] = await Promise.all([
    User.countDocuments(),
    Booking.aggregate([
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          paidBookings: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, 1, 0] },
          },
          grossRevenue: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$amount', 0] },
          },
          platformFees: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$platformFeeAmount', 0] },
          },
          paidProviderPayouts: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$providerPayoutAmount', 0] },
          },
          confirmedProviderPayouts: {
            $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, '$providerPayoutAmount', 0] },
          },
          activeProviderPayouts: {
            $sum: {
              $cond: [
                { $in: ['$status', ['cancelled', 'payment_failed']] },
                0,
                '$providerPayoutAmount',
              ],
            },
          },
        },
      },
    ]),
    WalletTransaction.aggregate([
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]),
    Withdrawal.aggregate([
      {
        $group: {
          _id: '$status',
          total: { $sum: '$amount' },
        },
      },
    ]),
  ]);

  const bookingSummary = bookingTotals[0] || {};
  const walletMap = sumByKey(walletTotals);
  const withdrawalMap = sumByKey(withdrawalTotals);
  const paidProviderPayouts = bookingSummary.paidProviderPayouts || 0;
  const confirmedProviderPayouts = bookingSummary.confirmedProviderPayouts || 0;
  const activeProviderPayouts = bookingSummary.activeProviderPayouts || 0;
  const walletEarned = walletMap.booking_payout || 0;
  const heldWithdrawals = walletMap.withdrawal_hold || 0;
  const reversedWithdrawals = walletMap.withdrawal_reversal || 0;
  const providerPayouts = Math.max(
    paidProviderPayouts,
    confirmedProviderPayouts,
    activeProviderPayouts,
    walletEarned,
  );
  const pendingWithdrawals = (withdrawalMap.pending || 0) + (withdrawalMap.processing || 0);
  const paidWithdrawals = withdrawalMap.paid || 0;
  const usersAvailableBalance = Math.max(0, walletEarned - heldWithdrawals + reversedWithdrawals);
  const walletWithdrawalHold = usersAvailableBalance + pendingWithdrawals;
  const bookingWithdrawalHold = Math.max(0, providerPayouts - paidWithdrawals);

  return {
    users: usersCount,
    bookings: bookingSummary.count || 0,
    paidBookings: bookingSummary.paidBookings || 0,
    grossRevenue: bookingSummary.grossRevenue || 0,
    platformFees: bookingSummary.platformFees || 0,
    providerPayouts,
    walletEarned,
    usersAvailableBalance,
    pendingWithdrawals,
    paidWithdrawals,
    withdrawalHolds: Math.max(walletWithdrawalHold, bookingWithdrawalHold),
  };
};


const isAdminPasswordIsValid = async(password) =>{
    if(process.env.ADMIN_PASSWORD_HASH){
        return bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH)
    }

    return password === process.env.ADMIN_PASSWORD
}

export const loginAdmin = async(req,res)=>{
    try {
        const {email, password} = req.body
        const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase().trim()

        if(!adminEmail || (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_PASSWORD_HASH)){
            return res.status(503).json({message: "admin login is not configure"})

        }

        if(!email || !password || email.toLowerCase().trim()!== adminEmail){
            return res.status(401).json({message: "Invalid admin credentials"})

        }
        const passwordValid = await isAdminPasswordIsValid(password)
        if(!passwordValid){
            return res.status(401).json({message: "Invalid admin credentials"})
        }
        res.json({
            message: "admin logged in successfully",
            token: createAdminToken(adminEmail),
            admin: {email: adminEmail}
        })
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message})
    }
}