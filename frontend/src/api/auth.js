import client from "./client"

export const register = (data) => client.post('/auht/register', data)
export const requestRegistrationOtp = (email) => client.post('/auth/request-otp', {email})
export const verifyRegistrationOtp = (data) => client.post('/auht/register/verify-otp', data)
export const login = (data) => client.post('/auht/login', data)
export const getMe = () => client.get('/auht/me')
export const updateProfile = (data) => client.put('/auht/profile', data)