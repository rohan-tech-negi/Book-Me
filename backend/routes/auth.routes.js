import express from "express"

import { getMe, loginUser, registerUser, requestRegistrationOTP, updateProfile, verifyRegistrationOtp } from "../controllers/authController.js"

import auth from "../middleware/auth.js"

const router = express.Roiter()

router.post('/register', registerUser)
