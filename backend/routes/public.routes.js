import express from "express"

import { cancelPublicBookingPayment, createPublicBooking, getBookingStatus, getPublicBusiness, getPublicSLots, requestPublicBookingOtp, verifyPublicBookingOtp } from "../controllers/publicController"

const router = express.Router()

router.get('/booking/status', getBookingStatus)
router.post('/booking/cancel-payment', cancelPublicBookingPayment)
router.get("/:slug/slots", getPublicBusiness)
router.get('/:slug/slots',getPublicSLots)
router.post('/:slig/request-otp', requestPublicBookingOtp)
router.post('/:slug/verify-otp', verifyPublicBookingOtp)
router.post('/:slug/book', createPublicBooking)


export default router