import express from "express"
import { getPaymentOverview, requestWithdrawal, updatePayoutDetails } from "../controllers/bookingController.js"
import auth from "../middleware/auth.js"

const router = express.router()

router.get('/', auth, getPaymentOverview)
router.get('payout-details', auth, updatePayoutDetails)
router.get('/withdrawls', auth, requestWithdrawal)


export default router